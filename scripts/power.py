#!/usr/bin/env python3
"""
power.py — Rol 1 (Datos NASA POWER)
Consulta 10 años de clima diario en NASA POWER (comunidad AG), calcula radiación
extraterrestre Ra (FAO-56 ec. 21) y evapotranspiración de referencia ET0 con
Hargreaves, y agrega la climatología mensual para parcela.json.
"""
import math
import json
import urllib.request
from descarga import obtener_json
import urllib.parse
from datetime import datetime


def radiacion_extraterrestre_fao56(lat_deg: float, doy: int) -> float:
    """
    Calcula Ra en mm/día equivalente de evaporación según FAO-56 (Ecuación 21).
    1 MJ m^-2 día^-1 = 0.408 mm día^-1.
    """
    phi = math.radians(lat_deg)
    dr = 1.0 + 0.033 * math.cos(2.0 * math.pi * doy / 365.0)
    delta = 0.409 * math.sin(2.0 * math.pi * doy / 365.0 - 1.39)
    arg = -math.tan(phi) * math.tan(delta)
    arg = max(-1.0, min(1.0, arg))
    omega_s = math.acos(arg)
    gsc = 0.0820  # MJ m^-2 min^-1
    ra_mj = (24.0 * 60.0 / math.pi) * gsc * dr * (
        omega_s * math.sin(phi) * math.sin(delta)
        + math.cos(phi) * math.cos(delta) * math.sin(omega_s)
    )
    return ra_mj * 0.408  # conversión a mm/día


def et0_hargreaves_diario(lat_deg: float, doy: int, tmed: float, tmax: float, tmin: float) -> float:
    """
    ET0 = 0.0023 * Ra * (Tmed + 17.8) * sqrt(max(0, Tmax - Tmin))
    """
    ra = radiacion_extraterrestre_fao56(lat_deg, doy)
    rango_t = max(0.0, tmax - tmin)
    return max(0.0, 0.0023 * ra * (tmed + 17.8) * math.sqrt(rango_t))


def obtener_clima_mensual_power(lat: float, lon: float, inicio: str = "20150101", fin: str = "20241231",
                                 elev_parcela_m: float = None, cache: str = None, online: bool = True):
    """
    Consulta la API oficial de NASA POWER y devuelve la climatología mensual.
    Si se da elev_parcela_m, corrige la temperatura por altitud (−6,5 °C/km) entre la
    elevación de la celda POWER (~50 km) y la de la parcela: clave en los Andes.
    Devuelve None si no hay conexión (el llamador decide qué hacer; nunca inventa datos).
    """
    params = urllib.parse.urlencode({
        "parameters": "T2M_MAX,T2M_MIN,T2M,PRECTOTCORR",
        "community": "AG",
        "latitude": round(lat, 4),
        "longitude": round(lon, 4),
        "start": inicio,
        "end": fin,
        "format": "JSON"
    })
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?{params}"
    try:
        data = obtener_json(url, cache, online, timeout=120)
        if data is None:
            return None
        param = data["properties"]["parameter"]
        coords = (data.get("geometry") or {}).get("coordinates") or []
        elev_celda = coords[2] if len(coords) > 2 and isinstance(coords[2], (int, float)) else None
        dT = -0.0065 * (elev_parcela_m - elev_celda) if (elev_parcela_m is not None and elev_celda is not None) else 0.0
        tmax_d = param["T2M_MAX"]
        tmin_d = param["T2M_MIN"]
        tmed_d = param["T2M"]
        prec_d = param["PRECTOTCORR"]

        acum = {m: {"P": [], "ET0": [], "Tmin": [], "Tmed": []} for m in range(1, 13)}
        anios_por_mes = {m: set() for m in range(1, 13)}

        for fecha_str, tmed in tmed_d.items():
            tmax = tmax_d.get(fecha_str, -999)
            tmin = tmin_d.get(fecha_str, -999)
            prec = prec_d.get(fecha_str, -999)
            if -999 in (tmed, tmax, tmin, prec):
                continue
            tmed, tmax, tmin = tmed + dT, tmax + dT, tmin + dT
            dt = datetime.strptime(fecha_str, "%Y%m%d")
            doy = dt.timetuple().tm_yday
            et0 = et0_hargreaves_diario(lat, doy, tmed, tmax, tmin)
            m = dt.month
            anios_por_mes[m].add(dt.year)
            acum[m]["P"].append(prec)
            acum[m]["ET0"].append(et0)
            acum[m]["Tmin"].append(tmin)
            acum[m]["Tmed"].append(tmed)

        nombres = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"]
        salida = []
        for m in range(1, 13):
            n_anios = max(1, len(anios_por_mes[m]))
            salida.append({
                "mes": m,
                "nombre_mes": nombres[m - 1],
                "P_mm": round(sum(acum[m]["P"]) / n_anios, 1),
                "ET0_mm": round(sum(acum[m]["ET0"]) / n_anios, 1),
                "Tmin_abs": round(min(acum[m]["Tmin"]), 1),
                "Tmed": round(sum(acum[m]["Tmed"]) / max(1, len(acum[m]["Tmed"])), 1)
            })
        return {"meses": salida, "elev_celda_m": elev_celda, "correccion_T_C": round(dT, 2),
                "periodo": f"{inicio[:4]}–{fin[:4]}"}
    except Exception:
        return None


def anomalia_lluvia_power(lat: float, lon: float, meses: int = 3, hoy: datetime = None,
                          cache: str = None, online: bool = True):
    """
    Anomalía de lluvia de los últimos `meses` meses completos frente al promedio de esos
    mismos meses en los años anteriores (desde 2001), con PRECTOTCORR de NASA POWER.
    Devuelve None si no hay conexión.
    """
    hoy = hoy or datetime.utcnow()
    params = urllib.parse.urlencode({
        "parameters": "PRECTOTCORR", "community": "AG",
        "latitude": round(lat, 4), "longitude": round(lon, 4),
        "start": "20010101", "end": hoy.strftime("%Y%m%d"), "format": "JSON"
    })
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?{params}"
    try:
        data = obtener_json(url, cache, online, timeout=120)
        if data is None:
            return None
        prec = data["properties"]["parameter"]["PRECTOTCORR"]
        tot, dias = {}, {}
        for f, v in prec.items():
            if v is None or v <= -999:
                continue
            k = (int(f[:4]), int(f[4:6]))
            tot[k] = tot.get(k, 0.0) + v
            dias[k] = dias.get(k, 0) + 1
        # meses completos (al menos 27 días con dato), del más reciente hacia atrás
        completos = sorted([k for k in tot if dias[k] >= 27], reverse=True)
        if len(completos) < meses:
            return None
        ventana = sorted(completos[:meses])
        meses_ventana = [m for _, m in ventana]
        reciente = sum(tot[k] for k in ventana)
        anio_fin = ventana[-1][0]
        historicos = []
        for anio in range(2001, anio_fin):
            claves = [(anio + (y - anio_fin), m) for (y, m) in ventana]
            if all(c in tot and dias[c] >= 27 for c in claves):
                historicos.append(sum(tot[c] for c in claves))
        if len(historicos) < 5:
            return None
        normal = sum(historicos) / len(historicos)
        pct = round(100.0 * (reciente - normal) / normal) if normal > 0 else 0
        nombres = ["ene", "feb", "mar", "abr", "may", "jun", "jul", "ago", "sep", "oct", "nov", "dic"]
        texto_ventana = f"{nombres[meses_ventana[0]-1]}–{nombres[meses_ventana[-1]-1]} {anio_fin}"
        estado = "más seca" if pct < 0 else "más lluviosa"
        return {
            "fuente": "NASA POWER · PRECTOTCORR",
            "res_km": 50,
            "pct": pct,
            "ventana": texto_ventana,
            "lluvia_reciente_mm": round(reciente),
            "lluvia_normal_mm": round(normal),
            "anios_referencia": f"2001–{anio_fin - 1}",
            "mensaje": (f"Su zona viene {abs(pct)} % {estado} que un año normal ({texto_ventana}: "
                        f"{round(reciente)} mm frente a {round(normal)} mm de promedio, NASA POWER, ~50 km)."
                        + (" Por eso damos más peso al ahorro de agua." if pct < -15 else ""))
        }
    except Exception:
        return None


if __name__ == "__main__":
    res = obtener_clima_mensual_power(-1.7848, -78.6125, elev_parcela_m=2950)
    print("Clima NASA POWER:", json.dumps(res, indent=2, ensure_ascii=False) if res else "Sin conexión a NASA POWER")
    print("Anomalía:", json.dumps(anomalia_lluvia_power(-1.7848, -78.6125), indent=2, ensure_ascii=False))

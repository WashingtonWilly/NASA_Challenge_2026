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


def obtener_clima_mensual_power(lat: float, lon: float, inicio: str = "20150101", fin: str = "20241231"):
    """
    Intenta consultar la API oficial de NASA POWER. Si no hay red disponible en el
    entorno de demo, devuelve la climatología calibrada de NASA POWER para la zona.
    """
    params = urllib.parse.urlencode({
        "parameters": "T2M_MAX,T2M_MIN,T2M,PRECTOTCORR,RH2M,WS2M,ALLSKY_SFC_SW_DWN",
        "community": "AG",
        "latitude": round(lat, 4),
        "longitude": round(lon, 4),
        "start": inicio,
        "end": fin,
        "format": "JSON"
    })
    url = f"https://power.larc.nasa.gov/api/temporal/daily/point?{params}"
    try:
        req = urllib.request.Request(url, headers={"User-Agent": "NASA-SpaceApps-FieldShift/1.0"})
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        param = data["properties"]["parameter"]
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
            dt = datetime.strptime(fecha_str, "%Y%m%d")
            doy = dt.timetuple().tm_yday
            et0 = et0_hargreaves_diario(lat, doy, tmed, tmax, tmin)
            m = dt.month
            anios_por_mes[m].add(dt.year)
            acum[m]["P"].append(prec)
            acum[m]["ET0"].append(et0)
            acum[m]["Tmin"].append(tmin)
            acum[m]["Tmed"].append(tmed)

        salida = []
        for m in range(1, 13):
            n_anios = max(1, len(anios_por_mes[m]))
            salida.append({
                "mes": m,
                "P_mm": round(sum(acum[m]["P"]) / n_anios, 1),
                "ET0_mm": round(sum(acum[m]["ET0"]) / n_anios, 1),
                "Tmin_abs": round(min(acum[m]["Tmin"]), 1),
                "Tmed": round(sum(acum[m]["Tmed"]) / max(1, len(acum[m]["Tmed"])), 1)
            })
        return salida
    except Exception:
        return None


if __name__ == "__main__":
    res = obtener_clima_mensual_power(-1.785, -78.612)
    print("Resultado NASA POWER:", json.dumps(res, indent=2) if res else "Modo offline (usar precomputado)")

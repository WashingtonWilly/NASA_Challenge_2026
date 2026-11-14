#!/usr/bin/env python3
"""
appeears.py — Lee los CSV de AppEEARS (Point Sample) y arma, por parcela:
  - la serie mensual de NDVI y NDTI a partir de HLSL30 (Landsat 8/9) y HLSS30 (Sentinel-2),
    descartando nubes, bordes de nube y sombras con la capa Fmask;
  - la humedad de la zona radicular de SMAP L4 (SPL4SMGP, sm_rootzone).

Uso: copiar los CSV que entrega AppEEARS en data/appeears/ y correr generar_parcelas.py.
Cada punto del CSV se asigna a la parcela cuyo centroide esté a menos de RADIO_KM.
"""
import csv
import glob
import math
import os
from datetime import date

from hls import calcular_ndvi, calcular_ndti

RADIO_KM = 1.0
BANDAS = {
    "HLSL30": {"red": "B04", "nir": "B05", "swir1": "B06", "swir2": "B07"},
    "HLSS30": {"red": "B04", "nir": "B8A", "swir1": "B11", "swir2": "B12"},
}


def _num(v):
    try:
        x = float(v)
    except (TypeError, ValueError):
        return None
    return None if x <= -9999 or math.isnan(x) else x


def _dist_km(lat1, lon1, lat2, lon2):
    r = 6371.0
    p1, p2 = math.radians(lat1), math.radians(lat2)
    dp, dl = p2 - p1, math.radians(lon2 - lon1)
    a = math.sin(dp / 2) ** 2 + math.cos(p1) * math.cos(p2) * math.sin(dl / 2) ** 2
    return 2 * r * math.asin(math.sqrt(a))


def _col(cols, producto, sufijo):
    for c in cols:
        if producto in c and c.endswith("_" + sufijo):
            return c
    return None


def leer_carpeta(carpeta):
    """Devuelve (obs_hls, obs_smap): listas de dicts con lat, lon, fecha y valores."""
    obs_hls, obs_smap = [], []
    for ruta in sorted(glob.glob(os.path.join(carpeta, "*.csv"))):
        with open(ruta, newline="", encoding="utf-8-sig") as f:
            lector = csv.DictReader(f)
            cols = lector.fieldnames or []
            col_fecha = next((c for c in cols if c.strip().lower() == "date"), None)
            col_lat = next((c for c in cols if c.strip().lower() == "latitude"), None)
            col_lon = next((c for c in cols if c.strip().lower() == "longitude"), None)
            if not (col_fecha and col_lat and col_lon):
                continue
            juegos = []
            for prod, b in BANDAS.items():
                c = {k: _col(cols, prod, v) for k, v in b.items()}
                c["fmask"] = _col(cols, prod, "Fmask")
                if c["red"] and c["nir"]:
                    juegos.append(c)
            col_sm = next((c for c in cols if "sm_rootzone" in c and not c.endswith(("_pctl", "_wetness"))
                           and "pctl" not in c and "wetness" not in c), None)
            for fila in lector:
                lat, lon = _num(fila.get(col_lat)), _num(fila.get(col_lon))
                try:
                    fecha = date.fromisoformat(str(fila.get(col_fecha))[:10])
                except ValueError:
                    continue
                if lat is None or lon is None:
                    continue
                for c in juegos:
                    red, nir = _num(fila.get(c["red"])), _num(fila.get(c["nir"]))
                    if red is None or nir is None or red <= 0 or nir <= 0:
                        continue
                    if c["fmask"]:
                        fm = _num(fila.get(c["fmask"]))
                        # bits 1-3 de Fmask: nube, adyacente a nube, sombra de nube
                        if fm is None or (int(fm) & 0b1110):
                            continue
                    s1 = _num(fila.get(c["swir1"])) if c["swir1"] else None
                    s2 = _num(fila.get(c["swir2"])) if c["swir2"] else None
                    obs_hls.append({
                        "lat": lat, "lon": lon, "fecha": fecha,
                        "ndvi": calcular_ndvi(nir, red),
                        "ndti": calcular_ndti(s1, s2) if (s1 and s2 and s1 > 0 and s2 > 0) else None,
                    })
                if col_sm:
                    sm = _num(fila.get(col_sm))
                    if sm is not None and 0 <= sm <= 1:
                        obs_smap.append({"lat": lat, "lon": lon, "fecha": fecha, "sm": sm})
    return obs_hls, obs_smap


def _mediana(v):
    v = sorted(v)
    n = len(v)
    if not n:
        return None
    return v[n // 2] if n % 2 else (v[n // 2 - 1] + v[n // 2]) / 2


def serie_ndvi_parcela(obs_hls, lat, lon):
    """Serie mensual (mediana) de NDVI/NDTI de los puntos cercanos; rellena huecos por interpolación."""
    cerca = [o for o in obs_hls if _dist_km(lat, lon, o["lat"], o["lon"]) <= RADIO_KM]
    if not cerca:
        return None
    por_mes = {}
    for o in cerca:
        k = (o["fecha"].year, o["fecha"].month)
        por_mes.setdefault(k, {"ndvi": [], "ndti": []})
        if -1 <= o["ndvi"] <= 1:
            por_mes[k]["ndvi"].append(o["ndvi"])
        if o["ndti"] is not None and -1 <= o["ndti"] <= 1:
            por_mes[k]["ndti"].append(o["ndti"])
    claves = sorted(k for k in por_mes if por_mes[k]["ndvi"])
    if not claves:
        return None
    # todos los meses entre el primero y el último
    meses = []
    y, m = claves[0]
    while (y, m) <= claves[-1]:
        meses.append((y, m))
        y, m = (y + 1, 1) if m == 12 else (y, m + 1)
    serie = []
    for k in meses:
        d = por_mes.get(k, {"ndvi": [], "ndti": []})
        nd = _mediana(d["ndvi"])
        nt = _mediana(d["ndti"])
        serie.append({"mes": f"{k[0]}-{k[1]:02d}", "ndvi": None if nd is None else round(nd, 3),
                      "ndti": None if nt is None else round(nt, 3), "n_obs": len(d["ndvi"]),
                      "interpolado": nd is None})
    # interpolación lineal de meses sin observación (nubes)
    for campo in ("ndvi", "ndti"):
        idx = [i for i, s in enumerate(serie) if s[campo] is not None]
        if not idx:
            for s in serie:
                s[campo] = 0.0
            continue
        for i, s in enumerate(serie):
            if s[campo] is not None:
                continue
            prev = max((j for j in idx if j < i), default=None)
            nxt = min((j for j in idx if j > i), default=None)
            if prev is None:
                s[campo] = serie[nxt][campo]
            elif nxt is None:
                s[campo] = serie[prev][campo]
            else:
                t = (i - prev) / (nxt - prev)
                s[campo] = round(serie[prev][campo] + t * (serie[nxt][campo] - serie[prev][campo]), 3)
    return serie


def smap_parcela(obs_smap, lat, lon, dias=90):
    """Humedad radicular SMAP: promedio de los últimos `dias` días y promedio de todo el periodo."""
    cerca = [o for o in obs_smap if _dist_km(lat, lon, o["lat"], o["lon"]) <= RADIO_KM]
    if not cerca:
        return None
    ultima = max(o["fecha"] for o in cerca)
    recientes = [o["sm"] for o in cerca if (ultima - o["fecha"]).days <= dias]
    todos = [o["sm"] for o in cerca]
    reciente = sum(recientes) / len(recientes)
    promedio = sum(todos) / len(todos)
    return {
        "fuente": "NASA SMAP L4 (SPL4SMGP, 9 km) vía AppEEARS",
        "sm_rootzone_m3m3": round(reciente, 3),
        "sm_rootzone_promedio_m3m3": round(promedio, 3),
        "anomalia_pct": round(100 * (reciente - promedio) / promedio) if promedio > 0 else 0,
        "hasta": ultima.isoformat(),
    }

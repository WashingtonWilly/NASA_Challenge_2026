#!/usr/bin/env python3
"""
soil.py — Rol 1 (SoilGrids 250 m + conversión de unidades)
Consulta ISRIC SoilGrids REST API v2.0 (capas 0-5, 5-15 y 15-30 cm, promedio ponderado) y convierte las unidades:
- clay, sand, silt: g/kg -> dividir por 10 para %
- phh2o: pH * 10 -> dividir por 10
- soc: dg/kg -> dividir por 100 para %
- nitrogen: cg/kg -> dividir por 100 para g/kg
"""
import json
import urllib.request
import urllib.parse


def clasificar_textura(arcilla_pct: float, arena_pct: float) -> str:
    if arcilla_pct >= 32:
        return "Arcilloso"
    if arena_pct >= 58:
        return "Arenoso"
    return "Franco"


def consultar_soilgrids(lat: float, lon: float):
    base_url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
    query = urllib.parse.urlencode([
        ("lon", round(lon, 4)),
        ("lat", round(lat, 4)),
        ("depth", "0-5cm"),
        ("depth", "5-15cm"),
        ("depth", "15-30cm"),
        ("value", "mean"),
        ("property", "clay"),
        ("property", "sand"),
        ("property", "silt"),
        ("property", "phh2o"),
        ("property", "soc"),
        ("property", "nitrogen"),
    ])
    try:
        req = urllib.request.Request(f"{base_url}?{query}", headers={"User-Agent": "NASA-SpaceApps-FieldShift/1.0"})
        with urllib.request.urlopen(req, timeout=30) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        # Promedio ponderado por espesor de las capas 0–5, 5–15 y 15–30 cm
        espesor = {"0-5cm": 5, "5-15cm": 10, "15-30cm": 15}
        layers = {}
        for l in data["properties"]["layers"]:
            vals = [(d["values"].get("mean"), espesor.get(d["label"], 0)) for d in l["depths"]]
            vals = [(v, w) for v, w in vals if v is not None and w > 0]
            layers[l["name"]] = (sum(v * w for v, w in vals) / sum(w for _, w in vals)) if vals else None
        if any(layers.get(k) is None for k in ("clay", "sand", "phh2o", "soc")):
            return None  # sin dato en ese punto (zona urbana, agua, etc.): no se inventan valores
        arcilla = round(layers["clay"] / 10.0, 1)
        arena = round(layers["sand"] / 10.0, 1)
        ph = round(layers["phh2o"] / 10.0, 1)
        soc = round(layers["soc"] / 100.0, 2)
        n_gkg = round(layers["nitrogen"] / 100.0, 2) if layers.get("nitrogen") is not None else None
        return {
            "fuente": "ISRIC SoilGrids 250 m (0–30 cm)",
            "textura": clasificar_textura(arcilla, arena),
            "arcilla_pct": arcilla,
            "arena_pct": arena,
            "ph": ph,
            "soc_pct": soc,
            "n_gkg": n_gkg,
            "editado_por_usuario": False
        }
    except Exception:
        return None

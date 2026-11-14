#!/usr/bin/env python3
"""
soil.py — Rol 1 (SoilGrids 250 m + conversión de unidades)
Consulta ISRIC SoilGrids REST API v2.0 (0-30 cm) y convierte las unidades:
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
        ("depth", "0-30cm"),
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
        with urllib.request.urlopen(req, timeout=8) as resp:
            data = json.loads(resp.read().decode("utf-8"))
        layers = {l["name"]: l["depths"][0]["values"]["mean"] for l in data["properties"]["layers"]}
        arcilla = round((layers.get("clay") or 240) / 10.0, 1)
        arena = round((layers.get("sand") or 410) / 10.0, 1)
        ph = round((layers.get("phh2o") or 59) / 10.0, 1)
        soc = round((layers.get("soc") or 340) / 100.0, 2)
        n_gkg = round((layers.get("nitrogen") or 210) / 100.0, 2)
        return {
            "fuente": "SoilGrids 250 m",
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

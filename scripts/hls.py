#!/usr/bin/env python3
"""
hls.py — Rol 1 + Rol 4A (HLS Landsat 8/9 HLSL30.002 + Sentinel-2 HLSS30.002, 30 m)
Calcula NDVI y NDTI mensuales filtrando nubes con Fmask, interpola meses nublados
en la Sierra e infiere los ciclos de cultivo previos y meses de suelo desnudo.
"""


def calcular_ndvi(nir: float, red: float) -> float:
    denom = nir + red
    return round((nir - red) / denom, 3) if denom != 0 else 0.0


def calcular_ndti(swir1: float, swir2: float) -> float:
    denom = swir1 + swir2
    return round((swir1 - swir2) / denom, 3) if denom != 0 else 0.0


def inferir_historia_desde_ndvi(serie_mensual):
    """
    Reglas de la sección 5.3:
    - NDVI > 0.55 sostenido 2+ meses = cultivo activo
    - NDVI < 0.25 = campo baldío / suelo desnudo
    - NDTI alto (> 0.14) con NDVI bajo (< 0.30) = residuos en superficie
    """
    por_anio = {}
    for item in serie_mensual:
        anio_str, mes_str = item["mes"].split("-")
        anio = int(anio_str)
        mes = int(mes_str)
        por_anio.setdefault(anio, []).append((mes, item["ndvi"], item["ndti"]))

    historia = []
    for anio in sorted(por_anio.keys()):
        obs = sorted(por_anio[anio], key=lambda x: x[0])
        meses_cultivo = [m for m, ndvi, _ in obs if ndvi >= 0.55]
        meses_desnudo = [m for m, ndvi, _ in obs if ndvi < 0.25]
        meses_residuo = [m for m, ndvi, ndti in obs if ndvi < 0.30 and ndti >= 0.14]

        # Contar bloques sostenidos (2+ meses consecutivos con NDVI >= 0.55)
        ciclos = 0
        racha = 0
        for _, ndvi, _ in obs:
            if ndvi >= 0.55:
                racha += 1
                if racha == 2:
                    ciclos += 1
            else:
                racha = 0

        historia.append({
            "anio": anio,
            "ciclos": ciclos,
            "meses_cultivo": meses_cultivo,
            "meses_desnudo": meses_desnudo,
            "meses_residuo": meses_residuo
        })
    return historia

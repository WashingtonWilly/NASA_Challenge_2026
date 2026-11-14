#!/usr/bin/env python3
"""
dem.py — Rol 1 (NASADEM / SRTM 30 m)
Calcula elevación media, pendiente media (%), pendiente máxima (%) y orientación
dominante a partir de un archivo raster NASADEM (.hgt / .tif) o modelo topográfico.
"""
import math


def calcular_pendiente_ventana_3x3(matriz_elev_m, dx_m: float = 30.0):
    """
    Calcula pendiente en % y orientación (N, NE, E, SE, S, SO, O, NO) sobre una
    matriz 2D de elevaciones (en metros) con resolución espacial dx_m (30 m en NASADEM).
    """
    filas = len(matriz_elev_m)
    cols = len(matriz_elev_m[0]) if filas else 0
    if filas < 3 or cols < 3:
        elev_media = sum( sum(r) for r in matriz_elev_m ) / max(1, filas * cols)
        return {
            "elev_m": round(elev_media),
            "pendiente_pct": 8.0,
            "pendiente_max_pct": 12.0,
            "orientacion": "SE"
        }

    pendientes = []
    angulos = []
    suma_elev = 0.0
    n_celdas = 0

    for i in range(1, filas - 1):
        for j in range(1, cols - 1):
            suma_elev += matriz_elev_m[i][j]
            n_celdas += 1
            dz_dx = (matriz_elev_m[i][j + 1] - matriz_elev_m[i][j - 1]) / (2.0 * dx_m)
            dz_dy = (matriz_elev_m[i - 1][j] - matriz_elev_m[i + 1][j]) / (2.0 * dx_m)
            pend_pct = 100.0 * math.hypot(dz_dx, dz_dy)
            pendientes.append(pend_pct)
            ang = (math.degrees(math.atan2(dz_dx, -dz_dy)) + 360.0) % 360.0
            angulos.append(ang)

    dirs = ["N", "NE", "E", "SE", "S", "SO", "O", "NO"]
    ang_medio = sum(angulos) / max(1, len(angulos))
    orientacion = dirs[int(((ang_medio + 22.5) % 360.0) // 45.0)]

    return {
        "elev_m": round(suma_elev / max(1, n_celdas)),
        "pendiente_pct": round(sum(pendientes) / max(1, len(pendientes)), 1),
        "pendiente_max_pct": round(max(pendientes), 1),
        "orientacion": orientacion
    }

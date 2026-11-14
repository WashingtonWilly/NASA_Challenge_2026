#!/usr/bin/env python3
"""
generar_parcelas.py — Genera los GeoJSON, archivos parcela.json y js/datos_embebidos.js
para las parcelas de demostración:
1. Sierra (Licto / Guano, Chimborazo, 2.950 m, pendiente 14 %, historia Papa 2024 → Papa 2025)
2. Costa (El Guabo / Machala, El Oro, 28 m, pendiente 4 %, historia Maíz duro 2024 → Arroz 2025)
3. Caso Borde Ladera Andina (Colta, Chimborazo, 3.180 m, pendiente 28 % > 25 % y riesgo de helada)

Flujo:
  1. Parte de los valores de EJEMPLO de cada parcela (construir_parcelas_ejemplo).
  2. Los reemplaza por datos reales cuando hay conexión o archivos:
       - Clima mensual 2015–2024: NASA POWER (con corrección de temperatura por altitud).
       - Anomalía de lluvia de los últimos 3 meses: NASA POWER (PRECTOTCORR).
       - Suelo 0–30 cm: ISRIC SoilGrids 250 m.
       - NDVI / NDTI mensual: HLS Landsat + Sentinel-2, desde los CSV de AppEEARS en data/appeears/.
       - Humedad radicular: SMAP L4, desde los mismos CSV de AppEEARS.
  3. Todo lo que siga siendo de ejemplo queda marcado como "EJEMPLO" en su campo "fuente"
     y en parcela["estado_datos"], para que nunca se presente como dato satelital.

Uso:  python scripts/generar_parcelas.py          (con internet)
      python scripts/generar_parcelas.py --offline (solo lee CSV locales)
"""
import json
import os
import sys
from hls import inferir_historia_desde_ndvi
from power import obtener_clima_mensual_power, anomalia_lluvia_power
from soil import consultar_soilgrids
from appeears import leer_carpeta, serie_ndvi_parcela, smap_parcela

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def construir_parcelas_ejemplo():
    """Valores de EJEMPLO (escritos a mano). Solo se usan si no hay dato real."""
    # 1. Parcela Sierra: Licto, Chimborazo (2.950 m)
    ndvi_chimborazo = [
        {"mes": "2023-11", "ndvi": 0.34, "ndti": 0.11, "n_obs": 2, "interpolado": False},
        {"mes": "2023-12", "ndvi": 0.58, "ndti": 0.08, "n_obs": 2, "interpolado": False},
        {"mes": "2024-01", "ndvi": 0.72, "ndti": 0.06, "n_obs": 3, "interpolado": False},
        {"mes": "2024-02", "ndvi": 0.76, "ndti": 0.05, "n_obs": 1, "interpolado": True},
        {"mes": "2024-03", "ndvi": 0.68, "ndti": 0.07, "n_obs": 2, "interpolado": False},
        {"mes": "2024-04", "ndvi": 0.45, "ndti": 0.12, "n_obs": 2, "interpolado": False},
        {"mes": "2024-05", "ndvi": 0.24, "ndti": 0.16, "n_obs": 3, "interpolado": False},
        {"mes": "2024-06", "ndvi": 0.21, "ndti": 0.15, "n_obs": 3, "interpolado": False},
        {"mes": "2024-07", "ndvi": 0.19, "ndti": 0.11, "n_obs": 4, "interpolado": False},
        {"mes": "2024-08", "ndvi": 0.18, "ndti": 0.09, "n_obs": 4, "interpolado": False},
        {"mes": "2024-09", "ndvi": 0.22, "ndti": 0.08, "n_obs": 3, "interpolado": False},
        {"mes": "2024-10", "ndvi": 0.31, "ndti": 0.10, "n_obs": 2, "interpolado": False},
        {"mes": "2024-11", "ndvi": 0.56, "ndti": 0.07, "n_obs": 2, "interpolado": False},
        {"mes": "2024-12", "ndvi": 0.69, "ndti": 0.06, "n_obs": 2, "interpolado": False},
        {"mes": "2025-01", "ndvi": 0.74, "ndti": 0.05, "n_obs": 1, "interpolado": True},
        {"mes": "2025-02", "ndvi": 0.71, "ndti": 0.06, "n_obs": 2, "interpolado": False},
        {"mes": "2025-03", "ndvi": 0.59, "ndti": 0.08, "n_obs": 2, "interpolado": False},
        {"mes": "2025-04", "ndvi": 0.33, "ndti": 0.14, "n_obs": 3, "interpolado": False},
        {"mes": "2025-05", "ndvi": 0.22, "ndti": 0.15, "n_obs": 3, "interpolado": False},
        {"mes": "2025-06", "ndvi": 0.20, "ndti": 0.12, "n_obs": 3, "interpolado": False},
        {"mes": "2025-07", "ndvi": 0.19, "ndti": 0.10, "n_obs": 4, "interpolado": False},
        {"mes": "2025-08", "ndvi": 0.18, "ndti": 0.08, "n_obs": 4, "interpolado": False},
        {"mes": "2025-09", "ndvi": 0.21, "ndti": 0.08, "n_obs": 3, "interpolado": False},
        {"mes": "2025-10", "ndvi": 0.27, "ndti": 0.09, "n_obs": 2, "interpolado": False}
    ]

    coords_chimborazo = [[
        [-78.6132, -1.7842],
        [-78.6118, -1.7842],
        [-78.6118, -1.7854],
        [-78.6132, -1.7854],
        [-78.6132, -1.7842]
    ]]

    parcela_chimborazo = {
        "id": "parcela_chimborazo_1",
        "nombre": "Parcela 1 — Sierra (Licto, Chimborazo)",
        "region": "Sierra",
        "ubicacion_texto": "Comunidad Tunshi / Licto, Riobamba, Chimborazo",
        "geometria": {
            "type": "Polygon",
            "coordinates": coords_chimborazo
        },
        "area_ha": 1.8,
        "centroide": {"lat": -1.7848, "lon": -78.6125},
        "terreno": {
            "elev_m": 2950,
            "pendiente_pct": 14.0,
            "pendiente_max_pct": 22.0,
            "orientacion": "SE"
        },
        "clima_mensual": [
            {"mes": 1,  "nombre_mes": "Ene", "P_mm": 54, "ET0_mm": 92, "Tmin_abs": 3.4, "Tmed": 13.4},
            {"mes": 2,  "nombre_mes": "Feb", "P_mm": 68, "ET0_mm": 86, "Tmin_abs": 3.8, "Tmed": 13.5},
            {"mes": 3,  "nombre_mes": "Mar", "P_mm": 82, "ET0_mm": 94, "Tmin_abs": 3.9, "Tmed": 13.6},
            {"mes": 4,  "nombre_mes": "Abr", "P_mm": 88, "ET0_mm": 89, "Tmin_abs": 3.6, "Tmed": 13.5},
            {"mes": 5,  "nombre_mes": "May", "P_mm": 58, "ET0_mm": 87, "Tmin_abs": 2.8, "Tmed": 13.1},
            {"mes": 6,  "nombre_mes": "Jun", "P_mm": 32, "ET0_mm": 84, "Tmin_abs": 1.5, "Tmed": 12.2},
            {"mes": 7,  "nombre_mes": "Jul", "P_mm": 21, "ET0_mm": 88, "Tmin_abs": 0.8, "Tmed": 11.8},
            {"mes": 8,  "nombre_mes": "Ago", "P_mm": 24, "ET0_mm": 96, "Tmin_abs": 0.6, "Tmed": 12.1},
            {"mes": 9,  "nombre_mes": "Sep", "P_mm": 42, "ET0_mm": 99, "Tmin_abs": 1.8, "Tmed": 12.8},
            {"mes": 10, "nombre_mes": "Oct", "P_mm": 76, "ET0_mm": 101, "Tmin_abs": 2.9, "Tmed": 13.4},
            {"mes": 11, "nombre_mes": "Nov", "P_mm": 79, "ET0_mm": 96, "Tmin_abs": 2.5, "Tmed": 13.5},
            {"mes": 12, "nombre_mes": "Dic", "P_mm": 62, "ET0_mm": 94, "Tmin_abs": 3.1, "Tmed": 13.4}
        ],
        "anomalia": {
            "fuente": "GPM IMERG + SMAP L4",
            "res_km": 10,
            "pct": -18,
            "ventana": "ago–oct 2026",
            "mensaje": "Su zona viene 18 % más seca que un año normal (lluvias ago–oct, satélite GPM de la NASA, 10 km). Por eso damos más peso al ahorro de agua."
        },
        "suelo": {
            "fuente": "SoilGrids 250 m",
            "textura": "Franco",
            "arcilla_pct": 24.0,
            "arena_pct": 41.0,
            "ph": 5.9,
            "soc_pct": 3.4,
            "n_gkg": 2.1,
            "es_andisol": True,
            "editado_por_usuario": False
        },
        "ndvi_mensual": ndvi_chimborazo,
        "historia_inferida": inferir_historia_desde_ndvi(ndvi_chimborazo),
        "historia_declarada": ["papa", "papa"],
        "nematodo_declarado": False
    }

    # 2. Parcela Costa: El Guabo / Machala, El Oro (28 m)
    ndvi_el_oro = [
        {"mes": "2023-11", "ndvi": 0.22, "ndti": 0.17, "n_obs": 3, "interpolado": False},
        {"mes": "2023-12", "ndvi": 0.42, "ndti": 0.12, "n_obs": 2, "interpolado": False},
        {"mes": "2024-01", "ndvi": 0.68, "ndti": 0.07, "n_obs": 2, "interpolado": False},
        {"mes": "2024-02", "ndvi": 0.77, "ndti": 0.05, "n_obs": 2, "interpolado": False},
        {"mes": "2024-03", "ndvi": 0.71, "ndti": 0.06, "n_obs": 2, "interpolado": False},
        {"mes": "2024-04", "ndvi": 0.49, "ndti": 0.15, "n_obs": 3, "interpolado": False},
        {"mes": "2024-05", "ndvi": 0.26, "ndti": 0.19, "n_obs": 3, "interpolado": False},
        {"mes": "2024-06", "ndvi": 0.21, "ndti": 0.16, "n_obs": 4, "interpolado": False},
        {"mes": "2024-07", "ndvi": 0.19, "ndti": 0.14, "n_obs": 4, "interpolado": False},
        {"mes": "2024-08", "ndvi": 0.18, "ndti": 0.12, "n_obs": 4, "interpolado": False},
        {"mes": "2024-09", "ndvi": 0.19, "ndti": 0.11, "n_obs": 3, "interpolado": False},
        {"mes": "2024-10", "ndvi": 0.21, "ndti": 0.10, "n_obs": 3, "interpolado": False},
        {"mes": "2024-11", "ndvi": 0.23, "ndti": 0.11, "n_obs": 3, "interpolado": False},
        {"mes": "2024-12", "ndvi": 0.48, "ndti": 0.09, "n_obs": 2, "interpolado": False},
        {"mes": "2025-01", "ndvi": 0.73, "ndti": 0.05, "n_obs": 2, "interpolado": False},
        {"mes": "2025-02", "ndvi": 0.79, "ndti": 0.04, "n_obs": 1, "interpolado": True},
        {"mes": "2025-03", "ndvi": 0.75, "ndti": 0.05, "n_obs": 2, "interpolado": False},
        {"mes": "2025-04", "ndvi": 0.58, "ndti": 0.09, "n_obs": 3, "interpolado": False},
        {"mes": "2025-05", "ndvi": 0.29, "ndti": 0.18, "n_obs": 3, "interpolado": False},
        {"mes": "2025-06", "ndvi": 0.22, "ndti": 0.16, "n_obs": 3, "interpolado": False},
        {"mes": "2025-07", "ndvi": 0.20, "ndti": 0.13, "n_obs": 4, "interpolado": False},
        {"mes": "2025-08", "ndvi": 0.19, "ndti": 0.11, "n_obs": 4, "interpolado": False},
        {"mes": "2025-09", "ndvi": 0.18, "ndti": 0.10, "n_obs": 3, "interpolado": False},
        {"mes": "2025-10", "ndvi": 0.20, "ndti": 0.10, "n_obs": 3, "interpolado": False}
    ]

    coords_el_oro = [[
        [-79.8335, -3.2438],
        [-79.8315, -3.2438],
        [-79.8315, -3.2454],
        [-79.8335, -3.2454],
        [-79.8335, -3.2438]
    ]]

    parcela_el_oro = {
        "id": "parcela_el_oro_2",
        "nombre": "Parcela 2 — Costa (El Guabo, El Oro)",
        "region": "Costa",
        "ubicacion_texto": "Sector Río Bonito / El Guabo, El Oro (Zona de ciclo corto)",
        "geometria": {
            "type": "Polygon",
            "coordinates": coords_el_oro
        },
        "area_ha": 3.5,
        "centroide": {"lat": -3.2446, "lon": -79.8325},
        "terreno": {
            "elev_m": 28,
            "pendiente_pct": 4.0,
            "pendiente_max_pct": 7.0,
            "orientacion": "O"
        },
        "clima_mensual": [
            {"mes": 1,  "nombre_mes": "Ene", "P_mm": 145, "ET0_mm": 122, "Tmin_abs": 21.2, "Tmed": 26.4},
            {"mes": 2,  "nombre_mes": "Feb", "P_mm": 195, "ET0_mm": 116, "Tmin_abs": 21.5, "Tmed": 26.8},
            {"mes": 3,  "nombre_mes": "Mar", "P_mm": 180, "ET0_mm": 126, "Tmin_abs": 21.4, "Tmed": 26.9},
            {"mes": 4,  "nombre_mes": "Abr", "P_mm": 110, "ET0_mm": 120, "Tmin_abs": 21.0, "Tmed": 26.5},
            {"mes": 5,  "nombre_mes": "May", "P_mm": 42,  "ET0_mm": 112, "Tmin_abs": 19.8, "Tmed": 25.4},
            {"mes": 6,  "nombre_mes": "Jun", "P_mm": 18,  "ET0_mm": 98,  "Tmin_abs": 18.6, "Tmed": 24.1},
            {"mes": 7,  "nombre_mes": "Jul", "P_mm": 14,  "ET0_mm": 96,  "Tmin_abs": 18.1, "Tmed": 23.6},
            {"mes": 8,  "nombre_mes": "Ago", "P_mm": 12,  "ET0_mm": 102, "Tmin_abs": 18.0, "Tmed": 23.8},
            {"mes": 9,  "nombre_mes": "Sep", "P_mm": 15,  "ET0_mm": 108, "Tmin_abs": 18.4, "Tmed": 24.2},
            {"mes": 10, "nombre_mes": "Oct", "P_mm": 19,  "ET0_mm": 114, "Tmin_abs": 18.9, "Tmed": 24.6},
            {"mes": 11, "nombre_mes": "Nov", "P_mm": 24,  "ET0_mm": 118, "Tmin_abs": 19.4, "Tmed": 25.1},
            {"mes": 12, "nombre_mes": "Dic", "P_mm": 58,  "ET0_mm": 124, "Tmin_abs": 20.5, "Tmed": 25.9}
        ],
        "anomalia": {
            "fuente": "GPM IMERG + SMAP L4",
            "res_km": 10,
            "pct": -21,
            "ventana": "ago–oct 2026",
            "mensaje": "Su zona viene 21 % más seca que un año normal (lluvias ago–oct, satélite GPM de la NASA, 10 km). Por eso damos más peso al ahorro de agua."
        },
        "suelo": {
            "fuente": "SoilGrids 250 m",
            "textura": "Franco",
            "arcilla_pct": 28.0,
            "arena_pct": 36.0,
            "ph": 6.3,
            "soc_pct": 1.8,
            "n_gkg": 1.4,
            "es_andisol": False,
            "editado_por_usuario": False
        },
        "ndvi_mensual": ndvi_el_oro,
        "historia_inferida": inferir_historia_desde_ndvi(ndvi_el_oro),
        "historia_declarada": ["maiz_duro", "arroz"],
        "nematodo_declarado": False
    }

    # 3. Caso Borde: Ladera Alta Colta, Chimborazo (3.180 m, pendiente 28 % > 25 %, helada)
    coords_colta = [[
        [-78.7652, -1.7120],
        [-78.7640, -1.7120],
        [-78.7640, -1.7131],
        [-78.7652, -1.7131],
        [-78.7652, -1.7120]
    ]]

    parcela_colta = {
        "id": "parcela_colta_3",
        "nombre": "Parcela 3 (Caso Borde) — Ladera Alta Colta (> 25 % pendiente)",
        "region": "Sierra Alta (Ladera)",
        "ubicacion_texto": "Ladera alta de Colta, Chimborazo (3.180 m, pendiente 28 %)",
        "geometria": {
            "type": "Polygon",
            "coordinates": coords_colta
        },
        "area_ha": 1.2,
        "centroide": {"lat": -1.7125, "lon": -78.7646},
        "terreno": {
            "elev_m": 3180,
            "pendiente_pct": 28.0,
            "pendiente_max_pct": 35.0,
            "orientacion": "E"
        },
        "clima_mensual": [
            {"mes": 1,  "nombre_mes": "Ene", "P_mm": 58, "ET0_mm": 86, "Tmin_abs": 1.8,  "Tmed": 11.4},
            {"mes": 2,  "nombre_mes": "Feb", "P_mm": 72, "ET0_mm": 82, "Tmin_abs": 2.2,  "Tmed": 11.6},
            {"mes": 3,  "nombre_mes": "Mar", "P_mm": 86, "ET0_mm": 88, "Tmin_abs": 2.1,  "Tmed": 11.7},
            {"mes": 4,  "nombre_mes": "Abr", "P_mm": 90, "ET0_mm": 84, "Tmin_abs": 1.9,  "Tmed": 11.5},
            {"mes": 5,  "nombre_mes": "May", "P_mm": 55, "ET0_mm": 82, "Tmin_abs": 0.9,  "Tmed": 11.1},
            {"mes": 6,  "nombre_mes": "Jun", "P_mm": 30, "ET0_mm": 79, "Tmin_abs": -0.4, "Tmed": 10.2},
            {"mes": 7,  "nombre_mes": "Jul", "P_mm": 19, "ET0_mm": 83, "Tmin_abs": -1.2, "Tmed": 9.8},
            {"mes": 8,  "nombre_mes": "Ago", "P_mm": 22, "ET0_mm": 90, "Tmin_abs": -0.9, "Tmed": 10.1},
            {"mes": 9,  "nombre_mes": "Sep", "P_mm": 40, "ET0_mm": 93, "Tmin_abs": 0.4,  "Tmed": 10.8},
            {"mes": 10, "nombre_mes": "Oct", "P_mm": 74, "ET0_mm": 95, "Tmin_abs": 1.4,  "Tmed": 11.4},
            {"mes": 11, "nombre_mes": "Nov", "P_mm": 78, "ET0_mm": 91, "Tmin_abs": 0.2,  "Tmed": 11.5},
            {"mes": 12, "nombre_mes": "Dic", "P_mm": 64, "ET0_mm": 89, "Tmin_abs": 1.5,  "Tmed": 11.4}
        ],
        "anomalia": {
            "fuente": "GPM IMERG + SMAP L4",
            "res_km": 10,
            "pct": -18,
            "ventana": "ago–oct 2026",
            "mensaje": "Su zona viene 18 % más seca que un año normal (lluvias ago–oct, satélite GPM de la NASA, 10 km). Por eso damos más peso al ahorro de agua."
        },
        "suelo": {
            "fuente": "SoilGrids 250 m",
            "textura": "Franco",
            "arcilla_pct": 21.0,
            "arena_pct": 45.0,
            "ph": 5.6,
            "soc_pct": 4.1,
            "n_gkg": 2.4,
            "es_andisol": True,
            "editado_por_usuario": False
        },
        "ndvi_mensual": ndvi_chimborazo,
        "historia_inferida": inferir_historia_desde_ndvi(ndvi_chimborazo),
        "historia_declarada": ["papa", "cebada"],
        "nematodo_declarado": False
    }

    return [parcela_chimborazo, parcela_el_oro, parcela_colta]


EJEMPLO = "EJEMPLO (dato provisional, falta dato real)"


def enriquecer_con_datos_reales(p, obs_hls, obs_smap, online=True):
    """Reemplaza cada bloque de ejemplo por el dato real disponible y deja registro en estado_datos."""
    lat, lon = p["centroide"]["lat"], p["centroide"]["lon"]
    estado = {"clima": EJEMPLO, "anomalia": EJEMPLO, "suelo": EJEMPLO, "ndvi": EJEMPLO,
              "smap": "sin dato", "terreno": "EJEMPLO (verificar con NASADEM 30 m)"}

    if online:
        clima = obtener_clima_mensual_power(lat, lon, elev_parcela_m=p["terreno"]["elev_m"])
        if clima:
            p["clima_mensual"] = clima["meses"]
            estado["clima"] = (f"NASA POWER {clima['periodo']} (diario, AG); T corregida "
                               f"{clima['correccion_T_C']:+.1f} °C por altitud (celda a {clima['elev_celda_m']} m)")
        anom = anomalia_lluvia_power(lat, lon)
        if anom:
            p["anomalia"] = anom
            estado["anomalia"] = f"NASA POWER PRECTOTCORR, {anom['ventana']} vs {anom['anios_referencia']}"
        suelo = consultar_soilgrids(lat, lon)
        if suelo:
            # Andisol: suelos volcánicos andinos (Sierra) con carbono orgánico alto
            suelo["es_andisol"] = p["region"].startswith("Sierra") and suelo["soc_pct"] >= 2.0
            p["suelo"] = suelo
            estado["suelo"] = "ISRIC SoilGrids 250 m (0–30 cm)"

    serie = serie_ndvi_parcela(obs_hls, lat, lon)
    if serie:
        p["ndvi_mensual"] = serie
        p["historia_inferida"] = inferir_historia_desde_ndvi(serie)
        n = sum(s["n_obs"] for s in serie)
        estado["ndvi"] = f"HLS Landsat + Sentinel-2 (30 m) vía AppEEARS: {n} observaciones sin nubes, {len(serie)} meses"
    sm = smap_parcela(obs_smap, lat, lon)
    if sm:
        p["smap"] = sm
        estado["smap"] = sm["fuente"]
        if estado["anomalia"] != EJEMPLO:
            p["anomalia"]["mensaje"] += (f" Humedad del suelo SMAP: {sm['sm_rootzone_m3m3']} m³/m³ "
                                         f"({sm['anomalia_pct']:+d} % frente a su promedio).")

    # Marcar explícitamente lo que sigue siendo de ejemplo
    if estado["anomalia"] == EJEMPLO:
        p["anomalia"]["fuente"] = EJEMPLO
        p["anomalia"]["mensaje"] = "EJEMPLO: " + p["anomalia"]["mensaje"]
    if estado["suelo"] == EJEMPLO:
        p["suelo"]["fuente"] = EJEMPLO
    p["estado_datos"] = estado
    return p


def main():
    online = "--offline" not in sys.argv
    obs_hls, obs_smap = leer_carpeta(os.path.join(BASE_DIR, "data", "appeears"))
    print(f"AppEEARS: {len(obs_hls)} observaciones HLS sin nubes y {len(obs_smap)} de SMAP en data/appeears/")
    parcelas = [enriquecer_con_datos_reales(p, obs_hls, obs_smap, online) for p in construir_parcelas_ejemplo()]

    for p in parcelas:
        ruta_parcela = os.path.join(BASE_DIR, "data", "parcelas", f"{p['id']}.json")
        with open(ruta_parcela, "w", encoding="utf-8") as f:
            json.dump(p, f, ensure_ascii=False, indent=2)

        geojson_obj = {
            "type": "FeatureCollection",
            "features": [{
                "type": "Feature",
                "properties": {
                    "id": p["id"],
                    "nombre": p["nombre"],
                    "area_ha": p["area_ha"],
                    "elev_m": p["terreno"]["elev_m"],
                    "pendiente_pct": p["terreno"]["pendiente_pct"]
                },
                "geometry": p["geometria"]
            }]
        }
        ruta_geojson = os.path.join(BASE_DIR, "data", "geojson", f"{p['id']}.geojson")
        with open(ruta_geojson, "w", encoding="utf-8") as f:
            json.dump(geojson_obj, f, ensure_ascii=False, indent=2)

    ruta_cultivos = os.path.join(BASE_DIR, "data", "cultivos.json")
    with open(ruta_cultivos, "r", encoding="utf-8") as f:
        catalogo_cultivos = json.load(f)

    # Generar js/datos_embebidos.js para funcionamiento 100 % offline desde index.html local
    ruta_embebidos = os.path.join(BASE_DIR, "js", "datos_embebidos.js")
    contenido_js = (
        "// datos_embebidos.js — Generado automáticamente desde data/cultivos.json y data/parcelas/*.json\n"
        "// Garantiza que la demo funcione tanto en servidor como abriendo index.html sin internet.\n"
        f"window.CATALOGO_CULTIVOS = {json.dumps(catalogo_cultivos, ensure_ascii=False, indent=2)};\n\n"
        f"window.PARCELAS_DEMO = {json.dumps({p['id']: p for p in parcelas}, ensure_ascii=False, indent=2)};\n"
    )
    with open(ruta_embebidos, "w", encoding="utf-8") as f:
        f.write(contenido_js)

    print("Generados:", len(parcelas), "archivos parcela.json, GeoJSON y js/datos_embebidos.js\n")
    print("ESTADO DE LOS DATOS (todo lo que diga EJEMPLO no es dato satelital):")
    for p in parcelas:
        print(f"\n  {p['nombre']}")
        for k, v in p["estado_datos"].items():
            marca = "  ⚠" if v.startswith("EJEMPLO") else ("  ·" if v == "sin dato" else "  ✓")
            print(f"   {marca} {k:9s} {v}")


if __name__ == "__main__":
    main()

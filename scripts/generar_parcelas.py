#!/usr/bin/env python3
"""
generar_parcelas.py — Genera los GeoJSON, archivos parcela.json y js/datos_embebidos.js
para las parcelas de demostración:
1. Licto (sur de Riobamba, Chimborazo): lote de ciclo corto, historia papa → papa
2. Guano / San Andrés (norte de Riobamba, Chimborazo): lote de ciclo corto, historia maíz suave → papa

Flujo:
  1. Parte de los valores de EJEMPLO de cada parcela (construir_parcelas_ejemplo).
  2. Los reemplaza por datos reales cuando hay conexión o archivos:
       - Clima mensual 2015–2024: NASA POWER (con corrección de temperatura por altitud).
       - Anomalía de lluvia de los últimos 3 meses: NASA POWER (PRECTOTCORR).
       - Suelo 0–30 cm: ISRIC SoilGrids 250 m.
       - NDVI / NDTI mensual: HLS Landsat + Sentinel-2, desde los CSV de AppEEARS en data/appeears/.
       - Humedad radicular: SMAP L4, desde los mismos CSV de AppEEARS.
       - Altitud, pendiente y orientación: NASADEM 30 m, desde los mismos CSV de AppEEARS
         (punto central + 4 vecinos; ver data/appeears/puntos_pedido2.csv).
  3. Todo lo que siga siendo de ejemplo queda marcado como "EJEMPLO" en su campo "fuente"
     y en parcela["estado_datos"], para que nunca se presente como dato satelital.

Uso:  python scripts/generar_parcelas.py          (con internet; guarda copia en data/crudos/)
      python scripts/generar_parcelas.py --offline (usa data/crudos/ y los CSV de data/appeears/)
      python scripts/generar_parcelas.py --urls    (lista las URL para descargarlas desde el navegador)
"""
import json
import math
import os
import sys
from hls import inferir_historia_desde_ndvi
from power import obtener_clima_mensual_power, anomalia_lluvia_power
from soil import consultar_soilgrids_con_vecinos
from appeears import leer_carpeta, serie_ndvi_parcela, smap_parcela, terreno_parcela

BASE_DIR = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))


def _cuadro(lat, lon, lado_m=140):
    """Polígono cuadrado centrado en (lat, lon) de ~lado_m metros (≈2 ha con 140 m)."""
    dlat = lado_m / 2 / 111320.0
    dlon = lado_m / 2 / (111320.0 * math.cos(math.radians(lat)))
    return [[[round(lon - dlon, 5), round(lat + dlat, 5)], [round(lon + dlon, 5), round(lat + dlat, 5)],
             [round(lon + dlon, 5), round(lat - dlat, 5)], [round(lon - dlon, 5), round(lat - dlat, 5)],
             [round(lon - dlon, 5), round(lat + dlat, 5)]]]


def construir_parcelas_ejemplo():
    """
    Dos parcelas de demostración en Chimborazo, elegidas sobre imagen satelital (lotes de ciclo corto,
    sin casas). Los valores de clima, suelo, terreno y NDVI de abajo son de EJEMPLO y se reemplazan
    por datos reales en enriquecer_con_datos_reales() (POWER, SoilGrids y los CSV de AppEEARS).
    """
    # Curva NDVI de ejemplo típica de la Sierra: siembra oct–nov, cosecha abr–may, suelo desnudo jun–sep
    ndvi_sierra = [
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
    clima_sierra = [
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
    ]
    anomalia_ej = {
        "fuente": "EJEMPLO", "res_km": 50, "pct": 0, "ventana": "último trimestre",
        "mensaje": "Sin dato de anomalía todavía; se calcula con NASA POWER al correr generar_parcelas.py."
    }
    suelo_ej = {
        "fuente": "EJEMPLO", "textura": "Franco", "arcilla_pct": 22.0, "arena_pct": 41.0,
        "ph": 6.0, "soc_pct": 3.0, "n_gkg": 2.0, "es_andisol": True, "editado_por_usuario": False
    }

    def parcela(pid, nombre, region, ubic, lat, lon, elev, pend, pend_max, orient, historia):
        return {
            "id": pid, "nombre": nombre, "region": region, "ubicacion_texto": ubic,
            "geometria": {"type": "Polygon", "coordinates": _cuadro(lat, lon)},
            "area_ha": 2.0, "centroide": {"lat": lat, "lon": lon},
            "terreno": {"elev_m": elev, "pendiente_pct": pend, "pendiente_max_pct": pend_max, "orientacion": orient},
            "clima_mensual": json.loads(json.dumps(clima_sierra)),
            "anomalia": dict(anomalia_ej), "suelo": dict(suelo_ej),
            "ndvi_mensual": json.loads(json.dumps(ndvi_sierra)),
            "historia_inferida": inferir_historia_desde_ndvi(ndvi_sierra),
            "historia_declarada": historia, "nematodo_declarado": False
        }

    # 1. Licto (sur de Riobamba): lote de ciclo corto elegido sobre imagen satelital, historia papa–papa
    parcela_licto = parcela("parcela_licto", "Parcela 1 — Licto (Riobamba, Chimborazo)", "Sierra",
                            "Licto, Riobamba, Chimborazo", -1.8014, -78.6119, 2900, 12.0, 18.0, "SE",
                            ["papa", "papa"])
    # 2. Guano (norte de Riobamba): lote de ciclo corto, historia maíz suave–papa
    parcela_guano = parcela("parcela_guano", "Parcela 2 — Guano / San Andrés (Chimborazo)", "Sierra",
                            "San Andrés, Guano, Chimborazo", -1.6375, -78.5878, 2850, 8.0, 14.0, "S",
                            ["maiz_suave", "papa"])
    return [parcela_licto, parcela_guano]


EJEMPLO = "EJEMPLO (dato provisional, falta dato real)"


def enriquecer_con_datos_reales(p, obs_hls, obs_smap, obs_dem=(), online=True):
    """Reemplaza cada bloque de ejemplo por el dato real disponible y deja registro en estado_datos."""
    lat, lon = p["centroide"]["lat"], p["centroide"]["lon"]
    estado = {"clima": EJEMPLO, "anomalia": EJEMPLO, "suelo": EJEMPLO, "ndvi": EJEMPLO,
              "smap": "sin dato", "terreno": "EJEMPLO (verificar con NASADEM 30 m)"}

    terreno = terreno_parcela(obs_dem, lat, lon)
    if terreno:
        fuente_t = terreno.pop("fuente")
        p["terreno"].update(terreno)
        estado["terreno"] = fuente_t + ("" if "pendiente_pct" in terreno else " (solo altitud; faltan los 4 puntos vecinos)")

    crudos = os.path.join(BASE_DIR, "data", "crudos")
    if True:  # con internet descarga y guarda en data/crudos/; sin internet usa lo guardado
        clima = obtener_clima_mensual_power(lat, lon, elev_parcela_m=p["terreno"]["elev_m"],
                                            cache=os.path.join(crudos, f"power_clima_{p['id']}.json"), online=online)
        if clima:
            p["clima_mensual"] = clima["meses"]
            p["clima_metodo_et0"] = clima["metodo_et0"]
            estado["clima"] = (f"NASA POWER {clima['periodo']} (diario, AG); T corregida "
                               f"{clima['correccion_T_C']:+.1f} °C por altitud (celda a {clima['elev_celda_m']} m)")
        anom = anomalia_lluvia_power(lat, lon, cache=os.path.join(crudos, f"power_lluvia_{p['id']}.json"), online=online)
        if anom:
            p["anomalia"] = anom
            estado["anomalia"] = f"NASA POWER PRECTOTCORR, {anom['ventana']} vs {anom['anios_referencia']}"
        suelo = consultar_soilgrids_con_vecinos(lat, lon, cache=os.path.join(crudos, f"soilgrids_{p['id']}.json"), online=online)
        if suelo:
            # Andisol: suelos volcánicos andinos (Sierra) con carbono orgánico alto
            suelo["es_andisol"] = p["region"].startswith("Sierra") and suelo["soc_pct"] >= 2.0
            p["suelo"] = suelo
            estado["suelo"] = suelo["fuente"]

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


def imprimir_urls():
    """URL de cada descarga y el nombre con que debe guardarse en data/crudos/ (alternativa sin Python)."""
    import urllib.parse
    from datetime import datetime
    for p in construir_parcelas_ejemplo():
        lat, lon, pid = p["centroide"]["lat"], p["centroide"]["lon"], p["id"]
        base = "https://power.larc.nasa.gov/api/temporal/daily/point?"
        print(f"\n{p['nombre']}")
        print(f"  power_clima_{pid}.json\n    " + base + urllib.parse.urlencode({
            "parameters": "T2M_MAX,T2M_MIN,T2M,PRECTOTCORR,ALLSKY_SFC_SW_DWN,WS2M,RH2M", "community": "AG", "latitude": round(lat, 4),
            "longitude": round(lon, 4), "start": "20150101", "end": "20241231", "format": "JSON"}))
        print(f"  power_lluvia_{pid}.json\n    " + base + urllib.parse.urlencode({
            "parameters": "PRECTOTCORR", "community": "AG", "latitude": round(lat, 4), "longitude": round(lon, 4),
            "start": "20010101", "end": datetime.utcnow().strftime("%Y%m%d"), "format": "JSON"}))
        q = [("lon", round(lon, 4)), ("lat", round(lat, 4))] + [("depth", d) for d in ("0-5cm", "5-15cm", "15-30cm")] + \
            [("value", "mean")] + [("property", x) for x in ("clay", "sand", "silt", "phh2o", "soc", "nitrogen")]
        print(f"  soilgrids_{pid}.json\n    https://rest.isric.org/soilgrids/v2.0/properties/query?" + urllib.parse.urlencode(q))


def main():
    if "--urls" in sys.argv:
        return imprimir_urls()
    online = "--offline" not in sys.argv
    obs_hls, obs_smap, obs_dem = leer_carpeta(os.path.join(BASE_DIR, "data", "appeears"))
    print(f"AppEEARS: {len(obs_hls)} observaciones HLS sin nubes, {len(obs_smap)} de SMAP y "
          f"{len(obs_dem)} de NASADEM en data/appeears/")
    parcelas = [enriquecer_con_datos_reales(p, obs_hls, obs_smap, obs_dem, online) for p in construir_parcelas_ejemplo()]

    os.makedirs(os.path.join(BASE_DIR, "data", "parcelas"), exist_ok=True)
    os.makedirs(os.path.join(BASE_DIR, "data", "geojson"), exist_ok=True)
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

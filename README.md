# 🌾 AllpaWiñay — DSS de Rotación de Cultivos con Datos Satelitales NASA
**NASA Space Apps Challenge 2026 · Reto: *"Field Shift: Adapting Farms with NASA Data"***
**Sede:** Riobamba, Ecuador (Sierra Central y Litoral Ecuatoriano)

---

## 🎯 Resumen Ejecutivo
**AllpaWiñay** (*Tierra que crece y perdura* en kichwa) es un **Sistema de Apoyo a la Toma de Decisiones (DSS)** centrado en el agricultor que combina **6 fuentes de observación de la Tierra de la NASA e ISRIC** con conocimiento agronómico local (INIAP, FAO-56, MAG-SIPA) para evaluar en **menos de 35 milisegundos** cientos de secuencias de rotación de cultivos a 3 años (36 meses).

La herramienta compara la **práctica actual del agricultor** frente a **3 estrategias de rotación resilientes**, explicando para cada una:
1. **¿Por qué se sugiere?** (Sincronía Carbono/Nitrógeno, corte de ciclos de plagas y alternancia de arquitectura radicular).
2. **¿Qué evidencia satelital NASA y de suelo la respalda?** (`NASA POWER`, `GPM IMERG`, `SMAP L4`, `NASADEM SRTM 30 m`, `HLS Landsat/Sentinel-2 30 m`, `ISRIC SoilGrids 250 m`).
3. **¿Qué beneficios cuantificados ofrece?** (% de agua cubierta por lluvia, kg N/ha fijados y ahorro equivalente en sacos de urea, toneladas de humus estable y margen bruto anual en USD/ha y por cuadra).
4. **¿Dónde existen lagunas de información?** (Diferencia de resolución entre celda satelital y lote, sanidad subsuperficial no visible desde el espacio).
5. **¿Qué riesgos requieren revisión local?** (Validación de turnos de riego, heladas radiativas, labranza en contorno y precios en feria local).

---

## 🏗️ Arquitectura de 3 Capas

```
NASA_Challenge_2026/
├── index.html                        # Interfaz web en 3 pasos + Modal Científico NASA
├── css/
│   └── styles.css                    # Diseño Daylight-First de alto contraste para campo
├── js/
│   ├── datos_embebidos.js            # Catálogo de 22 cultivos + 3 parcelas pre-calculadas (modo offline/online)
│   ├── filtros.js                    # Capa B1: Filtros duros biofísicos y pausas fitosanitarias por familia
│   ├── balance.js                    # Capa B1: Balance hídrico mensual a 36 meses (FAO-56 + SRTM + Andisol)
│   ├── irr.js                        # Capa B2: Índice de Resiliencia de Rotación (IRR) y ajuste GPM x1.3
│   ├── motor.js                      # Capa B3: Orquestador de recomendaciones y explicabilidad en 5 puntos
│   └── app.js                        # Capa C: Controlador de mapa Leaflet.draw, sliders y gráficos Chart.js
├── data/
│   ├── cultivos.json                 # 22 cultivos (Sierra y Costa) y 10 reglas de pausa por familia botánica
│   ├── parcelas/                     # JSON unificados listos para el motor agronómico
│   │   ├── parcela_chimborazo_1.json # Sierra: Licto/Guamote (2950 m, pend. 14%, historia papa-papa)
│   │   ├── parcela_el_oro_2.json     # Costa: El Guabo/Santa Rosa (28 m, pend. 4%, historia maíz-arroz)
│   │   └── parcela_colta_3.json      # Caso borde: Colta (3180 m, pend. 28% > 25% + riesgo de helada)
│   └── geojson/                      # Polígonos GeoJSON de las 3 parcelas demostrativas
└── scripts/
    ├── power.py                      # Consulta NASA POWER + Radiación extraterrestre Ra + ET0 Hargreaves
    ├── dem.py                        # Cálculo de elevación, pendiente media/máxima y orientación (SRTM 30 m)
    ├── soil.py                       # Consulta ISRIC SoilGrids v2.0 (0-30 cm) y conversión a unidades de campo
    ├── hls.py                        # Procesamiento HLS (Landsat 8/9 + Sentinel-2) NDVI, NDTI y suelo desnudo
    ├── generar_parcelas.py           # Pipeline integrador que genera data/parcelas/*.json y datos_embebidos.js
    └── test_cordura.js               # Suite automatizada de pruebas de cordura agronómica (Sección 7.5)
```

---

## 🛰️ Datos reales: cómo regenerar las parcelas (Rol 1 · Datos)

`scripts/generar_parcelas.py` parte de valores de **EJEMPLO** y los reemplaza por datos reales:

| Dato | Fuente | Cómo se obtiene |
| --- | --- | --- |
| Clima mensual 2015–2024 y heladas | NASA POWER (diario, comunidad AG) | Automático con internet; temperatura corregida por altitud (−6,5 °C/km) |
| Anomalía de lluvia de los últimos 3 meses | NASA POWER (PRECTOTCORR) | Automático con internet |
| Suelo 0–30 cm (textura, pH, carbono, N) | ISRIC SoilGrids 250 m | Automático con internet |
| NDVI / NDTI mensual y meses de suelo desnudo | HLS Landsat + Sentinel-2 (30 m) | CSV de AppEEARS en `data/appeears/` |
| Humedad de la zona radicular | SMAP L4 (SPL4SMGP, 9 km) | CSV de AppEEARS en `data/appeears/` |
| Altitud, pendiente y orientación | NASADEM 30 m | CSV de AppEEARS (centro + 4 vecinos, ver `data/appeears/LEEME.md`) |

```bash
python scripts/generar_parcelas.py           # con internet
python scripts/generar_parcelas.py --offline  # solo CSV locales
```

Al terminar imprime el **estado de los datos** de cada parcela. Todo lo que siga diciendo `EJEMPLO`
también queda marcado así en la app (campo `fuente` y `estado_datos`): **no se presenta como dato satelital**.
La app también muestra la etiqueta **EJEMPLO** junto a cada fuente (clima, terreno, NDVI) mientras el dato no sea real.

> Nota: `test_cordura.js` espera una anomalía de lluvia < −15 % en Chimborazo. Con datos reales esa
> condición puede no cumplirse; si esa prueba falla, es el dato real, no un error del motor.

---

## 🚀 Cómo Ejecutar y Verificar el Proyecto

### 1. Ejecutar las pruebas de cordura agronómica (Sección 7.5)
```bash
node scripts/test_cordura.js
```
Verifica que:
- En **Chimborazo (2,950 m, historia `papa–papa`)**, ninguna de las 3 rotaciones incluya papa (pausa de Solanáceas de 3–4 años), la estrategia #1 inicie con una leguminosa andina (`Chocho`), se active el multiplicador `×1.3` por anomalía GPM `< -15%`, y el cálculo tome `< 100 ms` (~32 ms).
- En **El Oro (28 m, historia `maíz–arroz`)**, no aparezcan cultivos serranos, todas las estrategias incluyan leguminosa tropical (`Soya`, `Maní` o `Caupí`), y se detecte la ventana seca de verano.
- En **Colta (3,180 m, pendiente `28% > 25%` + helada)**, se veten todos los cultivos de labranza intensiva o sensibles al frío, recomendando únicamente coberturas y granos andinos resistentes (`Chocho`, `Quinua`, `Vicia`, `Avena forrajera`, `Cebada`).

### 2. Regenerar los paquetes de datos satelitales de las parcelas
```bash
python3 scripts/generar_parcelas.py
```

### 3. Abrir la aplicación web
Puede abrir `index.html` directamente en cualquier navegador (gracias a `js/datos_embebidos.js`) o servirla localmente:
```bash
python3 -m http.server 8080
```
Luego abra `http://localhost:8080`.

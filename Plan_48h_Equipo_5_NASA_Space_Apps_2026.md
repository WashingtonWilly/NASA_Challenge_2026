# Plan Maestro de 48 Horas — DSS de Rotación de Cultivos (Space Apps Riobamba 2026)
**Reto Oficial: Field Shift: Adapting Farms with NASA Data**  
**Adaptado para Equipo de 5 Integrantes: 3 Universitarios + 2 Estudiantes de Colegio**

*Integra el enunciado y criterios oficiales de NASA Space Apps 2026 con la guía técnica de 48 horas (@Jairo Castillo) mediante el sistema de duplas (Buddy System).*

---

## A. Enunciado Oficial del Desafío y Matriz de Cumplimiento por Rol

### Resumen del Reto Oficial
> Los agricultores de todo el mundo se enfrentan a cambios en las temperaturas, variaciones en los patrones de lluvia, escasez de agua, fenómenos meteorológicos extremos y deterioro de la salud del suelo. Estas presiones dificultan la elección de rotaciones de cultivos que protejan los campos, conserven el agua y fomenten la resiliencia a largo plazo. **Su reto consiste en crear una herramienta de apoyo a la toma de decisiones que utilice observaciones de la Tierra de la NASA junto con información local sobre el suelo, características de los cultivos y prioridades de los agricultores para ayudarles a explorar estrategias de rotación que puedan fortalecer la salud del suelo y adaptar sus explotaciones a las condiciones cambiantes.**

### Matriz de Cumplimiento: Cómo cada integrante cubre los 5 ejes de evaluación de la NASA

| Eje Oficial de Evaluación (NASA) | Qué pide exactamente el desafío | Cómo lo resuelve nuestra herramienta | Responsable Directo |
| :--- | :--- | :--- | :--- |
| **1. Comprensión de las condiciones y los datos** | Relacionar temperatura, humedad, lluvia, evaporación y estrés vegetal con vulnerabilidad y suelo. Explicar términos científicos ($ET_0$, NDVI, riesgo de heladas, balance hídrico) y cómo combinar satélite + medición terrestre mejora la precisión. | • Clima 10 años y $ET_0$ con **NASA POWER**.<br>• Piso térmico y heladas ($T_{min}<0\text{ °C}$) con **NASADEM/SRTM**.<br>• Suelo por defecto (**SoilGrids 250 m**) editable con análisis de laboratorio local.<br>• Glosario visual y botón *"Ver cómo lo calculamos"*. | **Univ. 1** (Datos Python)<br>+ **Colegio 1** (Glosario/Fuentes) |
| **2. Modelado, IA/SI y fusión de datos** | Resaltar transiciones estacionales, períodos de **campos baldíos (suelo desnudo)** y momentos de estrés. Explicar cómo el modelo interpreta la **incertidumbre** y armoniza distintas resoluciones espaciales/temporales. | • Serie de 3 años de **HLS (Landsat + Sentinel-2 a 30 m)** para detectar ciclos previos y meses de suelo desnudo ($\text{NDVI} < 0.25$).<br>• Armonización a escala mensual por polígono: `30 m` (HLS/SRTM) + `250 m` (SoilGrids) + `10 km` (GPM/SMAP como factor regional de anomalía). | **Univ. 1** (`hls.py`)<br>+ **Univ. 2** (`motor.js`) |
| **3. Exploración de estrategias de rotación** | **Comparar al menos 3 estrategias de rotación, incluida la actual.** Examinar ciclo de nutrientes, erosión, materia orgánica, corte de plagas, uso de agua, valor forrajero y mercado. Explicar aporte de fijadores de N, coberturas y raíces profundas. | • Comparación directa: **Rotación Actual del Agricultor (Semáforo Rojo)** vs. **Top 3 Rotaciones Recomendadas (Verde/Amarillo)**.<br>• Índices $I_{H2O}, I_N, I_{MOS}, I_{rent}$ + pausas fitosanitarias por familia + etiquetas de rol ecológico (*Fijador de N, Raíz profunda, Cobertura*). | **Univ. 2** (Motor IRR)<br>+ **Colegio 1** (`cultivos.json`) |
| **4. Cartografía y visualización geoespacial** | Mapas interactivos para explorar tendencias y vulnerabilidades a nivel de lote (riesgo de erosión por pendiente, déficit hídrico, heladas). Líneas de tiempo y **controles deslizantes de escenarios**. | • Mapa interactivo **Leaflet + Esri World Imagery** con dibujo de lote.<br>• Gráfico **Chart.js** de 36 meses marcando lluvia vs. $ET_c$, meses de suelo desnudo y alertas de helada.<br>• Simulador de escenario climático (*"¿Qué pasa si llueve 20 % menos?"*). | **Univ. 3** (Interfaz Web) |
| **5. Diseño centrado en el agricultor** | Fácilmente interpretable sin experiencia técnica ni geoespacial. Expresar prioridades/limitaciones (agua, suelo, mercado, uso de rastrojo para animales). Recordar que **complementa y no reemplaza** el criterio local. | • Interfaz en 3 pasos, en **hectáreas y cuadras**, sin siglas técnicas en la vista principal.<br>• 3 sliders de prioridad + switch *"Uso la paja para mis animales"*.<br>• En cada rotación: **Por qué se sugiere, Evidencia NASA, Beneficios, Lagunas de información y Riesgos a validar con técnico local**. | **Colegio 2** (UX y Pitch)<br>+ **Univ. 3** (UI Móvil) |

---

## B. División Detallada para los 5 Integrantes (3 Universitarios + 2 Colegiales)

### 🎓 Los 3 Universitarios (Núcleo Técnico y Arquitectura)

1. **Rol 1 — Universitario 1: Líder de Datos Satelitales y Fusión Multirresolución (Python)**
   * **Perfil ideal:** Programación en Python (`requests`, `pandas`, `numpy`, `rasterio`).
   * **Misión:** Construir los scripts automatizados (`power.py`, `dem.py`, `soil.py`, `hls.py`), armonizar las resoluciones espaciales/temporales en una cuadrícula mensual común y generar el archivo contrato `parcela.json` para las 2 parcelas de demo (Sierra en Chimborazo y Costa en El Oro).
   * **Entregables clave:**
     * **Sábado 12:00:** `power.py` funcionando (climatología de 10 años, $ET_0$ Hargreaves, riesgo de heladas y eventos extremos) y primer `parcela.json`.
     * **Sábado 16:00:** `dem.py` (elevación y pendiente de riesgo de erosión con NASADEM 30 m), `soil.py` (SoilGrids 250 m) y `hls.py` (lectura del CSV de AppEEARS para detectar ciclos de cultivo y **meses de campo baldío/desnudo** con $\text{NDVI} < 0.25$).
     * **Sábado 21:00+:** Endpoint opcional `/parcela?lat&lon` en FastAPI si sobra tiempo.

2. **Rol 2 — Universitario 2: Líder del Motor Agronómico y Simulador de Escenarios (JavaScript)**
   * **Perfil ideal:** Lógica de programación en JavaScript, algoritmos y modelado matemático/agronómico.
   * **Misión:** Programar el motor de secuencias e índice IRR que corre en el navegador en menos de 100 ms (`filtros.js`, `balance.js`, `irr.js`, `motor.js`).
   * **Entregables clave:**
     * Evaluar tanto las **3 mejores rotaciones nuevas** como la **rotación actual del agricultor** (para cumplir con el requisito oficial de comparar al menos 3 estrategias incluyendo la actual).
     * Implementar los **filtros duros** (altitud, pausa fitosanitaria por familia para interrumpir ciclos de plagas, pendiente > 25 %, heladas y al menos 1 Fabácea en 3 años).
     * Calcular el balance hídrico mensual ($ET_c$ vs. $P_{ef}$ por pendiente) y los 4 índices ($I_{H2O}, I_N, I_{MOS}, I_{rent}$), incluyendo la opción de **escenario de sequía/temperatura** y el switch de **valor forrajero** (retiro de rastrojo para animales).
     * **Prueba de cordura obligatoria (Sábado 21:00):** En Chimborazo (2.950 m, historia papa–papa), la rotación actual sale en **Semáforo Rojo** y el Top 3 recomienda una leguminosa primero (chocho o haba), vetando la papa por 3 años.

3. **Rol 3 — Universitario 3: Líder de Interfaz Web, Cartografía y Despliegue (HTML/CSS/JS + Git)**
   * **Perfil ideal:** Desarrollo Frontend (HTML/CSS/JS), integración con Leaflet, Chart.js y administración de Git / GitHub Pages.
   * **Misión:** Construir la aplicación web de una sola página en 3 pasos (< 2 MB, sin frameworks pesados, fluida en celulares de gama baja).
   * **Entregables clave:**
     * Mapa interactivo con **Leaflet + Esri World Imagery + Leaflet.draw** (calculando área en hectáreas y **cuadras** y mostrando alertas visuales de pendiente/erosión y heladas).
     * Conectar los 3 sliders de prioridad (*Ahorrar agua, Mejorar el suelo, Ganar más*), el control de escenario climático y la edición de suelo en tiempo real.
     * Renderizar la tarjeta comparativa de **Rotación Actual vs. 3 Rotaciones Sugeridas**, el gráfico **Chart.js** (con sombreado en meses de suelo desnudo) y el modal *"Ver cómo lo calculamos"* (explicación científica de NDVI, $ET_0$, armonización de resoluciones e incertidumbre para el jurado).

---

### 🎒 Los 2 Estudiantes de Colegio (Especialistas en Portales NASA, Catálogo y Diseño Centrado en el Agricultor)

> **Regla de oro para los estudiantes de colegio:** Cero bloqueos por consola o instalación de librerías. Trabajan con plataformas web visuales de la NASA, edición de JSON/tablas, redacción explicable para el agricultor, pruebas en móvil y liderazgo del pitch.

4. **Rol 4A — Estudiante de Colegio 1: Especialista en Portales NASA Web, Catálogo Agronómico y Evidencia Científica** *(Dupla con Univ. 1 y Univ. 2)*
   * **Tareas y entregables paso a paso:**
     1. **Portales NASA Web (Sábado 10:30–13:00):** Crear la cuenta NASA Earthdata del equipo y lanzar a las 12:00 el pedido en **AppEEARS** (GeoJSON de las 2 parcelas para `HLSL30.002` y `HLSS30.002`) y en **NASA Giovanni** (CSV de anomalía de lluvia de **GPM IMERG**, humedad de **SMAP** e imagen de **ECOSTRESS**).
     2. **Catálogo `cultivos.json` con Explicaciones Ecológicas (Sábado 10:30–16:00):** Construir el JSON de los 22 cultivos (Sección 6.1) y pausas fitosanitarias (Sección 6.2), añadiendo para cada cultivo las **explicaciones breves que pide la NASA**: cómo contribuye a la salud del suelo (fijación de N, cobertura contra erosión, raíces profundas, valor forrajero o tolerancia a sequía/helada).
     3. **Glosario Científico Sencillo y Validación de Parcelas (Sábado 16:00–21:00):** Redactar las cápsulas explicativas de términos científicos (*evapotranspiración, NDVI, anomalía de humedad, diferencia entre dato satelital y medición en tierra*) para el panel educativo, y documentar las 2 parcelas reales (Chimborazo y El Oro).

5. **Rol 4B — Estudiante de Colegio 2: Especialista en Diseño Centrado en el Agricultor (UX), Explicabilidad y Pitch** *(Dupla con Univ. 3)*
   * **Tareas y entregables paso a paso:**
     1. **Plantilla de Explicabilidad de las Estrategias (Sábado 12:00–18:00):** El reto oficial pide que cada rotación explique 5 cosas. El Estudiante 2 redacta las plantillas en lenguaje de campo para cada tarjeta:
        * **¿Por qué se sugiere?** (Lógica agronómica)
        * **¿Qué evidencia NASA la respalda?** (GPM, NASA POWER, HLS, SRTM)
        * **¿Qué beneficios ofrece?** (Agua ahorrada, abono en kg N/ha, materia orgánica, ingreso/forraje)
        * **¿Dónde hay lagunas de información?** (Resolución de 250 m en suelo, precios referenciales)
        * **¿Qué riesgos requieren revisión local?** (Validación con análisis de suelo y técnico agrícola local)
     2. **Kit Visual y Pruebas en Celular (Sábado 16:00–21:00):** Íconos de los 22 cultivos, textos de semáforo y prueba completa en teléfonos reales verificando que sea 100 % comprensible para un agricultor sin experiencia técnica.
     3. **Slides, Video de 30 s y Pitch (Sábado 18:00 – Domingo):** Diseñar las 12 diapositivas (incluyendo la inspiración multigeneracional del reto), grabar el video de 30 s y liderar los 3 ensayos del pitch.

---

## 1. Decisión de Alcance

El MVP recomienda **3 rotaciones de 3 años** comparadas contra la **rotación actual del agricultor** para una parcela dibujada en el mapa, usando **3 fuentes NASA en vivo** y **2 parcelas precomputadas**. Todo lo demás se recorta el sábado a las 10:30, sin debate.

| Elemento | Decisión | Por qué |
| :--- | :--- | :--- |
| **NASA POWER** ($ET_0$, lluvia, temperatura, heladas) | **Entra, en vivo** | API sin autenticación, responde en 2 s |
| **NASADEM / SRTM** (elevación, pendiente 30 m) | **Entra, en vivo** | Define piso térmico y riesgo de erosión/escorrentía |
| **HLS NDVI y NDTI 3 años** (Landsat + Sentinel-2, 30 m) | **Entra, precomputado** | Detecta historia de cultivo y **periodos de suelo baldío** vía AppEEARS |
| **SoilGrids** (textura, pH, carbono, 250 m) | **Entra, editable** | Combina observación satelital con medición terrestre del agricultor |
| **SMAP L4 + GPM IMERG** (humedad y lluvia, 9–10 km) | **Entra como tarjeta de anomalía** | Ajusta el peso del agua cuando la campaña viene más seca de lo normal |
| **ECOSTRESS / GRACE-FO** | **En el panel técnico y pitch** | Evidencia visual de estrés evaporativo y tendencia hídrica regional |
| **Google Earth Engine / QGIS 3D / MODIS ET** | **Fuera del vivo** | Evita fallos de autenticación/cuotas; el balance FAO-56 a 30 m es más preciso |
| **Rentabilidad ($I_{rent}$) y Valor Forrajero** | **Entra simplificada** | Tabla fija MAG-SIPA + switch de uso de rastrojo para ganado |

> **Regla de oro:** Si a las 18:00 del sábado algo no funciona, se reemplaza por su versión precomputada. Nada se demuestra en vivo si no se probó tres veces.

---

## 2. Arquitectura Final y Fusión de Datos (Armonización de Resoluciones)

Tres capas, flujo en una sola dirección: **datos → motor de reglas → pantalla del agricultor**. El motor corre en el navegador (JavaScript) sobre un JSON por parcela; el backend Python solo prepara ese JSON.

| Capa | Componentes | Entrada | Salida |
| :--- | :--- | :--- | :--- |
| **A. Datos y Armonización (Python)** | `power.py`, `dem.py`, `hls.py`, `soil.py` | Polígono GeoJSON de la parcela | `parcela.json`: datos armonizados a escala mensual del lote + metadatos de incertidumbre |
| **B. Motor (JavaScript en el navegador)** | `filtros.js`, `balance.js`, `irr.js`, `tablas.js` | `parcela.json` + prioridades (3 sliders) + escenario climático | Evaluación de la rotación actual + Top 3 secuencias recomendadas con desglose y alertas |
| **C. Interfaz (HTML/CSS/JS)** | Leaflet (mapa + dibujo), Chart.js (balance y suelo desnudo), tarjetas | Clic en mapa, sliders, corrección de suelo | Comparativa visual tipo semáforo + panel científico para el jurado |

### Cómo explicamos la armonización de resoluciones (pregunta fija del jurado)
* **Nivel de lote (30 m):** `NASADEM` (pendiente y altitud) y `HLS Landsat/Sentinel-2` (mediana mensual de NDVI y NDTI dentro del polígono tras filtrar nubes con `Fmask`).
* **Nivel de suelo local (250 m + Tierra):** `SoilGrids` da la línea base a 250 m, pero se fusiona con el dato terrestre ingresado por el agricultor (resolviendo el sesgo en suelos volcánicos Andisoles).
* **Nivel climático y regional (10 km – 50 km):** `NASA POWER` provee la serie climática diaria agregada a climatología mensual, y `GPM IMERG` / `SMAP` (10 km) actúan como moduladores regionales de sequía sin distorsionar el balance hídrico de la parcela.

---

## 3. Tabla de Responsables y Entregables (Equipo 3U + 2C)

Escriban el nombre en la columna **Responsable** antes de las 10:30 del sábado.

| Rol | Responsable | Entrega del sábado | Entrega del domingo |
| :--- | :--- | :--- | :--- |
| **1. Datos y Fusión (Univ. 1 — Python)** | | `parcela.json` de 2 parcelas con POWER, DEM, HLS (suelo desnudo) y SoilGrids | Script `/parcela` en FastAPI si sobra tiempo + documentación de armonización |
| **2. Motor Agronómico (Univ. 2 — JS)** | | `filtros.js` + `balance.js` + `irr.js` evaluando rotación actual + Top 3 y superando prueba de cordura | Simulador de escenario climático, switch forrajero y calibración final en Sierra y Costa |
| **3. Interfaz y Mapas (Univ. 3 — HTML/CSS/JS)** | | Mapa con dibujo de parcela, sliders, tarjetas comparativas conectadas al motor | Gráfico Chart.js con meses baldíos, tarjeta de anomalía, panel científico y GitHub Pages |
| **4A. Portales NASA y Catálogo (Colegio 1)** | | Pedidos en AppEEARS/Giovanni, `cultivos.json` (22 cultivos con rol ecológico) y GeoJSON de 2 parcelas | Glosario científico sencillo, respaldo PDF de resultados y formulario oficial Space Apps |
| **4B. Diseño Agricultor y Pitch (Colegio 2)** | | Íconos, textos explicables (evidencia, beneficios, lagunas y riesgos), pruebas en móvil y slides 1–6 | Slides 7–12, imagen ECOSTRESS, video de 30 s y 3 ensayos cronometrados del pitch |

---

## 4. Cronograma Hora a Hora (5 Integrantes)

*Asumiendo cierre de proyectos el domingo 15 a las 15:00; ajusten la última fila al horario oficial de la sede. Las horas en **negrita** son puntos de integración obligatorios.*

| Hora | Univ. 1 (Datos Python) | Univ. 2 (Motor JS) | Univ. 3 (Interfaz Web) | Colegio 1 (NASA Web + Catálogo) | Colegio 2 (UX Agricultor + Pitch) |
| :--- | :--- | :--- | :--- | :--- | :--- |
| **Sáb 10:00–10:30** | Lectura del plan, asignación de los 5 roles y creación del repositorio Git | Lectura del plan | Lectura del plan | Crear cuenta NASA Earthdata | Lectura del plan y estructura visual |
| **10:30–12:00** | `power.py` funcionando para un punto | Estructura base de `motor.js` | Mapa Leaflet con dibujo de polígono (`Leaflet.draw`) | Elegir las 2 parcelas de demo + transcribir `cultivos.json` | Diseñar íconos de cultivos y maqueta de 3 pasos |
| **12:00** | **INTEGRACIÓN 1:** `parcela.json` de prueba con NASA POWER | Prueba de lectura de JSON | Cálculo de área en ha y cuadras | GeoJSON de las 2 parcelas listos | Textos base de las pantallas 1 y 2 |
| **12:00–13:00** | `dem.py` (elevación, pendiente, orientación) | `filtros.js`: piso térmico, familia, raíz, pendiente | Sliders de prioridad, switch de forraje y panel de suelo editable | Lanzar pedido de HLS en **AppEEARS** (tarda 1–3 h) | Redactar plantillas de Evidencia, Lagunas y Riesgos locales |
| **13:00** | **ALMUERZO.** Se congelan los esquemas de `parcela.json` y `cultivos.json` | — | — | — | — |
| **13:30–16:00** | `soil.py` (SoilGrids REST) y `hls.py` leyendo CSV de AppEEARS | `balance.js`: $ET_c$ mensual por etapa, $P_{ef}$ por pendiente | Chart.js: barras lluvia vs. $ET_c$ + sombreado de suelo desnudo | Descargar CSV de **GPM IMERG** en Giovanni + agregar rol ecológico en `cultivos.json` | Redactar textos de semáforo (verde/amarillo/rojo) y glosario |
| **16:00** | **INTEGRACIÓN 2:** El motor corre con datos reales de la Parcela 1 (Sierra) | — | — | — | — |
| **16:00–18:00** | Integrar anomalía SMAP/GPM en `parcela.json` | `irr.js`: puntaje de las 3 rotaciones + evaluación de la **rotación actual** | Tarjeta de Rotación Actual (Rojo) vs. 3 Recomendadas | Completar precios/márgenes MAG-SIPA en `cultivos.json` | Borrador 1 del guion del pitch (3 min) |
| **18:00** | **REVISIÓN DE RIESGO:** Lo que no funcione en vivo pasa a precomputado | — | — | — | — |
| **18:00–21:00** | Parcela 2 (Costa) completa; inferencia de historia y meses baldíos desde NDVI | Crédito de N, aporte de residuos ($I_N, I_{MOS}$) y slider de sequía | Pantalla de resultados pulida; versión móvil | Verificar datos de Parcela 2 (El Oro) y tabla de resoluciones | Armar Slides 1–6 + probar app en celular real |
| **21:00** | **INTEGRACIÓN 3:** Demo completa de punta a punta + **Prueba de cordura superada** + grabada en video | — | — | — | — |
| **21:00–00:00** | FastAPI `/parcela` opcional | Validación agronómica fina y ajuste de pesos | Panel técnico (*"Ver cómo lo calculamos"*: satélite vs. tierra) | Generar capturas de NDVI y PDFs de respaldo | Armar Slides 7–12 + imagen ECOSTRESS |
| **00:00** | **INTEGRACIÓN 4.** Dormir en turnos (mínimo 4 h cada integrante) | — | — | — | — |
| **Dom 06:00–09:00** | Casos borde: parcela en la Costa, pendiente > 25 % | Pruebas finales con las 2 parcelas | Corrección de detalles visuales y modo offline | Revisar citación de todas las fuentes NASA | Ensayo 1 del pitch con cronómetro |
| **09:00–11:00** | **Congelar código.** README y despliegue estático en GitHub Pages | Apoyo en README técnico | Publicación en GitHub Pages | Preparar respuestas de datos NASA (Sección 10) | Ensayo 2 + preguntas probables del jurado |
| **11:00–13:00** | Verificación de links del repo | Verificación de demo local sin wifi | Verificación en móvil | Llenar formulario oficial de Space Apps | Video final de 30 s + Ensayo 3 frente a otro equipo |
| **13:00–15:00** | **Margen de seguridad y Entrega Oficial** | **Pitch** | **Pitch** | **Pitch** | **Pitch** |

---

## 5. Guía Técnica: Datos NASA (Rol 1 + Rol 4A)

Primero: crear cuenta de **NASA Earthdata** para el equipo (gratis, 5 minutos): la necesitan AppEEARS, `earthaccess` y Giovanni. NASA POWER y SoilGrids no piden cuenta.

### 5.1 NASA POWER: clima diario y climatología
Un `GET` por parcela usando el centroide del polígono. Pidan 10 años diarios y calculen la climatología mensual; así también obtienen la variabilidad, riesgo de heladas y eventos de precipitación extrema.

```python
import requests, pandas as pd

def power_diario(lat, lon, inicio="20150101", fin="20241231"):
    url = "https://power.larc.nasa.gov/api/temporal/daily/point"
    params = dict(
        parameters="T2M_MAX,T2M_MIN,T2M,PRECTOTCORR,RH2M,WS2M,ALLSKY_SFC_SW_DWN",
        community="AG", latitude=lat, longitude=lon,
        start=inicio, end=fin, format="JSON"
    )
    r = requests.get(url, params=params, timeout=60).json()
    df = pd.DataFrame(r["properties"]["parameter"])
    df.index = pd.to_datetime(df.index)
    return df.replace(-999, pd.NA)
```

$ET_0$ con **Hargreaves** (robusto, sin viento ni humedad); Penman-Monteith FAO-56 solo si sobra tiempo:

$$ET_0 = 0.0023 \, R_a \, (T_{med} + 17.8)\,\sqrt{T_{max} - T_{min}}$$

* $R_a$ (radiación extraterrestre, mm/día) se calcula con latitud y día del año (FAO-56, ecuación 21); hay implementación directa en el paquete `pyeto`.
* Agreguen a nivel mensual: `P_mm`, `ET0_mm`, `Tmin_abs` (para heladas: $T_{min}$ absoluta $< 0\text{ °C}$ en algún mes) y `Tmed`.

### 5.2 NASADEM / SRTM: elevación, pendiente, orientación
Descarga del mosaico de 1° con `earthaccess` (producto `NASADEM_HGT`, 30 m), recorte al polígono con `rasterio` y pendiente con `numpy.gradient` sobre la ventana $3\times 3$.

```python
import earthaccess, rasterio, numpy as np

earthaccess.login()  # usa la cuenta Earthdata
res = earthaccess.search_data(
    short_name="NASADEM_HGT",
    bounding_box=(lon - 0.01, lat - 0.01, lon + 0.01, lat + 0.01)
)
files = earthaccess.download(res, "./dem")
# Luego: abrir el .hgt con rasterio, recortar, y
# pendiente_pct = 100 * np.hypot(dz_dx, dz_dy) con dx = 30 m
```

* **Salidas:** `elev_m` (media), `pendiente_pct` (media y máxima), `orientacion` (N/S/E/O dominante).
* **Plan B si la descarga falla:** AppEEARS también sirve NASADEM por punto/polígono.

### 5.3 HLS: NDVI y NDTI de 3 años (historia de cultivo y periodos de suelo baldío)
* En **AppEEARS** → *Area Sample* → subir el GeoJSON → productos `HLSL30.002` (bandas `B04`, `B05`, `B06`, `B07`, `Fmask`) y `HLSS30.002` (`B04`, `B8A`, `B11`, `B12`, `Fmask`) → fechas `2022-11-01` a `2025-11-01` → CSV.
* Láncenlo a las **12:00 del sábado** (tarda entre 1 y 3 horas). Mientras tanto, programen con un CSV ficticio.
* **Fórmulas:**
  * $\text{NDVI} = \frac{\text{NIR} - \text{Rojo}}{\text{NIR} + \text{Rojo}}$ (Landsat: `B05` y `B04`; Sentinel-2: `B8A` y `B04`).
  * $\text{NDTI (índice de labranza/rastrojo)} = \frac{\text{SWIR1} - \text{SWIR2}}{\text{SWIR1} + \text{SWIR2}}$ (Landsat: `B06` y `B07`; Sentinel-2: `B11` y `B12`).
* Descarten píxeles con nube o sombra según el bit de `Fmask`; luego calculen la mediana mensual del polígono. En la Sierra habrá meses vacíos: interpolen linealmente y márquenlos como dato interpolado.
* **Historia de cultivo y vulnerabilidad inferida:**
  * $\text{NDVI} > 0.55$ sostenido 2+ meses = **cultivo activo**.
  * $\text{NDVI} < 0.25$ = **campo baldío / suelo desnudo** (alerta de vulnerabilidad a la erosión y pérdida de humedad).
  * $\text{NDTI}$ alto con $\text{NDVI}$ bajo = **residuos/cobertura muerta en superficie**.

### 5.4 SoilGrids: suelo satelital fusionado con observación terrestre

```python
url = "https://rest.isric.org/soilgrids/v2.0/properties/query"
params = dict(
    lon=lon, lat=lat, depth="0-30cm", value="mean",
    property=["clay", "sand", "silt", "phh2o", "soc", "nitrogen"]
)
```

* **Unidades que confunden:** `clay`/`sand`/`silt` vienen en $\text{g/kg}$ (dividir por 10 para $\%$), `phh2o` viene multiplicado por 10, `soc` en $\text{dg/kg}$ (dividir por 100 para $\%$), `nitrogen` en $\text{cg/kg}$.
* **Explicación satélite vs. tierra:** En Andisoles (Sierra ecuatoriana) el carbono orgánico real suele ser mayor al modelado satelitalmente a 250 m: la interfaz explica esta diferencia y permite al agricultor ingresar su medición en tierra.

### 5.5 SMAP L4 y GPM IMERG: tarjeta de anomalía hídrica
* **Pregunta única:** ¿Los últimos 3 meses fueron más secos o más húmedos que lo normal?
* **Camino rápido:** NASA Giovanni → *Time Series, Area-Averaged* → GPM IMERG mensual (`GPM_3IMERGM`) sobre un rectángulo de $0.5^\circ$ alrededor de la parcela → CSV.
* $\text{Anomalía} = \frac{P_{\text{últimos 3 meses}} - P_{\text{climatológica}}}{P_{\text{climatológica}}}$.
* **En la pantalla:** *"Región 18 % más seca que lo normal (GPM, 10 km)"*.

### 5.6 Esquema de `parcela.json` (contrato entre roles, congelado a las 13:00)

```json
{
  "id": "parcela_chimborazo_1",
  "geometria": {"type": "Polygon", "coordinates": []},
  "area_ha": 1.8,
  "centroide": {"lat": -1.65, "lon": -78.65},
  "terreno": {"elev_m": 2950, "pendiente_pct": 14, "pendiente_max_pct": 22, "orientacion": "SE"},
  "clima_mensual": [{"mes": 1, "P_mm": 48, "ET0_mm": 95, "Tmin_abs": 3.1, "Tmed": 13.2}],
  "anomalia": {"fuente": "GPM IMERG", "res_km": 10, "pct": -18, "ventana": "ago-oct 2026"},
  "suelo": {
    "fuente": "SoilGrids 250 m",
    "arcilla_pct": 24,
    "arena_pct": 41,
    "ph": 5.9,
    "soc_pct": 3.4,
    "n_gkg": 2.1,
    "editado_por_usuario": false
  },
  "ndvi_mensual": [{"mes": "2023-01", "ndvi": 0.62, "ndti": 0.08, "n_obs": 2, "interpolado": false}],
  "historia_inferida": [{"anio": 2023, "ciclos": 1, "meses_cultivo": [1, 2, 3, 4, 5], "meses_desnudo": [8, 9]}]
}
```

---

## 6. Guía Técnica: Reglas Agronómicas y Tablas (Rol 2 + Rol 4A)

Esta sección se convierte directamente en `cultivos.json`. Los valores son aproximados (FAO-56 para $K_c$; guías INIAP y práctica en Chimborazo y El Oro para altitud y calendario).

### 6.1 Catálogo de cultivos
* **Ventanas de siembra:** `S1` = Sierra, oct–dic (lluvias); `S2` = Sierra, feb–mar; `C1` = Costa, dic–ene (invierno lluvioso); `C2` = Costa, jun–ago (verano, requiere riego).
* **$K_c$:** en orden *inicial / medio / final*.

| Cultivo | Familia | Raíz y Rol en el Suelo | Altitud (m) | Ciclo (días) | $K_c$ (ini / med / fin) | Residuo (t MS/ha) | Crédito N (kg/ha) | Siembra | Tolera helada |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **Papa** | Solanáceas | Fasciculada, superficial (alta demanda) | 2600–3800 | 120–150 | 0.50 / 1.15 / 0.75 | 1.5 | 0 | S1, S2 | No |
| **Maíz suave (choclo)** | Poáceas | Fasciculada, profunda (alto rastrojo) | 2200–3000 | 180–240 | 0.30 / 1.15 / 1.05 | 6.0 | 0 | S1 | No (emergencia) |
| **Cebada** | Poáceas | Fasciculada (tolerante a sequía/frío) | 2600–3600 | 150–180 | 0.30 / 1.15 / 0.25 | 4.0 | 0 | S1, S2 | Sí |
| **Trigo** | Poáceas | Fasciculada (cobertura media) | 2400–3200 | 150–180 | 0.30 / 1.15 / 0.25 | 4.0 | 0 | S1 | Sí |
| **Quinua** | Amarantáceas | Pivotante (alta resiliencia hídrica/frío) | 2600–3600 | 150–180 | 0.50 / 1.00 / 0.70 | 2.5 | 0 | S1 | Sí |
| **Chocho (tarwi)** | Fabáceas | Pivotante, profunda (fija N + descompacta) | 2600–3600 | 180–240 | 0.40 / 1.00 / 0.50 | 3.5 | 50 | S1 | Moderada |
| **Haba** | Fabáceas | Pivotante (fija N + rompe plagas de cereal) | 2600–3600 | 150–180 | 0.50 / 1.15 / 1.10 | 2.5 | 40 | S1, S2 | Sí |
| **Arveja** | Fabáceas | Pivotante (ciclo corto, fija N) | 2400–3200 | 90–120 | 0.50 / 1.15 / 1.10 | 1.5 | 25 | S1, S2 | Moderada |
| **Fréjol arbustivo** | Fabáceas | Pivotante (ciclo corto, fija N) | 1200–2800 | 90–110 | 0.40 / 1.15 / 0.35 | 1.5 | 25 | S2, C1 | No |
| **Brócoli / col** | Brasicáceas | Pivotante, superficial (ingreso rápido) | 2400–3200 | 90–120 | 0.70 / 1.05 / 0.95 | 2.5 | 0 | S1, S2 | Moderada |
| **Zanahoria** | Apiáceas | Pivotante (rompe ciclos de Poáceas) | 2200–3200 | 100–150 | 0.70 / 1.05 / 0.95 | 1.0 | 0 | S1, S2 | Moderada |
| **Cebolla** | Amarilidáceas | Fasciculada, superficial | 2000–3200 | 120–150 | 0.70 / 1.05 / 0.75 | 0.8 | 0 | S1, S2 | Moderada |
| **Avena forrajera** | Poáceas | Fasciculada (cobertura antierosión + forraje) | 2400–3600 | 90–120 | 0.30 / 1.15 / 0.30 | 5.0 | 0 | S1, S2 | Sí |
| **Vicia (abono verde)** | Fabáceas | Pivotante (cobertura + máxima fijación N + forraje) | 2400–3600 | 90–120 | 0.40 / 1.00 / 0.90 | 4.0 | 70 | S1, S2 | Sí |
| **Arroz** | Poáceas | Fasciculada (alta demanda hídrica) | 0–1200 | 120–150 | 1.05 / 1.20 / 0.90 | 5.0 | 0 | C1, C2 | No aplica |
| **Maíz duro** | Poáceas | Fasciculada, profunda (alto aporte de carbono) | 0–1500 | 110–130 | 0.30 / 1.20 / 0.60 | 6.0 | 0 | C1, C2 | No aplica |
| **Soya** | Fabáceas | Pivotante (fija N para rotación con maíz/arroz) | 0–1000 | 100–120 | 0.40 / 1.15 / 0.50 | 2.5 | 30 | C1, C2 | No aplica |
| **Maní** | Fabáceas | Pivotante (fija N, menor demanda de agua) | 0–1200 | 120–140 | 0.40 / 1.15 / 0.60 | 2.5 | 25 | C1, C2 | No aplica |
| **Yuca** | Euforbiáceas | Tuberosa, profunda (tolerante a sequía) | 0–1800 | 300–360 | 0.30 / 0.80 / 0.30 | 2.5 | 0 | C1 | No aplica |
| **Sandía / melón** | Cucurbitáceas | Pivotante (ciclo corto de verano) | 0–800 | 90–100 | 0.40 / 1.00 / 0.75 | 1.0 | 0 | C2 | No aplica |
| **Tomate riñón** | Solanáceas | Pivotante (alta rentabilidad, alto riesgo plagas) | 0–2400 | 120–150 | 0.60 / 1.15 / 0.80 | 1.5 | 0 | C1, C2, S2 | No |
| **Caupí / fréjol de palo** | Fabáceas | Pivotante (fija N + muy tolerante a sequía) | 0–1000 | 70–90 | 0.40 / 1.05 / 0.35 | 1.5 | 25 | C2 | No aplica |

### 6.2 Pausa fitosanitaria por familia (interrupción del ciclo de plagas)

| Familia | Años mínimos sin repetir | Razón principal (plagas/enfermedades que se interrumpen) |
| :--- | :--- | :--- |
| **Solanáceas (papa, tomate)** | **3** (4 si hubo nematodo del quiste) | *Globodera*, *Phytophthora infestans*, *Rhizoctonia* |
| **Brasicáceas (brócoli, col)** | **4** | *Plasmodiophora brassicae* persiste años en el suelo |
| **Apiáceas (zanahoria)** | **3** | *Alternaria*, nematodos |
| **Amarilidáceas (cebolla)** | **3** | *Sclerotium cepivorum* |
| **Cucurbitáceas** | **3** | *Fusarium*, virus |
| **Fabáceas** | **2** | *Fusarium*, *Sclerotinia*; además se pierde el beneficio de N si se repite |
| **Amarantáceas (quinua)** | **2** | Mildiu (*Peronospora*) |
| **Euforbiáceas (yuca)** | **2** | Bacteriosis |
| **Poáceas (maíz, cebada, trigo, avena)** | **1** | Baja presión; se permite repetir una vez con penalización, nunca la misma especie dos veces seguidas |
| **Arroz** | **1** | Monocultivo frecuente; penalizar, no vetar |

### 6.3 Reglas del motor

* **Filtros duros (veto para las recomendaciones nuevas):**
  1. Altitud de la parcela fuera del rango del cultivo.
  2. Familia repetida antes de cumplir la pausa de 6.2, contando la historia inferida por NDVI y lo que el agricultor declare.
  3. Pendiente media $> 25\,\%$: solo coberturas (avena, vicia), chocho, quinua o cebada; nunca papa, zanahoria ni cebolla (labranza intensiva y erosión severa).
  4. Helada: si algún mes del ciclo tiene $T_{min}\text{ absoluta} < 0\text{ °C}$ y el cultivo no la tolera, sale.
  5. Secuencia completa: una rotación recomendada de 3 años debe incluir **al menos una Fabácea** (leguminosa o abono verde).

* **Penalizaciones (restan puntaje, no vetan):**
  * Misma estructura radicular dos cultivos seguidos: $-0.10$ al $I_{MOS}$ de la secuencia.
  * Residuo con $\text{C/N} > 40$ (paja de cereal) seguido de otro cereal: $-0.15$ al $I_N$ (inmovilización de nitrógeno). Residuo con $\text{C/N} < 24$ (leguminosa) seguido de cereal: $+0.10$ al $I_N$ (sincronía).
  * Factor de pendiente ($f_{pend}$) sobre infiltración y precipitación efectiva:
    * Pendiente $< 8\,\%$: multiplicar por $0.90$
    * Pendiente $8\text{–}12\,\%$: multiplicar por $0.80$
    * Pendiente $12\text{–}25\,\%$: multiplicar por $0.70$
    * Pendiente $> 25\,\%$: multiplicar por $0.55$
  * Campo baldío > 3 meses entre cultivos sin cobertura: $-0.10$ al $I_{MOS}$.

* **Precipitación efectiva mensual (FAO + factor de infiltración por pendiente):**

$$P_{ef} = f_{pend} \cdot \begin{cases} 0.8\,P - 25 & P > 75\text{ mm} \\ \max(0,\; 0.6\,P - 10) & P \le 75\text{ mm} \end{cases}$$

* **Nitrógeno:** El crédito de la tabla se suma al cultivo siguiente; los cereales y hortalizas extraen **100 kg N/ha** en el MVP.
* **Materia orgánica y valor forrajero:** $\text{Aporte} = \text{residuo (t MS/ha)} \times \text{coeficiente de humificación}$ ($0.20$ paja de cereal, $0.25$ abono verde incorporado, $0.10$ hortalizas y tubérculos). Si el agricultor activa *"Uso la paja para mis animales (forraje)"*, $\text{residuo al suelo} \times 0.3$, pero se destaca el beneficio de alimento para ganado.

---

## 7. Guía Técnica: Motor de Secuencias, Comparativa e Índice IRR (Rol 2)

El motor evalúa la **rotación actual del agricultor** (para mostrar su diagnóstico) y genera todas las secuencias válidas de 3 cultivos, ordenándolas por IRR en menos de 100 ms.

### 7.1 Algoritmo base (`motor.js`)

```javascript
// motor.js — entrada: parcela (parcela.json), cultivos (cultivos.json), pesos {w_h2o, w_n, w_mos, w_rent}
function recomendar(parcela, cultivos, pesos, historia, escenarioLluviaPct = 0) {
  const aptos = cultivos.filter(c => pasaFiltrosIndividuales(c, parcela)); // altitud, pendiente, helada
  const secuencias = [];
  for (const a of aptos) for (const b of aptos) for (const c of aptos) {
    const seq = [a, b, c];
    if (!pasaFiltrosSecuencia(seq, historia)) continue;   // pausa por familia, al menos una Fabácea
    const bal = balanceHidrico(seq, parcela, escenarioLluviaPct); // mm por mes, 36 meses
    const idx = {
      h2o:  indiceAgua(bal),
      n:    indiceNitrogeno(seq),
      mos:  indiceMateriaOrganica(seq, parcela),
      rent: indiceRentabilidad(seq)
    };
    const irr = pesos.w_h2o * idx.h2o + pesos.w_n * idx.n + pesos.w_mos * idx.mos + pesos.w_rent * idx.rent;
    secuencias.push({ seq, idx, irr, bal, explicacion: generarExplicacion(seq, parcela, bal, idx) });
  }
  const actual = evaluarSecuenciaActual(historia, parcela, cultivos, escenarioLluviaPct);
  return { actual, recomendadas: secuencias.sort((x, y) => y.irr - x.irr).slice(0, 3) };
}
```

### 7.2 Balance hídrico por secuencia
Cada cultivo se coloca en su ventana de siembra (`S1`, `S2`, `C1` o `C2`) y se reparte su ciclo en tres etapas de $K_c$: 25 % inicial, 50 % media, 25 % final del ciclo. Para cada mes $m$ del cultivo:

$$ET_c(m) = K_c(\text{etapa}(m)) \cdot ET_0(m)$$

$$D(m) = \max\big(0,\; ET_c(m) - P_{ef}(m)\big)$$

### 7.3 Índices normalizados (todos entre 0 y 1, mayor es mejor)

* **Agua ($I_{H2O}$):**

$$I_{H2O} = 1 - \frac{\sum_m D(m)}{\sum_m ET_c(m)}$$

  *Si la tarjeta de anomalía GPM muestra una campaña más seca que lo normal en más de 15 %, el peso `w_h2o` se multiplica por 1.3 automáticamente y la pantalla lo informa.*

* **Nitrógeno ($I_N$):**

$$I_N = \text{clip}\!\left(\frac{\sum \text{créditos} - \sum \text{extracciones} + 300}{600},\, 0,\, 1\right)$$

* **Materia Orgánica ($I_{MOS}$):**

$$I_{MOS} = \frac{\sum_i \text{residuo}_i \cdot h_i}{\max \text{aporte}_{3\text{ cultivos}}} - \text{penalizaciones}$$

* **Rentabilidad ($I_{rent}$):** Margen bruto aproximado por hectárea ($\text{rendimiento típico} \times \text{precio MAG-SIPA} - \text{costo típico}$), normalizado por el margen máximo de la zona.

### 7.4 Pesos de los sliders
Tres sliders para el agricultor: **"Ahorrar agua"**, **"Mejorar el suelo"**, **"Ganar más"**.

* `w_h2o = agua`
* `w_n = suelo * 0.5`
* `w_mos = suelo * 0.5`
* `w_rent = ganar`
* Se normalizan para sumar 1. Valores por defecto: **0.40 / 0.30 / 0.30** (agua, suelo, ganar).

### 7.5 Prueba de cordura obligatoria (Sábado 21:00)
Para la parcela de Chimborazo a 2.950 m con historia **papa–papa**, el diagnóstico de la rotación actual debe marcar **Semáforo Rojo** y el Top 3 **debe incluir una leguminosa en primer lugar (chocho o haba)** y **no debe incluir papa en los próximos 3 años**.

---

## 8. Guía Técnica: Interfaz Centrada en el Agricultor (Rol 3 + Rol 4B)

Una sola página, tres pasos, lenguaje de campo. El agricultor nunca ve las palabras NDVI, $K_c$ ni IRR en la vista principal, pero cada estrategia explica claramente el porqué, la evidencia, los beneficios, las lagunas de datos y qué consultar con un experto local.

### 8.1 Las tres pantallas

| Paso | Qué ve el agricultor | Qué hace el sistema |
| :--- | :--- | :--- |
| **1. Mi terreno** | Mapa satelital (Leaflet + Esri World Imagery), botón *"Dibujar mi terreno"* (`Leaflet.draw`), o elegir una de las 2 parcelas de ejemplo | Calcula área en hectáreas y **cuadras** ($1\text{ cuadra} \approx 0.7\text{ ha}$), carga `parcela.json` y muestra alertas del lote (pendiente/erosión, heladas) |
| **2. Mi suelo y mis prioridades** | Tarjeta *"Así vemos su suelo desde el satélite"* con 3 valores editables (textura: arenoso/franco/arcilloso; pH; materia orgánica), tarjeta *"Lo que sembró antes"* prellenada desde NDVI (marcando meses de campo baldío), 3 sliders de prioridad + switch de forraje + control de escenario de lluvia | Combina SoilGrids con el dato terrestre del agricultor; fija los pesos y escenario |
| **3. Comparativa de rotaciones** | **1 Tarjeta de Rotación Actual (Rojo)** + **3 Tarjetas Recomendadas (Verde/Amarillo)**: `Año 1 → Año 2 → Año 3` con íconos, insignias ecológicas, 3 métricas grandes (agua ahorrada %, abono kg N/ha, materia orgánica), gráfico **Chart.js** y bloque de **Evidencia, Lagunas y Riesgos Locales** | Compara las estrategias en tiempo real (< 100 ms) al mover cualquier slider |

### 8.2 Estructura obligatoria de cada tarjeta de rotación (Requisito Oficial NASA)
Cada estrategia mostrada en el Paso 3 incluye estos 5 puntos en lenguaje claro:
1. **¿Por qué se sugiere?** *"Alterna una leguminosa de raíz profunda (Chocho) con un cereal resistente (Cebada) y un abono verde (Haba/Vicia) para cortar las plagas de la papa y recuperar nutrientes."*
2. **Evidencia NASA que la respalda:** *"Historial NDVI (Landsat/Sentinel) detectó 2 ciclos seguidos y 4 meses de suelo desnudo; GPM indica 18 % menos lluvia reciente; SRTM marca 14 % de pendiente."*
3. **Beneficios esperados:** *"Cubre el 84 % del agua solo con lluvia, aporta +90 kg N/ha en créditos de abono y reduce la escorrentía."*
4. **Lagunas de información (Incertidumbre):** *"Datos de suelo estimados a 250 m (SoilGrids) y precios agrícolas basados en promedios históricos MAG-SIPA."*
5. **Riesgos a validar con criterio local:** *"Confirmar con el agricultor o técnico del INIAP si hubo nematodo del quiste (Globodera) en el lote y verificar disponibilidad de semilla certificada."*

### 8.3 Reglas de diseño
* Funciona en un celular de gama baja: sin frameworks pesados, Leaflet y Chart.js desde CDN, **menos de 2 MB en total**.
* Todo en español, números con una cifra decimal, unidades locales (**hectáreas y cuadras**, **quintales**).
* Botón *"Ver cómo lo calculamos (Panel Científico NASA)"*: abre el desglose técnico con explicación de términos ($ET_0$, NDVI, NDTI, anomalía SMAP/GPM), tabla de armonización de resoluciones y recordatorio de que la herramienta **apoya pero no reemplaza el criterio del agricultor**.

---

## 9. Parcelas de Demo (Rol 4A + Rol 1)

Dos parcelas reales, una de **Sierra** y una de **Costa**, para demostrar que el mismo motor cambia de recomendación con la altitud y el clima.

| Parcela | Zona propuesta | Altitud aprox. | Historia a declarar | Resultado esperado del motor |
| :--- | :--- | :--- | :--- | :--- |
| **1. Sierra** | Alrededores de Riobamba (Licto, Guano o Colta), Chimborazo | 2.800–3.200 m | Papa 2024, Papa 2025 | Rotación actual en Rojo; recomienda **Chocho o Haba** primero, luego Cebada o Quinua; **papa vetada 3 años** |
| **2. Costa** | Machala o El Guabo, El Oro (zona de ciclo corto, no bananera) | 10–50 m | Maíz duro 2024, Arroz 2025 | Recomienda leguminosa (**Soya, Maní o Caupí**) antes de volver a maíz; alerta de déficit hídrico en jun–nov |

---

## 10. Preguntas Probables del Jurado y Quién Responde

| Pregunta del Jurado | Respuesta Clave | Quién responde |
| :--- | :--- | :--- |
| *¿Cómo armonizan datos satelitales con resoluciones tan distintas (30 m, 250 m, 10 km)?* | Llevamos cada fuente a la unidad de decisión correcta: **30 m (HLS y NASADEM)** se agregan por mediana dentro del polígono de la parcela para pendiente, historia de cultivo y meses de suelo baldío; **250 m (SoilGrids)** da el valor inicial de suelo que se fusiona con el dato terrestre del agricultor; y **10 km (GPM/SMAP)** nunca entra como dato puntual del lote, sino como un factor regional de anomalía que pondera el ahorro de agua. | **Univ. 1 + Colegio 1** |
| *¿Cómo comparan las estrategias propuestas frente a lo que el agricultor ya hace?* | El motor evalúa con las mismas ecuaciones de balance hídrico, nitrógeno y carbono tanto la **secuencia actual del agricultor** como las **3 mejores secuencias alternativas**, mostrando lado a lado cuánta agua se ahorra, qué plagas se interrumpen y cuánto abono natural gana el suelo. | **Univ. 2** |
| *¿Cómo manejan la incertidumbre del satélite y el conocimiento tradicional del agricultor?* | Cada tarjeta declara explícitamente las lagunas de información (resolución de suelo, nubes interpoladas en la Sierra, variación de precios locales) e incluye una sección de riesgos que requieren validación en campo. Además, el agricultor puede sobrescribir el suelo satelital y ajustar sus prioridades en un clic. | **Colegio 2 + Univ. 3** |

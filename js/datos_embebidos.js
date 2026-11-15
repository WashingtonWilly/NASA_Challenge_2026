// datos_embebidos.js — Generado automáticamente desde data/cultivos.json y data/parcelas/*.json
// Garantiza que la demo funcione tanto en servidor como abriendo index.html sin internet.
window.CATALOGO_CULTIVOS = {
  "meta": {
    "version": "1.0.0",
    "fuentes": [
      "FAO-56 (Evapotranspiración del cultivo y coeficientes Kc)",
      "INIAP Ecuador (Guías técnicas de cultivos para Sierra y Costa: Estaciones Santa Catalina y Boliche)",
      "MAG-SIPA Ecuador (Precios referenciales y márgenes brutos aproximados por hectárea)",
      "SIPA-MAG, boletín de precios al productor dic 2025; ESPAC (INEC) 2024–2025 para rendimientos"
    ],
    "unidades": {
      "altitud": "m s.n.m.",
      "ciclo": "días",
      "residuo": "t MS/ha (toneladas de materia seca por hectárea)",
      "credito_n": "kg N/ha dejados para el cultivo siguiente",
      "extraccion_n": "kg N/ha extraídos por cosecha",
      "margen_usd_ha": "USD/ha: rendimiento_t_ha × precio_usd_t − costo_usd_ha (ver campo fuente de cada cultivo)"
    }
  },
  "pausas_familia": {
    "Solanáceas": {
      "anios_min": 3,
      "anios_nematodo": 4,
      "razon": "Globodera pallida (nematodo del quiste), Phytophthora infestans (lancha) y Rhizoctonia solani persisten en el suelo.",
      "mensaje_agricultor": "las plagas del suelo (nematodos y lancha) siguen vivas varios años después de sembrar papa o tomate."
    },
    "Brasicáceas": {
      "anios_min": 4,
      "anios_nematodo": 4,
      "razon": "Plasmodiophora brassicae (hernia de las crucíferas) persiste por años en el suelo.",
      "mensaje_agricultor": "la hernia de la col queda en la tierra hasta por 4 años si se repite brócoli o col."
    },
    "Apiáceas": {
      "anios_min": 3,
      "anios_nematodo": 3,
      "razon": "Alternaria dauci y nematodos agalladores (Meloidogyne).",
      "mensaje_agricultor": "repetir zanahoria multiplica las enfermedades de la raíz y manchas de la hoja."
    },
    "Amarilidáceas": {
      "anios_min": 3,
      "anios_nematodo": 3,
      "razon": "Sclerotium cepivorum (pudrición blanca de la cebolla).",
      "mensaje_agricultor": "el hongo de la pudrición blanca de la cebolla sobrevive 3 años en el lote."
    },
    "Cucurbitáceas": {
      "anios_min": 3,
      "anios_nematodo": 3,
      "razon": "Fusarium oxysporum y complejos virales transmitidos en rastrojo.",
      "mensaje_agricultor": "el hongo que marchita la sandía y el melón permanece activo en el suelo."
    },
    "Fabáceas": {
      "anios_min": 2,
      "anios_nematodo": 2,
      "razon": "Fusarium, Sclerotinia; además se pierde el beneficio de fijación biológica de nitrógeno si se repite seguido.",
      "mensaje_agricultor": "sembrar leguminosas dos años seguidos atrae hongos de raíz y desaprovecha el abono natural que dejaron."
    },
    "Amarantáceas": {
      "anios_min": 2,
      "anios_nematodo": 2,
      "razon": "Peronospora variabilis (mildiu de la quinua).",
      "mensaje_agricultor": "el mildiu de la quinua queda en los rastrojos si se siembra dos años seguidos."
    },
    "Euforbiáceas": {
      "anios_min": 2,
      "anios_nematodo": 2,
      "razon": "Xanthomonas axonopodis (bacteriosis vascular de la yuca) y agotamiento de potasio.",
      "mensaje_agricultor": "repetir yuca agota los nutrientes profundos y propaga la bacteriosis."
    },
    "Poáceas": {
      "anios_min": 1,
      "anios_nematodo": 1,
      "razon": "Baja presión fitosanitaria entre especies distintas; se permite repetir familia una vez con penalización C/N, nunca la misma especie dos veces seguidas.",
      "mensaje_agricultor": "dos cereales de la misma especie seguidos inmovilizan el nitrógeno y empobrecen el suelo."
    },
    "Arroz": {
      "anios_min": 1,
      "anios_nematodo": 1,
      "razon": "Monocultivo frecuente (Pyricularia y malezas resistentes); se penaliza repetir sin rotar con leguminosa.",
      "mensaje_agricultor": "repetir arroz sin rotar con soya o caupí compacta el suelo y multiplica malezas."
    }
  },
  "cultivos": [
    {
      "id": "papa",
      "nombre": "Papa",
      "icono": "🥔",
      "familia": "Solanáceas",
      "raiz_tipo": "Fasciculada, superficial",
      "raiz_estructura": "fasciculada_superficial",
      "alt_min": 2600,
      "alt_max": 3800,
      "ciclo_dias": [
        120,
        150
      ],
      "ciclo_meses": 5,
      "kc": [
        0.5,
        1.15,
        0.75
      ],
      "residuo_t_ha": 1.5,
      "coef_humificacion": 0.1,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 120,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "No",
      "permite_pendiente_alta": false,
      "labranza_intensiva": true,
      "es_forrajero": false,
      "rendimiento_qq_ha": 298,
      "margen_usd_ha": 2080,
      "rol_ecologico": "Tubérculo comercial (alta exigencia de suelo)",
      "explicacion_suelo": "Genera buen ingreso pero remueve intensamente el suelo; requiere descanso de 3–4 años para evitar nematodos y lancha.",
      "precio_usd_t": 280.0,
      "rendimiento_t_ha": 18.5,
      "costo_usd_ha": 3100.0,
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial"
    },
    {
      "id": "maiz_suave",
      "nombre": "Maíz suave (choclo)",
      "icono": "🌽",
      "familia": "Poáceas",
      "raiz_tipo": "Fasciculada, profunda",
      "raiz_estructura": "fasciculada_profunda",
      "alt_min": 2200,
      "alt_max": 3000,
      "ciclo_dias": [
        180,
        240
      ],
      "ciclo_meses": 7,
      "kc": [
        0.3,
        1.15,
        1.05
      ],
      "residuo_t_ha": 6.0,
      "coef_humificacion": 0.2,
      "cn_clase": "alto_cn",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "S1"
      ],
      "tolera_helada": "No",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 110,
      "margen_usd_ha": 846,
      "rol_ecologico": "Alto aporte de rastrojo y carbono",
      "explicacion_suelo": "Sus raíces profundas exploran el subsuelo y deja 6 t/ha de caña que protegen la tierra o sirven de forraje.",
      "precio_usd_t": 620.0,
      "rendimiento_t_ha": 2.8,
      "costo_usd_ha": 890.0,
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial"
    },
    {
      "id": "cebada",
      "nombre": "Cebada",
      "icono": "🌾",
      "familia": "Poáceas",
      "raiz_tipo": "Fasciculada",
      "raiz_estructura": "fasciculada_media",
      "alt_min": 2600,
      "alt_max": 3600,
      "ciclo_dias": [
        150,
        180
      ],
      "ciclo_meses": 5,
      "kc": [
        0.3,
        1.15,
        0.25
      ],
      "residuo_t_ha": 4.0,
      "coef_humificacion": 0.2,
      "cn_clase": "alto_cn",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Sí",
      "permite_pendiente_alta": true,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 48,
      "margen_usd_ha": 316,
      "rol_ecologico": "Cereal rústico tolerante a sequía y heladas",
      "explicacion_suelo": "Cubre rápido las laderas contra la erosión, resiste heladas y aprovecha muy bien el nitrógeno dejado por el chocho o el haba.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 1.9,
      "precio_usd_t": 440.0,
      "costo_usd_ha": 520.0
    },
    {
      "id": "trigo",
      "nombre": "Trigo",
      "icono": "🌾",
      "familia": "Poáceas",
      "raiz_tipo": "Fasciculada",
      "raiz_estructura": "fasciculada_media",
      "alt_min": 2400,
      "alt_max": 3200,
      "ciclo_dias": [
        150,
        180
      ],
      "ciclo_meses": 6,
      "kc": [
        0.3,
        1.15,
        0.25
      ],
      "residuo_t_ha": 4.0,
      "coef_humificacion": 0.2,
      "cn_clase": "alto_cn",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "S1"
      ],
      "tolera_helada": "Sí",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 37,
      "margen_usd_ha": 605,
      "rol_ecologico": "Formador de materia orgánica estable",
      "explicacion_suelo": "Deja 4 t/ha de paja con alta relación carbono/nitrógeno que forma humus duradero cuando sigue a una leguminosa.",
      "precio_usd_t": null,
      "rendimiento_t_ha": 1.7,
      "costo_usd_ha": null,
      "estado_economico": "parcial",
      "fuente": "Precio: estimado | Rendimiento: Promedio nacional (dato del equipo) | Costo: estimado"
    },
    {
      "id": "quinua",
      "nombre": "Quinua",
      "icono": "🌿",
      "familia": "Amarantáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 2600,
      "alt_max": 3600,
      "ciclo_dias": [
        150,
        180
      ],
      "ciclo_meses": 6,
      "kc": [
        0.5,
        1.0,
        0.7
      ],
      "residuo_t_ha": 2.5,
      "coef_humificacion": 0.2,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "S1"
      ],
      "tolera_helada": "Sí",
      "permite_pendiente_alta": true,
      "labranza_intensiva": false,
      "es_forrajero": false,
      "rendimiento_qq_ha": 38,
      "margen_usd_ha": 878,
      "rol_ecologico": "Tolerante a sequía, heladas y suelos andinos",
      "explicacion_suelo": "Con bajo requerimiento hídrico (Kc medio 1.00) y raíz pivotante, rompe el ciclo de plagas de cereales y papa.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 1.45,
      "precio_usd_t": 1150.0,
      "costo_usd_ha": 790.0
    },
    {
      "id": "chocho",
      "nombre": "Chocho (tarwi)",
      "icono": "🫘",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante, profunda",
      "raiz_estructura": "pivotante_profunda",
      "alt_min": 2600,
      "alt_max": 3600,
      "ciclo_dias": [
        180,
        240
      ],
      "ciclo_meses": 7,
      "kc": [
        0.4,
        1.0,
        0.5
      ],
      "residuo_t_ha": 3.5,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 50,
      "extraccion_n_kg": 0,
      "siembra": [
        "S1"
      ],
      "tolera_helada": "Moderada",
      "permite_pendiente_alta": true,
      "labranza_intensiva": false,
      "es_forrajero": false,
      "rendimiento_qq_ha": 32,
      "margen_usd_ha": 858,
      "rol_ecologico": "Fijador de Nitrógeno (+50 kg/ha) y raíz descompactadora",
      "explicacion_suelo": "Su raíz pivotante profunda rompe capas duras, fija 50 kg N/ha gratis del aire y sus alcaloides reducen nematodos del suelo.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 1.15,
      "precio_usd_t": 1250.0,
      "costo_usd_ha": 580.0
    },
    {
      "id": "haba",
      "nombre": "Haba",
      "icono": "🫛",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 2600,
      "alt_max": 3600,
      "ciclo_dias": [
        150,
        180
      ],
      "ciclo_meses": 6,
      "kc": [
        0.5,
        1.15,
        1.1
      ],
      "residuo_t_ha": 2.5,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 40,
      "extraccion_n_kg": 0,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Sí",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 65,
      "margen_usd_ha": 908,
      "rol_ecologico": "Fijador de Nitrógeno (+40 kg/ha) tolerante al frío",
      "explicacion_suelo": "Enriquece el suelo con 40 kg N/ha de rápida liberación (baja relación C/N) ideal antes de sembrar cebada, trigo o quinua.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 3.2,
      "precio_usd_t": 540.0,
      "costo_usd_ha": 820.0
    },
    {
      "id": "arveja",
      "nombre": "Arveja",
      "icono": "🫛",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 2400,
      "alt_max": 3200,
      "ciclo_dias": [
        90,
        120
      ],
      "ciclo_meses": 4,
      "kc": [
        0.5,
        1.15,
        1.1
      ],
      "residuo_t_ha": 1.5,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 25,
      "extraccion_n_kg": 0,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Moderada",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 55,
      "margen_usd_ha": 1176,
      "rol_ecologico": "Leguminosa de ciclo corto (+25 kg N/ha)",
      "explicacion_suelo": "Cosecha en 3–4 meses ahorrando agua en campañas cortas y dejando +25 kg N/ha disponibles.",
      "precio_usd_t": 772,
      "rendimiento_t_ha": 2.49,
      "costo_usd_ha": 746,
      "estado_economico": "parcial",
      "fuente": "Precio: Boletín de precios al productor SIPA-MAG, dic 2025 (arveja tierna, 38,50 USD/bulto de 110 lb) | Rendimiento: estimado | Costo: estimado (costo implícito en el margen anterior del equipo)"
    },
    {
      "id": "frejol_arbustivo",
      "nombre": "Fréjol arbustivo",
      "icono": "🫘",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 1200,
      "alt_max": 2800,
      "ciclo_dias": [
        90,
        110
      ],
      "ciclo_meses": 4,
      "kc": [
        0.4,
        1.15,
        0.35
      ],
      "residuo_t_ha": 1.5,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 25,
      "extraccion_n_kg": 0,
      "siembra": [
        "S2",
        "C1"
      ],
      "tolera_helada": "No",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": false,
      "rendimiento_qq_ha": 35,
      "margen_usd_ha": 1150,
      "rol_ecologico": "Fijador rápido de Nitrógeno (+25 kg/ha)",
      "explicacion_suelo": "Ideal para valles interandinos; aporta nitrógeno y requiere poca agua al final de su ciclo (Kc 0.35).",
      "estado_economico": "estimado",
      "fuente": "Estimado por el equipo (precio, rendimiento y margen por verificar con MAG-SIPA)"
    },
    {
      "id": "brocoli",
      "nombre": "Brócoli / col",
      "icono": "🥦",
      "familia": "Brasicáceas",
      "raiz_tipo": "Pivotante, superficial",
      "raiz_estructura": "pivotante_superficial",
      "alt_min": 2400,
      "alt_max": 3200,
      "ciclo_dias": [
        90,
        120
      ],
      "ciclo_meses": 4,
      "kc": [
        0.7,
        1.05,
        0.95
      ],
      "residuo_t_ha": 2.5,
      "coef_humificacion": 0.1,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Moderada",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 280,
      "margen_usd_ha": 1895,
      "rol_ecologico": "Biofumigante natural (glucosinolatos)",
      "explicacion_suelo": "Sus residuos ayudan a reducir hongos de la papa, pero exige 4 años de pausa para evitar la hernia de las coles.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "precio_usd_t": 310.0,
      "rendimiento_t_ha": 14.5,
      "costo_usd_ha": 2600.0
    },
    {
      "id": "zanahoria",
      "nombre": "Zanahoria",
      "icono": "🥕",
      "familia": "Apiáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 2200,
      "alt_max": 3200,
      "ciclo_dias": [
        100,
        150
      ],
      "ciclo_meses": 5,
      "kc": [
        0.7,
        1.05,
        0.95
      ],
      "residuo_t_ha": 1.0,
      "coef_humificacion": 0.1,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Moderada",
      "permite_pendiente_alta": false,
      "labranza_intensiva": true,
      "es_forrajero": false,
      "rendimiento_qq_ha": 350,
      "margen_usd_ha": 1830,
      "rol_ecologico": "Hortaliza de raíz (alternativa comercial a la papa)",
      "explicacion_suelo": "Rompe ciclos de plagas de Solanáceas y Poáceas, pero deja poco rastrojo y no debe sembrarse en pendientes > 25 %.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 19.0,
      "precio_usd_t": 220.0,
      "costo_usd_ha": 2350.0
    },
    {
      "id": "cebolla",
      "nombre": "Cebolla",
      "icono": "🧅",
      "familia": "Amarilidáceas",
      "raiz_tipo": "Fasciculada, superficial",
      "raiz_estructura": "fasciculada_superficial",
      "alt_min": 2000,
      "alt_max": 3200,
      "ciclo_dias": [
        120,
        150
      ],
      "ciclo_meses": 5,
      "kc": [
        0.7,
        1.05,
        0.75
      ],
      "residuo_t_ha": 0.8,
      "coef_humificacion": 0.1,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Moderada",
      "permite_pendiente_alta": false,
      "labranza_intensiva": true,
      "es_forrajero": false,
      "rendimiento_qq_ha": 310,
      "margen_usd_ha": 2490,
      "rol_ecologico": "Hortaliza de alto valor comercial",
      "explicacion_suelo": "Sus compuestos azufrados reducen ciertos patógenos, pero aporta muy poca cobertura orgánica al suelo.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 16.0,
      "precio_usd_t": 340.0,
      "costo_usd_ha": 2950.0
    },
    {
      "id": "avena_forrajera",
      "nombre": "Avena forrajera (cobertura)",
      "icono": "🌱",
      "familia": "Poáceas",
      "raiz_tipo": "Fasciculada",
      "raiz_estructura": "fasciculada_media",
      "alt_min": 2400,
      "alt_max": 3600,
      "ciclo_dias": [
        90,
        120
      ],
      "ciclo_meses": 4,
      "kc": [
        0.3,
        1.15,
        0.3
      ],
      "residuo_t_ha": 5.0,
      "coef_humificacion": 0.2,
      "cn_clase": "alto_cn",
      "credito_n_kg": 0,
      "extraccion_n_kg": 60,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Sí",
      "permite_pendiente_alta": true,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 420,
      "margen_usd_ha": 339,
      "rol_ecologico": "Cobertura antierosión y alto valor forrajero",
      "explicacion_suelo": "Amarra el suelo en laderas pronunciadas (> 25 %), aporta 5 t/ha de biomasa y alimenta al ganado en época seca.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 2.1,
      "precio_usd_t": 390.0,
      "costo_usd_ha": 480.0
    },
    {
      "id": "vicia",
      "nombre": "Vicia (abono verde)",
      "icono": "🍀",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 2400,
      "alt_max": 3600,
      "ciclo_dias": [
        90,
        120
      ],
      "ciclo_meses": 4,
      "kc": [
        0.4,
        1.0,
        0.9
      ],
      "residuo_t_ha": 4.0,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 70,
      "extraccion_n_kg": 0,
      "siembra": [
        "S1",
        "S2"
      ],
      "tolera_helada": "Sí",
      "permite_pendiente_alta": true,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 360,
      "margen_usd_ha": 120,
      "rol_ecologico": "Abono verde estrella (+70 kg N/ha y cobertura total)",
      "explicacion_suelo": "Incorporada al suelo inyecta 70 kg N/ha y 1 t/ha de humus estable, regenerando lotes agotados por monocultivo.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 0.0,
      "precio_usd_t": 0.0,
      "costo_usd_ha": 240.0
    },
    {
      "id": "arroz",
      "nombre": "Arroz",
      "icono": "🌾",
      "familia": "Arroz",
      "raiz_tipo": "Fasciculada",
      "raiz_estructura": "fasciculada_superficial",
      "alt_min": 0,
      "alt_max": 1200,
      "ciclo_dias": [
        120,
        150
      ],
      "ciclo_meses": 5,
      "kc": [
        1.05,
        1.2,
        0.9
      ],
      "residuo_t_ha": 5.0,
      "coef_humificacion": 0.2,
      "cn_clase": "alto_cn",
      "credito_n_kg": 0,
      "extraccion_n_kg": 110,
      "siembra": [
        "C1",
        "C2"
      ],
      "tolera_helada": "No aplica",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 123,
      "margen_usd_ha": 614,
      "rol_ecologico": "Cereal de alta demanda hídrica (zonas bajas)",
      "explicacion_suelo": "Aporta abundante tamo (5 t/ha), pero su alta demanda de agua exige rotarlo con soya o caupí en verano.",
      "precio_usd_t": 345.0,
      "rendimiento_t_ha": 5.2,
      "costo_usd_ha": 1180.0,
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial"
    },
    {
      "id": "maiz_duro",
      "nombre": "Maíz duro",
      "icono": "🌽",
      "familia": "Poáceas",
      "raiz_tipo": "Fasciculada, profunda",
      "raiz_estructura": "fasciculada_profunda",
      "alt_min": 0,
      "alt_max": 1500,
      "ciclo_dias": [
        110,
        130
      ],
      "ciclo_meses": 4,
      "kc": [
        0.3,
        1.2,
        0.6
      ],
      "residuo_t_ha": 6.0,
      "coef_humificacion": 0.2,
      "cn_clase": "alto_cn",
      "credito_n_kg": 0,
      "extraccion_n_kg": 110,
      "siembra": [
        "C1",
        "C2"
      ],
      "tolera_helada": "No aplica",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 139,
      "margen_usd_ha": 867,
      "rol_ecologico": "Raíz profunda y máximo aporte de rastrojo (6 t/ha)",
      "explicacion_suelo": "Su rastrojo protege el suelo costero de lluvias intensas, pero necesita una leguminosa previa para no agotar el nitrógeno.",
      "precio_usd_t": 365.0,
      "rendimiento_t_ha": 5.8,
      "costo_usd_ha": 1250.0,
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial"
    },
    {
      "id": "soya",
      "nombre": "Soya",
      "icono": "🫘",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 0,
      "alt_max": 1000,
      "ciclo_dias": [
        100,
        120
      ],
      "ciclo_meses": 4,
      "kc": [
        0.4,
        1.15,
        0.5
      ],
      "residuo_t_ha": 2.5,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 30,
      "extraccion_n_kg": 0,
      "siembra": [
        "C1",
        "C2"
      ],
      "tolera_helada": "No aplica",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 58,
      "margen_usd_ha": 1190,
      "rol_ecologico": "Fijador de Nitrógeno (+30 kg/ha) para rotación en Costa",
      "explicacion_suelo": "Corta el ciclo de plagas del maíz y arroz, dejando +30 kg N/ha de rápida mineralización.",
      "estado_economico": "estimado",
      "fuente": "Estimado por el equipo (precio, rendimiento y margen por verificar con MAG-SIPA)"
    },
    {
      "id": "mani",
      "nombre": "Maní",
      "icono": "🥜",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 0,
      "alt_max": 1200,
      "ciclo_dias": [
        120,
        140
      ],
      "ciclo_meses": 5,
      "kc": [
        0.4,
        1.15,
        0.6
      ],
      "residuo_t_ha": 2.5,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 25,
      "extraccion_n_kg": 0,
      "siembra": [
        "C1",
        "C2"
      ],
      "tolera_helada": "No aplica",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 52,
      "margen_usd_ha": 930,
      "rol_ecologico": "Leguminosa rústica fijadora de N (+25 kg/ha)",
      "explicacion_suelo": "Cubre densamente el suelo reduciendo la evaporación, fija nitrógeno y deja follaje nutritivo.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 1.8,
      "precio_usd_t": 1100.0,
      "costo_usd_ha": 1050.0
    },
    {
      "id": "yuca",
      "nombre": "Yuca",
      "icono": "🪵",
      "familia": "Euforbiáceas",
      "raiz_tipo": "Tuberosa, profunda",
      "raiz_estructura": "tuberosa_profunda",
      "alt_min": 0,
      "alt_max": 1800,
      "ciclo_dias": [
        300,
        360
      ],
      "ciclo_meses": 10,
      "kc": [
        0.3,
        0.8,
        0.3
      ],
      "residuo_t_ha": 2.5,
      "coef_humificacion": 0.1,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 100,
      "siembra": [
        "C1"
      ],
      "tolera_helada": "No aplica",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": false,
      "rendimiento_qq_ha": 290,
      "margen_usd_ha": 1490,
      "rol_ecologico": "Alta tolerancia a sequía (Kc medio 0.80)",
      "explicacion_suelo": "Resiste meses secos con bajo consumo mensual de agua, aunque exige rotar después con leguminosas para reponer nutrientes.",
      "precio_usd_t": 210.0,
      "rendimiento_t_ha": 14.0,
      "costo_usd_ha": 1450.0,
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial"
    },
    {
      "id": "sandia",
      "nombre": "Sandía / melón",
      "icono": "🍉",
      "familia": "Cucurbitáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 0,
      "alt_max": 800,
      "ciclo_dias": [
        90,
        100
      ],
      "ciclo_meses": 3,
      "kc": [
        0.4,
        1.0,
        0.75
      ],
      "residuo_t_ha": 1.0,
      "coef_humificacion": 0.1,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 90,
      "siembra": [
        "C2"
      ],
      "tolera_helada": "No aplica",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": false,
      "rendimiento_qq_ha": 380,
      "margen_usd_ha": 1990,
      "rol_ecologico": "Ciclo corto de alto retorno económico",
      "explicacion_suelo": "Diversifica ingresos en la campaña seca (C2), pero requiere 3 años de pausa para evitar Fusarium.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "rendimiento_t_ha": 22.0,
      "precio_usd_t": 195.0,
      "costo_usd_ha": 2300.0
    },
    {
      "id": "tomate_rinon",
      "nombre": "Tomate riñón",
      "icono": "🍅",
      "familia": "Solanáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_media",
      "alt_min": 0,
      "alt_max": 2400,
      "ciclo_dias": [
        120,
        150
      ],
      "ciclo_meses": 5,
      "kc": [
        0.6,
        1.15,
        0.8
      ],
      "residuo_t_ha": 1.5,
      "coef_humificacion": 0.1,
      "cn_clase": "medio",
      "credito_n_kg": 0,
      "extraccion_n_kg": 110,
      "siembra": [
        "C1",
        "C2",
        "S2"
      ],
      "tolera_helada": "No",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": false,
      "rendimiento_qq_ha": 410,
      "margen_usd_ha": 2560,
      "rol_ecologico": "Hortaliza de alta rentabilidad (exige rotación estricta)",
      "explicacion_suelo": "Comparte familia con la papa (Solanáceas); requiere 3–4 años sin repetir para evitar marchitez y nematodos.",
      "estado_economico": "oficial",
      "fuente": "SIPA-MAG Ecuador (data/precios_mag_sipa.json): rendimiento, precio productor y margen bruto referencial",
      "precio_usd_t": 290.0,
      "rendimiento_t_ha": 24.0,
      "costo_usd_ha": 4400.0
    },
    {
      "id": "caupi",
      "nombre": "Caupí / fréjol de palo",
      "icono": "🫘",
      "familia": "Fabáceas",
      "raiz_tipo": "Pivotante",
      "raiz_estructura": "pivotante_profunda",
      "alt_min": 0,
      "alt_max": 1000,
      "ciclo_dias": [
        70,
        90
      ],
      "ciclo_meses": 3,
      "kc": [
        0.4,
        1.05,
        0.35
      ],
      "residuo_t_ha": 1.5,
      "coef_humificacion": 0.25,
      "cn_clase": "bajo_cn",
      "credito_n_kg": 25,
      "extraccion_n_kg": 0,
      "siembra": [
        "C2"
      ],
      "tolera_helada": "No aplica",
      "permite_pendiente_alta": false,
      "labranza_intensiva": false,
      "es_forrajero": true,
      "rendimiento_qq_ha": 34,
      "margen_usd_ha": 1080,
      "rol_ecologico": "Campeón contra la sequía en Costa (+25 kg N/ha en 80 días)",
      "explicacion_suelo": "Su ciclo ultracorto (70–90 días) y bajo Kc final (0.35) permite cubrir el suelo en verano seco fijando nitrógeno.",
      "estado_economico": "estimado",
      "fuente": "Estimado por el equipo (precio, rendimiento y margen por verificar con MAG-SIPA)"
    }
  ]
};

window.PARCELAS_DEMO = {
  "parcela_licto": {
    "id": "parcela_licto",
    "nombre": "Parcela 1 — Licto (Riobamba, Chimborazo)",
    "region": "Sierra",
    "ubicacion_texto": "Licto, Riobamba, Chimborazo",
    "geometria": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -78.61253,
            -1.80077
          ],
          [
            -78.61127,
            -1.80077
          ],
          [
            -78.61127,
            -1.80203
          ],
          [
            -78.61253,
            -1.80203
          ],
          [
            -78.61253,
            -1.80077
          ]
        ]
      ]
    },
    "area_ha": 2.0,
    "centroide": {
      "lat": -1.8014,
      "lon": -78.6119
    },
    "terreno": {
      "elev_m": 2900,
      "pendiente_pct": 12.0,
      "pendiente_max_pct": 18.0,
      "orientacion": "SE"
    },
    "clima_mensual": [
      {
        "mes": 1,
        "nombre_mes": "Ene",
        "P_mm": 140.5,
        "ET0_mm": 76.2,
        "Tmin_abs": 4.6,
        "Tmed": 12.4,
        "Rs_MJ": 14.3,
        "Viento_ms": 1.8,
        "HR_pct": 85
      },
      {
        "mes": 2,
        "nombre_mes": "Feb",
        "P_mm": 157.0,
        "ET0_mm": 65.8,
        "Tmin_abs": 6.1,
        "Tmed": 12.6,
        "Rs_MJ": 13.3,
        "Viento_ms": 1.8,
        "HR_pct": 87
      },
      {
        "mes": 3,
        "nombre_mes": "Mar",
        "P_mm": 183.6,
        "ET0_mm": 70.1,
        "Tmin_abs": 6.0,
        "Tmed": 12.5,
        "Rs_MJ": 12.8,
        "Viento_ms": 1.7,
        "HR_pct": 88
      },
      {
        "mes": 4,
        "nombre_mes": "Abr",
        "P_mm": 192.3,
        "ET0_mm": 69.3,
        "Tmin_abs": 5.4,
        "Tmed": 12.4,
        "Rs_MJ": 13.5,
        "Viento_ms": 2.0,
        "HR_pct": 87
      },
      {
        "mes": 5,
        "nombre_mes": "May",
        "P_mm": 166.8,
        "ET0_mm": 68.6,
        "Tmin_abs": 4.6,
        "Tmed": 12.1,
        "Rs_MJ": 13.2,
        "Viento_ms": 2.5,
        "HR_pct": 86
      },
      {
        "mes": 6,
        "nombre_mes": "Jun",
        "P_mm": 162.9,
        "ET0_mm": 63.8,
        "Tmin_abs": 2.8,
        "Tmed": 11.1,
        "Rs_MJ": 13.0,
        "Viento_ms": 3.1,
        "HR_pct": 85
      },
      {
        "mes": 7,
        "nombre_mes": "Jul",
        "P_mm": 102.9,
        "ET0_mm": 67.8,
        "Tmin_abs": 2.0,
        "Tmed": 10.8,
        "Rs_MJ": 13.1,
        "Viento_ms": 3.5,
        "HR_pct": 83
      },
      {
        "mes": 8,
        "nombre_mes": "Ago",
        "P_mm": 100.2,
        "ET0_mm": 77.1,
        "Tmin_abs": 2.3,
        "Tmed": 11.1,
        "Rs_MJ": 14.7,
        "Viento_ms": 3.3,
        "HR_pct": 81
      },
      {
        "mes": 9,
        "nombre_mes": "Sep",
        "P_mm": 68.4,
        "ET0_mm": 81.9,
        "Tmin_abs": 1.9,
        "Tmed": 11.6,
        "Rs_MJ": 15.6,
        "Viento_ms": 2.8,
        "HR_pct": 79
      },
      {
        "mes": 10,
        "nombre_mes": "Oct",
        "P_mm": 151.4,
        "ET0_mm": 84.0,
        "Tmin_abs": 3.7,
        "Tmed": 12.5,
        "Rs_MJ": 15.5,
        "Viento_ms": 1.9,
        "HR_pct": 82
      },
      {
        "mes": 11,
        "nombre_mes": "Nov",
        "P_mm": 130.2,
        "ET0_mm": 79.6,
        "Tmin_abs": 5.3,
        "Tmed": 12.6,
        "Rs_MJ": 15.3,
        "Viento_ms": 1.7,
        "HR_pct": 83
      },
      {
        "mes": 12,
        "nombre_mes": "Dic",
        "P_mm": 135.0,
        "ET0_mm": 77.6,
        "Tmin_abs": 4.6,
        "Tmed": 12.6,
        "Rs_MJ": 14.4,
        "Viento_ms": 1.8,
        "HR_pct": 84
      }
    ],
    "anomalia": {
      "fuente": "NASA POWER · PRECTOTCORR",
      "res_km": 50,
      "pct": 120,
      "ventana": "ago–oct 2026",
      "lluvia_reciente_mm": 611,
      "lluvia_normal_mm": 278,
      "anios_referencia": "2001–2025",
      "mensaje": "Su zona viene 120 % más lluviosa que un año normal (ago–oct 2026: 611 mm frente a 278 mm de promedio, NASA POWER, ~50 km). Suelo saturado: revise drenajes, evite labranza con el suelo mojado y vigile hongos (lancha, pudriciones) antes de sembrar."
    },
    "suelo": {
      "fuente": "ISRIC SoilGrids 250 m (0–30 cm)",
      "textura": "Franco",
      "arcilla_pct": 21.1,
      "arena_pct": 42.7,
      "ph": 6.3,
      "soc_pct": 4.11,
      "n_gkg": 3.76,
      "editado_por_usuario": false,
      "es_andisol": true
    },
    "ndvi_mensual": [
      {
        "mes": "2023-11",
        "ndvi": 0.34,
        "ndti": 0.11,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2023-12",
        "ndvi": 0.58,
        "ndti": 0.08,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-01",
        "ndvi": 0.72,
        "ndti": 0.06,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-02",
        "ndvi": 0.76,
        "ndti": 0.05,
        "n_obs": 1,
        "interpolado": true
      },
      {
        "mes": "2024-03",
        "ndvi": 0.68,
        "ndti": 0.07,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-04",
        "ndvi": 0.45,
        "ndti": 0.12,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-05",
        "ndvi": 0.24,
        "ndti": 0.16,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-06",
        "ndvi": 0.21,
        "ndti": 0.15,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-07",
        "ndvi": 0.19,
        "ndti": 0.11,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-08",
        "ndvi": 0.18,
        "ndti": 0.09,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-09",
        "ndvi": 0.22,
        "ndti": 0.08,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-10",
        "ndvi": 0.31,
        "ndti": 0.1,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-11",
        "ndvi": 0.56,
        "ndti": 0.07,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-12",
        "ndvi": 0.69,
        "ndti": 0.06,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-01",
        "ndvi": 0.74,
        "ndti": 0.05,
        "n_obs": 1,
        "interpolado": true
      },
      {
        "mes": "2025-02",
        "ndvi": 0.71,
        "ndti": 0.06,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-03",
        "ndvi": 0.59,
        "ndti": 0.08,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-04",
        "ndvi": 0.33,
        "ndti": 0.14,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-05",
        "ndvi": 0.22,
        "ndti": 0.15,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-06",
        "ndvi": 0.2,
        "ndti": 0.12,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-07",
        "ndvi": 0.19,
        "ndti": 0.1,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-08",
        "ndvi": 0.18,
        "ndti": 0.08,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-09",
        "ndvi": 0.21,
        "ndti": 0.08,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-10",
        "ndvi": 0.27,
        "ndti": 0.09,
        "n_obs": 2,
        "interpolado": false
      }
    ],
    "historia_inferida": [
      {
        "anio": 2023,
        "ciclos": 0,
        "meses_cultivo": [
          12
        ],
        "meses_desnudo": [],
        "meses_residuo": []
      },
      {
        "anio": 2024,
        "ciclos": 2,
        "meses_cultivo": [
          1,
          2,
          3,
          11,
          12
        ],
        "meses_desnudo": [
          5,
          6,
          7,
          8,
          9
        ],
        "meses_residuo": [
          5,
          6
        ]
      },
      {
        "anio": 2025,
        "ciclos": 1,
        "meses_cultivo": [
          1,
          2,
          3
        ],
        "meses_desnudo": [
          5,
          6,
          7,
          8,
          9
        ],
        "meses_residuo": [
          5
        ]
      }
    ],
    "historia_declarada": [
      "papa",
      "papa"
    ],
    "nematodo_declarado": false,
    "clima_metodo_et0": "Penman-Monteith FAO-56 (radiación, viento y humedad de NASA POWER)",
    "estado_datos": {
      "clima": "NASA POWER 2015–2026 (diario, AG); T corregida +0.6 °C por altitud (celda a 2983.94 m)",
      "anomalia": "NASA POWER PRECTOTCORR, ago–oct 2026 vs 2001–2025",
      "suelo": "ISRIC SoilGrids 250 m (0–30 cm)",
      "ndvi": "EJEMPLO (dato provisional, falta dato real)",
      "smap": "sin dato",
      "terreno": "EJEMPLO (verificar con NASADEM 30 m)"
    }
  },
  "parcela_guano": {
    "id": "parcela_guano",
    "nombre": "Parcela 2 — Guano / San Andrés (Chimborazo)",
    "region": "Sierra",
    "ubicacion_texto": "San Andrés, Guano, Chimborazo",
    "geometria": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -78.58843,
            -1.63687
          ],
          [
            -78.58717,
            -1.63687
          ],
          [
            -78.58717,
            -1.63813
          ],
          [
            -78.58843,
            -1.63813
          ],
          [
            -78.58843,
            -1.63687
          ]
        ]
      ]
    },
    "area_ha": 2.0,
    "centroide": {
      "lat": -1.6375,
      "lon": -78.5878
    },
    "terreno": {
      "elev_m": 2850,
      "pendiente_pct": 8.0,
      "pendiente_max_pct": 14.0,
      "orientacion": "S"
    },
    "clima_mensual": [
      {
        "mes": 1,
        "nombre_mes": "Ene",
        "P_mm": 152.1,
        "ET0_mm": 75.4,
        "Tmin_abs": 4.6,
        "Tmed": 12.5,
        "Rs_MJ": 14.3,
        "Viento_ms": 1.6,
        "HR_pct": 87
      },
      {
        "mes": 2,
        "nombre_mes": "Feb",
        "P_mm": 162.2,
        "ET0_mm": 65.4,
        "Tmin_abs": 6.2,
        "Tmed": 12.8,
        "Rs_MJ": 13.3,
        "Viento_ms": 1.5,
        "HR_pct": 89
      },
      {
        "mes": 3,
        "nombre_mes": "Mar",
        "P_mm": 193.9,
        "ET0_mm": 69.5,
        "Tmin_abs": 6.0,
        "Tmed": 12.6,
        "Rs_MJ": 12.8,
        "Viento_ms": 1.5,
        "HR_pct": 89
      },
      {
        "mes": 4,
        "nombre_mes": "Abr",
        "P_mm": 194.1,
        "ET0_mm": 69.1,
        "Tmin_abs": 6.0,
        "Tmed": 12.7,
        "Rs_MJ": 13.5,
        "Viento_ms": 1.7,
        "HR_pct": 89
      },
      {
        "mes": 5,
        "nombre_mes": "May",
        "P_mm": 167.3,
        "ET0_mm": 68.2,
        "Tmin_abs": 4.7,
        "Tmed": 12.4,
        "Rs_MJ": 13.2,
        "Viento_ms": 2.2,
        "HR_pct": 88
      },
      {
        "mes": 6,
        "nombre_mes": "Jun",
        "P_mm": 165.8,
        "ET0_mm": 63.2,
        "Tmin_abs": 3.2,
        "Tmed": 11.4,
        "Rs_MJ": 13.0,
        "Viento_ms": 2.8,
        "HR_pct": 86
      },
      {
        "mes": 7,
        "nombre_mes": "Jul",
        "P_mm": 102.2,
        "ET0_mm": 66.8,
        "Tmin_abs": 2.8,
        "Tmed": 11.1,
        "Rs_MJ": 13.1,
        "Viento_ms": 3.2,
        "HR_pct": 85
      },
      {
        "mes": 8,
        "nombre_mes": "Ago",
        "P_mm": 95.9,
        "ET0_mm": 75.9,
        "Tmin_abs": 2.5,
        "Tmed": 11.4,
        "Rs_MJ": 14.7,
        "Viento_ms": 2.9,
        "HR_pct": 83
      },
      {
        "mes": 9,
        "nombre_mes": "Sep",
        "P_mm": 66.4,
        "ET0_mm": 80.8,
        "Tmin_abs": 2.7,
        "Tmed": 11.9,
        "Rs_MJ": 15.6,
        "Viento_ms": 2.5,
        "HR_pct": 81
      },
      {
        "mes": 10,
        "nombre_mes": "Oct",
        "P_mm": 164.3,
        "ET0_mm": 83.4,
        "Tmin_abs": 4.2,
        "Tmed": 12.8,
        "Rs_MJ": 15.5,
        "Viento_ms": 1.7,
        "HR_pct": 84
      },
      {
        "mes": 11,
        "nombre_mes": "Nov",
        "P_mm": 131.2,
        "ET0_mm": 78.6,
        "Tmin_abs": 5.3,
        "Tmed": 12.7,
        "Rs_MJ": 15.3,
        "Viento_ms": 1.5,
        "HR_pct": 85
      },
      {
        "mes": 12,
        "nombre_mes": "Dic",
        "P_mm": 136.8,
        "ET0_mm": 76.5,
        "Tmin_abs": 5.0,
        "Tmed": 12.7,
        "Rs_MJ": 14.4,
        "Viento_ms": 1.6,
        "HR_pct": 86
      }
    ],
    "anomalia": {
      "fuente": "NASA POWER · PRECTOTCORR",
      "res_km": 50,
      "pct": 171,
      "ventana": "ago–oct 2026",
      "lluvia_reciente_mm": 730,
      "lluvia_normal_mm": 270,
      "anios_referencia": "2001–2025",
      "mensaje": "Su zona viene 171 % más lluviosa que un año normal (ago–oct 2026: 730 mm frente a 270 mm de promedio, NASA POWER, ~50 km). Suelo saturado: revise drenajes, evite labranza con el suelo mojado y vigile hongos (lancha, pudriciones) antes de sembrar."
    },
    "suelo": {
      "fuente": "ISRIC SoilGrids 250 m (0–30 cm)",
      "textura": "Franco",
      "arcilla_pct": 21.7,
      "arena_pct": 41.9,
      "ph": 6.0,
      "soc_pct": 4.34,
      "n_gkg": 3.1,
      "editado_por_usuario": false,
      "es_andisol": true
    },
    "ndvi_mensual": [
      {
        "mes": "2023-11",
        "ndvi": 0.34,
        "ndti": 0.11,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2023-12",
        "ndvi": 0.58,
        "ndti": 0.08,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-01",
        "ndvi": 0.72,
        "ndti": 0.06,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-02",
        "ndvi": 0.76,
        "ndti": 0.05,
        "n_obs": 1,
        "interpolado": true
      },
      {
        "mes": "2024-03",
        "ndvi": 0.68,
        "ndti": 0.07,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-04",
        "ndvi": 0.45,
        "ndti": 0.12,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-05",
        "ndvi": 0.24,
        "ndti": 0.16,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-06",
        "ndvi": 0.21,
        "ndti": 0.15,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-07",
        "ndvi": 0.19,
        "ndti": 0.11,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-08",
        "ndvi": 0.18,
        "ndti": 0.09,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-09",
        "ndvi": 0.22,
        "ndti": 0.08,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-10",
        "ndvi": 0.31,
        "ndti": 0.1,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-11",
        "ndvi": 0.56,
        "ndti": 0.07,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-12",
        "ndvi": 0.69,
        "ndti": 0.06,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-01",
        "ndvi": 0.74,
        "ndti": 0.05,
        "n_obs": 1,
        "interpolado": true
      },
      {
        "mes": "2025-02",
        "ndvi": 0.71,
        "ndti": 0.06,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-03",
        "ndvi": 0.59,
        "ndti": 0.08,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-04",
        "ndvi": 0.33,
        "ndti": 0.14,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-05",
        "ndvi": 0.22,
        "ndti": 0.15,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-06",
        "ndvi": 0.2,
        "ndti": 0.12,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-07",
        "ndvi": 0.19,
        "ndti": 0.1,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-08",
        "ndvi": 0.18,
        "ndti": 0.08,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-09",
        "ndvi": 0.21,
        "ndti": 0.08,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-10",
        "ndvi": 0.27,
        "ndti": 0.09,
        "n_obs": 2,
        "interpolado": false
      }
    ],
    "historia_inferida": [
      {
        "anio": 2023,
        "ciclos": 0,
        "meses_cultivo": [
          12
        ],
        "meses_desnudo": [],
        "meses_residuo": []
      },
      {
        "anio": 2024,
        "ciclos": 2,
        "meses_cultivo": [
          1,
          2,
          3,
          11,
          12
        ],
        "meses_desnudo": [
          5,
          6,
          7,
          8,
          9
        ],
        "meses_residuo": [
          5,
          6
        ]
      },
      {
        "anio": 2025,
        "ciclos": 1,
        "meses_cultivo": [
          1,
          2,
          3
        ],
        "meses_desnudo": [
          5,
          6,
          7,
          8,
          9
        ],
        "meses_residuo": [
          5
        ]
      }
    ],
    "historia_declarada": [
      "maiz_suave",
      "papa"
    ],
    "nematodo_declarado": false,
    "clima_metodo_et0": "Penman-Monteith FAO-56 (radiación, viento y humedad de NASA POWER)",
    "estado_datos": {
      "clima": "NASA POWER 2015–2026 (diario, AG); T corregida +1.0 °C por altitud (celda a 3003.46 m)",
      "anomalia": "NASA POWER PRECTOTCORR, ago–oct 2026 vs 2001–2025",
      "suelo": "ISRIC SoilGrids 250 m (0–30 cm)",
      "ndvi": "EJEMPLO (dato provisional, falta dato real)",
      "smap": "sin dato",
      "terreno": "EJEMPLO (verificar con NASADEM 30 m)"
    }
  },
  "parcela_el_oro": {
    "id": "parcela_el_oro",
    "nombre": "Parcela 3 — Santa Rosa (El Oro, Costa)",
    "region": "Costa",
    "ubicacion_texto": "Santa Rosa, El Oro",
    "geometria": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -79.96233,
            -3.44797
          ],
          [
            -79.96107,
            -3.44797
          ],
          [
            -79.96107,
            -3.44923
          ],
          [
            -79.96233,
            -3.44923
          ],
          [
            -79.96233,
            -3.44797
          ]
        ]
      ]
    },
    "area_ha": 2.0,
    "centroide": {
      "lat": -3.4486,
      "lon": -79.9617
    },
    "terreno": {
      "elev_m": 18,
      "pendiente_pct": 2.0,
      "pendiente_max_pct": 4.0,
      "orientacion": "O"
    },
    "clima_mensual": [
      {
        "mes": 1,
        "nombre_mes": "Ene",
        "P_mm": 58.4,
        "ET0_mm": 128.3,
        "Tmin_abs": 23.0,
        "Tmed": 28.0,
        "Rs_MJ": 14.1,
        "Viento_ms": 2.5,
        "HR_pct": 72
      },
      {
        "mes": 2,
        "nombre_mes": "Feb",
        "P_mm": 103.0,
        "ET0_mm": 109.1,
        "Tmin_abs": 23.5,
        "Tmed": 28.1,
        "Rs_MJ": 13.8,
        "Viento_ms": 2.5,
        "HR_pct": 77
      },
      {
        "mes": 3,
        "nombre_mes": "Mar",
        "P_mm": 133.4,
        "ET0_mm": 115.9,
        "Tmin_abs": 23.8,
        "Tmed": 28.0,
        "Rs_MJ": 14.3,
        "Viento_ms": 2.2,
        "HR_pct": 79
      },
      {
        "mes": 4,
        "nombre_mes": "Abr",
        "P_mm": 67.6,
        "ET0_mm": 113.5,
        "Tmin_abs": 23.0,
        "Tmed": 28.0,
        "Rs_MJ": 14.5,
        "Viento_ms": 2.0,
        "HR_pct": 77
      },
      {
        "mes": 5,
        "nombre_mes": "May",
        "P_mm": 34.8,
        "ET0_mm": 118.2,
        "Tmin_abs": 22.2,
        "Tmed": 28.3,
        "Rs_MJ": 13.6,
        "Viento_ms": 2.0,
        "HR_pct": 73
      },
      {
        "mes": 6,
        "nombre_mes": "Jun",
        "P_mm": 27.6,
        "ET0_mm": 113.8,
        "Tmin_abs": 20.6,
        "Tmed": 27.8,
        "Rs_MJ": 13.4,
        "Viento_ms": 2.0,
        "HR_pct": 70
      },
      {
        "mes": 7,
        "nombre_mes": "Jul",
        "P_mm": 12.5,
        "ET0_mm": 125.1,
        "Tmin_abs": 20.8,
        "Tmed": 27.8,
        "Rs_MJ": 13.7,
        "Viento_ms": 2.0,
        "HR_pct": 66
      },
      {
        "mes": 8,
        "nombre_mes": "Ago",
        "P_mm": 7.4,
        "ET0_mm": 139.2,
        "Tmin_abs": 20.5,
        "Tmed": 27.9,
        "Rs_MJ": 15.2,
        "Viento_ms": 2.1,
        "HR_pct": 64
      },
      {
        "mes": 9,
        "nombre_mes": "Sep",
        "P_mm": 10.7,
        "ET0_mm": 143.6,
        "Tmin_abs": 20.6,
        "Tmed": 28.0,
        "Rs_MJ": 15.8,
        "Viento_ms": 2.3,
        "HR_pct": 64
      },
      {
        "mes": 10,
        "nombre_mes": "Oct",
        "P_mm": 64.6,
        "ET0_mm": 137.3,
        "Tmin_abs": 21.5,
        "Tmed": 27.5,
        "Rs_MJ": 15.4,
        "Viento_ms": 2.3,
        "HR_pct": 68
      },
      {
        "mes": 11,
        "nombre_mes": "Nov",
        "P_mm": 43.7,
        "ET0_mm": 132.4,
        "Tmin_abs": 21.2,
        "Tmed": 27.2,
        "Rs_MJ": 16.0,
        "Viento_ms": 2.3,
        "HR_pct": 69
      },
      {
        "mes": 12,
        "nombre_mes": "Dic",
        "P_mm": 37.5,
        "ET0_mm": 131.7,
        "Tmin_abs": 21.9,
        "Tmed": 27.7,
        "Rs_MJ": 14.6,
        "Viento_ms": 2.4,
        "HR_pct": 70
      }
    ],
    "anomalia": {
      "fuente": "NASA POWER · PRECTOTCORR",
      "res_km": 50,
      "pct": 1506,
      "ventana": "ago–oct 2026",
      "lluvia_reciente_mm": 571,
      "lluvia_normal_mm": 36,
      "anios_referencia": "2001–2025",
      "mensaje": "Su zona viene 1506 % más lluviosa que un año normal (ago–oct 2026: 571 mm frente a 36 mm de promedio, NASA POWER, ~50 km). Suelo saturado: revise drenajes, evite labranza con el suelo mojado y vigile hongos (lancha, pudriciones) antes de sembrar."
    },
    "suelo": {
      "fuente": "EJEMPLO (dato provisional, falta dato real)",
      "textura": "Franco",
      "arcilla_pct": 22.0,
      "arena_pct": 41.0,
      "ph": 6.0,
      "soc_pct": 3.0,
      "n_gkg": 2.0,
      "es_andisol": true,
      "editado_por_usuario": false
    },
    "ndvi_mensual": [
      {
        "mes": "2023-11",
        "ndvi": 0.34,
        "ndti": 0.11,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2023-12",
        "ndvi": 0.58,
        "ndti": 0.08,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-01",
        "ndvi": 0.72,
        "ndti": 0.06,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-02",
        "ndvi": 0.76,
        "ndti": 0.05,
        "n_obs": 1,
        "interpolado": true
      },
      {
        "mes": "2024-03",
        "ndvi": 0.68,
        "ndti": 0.07,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-04",
        "ndvi": 0.45,
        "ndti": 0.12,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-05",
        "ndvi": 0.24,
        "ndti": 0.16,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-06",
        "ndvi": 0.21,
        "ndti": 0.15,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-07",
        "ndvi": 0.19,
        "ndti": 0.11,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-08",
        "ndvi": 0.18,
        "ndti": 0.09,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-09",
        "ndvi": 0.22,
        "ndti": 0.08,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-10",
        "ndvi": 0.31,
        "ndti": 0.1,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-11",
        "ndvi": 0.56,
        "ndti": 0.07,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-12",
        "ndvi": 0.69,
        "ndti": 0.06,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-01",
        "ndvi": 0.74,
        "ndti": 0.05,
        "n_obs": 1,
        "interpolado": true
      },
      {
        "mes": "2025-02",
        "ndvi": 0.71,
        "ndti": 0.06,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-03",
        "ndvi": 0.59,
        "ndti": 0.08,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-04",
        "ndvi": 0.33,
        "ndti": 0.14,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-05",
        "ndvi": 0.22,
        "ndti": 0.15,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-06",
        "ndvi": 0.2,
        "ndti": 0.12,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-07",
        "ndvi": 0.19,
        "ndti": 0.1,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-08",
        "ndvi": 0.18,
        "ndti": 0.08,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-09",
        "ndvi": 0.21,
        "ndti": 0.08,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-10",
        "ndvi": 0.27,
        "ndti": 0.09,
        "n_obs": 2,
        "interpolado": false
      }
    ],
    "historia_inferida": [
      {
        "anio": 2023,
        "ciclos": 0,
        "meses_cultivo": [
          12
        ],
        "meses_desnudo": [],
        "meses_residuo": []
      },
      {
        "anio": 2024,
        "ciclos": 2,
        "meses_cultivo": [
          1,
          2,
          3,
          11,
          12
        ],
        "meses_desnudo": [
          5,
          6,
          7,
          8,
          9
        ],
        "meses_residuo": [
          5,
          6
        ]
      },
      {
        "anio": 2025,
        "ciclos": 1,
        "meses_cultivo": [
          1,
          2,
          3
        ],
        "meses_desnudo": [
          5,
          6,
          7,
          8,
          9
        ],
        "meses_residuo": [
          5
        ]
      }
    ],
    "historia_declarada": [
      "arroz",
      "arroz"
    ],
    "nematodo_declarado": false,
    "clima_metodo_et0": "Penman-Monteith FAO-56 (radiación, viento y humedad de NASA POWER)",
    "estado_datos": {
      "clima": "NASA POWER 2015–2026 (diario, AG); T corregida +3.5 °C por altitud (celda a 559.61 m)",
      "anomalia": "NASA POWER PRECTOTCORR, ago–oct 2026 vs 2001–2025",
      "suelo": "EJEMPLO (dato provisional, falta dato real)",
      "ndvi": "EJEMPLO (dato provisional, falta dato real)",
      "smap": "sin dato",
      "terreno": "EJEMPLO (verificar con NASADEM 30 m)"
    }
  }
};

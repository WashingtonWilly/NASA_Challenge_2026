// datos_embebidos.js — Generado automáticamente desde data/cultivos.json y data/parcelas/*.json
// Garantiza que la demo funcione tanto en servidor como abriendo index.html sin internet.
window.CATALOGO_CULTIVOS = {
  "meta": {
    "version": "1.0.0",
    "fuentes": [
      "FAO-56 (Evapotranspiración del cultivo y coeficientes Kc)",
      "INIAP Ecuador (Guías técnicas de cultivos para Sierra y Costa: Estaciones Santa Catalina y Boliche)",
      "MAG-SIPA Ecuador (Precios referenciales y márgenes brutos aproximados por hectárea)"
    ],
    "unidades": {
      "altitud": "m s.n.m.",
      "ciclo": "días",
      "residuo": "t MS/ha (toneladas de materia seca por hectárea)",
      "credito_n": "kg N/ha dejados para el cultivo siguiente",
      "extraccion_n": "kg N/ha extraídos por cosecha",
      "margen_usd_ha": "USD/ha (margen bruto referencial MAG-SIPA)"
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
      "rendimiento_qq_ha": 320,
      "margen_usd_ha": 1850,
      "rol_ecologico": "Tubérculo comercial (alta exigencia de suelo)",
      "explicacion_suelo": "Genera buen ingreso pero remueve intensamente el suelo; requiere descanso de 3–4 años para evitar nematodos y lancha."
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
      "margen_usd_ha": 1350,
      "rol_ecologico": "Alto aporte de rastrojo y carbono",
      "explicacion_suelo": "Sus raíces profundas exploran el subsuelo y deja 6 t/ha de caña que protegen la tierra o sirven de forraje."
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
      "margen_usd_ha": 780,
      "rol_ecologico": "Cereal rústico tolerante a sequía y heladas",
      "explicacion_suelo": "Cubre rápido las laderas contra la erosión, resiste heladas y aprovecha muy bien el nitrógeno dejado por el chocho o el haba."
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
      "rendimiento_qq_ha": 52,
      "margen_usd_ha": 840,
      "rol_ecologico": "Formador de materia orgánica estable",
      "explicacion_suelo": "Deja 4 t/ha de paja con alta relación carbono/nitrógeno que forma humus duradero cuando sigue a una leguminosa."
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
      "margen_usd_ha": 1420,
      "rol_ecologico": "Tolerante a sequía, heladas y suelos andinos",
      "explicacion_suelo": "Con bajo requerimiento hídrico (Kc medio 1.00) y raíz pivotante, rompe el ciclo de plagas de cereales y papa."
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
      "margen_usd_ha": 1280,
      "rol_ecologico": "Fijador de Nitrógeno (+50 kg/ha) y raíz descompactadora",
      "explicacion_suelo": "Su raíz pivotante profunda rompe capas duras, fija 50 kg N/ha gratis del aire y sus alcaloides reducen nematodos del suelo."
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
      "margen_usd_ha": 1320,
      "rol_ecologico": "Fijador de Nitrógeno (+40 kg/ha) tolerante al frío",
      "explicacion_suelo": "Enriquece el suelo con 40 kg N/ha de rápida liberación (baja relación C/N) ideal antes de sembrar cebada, trigo o quinua."
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
      "margen_usd_ha": 1180,
      "rol_ecologico": "Leguminosa de ciclo corto (+25 kg N/ha)",
      "explicacion_suelo": "Cosecha en 3–4 meses ahorrando agua en campañas cortas y dejando +25 kg N/ha disponibles."
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
      "explicacion_suelo": "Ideal para valles interandinos; aporta nitrógeno y requiere poca agua al final de su ciclo (Kc 0.35)."
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
      "margen_usd_ha": 1750,
      "rol_ecologico": "Biofumigante natural (glucosinolatos)",
      "explicacion_suelo": "Sus residuos ayudan a reducir hongos de la papa, pero exige 4 años de pausa para evitar la hernia de las coles."
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
      "margen_usd_ha": 1620,
      "rol_ecologico": "Hortaliza de raíz (alternativa comercial a la papa)",
      "explicacion_suelo": "Rompe ciclos de plagas de Solanáceas y Poáceas, pero deja poco rastrojo y no debe sembrarse en pendientes > 25 %."
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
      "margen_usd_ha": 1680,
      "rol_ecologico": "Hortaliza de alto valor comercial",
      "explicacion_suelo": "Sus compuestos azufrados reducen ciertos patógenos, pero aporta muy poca cobertura orgánica al suelo."
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
      "margen_usd_ha": 920,
      "rol_ecologico": "Cobertura antierosión y alto valor forrajero",
      "explicacion_suelo": "Amarra el suelo en laderas pronunciadas (> 25 %), aporta 5 t/ha de biomasa y alimenta al ganado en época seca."
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
      "margen_usd_ha": 890,
      "rol_ecologico": "Abono verde estrella (+70 kg N/ha y cobertura total)",
      "explicacion_suelo": "Incorporada al suelo inyecta 70 kg N/ha y 1 t/ha de humus estable, regenerando lotes agotados por monocultivo."
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
      "rendimiento_qq_ha": 135,
      "margen_usd_ha": 1250,
      "rol_ecologico": "Cereal de alta demanda hídrica (zonas bajas)",
      "explicacion_suelo": "Aporta abundante tamo (5 t/ha), pero su alta demanda de agua exige rotarlo con soya o caupí en verano."
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
      "rendimiento_qq_ha": 145,
      "margen_usd_ha": 1310,
      "rol_ecologico": "Raíz profunda y máximo aporte de rastrojo (6 t/ha)",
      "explicacion_suelo": "Su rastrojo protege el suelo costero de lluvias intensas, pero necesita una leguminosa previa para no agotar el nitrógeno."
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
      "explicacion_suelo": "Corta el ciclo de plagas del maíz y arroz, dejando +30 kg N/ha de rápida mineralización."
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
      "margen_usd_ha": 1380,
      "rol_ecologico": "Leguminosa rústica fijadora de N (+25 kg/ha)",
      "explicacion_suelo": "Cubre densamente el suelo reduciendo la evaporación, fija nitrógeno y deja follaje nutritivo."
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
      "margen_usd_ha": 1450,
      "rol_ecologico": "Alta tolerancia a sequía (Kc medio 0.80)",
      "explicacion_suelo": "Resiste meses secos con bajo consumo mensual de agua, aunque exige rotar después con leguminosas para reponer nutrientes."
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
      "margen_usd_ha": 1720,
      "rol_ecologico": "Ciclo corto de alto retorno económico",
      "explicacion_suelo": "Diversifica ingresos en la campaña seca (C2), pero requiere 3 años de pausa para evitar Fusarium."
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
      "margen_usd_ha": 1950,
      "rol_ecologico": "Hortaliza de alta rentabilidad (exige rotación estricta)",
      "explicacion_suelo": "Comparte familia con la papa (Solanáceas); requiere 3–4 años sin repetir para evitar marchitez y nematodos."
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
      "explicacion_suelo": "Su ciclo ultracorto (70–90 días) y bajo Kc final (0.35) permite cubrir el suelo en verano seco fijando nitrógeno."
    }
  ]
};

window.PARCELAS_DEMO = {
  "parcela_chimborazo_1": {
    "id": "parcela_chimborazo_1",
    "nombre": "Parcela 1 — Sierra (Licto, Chimborazo)",
    "region": "Sierra",
    "ubicacion_texto": "Comunidad Tunshi / Licto, Riobamba, Chimborazo",
    "geometria": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -78.6132,
            -1.7842
          ],
          [
            -78.6118,
            -1.7842
          ],
          [
            -78.6118,
            -1.7854
          ],
          [
            -78.6132,
            -1.7854
          ],
          [
            -78.6132,
            -1.7842
          ]
        ]
      ]
    },
    "area_ha": 1.8,
    "centroide": {
      "lat": -1.7848,
      "lon": -78.6125
    },
    "terreno": {
      "elev_m": 2950,
      "pendiente_pct": 14.0,
      "pendiente_max_pct": 22.0,
      "orientacion": "SE"
    },
    "clima_mensual": [
      {
        "mes": 1,
        "nombre_mes": "Ene",
        "P_mm": 54,
        "ET0_mm": 92,
        "Tmin_abs": 3.4,
        "Tmed": 13.4
      },
      {
        "mes": 2,
        "nombre_mes": "Feb",
        "P_mm": 68,
        "ET0_mm": 86,
        "Tmin_abs": 3.8,
        "Tmed": 13.5
      },
      {
        "mes": 3,
        "nombre_mes": "Mar",
        "P_mm": 82,
        "ET0_mm": 94,
        "Tmin_abs": 3.9,
        "Tmed": 13.6
      },
      {
        "mes": 4,
        "nombre_mes": "Abr",
        "P_mm": 88,
        "ET0_mm": 89,
        "Tmin_abs": 3.6,
        "Tmed": 13.5
      },
      {
        "mes": 5,
        "nombre_mes": "May",
        "P_mm": 58,
        "ET0_mm": 87,
        "Tmin_abs": 2.8,
        "Tmed": 13.1
      },
      {
        "mes": 6,
        "nombre_mes": "Jun",
        "P_mm": 32,
        "ET0_mm": 84,
        "Tmin_abs": 1.5,
        "Tmed": 12.2
      },
      {
        "mes": 7,
        "nombre_mes": "Jul",
        "P_mm": 21,
        "ET0_mm": 88,
        "Tmin_abs": 0.8,
        "Tmed": 11.8
      },
      {
        "mes": 8,
        "nombre_mes": "Ago",
        "P_mm": 24,
        "ET0_mm": 96,
        "Tmin_abs": 0.6,
        "Tmed": 12.1
      },
      {
        "mes": 9,
        "nombre_mes": "Sep",
        "P_mm": 42,
        "ET0_mm": 99,
        "Tmin_abs": 1.8,
        "Tmed": 12.8
      },
      {
        "mes": 10,
        "nombre_mes": "Oct",
        "P_mm": 76,
        "ET0_mm": 101,
        "Tmin_abs": 2.9,
        "Tmed": 13.4
      },
      {
        "mes": 11,
        "nombre_mes": "Nov",
        "P_mm": 79,
        "ET0_mm": 96,
        "Tmin_abs": 2.5,
        "Tmed": 13.5
      },
      {
        "mes": 12,
        "nombre_mes": "Dic",
        "P_mm": 62,
        "ET0_mm": 94,
        "Tmin_abs": 3.1,
        "Tmed": 13.4
      }
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
      "papa",
      "papa"
    ],
    "nematodo_declarado": false
  },
  "parcela_el_oro_2": {
    "id": "parcela_el_oro_2",
    "nombre": "Parcela 2 — Costa (El Guabo, El Oro)",
    "region": "Costa",
    "ubicacion_texto": "Sector Río Bonito / El Guabo, El Oro (Zona de ciclo corto)",
    "geometria": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -79.8335,
            -3.2438
          ],
          [
            -79.8315,
            -3.2438
          ],
          [
            -79.8315,
            -3.2454
          ],
          [
            -79.8335,
            -3.2454
          ],
          [
            -79.8335,
            -3.2438
          ]
        ]
      ]
    },
    "area_ha": 3.5,
    "centroide": {
      "lat": -3.2446,
      "lon": -79.8325
    },
    "terreno": {
      "elev_m": 28,
      "pendiente_pct": 4.0,
      "pendiente_max_pct": 7.0,
      "orientacion": "O"
    },
    "clima_mensual": [
      {
        "mes": 1,
        "nombre_mes": "Ene",
        "P_mm": 145,
        "ET0_mm": 122,
        "Tmin_abs": 21.2,
        "Tmed": 26.4
      },
      {
        "mes": 2,
        "nombre_mes": "Feb",
        "P_mm": 195,
        "ET0_mm": 116,
        "Tmin_abs": 21.5,
        "Tmed": 26.8
      },
      {
        "mes": 3,
        "nombre_mes": "Mar",
        "P_mm": 180,
        "ET0_mm": 126,
        "Tmin_abs": 21.4,
        "Tmed": 26.9
      },
      {
        "mes": 4,
        "nombre_mes": "Abr",
        "P_mm": 110,
        "ET0_mm": 120,
        "Tmin_abs": 21.0,
        "Tmed": 26.5
      },
      {
        "mes": 5,
        "nombre_mes": "May",
        "P_mm": 42,
        "ET0_mm": 112,
        "Tmin_abs": 19.8,
        "Tmed": 25.4
      },
      {
        "mes": 6,
        "nombre_mes": "Jun",
        "P_mm": 18,
        "ET0_mm": 98,
        "Tmin_abs": 18.6,
        "Tmed": 24.1
      },
      {
        "mes": 7,
        "nombre_mes": "Jul",
        "P_mm": 14,
        "ET0_mm": 96,
        "Tmin_abs": 18.1,
        "Tmed": 23.6
      },
      {
        "mes": 8,
        "nombre_mes": "Ago",
        "P_mm": 12,
        "ET0_mm": 102,
        "Tmin_abs": 18.0,
        "Tmed": 23.8
      },
      {
        "mes": 9,
        "nombre_mes": "Sep",
        "P_mm": 15,
        "ET0_mm": 108,
        "Tmin_abs": 18.4,
        "Tmed": 24.2
      },
      {
        "mes": 10,
        "nombre_mes": "Oct",
        "P_mm": 19,
        "ET0_mm": 114,
        "Tmin_abs": 18.9,
        "Tmed": 24.6
      },
      {
        "mes": 11,
        "nombre_mes": "Nov",
        "P_mm": 24,
        "ET0_mm": 118,
        "Tmin_abs": 19.4,
        "Tmed": 25.1
      },
      {
        "mes": 12,
        "nombre_mes": "Dic",
        "P_mm": 58,
        "ET0_mm": 124,
        "Tmin_abs": 20.5,
        "Tmed": 25.9
      }
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
      "es_andisol": false,
      "editado_por_usuario": false
    },
    "ndvi_mensual": [
      {
        "mes": "2023-11",
        "ndvi": 0.22,
        "ndti": 0.17,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2023-12",
        "ndvi": 0.42,
        "ndti": 0.12,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-01",
        "ndvi": 0.68,
        "ndti": 0.07,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-02",
        "ndvi": 0.77,
        "ndti": 0.05,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-03",
        "ndvi": 0.71,
        "ndti": 0.06,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2024-04",
        "ndvi": 0.49,
        "ndti": 0.15,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-05",
        "ndvi": 0.26,
        "ndti": 0.19,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-06",
        "ndvi": 0.21,
        "ndti": 0.16,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-07",
        "ndvi": 0.19,
        "ndti": 0.14,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-08",
        "ndvi": 0.18,
        "ndti": 0.12,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2024-09",
        "ndvi": 0.19,
        "ndti": 0.11,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-10",
        "ndvi": 0.21,
        "ndti": 0.1,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-11",
        "ndvi": 0.23,
        "ndti": 0.11,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2024-12",
        "ndvi": 0.48,
        "ndti": 0.09,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-01",
        "ndvi": 0.73,
        "ndti": 0.05,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-02",
        "ndvi": 0.79,
        "ndti": 0.04,
        "n_obs": 1,
        "interpolado": true
      },
      {
        "mes": "2025-03",
        "ndvi": 0.75,
        "ndti": 0.05,
        "n_obs": 2,
        "interpolado": false
      },
      {
        "mes": "2025-04",
        "ndvi": 0.58,
        "ndti": 0.09,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-05",
        "ndvi": 0.29,
        "ndti": 0.18,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-06",
        "ndvi": 0.22,
        "ndti": 0.16,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-07",
        "ndvi": 0.2,
        "ndti": 0.13,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-08",
        "ndvi": 0.19,
        "ndti": 0.11,
        "n_obs": 4,
        "interpolado": false
      },
      {
        "mes": "2025-09",
        "ndvi": 0.18,
        "ndti": 0.1,
        "n_obs": 3,
        "interpolado": false
      },
      {
        "mes": "2025-10",
        "ndvi": 0.2,
        "ndti": 0.1,
        "n_obs": 3,
        "interpolado": false
      }
    ],
    "historia_inferida": [
      {
        "anio": 2023,
        "ciclos": 0,
        "meses_cultivo": [],
        "meses_desnudo": [
          11
        ],
        "meses_residuo": [
          11
        ]
      },
      {
        "anio": 2024,
        "ciclos": 1,
        "meses_cultivo": [
          1,
          2,
          3
        ],
        "meses_desnudo": [
          6,
          7,
          8,
          9,
          10,
          11
        ],
        "meses_residuo": [
          5,
          6,
          7
        ]
      },
      {
        "anio": 2025,
        "ciclos": 1,
        "meses_cultivo": [
          1,
          2,
          3,
          4
        ],
        "meses_desnudo": [
          6,
          7,
          8,
          9,
          10
        ],
        "meses_residuo": [
          5,
          6
        ]
      }
    ],
    "historia_declarada": [
      "maiz_duro",
      "arroz"
    ],
    "nematodo_declarado": false
  },
  "parcela_colta_3": {
    "id": "parcela_colta_3",
    "nombre": "Parcela 3 (Caso Borde) — Ladera Alta Colta (> 25 % pendiente)",
    "region": "Sierra Alta (Ladera)",
    "ubicacion_texto": "Ladera alta de Colta, Chimborazo (3.180 m, pendiente 28 %)",
    "geometria": {
      "type": "Polygon",
      "coordinates": [
        [
          [
            -78.7652,
            -1.712
          ],
          [
            -78.764,
            -1.712
          ],
          [
            -78.764,
            -1.7131
          ],
          [
            -78.7652,
            -1.7131
          ],
          [
            -78.7652,
            -1.712
          ]
        ]
      ]
    },
    "area_ha": 1.2,
    "centroide": {
      "lat": -1.7125,
      "lon": -78.7646
    },
    "terreno": {
      "elev_m": 3180,
      "pendiente_pct": 28.0,
      "pendiente_max_pct": 35.0,
      "orientacion": "E"
    },
    "clima_mensual": [
      {
        "mes": 1,
        "nombre_mes": "Ene",
        "P_mm": 58,
        "ET0_mm": 86,
        "Tmin_abs": 1.8,
        "Tmed": 11.4
      },
      {
        "mes": 2,
        "nombre_mes": "Feb",
        "P_mm": 72,
        "ET0_mm": 82,
        "Tmin_abs": 2.2,
        "Tmed": 11.6
      },
      {
        "mes": 3,
        "nombre_mes": "Mar",
        "P_mm": 86,
        "ET0_mm": 88,
        "Tmin_abs": 2.1,
        "Tmed": 11.7
      },
      {
        "mes": 4,
        "nombre_mes": "Abr",
        "P_mm": 90,
        "ET0_mm": 84,
        "Tmin_abs": 1.9,
        "Tmed": 11.5
      },
      {
        "mes": 5,
        "nombre_mes": "May",
        "P_mm": 55,
        "ET0_mm": 82,
        "Tmin_abs": 0.9,
        "Tmed": 11.1
      },
      {
        "mes": 6,
        "nombre_mes": "Jun",
        "P_mm": 30,
        "ET0_mm": 79,
        "Tmin_abs": -0.4,
        "Tmed": 10.2
      },
      {
        "mes": 7,
        "nombre_mes": "Jul",
        "P_mm": 19,
        "ET0_mm": 83,
        "Tmin_abs": -1.2,
        "Tmed": 9.8
      },
      {
        "mes": 8,
        "nombre_mes": "Ago",
        "P_mm": 22,
        "ET0_mm": 90,
        "Tmin_abs": -0.9,
        "Tmed": 10.1
      },
      {
        "mes": 9,
        "nombre_mes": "Sep",
        "P_mm": 40,
        "ET0_mm": 93,
        "Tmin_abs": 0.4,
        "Tmed": 10.8
      },
      {
        "mes": 10,
        "nombre_mes": "Oct",
        "P_mm": 74,
        "ET0_mm": 95,
        "Tmin_abs": 1.4,
        "Tmed": 11.4
      },
      {
        "mes": 11,
        "nombre_mes": "Nov",
        "P_mm": 78,
        "ET0_mm": 91,
        "Tmin_abs": 0.2,
        "Tmed": 11.5
      },
      {
        "mes": 12,
        "nombre_mes": "Dic",
        "P_mm": 64,
        "ET0_mm": 89,
        "Tmin_abs": 1.5,
        "Tmed": 11.4
      }
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
      "papa",
      "cebada"
    ],
    "nematodo_declarado": false
  }
};

/**
 * datos_vivo.js — Datos en vivo para un lote dibujado en el mapa (cualquier parcela del Ecuador).
 *
 * Consulta desde el navegador, en paralelo:
 *   - NASA POWER (diario 2015–2024): clima mensual, ET0 por Hargreaves y heladas (Tmin absoluta).
 *   - NASA POWER (PRECTOTCORR 2001–hoy): anomalía de lluvia de los últimos 3 meses.
 *   - NASA SRTM 30 m (vía OpenTopoData): altitud, pendiente y orientación con 5 puntos.
 *   - ISRIC SoilGrids 250 m: textura, pH, carbono orgánico y nitrógeno (0–30 cm).
 * Misma lógica que scripts/power.py, scripts/soil.py y scripts/appeears.py.
 * Lo que no responda queda marcado EJEMPLO en estado_datos; nunca se inventa.
 */
(function () {
  'use strict';

  const NOMBRES_MES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];
  const MES_CORTO = ['ene', 'feb', 'mar', 'abr', 'may', 'jun', 'jul', 'ago', 'sep', 'oct', 'nov', 'dic'];

  function fetchJson(url, ms) {
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), ms || 45000);
    return fetch(url, { signal: ctrl.signal })
      .then(r => { if (!r.ok) throw new Error('HTTP ' + r.status); return r.json(); })
      .finally(() => clearTimeout(t));
  }

  function yyyymmdd(d) {
    return d.toISOString().slice(0, 10).replace(/-/g, '');
  }

  // ---------- FAO-56: radiación extraterrestre (mm/día) y ET0 Hargreaves ----------
  function raMm(latDeg, doy) {
    const phi = latDeg * Math.PI / 180;
    const dr = 1 + 0.033 * Math.cos(2 * Math.PI * doy / 365);
    const delta = 0.409 * Math.sin(2 * Math.PI * doy / 365 - 1.39);
    const ws = Math.acos(Math.max(-1, Math.min(1, -Math.tan(phi) * Math.tan(delta))));
    const ra = (24 * 60 / Math.PI) * 0.0820 * dr *
      (ws * Math.sin(phi) * Math.sin(delta) + Math.cos(phi) * Math.cos(delta) * Math.sin(ws));
    return ra * 0.408;
  }

  function diaDelAnio(y, m, d) {
    return Math.round((Date.UTC(y, m - 1, d) - Date.UTC(y, 0, 0)) / 86400000);
  }

  // ---------- NASA POWER: clima mensual ----------
  function procesarClima(data, lat, elevParcela) {
    const par = data.properties.parameter;
    const coords = (data.geometry && data.geometry.coordinates) || [];
    const elevCelda = typeof coords[2] === 'number' ? coords[2] : null;
    const dT = (elevCelda !== null && typeof elevParcela === 'number') ? -0.0065 * (elevParcela - elevCelda) : 0;
    const acum = {};
    for (let m = 1; m <= 12; m++) acum[m] = { P: 0, ET0: 0, tmin: Infinity, tmed: 0, n: 0, anios: new Set() };
    for (const f of Object.keys(par.T2M)) {
      const tmed = par.T2M[f], tmax = par.T2M_MAX[f], tmin = par.T2M_MIN[f], p = par.PRECTOTCORR[f];
      if ([tmed, tmax, tmin, p].some(v => v === undefined || v <= -999)) continue;
      const y = +f.slice(0, 4), m = +f.slice(4, 6), d = +f.slice(6, 8);
      const tm = tmed + dT, tx = tmax + dT, tn = tmin + dT;
      const et0 = Math.max(0, 0.0023 * raMm(lat, diaDelAnio(y, m, d)) * (tm + 17.8) * Math.sqrt(Math.max(0, tx - tn)));
      const a = acum[m];
      a.P += p; a.ET0 += et0; a.tmin = Math.min(a.tmin, tn); a.tmed += tm; a.n++; a.anios.add(y);
    }
    const meses = [];
    for (let m = 1; m <= 12; m++) {
      const a = acum[m], na = Math.max(1, a.anios.size);
      if (!a.n) return null;
      meses.push({
        mes: m, nombre_mes: NOMBRES_MES[m - 1],
        P_mm: Math.round(a.P / na * 10) / 10,
        ET0_mm: Math.round(a.ET0 / na * 10) / 10,
        Tmin_abs: Math.round(a.tmin * 10) / 10,
        Tmed: Math.round(a.tmed / a.n * 10) / 10
      });
    }
    return { meses, elevCelda, dT };
  }

  // ---------- NASA POWER: anomalía de lluvia (últimos 3 meses completos) ----------
  function procesarAnomalia(data) {
    const prec = data.properties.parameter.PRECTOTCORR;
    const tot = {}, dias = {};
    for (const [f, v] of Object.entries(prec)) {
      if (v === null || v <= -999) continue;
      const k = f.slice(0, 6);
      tot[k] = (tot[k] || 0) + v; dias[k] = (dias[k] || 0) + 1;
    }
    const completos = Object.keys(tot).filter(k => dias[k] >= 27).sort().reverse();
    if (completos.length < 3) return null;
    const ventana = completos.slice(0, 3).sort();
    const reciente = ventana.reduce((s, k) => s + tot[k], 0);
    const anioFin = +ventana[2].slice(0, 4);
    const hist = [];
    for (let anio = 2001; anio < anioFin; anio++) {
      const claves = ventana.map(k => String(+k.slice(0, 4) - anioFin + anio) + k.slice(4));
      if (claves.every(c => tot[c] !== undefined && dias[c] >= 27)) hist.push(claves.reduce((s, c) => s + tot[c], 0));
    }
    if (hist.length < 5) return null;
    const normal = hist.reduce((a, b) => a + b, 0) / hist.length;
    const pct = normal > 0 ? Math.round(100 * (reciente - normal) / normal) : 0;
    const txt = `${MES_CORTO[+ventana[0].slice(4) - 1]}–${MES_CORTO[+ventana[2].slice(4) - 1]} ${anioFin}`;
    return {
      fuente: 'NASA POWER · PRECTOTCORR', res_km: 50, pct, ventana: txt,
      lluvia_reciente_mm: Math.round(reciente), lluvia_normal_mm: Math.round(normal),
      anios_referencia: `2001–${anioFin - 1}`,
      mensaje: `Su zona viene ${Math.abs(pct)} % ${pct < 0 ? 'más seca' : 'más lluviosa'} que un año normal (${txt}: ` +
        `${Math.round(reciente)} mm frente a ${Math.round(normal)} mm de promedio, NASA POWER, ~50 km).` +
        (pct < -15 ? ' Por eso damos más peso al ahorro de agua.' : '')
    };
  }

  // ---------- SRTM 30 m: altitud, pendiente y orientación con 5 puntos ----------
  function distM(a, b) {
    const R = 6371000, p1 = a[0] * Math.PI / 180, p2 = b[0] * Math.PI / 180;
    const dp = p2 - p1, dl = (b[1] - a[1]) * Math.PI / 180;
    const h = Math.sin(dp / 2) ** 2 + Math.cos(p1) * Math.cos(p2) * Math.sin(dl / 2) ** 2;
    return 2 * R * Math.asin(Math.sqrt(h));
  }

  function procesarTerreno(data, pts) {
    const z = (data.results || []).map(r => r.elevation);
    if (z.length !== 5 || z.some(v => typeof v !== 'number')) return null;
    const [zc, zn, zs, ze, zo] = z;
    const dn = distM(pts[0], pts[1]), ds = distM(pts[0], pts[2]), de = distM(pts[0], pts[3]), dw = distM(pts[0], pts[4]);
    const gy = (zn - zs) / (dn + ds), gx = (ze - zo) / (de + dw);
    const pend = 100 * Math.hypot(gx, gy);
    const pendMax = Math.max(pend, ...[[zn, dn], [zs, ds], [ze, de], [zo, dw]].map(([v, d]) => 100 * Math.abs(v - zc) / d));
    const ang = (Math.atan2(-gx, -gy) * 180 / Math.PI + 360) % 360;
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SO', 'O', 'NO'];
    return {
      elev_m: Math.round(zc),
      pendiente_pct: Math.round(pend * 10) / 10,
      pendiente_max_pct: Math.round(pendMax * 10) / 10,
      orientacion: dirs[Math.floor(((ang + 22.5) % 360) / 45)]
    };
  }

  // ---------- SoilGrids 250 m ----------
  function clasificarTextura(arcilla, arena) {
    if (arcilla >= 32) return 'Arcilloso';
    if (arena >= 58) return 'Arenoso';
    return 'Franco';
  }

  function procesarSuelo(data) {
    const espesor = { '0-5cm': 5, '5-15cm': 10, '15-30cm': 15 };
    const capas = {};
    for (const l of data.properties.layers) {
      const vals = l.depths.map(d => [d.values.mean, espesor[d.label] || 0]).filter(([v, w]) => v !== null && v !== undefined && w > 0);
      capas[l.name] = vals.length ? vals.reduce((s, [v, w]) => s + v * w, 0) / vals.reduce((s, [, w]) => s + w, 0) : null;
    }
    if (['clay', 'sand', 'phh2o', 'soc'].some(k => capas[k] === null || capas[k] === undefined)) return null;
    const arcilla = Math.round(capas.clay) / 10, arena = Math.round(capas.sand) / 10;
    return {
      fuente: 'ISRIC SoilGrids 250 m (0–30 cm)',
      textura: clasificarTextura(arcilla, arena),
      arcilla_pct: arcilla, arena_pct: arena,
      ph: Math.round(capas.phh2o) / 10,
      soc_pct: Math.round(capas.soc) / 100,
      n_gkg: capas.nitrogen !== null && capas.nitrogen !== undefined ? Math.round(capas.nitrogen) / 100 : null,
      editado_por_usuario: false
    };
  }

  /**
   * Carga todos los datos de un lote. onProgreso(fuente, ok) se llama a medida que responden.
   * Devuelve { clima, anomalia, terreno, suelo, region } con null en lo que no respondió.
   */
  async function cargar(lat, lon, onProgreso) {
    const avisar = (f, ok) => { try { onProgreso && onProgreso(f, ok); } catch (e) { /* sin efecto */ } };
    const la = lat.toFixed(4), lo = lon.toFixed(4);
    const base = 'https://power.larc.nasa.gov/api/temporal/daily/point?community=AG&format=JSON';
    const d = 0.0005; // ~55 m
    const pts = [[lat, lon], [lat + d, lon], [lat - d, lon], [lat, lon + d], [lat, lon - d]];

    const pTerreno = fetchJson('https://api.opentopodata.org/v1/srtm30m?locations=' +
      pts.map(p => p[0].toFixed(5) + ',' + p[1].toFixed(5)).join('|'), 20000)
      .then(j => procesarTerreno(j, pts)).catch(() => null)
      .then(r => { avisar('terreno', !!r); return r; });
    const pClimaRaw = fetchJson(`${base}&parameters=T2M_MAX,T2M_MIN,T2M,PRECTOTCORR&latitude=${la}&longitude=${lo}&start=20150101&end=20241231`, 60000)
      .catch(() => null);
    const pAnom = fetchJson(`${base}&parameters=PRECTOTCORR&latitude=${la}&longitude=${lo}&start=20010101&end=${yyyymmdd(new Date())}`, 60000)
      .then(procesarAnomalia).catch(() => null)
      .then(r => { avisar('anomalia', !!r); return r; });
    const q = `lon=${lo}&lat=${la}&depth=0-5cm&depth=5-15cm&depth=15-30cm&value=mean` +
      ['clay', 'sand', 'silt', 'phh2o', 'soc', 'nitrogen'].map(p => '&property=' + p).join('');
    const pSuelo = fetchJson('https://rest.isric.org/soilgrids/v2.0/properties/query?' + q, 30000)
      .then(procesarSuelo).catch(() => null)
      .then(r => { avisar('suelo', !!r); return r; });

    const terreno = await pTerreno;
    const climaRaw = await pClimaRaw;
    let clima = null;
    try { clima = climaRaw ? procesarClima(climaRaw, lat, terreno ? terreno.elev_m : null) : null; } catch (e) { clima = null; }
    avisar('clima', !!clima);
    const [anomalia, suelo] = await Promise.all([pAnom, pSuelo]);

    let region = null;
    if (terreno) region = terreno.elev_m >= 1500 ? 'Sierra' : (lon > -77.9 ? 'Amazonía' : 'Costa');
    if (suelo) suelo.es_andisol = region === 'Sierra' && suelo.soc_pct >= 2.0;
    return { clima, anomalia, terreno, suelo, region };
  }

  window.DatosVivo = { cargar, procesarClima, procesarAnomalia, procesarTerreno, procesarSuelo };
})();

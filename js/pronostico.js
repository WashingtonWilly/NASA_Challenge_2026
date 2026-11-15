/**
 * pronostico.js — «Esta semana en su lote»: pronóstico de 7 días con alertas de helada y lluvia fuerte.
 *
 * Fuente: Open-Meteo (datos abiertos, CC BY 4.0), con la temperatura ajustada a la altura
 * del lote (parámetro elevation). No es un dato de la NASA y la página lo dice así.
 * El clima de largo plazo (10 años) sigue viniendo de NASA POWER.
 */
(function () {
  'use strict';

  const cache = {};
  const DIAS = ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'];
  const DIAS_LARGOS = ['domingo', 'lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado'];

  // Códigos WMO de estado del tiempo → emoji y texto corto
  function cielo(code) {
    if (code === 0) return ['☀️', 'Despejado'];
    if (code <= 2) return ['🌤️', 'Poco nublado'];
    if (code === 3) return ['☁️', 'Nublado'];
    if (code === 45 || code === 48) return ['🌫️', 'Neblina'];
    if (code >= 51 && code <= 57) return ['🌦️', 'Llovizna'];
    if (code >= 61 && code <= 67) return ['🌧️', 'Lluvia'];
    if (code >= 71 && code <= 77) return ['🌨️', 'Nieve o granizo'];
    if (code >= 80 && code <= 82) return ['🌧️', 'Aguaceros'];
    if (code >= 95) return ['⛈️', 'Tormenta'];
    return ['🌥️', 'Variable'];
  }

  async function cargar(lat, lon, elev) {
    const clave = `${lat.toFixed(3)},${lon.toFixed(3)},${Math.round(elev || 0)}`;
    if (cache[clave]) return cache[clave];
    const url = 'https://api.open-meteo.com/v1/forecast?' + new URLSearchParams({
      latitude: lat.toFixed(4), longitude: lon.toFixed(4),
      daily: 'temperature_2m_max,temperature_2m_min,precipitation_sum,precipitation_probability_max,weather_code',
      timezone: 'auto', forecast_days: '7',
      ...(Number.isFinite(elev) ? { elevation: String(Math.round(elev)) } : {})
    });
    const ctrl = new AbortController();
    const t = setTimeout(() => ctrl.abort(), 12000);
    try {
      const r = await fetch(url, { signal: ctrl.signal });
      if (!r.ok) throw new Error('HTTP ' + r.status);
      const j = await r.json();
      const d = j.daily;
      const dias = d.time.map((f, i) => ({
        fecha: f,
        tmax: d.temperature_2m_max[i],
        tmin: d.temperature_2m_min[i],
        lluvia: d.precipitation_sum[i],
        prob: d.precipitation_probability_max ? d.precipitation_probability_max[i] : null,
        code: d.weather_code[i]
      }));
      cache[clave] = { dias, generado: new Date() };
      return cache[clave];
    } finally { clearTimeout(t); }
  }

  function nombreDia(fecha, i, largo) {
    if (i === 0) return largo ? 'hoy' : 'Hoy';
    if (i === 1) return largo ? 'mañana' : 'Mañana';
    const d = new Date(fecha + 'T12:00:00');
    return (largo ? DIAS_LARGOS : DIAS)[d.getDay()];
  }

  /** Advertencias de la semana con acciones (mismo formato que AyudaAgricultor.advertenciasLote). */
  function avisos(pron) {
    if (!pron) return [];
    const out = [];
    const helada = pron.dias.map((d, i) => ({ ...d, i })).filter(d => d.tmin !== null && d.tmin <= 2);
    if (helada.length) {
      const peor = helada.reduce((a, b) => (b.tmin < a.tmin ? b : a));
      const cuando = helada.map(d => nombreDia(d.fecha, d.i, true)).join(', ');
      out.push({
        clase: peor.tmin <= 0 ? 'riesgo' : 'alerta', icono: '🥶',
        titulo: `Esta semana: ${peor.tmin <= 0 ? 'helada' : 'noche muy fría'} (${peor.tmin} °C)`,
        porque: `Se esperan noches muy frías el ${cuando}. Las plantas pequeñas y las flores pueden quemarse.`,
        acciones: [
          'Si tiene riego, moje el suelo la tarde anterior: la tierra húmeda guarda calor en la noche.',
          'Tape almácigos y plantas pequeñas con paja o plástico antes de que anochezca.',
          'No siembre ni trasplante hasta que pasen esas noches.'
        ],
        tecnico: `Pronóstico Open-Meteo (CC BY 4.0), Tmin diaria ajustada a la altitud del lote; umbral ≤ 2 °C. Mínima: ${peor.tmin} °C el ${peor.fecha}.`
      });
    }
    const fuertes = pron.dias.map((d, i) => ({ ...d, i })).filter(d => d.lluvia >= 20);
    const total = pron.dias.reduce((s, d) => s + (d.lluvia || 0), 0);
    if (fuertes.length) {
      out.push({
        clase: 'alerta', icono: '⛈️',
        titulo: `Esta semana: lluvia fuerte (${Math.round(total)} mm en 7 días)`,
        porque: `Se espera mucha lluvia el ${fuertes.map(d => nombreDia(d.fecha, d.i, true)).join(', ')}.`,
        acciones: [
          'Limpie zanjas y canales antes de esos días.',
          'No aplique abono ni fumigue antes de la lluvia: el agua se lo lleva.',
          'Evite arar o cosechar con el suelo empapado.'
        ],
        tecnico: `Pronóstico Open-Meteo, precipitación diaria ≥ 20 mm; acumulado 7 días ${total.toFixed(1)} mm.`
      });
    } else if (total < 2 && !helada.length) {
      out.push({
        clase: 'info', icono: '☀️', titulo: 'Esta semana: casi sin lluvia',
        porque: `Se esperan menos de 2 mm de lluvia en 7 días.`,
        acciones: ['Si va a sembrar, asegure el riego o espere a que vuelva la lluvia.', 'Cubra el suelo con rastrojo para guardar la humedad.'],
        tecnico: `Pronóstico Open-Meteo, acumulado 7 días ${total.toFixed(1)} mm.`
      });
    }
    return out;
  }

  function tarjeta(pron, error) {
    if (error) {
      return `<div class="pron-cabeza"><strong>🌦️ Esta semana en su lote</strong></div>
        <p class="pron-nota">No se pudo cargar el pronóstico (sin internet). El resto de la página funciona igual.</p>`;
    }
    if (!pron) {
      return `<div class="pron-cabeza"><strong>🌦️ Esta semana en su lote</strong></div><p class="pron-nota">Cargando pronóstico…</p>`;
    }
    const dias = pron.dias.map((d, i) => {
      const [em, txt] = cielo(d.code);
      const frio = d.tmin <= 0 ? 'riesgo' : (d.tmin <= 2 ? 'alerta' : '');
      return `<div class="pron-dia ${frio}" role="listitem" aria-label="${nombreDia(d.fecha, i, true)}: ${txt}, mínima ${d.tmin} grados, máxima ${d.tmax}, lluvia ${d.lluvia} milímetros">
        <span class="pron-nombre">${nombreDia(d.fecha, i)}</span>
        <span class="pron-emoji" aria-hidden="true">${em}</span>
        <span class="pron-temp"><b>${Math.round(d.tmax)}°</b> <span>${Math.round(d.tmin)}°</span></span>
        <span class="pron-lluvia">${d.lluvia >= 0.1 ? `💧 ${d.lluvia.toFixed(d.lluvia < 10 ? 1 : 0)} mm` : '—'}</span>
      </div>`;
    }).join('');
    return `<div class="pron-cabeza"><strong>🌦️ Esta semana en su lote</strong><span class="pron-fuente">Open-Meteo · ajustado a su altura</span></div>
      <div class="pron-dias" role="list">${dias}</div>`;
  }

  window.Pronostico = { cargar, avisos, tarjeta };
})();

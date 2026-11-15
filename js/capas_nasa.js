/**
 * capas_nasa.js — Capas satelitales de la NASA (GIBS) y mapas base abiertos para el mapa del lote.
 *
 * Fuentes (todas abiertas):
 *  - NASA GIBS (dominio público): MODIS NDVI, SMAP L4 humedad de raíz, GPM IMERG lluvia,
 *    MODIS temperatura de superficie y VIIRS imagen del día.
 *  - OpenStreetMap (ODbL), OpenTopoMap (CC-BY-SA, relieve hecho con SRTM de la NASA)
 *    y Sentinel-2 cloudless 2016 de EOX (CC BY 4.0, datos Copernicus).
 *
 * GIBS publica cada capa en un nivel de mosaico (GoogleMapsCompatible_LevelN). Si el nivel
 * declarado no responde, la capa prueba los otros niveles posibles por sí sola.
 */
(function () {
  'use strict';

  const GIBS = 'https://gibs.earthdata.nasa.gov/wmts/epsg3857/best';

  function fechaISO(diasAtras) {
    const d = new Date(Date.now() - diasAtras * 86400000);
    return d.toISOString().slice(0, 10);
  }

  // Capas NASA: id GIBS, formato, niveles a probar (el primero es el documentado), días de retraso típicos.
  const CAPAS = [
    {
      clave: 'ndvi', id: 'MODIS_Terra_NDVI_8Day', ext: 'png', niveles: [9, 8, 7], retraso: 10,
      emoji: '🌱', nombre: 'Verdor de cultivos', sensor: 'MODIS Terra NDVI · 8 días · 250 m',
      leyenda: 'Café = suelo pelado o seco · Verde intenso = cultivo vigoroso',
      gradiente: 'linear-gradient(90deg,#c8a165,#e6d27a,#9bc35a,#3d8b2f,#0f5a1e)'
    },
    {
      clave: 'humedad', id: 'SMAP_L4_Analyzed_Root_Zone_Soil_Moisture', ext: 'png', niveles: [6, 7, 5, 8], retraso: 5,
      emoji: '💧', nombre: 'Humedad del suelo (raíz)', sensor: 'SMAP L4 · 0–100 cm · 9 km',
      leyenda: 'Tonos claros = suelo seco · Tonos intensos = suelo húmedo',
      gradiente: null
    },
    {
      clave: 'lluvia', id: 'IMERG_Precipitation_Rate', ext: 'png', niveles: [6, 7, 5, 8], retraso: 2,
      emoji: '🌧️', nombre: 'Lluvia reciente', sensor: 'GPM IMERG · 30 min · 10 km',
      leyenda: 'Colores = intensidad de la lluvia en ese momento (mm/h)',
      gradiente: null
    },
    {
      clave: 'temp', id: 'MODIS_Terra_Land_Surface_Temp_Day', ext: 'png', niveles: [7, 6, 8], retraso: 2,
      emoji: '🌡️', nombre: 'Temperatura del suelo (día)', sensor: 'MODIS Terra LST · diaria · 1 km',
      leyenda: 'Azul = frío · Rojo = caliente',
      gradiente: 'linear-gradient(90deg,#2c3e9e,#4ba3d6,#f2e86d,#f08a2b,#b21e1e)'
    }
  ];

  const BASES = [
    {
      clave: 'sentinel', nombre: 'Satélite (Sentinel-2)', emoji: '🛰️',
      url: 'https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless_3857/default/g/{z}/{y}/{x}.jpg',
      opts: { maxZoom: 19, maxNativeZoom: 15, attribution: 'Sentinel-2 cloudless 2016 © <a href="https://s2maps.eu">EOX</a> (CC BY 4.0), datos Copernicus' }
    },
    {
      clave: 'relieve', nombre: 'Relieve (SRTM)', emoji: '⛰️',
      url: 'https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png',
      opts: { maxZoom: 17, attribution: '© OpenStreetMap, SRTM · estilo © <a href="https://opentopomap.org">OpenTopoMap</a> (CC-BY-SA)' }
    },
    {
      clave: 'calles', nombre: 'Caminos y comunidades', emoji: '🗺️',
      url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      opts: { maxZoom: 19, attribution: '© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>' }
    },
    {
      clave: 'viirs', nombre: 'Imagen NASA del día', emoji: '🌎', gibs: true,
      id: 'VIIRS_SNPP_CorrectedReflectance_TrueColor', ext: 'jpg', niveles: [9, 8], retraso: 1,
      opts: { maxZoom: 19, attribution: 'NASA GIBS · VIIRS SNPP' }
    }
  ];

  /** Capa GIBS que prueba otro nivel de mosaico si el primero falla. */
  function capaGibs(def, fecha, opciones) {
    let idx = 0;
    let exitos = 0;
    let errores = 0;
    const plantilla = () => `${GIBS}/${def.id}/default/${fecha()}/GoogleMapsCompatible_Level${def.niveles[idx]}/{z}/{y}/{x}.${def.ext}`;
    const capa = L.tileLayer(plantilla(), Object.assign({
      maxZoom: 19,
      maxNativeZoom: def.niveles[0],
      opacity: 0.7,
      attribution: `NASA GIBS · ${def.sensor || def.id}`,
      crossOrigin: true
    }, opciones || {}));
    capa.on('tileload', () => { exitos++; capa.fire('estado', { ok: true }); });
    // GIBS devuelve mosaicos vacíos (200) donde no hay dato; un 404 sin ningún éxito
    // significa que el nivel de mosaico o la fecha no existen para esa capa.
    capa.on('tileerror', () => {
      errores++;
      if (exitos === 0 && errores >= 1 && idx < def.niveles.length - 1) {
        idx++; errores = 0;
        capa.options.maxNativeZoom = def.niveles[idx];
        capa.setUrl(plantilla());
      } else if (exitos === 0 && errores >= 2) {
        capa.fire('estado', { ok: false });
      }
    });
    capa.actualizarFecha = () => { exitos = 0; errores = 0; capa.setUrl(plantilla()); };
    return capa;
  }

  function enlaceWorldview(def, map, fecha) {
    const b = map.getBounds();
    const v = [b.getWest(), b.getSouth(), b.getEast(), b.getNorth()].map(n => n.toFixed(3)).join(',');
    return `https://worldview.earthdata.nasa.gov/?v=${v}&l=${def.id},Coastlines_15m&t=${fecha}`;
  }

  /**
   * Monta el panel de capas sobre el mapa.
   * contenedor: elemento HTML donde va el panel (debajo del mapa).
   */
  function montar(map, contenedor) {
    const estado = { base: null, capa: null, fechaManual: null };
    const fechaDe = def => () => estado.fechaManual || fechaISO(def.retraso);

    const bases = {};
    BASES.forEach(b => {
      bases[b.clave] = b.gibs ? capaGibs(b, fechaDe(b), Object.assign({ opacity: 1 }, b.opts)) : L.tileLayer(b.url, b.opts);
    });
    const capas = {};
    CAPAS.forEach(c => { capas[c.clave] = capaGibs(c, fechaDe(c)); });

    // Quita cualquier capa base previa y deja Sentinel-2 por defecto
    map.eachLayer(l => { if (l instanceof L.TileLayer) map.removeLayer(l); });
    estado.base = bases.sentinel.addTo(map);

    contenedor.innerHTML = `
      <div class="capas-cabeza">
        <strong><span aria-hidden="true">🛰️</span> Capas de la NASA sobre su lote</strong>
        <label class="capas-fecha">Fecha
          <input type="date" id="capas-fecha" max="${fechaISO(0)}" />
        </label>
      </div>
      <div class="capas-fila" role="group" aria-label="Mapa base">
        <span class="capas-etiqueta">Mapa</span>
        ${BASES.map(b => `<button type="button" class="capa-chip${b.clave === 'sentinel' ? ' activo' : ''}" data-base="${b.clave}" aria-pressed="${b.clave === 'sentinel'}"><span aria-hidden="true">${b.emoji}</span> ${b.nombre}</button>`).join('')}
      </div>
      <div class="capas-fila" role="group" aria-label="Capa NASA">
        <span class="capas-etiqueta">Ver</span>
        <button type="button" class="capa-chip activo" data-capa="" aria-pressed="true">Ninguna</button>
        ${CAPAS.map(c => `<button type="button" class="capa-chip" data-capa="${c.clave}" aria-pressed="false"><span aria-hidden="true">${c.emoji}</span> ${c.nombre}</button>`).join('')}
      </div>
      <div class="capas-leyenda" id="capas-leyenda" hidden>
        <div class="capas-leyenda-txt"><strong id="capas-ley-titulo"></strong><span id="capas-ley-sensor"></span><span id="capas-ley-texto"></span></div>
        <div class="capas-leyenda-ctrl">
          <span class="capas-gradiente" id="capas-gradiente" aria-hidden="true"></span>
          <label>Transparencia <input type="range" id="capas-opacidad" min="20" max="100" value="70" /></label>
          <a id="capas-worldview" target="_blank" rel="noopener">Ver escala oficial en NASA Worldview ↗</a>
          <span class="capas-aviso" id="capas-aviso" role="status"></span>
        </div>
      </div>`;

    const leyenda = contenedor.querySelector('#capas-leyenda');
    const aviso = contenedor.querySelector('#capas-aviso');
    const inpFecha = contenedor.querySelector('#capas-fecha');
    const inpOpac = contenedor.querySelector('#capas-opacidad');
    const linkWv = contenedor.querySelector('#capas-worldview');
    let defActual = null;

    const pintarLeyenda = () => {
      if (!defActual) { leyenda.hidden = true; return; }
      leyenda.hidden = false;
      contenedor.querySelector('#capas-ley-titulo').textContent = `${defActual.emoji} ${defActual.nombre}`;
      contenedor.querySelector('#capas-ley-sensor').textContent = `${defActual.sensor} · imagen del ${estado.fechaManual || fechaISO(defActual.retraso)}`;
      contenedor.querySelector('#capas-ley-texto').textContent = defActual.leyenda;
      const g = contenedor.querySelector('#capas-gradiente');
      g.hidden = !defActual.gradiente;
      if (defActual.gradiente) g.style.background = defActual.gradiente;
      linkWv.href = enlaceWorldview(defActual, map, estado.fechaManual || fechaISO(defActual.retraso));
    };

    contenedor.querySelectorAll('[data-base]').forEach(btn => btn.addEventListener('click', () => {
      const nueva = bases[btn.getAttribute('data-base')];
      if (estado.base) map.removeLayer(estado.base);
      estado.base = nueva.addTo(map);
      nueva.bringToBack();
      contenedor.querySelectorAll('[data-base]').forEach(b => { b.classList.toggle('activo', b === btn); b.setAttribute('aria-pressed', b === btn); });
    }));

    contenedor.querySelectorAll('[data-capa]').forEach(btn => btn.addEventListener('click', () => {
      const clave = btn.getAttribute('data-capa');
      if (estado.capa) { map.removeLayer(estado.capa); estado.capa = null; }
      aviso.textContent = '';
      defActual = CAPAS.find(c => c.clave === clave) || null;
      if (defActual) {
        estado.capa = capas[clave];
        estado.capa.setOpacity(Number(inpOpac.value) / 100);
        estado.capa.off('estado').on('estado', e => {
          aviso.textContent = e.ok ? '' : 'Sin imagen para esa fecha (nubes o satélite sin pasar): pruebe otra fecha.';
        });
        estado.capa.addTo(map);
        // Una capa de 9 km no se ve a zoom de parcela: alejar un poco para que se entienda
        if (['humedad', 'lluvia'].includes(clave) && map.getZoom() > 11) map.setZoom(10);
        if (['ndvi', 'temp'].includes(clave) && map.getZoom() > 14) map.setZoom(13);
      }
      contenedor.querySelectorAll('[data-capa]').forEach(b => { b.classList.toggle('activo', b === btn); b.setAttribute('aria-pressed', b === btn); });
      pintarLeyenda();
    }));

    inpOpac.addEventListener('input', () => { if (estado.capa) estado.capa.setOpacity(Number(inpOpac.value) / 100); });
    inpFecha.addEventListener('change', () => {
      estado.fechaManual = inpFecha.value || null;
      Object.values(capas).forEach(c => c.actualizarFecha());
      if (bases.viirs.actualizarFecha) bases.viirs.actualizarFecha();
      pintarLeyenda();
    });
    map.on('moveend', () => { if (defActual) linkWv.href = enlaceWorldview(defActual, map, estado.fechaManual || fechaISO(defActual.retraso)); });
    return estado;
  }

  window.CapasNASA = { montar, CAPAS, BASES };
})();

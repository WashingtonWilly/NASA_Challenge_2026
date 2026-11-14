/**
 * app.js — Capa C: Controlador Interactivo de Interfaz, Mapa Satelital Leaflet + Leaflet.draw,
 * Gráficos Chart.js (Balance Hídrico 36m + Historial HLS NDVI/NDTI) y Explicabilidad NASA.
 */
(function () {
  'use strict';

  const HA_POR_CUADRA = 0.7056; // 1 cuadra ecuatoriana (84m x 84m) ≈ 0.7056 hectáreas

  const state = {
    catalogo: null,
    parcelasOriginales: {},
    parcelasActivas: {},
    parcelaActualId: 'parcela_chimborazo_1',
    sliders: {
      agua: 3,
      suelo: 3,
      ganar: 3
    },
    opciones: {
      escenarioLluviaPct: 0,
      retiraForraje: false,
      priorizarForraje: false
    },
    ultimoResultado: null,
    rotacionSeleccionadaGraficoId: 'recomendada_1',
    map: null,
    drawnItems: null,
    activePolygonLayer: null,
    chartBalance: null,
    chartHLS: null
  };

  function clonar(obj) {
    return JSON.parse(JSON.stringify(obj));
  }

  function haACuadras(ha) {
    return (Number(ha || 0) / HA_POR_CUADRA).toFixed(1);
  }

  /**
   * Calcula el área geodésica aproximada en hectáreas de un polígono LatLng de Leaflet
   */
  function calcularAreaPoligonoHa(latlngs) {
    if (!latlngs || latlngs.length < 3) return 1.5;
    const R = 6378137; // Radio terrestre en metros
    let areaM2 = 0;
    const n = latlngs.length;
    for (let i = 0; i < n; i++) {
      const p1 = latlngs[i];
      const p2 = latlngs[(i + 1) % n];
      const x1 = (p1.lng * Math.PI) / 180;
      const y1 = (p1.lat * Math.PI) / 180;
      const x2 = (p2.lng * Math.PI) / 180;
      const y2 = (p2.lat * Math.PI) / 180;
      areaM2 += (x2 - x1) * (2 + Math.sin(y1) + Math.sin(y2));
    }
    areaM2 = (Math.abs(areaM2) * R * R) / 2.0;
    return Math.max(0.2, Number((areaM2 / 10000).toFixed(2)));
  }

  /**
   * Inicializa los datos desde js/datos_embebidos.js (funciona sin servidor y con servidor)
   */
  function cargarDatosIniciales() {
    if (window.CATALOGO_CULTIVOS && window.PARCELAS_DEMO) {
      state.catalogo = clonar(window.CATALOGO_CULTIVOS);
      for (const [id, p] of Object.entries(window.PARCELAS_DEMO)) {
        state.parcelasOriginales[id] = clonar(p);
        state.parcelasActivas[id] = clonar(p);
      }
      return Promise.resolve();
    }
    return Promise.all([
      fetch('data/cultivos.json').then(r => r.json()),
      fetch('data/parcelas/parcela_chimborazo_1.json').then(r => r.json()),
      fetch('data/parcelas/parcela_el_oro_2.json').then(r => r.json()),
      fetch('data/parcelas/parcela_colta_3.json').then(r => r.json())
    ]).then(([cat, p1, p2, p3]) => {
      state.catalogo = cat;
      [p1, p2, p3].forEach(p => {
        state.parcelasOriginales[p.id] = clonar(p);
        state.parcelasActivas[p.id] = clonar(p);
      });
    });
  }

  function obtenerParcelaActual() {
    return state.parcelasActivas[state.parcelaActualId];
  }

  /**
   * Inicializa el mapa satelital Leaflet con Esri World Imagery + OpenTopoMap + Leaflet.draw
   */
  function inicializarMapa() {
    const mapEl = document.getElementById('mapa-parcela');
    if (!mapEl || typeof L === 'undefined') return;

    const parcela = obtenerParcelaActual();
    const lat = parcela.centroide?.lat ?? -1.7848;
    const lon = parcela.centroide?.lon ?? -78.6125;

    const esriSat = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      {
        maxZoom: 19,
        attribution: 'Imágenes © Esri, Maxar, Earthstar Geographics | Datos NASA POWER, SRTM, HLS, GPM'
      }
    );

    const osmCalle = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      {
        maxZoom: 19,
        attribution: '© OpenStreetMap contributors'
      }
    );

    state.map = L.map('mapa-parcela', {
      center: [lat, lon],
      zoom: 16,
      layers: [esriSat]
    });

    L.control.layers(
      {
        '🛰️ Satélite (Esri World Imagery)': esriSat,
        '🗺️ Mapa de Caminos y Comunidades (OSM)': osmCalle
      },
      {},
      { position: 'topright' }
    ).addTo(state.map);

    state.drawnItems = new L.FeatureGroup();
    state.map.addLayer(state.drawnItems);

    if (L.Control && L.Control.Draw) {
      const drawControl = new L.Control.Draw({
        position: 'topleft',
        draw: {
          polygon: {
            allowIntersection: false,
            showArea: true,
            shapeOptions: {
              color: '#F59E0B',
              weight: 3,
              fillOpacity: 0.28
            }
          },
          rectangle: {
            shapeOptions: {
              color: '#F59E0B',
              weight: 3,
              fillOpacity: 0.28
            }
          },
          polyline: false,
          circle: false,
          marker: false,
          circlemarker: false
        },
        edit: {
          featureGroup: state.drawnItems,
          remove: false
        }
      });
      state.map.addControl(drawControl);

      state.map.on(L.Draw.Event.CREATED, function (e) {
        const layer = e.layer;
        state.drawnItems.clearLayers();
        state.drawnItems.addLayer(layer);

        const latlngs = layer.getLatLngs()[0] || [];
        const areaHa = calcularAreaPoligonoHa(latlngs);
        const bounds = layer.getBounds();
        const center = bounds.getCenter();

        const p = obtenerParcelaActual();
        p.area_ha = areaHa;
        p.centroide = {
          lat: Number(center.lat.toFixed(4)),
          lon: Number(center.lng.toFixed(4))
        };
        p.geometria = {
          type: 'Polygon',
          coordinates: [latlngs.map(pt => [Number(pt.lng.toFixed(5)), Number(pt.lat.toFixed(5))])]
        };

        layer.bindPopup(crearPopupParcelaHtml(p)).openPopup();
        actualizarTodo();
      });
    }

    dibujarPoligonoParcelaActual(true);
  }

  function crearPopupParcelaHtml(parcela) {
    const cuadras = haACuadras(parcela.area_ha);
    return `
      <div style="font-family: sans-serif; min-width: 210px;">
        <strong style="font-size: 0.95rem; color: #16261C;">${parcela.nombre}</strong>
        <div style="font-size: 0.82rem; color: #3E5245; margin-top: 4px;">
          📍 ${parcela.ubicacion_texto}<br/>
          📐 <b>${parcela.area_ha} ha</b> (${cuadras} cuadras)<br/>
          ⛰️ Altitud: <b>${parcela.terreno.elev_m} m s.n.m.</b> | Pendiente: <b>${parcela.terreno.pendiente_pct}%</b><br/>
          🧪 Suelo: <b>${parcela.suelo.textura}</b> (MO/SOC: ${parcela.suelo.soc_pct}%, pH ${parcela.suelo.ph})
        </div>
      </div>
    `;
  }

  function dibujarPoligonoParcelaActual(centrar) {
    if (!state.map || !state.drawnItems) return;
    const parcela = obtenerParcelaActual();
    state.drawnItems.clearLayers();

    const coords = (parcela.geometria && parcela.geometria.coordinates && parcela.geometria.coordinates[0]) || [];
    if (coords.length > 0) {
      const latlngs = coords.map(par => [par[1], par[0]]);
      const colorBorde = parcela.terreno.pendiente_pct > 25
        ? '#C92A2A'
        : (parcela.terreno.pendiente_pct >= 12 ? '#F59E0B' : '#22C55E');

      const poly = L.polygon(latlngs, {
        color: colorBorde,
        weight: 3,
        fillColor: colorBorde,
        fillOpacity: 0.25
      });

      poly.bindPopup(crearPopupParcelaHtml(parcela));
      state.drawnItems.addLayer(poly);

      if (centrar) {
        state.map.fitBounds(poly.getBounds(), { padding: [45, 45], maxZoom: 16 });
      }
    }
  }

  /**
   * Renderiza el Banner Permanente de Anomalía GPM IMERG + SMAP L4
   */
  function renderizarBannerAnomalia(parcela, pesos) {
    const anom = parcela.anomalia || { pct: 0, ventana: 'trimestre actual', mensaje: '' };
    const cardEl = document.getElementById('anomaly-card');
    const titleEl = document.getElementById('anomaly-title');
    const msgEl = document.getElementById('anomaly-message');
    const pillSensorEl = document.getElementById('anomaly-sensor-pill');
    const pillWeightEl = document.getElementById('anomaly-weight-pill');

    const esSeco = anom.pct < -15 || state.opciones.escenarioLluviaPct <= -15;
    if (cardEl) {
      cardEl.className = esSeco ? 'anomaly-card' : 'anomaly-card anomaly-normal';
    }

    const signo = anom.pct > 0 ? '+' : '';
    if (titleEl) {
      titleEl.textContent = esSeco
        ? `Alerta Satelital de Sequía Regional (${signo}${anom.pct}% lluvias en ${anom.ventana})`
        : `Monitoreo Hidrológico Regional (${signo}${anom.pct}% en ${anom.ventana})`;
    }
    if (msgEl) {
      msgEl.textContent = anom.mensaje;
    }
    if (pillSensorEl) {
      pillSensorEl.textContent = `🛰️ ${anom.fuente || 'NASA GPM IMERG + SMAP'} (${anom.res_km || 10} km)`;
    }
    if (pillWeightEl) {
      pillWeightEl.textContent = pesos && pesos.ajusteSequiaAplicado
        ? `⚡ Peso de Ahorro de Agua ×1.3 activo (${Math.round(pesos.w_h2o * 100)}% del IRR)`
        : `💧 Peso de Agua actual: ${Math.round((pesos ? pesos.w_h2o : 0.33) * 100)}% del IRR`;
    }
  }

  /**
   * Renderiza los KPIs biofísicos y vulnerabilidades de campo del Paso 1
   */
  function renderizarPaso1Terreno(parcela) {
    const cuadras = haACuadras(parcela.area_ha);
    document.getElementById('kpi-area-val').textContent = `${parcela.area_ha} ha`;
    document.getElementById('kpi-area-sub').textContent = `Equivale a ~${cuadras} cuadras (${parcela.ubicacion_texto})`;

    document.getElementById('kpi-elev-val').textContent = `${parcela.terreno.elev_m} m s.n.m.`;
    document.getElementById('kpi-elev-sub').textContent = `Región ${parcela.region} | Orientación ${parcela.terreno.orientacion}`;

    document.getElementById('kpi-pend-val').textContent = `${parcela.terreno.pendiente_pct}% media`;
    document.getElementById('kpi-pend-sub').textContent = `Máxima en lote: ${parcela.terreno.pendiente_max_pct}% (Factor escorrentía f=${window.BalanceMotor.factorPendiente(parcela.terreno.pendiente_pct)})`;

    const lluviaAnual = (parcela.clima_mensual || []).reduce((acc, m) => acc + m.P_mm, 0);
    const et0Anual = (parcela.clima_mensual || []).reduce((acc, m) => acc + m.ET0_mm, 0);
    const factorEsc = 1 + (state.opciones.escenarioLluviaPct || 0) / 100;
    const lluviaEscenario = Math.round(lluviaAnual * factorEsc);

    document.getElementById('kpi-clima-val').textContent = `${lluviaEscenario} mm/año`;
    document.getElementById('kpi-clima-sub').textContent = `Demanda evaporativa ET₀: ${Math.round(et0Anual)} mm/año (10 años NASA POWER)`;

    // Diagnóstico de vulnerabilidades en la parcela
    const vulnContainer = document.getElementById('vuln-badges-container');
    const badges = [];

    if (parcela.terreno.pendiente_pct > 25) {
      badges.push({
        nivel: 'alto',
        texto: `🚨 Erosión crítica (Pendiente ${parcela.terreno.pendiente_pct}% > 25%): Prohibida labranza intensiva`
      });
    } else if (parcela.terreno.pendiente_pct >= 12) {
      badges.push({
        nivel: 'medio',
        texto: `⛰️ Ladera moderada (${parcela.terreno.pendiente_pct}%): Requiere surcos en contorno y rastrojo`
      });
    } else {
      badges.push({
        nivel: 'bajo',
        texto: `🟢 Relieve plano/suave (${parcela.terreno.pendiente_pct}%): Baja pérdida por escorrentía`
      });
    }

    const minAbs = Math.min(...(parcela.clima_mensual || []).map(m => m.Tmin_abs));
    if (minAbs < 0) {
      badges.push({
        nivel: 'alto',
        texto: `❄️ Riesgo de helada severa (Tmin absoluta ${minAbs} °C en verano): Vetados cultivos sensibles`
      });
    } else if (minAbs < 2.0) {
      badges.push({
        nivel: 'medio',
        texto: `🌡️ Enfriamiento nocturno (Tmin ${minAbs} °C en Jun–Ago): Cuidar época de floración`
      });
    } else {
      badges.push({
        nivel: 'bajo',
        texto: `☀️ Sin riesgo de helada (Tmin mínima ${minAbs} °C)`
      });
    }

    const mesesDesnudo = (parcela.ndvi_mensual || []).filter(m => m.ndvi < 0.25).length;
    const totalObs = (parcela.ndvi_mensual || []).length || 24;
    if (mesesDesnudo >= 8) {
      badges.push({
        nivel: 'medio',
        texto: `🛰️ Suelo desnudo frecuente: ${mesesDesnudo} de ${totalObs} meses con NDVI < 0.25 (HLS 30 m)`
      });
    } else {
      badges.push({
        nivel: 'bajo',
        texto: `🌿 Buena cobertura vegetal histórica (${totalObs - mesesDesnudo}/${totalObs} meses cubiertos)`
      });
    }

    vulnContainer.innerHTML = badges
      .map(b => `<span class="vuln-badge ${b.nivel}">${b.texto}</span>`)
      .join('');
  }

  /**
   * Pobla los selectores e inputs del Paso 2 (Suelo editable + Historial de cultivos)
   */
  function sincronizarControlesPaso2ConParcela() {
    const parcela = obtenerParcelaActual();

    const selTextura = document.getElementById('input-suelo-textura');
    const inpSoc = document.getElementById('input-suelo-soc');
    const inpPh = document.getElementById('input-suelo-ph');
    const badgeOrigen = document.getElementById('soil-origin-badge');

    if (selTextura) selTextura.value = parcela.suelo.textura || 'Franco';
    if (inpSoc) inpSoc.value = parcela.suelo.soc_pct ?? 2.5;
    if (inpPh) inpPh.value = parcela.suelo.ph ?? 6.0;

    if (badgeOrigen) {
      if (parcela.suelo.editado_por_usuario) {
        badgeOrigen.textContent = '✍️ Editado con dato de campo por el agricultor';
        badgeOrigen.className = 'soil-origin-badge editado';
      } else {
        badgeOrigen.textContent = `🛰️ ${parcela.suelo.fuente || 'ISRIC SoilGrids 250 m'}`;
        badgeOrigen.className = 'soil-origin-badge';
      }
    }

    // Poblar los 2 selectores de historia (2024 y 2025)
    const selHist1 = document.getElementById('select-historia-1');
    const selHist2 = document.getElementById('select-historia-2');
    if (selHist1 && selHist2 && state.catalogo) {
      const opcionesHtml = state.catalogo.cultivos
        .map(c => `<option value="${c.id}">${c.icono} ${c.nombre} (${c.familia})</option>`)
        .join('');
      selHist1.innerHTML = opcionesHtml;
      selHist2.innerHTML = opcionesHtml;

      const h1 = (parcela.historia_declarada && parcela.historia_declarada[0]) || 'papa';
      const h2 = (parcela.historia_declarada && parcela.historia_declarada[1]) || h1;
      selHist1.value = h1;
      selHist2.value = h2;
    }

    const chkNem = document.getElementById('check-nematodo');
    if (chkNem) {
      chkNem.checked = Boolean(parcela.nematodo_declarado);
    }
  }

  /**
   * Renderiza las tarjetas comparativas del Paso 3 (Top 3 Recomendadas + Práctica Actual)
   */
  function renderizarTarjetasRotacion(resultado, parcela) {
    const grid = document.getElementById('rotations-cards-grid');
    if (!grid) return;

    const metaBar = document.getElementById('engine-meta-bar');
    if (metaBar) {
      const p = resultado.pesosAplicados;
      metaBar.innerHTML = `
        <div>
          ⚡ <strong>Motor Agronómico ejecutado en <span class="tabular-nums">${resultado.tiempoCalculoMs} ms</span></strong>
          — Evaluadas <strong class="tabular-nums">${resultado.totalSecuenciasEvaluadas}</strong> secuencias válidas de 3 años
          (${resultado.cultivosAptos.length} cultivos aptos en este piso térmico, ${resultado.cultivosVetados.length} vetados).
        </div>
        <div class="tabular-nums">
          Pesos IRR activos: 💧Agua <b>${Math.round(p.w_h2o * 100)}%</b> |
          🌱Nitrógeno <b>${Math.round(p.w_n * 100)}%</b> |
          🪱Suelo/MOS <b>${Math.round(p.w_mos * 100)}%</b> |
          💰Rentabilidad <b>${Math.round(p.w_rent * 100)}%</b>
        </div>
      `;
    }

    const todasLasTarjetas = [...resultado.recomendadas, resultado.actual];
    const areaHa = parcela.area_ha || 1.0;

    grid.innerHTML = todasLasTarjetas.map((rot, idx) => {
      const esSeleccionadaGrafico = rot.id === state.rotacionSeleccionadaGraficoId;
      const clasesCard = [
        'rotation-card',
        rot.rango === 1 ? 'rank-1' : '',
        rot.esActual ? 'actual-card' : '',
        esSeleccionadaGrafico ? 'selected-for-chart' : ''
      ].filter(Boolean).join(' ');

      const anosEtiquetas = ['Año 1 (2026–2027)', 'Año 2 (2027–2028)', 'Año 3 (2028–2029)'];
      const timelineHtml = rot.cultivos.map((c, i) => {
        const signoN = c.credito_n_kg > 0
          ? `<span style="color:#155727; font-weight:700;">+${c.credito_n_kg} kg N/ha</span>`
          : `<span style="color:#7A4B00;">-${c.extraccion_n_kg} kg N/ha</span>`;
        return `
          <div class="year-node">
            <span class="year-label">${anosEtiquetas[i]}</span>
            <div class="crop-name-row">
              <span>${c.icono || '🌱'}</span>
              <span>${c.nombre}</span>
            </div>
            <span class="crop-family-tag">${c.familia}</span>
            <div class="crop-meta-mini">
              Raíz: ${c.raiz_tipo}<br/>
              Balance N: ${signoN}<br/>
              Margen: <b>$${(c.margen_usd_ha || 0).toLocaleString()}/ha</b>
            </div>
          </div>
        `;
      }).join('');

      const wAguaPct = Math.round(rot.subindices.agua * 100);
      const wNitPct = Math.round(rot.subindices.nitrogeno * 100);
      const wMosPct = Math.round(rot.subindices.materiaOrganica * 100);
      const wRentPct = Math.round(rot.subindices.rentabilidad * 100);

      const ingresoTotalLoteAnual = Math.round(rot.detalles.rentabilidad.margenAnualPromedioUsdHa * areaHa);
      const alertaFitoHtml = rot.violaReglasFitosanitarias
        ? `<div style="background:var(--sem-rojo-bg); border:1px solid var(--sem-rojo-border); color:var(--sem-rojo-text); padding:8px 12px; border-radius:8px; font-size:0.83rem; font-weight:700;">
             ⚠️ Alerta Fitosanitaria: ${rot.motivoRiesgoFitosanitario}
           </div>`
        : '';

      return `
        <article class="${clasesCard}" data-rot-id="${rot.id}">
          <div class="rot-card-header">
            <div class="rot-title-group">
              <span class="rot-strategy-badge ${rot.semaforo.color}">
                ${rot.semaforo.icono} ${rot.semaforo.etiqueta}
              </span>
              <h3 class="rot-card-title">${rot.titulo}</h3>
            </div>
            <div class="irr-score-badge">
              <div class="irr-score-num">${rot.irr.toFixed(2)}</div>
              <div class="irr-score-label">Índice IRR (${rot.irrPct}/100)</div>
            </div>
          </div>

          ${alertaFitoHtml}

          <div class="timeline-3y">
            ${timelineHtml}
          </div>

          <div class="subindices-bars">
            <div class="subbar-item">
              <div class="subbar-head">
                <span>💧 Agua cubierta por lluvia</span>
                <span class="tabular-nums">${rot.balanceHidrico.coberturaAguaPct}% (I_H2O ${rot.subindices.agua.toFixed(2)})</span>
              </div>
              <div class="subbar-track"><div class="subbar-fill agua" style="width:${wAguaPct}%"></div></div>
              <div class="subbar-translation">Déficit 3 años: <b>${rot.balanceHidrico.deficitTotal} mm</b> (${rot.balanceHidrico.mesesConDeficit} meses secos)</div>
            </div>

            <div class="subbar-item">
              <div class="subbar-head">
                <span>🌱 Balance de Nitrógeno</span>
                <span class="tabular-nums">${rot.detalles.nitrogeno.balanceNetoKgHa >= 0 ? '+' : ''}${rot.detalles.nitrogeno.balanceNetoKgHa} kg N/ha (I_N ${rot.subindices.nitrogeno.toFixed(2)})</span>
              </div>
              <div class="subbar-track"><div class="subbar-fill nitrogeno" style="width:${wNitPct}%"></div></div>
              <div class="subbar-translation">Fijación leguminosas: <b>+${rot.detalles.nitrogeno.creditosKgHa} kg N/ha</b></div>
            </div>

            <div class="subbar-item">
              <div class="subbar-head">
                <span>🪱 Materia Orgánica y Suelo</span>
                <span class="tabular-nums">${rot.detalles.materiaOrganica.humusEstableTHa} t/ha humus (I_MOS ${rot.subindices.materiaOrganica.toFixed(2)})</span>
              </div>
              <div class="subbar-track"><div class="subbar-fill mos" style="width:${wMosPct}%"></div></div>
              <div class="subbar-translation">Rastrojo: <b>${rot.detalles.materiaOrganica.biomasaResiduoTHa} t MS/ha</b> en 3 años</div>
            </div>

            <div class="subbar-item">
              <div class="subbar-head">
                <span>💰 Margen Bruto Estimado</span>
                <span class="tabular-nums">$${rot.detalles.rentabilidad.margenAnualPromedioUsdHa.toLocaleString()}/ha/año (I_rent ${rot.subindices.rentabilidad.toFixed(2)})</span>
              </div>
              <div class="subbar-track"><div class="subbar-fill rent" style="width:${wRentPct}%"></div></div>
              <div class="subbar-translation">En su lote (${areaHa} ha): <b>~$${ingresoTotalLoteAnual.toLocaleString()} USD/año</b></div>
            </div>
          </div>

          <div class="explain-5-box">
            <p class="explain-summary-text">
              <strong>1. ¿Por qué se sugiere?</strong> ${rot.explicacion.porQue}
            </p>
            <details class="explain-details" ${idx === 0 ? 'open' : ''}>
              <summary>🔍 Ver Evidencia Satelital NASA, Beneficios, Incertidumbre y Riesgos Locales (5 Puntos)</summary>
              <div class="explain-details-body">
                <div class="explain-block">
                  <h4>🛰️ 2. Evidencia Satelital NASA y de Suelo que la respalda</h4>
                  <ul>${rot.explicacion.evidenciaNasa.map(x => `<li>${x}</li>`).join('')}</ul>
                </div>
                <div class="explain-block">
                  <h4>🌾 3. Beneficios cuantificados para su explotación</h4>
                  <ul>${rot.explicacion.beneficios.map(x => `<li>${x}</li>`).join('')}</ul>
                </div>
                <div class="explain-block">
                  <h4>📡 4. Lagunas de información (Satélite vs. Medición en Tierra)</h4>
                  <ul>${rot.explicacion.lagunasInfo.map(x => `<li>${x}</li>`).join('')}</ul>
                </div>
                <div class="explain-block">
                  <h4>👩‍🌾 5. Riesgos que requieren validación local por el agricultor o técnico</h4>
                  <ul>${rot.explicacion.riesgosLocales.map(x => `<li>${x}</li>`).join('')}</ul>
                </div>
              </div>
            </details>
          </div>

          <div class="card-footer-actions">
            <button type="button" class="btn-ver-grafico" data-select-rot="${rot.id}">
              📊 ${esSeleccionadaGrafico ? 'Mostrando en Gráfico Hídrico de 36 Meses (Activa)' : 'Ver Balance Hídrico de 36 Meses de esta Estrategia'}
            </button>
          </div>
        </article>
      `;
    }).join('');

    // Enlazar botones para cambiar el gráfico de 36 meses
    grid.querySelectorAll('[data-select-rot]').forEach(btn => {
      btn.addEventListener('click', function () {
        state.rotacionSeleccionadaGraficoId = this.getAttribute('data-select-rot');
        renderizarTarjetasRotacion(state.ultimoResultado, obtenerParcelaActual());
        actualizarGraficoBalance36m();
      });
    });
  }

  /**
   * Renderiza o actualiza el Gráfico 1: Balance Hídrico Mensual a 36 Meses (Chart.js)
   */
  function actualizarGraficoBalance36m() {
    if (typeof Chart === 'undefined' || !state.ultimoResultado) return;
    const canvas = document.getElementById('chart-balance-36m');
    if (!canvas) return;

    const todas = [...state.ultimoResultado.recomendadas, state.ultimoResultado.actual];
    const rot = todas.find(r => r.id === state.rotacionSeleccionadaGraficoId) || todas[0];
    if (!rot || !rot.balanceHidrico || !rot.balanceHidrico.meses36) return;

    const meses = rot.balanceHidrico.meses36;
    const labels = meses.map(m => `${m.etiqueta} (${m.sueloDesnudo ? 'Descanso' : m.cultivoNombre.split(' ')[0]})`);
    const dataPef = meses.map(m => m.Pef_mm);
    const dataETc = meses.map(m => m.ETc_mm);
    const dataDeficit = meses.map(m => m.deficit_mm);

    const subtituloEl = document.getElementById('chart-balance-subtitle');
    if (subtituloEl) {
      subtituloEl.innerHTML = `Estrategia visualizada: <strong>${rot.titulo} (${rot.cultivos.map(c => c.nombre).join(' → ')})</strong> — Suelo descubierto: <b>${rot.balanceHidrico.mesesSinCobertura} de 36 meses</b> | Déficit acumulado: <b>${rot.balanceHidrico.deficitTotal} mm</b>`;
    }

    if (state.chartBalance) {
      state.chartBalance.destroy();
    }

    state.chartBalance = new Chart(canvas.getContext('2d'), {
      type: 'bar',
      data: {
        labels,
        datasets: [
          {
            type: 'line',
            label: 'Lluvia Efectiva Aprovechable Pef (mm/mes)',
            data: dataPef,
            borderColor: '#1971C2',
            backgroundColor: 'rgba(25, 113, 194, 0.14)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: 2
          },
          {
            type: 'line',
            label: 'Demanda del Cultivo ETc = Kc × ET₀ (mm/mes)',
            data: dataETc,
            borderColor: '#236B38',
            backgroundColor: 'transparent',
            borderWidth: 2.5,
            borderDash: [4, 3],
            tension: 0.25,
            pointRadius: 2
          },
          {
            type: 'bar',
            label: 'Déficit Hídrico Mensual (Riego requerido, mm)',
            data: dataDeficit,
            backgroundColor: 'rgba(201, 42, 42, 0.68)',
            borderColor: '#C92A2A',
            borderWidth: 1,
            borderRadius: 3
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 11, weight: 'bold' }
            }
          },
          tooltip: {
            callbacks: {
              afterBody: function (items) {
                const idx = items[0].dataIndex;
                const info = meses[idx];
                return `Estado lote: ${info.sueloDesnudo ? '⚠️ Suelo descubierto / descanso' : `${info.cultivoNombre} (Etapa ${info.etapa}, Kc=${info.kc})`}`;
              }
            }
          }
        },
        scales: {
          x: {
            ticks: {
              maxRotation: 45,
              minRotation: 45,
              autoSkip: true,
              maxTicksLimit: 18,
              font: { size: 10 }
            }
          },
          y: {
            beginAtZero: true,
            title: {
              display: true,
              text: 'Milímetros de agua (mm/mes)'
            }
          }
        }
      }
    });
  }

  /**
   * Renderiza el Gráfico 2: Serie Histórica Satelital HLS (Landsat + Sentinel-2, 30 m) NDVI y NDTI
   */
  function actualizarGraficoHLS(parcela) {
    if (typeof Chart === 'undefined') return;
    const canvas = document.getElementById('chart-hls-ndvi');
    if (!canvas) return;

    const serie = parcela.ndvi_mensual || [];
    const labels = serie.map(x => x.mes);
    const dataNdvi = serie.map(x => x.ndvi);
    const dataNdti = serie.map(x => x.ndti);
    const umbralDesnudo = serie.map(() => 0.25);

    if (state.chartHLS) {
      state.chartHLS.destroy();
    }

    state.chartHLS = new Chart(canvas.getContext('2d'), {
      type: 'line',
      data: {
        labels,
        datasets: [
          {
            label: 'Verdor del Cultivo (NDVI HLS 30 m)',
            data: dataNdvi,
            borderColor: '#236B38',
            backgroundColor: 'rgba(35, 107, 56, 0.18)',
            borderWidth: 2.5,
            fill: true,
            tension: 0.3,
            pointRadius: 3
          },
          {
            label: 'Cobertura de Rastrojo (NDTI SWIR)',
            data: dataNdti,
            borderColor: '#B85418',
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.3,
            pointRadius: 2
          },
          {
            label: 'Umbral de Suelo Desnudo (NDVI = 0.25)',
            data: umbralDesnudo,
            borderColor: '#C92A2A',
            borderWidth: 1.5,
            borderDash: [6, 4],
            pointRadius: 0,
            fill: false
          }
        ]
      },
      options: {
        responsive: true,
        maintainAspectRatio: false,
        interaction: {
          mode: 'index',
          intersect: false
        },
        plugins: {
          legend: {
            position: 'top',
            labels: {
              font: { size: 11, weight: 'bold' }
            }
          }
        },
        scales: {
          y: {
            min: 0,
            max: 1.0,
            title: {
              display: true,
              text: 'Índice espectral (0 a 1)'
            }
          }
        }
      }
    });
  }

  /**
   * Renderiza el Inspector de Cultivos Vetados (Semáforo Rojo)
   */
  function renderizarCultivosVetados(resultado) {
    const cont = document.getElementById('vetados-grid-container');
    const countBadge = document.getElementById('vetados-count-badge');
    if (!cont) return;

    const vetados = resultado.cultivosVetados || [];
    if (countBadge) {
      countBadge.textContent = `${vetados.length} cultivos descartados por protección de suelo/clima`;
    }

    // Ordenar mostrando primero los vetados por causa fitosanitaria (ej. Papa en Chimborazo)
    const ordenados = vetados.slice().sort((a, b) => {
      if (a.tipoVeto === b.tipoVeto) return 0;
      return a.tipoVeto === 'fitosanitario' ? -1 : 1;
    });

    cont.innerHTML = ordenados.map(item => {
      const c = item.cultivo;
      const etiquetaTipo = item.tipoVeto === 'fitosanitario'
        ? '<span class="rot-strategy-badge rojo">🦠 Pausa Fitosanitaria</span>'
        : '<span class="rot-strategy-badge amarillo">⛰️ Límite Biofísico (Clima/Ladera)</span>';

      return `
        <div class="vetado-item">
          <div class="vetado-head">
            <span>${c.icono || '🌱'} ${c.nombre} <small style="color:var(--text-muted);">(${c.familia})</small></span>
            ${etiquetaTipo}
          </div>
          <p class="vetado-reason">${item.razones.join(' ')}</p>
        </div>
      `;
    }).join('');
  }

  /**
   * Ejecuta el motor agronómico completo y actualiza toda la interfaz
   */
  function actualizarTodo() {
    const parcela = obtenerParcelaActual();
    if (!parcela || !state.catalogo) return;

    const resultado = window.AgronomiaMotor.recomendar(
      parcela,
      state.catalogo,
      state.sliders,
      state.opciones
    );
    state.ultimoResultado = resultado;

    // Actualizar etiquetas de pesos junto a cada slider
    const p = resultado.pesosAplicados;
    document.getElementById('badge-peso-agua').textContent = `${Math.round(p.w_h2o * 100)}% del índice`;
    document.getElementById('badge-peso-suelo').textContent = `${Math.round((p.w_n + p.w_mos) * 100)}% del índice`;
    document.getElementById('badge-peso-ganar').textContent = `${Math.round(p.w_rent * 100)}% del índice`;

    renderizarBannerAnomalia(parcela, p);
    renderizarPaso1Terreno(parcela);
    renderizarTarjetasRotacion(resultado, parcela);
    actualizarGraficoBalance36m();
    actualizarGraficoHLS(parcela);
    renderizarCultivosVetados(resultado);
  }

  /**
   * Configura todos los eventos de botones, sliders, inputs y modal científico
   */
  function configurarEventos() {
    // Botones selectores de parcela demostrativa
    document.querySelectorAll('[data-parcela-id]').forEach(btn => {
      btn.addEventListener('click', function () {
        const nuevoId = this.getAttribute('data-parcela-id');
        if (!state.parcelasActivas[nuevoId]) return;
        state.parcelaActualId = nuevoId;
        state.rotacionSeleccionadaGraficoId = 'recomendada_1';

        document.querySelectorAll('[data-parcela-id]').forEach(b => b.classList.remove('active'));
        this.classList.add('active');

        sincronizarControlesPaso2ConParcela();
        dibujarPoligonoParcelaActual(true);
        actualizarTodo();
      });
    });

    // Edición de Suelo (SoilGrids editable)
    const onSoilChange = () => {
      const p = obtenerParcelaActual();
      p.suelo.textura = document.getElementById('input-suelo-textura').value;
      p.suelo.soc_pct = Number(document.getElementById('input-suelo-soc').value) || 1.5;
      p.suelo.ph = Number(document.getElementById('input-suelo-ph').value) || 6.0;
      p.suelo.editado_por_usuario = true;
      sincronizarControlesPaso2ConParcela();
      actualizarTodo();
    };

    ['input-suelo-textura', 'input-suelo-soc', 'input-suelo-ph'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', onSoilChange);
    });

    // Botón para restaurar datos satelitales originales de la parcela
    const btnResetSuelo = document.getElementById('btn-reset-parcela');
    if (btnResetSuelo) {
      btnResetSuelo.addEventListener('click', () => {
        const id = state.parcelaActualId;
        state.parcelasActivas[id] = clonar(state.parcelasOriginales[id]);
        sincronizarControlesPaso2ConParcela();
        dibujarPoligonoParcelaActual(true);
        actualizarTodo();
      });
    }

    // Edición de historia de cultivos (2024 y 2025) y nematodos
    const onHistoriaChange = () => {
      const p = obtenerParcelaActual();
      const h1 = document.getElementById('select-historia-1').value;
      const h2 = document.getElementById('select-historia-2').value;
      p.historia_declarada = [h1, h2];
      p.nematodo_declarado = document.getElementById('check-nematodo').checked;
      actualizarTodo();
    };

    ['select-historia-1', 'select-historia-2', 'check-nematodo'].forEach(id => {
      const el = document.getElementById(id);
      if (el) el.addEventListener('change', onHistoriaChange);
    });

    // Sliders de prioridades del agricultor
    const bindSlider = (id, key) => {
      const el = document.getElementById(id);
      if (!el) return;
      el.addEventListener('input', function () {
        state.sliders[key] = Number(this.value);
        actualizarTodo();
      });
    };
    bindSlider('slider-agua', 'agua');
    bindSlider('slider-suelo', 'suelo');
    bindSlider('slider-ganar', 'ganar');

    // Slider de Escenario Climático de Lluvias (-30% a +20%)
    const sliderEsc = document.getElementById('slider-escenario-lluvia');
    const badgeEsc = document.getElementById('badge-escenario-lluvia');
    if (sliderEsc) {
      sliderEsc.addEventListener('input', function () {
        const val = Number(this.value);
        state.opciones.escenarioLluviaPct = val;
        if (badgeEsc) {
          badgeEsc.textContent = val === 0
            ? '0% (Clima Histórico Normal)'
            : `${val > 0 ? '+' : ''}${val}% de lluvia`;
        }
        actualizarTodo();
      });
    }

    // Checkbox de uso de rastrojo como forraje para animales
    const chkForraje = document.getElementById('check-retira-forraje');
    if (chkForraje) {
      chkForraje.addEventListener('change', function () {
        state.opciones.retiraForraje = this.checked;
        state.opciones.priorizarForraje = this.checked;
        actualizarTodo();
      });
    }

    // Modal Científico ("Ver cómo lo calculamos")
    const modal = document.getElementById('modal-cientifico');
    const btnOpenModal = document.getElementById('btn-abrir-modal-cientifico');
    const btnCloseModal = document.getElementById('btn-cerrar-modal-cientifico');

    if (btnOpenModal && modal) {
      btnOpenModal.addEventListener('click', () => {
        modal.removeAttribute('hidden');
      });
    }
    if (btnCloseModal && modal) {
      btnCloseModal.addEventListener('click', () => {
        modal.setAttribute('hidden', 'hidden');
      });
    }
    if (modal) {
      modal.addEventListener('click', (e) => {
        if (e.target === modal) {
          modal.setAttribute('hidden', 'hidden');
        }
      });
    }
  }

  document.addEventListener('DOMContentLoaded', function () {
    cargarDatosIniciales()
      .then(() => {
        sincronizarControlesPaso2ConParcela();
        inicializarMapa();
        configurarEventos();
        actualizarTodo();
      })
      .catch(err => {
        console.error('Error inicializando la aplicación:', err);
      });
  });
})();

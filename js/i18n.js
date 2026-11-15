/**
 * i18n.js — Soporte bilingüe completo (Español / English) para RotaSat.
 * Traduce tanto la interfaz estática (index.html) como los bloques generados dinámicamente
 * (tarjetas de rotación, advertencias, cultivos vetados, medidores, pronóstico y calendario),
 * preservando iconos SVG/Lucide, controles e interactividad al alternar ES <-> EN.
 */
(function (root) {
  'use strict';

  let currentLang = 'es';
  const origCache = new WeakMap();
  const attrCache = new WeakMap();
  let observer = null;

  function cacheOrigHtml(el) {
    if (!origCache.has(el)) {
      origCache.set(el, { html: el.innerHTML, text: el.textContent });
    }
  }

  function cacheAttr(el, attr) {
    let m = attrCache.get(el);
    if (!m) { m = {}; attrCache.set(el, m); }
    if (!(attr in m)) m[attr] = el.getAttribute(attr);
  }

  function setHtml(selector, enHtml) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    cacheOrigHtml(el);
    if (currentLang === 'en') {
      el.innerHTML = enHtml;
    } else {
      el.innerHTML = origCache.get(el).html;
    }
  }

  function setText(selector, enText) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    cacheOrigHtml(el);
    if (currentLang === 'en') {
      el.textContent = enText;
    } else {
      el.innerHTML = origCache.get(el).html;
    }
  }

  function setTextPreservingIcons(selector, enText, prependSpace) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    cacheOrigHtml(el);
    if (currentLang === 'es') {
      el.innerHTML = origCache.get(el).html;
      return;
    }
    const iconos = Array.from(el.children).filter(ch =>
      ch.tagName === 'SVG' || ch.tagName === 'svg' || ch.hasAttribute('data-lucide') || ch.classList.contains('icono')
    );
    if (!iconos.length) {
      el.textContent = enText;
      return;
    }
    el.innerHTML = '';
    iconos.forEach(ic => el.appendChild(ic));
    el.appendChild(document.createTextNode((prependSpace !== false ? ' ' : '') + enText));
  }

  function setAttr(selector, attr, enVal) {
    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;
    cacheAttr(el, attr);
    if (currentLang === 'en') {
      el.setAttribute(attr, enVal);
    } else {
      const orig = attrCache.get(el)[attr];
      if (orig === null) el.removeAttribute(attr);
      else el.setAttribute(attr, orig);
    }
  }

  function aplicarEstatico() {
    document.documentElement.lang = currentLang;
    if (currentLang === 'en') {
      document.title = 'RotaSat — Agricultural Decision Support System | NASA Space Apps 2026';
    } else {
      document.title = 'RotaSat — Sistema de apoyo a la decisión agrícola | NASA Space Apps 2026';
    }

    const btnLang = document.getElementById('btn-lang-switch');
    if (btnLang) {
      btnLang.setAttribute('aria-pressed', currentLang === 'en' ? 'true' : 'false');
      btnLang.innerHTML = currentLang === 'en' ? 'ES / <strong>EN</strong>' : '<strong>ES</strong> / EN';
    }

    // Sidebar y cabecera superior
    setText('.sidebar-logo-lema', 'Crop rotation powered by NASA Earth data');
    setText('.sidebar-section-label', 'Control modules');
    setText('[data-tab-target="tab-simulador"] .sidebar-item-left span', 'Home');
    setText('[data-tab-target="tab-terreno"] .sidebar-item-left span', 'My plot');
    setText('[data-tab-target="tab-riesgos"] .sidebar-item-left span', 'Risks & actions');
    setText('[data-tab-target="tab-rotaciones"] .sidebar-item-left span', 'My planting plan');
    setText('[data-tab-target="tab-informe"] .sidebar-item-left span', 'My PDF report');
    setText('[data-tab-target="tab-satelites"] .sidebar-item-left span', 'NASA data');
    setText('.sidebar-memory-title span', 'Plot in memory');

    setText('.banda-top-inner > span', 'NASA International Space Apps Challenge 2026 Project · Riobamba');
    const esTec = document.body.classList.contains('modo-tecnico');
    setText('#btn-modo-usuario-texto', esTec ? 'View: Technical · Return to Farmer' : 'View: Farmer · Technical mode');
    setText('#btn-letra-grande span:last-child', 'Larger text');
    setAttr('#btn-letra-grande', 'title', 'Increase text size');

    setHtml('#confirm-modo-tecnico .mode-confirm-text span',
      '<strong>Enable Technical Mode?</strong> This view shows lab soil parameters, NASA satellite sensors, and mathematical calibration. Your farmer inputs will not be lost.');
    setText('#btn-cancelar-tecnico', 'Stay in Farmer View');
    setText('#btn-confirmar-tecnico', 'Enter Technical Mode');
    setHtml('#banner-modo-tecnico .mode-confirm-text span',
      '<strong>Technical Mode active</strong> — Editing laboratory &amp; calibration data. Farmer-declared baseline remains protected.');
    setText('#btn-salir-tecnico', 'Return to Farmer View');

    // Hero (Inicio)
    setText('#tab-simulador .hero .mono', 'Agricultural decision support system');
    setText('#tab-simulador .hero h1', 'Climate-resilient crop rotation for Andean & coastal farming');
    setText('#tab-simulador .hero .lead',
      'RotaSat turns NASA Earth observation data into a clear 3-year planting plan that any farmer can act on: what to plant, in which month, what risks the plot faces, and how to prevent them.');

    const heroVals = document.querySelectorAll('#tab-simulador .hero-valores li');
    const heroValsEn = [
      ['9 satellite sources', 'NASA POWER, SRTM, HLS, MODIS, SMAP, IMERG…'],
      ['Any plot in Ecuador', 'Draw your field boundaries on the map'],
      ['Actions, not just numbers', 'Frost, drought, erosion, soil acidity'],
      ['PDF & WhatsApp plan', 'With voice readout and large text']
    ];
    heroVals.forEach((li, idx) => {
      if (!heroValsEn[idx]) return;
      setText(li.querySelector('strong'), heroValsEn[idx][0]);
      setText(li.querySelector('small'), heroValsEn[idx][1]);
    });

    setText('#tab-simulador [data-tab-go="tab-terreno"].btn', 'Evaluate my plot');
    setText('#tab-simulador [data-tab-go="tab-satelites:nasa-metodo"]', 'See how we calculate it');

    setText('#anomaly-title', 'Active satellite monitoring');
    const anomRows = document.querySelectorAll('#anomaly-card .fila > span:first-child');
    const anomRowsEn = ['Hydrological sensors', 'Water weight in IRR', 'Topographic & optical resolution'];
    anomRows.forEach((sp, i) => { if (anomRowsEn[i]) setText(sp, anomRowsEn[i]); });

    const pasosCards = document.querySelectorAll('#tab-simulador .pasos .paso');
    const pasosEn = [
      ['Step 1', 'My plot', 'Locate or draw your field on the map and tell us about your soil and past harvests.'],
      ['Step 2', 'Risks & actions', 'Inspect plot warnings (frost, drought, erosion, acidity) and concrete preventive actions.'],
      ['Step 3', 'My planting plan', 'Adjust your priorities and compare the top 3 rotations with optimal planting months.'],
      ['Step 4', 'My PDF report', 'Download a clear one-page summary for the farmer plus full technical telemetry for the agronomist.']
    ];
    pasosCards.forEach((card, idx) => {
      if (!pasosEn[idx]) return;
      setText(card.querySelector('.paso-meta .mono'), pasosEn[idx][0]);
      setText(card.querySelector('h3'), pasosEn[idx][1]);
      setText(card.querySelector('p'), pasosEn[idx][2]);
    });

    // Módulo 1: Mi lote
    setTextPreservingIcons('#tab-terreno .step-header .mono', 'Step 1');
    setText('#tab-terreno .step-header h2', 'My plot');
    setText('#tab-terreno .step-header p',
      'Locate your field on the map and tell us what your soil is like. NASA satellites measure elevation, slope, and climate; you add local field knowledge.');
    setTextPreservingIcons('#st-lote-mapa', 'Map & diagnosis');
    setTextPreservingIcons('#st-lote-tierra', 'My soil & past crops');

    setText('.location-search-title', 'Search place or coordinates');
    setText('#btn-mi-ubicacion span', 'My location');
    setAttr('#input-buscar-ubicacion', 'placeholder', 'E.g., San Andrés, Guano or -1.8014, -78.6119');
    setText('#btn-buscar-ubicacion', 'Search');
    const provOpt = document.querySelector('#select-provincia option[value=""]');
    if (provOpt) setText(provOpt, 'Province');
    const canOpt = document.querySelector('#select-canton option[value=""]');
    if (canOpt) setText(canOpt, 'Canton');
    const parOpt = document.querySelector('#select-parroquia option[value=""]');
    if (parOpt) setText(parOpt, 'Parish');

    setText('#btn-guided-draw span', 'Draw polygon');
    setText('#btn-draw-rectangle span', 'Draw rectangle');
    setText('#btn-edit-layers-text', 'Edit boundaries');
    setText('#btn-gps-50m span', 'My GPS spot (50×50 m)');
    setText('#btn-add-sensor span', 'Ground sensor (LoRa)');
    setText('label[for="input-import-drone"] span', 'Import Drone (KML/GeoJSON)');
    setText('#btn-reset-parcela span', 'Reset plot');

    setText('#btn-finish-draw', 'Finish plot');
    setText('#btn-undo-draw', 'Undo last corner');
    setText('#btn-save-edit', 'Save changes');
    setText('#btn-cancel-guided', 'Cancel');
    setText('#guided-draw-tooltip', 'Click corners of your field · Double-click to close');

    setText('#btn-remove-sensor', 'Remove sensor');
    setText('label[for="sensor-lluvia-mm"]', 'Local rain gauge (mm/yr)');
    setText('label[for="sensor-soc-pct"]', 'Carbon / SOM probe (%)');
    setText('label[for="sensor-ph"]', 'Soil pH probe');

    setTextPreservingIcons('.card-medidores h3 span', 'Your plot at a glance');
    const fichaCard = document.querySelector('.terreno-telemetry .card-datos:nth-of-type(2)');
    if (fichaCard) {
      setTextPreservingIcons(fichaCard.querySelector('h3 > span:first-child'), 'Plot summary sheet');
      const filasFicha = fichaCard.querySelectorAll('.fila > span:first-child');
      const filasFichaEn = [
        'Plot area',
        'Elevation (thermal belt)',
        'Region & aspect',
        'Mean slope',
        'Runoff & max slope',
        'Annual rainfall',
        'Annual evapotranspiration (ET₀)',
        'Solar radiation · wind · humidity'
      ];
      filasFicha.forEach((sp, i) => { if (filasFichaEn[i]) setText(sp, filasFichaEn[i]); });
    }
    const climaCard = document.querySelector('.terreno-telemetry .card-datos.solo-tecnico h3 span');
    if (climaCard) setTextPreservingIcons(climaCard, 'Monthly plot climatology (NASA POWER)');

    // Subpanel tierra
    const panelTierra = document.querySelector('#sp-lote-tierra .panel-card');
    if (panelTierra) {
      const h3s = panelTierra.querySelectorAll('.panel-card-header h3');
      if (h3s[0]) setTextPreservingIcons(h3s[0], 'What is the soil like on your plot?');
      if (h3s[1]) setTextPreservingIcons(h3s[1], 'What did you plant in the last 2 years?');
      setText('#sp-lote-tierra .panel-card p.solo-agricultor',
        'This prevents repeating crops from the same botanical family so soilborne pests do not return.');
    }
    const soilCardsEn = [
      ['Sandy', 'Loose, water drains quickly'],
      ['Black / Loamy', 'Soft, dark, retains moisture'],
      ['Clayey', 'Heavy, waterlogs with rain']
    ];
    document.querySelectorAll('.soil-simple-btn').forEach((btn, i) => {
      if (!soilCardsEn[i]) return;
      setText(btn.querySelector('strong'), soilCardsEn[i][0]);
      setText(btn.querySelector('span'), soilCardsEn[i][1]);
    });
    setText('label[for="select-historia-1"]', '2 years ago (2024)');
    setText('label[for="select-historia-2"]', 'Last year (2025)');
    setText('label[for="check-nematodo"] span', 'Did you see root galls (nematodes), tuber moth, or severe late blight on this plot?');
    setText('label[for="check-tiene-riego"] span', 'Do you have irrigation (canal, reservoir, turn, or drip) on this plot?');
    setText('label[for="check-retira-forraje"] span', 'Do you remove stalks/straw after harvest for livestock feed?');

    setTextPreservingIcons('.tech-drawer h4', 'Technical lab / field adjustment (0–30 cm)');
    setText('#btn-limpiar-tecnico', 'Restore farmer + NASA baseline');
    setText('label[for="input-suelo-textura"]', 'Texture (lab)');
    setText('label[for="input-suelo-soc"]', 'Organic carbon (%)');
    setText('label[for="input-suelo-ph"]', 'Exact acidity (pH)');
    setText('label[for="input-tecnico-pendiente"]', 'Clinometer-verified slope (%)');
    setAttr('#input-tecnico-pendiente', 'placeholder', 'Uses SRTM if empty');
    setText('label[for="input-tecnico-notas"]', 'Technical field notes');
    setAttr('#input-tecnico-notas', 'placeholder', 'E.g., INIAP sample #42, drainage...');
    setTextPreservingIcons('#sp-lote-tierra #btn-exportar-parcela', 'Export combined JSON (Farmer + NASA + Tech)');

    const asideLote = document.querySelector('.lote-tierra-aside .vulnerability-card');
    if (asideLote) {
      setTextPreservingIcons(asideLote.querySelector('h3'), 'The satellite supports, the farmer decides');
      setText(asideLote.querySelector('p'),
        'NASA satellites observe regional climate (10–50 km), slope (30 m), and historical greenness (30 m), but never replace local field knowledge. In Step 2 and here you can refine soil data and priorities.');
    }
    setText('.lote-tierra-aside .btn-siguiente', 'Next: inspect risks & actions →');

    // Módulo 2: Riesgos
    setTextPreservingIcons('#tab-riesgos .step-header .mono', 'Step 2');
    setText('#tab-riesgos .step-header h2', 'Plot risks & what to do');
    setText('#tab-riesgos .step-header p', 'Tap each warning to see why it occurs and what concrete action prevents or mitigates it.');
    setTextPreservingIcons('#st-riesgos-avisos', 'Warnings');
    // Preservar cuenta-avisos dentro del subtab: mejor no borrar el span #cuenta-avisos
    const stRiesgosAvisos = document.getElementById('st-riesgos-avisos');
    if (stRiesgosAvisos) {
      const cnt = document.getElementById('cuenta-avisos');
      const ic = stRiesgosAvisos.querySelector('svg, [data-lucide]');
      cacheOrigHtml(stRiesgosAvisos);
      if (currentLang === 'en' && cnt) {
        stRiesgosAvisos.innerHTML = '';
        if (ic) stRiesgosAvisos.appendChild(ic);
        stRiesgosAvisos.appendChild(document.createTextNode(' Warnings '));
        stRiesgosAvisos.appendChild(cnt);
      } else if (currentLang === 'es') {
        stRiesgosAvisos.innerHTML = origCache.get(stRiesgosAvisos).html;
      }
    }
    const stRiesgosVet = document.getElementById('st-riesgos-vetados');
    if (stRiesgosVet) {
      const cnt = document.getElementById('cuenta-vetados');
      const ic = stRiesgosVet.querySelector('svg, [data-lucide]');
      cacheOrigHtml(stRiesgosVet);
      if (currentLang === 'en' && cnt) {
        stRiesgosVet.innerHTML = '';
        if (ic) stRiesgosVet.appendChild(ic);
        stRiesgosVet.appendChild(document.createTextNode(' Unsuitable crops '));
        stRiesgosVet.appendChild(cnt);
      } else if (currentLang === 'es') {
        stRiesgosVet.innerHTML = origCache.get(stRiesgosVet).html;
      }
    }
    setTextPreservingIcons('.riesgos-card .vuln-cabeza h3', 'Warnings for your plot');
    setTextPreservingIcons('#btn-escuchar-avisos', 'Listen');
    setTextPreservingIcons('.vetados-section .panel-card-header h3', 'Crops not recommended here, and why');
    setText('.vetados-section > p',
      'Transparent log of every crop excluded by the agronomic engine due to phytosanitary pauses, frost risk, altitude limits, or steep slope.');
    setText('#tab-riesgos .btn-siguiente', 'Next: see my planting plan →');

    // Módulo 3: Plan de siembra
    setTextPreservingIcons('#tab-rotaciones .step-header .mono', 'Step 3');
    setText('#tab-rotaciones .step-header h2', 'My 3-year planting plan');
    setText('#tab-rotaciones .step-header p', 'Move the sliders according to your priorities: recommendations re-rank in real time.');
    setTextPreservingIcons('.plan-prioridades .panel-card-header h3', 'What matters most to you?');
    setText('.plan-prioridades .ayuda-gesto', 'Drag each slider right if it matters more to your farm.');
    setText('.plan-prioridades .panel-card-header .mono', 'IRR Weighting');

    const prioItemsEn = [
      ['Save water', 'Withstand dry seasons'],
      ['Care for soil', 'Restore natural nitrogen & organic matter'],
      ['Earn more', 'Better sales at market or fair']
    ];
    document.querySelectorAll('.priority-simple-item').forEach((item, idx) => {
      if (!prioItemsEn[idx]) return;
      setText(item.querySelector('.priority-simple-label strong'), prioItemsEn[idx][0]);
      setText(item.querySelector('.priority-simple-label span'), prioItemsEn[idx][1]);
      const sc = item.querySelectorAll('.prio-slider-escala span');
      if (sc.length === 3) {
        setText(sc[0], 'Low');
        setText(sc[1], 'Normal');
        setText(sc[2], 'High');
      }
    });

    setTextPreservingIcons('label[for="slider-agua"]', 'Save water & resist drought');
    setTextPreservingIcons('label[for="slider-suelo"]', 'Regenerate soil (nitrogen & humus)');
    setTextPreservingIcons('label[for="slider-ganar"]', 'Economic income & market return');
    setTextPreservingIcons('label[for="slider-escenario-lluvia"]', 'Rainfall sensitivity scenario (hydrological stress)');
    setTextPreservingIcons('label[for="slider-escenario-temp"]', 'Warming scenario (+ΔT °C)');

    const scenarioBoxes = document.querySelectorAll('.sliders-list .scenario-box');
    if (scenarioBoxes[0]) {
      const s = scenarioBoxes[0].querySelectorAll('.slider-scale-labels span');
      if (s.length === 4) {
        setText(s[0], '-30 % drought');
        setText(s[1], '-15 % dry year');
        setText(s[2], '0 % POWER baseline');
        setText(s[3], '+20 % wet year');
      }
    }
    if (scenarioBoxes[1]) {
      const s = scenarioBoxes[1].querySelectorAll('.slider-scale-labels span');
      if (s.length === 4) {
        setText(s[0], '+0.0 °C baseline');
        setText(s[1], '+1.0 °C moderate');
        setText(s[2], '+2.0 °C stress');
        setText(s[3], '+3.0 °C severe');
      }
    }

    setTextPreservingIcons('#st-plan-opciones', 'Recommended options');
    setTextPreservingIcons('#st-plan-calendario', 'When to plant?');
    setTextPreservingIcons('#st-plan-graficos', 'NASA charts');

    setHtml('.rotasat-disclaimer-banner .disclaimer-text',
      '<strong>Important note:</strong> RotaSat is a satellite-data decision-support tool. Climate projections and crop suggestions must always be validated with the farmer’s local experience and local agronomist advice. It does not replace human judgment in the field.');

    setTextPreservingIcons('#calendario-siembra h3', 'When to plant? Best months for your plot');
    setText('#calendario-siembra .cal-ayuda', 'Each square is a planting month (J = Jan … D = Dec). Tap or hover any square to see why.');
    const legSpans = document.querySelectorAll('#calendario-siembra .cal-leyenda span');
    const legEn = ['Good month', 'Possible with care', 'Avoid'];
    legSpans.forEach((sp, i) => {
      if (!legEn[i]) return;
      cacheOrigHtml(sp);
      const box = sp.querySelector('i');
      if (currentLang === 'en' && box) {
        sp.innerHTML = '';
        sp.appendChild(box);
        sp.appendChild(document.createTextNode(' ' + legEn[i]));
      } else if (currentLang === 'es') {
        sp.innerHTML = origCache.get(sp).html;
      }
    });

    const chartCards = document.querySelectorAll('#charts-grid-rotaciones .chart-card');
    if (chartCards[0]) {
      setTextPreservingIcons(chartCards[0].querySelector('h3'), '36-month simulated water balance (NASA POWER + SRTM + FAO-56)');
      setText(chartCards[0].querySelector('p'), 'Comparison between effective rainfall entering the root zone (Pef) and crop evapotranspiration demand (ETc).');
    }
    if (chartCards[1]) {
      setTextPreservingIcons(chartCards[1].querySelector('h3'), 'Satellite plot history (HLS Landsat 8/9 + Sentinel-2, 30 m)');
      setText(chartCards[1].querySelector('p'), 'Olive line shows crop greenness (NDVI) and terracotta line shows surface residue (NDTI). Below the dashed line (0.25) soil was bare.');
    }
    setText('#tab-rotaciones .btn-siguiente', 'Next: download my PDF report →');

    // Módulo 4: Informe PDF
    setTextPreservingIcons('#tab-informe .step-header .mono', 'Step 4');
    setText('#tab-informe .step-header h2', 'My PDF report');
    setText('#tab-informe .step-header p', 'Check readiness and download your 3-year plan with NASA satellite data, ready to print or share with an agronomist.');
    setTextPreservingIcons('.informe-checklist h3', 'Is everything ready?');
    setTextPreservingIcons('.informe-descarga h3', 'Download my report');
    setText('label[for="informe-nombre"]', 'Farmer name (optional)');
    setAttr('#informe-nombre', 'placeholder', 'E.g., María Guamán');
    setText('.informe-opciones legend', 'Which plan do you want in the report?');
    setTextPreservingIcons('#btn-descargar-pdf', 'Download PDF');
    const infBullets = document.querySelectorAll('.informe-incluye li');
    const infBulletsEn = [
      'Plot profile: elevation, slope, soil properties, and monthly climate (NASA POWER, SRTM, ISRIC).',
      '3-year crop rotation plan with optimal planting months and estimated revenue.',
      'Actionable risk warnings, planting calendar, and option comparison.',
      'Full data provenance: provisional items are explicitly labeled, never fabricated.'
    ];
    infBullets.forEach((li, i) => { if (infBulletsEn[i]) setText(li, infBulletsEn[i]); });

    // Módulo 5: Datos NASA y Metodología
    setTextPreservingIcons('#tab-satelites .step-header .mono', 'Scientific transparency');
    setText('#tab-satelites .step-header h2', 'NASA data & methodology');
    setText('#tab-satelites .step-header p', 'Earth observation datasets powering RotaSat and the mathematical model behind every recommendation.');
    setTextPreservingIcons('#st-nasa-sat', 'Satellites & sensors');
    setTextPreservingIcons('#st-nasa-metodo', 'Methodology & formulas');

    setText('#sp-nasa-metodo details summary span', 'See how we calculate it — NASA satellite harmonization & IRR mathematical model');
    setText('#sp-nasa-metodo .explain-details-body > p',
      'RotaSat harmonizes 6 NASA and ISRIC Earth observation sources across spatial and temporal scales down to field boundaries and monthly steps over 36 months.');
    setTextPreservingIcons('.harmonization-box h3', 'Spatial Resolution Harmonization');
    setHtml('.harmonization-box p',
      'To translate heterogeneous orbital observations into actionable agronomic decisions within the exact boundaries of a local farm polygon (e.g., a <strong>20,000 m²</strong> Andean plot), <strong>RotaSat</strong> applies a two-stage <em>topographic &amp; edaphic downscaling</em> and zonal interpolation pipeline. Coarse hydrometeorological variables —such as <strong>SMAP L4 (9 km)</strong> root-zone soil moisture, <strong>GPM IMERG (10 km)</strong> precipitation, and <strong>NASA POWER / MERRA-2 (~50 km)</strong> radiation and temperature— act as mesoscale atmospheric forcings projected onto the <strong>30 m</strong> grid of <strong>NASADEM / SRTM (30 m)</strong> and <strong>HLS Landsat 8/9 + Sentinel-2 (30 m)</strong>. Using adiabatic lapse-rate temperature correction (<code>&Gamma; = &minus;6.5 °C/km</code>), slope-modulated runoff partitioning, and soil water-retention integration from <strong>ISRIC SoilGrids (250 m)</strong>, the engine clips and weights every pixel inside the <strong>20,000 m²</strong> polygon so the FAO-56 water balance and <strong>IRR</strong> score reflect actual farm microconditions rather than an unadjusted regional average.');

    const pills = document.querySelectorAll('.harmonization-scale-pills .scale-pill');
    if (pills.length === 3) {
      setText(pills[0], 'Macroscale: NASA POWER (~50 km) · GPM (10 km) · SMAP (9 km)');
      setText(pills[1], 'Mesoscale: ISRIC SoilGrids (250 m)');
      setText(pills[2], 'Farm Scale (20,000 m²): SRTM (30 m) · HLS Landsat/Sentinel (30 m)');
    }

    const metH3 = document.querySelectorAll('#sp-nasa-metodo .explain-details-body > h3');
    if (metH3[0]) setText(metH3[0], '1. Multi-resolution harmonization of NASA & soil sensors');
    if (metH3[1]) setText(metH3[1], '2. Agronomic engine & IRR index formulation');

    const ths = document.querySelectorAll('#sp-nasa-metodo table thead th');
    const thsEn = ['Source / Mission', 'Extracted Variables', 'Native Resolution', 'Plot-level Harmonization'];
    ths.forEach((th, i) => { if (thsEn[i]) setText(th, thsEn[i]); });

    // Footer
    const footerP = document.querySelectorAll('footer .contenedor div:first-child p');
    if (footerP[0]) setHtml(footerP[0], '<strong>Team RotaSat</strong> · NASA International Space Apps Challenge 2026 · Riobamba, Ecuador');
    if (footerP[1]) setText(footerP[1], 'Data: NASA POWER, NASA GIBS (MODIS, SMAP, GPM IMERG, VIIRS), NASADEM/SRTM, HLS (Landsat 8/9 + Sentinel-2), ISRIC SoilGrids, MAG-SIPA & INIAP. Basemaps: OpenStreetMap, OpenTopoMap & Sentinel-2 cloudless (EOX). 7-day forecast: Open-Meteo (CC BY 4.0).');
    setText('footer a', 'GitHub Repository');
  }

  // Diccionario ordenado de frases frecuentes en bloques generados dinámicamente
  const DICT_DINAMICO = [
    // Títulos y estados generales
    ['Estrategia 1 — Máxima resiliencia integral (recomendada)', 'Option 1 — Maximum overall resilience (recommended)'],
    ['Estrategia 2 — Alternativa de suelo, grano y mercado', 'Option 2 — Soil, grain & market alternative'],
    ['Estrategia 3 — Diversificación y cobertura protectora', 'Option 3 — Diversification & protective ground cover'],
    ['Práctica actual (continuar secuencia habitual del lote)', 'Current practice (continue usual field sequence)'],
    ['Su práctica actual (sin rotación)', 'Your current practice (no rotation)'],
    ['Opción 1 — Máxima resiliencia integral (recomendada)', 'Option 1 — Maximum overall resilience (recommended)'],
    ['Opción 2 — Alternativa de suelo, grano y mercado', 'Option 2 — Soil, grain & market alternative'],
    ['Opción 3 — Diversificación y cobertura protectora', 'Option 3 — Diversification & protective ground cover'],
    ['Bajo · Rotación resiliente', 'Low risk · Resilient rotation'],
    ['Medio · Viable con precaución', 'Medium · Viable with caution'],
    ['Alto · Riesgo fitosanitario o hídrico', 'High · Phytosanitary or water risk'],
    ['Muy buena opción', 'Very strong option'],
    ['Opción regular', 'Moderate option'],
    ['Opción débil', 'Weak option'],
    ['Qué tan buena es para su lote', 'How well it fits your plot'],
    ['Su práctica actual', 'Your current practice'],
    ['Año 1 (2026–2027)', 'Year 1 (2026–2027)'],
    ['Año 2 (2027–2028)', 'Year 2 (2027–2028)'],
    ['Año 3 (2028–2029)', 'Year 3 (2028–2029)'],
    ['Año 1', 'Year 1'],
    ['Año 2', 'Year 2'],
    ['Año 3', 'Year 3'],
    ['¿Por qué sugerimos esta rotación?', 'Why do we suggest this rotation?'],
    ['Recomendaciones prácticas en campo:', 'Practical field recommendations:'],
    ['Ingreso bruto anual (SIPA-MAG) en', 'Annual gross revenue (SIPA-MAG) on'],
    ['Ganancia neta estimada (descontando costos):', 'Estimated net profit (after costs):'],
    ['Fusión de datos: Proyección calculada integrando viabilidad climática satelital (NASA) y datos históricos de rendimiento y precio a nivel productor del SIPA (MAG-Ecuador). Sujeto a volatilidad del mercado.', 'Data fusion: Projection built by combining NASA satellite climate viability with historical farm-gate yield and price records from SIPA (MAG-Ecuador). Subject to market volatility.'],
    ['¿Qué puede hacer?', 'What can you do?'],
    ['Ver datos técnicos', 'Show technical details'],
    ['Ocultar datos técnicos', 'Hide technical details'],
    ['Enviar por WhatsApp', 'Share on WhatsApp'],
    ['Escuchar', 'Listen'],
    ['Agua cubierta por lluvia', 'Water covered by rainfall'],
    ['Balance de nitrógeno', 'Nitrogen balance'],
    ['Materia orgánica y suelo', 'Organic matter & soil'],
    ['Margen bruto estimado', 'Estimated gross margin'],
    ['Mostrando en el gráfico hídrico de 36 meses', 'Shown in 36-month water chart'],
    ['Ver balance hídrico de 36 meses', 'View 36-month water balance'],
    ['1. Por qué se sugiere:', '1. Why it is suggested:'],
    ['2. Evidencia satelital NASA y de suelo', '2. NASA satellite & soil evidence'],
    ['3. Beneficios cuantificados', '3. Quantified benefits'],
    ['4. Lagunas de información', '4. Information gaps'],
    ['5. Riesgos que requieren validación local', '5. Risks requiring local validation'],
    ['Agua:', 'Water:'],
    ['Suelo:', 'Soil:'],
    ['Agua', 'Water'],
    ['Tierra', 'Soil'],
    ['Ganancia', 'Profit'],
    ['Cubierto casi en su totalidad por lluvia', 'Almost entirely covered by rainfall'],
    ['Buena parte cubierta por lluvia; poco riego de apoyo', 'Mostly covered by rainfall; minimal supplemental irrigation needed'],
    ['Necesita riego de apoyo en meses secos', 'Requires supplemental irrigation during dry months'],
    ['Abono natural por leguminosas', 'Natural nitrogen enrichment from legumes'],
    ['Sin aporte de abono natural (desgasta el suelo)', 'No natural nitrogen fixation (depletes soil)'],
    // Medidores
    ['Inclinación del terreno', 'Field slope'],
    ['Altura del lote', 'Plot elevation'],
    ['Agua que guarda su tierra', 'Soil water-holding capacity'],
    ['Humedad en las raíces (satélite SMAP)', 'Root-zone moisture (SMAP satellite)'],
    ['Materia orgánica (carbono)', 'Organic matter (carbon)'],
    ['Plano o casi plano: fácil de trabajar', 'Flat or gentle slope: easy to farm'],
    ['Ladera: siembre en curvas de nivel', 'Hillside: plant along contour lines'],
    ['Muy empinado: la lluvia se lleva la tierra', 'Very steep: rain washes topsoil away'],
    ['Sierra fría: papa, haba, cebada, quinua', 'Cool highlands: potato, faba bean, barley, quinoa'],
    ['Valle templado', 'Temperate valley'],
    ['Humedad adecuada', 'Adequate soil moisture'],
    ['climátología normal', 'normal climatology'],
    ['climatología normal', 'normal climatology'],
    ['de lluvia', 'rainfall'],
    ['(estrés térmico)', '(thermal stress)'],
    ['(clima base)', '(baseline climate)'],
    ['% del índice', '% of index'],
    ['USD/año', 'USD/yr'],
    ['/ha/año', '/ha/yr'],
    ['Siembre en ', 'Plant in '],
    ['enero', 'January'],
    ['febrero', 'February'],
    ['marzo', 'March'],
    ['abril', 'April'],
    ['mayo', 'May'],
    ['junio', 'June'],
    ['julio', 'July'],
    ['agosto', 'August'],
    ['septiembre', 'September'],
    ['octubre', 'October'],
    ['noviembre', 'November'],
    ['diciembre', 'December'],
    ['Evaluadas ', 'Evaluated '],
    [' secuencias válidas de 3 años', ' valid 3-year sequences'],
    [' cultivos aptos en este piso térmico', ' suitable crops in this thermal belt'],
    [' descartados)', ' excluded)'],
    ['Pesos IRR:', 'IRR Weights:'],
    ['Nitrógeno ', 'Nitrogen '],
    ['Materia orgánica ', 'Organic matter '],
    ['Rentabilidad ', 'Profitability ']
  ];

  function traducirTexto(txt) {
    let out = txt;
    for (let i = 0; i < DICT_DINAMICO.length; i++) {
      const [es, en] = DICT_DINAMICO[i];
      if (out.includes(es)) {
        out = out.split(es).join(en);
      }
    }
    return out;
  }

  function traducirSubarbol(rootEl) {
    if (!rootEl || currentLang !== 'en') return;
    const walker = document.createTreeWalker(rootEl, NodeFilter.SHOW_TEXT, null);
    let node;
    while ((node = walker.nextNode())) {
      const v = node.nodeValue;
      if (!v || !v.trim()) continue;
      const trad = traducirTexto(v);
      if (trad !== v) {
        node.nodeValue = trad;
      }
    }
  }

  const CONTENEDORES_DINAMICOS = [
    '#anomaly-card',
    '#pronostico-card',
    '#resumen-riesgos',
    '#medidores-lote',
    '#tabla-clima-tecnica',
    '#vuln-badges-container',
    '#vetados-grid-container',
    '#vetados-count-badge',
    '#engine-meta-bar',
    '#rotations-cards-grid',
    '#calendario-filas',
    '#cal-detalle',
    '#informe-lista',
    '#informe-opciones-lista',
    '#informe-progreso',
    '#badge-peso-agua',
    '#badge-peso-suelo',
    '#badge-peso-ganar',
    '#badge-escenario-lluvia',
    '#badge-escenario-temp',
    '#parcela-activa',
    '#tech-farmer-summary'
  ];

  function aplicarDinamico() {
    if (currentLang !== 'en') return;
    CONTENEDORES_DINAMICOS.forEach(sel => {
      const el = document.querySelector(sel);
      if (el) traducirSubarbol(el);
    });
  }

  function activarObserver() {
    if (observer || typeof MutationObserver === 'undefined') return;
    const grid = document.getElementById('rotations-cards-grid');
    if (!grid) return;
    observer = new MutationObserver(() => {
      if (currentLang === 'en') traducirSubarbol(grid);
    });
    observer.observe(grid, { childList: true, subtree: true, characterData: true });
  }

  function setLang(lang, onVolverEs) {
    currentLang = lang === 'en' ? 'en' : 'es';
    aplicarEstatico();
    if (currentLang === 'en') {
      aplicarDinamico();
      activarObserver();
    } else if (typeof onVolverEs === 'function') {
      onVolverEs();
      aplicarEstatico();
    }
    return currentLang;
  }

  function getLang() {
    return currentLang;
  }

  root.RotaSatI18n = {
    setLang,
    getLang,
    aplicarEstatico,
    aplicarDinamico
  };
})(typeof window !== 'undefined' ? window : globalThis);

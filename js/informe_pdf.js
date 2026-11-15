/**
 * informe_pdf.js — Informe PDF del lote con los datos exactos que usa RotaSat.
 *
 * Regla: el PDF no redondea a ojo ni rellena huecos. Cada número sale tal cual de
 * NASA POWER, SRTM/NASADEM, HLS e ISRIC SoilGrids (o de lo que declaró el agricultor),
 * y cada bloque indica su fuente y si es dato real, de ejemplo o falta.
 *
 * Usa jsPDF + jspdf-autotable incluidos en js/vendor/ (funciona sin internet).
 */
(function () {
  'use strict';

  const OLIVA = [62, 74, 30];
  const TIERRA = [166, 81, 43];
  const PAPEL = [247, 243, 232];
  const BANDA = [228, 221, 203];
  const TINTA = [43, 42, 34];
  const GRIS = [107, 100, 80];
  const VERDE_OK = [157, 184, 115];
  const AMARILLO = [233, 199, 126];
  const ROJO = [217, 154, 136];
  const MESES = ['Ene', 'Feb', 'Mar', 'Abr', 'May', 'Jun', 'Jul', 'Ago', 'Sep', 'Oct', 'Nov', 'Dic'];

  // Las fuentes estándar del PDF usan WinAnsi: se traducen los símbolos que no existen ahí
  // y se quitan los emojis (el contenido no cambia).
  const MAPA = { '₀': '0', '₁': '1', '₂': '2', '→': '->', '≈': '~', '−': '-', '≥': '>=', '≤': '<=', '×': 'x', '·': '·', ' ': ' ' };
  function t(x) {
    return String(x == null ? '' : x)
      .replace(/[₀₁₂→≈−≥≤× ]/g, c => MAPA[c])
      .replace(/[^\u0000-ÿ–—‘’“”•…]/gu, '')
      .replace(/\s{2,}/g, ' ')
      .trim();
  }

  function esEjemplo(txt) { return typeof txt === 'string' && /^EJEMPLO/i.test(txt); }
  function esSinDato(txt) { return !txt || /^sin dato/i.test(txt); }
  function estadoTexto(txt) {
    if (esSinDato(txt)) return 'FALTA DATO';
    if (esEjemplo(txt)) return 'EJEMPLO (no es dato real)';
    return 'Dato real';
  }
  // Fuente + estado sin repetir: si el dato es real, la fuente; si no, el estado y el producto que lo reemplazará.
  function fuenteDe(txt, producto) {
    if (esSinDato(txt)) return `FALTA DATO — se obtendrá de ${producto}`;
    if (esEjemplo(txt)) return `EJEMPLO, no es dato real — se reemplaza con ${producto}`;
    return txt;
  }
  const num = (v, d) => (v === null || v === undefined || Number.isNaN(Number(v))) ? '—' : Number(v).toFixed(d);
  const miles = v => Number(v).toLocaleString('es-EC');

  async function cargarLogo() {
    try {
      const r = await fetch('img/rotasat-icono.png');
      if (!r.ok) return null;
      const blob = await r.blob();
      return await new Promise(res => {
        const fr = new FileReader();
        fr.onload = () => res(fr.result);
        fr.onerror = () => res(null);
        fr.readAsDataURL(blob);
      });
    } catch (e) { return null; }
  }

  /**
   * datos = { parcela, resultado, rotElegidaId, opciones, sliders, avisos, catalogo, nombreAgricultor }
   * Devuelve el documento jsPDF (para guardar o inspeccionar).
   */
  async function construir(datos) {
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: 'mm', format: 'a4' });
    const AY = window.AyudaAgricultor;
    const p = datos.parcela;
    const res = datos.resultado;
    const est = p.estado_datos || {};
    const opciones = datos.opciones || {};
    const rot = [...res.recomendadas, res.actual].find(r => r.id === datos.rotElegidaId) || res.recomendadas[0];
    const area = p.area_ha || 1;
    const W = doc.internal.pageSize.getWidth();
    const M = 14;
    const ancho = W - 2 * M;
    const logo = await cargarLogo();
    const fecha = new Date();
    const fechaTxt = fecha.toLocaleDateString('es-EC', { year: 'numeric', month: 'long', day: 'numeric' });

    let y = 0;
    const nuevaSiNoCabe = alto => {
      if (y + alto > doc.internal.pageSize.getHeight() - 18) { doc.addPage(); y = 18; }
    };
    const titulo = (txt, color) => {
      nuevaSiNoCabe(14);
      doc.setFillColor(...(color || OLIVA));
      doc.rect(M, y, 3, 7, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(13); doc.setTextColor(...(color || OLIVA));
      doc.text(t(txt), M + 6, y + 5.5);
      y += 11;
    };
    const parrafo = (txt, opt) => {
      doc.setFont('helvetica', (opt && opt.bold) ? 'bold' : 'normal');
      doc.setFontSize((opt && opt.size) || 9.5);
      doc.setTextColor(...((opt && opt.color) || TINTA));
      const lineas = doc.splitTextToSize(t(txt), (opt && opt.ancho) || ancho - ((opt && opt.indent) || 0));
      nuevaSiNoCabe(lineas.length * 4.6);
      doc.text(lineas, M + ((opt && opt.indent) || 0), y);
      y += lineas.length * 4.6 + ((opt && opt.despues) || 1.5);
    };
    const tabla = (cfg) => {
      doc.autoTable(Object.assign({
        startY: y,
        margin: { left: M, right: M },
        styles: { font: 'helvetica', fontSize: 8.5, cellPadding: 1.8, textColor: TINTA, lineColor: BANDA, lineWidth: 0.2 },
        headStyles: { fillColor: OLIVA, textColor: 255, fontStyle: 'bold' },
        alternateRowStyles: { fillColor: [251, 248, 240] },
        theme: 'grid'
      }, cfg, {
        head: cfg.head ? cfg.head.map(r => r.map(t)) : undefined,
        body: cfg.body.map(r => r.map(c => (c && typeof c === 'object') ? Object.assign({}, c, { content: t(c.content) }) : t(c)))
      }));
      y = doc.lastAutoTable.finalY + 6;
    };

    // ---------------- Encabezado ----------------
    doc.setFillColor(...OLIVA);
    doc.rect(0, 0, W, 30, 'F');
    if (logo) {
      doc.setFillColor(...PAPEL);
      doc.circle(M + 11, 15, 11.5, 'F');
      doc.addImage(logo, 'PNG', M + 1.5, 5.5, 19, 19);
    }
    doc.setTextColor(255, 255, 255);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(18);
    doc.text('RotaSat', M + 27, 13);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10);
    doc.text(t('Informe de rotación de cultivos con datos de la NASA'), M + 27, 19.5);
    doc.setFontSize(8.5);
    doc.text(t('NASA International Space Apps Challenge 2026 · Riobamba, Ecuador'), M + 27, 24.5);
    doc.setFontSize(9);
    doc.text(t(fechaTxt), W - M, 13, { align: 'right' });
    y = 38;

    // =====================================================================
    // PÁGINA 1 — «Su plan en una hoja»: letra grande, sin tecnicismos
    // =====================================================================
    const H = doc.internal.pageSize.getHeight();
    doc.setTextColor(...TINTA);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(17);
    doc.text(t(datos.nombreAgricultor ? `Plan de siembra de ${datos.nombreAgricultor}` : 'Su plan de siembra'), M, y + 2);
    doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(...GRIS);
    doc.text(t(`${p.nombre} · ${p.area_ha} ha · ${miles(p.terreno?.elev_m)} m de altura`), M, y + 8.5);
    y += 16;

    // Tres años en tarjetas grandes
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); doc.setTextColor(...OLIVA);
    doc.text(t('Qué sembrar los próximos 3 años'), M, y); y += 4;
    const anchoT = (ancho - 8) / 3;
    const altoT = 33;
    rot.cultivos.forEach((c, i) => {
      const x = M + i * (anchoT + 4);
      const mej = AY ? AY.mejoresMeses(AY.calendarioSiembra(c, p, opciones), 1)[0] : null;
      doc.setFillColor(...PAPEL); doc.setDrawColor(...BANDA);
      doc.roundedRect(x, y, anchoT, altoT, 2.5, 2.5, 'FD');
      doc.setFillColor(...TIERRA); doc.rect(x, y, anchoT, 2.2, 'F');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...TIERRA);
      doc.text(`AÑO ${i + 1}`, x + 4, y + 8);
      doc.setFontSize(14.5); doc.setTextColor(...TINTA);
      const nom = doc.splitTextToSize(t(c.nombre), anchoT - 8).slice(0, 2);
      doc.text(nom, x + 4, y + 15);
      const yy = y + 15 + nom.length * 5.6;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(...TINTA);
      doc.text(t(mej ? `Siembre en ${AY.MESES_LARGOS[mej.mes - 1]}` : 'Siembre solo con riego'), x + 4, yy + 1);
      doc.setFontSize(9.5); doc.setTextColor(...GRIS);
      doc.text(t(mej ? `Cosecha en ${AY.MESES_LARGOS[mej.cosecha - 1]}` : ''), x + 4, yy + 6.5);
    });
    y += altoT + 8;

    // Tres cifras clave
    const ganLote = Math.round(rot.detalles.rentabilidad.margenAnualPromedioUsdHa * area);
    const cifras = [
      [`$${miles(ganLote)}`, 'ganancia estimada al año', 'en todo su lote'],
      [`${rot.balanceHidrico.coberturaAguaPct} %`, 'del agua la da la lluvia', rot.balanceHidrico.deficitTotal > 0 ? `riego de apoyo: ${miles(Math.round(rot.balanceHidrico.deficitTotal * 10000 / 3))} L/ha al año` : 'no necesita riego'],
      [`${rot.irrPct} de 100`, 'puntaje para su lote', 'cuida agua, tierra y bolsillo']
    ];
    cifras.forEach((cf, i) => {
      const x = M + i * (anchoT + 4);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(19); doc.setTextColor(...OLIVA);
      doc.text(t(cf[0]), x, y + 6);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(...TINTA);
      doc.text(t(cf[1]), x, y + 12);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(8.5); doc.setTextColor(...GRIS);
      doc.text(doc.splitTextToSize(t(cf[2]), anchoT - 2), x, y + 16.5);
    });
    y += 26;

    // Lista de tareas para marcar
    doc.setDrawColor(...BANDA); doc.line(M, y - 3, W - M, y - 3);
    doc.setFont('helvetica', 'bold'); doc.setFontSize(12.5); doc.setTextColor(...OLIVA);
    doc.text(t('Lo que debe hacer (marque cuando lo haga)'), M, y + 3); y += 9;
    const ordenT = { riesgo: 0, alerta: 1, info: 2, ok: 3 };
    const tareas = [];
    (datos.avisos || []).slice().sort((a, b) => ordenT[a.clase] - ordenT[b.clase])
      .filter(a => a.clase !== 'ok' && (a.acciones || []).length)
      .forEach(a => { if (tareas.length < 7) tareas.push({ txt: a.acciones[0], motivo: a.titulo, clase: a.clase }); });
    tareas.forEach(tk => {
      const lineas = doc.splitTextToSize(t(tk.txt), ancho - 12);
      doc.setDrawColor(...TINTA); doc.setLineWidth(0.4);
      doc.rect(M, y - 3.6, 4.6, 4.6);
      doc.setLineWidth(0.2);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(10.5); doc.setTextColor(...TINTA);
      doc.text(lineas, M + 8, y);
      y += lineas.length * 4.8;
      doc.setFontSize(8); doc.setTextColor(...(tk.clase === 'riesgo' ? [155, 44, 31] : GRIS));
      doc.text(t(`Por: ${tk.motivo}`), M + 8, y);
      y += 5.2;
    });

    // Esta semana (si hay pronóstico)
    const pron = datos.pronostico;
    if (pron && pron.dias && pron.dias.length && y < H - 60) {
      y += 1;
      doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...OLIVA);
      doc.text(t('El tiempo esta semana'), M, y); y += 2.5;
      const anchoD = ancho / pron.dias.length;
      pron.dias.forEach((d, i) => {
        const x = M + i * anchoD;
        const frio = d.tmin <= 0 ? [246, 220, 212] : (d.tmin <= 2 ? [251, 239, 207] : PAPEL);
        doc.setFillColor(...frio); doc.roundedRect(x + 0.6, y, anchoD - 1.2, 15, 1.5, 1.5, 'F');
        const dt = new Date(d.fecha + 'T12:00:00');
        const nom = i === 0 ? 'Hoy' : ['Dom', 'Lun', 'Mar', 'Mié', 'Jue', 'Vie', 'Sáb'][dt.getDay()];
        doc.setFont('helvetica', 'bold'); doc.setFontSize(8.5); doc.setTextColor(...TINTA);
        doc.text(t(nom), x + anchoD / 2, y + 4.2, { align: 'center' });
        doc.setFont('helvetica', 'normal'); doc.setFontSize(8);
        doc.text(t(`${Math.round(d.tmin)}° / ${Math.round(d.tmax)}°`), x + anchoD / 2, y + 8.6, { align: 'center' });
        doc.setTextColor(63, 90, 115);
        doc.text(t(d.lluvia >= 0.1 ? `${d.lluvia.toFixed(d.lluvia < 10 ? 1 : 0)} mm` : 'sin lluvia'), x + anchoD / 2, y + 12.8, { align: 'center' });
      });
      y += 18;
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.2); doc.setTextColor(...GRIS);
      doc.text(t('Mínima / máxima del día. Fondo rojo = helada; amarillo = noche muy fría. Pronóstico abierto Open-Meteo ajustado a su altura.'), M, y);
      y += 5;
    }

    // No siembre esto
    const vetP = res.cultivosVetados || [];
    const fito = vetP.filter(v => !v.razones.every(r => /^Altitud fuera de rango/i.test(r)));
    if (fito.length && y < H - 34) {
      doc.setFillColor(251, 240, 236); doc.setDrawColor(155, 44, 31);
      const txtNo = fito.slice(0, 3).map(v => {
        const rm = AY ? AY.remediosVeto(v.razones, v.cultivo, []) : { motivo: '' };
        return `${v.cultivo.nombre}: ${rm.motivo.toLowerCase()}`;
      }).join(' · ');
      const lin = doc.splitTextToSize(t(`No siembre este año — ${txtNo}.`), ancho - 8);
      doc.roundedRect(M, y, ancho, lin.length * 4.6 + 5, 2, 2, 'FD');
      doc.setFont('helvetica', 'bold'); doc.setFontSize(9.5); doc.setTextColor(155, 44, 31);
      doc.text(lin, M + 4, y + 5.2);
      y += lin.length * 4.6 + 9;
    }

    doc.setFont('helvetica', 'italic'); doc.setFontSize(8.5); doc.setTextColor(...GRIS);
    doc.text(t('Plan hecho con datos de satélites de la NASA (POWER, SRTM, HLS) y suelos ISRIC. Las páginas siguientes tienen el detalle para el técnico.'), M, H - 18, { maxWidth: ancho });

    // =====================================================================
    // ANEXO TÉCNICO
    // =====================================================================
    doc.addPage();
    y = 16;
    doc.setFillColor(...OLIVA); doc.rect(0, 0, W, 10, 'F');
    doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(255, 255, 255);
    doc.text(t('ANEXO TÉCNICO — detalle de datos y cálculos'), M, 6.6);
    doc.text(t(p.nombre || ''), W - M, 6.6, { align: 'right' });
    y = 18;

    // ---------------- 1. Lote ----------------
    titulo('1. Datos del lote');
    const histIds = p.historia_declarada || [];
    const listaCat = Array.isArray(datos.catalogo) ? datos.catalogo : ((datos.catalogo && datos.catalogo.cultivos) || []);
    const nombreCultivo = id => (listaCat.find(c => c.id === id) || {}).nombre || (id || '—');
    tabla({
      body: [
        ...(datos.nombreAgricultor ? [['Agricultor', datos.nombreAgricultor, '']] : []),
        ['Lote', p.nombre || '—', ''],
        ['Ubicación', p.ubicacion_texto || '—', ''],
        ['Coordenadas (centro)', `${num(p.centroide?.lat, 4)}, ${num(p.centroide?.lon, 4)}`, 'WGS84'],
        ['Superficie', `${p.area_ha} ha`, 'Polígono del lote'],
        ['Altitud', `${miles(p.terreno?.elev_m)} m s.n.m.`, fuenteDe(est.terreno, 'NASADEM 30 m (AppEEARS)')],
        ['Pendiente media / máxima', `${p.terreno?.pendiente_pct} % / ${p.terreno?.pendiente_max_pct ?? '—'} %`, fuenteDe(est.terreno, 'NASADEM 30 m (AppEEARS)')],
        ['Orientación · región', `${p.terreno?.orientacion || '—'} · ${p.region || '—'}`, ''],
        ['Cultivos anteriores (declarados)', histIds.filter(Boolean).length ? `2024: ${nombreCultivo(histIds[0])} · 2025: ${nombreCultivo(histIds[1])}` : 'No declarados', 'Agricultor'],
        ['Riego disponible', opciones.conRiego ? 'Sí' : 'No', 'Agricultor'],
        ['Prioridades (1 a 5)', `Agua ${datos.sliders.agua} · Tierra ${datos.sliders.suelo} · Ganancia ${datos.sliders.ganar}`, 'Agricultor']
      ],
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 52 }, 2: { textColor: GRIS, fontSize: 7.5, cellWidth: 62 } }
    });

    // ---------------- 2. Plan recomendado ----------------
    titulo('2. Plan de siembra elegido', TIERRA);
    parrafo(`${rot.esActual ? 'Práctica actual (sin rotación)' : rot.titulo} — puntaje de resiliencia ${rot.irrPct}/100 (IRR ${num(rot.irr, 2)}).`, { bold: true, size: 10.5 });
    const filasPlan = rot.cultivos.map((c, i) => {
      const cal = AY ? AY.calendarioSiembra(c, p, opciones) : null;
      const mej = AY ? AY.mejoresMeses(cal, 2) : [];
      return [
        `Año ${i + 1}`, c.nombre, c.familia,
        mej.length ? mej.map(m => AY.MESES_LARGOS[m.mes - 1]).join(' o ') : 'Ningún mes seguro sin riego',
        mej.length ? AY.MESES_LARGOS[mej[0].cosecha - 1] : '—',
        `$${miles(c.margen_usd_ha || 0)}/ha${c.estado_economico === 'oficial' ? '' : ' (estimado)'}`
      ];
    });
    tabla({ head: [['Año', 'Cultivo', 'Familia', 'Mejor mes de siembra', 'Cosecha', 'Margen bruto']], body: filasPlan,
      headStyles: { fillColor: TIERRA, textColor: 255, fontStyle: 'bold' } });
    const bal = rot.balanceHidrico || {};
    const n = rot.detalles?.nitrogeno || {};
    tabla({
      body: [
        ['Ganancia estimada en su lote', `$${miles(Math.round(rot.detalles.rentabilidad.margenAnualPromedioUsdHa * area))} por año ($${miles(rot.detalles.rentabilidad.margenAnualPromedioUsdHa)}/ha/año)`],
        ['Agua cubierta por la lluvia', `${bal.coberturaAguaPct} % de la demanda del cultivo (${bal.etcTotal} mm en 3 años)`],
        ['Riego de apoyo necesario', `${bal.deficitTotal} mm en 3 años = ${miles(Math.round(bal.deficitTotal * 10000 / 3))} litros/ha por año (${bal.mesesConDeficit} meses secos)`],
        ['Nitrógeno (abono natural)', `${n.creditosKgHa >= 0 ? '+' : ''}${n.creditosKgHa} kg N/ha fijados · balance neto ${n.balanceNetoKgHa >= 0 ? '+' : ''}${n.balanceNetoKgHa} kg N/ha`],
        ['Humus estable', `${rot.detalles?.materiaOrganica?.humusEstableTHa} t/ha en 3 años`]
      ],
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 62 } }
    });

    // ---------------- 3. Advertencias y qué hacer ----------------
    titulo('3. Advertencias del lote y qué hacer', [155, 44, 31]);
    const orden = { riesgo: 0, alerta: 1, info: 2, ok: 3 };
    const nivel = { riesgo: 'CUIDADO', alerta: 'ATENCIÓN', info: 'DATO', ok: 'BIEN' };
    const colorNivel = { riesgo: [155, 44, 31], alerta: [183, 121, 31], info: [63, 90, 115], ok: [79, 107, 31] };
    (datos.avisos || []).slice().sort((a, b) => orden[a.clase] - orden[b.clase]).forEach(a => {
      nuevaSiNoCabe(18);
      doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...colorNivel[a.clase]);
      doc.text(nivel[a.clase], M, y);
      doc.setFontSize(10.5); doc.setTextColor(...TINTA);
      doc.text(t(a.titulo), M + 20, y);
      y += 5;
      if (a.porque) parrafo(a.porque, { indent: 20, size: 9, color: GRIS });
      (a.acciones || []).forEach(x => parrafo(`•  ${x}`, { indent: 22, size: 9, despues: 0.6 }));
      if (a.tecnico) parrafo(`Dato técnico: ${a.tecnico}`, { indent: 20, size: 7.5, color: GRIS });
      y += 2;
    });

    // ---------------- 4. Clima NASA POWER ----------------
    const cl = p.clima_mensual || [];
    if (cl.length === 12) {
      titulo('4. Clima del lote — NASA POWER');
      const extra = cl.every(m => m.Rs_MJ !== undefined);
      const f = 1 + (opciones.escenarioLluviaPct || 0) / 100;
      const head = ['Mes', 'Lluvia P (mm)', 'ET0 (mm)', 'P - ET0', 'T media (°C)', 'T mín. abs. (°C)'].concat(extra ? ['Radiación (MJ/m²·día)', 'Viento 2 m (m/s)', 'Humedad (%)'] : []);
      const body = cl.map(m => [m.nombre_mes, num(m.P_mm * f, 1), num(m.ET0_mm, 1), num(m.P_mm * f - m.ET0_mm, 1), num(m.Tmed, 1), num(m.Tmin_abs, 1)]
        .concat(extra ? [num(m.Rs_MJ, 1), num(m.Viento_ms, 1), String(m.HR_pct)] : []));
      const tot = k => cl.reduce((s, m) => s + m[k], 0);
      body.push([{ content: 'Año', styles: { fontStyle: 'bold' } }, { content: num(tot('P_mm') * f, 1), styles: { fontStyle: 'bold' } },
        { content: num(tot('ET0_mm'), 1), styles: { fontStyle: 'bold' } }, { content: num(tot('P_mm') * f - tot('ET0_mm'), 1), styles: { fontStyle: 'bold' } }, '', '']
        .concat(extra ? ['', '', ''] : []));
      tabla({ head: [head], body, styles: { font: 'helvetica', fontSize: 8, cellPadding: 1.5, halign: 'right', textColor: TINTA, lineColor: BANDA, lineWidth: 0.2 },
        columnStyles: { 0: { halign: 'left' } },
        didParseCell: d => {
          if (d.section === 'body' && d.column.index === 5 && d.row.index < 12) {
            const v = cl[d.row.index].Tmin_abs;
            if (v < 0) d.cell.styles.textColor = [155, 44, 31];
            else if (v < 2) d.cell.styles.textColor = [183, 121, 31];
          }
          if (d.section === 'body' && d.column.index === 3 && d.row.index < 12 && cl[d.row.index].P_mm * f - cl[d.row.index].ET0_mm < 0) d.cell.styles.textColor = [155, 44, 31];
        } });
      parrafo(`Fuente: ${est.clima || 'NASA POWER'} · ${estadoTexto(est.clima)}. ET0 calculada con ${p.clima_metodo_et0 || 'Hargreaves FAO-56'}.` +
        (f !== 1 ? ` Escenario de lluvia aplicado: ${f > 1 ? '+' : ''}${Math.round((f - 1) * 100)} %.` : ''), { size: 8, color: GRIS });
      const an = p.anomalia;
      if (an && typeof an.pct === 'number') {
        parrafo(`Lluvia reciente (${an.ventana}): ${an.lluvia_reciente_mm} mm frente a ${an.lluvia_normal_mm} mm normales (${an.anios_referencia}) = ${an.pct > 0 ? '+' : ''}${an.pct} %. Fuente: ${an.fuente || 'NASA POWER PRECTOTCORR'}, ~${an.res_km || 50} km.`, { size: 9 });
      }
      y += 2;
    }

    // ---------------- 5. Suelo ----------------
    titulo('5. Suelo del lote');
    const s = p.suelo || {};
    tabla({
      head: [['Propiedad (0–30 cm)', 'Valor', 'Fuente']],
      body: [
        ['Textura', s.textura || '—', s.editado_por_usuario ? 'Corregido en campo' : (s.fuente || 'ISRIC SoilGrids 250 m')],
        ['Arcilla', s.arcilla_pct !== undefined ? `${s.arcilla_pct} %` : '—', s.fuente || 'ISRIC SoilGrids'],
        ['Arena', s.arena_pct !== undefined ? `${s.arena_pct} %` : '—', s.fuente || 'ISRIC SoilGrids'],
        ['pH (en agua)', s.ph ?? '—', s.fuente || 'ISRIC SoilGrids'],
        ['Carbono orgánico', s.soc_pct !== undefined ? `${s.soc_pct} %` : '—', s.fuente || 'ISRIC SoilGrids'],
        ['Nitrógeno total', s.n_gkg !== undefined ? `${s.n_gkg} g/kg` : '—', s.fuente || 'ISRIC SoilGrids']
      ],
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 52 }, 2: { textColor: GRIS, fontSize: 7.5 } }
    });
    parrafo('SoilGrids es un mapa mundial de 250 m: confirme pH y nutrientes con un análisis de laboratorio antes de encalar o fertilizar.', { size: 8, color: GRIS });

    // ---------------- 6. Calendario de siembra ----------------
    if (AY && cl.length === 12) {
      titulo('6. ¿Cuándo sembrar? Calendario por cultivo');
      const vistos = new Set();
      const cultivos = [];
      res.recomendadas.forEach(r => r.cultivos.forEach(c => { if (!vistos.has(c.id)) { vistos.add(c.id); cultivos.push(c); } }));
      const cals = cultivos.map(c => AY.calendarioSiembra(c, p, opciones));
      const letra = { ok: 'B', alerta: 'C', riesgo: 'E' };
      tabla({
        head: [['Cultivo'].concat(MESES)],
        body: cultivos.map((c, i) => [c.nombre].concat(cals[i].map(x => `${letra[x.nivel]} ${Math.min(x.cobertura, 999)}%`))),
        styles: { font: 'helvetica', fontSize: 6.8, cellPadding: 1.2, halign: 'center', textColor: TINTA, lineColor: [255, 255, 255], lineWidth: 0.4 },
        columnStyles: { 0: { halign: 'left', fontStyle: 'bold', cellWidth: 30 } },
        didParseCell: d => {
          if (d.section !== 'body' || d.column.index === 0) return;
          const x = cals[d.row.index][d.column.index - 1];
          d.cell.styles.fillColor = x.nivel === 'ok' ? VERDE_OK : (x.nivel === 'alerta' ? AMARILLO : ROJO);
        }
      });
      parrafo('B = buen mes · C = posible con cuidado · E = evitar. El % es el agua de lluvia que cubre la demanda del cultivo durante su ciclo (NASA POWER, FAO-56); también se revisan heladas y lluvia en la cosecha.', { size: 8, color: GRIS });
    }

    // ---------------- 7. Comparación de opciones ----------------
    titulo('7. Comparación de opciones');
    tabla({
      head: [['Opción', 'Año 1 → Año 3', 'Puntaje', 'Agua por lluvia', 'Riego 3 años', 'N neto', 'Margen/ha/año']].map(r => r.map(x => x.replace('→', '-'))),
      body: [...res.recomendadas, res.actual].map(r => [
        r.esActual ? 'Práctica actual' : r.titulo.replace(/\s+—.*$/, ''),
        r.cultivos.map(c => c.nombre).join(' - '),
        `${r.irrPct}/100`, `${r.balanceHidrico.coberturaAguaPct} %`, `${r.balanceHidrico.deficitTotal} mm`,
        `${r.detalles.nitrogeno.balanceNetoKgHa >= 0 ? '+' : ''}${r.detalles.nitrogeno.balanceNetoKgHa} kg`,
        `$${miles(r.detalles.rentabilidad.margenAnualPromedioUsdHa)}`
      ]),
      didParseCell: d => { if (d.section === 'body' && [...res.recomendadas, res.actual][d.row.index].id === rot.id) d.cell.styles.fontStyle = 'bold'; }
    });

    // ---------------- 8. Cultivos no recomendados ----------------
    const vet = res.cultivosVetados || [];
    if (vet.length) {
      titulo('8. Cultivos que no conviene sembrar en este lote');
      const idsVet = new Set(vet.map(v => v.cultivo.id));
      const sugeribles = (res.cultivosAptos || []).filter(c => !idsVet.has(c.id));
      const porAltura = vet.filter(v => v.razones.length && v.razones.every(r => /^Altitud fuera de rango/i.test(r)));
      const otros = vet.filter(v => !porAltura.includes(v));
      const filas = otros.map(v => {
        const rm = AY ? AY.remediosVeto(v.razones, v.cultivo, sugeribles) : { motivo: '', acciones: [] };
        return [v.cultivo.nombre, `${rm.motivo}. ${v.razones.join(' ')}`, rm.acciones.slice(0, 2).join(' ')];
      });
      if (porAltura.length) {
        filas.push([porAltura.map(v => v.cultivo.nombre).join(', '),
          `No se dan a ${miles(p.terreno?.elev_m)} m: cada uno requiere un rango de altitud distinto (piso térmico).`,
          `Elija entre los cultivos que sí se dan aquí: ${sugeribles.slice(0, 6).map(c => c.nombre).join(', ')}.`]);
      }
      tabla({
        head: [['Cultivo', 'Motivo', 'Qué hacer']],
        body: filas,
        styles: { font: 'helvetica', fontSize: 7.8, cellPadding: 1.6, textColor: TINTA, lineColor: BANDA, lineWidth: 0.2 },
        columnStyles: { 0: { fontStyle: 'bold', cellWidth: 34 } }
      });
    }

    // ---------------- 9. Origen de los datos ----------------
    titulo('9. Origen y calidad de los datos');
    tabla({
      head: [['Información', 'Fuente', 'Estado']],
      body: [
        ['Clima mensual (lluvia, temperatura, ET0)', est.clima || 'NASA POWER', estadoTexto(est.clima)],
        ['Lluvia reciente vs. normal', est.anomalia || 'NASA POWER PRECTOTCORR', estadoTexto(est.anomalia)],
        ['Altitud y pendiente', esEjemplo(est.terreno) || esSinDato(est.terreno) ? 'SRTM / NASADEM 30 m (pendiente de AppEEARS)' : est.terreno, estadoTexto(est.terreno)],
        ['Suelo (textura, pH, carbono, nitrógeno)', est.suelo || 'ISRIC SoilGrids 250 m', estadoTexto(est.suelo)],
        ['Historial de verdor (NDVI/NDTI)', esEjemplo(est.ndvi) || esSinDato(est.ndvi) ? 'HLS Landsat 8/9 + Sentinel-2, 30 m (pendiente de AppEEARS)' : est.ndvi, estadoTexto(est.ndvi)],
        ['Humedad del suelo', esEjemplo(est.smap) || esSinDato(est.smap) ? 'SMAP L4, 9 km (pendiente de AppEEARS)' : est.smap, estadoTexto(est.smap)],
        ['Precios al productor', 'MAG-SIPA, boletín dic 2025', 'Dato oficial'],
        ['Rendimientos', 'ESPAC-INEC 2024–2025', 'Dato oficial (algunos cultivos estimados)'],
        ['Costos de producción', 'Estimación del equipo', 'Estimado: validar con la asociación local']
      ],
      columnStyles: { 0: { fontStyle: 'bold', cellWidth: 58 }, 2: { cellWidth: 40 } },
      didParseCell: d => {
        if (d.section === 'body' && d.column.index === 2) {
          const v = String(d.cell.raw);
          if (/EJEMPLO|FALTA|Estimado/i.test(v)) d.cell.styles.textColor = [155, 44, 31];
          else d.cell.styles.textColor = [79, 107, 31];
        }
      }
    });
    parrafo('Los datos marcados como EJEMPLO o FALTA DATO no se presentan como reales: se reemplazan cuando llegan los archivos de NASA AppEEARS. RotaSat apoya la decisión; la última palabra la tienen el agricultor y el técnico de su zona.', { size: 8, color: GRIS });

    // ---------------- Pie de página ----------------
    const total = doc.getNumberOfPages();
    for (let i = 1; i <= total; i++) {
      doc.setPage(i);
      const H = doc.internal.pageSize.getHeight();
      doc.setDrawColor(...BANDA); doc.line(M, H - 12, W - M, H - 12);
      doc.setFont('helvetica', 'normal'); doc.setFontSize(7.5); doc.setTextColor(...GRIS);
      doc.text(t(`RotaSat · ${p.nombre || 'Lote'} · generado el ${fechaTxt}`), M, H - 7);
      doc.text(`Página ${i} de ${total}`, W - M, H - 7, { align: 'right' });
    }
    return doc;
  }

  async function descargar(datos) {
    const doc = await construir(datos);
    const base = String(datos.parcela.nombre || 'lote').normalize('NFD').replace(/[̀-ͯ]/g, '')
      .replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '').slice(0, 40);
    doc.save(`RotaSat_${base}_${new Date().toISOString().slice(0, 10)}.pdf`);
    return doc;
  }

  window.InformePDF = { construir, descargar, disponible: () => Boolean(window.jspdf && window.jspdf.jsPDF) };
})();

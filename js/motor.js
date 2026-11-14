/**
 * motor.js — Capa B3: Orquestador de Recomendaciones, Evaluador de Rotación Actual
 * y Generador de Explicabilidad NASA en 5 Dimensiones Oficiales.
 */
(function (root) {
  'use strict';

  const Filtros = (typeof module !== 'undefined' && module.exports)
    ? require('./filtros.js')
    : root.FiltrosMotor;
  const Balance = (typeof module !== 'undefined' && module.exports)
    ? require('./balance.js')
    : root.BalanceMotor;
  const IRR = (typeof module !== 'undefined' && module.exports)
    ? require('./irr.js')
    : root.AgronomiaIRR;

  function enriquecerBalance(bal) {
    const coberturaAguaPct = bal.totalETc_mm > 0
      ? Math.max(0, Math.min(100, Math.round((1 - bal.totalDeficit_mm / bal.totalETc_mm) * 100)))
      : 100;
    const mesesConDeficit = bal.mesesConDeficit !== undefined
      ? bal.mesesConDeficit
      : (bal.meses36 || []).filter(m => m.deficit_mm > 12).length;
    return Object.assign({}, bal, {
      etcTotal: bal.totalETc_mm,
      deficitTotal: bal.totalDeficit_mm,
      pefTotal: bal.totalPef_mm,
      coberturaAguaPct,
      mesesConDeficit,
      mesesSueloDesnudo: bal.mesesSinCobertura
    });
  }

  function clasificarCultivosParcela(parcela, catalogo, opciones) {
    const opts = opciones || {};
    const historiaIds = Array.isArray(opts.historiaIds)
      ? opts.historiaIds
      : (parcela.historia_declarada || []);
    const nematodoDeclarado = opts.nematodoDeclarado !== undefined
      ? Boolean(opts.nematodoDeclarado)
      : Boolean(parcela.nematodo_declarado);
    const pausasFamilia = catalogo.pausas_familia || {};

    const catalogoMap = {};
    for (const c of (catalogo.cultivos || [])) {
      catalogoMap[c.id] = c;
    }

    const historiaObjs = historiaIds.map(id => catalogoMap[id]).filter(Boolean);
    const aptos = [];
    const vetados = [];

    for (const cultivo of (catalogo.cultivos || [])) {
      const evalBiofisica = Filtros.evaluarFiltroIndividual(
        cultivo, parcela, [], catalogoMap, pausasFamilia, nematodoDeclarado
      );
      const evalConHistoria = Filtros.evaluarFiltroIndividual(
        cultivo, parcela, historiaIds, catalogoMap, pausasFamilia, nematodoDeclarado
      );

      if (evalBiofisica.apto) {
        aptos.push(Object.assign({}, cultivo, {
          aptoAnio1: evalConHistoria.apto,
          razonesVetoAnio1: evalConHistoria.razones
        }));
        if (!evalConHistoria.apto) {
          vetados.push({
            cultivo,
            tipoVeto: 'fitosanitario',
            razones: evalConHistoria.razones
          });
        }
      } else {
        vetados.push({
          cultivo,
          tipoVeto: 'biofisico',
          razones: evalConHistoria.razones
        });
      }
    }

    return {
      aptos,
      vetados,
      historiaIds,
      historiaObjs,
      catalogoMap,
      nematodoDeclarado
    };
  }

  function diagnosticarRiesgoSecuencia(seq, historiaIds, catalogoMap, pausasFamilia, nematodoDeclarado) {
    const tieneFabacea = seq.some(c => c.familia === 'Fabáceas');
    if (!tieneFabacea) {
      return 'No incluye ninguna leguminosa fijadora de nitrógeno (Fabáceas) en los 3 años: agotamiento progresivo de fertilidad y plagas persistentes.';
    }
    const histObjs = (historiaIds || []).map(id => catalogoMap[id]).filter(Boolean);
    const linea = [...histObjs, ...seq];
    const inicio = histObjs.length;
    for (let t = inicio; t < linea.length; t++) {
      const actual = linea[t];
      const regla = pausasFamilia[actual.familia] || { anios_min: 1, anios_nematodo: 1 };
      const pausa = nematodoDeclarado ? (regla.anios_nematodo || regla.anios_min) : regla.anios_min;
      for (let prev = 0; prev < t; prev++) {
        const ant = linea[prev];
        const dist = t - prev;
        if (actual.id === ant.id && dist === 1) {
          return `Repite ${actual.nombre} en años consecutivos: multiplica plagas específicas y agota el mismo estrato radicular.`;
        }
        if (actual.familia === ant.familia && pausa >= 3 && dist <= pausa) {
          return `Viola la pausa fitosanitaria de ${actual.familia} (${pausa} años): ${regla.mensaje_agricultor || regla.razon}`;
        }
      }
    }
    return 'Riesgo fitosanitario por repetición de familia botánica.';
  }

  function determinarSemaforo(irrScore, bal, violaPausaFitosanitaria) {
    if (violaPausaFitosanitaria || irrScore < 0.45 || bal.coberturaAguaPct < 45) {
      return {
        color: 'riesgo',
        etiqueta: 'Alto · Riesgo fitosanitario o hídrico',
        icono: ''
      };
    }
    if (irrScore < 0.58 || bal.coberturaAguaPct < 62 || bal.mesesConDeficit > 12) {
      return {
        color: 'alerta',
        etiqueta: 'Medio · Viable con precaución',
        icono: ''
      };
    }
    return {
      color: 'ok',
      etiqueta: 'Bajo · Rotación resiliente',
      icono: ''
    };
  }

  /**
   * Construye las 5 dimensiones de explicabilidad exigidas por el reto oficial NASA Space Apps 2026:
   * 1. ¿Por qué se sugiere?
   * 2. ¿Qué evidencia satelital NASA y de suelo la respalda?
   * 3. ¿Qué beneficios concretos ofrece al agricultor?
   * 4. ¿Dónde existen lagunas de información (incertidumbre satelital)?
   * 5. ¿Qué riesgos requieren revisión local por el agricultor o técnico?
   */
  function construirExplicacion5Puntos(seq, parcela, bal, resIRR, historiaObjs, esActual, motivoRiesgo) {
    const nombres = seq.map(c => c.nombre).join(' → ');
    const familias = seq.map(c => c.familia).join(' → ');
    const leguminosas = seq.filter(c => c.familia === 'Fabáceas').map(c => c.nombre);
    const histNombres = (historiaObjs || []).map(h => h.nombre).join(' → ');
    const pendiente = parcela.terreno?.pendiente_pct ?? 10;
    const altitud = parcela.terreno?.elev_m ?? 2800;
    const anomaliaPct = parcela.anomalia ? parcela.anomalia.pct : 0;

    const mesesDesnudoHist = (parcela.ndvi_mensual || []).filter(m => m.ndvi < 0.25).length;
    const totalMesesHist = (parcela.ndvi_mensual || []).length || 24;
    const pctDesnudoHist = Math.round((mesesDesnudoHist / totalMesesHist) * 100);

    let porQue = '';
    if (esActual) {
      porQue = `Representa continuar con la práctica histórica del lote (${nombres}). Se muestra como línea base para comparar el desgaste de nutrientes, la presión de plagas (${motivoRiesgo || 'sin rotación'}) y el consumo de agua frente a estrategias diversificadas.`;
    } else {
      const iniciaLeg = seq[0].familia === 'Fabáceas';
      const credAnio1 = seq[0].credito_n_kg || 0;
      porQue = `Secuencia ${nombres} (${familias}) diseñada para cortar el ciclo de plagas tras ${histNombres || 'los cultivos anteriores'}. ` +
        (iniciaLeg
          ? `Inicia en el Año 1 con ${seq[0].nombre} (${seq[0].familia}) para fijar +${credAnio1} kg N/ha en el suelo agotado antes de sembrar ${seq[1].nombre}, activando el bono de sincronía C/N.`
          : `Incorpora ${leguminosas.join(' y ')} para reponer nitrógeno biológico y alterna arquitecturas de raíz (${seq.map(c => c.raiz_tipo).join(' → ')}).`);
    }

    // Si un bloque de datos sigue siendo de EJEMPLO (ver generar_parcelas.py), se dice explícitamente
    const est = parcela.estado_datos || {};
    const ej = campo => (typeof est[campo] === 'string' && est[campo].startsWith('EJEMPLO')) ? 'EJEMPLO, aún sin dato real — ' : '';
    const evidenciaNasa = [
      `${ej('clima')}NASA POWER (climatología 10 años; ET₀ ${parcela.clima_metodo_et0 && /Penman/.test(parcela.clima_metodo_et0) ? 'Penman-Monteith con radiación, viento y humedad' : 'Hargreaves con temperatura'}): la lluvia efectiva cubre el ${bal.coberturaAguaPct}% de la demanda hídrica del plan (${bal.etcTotal} mm); considera la anomalía regional de ${anomaliaPct > 0 ? '+' : ''}${anomaliaPct}% en ${parcela.anomalia?.ventana || 'el último trimestre'}.`,
      (parcela.ndvi_mensual || []).length
        ? `${ej('ndvi')}HLS Landsat 8/9 + Sentinel-2 (30 m): detectó ${mesesDesnudoHist} de ${totalMesesHist} meses (${pctDesnudoHist}%) con suelo descubierto (NDVI < 0.25); esta rotación sincroniza la cobertura vegetal con los picos de lluvia.`
        : `HLS Landsat 8/9 + Sentinel-2 (30 m): este lote todavía no tiene historial satelital (se pide a AppEEARS y tarda horas); la recomendación usa clima, suelo y altitud.`,
      `${ej('suelo') || ej('terreno')}NASADEM SRTM (30 m) + ISRIC SoilGrids (250 m): lote a ${altitud} m s.n.m. con pendiente media del ${pendiente}% y suelo ${parcela.suelo?.textura || 'Franco'} (${parcela.suelo?.soc_pct || 2.0}% carbono orgánico, pH ${parcela.suelo?.ph || 6.0}).`
    ];

    const ahorroUreaSacos = Math.max(0, Math.round((resIRR.detalles.nitrogeno.creditosKgHa / 23) * 10) / 10);
    const beneficios = [
      `Abono natural (Nitrógeno): aporta +${resIRR.detalles.nitrogeno.creditosKgHa} kg N/ha fijados por leguminosas (equivale a ahorrar ~${ahorroUreaSacos} sacos de urea de 50 kg/ha en 3 años), con balance neto de ${resIRR.detalles.nitrogeno.balanceNetoKgHa >= 0 ? '+' : ''}${resIRR.detalles.nitrogeno.balanceNetoKgHa} kg N/ha.`,
      `Vida y esponjosidad del suelo: deja ${resIRR.detalles.materiaOrganica.biomasaResiduoTHa} t/ha de rastrojo seco (${resIRR.detalles.materiaOrganica.humusEstableTHa} t/ha de humus estable) alternando raíces para romper el piso de arado.`,
      `Agua e ingreso familiar: demanda ${bal.deficitTotal} mm de riego complementario en 3 años (≈ ${Math.round(bal.deficitTotal * 10000 / 3).toLocaleString('es-EC')} litros/ha por año; 1 mm = 10 000 L/ha) con ${bal.coberturaAguaPct}% cubierto por lluvia, y proyecta un margen bruto medio de $${resIRR.detalles.rentabilidad.margenAnualPromedioUsdHa.toLocaleString()} USD/ha/año ($${resIRR.detalles.rentabilidad.margenTotalUsdHa.toLocaleString()} USD/ha en 3 años, ref. MAG-SIPA).`
    ];

    const lagunasInfo = [
      `Diferencia de escala espacial: el clima NASA POWER (~50 km) y el suelo SoilGrids (250 m) promedian toda la zona; dentro de su cuadra o parcela pueden existir vetas más arenosas, cascajosas o húmedas.`,
      `Sanidad subsuperficial: las cámaras satelitales HLS (30 m) miden verdor de hoja (NDVI) y rastrojo en superficie (NDTI), pero no pueden ver quistes de nematodos, larvas de gusano blanco ni capas duras bajo los 20 cm.`
    ];

    const riesgosLocales = [];
    if (bal.mesesDeficitNombres && bal.mesesDeficitNombres.length > 0) {
      riesgosLocales.push(`Déficit de agua en meses secos (${bal.mesesDeficitNombres.join(', ')}; déficit total ${bal.deficitTotal} mm en 3 años): confirmar turno de riego comunitario o ajustar fecha de siembra.`);
    } else {
      riesgosLocales.push(`Aunque la lluvia histórica cubre la demanda promedio, verificar el pronóstico estacional del INAMHI ante posibles veranillos a mitad de ciclo.`);
    }
    const phSuelo = Number(parcela.suelo && parcela.suelo.ph);
    if (phSuelo && phSuelo < 5.5) {
      riesgosLocales.push(`Suelo ácido (pH ${phSuelo}, ISRIC SoilGrids): puede limitar el calcio y fijar el fósforo; conviene un análisis de laboratorio antes de aplicar cal agrícola. No encale a ciegas: la papa tolera pH ácido.`);
    } else if (phSuelo && phSuelo > 7.5) {
      riesgosLocales.push(`Suelo alcalino (pH ${phSuelo}, ISRIC SoilGrids): puede bloquear hierro, zinc y fósforo; ayudan el abono orgánico y los residuos de cosecha. Confirme con análisis de laboratorio.`);
    } else if (phSuelo) {
      riesgosLocales.push(`pH del suelo ${phSuelo} (ISRIC SoilGrids, 250 m): dentro del rango favorable para la mayoría de cultivos de la rotación; no requiere encalado. Verifique con análisis local.`);
    }
    const tieneMesHelada = (parcela.clima_mensual || []).some(m => m.Tmin_abs < 1.5);
    if (tieneMesHelada) {
      riesgosLocales.push(`Riesgo de heladas o enfriamientos nocturnos en meses secos (Jun–Ago): evitar que la floración de ${seq[0].nombre} coincida con madrugadas despejadas de julio-agosto.`);
    }
    if (pendiente >= 12) {
      riesgosLocales.push(`Pendiente de ${pendiente}%: sembrar en curvas de nivel (surcos atravesados a la pendiente) y conservar el rastrojo sobre el suelo.`);
    }
    riesgosLocales.push(`Validar con la feria local o asociación el precio vigente y disponibilidad de semilla sana de ${seq[0].nombre} antes de comprar insumos.`);

    return {
      porQue,
      evidenciaNasa,
      beneficios,
      lagunasInfo,
      riesgosLocales
    };
  }

  function evaluarRotacionActual(parcela, catalogo, clasificacion, sliders, opciones) {
    const { aptos, historiaIds, historiaObjs, catalogoMap, nematodoDeclarado } = clasificacion;
    const pausasFamilia = catalogo.pausas_familia || {};

    let seqActual = [];
    if (historiaObjs.length >= 2) {
      seqActual = [
        historiaObjs[historiaObjs.length - 2],
        historiaObjs[historiaObjs.length - 1],
        historiaObjs[historiaObjs.length - 2]
      ];
    } else if (historiaObjs.length === 1) {
      seqActual = [historiaObjs[0], historiaObjs[0], historiaObjs[0]];
    } else {
      const fb = aptos[0] || catalogo.cultivos[0];
      seqActual = [fb, fb, fb];
    }

    const pasaSeq = Filtros.pasaFiltrosSecuencia(seqActual, historiaIds, catalogoMap, pausasFamilia, nematodoDeclarado);
    const motivoRiesgo = pasaSeq
      ? null
      : diagnosticarRiesgoSecuencia(seqActual, historiaIds, catalogoMap, pausasFamilia, nematodoDeclarado);

    const balRaw = Balance.balanceHidrico(seqActual, parcela, opciones.escenarioLluviaPct || 0, false);
    const bal = enriquecerBalance(balRaw);
    const resIRR = IRR.calcularIRR(seqActual, bal, parcela, aptos, sliders, historiaObjs, opciones);

    let irrAjustado = resIRR.irr;
    if (!pasaSeq) {
      irrAjustado = Math.max(0.15, Number((irrAjustado - 0.25).toFixed(4)));
    }

    const semaforo = determinarSemaforo(irrAjustado, bal, !pasaSeq);
    const explicacion = construirExplicacion5Puntos(seqActual, parcela, bal, resIRR, historiaObjs, true, motivoRiesgo);

    return {
      id: 'rotacion_actual',
      esActual: true,
      titulo: 'Práctica actual (continuar secuencia habitual del lote)',
      cultivos: seqActual,
      irr: irrAjustado,
      irrPct: Math.round(irrAjustado * 100),
      irrSinPenalizar: resIRR.irr,
      subindices: resIRR.subindices,
      detalles: resIRR.detalles,
      pesos: resIRR.pesos,
      balanceHidrico: bal,
      semaforo,
      violaReglasFitosanitarias: !pasaSeq,
      motivoRiesgoFitosanitario: motivoRiesgo,
      explicacion
    };
  }

  function recomendar(parcela, catalogo, sliders, opciones) {
    const t0 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const opts = Object.assign({
      escenarioLluviaPct: 0,
      retiraForraje: false,
      priorizarForraje: false
    }, opciones || {});

    const clasificacion = clasificarCultivosParcela(parcela, catalogo, opts);
    const { aptos, vetados, historiaIds, historiaObjs, catalogoMap, nematodoDeclarado } = clasificacion;
    const pausasFamilia = catalogo.pausas_familia || {};

    const candidatosAnio1 = aptos.filter(c => c.aptoAnio1);
    const candidatosAnio2y3 = aptos;

    const candidatas = [];

    for (let i = 0; i < candidatosAnio1.length; i++) {
      const c1 = candidatosAnio1[i];
      for (let j = 0; j < candidatosAnio2y3.length; j++) {
        const c2 = candidatosAnio2y3[j];
        if (c1.id === c2.id) continue;
        for (let k = 0; k < candidatosAnio2y3.length; k++) {
          const c3 = candidatosAnio2y3[k];
          if (c2.id === c3.id) continue;

          const seq = [c1, c2, c3];
          const esValida = Filtros.pasaFiltrosSecuencia(seq, historiaIds, catalogoMap, pausasFamilia, nematodoDeclarado);
          if (!esValida) continue;

          const balLigero = Balance.balanceHidrico(seq, parcela, opts.escenarioLluviaPct, true);
          const bal = enriquecerBalance(balLigero);
          const resIRR = IRR.calcularIRR(seq, bal, parcela, aptos, sliders, historiaObjs, opts);

          candidatas.push({
            cultivos: seq,
            irr: resIRR.irr,
            irrPct: resIRR.irrPct,
            subindices: resIRR.subindices,
            detalles: resIRR.detalles,
            pesos: resIRR.pesos,
            resIRR
          });
        }
      }
    }

    candidatas.sort((a, b) => b.irr - a.irr);

    // Seleccionar el Top 3 garantizando diversidad genuina entre las 3 estrategias propuestas
    const top3 = [];
    const combinacionesVistas = new Set();

    for (let idx = 0; idx < candidatas.length && top3.length < 3; idx++) {
      const cand = candidatas[idx];
      const clave = cand.cultivos.map(c => c.id).join('|');
      if (combinacionesVistas.has(clave)) continue;

      if (top3.length > 0 && candidatas.length > 15) {
        // Evitar que una nueva estrategia sea simplemente permutar [A, B, C] -> [C, B, A] con exactamente el mismo cultivo central
        const mismoCentro = top3.some(t => t.cultivos[1].id === cand.cultivos[1].id &&
          new Set(t.cultivos.map(x => x.id)).size === new Set([...t.cultivos.map(x => x.id), ...cand.cultivos.map(x => x.id)]).size);
        if (mismoCentro) continue;
      }

      combinacionesVistas.add(clave);
      const balCompleto = enriquecerBalance(
        Balance.balanceHidrico(cand.cultivos, parcela, opts.escenarioLluviaPct, false)
      );
      const semaforo = determinarSemaforo(cand.irr, balCompleto, false);
      const explicacion = construirExplicacion5Puntos(
        cand.cultivos, parcela, balCompleto, cand.resIRR, historiaObjs, false, null
      );

      const etiquetasEstrategia = [
        'Estrategia 1 — Máxima resiliencia integral (recomendada)',
        'Estrategia 2 — Alternativa de suelo, grano y mercado',
        'Estrategia 3 — Diversificación y cobertura protectora'
      ];

      top3.push({
        id: `recomendada_${top3.length + 1}`,
        rango: top3.length + 1,
        esActual: false,
        titulo: etiquetasEstrategia[top3.length] || `Estrategia ${top3.length + 1}`,
        cultivos: cand.cultivos,
        irr: cand.irr,
        irrPct: cand.irrPct,
        subindices: cand.subindices,
        detalles: cand.detalles,
        pesos: cand.pesos,
        balanceHidrico: balCompleto,
        semaforo,
        violaReglasFitosanitarias: false,
        motivoRiesgoFitosanitario: null,
        explicacion
      });
    }

    const rotacionActual = evaluarRotacionActual(parcela, catalogo, clasificacion, sliders, opts);

    const t1 = (typeof performance !== 'undefined' && performance.now) ? performance.now() : Date.now();
    const tiempoMs = Number((t1 - t0).toFixed(2));

    return {
      parcelaId: parcela.id,
      parcelaNombre: parcela.nombre,
      tiempoCalculoMs: tiempoMs,
      totalSecuenciasEvaluadas: candidatas.length,
      pesosAplicados: top3[0] ? top3[0].pesos : IRR.calcularPesos(sliders, parcela, opts.escenarioLluviaPct),
      recomendadas: top3,
      actual: rotacionActual,
      cultivosAptos: aptos,
      cultivosVetados: vetados
    };
  }

  const API = {
    recomendar,
    clasificarCultivosParcela,
    evaluarRotacionActual,
    construirExplicacion5Puntos,
    determinarSemaforo
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }
  root.AgronomiaMotor = API;
})(typeof window !== 'undefined' ? window : globalThis);

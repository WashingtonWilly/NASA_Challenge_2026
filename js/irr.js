/**
 * irr.js — Capa B2: Índice de Resiliencia de Rotación (IRR)
 * Ecuaciones normalizadas [0, 1] según Sección 7.3 de la guía técnica:
 *   IRR = w_H2O * I_H2O + w_N * I_N + w_MOS * I_MOS + w_rent * I_rent
 *   con ajuste automático del peso hídrico cuando GPM/IMERG detecta anomalía < -15%.
 */
(function (root) {
  'use strict';

  function clip(val, min, max) {
    return Math.max(min, Math.min(max, val));
  }

  /**
   * 1. Índice de agua (I_H2O)
   * I_H2O = 1 - sum(D(m)) / sum(ETc(m))
   */
  function indiceAgua(bal) {
    if (!bal || bal.totalETc_mm <= 0) return 1.0;
    const ratio = 1.0 - (bal.totalDeficit_mm / bal.totalETc_mm);
    return Number(clip(ratio, 0, 1).toFixed(4));
  }

  /**
   * 2. Índice de nitrógeno (I_N) con sincronía C/N y recuperación de suelo agotado
   * I_N_base = clip((sum(creditos) - sum(extracciones) + 300) / 600, 0, 1)
   * Reglas de sincronía (Sección 6.3 / 7.3):
   * - Si cultivo i es leguminosa (Fabáceas, C/N bajo < 20) y cultivo i+1 es gramínea/cereal o no-Fabácea:
   *   bono +0.10 por liberación rápida de N mineralizable a tiempo para el siguiente ciclo.
   * - Si el historial reciente (2 años previos) no tuvo leguminosas y el Año 1 (seq[0]) es Fabácea:
   *   bono +0.08 por cortar inmediatamente el agotamiento de nitrógeno y plagas del suelo.
   * - Si cultivo i tiene C/N > 40 ("alto") y cultivo i+1 también es gramínea/cereal exigente:
   *   penalización -0.15 por hambre transitoria de nitrógeno (inmovilización microbiana).
   */
  function indiceNitrogeno(seq, historiaObjs) {
    let creditos = 0;
    let extracciones = 0;
    for (let i = 0; i < seq.length; i++) {
      creditos += (seq[i].credito_n_kg ?? seq[i].n_credito_kg_ha ?? 0);
      extracciones += (seq[i].extraccion_n_kg ?? seq[i].n_extraccion_kg_ha ?? 0);
    }
    const balanceNetoN = creditos - extracciones;
    const inScore = clip((balanceNetoN + 300) / 600, 0, 1);

    let bonoSincronia = 0;
    let penalizacionCN = 0;

    for (let i = 0; i < seq.length - 1; i++) {
      const actual = seq[i];
      const siguiente = seq[i + 1];
      if (actual.familia === 'Fabáceas' && siguiente.familia !== 'Fabáceas') {
        bonoSincronia += 0.10;
      }
      if ((actual.cn_clase === 'alto' || actual.cn_clase === 'alta_40') &&
          (siguiente.familia === 'Poáceas' || siguiente.familia === 'Arroz')) {
        penalizacionCN += 0.15;
      }
    }

    // Bono por iniciar con leguminosa tras ciclos sin Fabáceas en la historia de la parcela
    if (Array.isArray(historiaObjs) && historiaObjs.length > 0) {
      const huboFabaceaReciente = historiaObjs.some(h => h && h.familia === 'Fabáceas');
      if (!huboFabaceaReciente && seq[0] && seq[0].familia === 'Fabáceas') {
        bonoSincronia += 0.08;
      }
    }

    const finalScore = clip(inScore + bonoSincronia - penalizacionCN, 0, 1);
    return {
      valor: Number(finalScore.toFixed(4)),
      balanceNetoKgHa: Math.round(balanceNetoN),
      creditosKgHa: Math.round(creditos),
      extraccionesKgHa: Math.round(extracciones),
      bonoSincronia: Number(bonoSincronia.toFixed(2)),
      penalizacionCN: Number(penalizacionCN.toFixed(2))
    };
  }

  /**
   * 3. Índice de Materia Orgánica y Estructura del Suelo (I_MOS)
   * I_MOS = sum(residuo_i * h_i * factor_forraje) / max_aporte_3_cultivos
   * Penalizaciones (Sección 6.3 / 7.3):
   * - -0.10 por cada par consecutivo con la misma arquitectura radicular (raiz_estructura),
   *   porque compacta el mismo horizonte del suelo (piso de arado).
   * - -0.08 si el suelo queda descubierto > 16 meses de los 36 meses.
   * Bono:
   * - +0.06 si en ladera (pendiente >= 12%) incluye al menos 2 cultivos sin labranza intensiva.
   */
  function indiceMateriaOrganica(seq, parcela, bal, opciones) {
    const opts = opciones || {};
    const retiraForraje = Boolean(opts.retiraForraje);
    // Máximo teórico de referencia para 3 cultivos (~4.5 t/ha de humus estable en 3 años)
    const maxAporteRef = 4.5;

    let humusTotal = 0;
    let biomasaTotal = 0;

    for (let i = 0; i < seq.length; i++) {
      const c = seq[i];
      const factorForraje = (retiraForraje && c.es_forrajero) ? 0.30 : 1.0;
      const residuoEfectivo = (c.residuo_t_ha || 0) * factorForraje;
      const coefH = c.coef_humificacion ?? c.coef_humificacion_h ?? 0.20;
      const humus = residuoEfectivo * coefH;
      biomasaTotal += residuoEfectivo;
      humusTotal += humus;
    }

    const imosBase = clip(humusTotal / maxAporteRef, 0, 1);

    // Penalización por repetir la misma estructura radicular en años consecutivos
    let penalizacionRaiz = 0;
    for (let i = 0; i < seq.length - 1; i++) {
      if (seq[i].raiz_estructura && seq[i].raiz_estructura === seq[i + 1].raiz_estructura) {
        penalizacionRaiz += 0.10;
      }
    }

    // Penalización por exceso de suelo desnudo
    let penalizacionDesnudo = 0;
    if (bal && bal.mesesSinCobertura > 16) {
      penalizacionDesnudo = 0.08;
    }

    // Bono por proteger laderas (>= 12% pendiente) con cultivos que no requieren labranza intensiva
    let bonoLadera = 0;
    if (parcela && parcela.terreno && parcela.terreno.pendiente_pct >= 12) {
      const protectores = seq.filter(c => !c.labranza_intensiva).length;
      if (protectores >= 2) {
        bonoLadera = 0.06;
      }
    }

    const finalScore = clip(imosBase + bonoLadera - penalizacionRaiz - penalizacionDesnudo, 0, 1);
    return {
      valor: Number(finalScore.toFixed(4)),
      humusEstableTHa: Number(humusTotal.toFixed(2)),
      biomasaResiduoTHa: Number(biomasaTotal.toFixed(2)),
      penalizacionRaiz: Number(penalizacionRaiz.toFixed(2)),
      bonoLadera: Number(bonoLadera.toFixed(2))
    };
  }

  /**
   * 4. Índice de Rentabilidad y Seguridad Económica (I_rent)
   * I_rent = sum(margen_i) / max_margen_3_cultivos_aptos
   */
  function indiceRentabilidad(seq, aptos) {
    let margenTotal = 0;
    for (let i = 0; i < seq.length; i++) {
      margenTotal += (seq[i].margen_usd_ha ?? seq[i].margen_bruto_usd_ha ?? 0);
    }

    let maxMargenZona = 4500;
    if (Array.isArray(aptos) && aptos.length > 0) {
      const ordenados = aptos.slice().sort(
        (a, b) => ((b.margen_usd_ha ?? 0) - (a.margen_usd_ha ?? 0))
      );
      const m1 = ordenados[0] ? (ordenados[0].margen_usd_ha || 1500) : 1500;
      const m2 = ordenados[1] ? (ordenados[1].margen_usd_ha || m1) : m1;
      const m3 = ordenados[2] ? (ordenados[2].margen_usd_ha || m2) : m2;
      maxMargenZona = Math.max(1500, m1 + m2 + m3);
    }

    const familiasUnicas = new Set(seq.map(c => c.familia)).size;
    const bonoDiversificacion = familiasUnicas === 3 ? 0.05 : 0;

    const score = clip((margenTotal / maxMargenZona) + bonoDiversificacion, 0, 1);
    return {
      valor: Number(score.toFixed(4)),
      margenTotalUsdHa: Math.round(margenTotal),
      margenAnualPromedioUsdHa: Math.round(margenTotal / seq.length)
    };
  }

  /**
   * Calcula los pesos normalizados a partir de los sliders del agricultor:
   * sliders = { agua: 1..5, suelo: 1..5, ganar: 1..5 }
   * Regla NASA GPM/IMERG (Sección 7.3):
   * Si la anomalía trimestral de lluvia es < -15%, el peso del agua se multiplica por 1.3
   * antes de normalizar para proteger automáticamente al agricultor ante sequía.
   */
  function calcularPesos(sliders, parcela, escenarioLluviaPct) {
    const sAgua = Math.max(0.5, Number(sliders && sliders.agua !== undefined ? sliders.agua : 3));
    const sSuelo = Math.max(0.5, Number(sliders && sliders.suelo !== undefined ? sliders.suelo : 3));
    const sGanar = Math.max(0.5, Number(sliders && sliders.ganar !== undefined ? sliders.ganar : 3));

    // El slider "Cuidar mi suelo" reparte su peso en Nitrógeno (55%) y Materia Orgánica/Estructura (45%)
    let rawH2O = sAgua;
    const rawN = sSuelo * 0.55;
    const rawMOS = sSuelo * 0.45;
    const rawRent = sGanar;

    const anomaliaGpm = (parcela && parcela.anomalia && typeof parcela.anomalia.pct === 'number')
      ? parcela.anomalia.pct
      : 0;
    const lluviaEscenario = Number(escenarioLluviaPct || 0);
    const sequiaActiva = (anomaliaGpm < -15) || (lluviaEscenario <= -15);

    if (sequiaActiva) {
      rawH2O *= 1.30;
    }

    const suma = rawH2O + rawN + rawMOS + rawRent;
    return {
      w_h2o: Number((rawH2O / suma).toFixed(4)),
      w_n: Number((rawN / suma).toFixed(4)),
      w_mos: Number((rawMOS / suma).toFixed(4)),
      w_rent: Number((rawRent / suma).toFixed(4)),
      ajusteSequiaAplicado: sequiaActiva
    };
  }

  /**
   * Calcula el IRR completo de una secuencia de 3 cultivos
   */
  function calcularIRR(seq, bal, parcela, aptos, sliders, historiaObjs, opciones) {
    const opts = opciones || {};
    const iH2O = indiceAgua(bal);
    const infoN = indiceNitrogeno(seq, historiaObjs);
    const infoMOS = indiceMateriaOrganica(seq, parcela, bal, opts);
    const infoRent = indiceRentabilidad(seq, aptos);
    const pesos = calcularPesos(sliders, parcela, opts.escenarioLluviaPct);

    let irr =
      pesos.w_h2o * iH2O +
      pesos.w_n * infoN.valor +
      pesos.w_mos * infoMOS.valor +
      pesos.w_rent * infoRent.valor;

    if (opts.priorizarForraje && seq.some(c => c.es_forrajero)) {
      irr = clip(irr + 0.03, 0, 1);
    }

    return {
      irr: Number(irr.toFixed(4)),
      irrPct: Math.round(irr * 100),
      subindices: {
        agua: iH2O,
        nitrogeno: infoN.valor,
        materiaOrganica: infoMOS.valor,
        rentabilidad: infoRent.valor
      },
      detalles: {
        nitrogeno: infoN,
        materiaOrganica: infoMOS,
        rentabilidad: infoRent
      },
      pesos
    };
  }

  const API = {
    indiceAgua,
    indiceNitrogeno,
    indiceMateriaOrganica,
    indiceRentabilidad,
    calcularPesos,
    calcularIRR
  };

  if (typeof module !== 'undefined' && module.exports) {
    module.exports = API;
  }
  root.AgronomiaIRR = API;
})(typeof window !== 'undefined' ? window : globalThis);

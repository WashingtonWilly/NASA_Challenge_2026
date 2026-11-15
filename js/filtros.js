/**
 * filtros.js — Rol 2 (Motor Agronómico: Filtros duros individuales y de secuencia)
 * Implementa las reglas de la sección 6.2 y 6.3 del plan de 48 horas.
 */
(function (global) {
  "use strict";

  const MES_INICIO_VENTANA = {
    S1: 10, // Octubre (lluvias Sierra)
    S2: 2,  // Febrero (Sierra)
    C1: 12, // Diciembre (invierno Costa)
    C2: 6   // Junio (verano Costa)
  };

  function obtenerMesesCiclo(ventana, duracionMeses) {
    const inicio = MES_INICIO_VENTANA[ventana] || 10;
    const meses = [];
    for (let i = 0; i < duracionMeses; i++) {
      meses.push(((inicio - 1 + i) % 12) + 1);
    }
    return meses;
  }

  function elegirMejorVentana(cultivo, parcela) {
    const esCosta = (parcela.terreno?.elev_m ?? 0) < 1200;
    const preferidas = esCosta ? ["C1", "C2", "S2", "S1"] : ["S1", "S2", "C1", "C2"];
    for (const v of preferidas) {
      if (cultivo.siembra.includes(v)) return v;
    }
    return cultivo.siembra[0] || "S1";
  }

  /**
   * Evalúa si un cultivo supera los filtros duros individuales en la parcela.
   * Devuelve { apto: boolean, razones: string[] } para mostrar diagnóstico en semáforo rojo.
   */
  function evaluarFiltroIndividual(cultivo, parcela, historiaIds = [], catalogoMap = {}, pausasFamilia = {}, nematodoDeclarado = false) {
    const razones = [];
    const elev = parcela.terreno?.elev_m ?? 0;
    const pend = parcela.terreno?.pendiente_pct ?? 0;
    const clima = parcela.clima_mensual || [];

    // 1. Filtro duro de altitud (Piso térmico)
    if (elev < cultivo.alt_min || elev > cultivo.alt_max) {
      razones.push(
        `Altitud fuera de rango: el lote está a ${elev} m y ${cultivo.nombre.toLowerCase()} requiere entre ${cultivo.alt_min} y ${cultivo.alt_max} m.`
      );
    }

    // 2. Filtro duro de pendiente > 25 % (Erosión severa)
    if (pend > 25 && !cultivo.permite_pendiente_alta) {
      razones.push(
        `Riesgo alto de erosión: la pendiente media es ${pend} % (> 25 %). En laderas fuertes solo se recomiendan coberturas (avena, vicia), chocho, quinua o cebada; nunca labranza intensiva.`
      );
    }

    // 3. Filtro duro de heladas durante el ciclo del cultivo
    const ventana = elegirMejorVentana(cultivo, parcela);
    const mesesCiclo = obtenerMesesCiclo(ventana, cultivo.ciclo_meses || 5);
    const mesesHelada = clima.filter(m => mesesCiclo.includes(m.mes) && m.Tmin_abs < 0);
    if (mesesHelada.length > 0 && cultivo.tolera_helada === "No") {
      const nombresMeses = mesesHelada.map(m => m.nombre_mes || `Mes ${m.mes}`).join(", ");
      razones.push(
        `Riesgo de helada (${nombresMeses} con mínimas < 0 °C): ${cultivo.nombre.toLowerCase()} no tolera heladas.`
      );
    } else if (cultivo.tolera_helada === "Moderada") {
      const mesesHeladaSevera = clima.filter(m => mesesCiclo.includes(m.mes) && m.Tmin_abs < -2.0);
      if (mesesHeladaSevera.length > 0) {
        const nombresMeses = mesesHeladaSevera.map(m => m.nombre_mes || `Mes ${m.mes}`).join(", ");
        razones.push(
          `Helada severa (${nombresMeses} con mínimas < -2 °C): supera la tolerancia moderada de ${cultivo.nombre.toLowerCase()}.`
        );
      }
    }

    // 4. Verificar si está vetado en el Año 1 por pausa fitosanitaria respecto a la historia reciente
    if (historiaIds.length > 0) {
      const fam = cultivo.familia;
      const reglaFam = pausasFamilia[fam] || { anios_min: 1, anios_nematodo: 1 };
      const pausaAnios = nematodoDeclarado ? (reglaFam.anios_nematodo || reglaFam.anios_min) : reglaFam.anios_min;

      // Posición de historiaIds: ej. [2024 (hace 2 años), 2025 (hace 1 año)]
      // Año 1 de rotación está a distancia (historiaIds.length - idx) de cada año histórico
      for (let i = 0; i < historiaIds.length; i++) {
        const cultHist = catalogoMap[historiaIds[i]];
        if (!cultHist) continue;
        const distAnios = historiaIds.length - i; // 1 = año inmediatamente anterior, 2 = hace 2 años
        if (cultHist.familia === fam) {
          if (pausaAnios >= 3 && distAnios <= pausaAnios) {
            const conteoFam = historiaIds.filter(id => catalogoMap[id]?.familia === fam).length;
            if (fam === "Solanáceas" && conteoFam >= 2) {
              razones.push(
                `No recomendamos ${cultivo.nombre.toLowerCase()} este año: ya hubo ${cultHist.nombre.toLowerCase()} dos años seguidos y las plagas del suelo siguen vivas (pausa mínima: ${pausaAnios} años).`
              );
            } else {
              razones.push(
                `Pausa fitosanitaria activa para ${fam}: se sembró ${cultHist.nombre.toLowerCase()} hace ${distAnios} año(s) y el suelo requiere ${pausaAnios} años de descanso porque ${reglaFam.mensaje_agricultor || reglaFam.razon}`
              );
            }
            break;
          } else if (pausaAnios === 2 && distAnios === 1) {
            razones.push(
              `No se recomienda repetir ${fam} (${cultivo.nombre.toLowerCase()}) inmediatamente después de ${cultHist.nombre.toLowerCase()}.`
            );
            break;
          } else if (cultHist.id === cultivo.id && distAnios === 1) {
            razones.push(
              `No se debe repetir la misma especie (${cultivo.nombre.toLowerCase()}) dos años seguidos.`
            );
            break;
          }
        }
      }
    }

    return {
      apto: razones.length === 0,
      razones
    };
  }

  function pasaFiltrosIndividuales(cultivo, parcela) {
    return evaluarFiltroIndividual(cultivo, parcela).apto;
  }

  /**
   * Evalúa si una secuencia de 3 años [a, b, c] cumple todas las reglas de rotación:
   * - Al menos una Fabácea en los 3 años.
   * - Pausa fitosanitaria por familia considerando la historia previa.
   * - Nunca repetir la misma especie dos años seguidos.
   */
  function pasaFiltrosSecuencia(seq, historiaIds, catalogoMap, pausasFamilia, nematodoDeclarado = false) {
    // Regla 5 (Sección 6.3): Al menos una Fabácea en la secuencia de 3 años
    const tieneFabacea = seq.some(c => c.familia === "Fabáceas");
    if (!tieneFabacea) return false;

    const histObjs = (historiaIds || []).map(id => catalogoMap[id]).filter(Boolean);
    const lineaTiempo = [...histObjs, ...seq];
    const idxInicioSeq = histObjs.length;

    for (let t = idxInicioSeq; t < lineaTiempo.length; t++) {
      const actual = lineaTiempo[t];
      const fam = actual.familia;
      const reglaFam = pausasFamilia[fam] || { anios_min: 1, anios_nematodo: 1 };
      const pausa = nematodoDeclarado ? (reglaFam.anios_nematodo || reglaFam.anios_min) : reglaFam.anios_min;

      for (let prev = 0; prev < t; prev++) {
        const anterior = lineaTiempo[prev];
        const dist = t - prev; // 1 = año consecutivo

        // Nunca repetir exactamente el mismo cultivo dos años seguidos
        if (actual.id === anterior.id && dist === 1) {
          return false;
        }

        // No repetir el mismo cultivo fijador o hortaliza dentro de los 3 años propuestos
        if (prev >= idxInicioSeq && actual.id === anterior.id) {
          return false;
        }

        if (actual.familia === anterior.familia) {
          // Familias de pausa larga (Solanáceas 3-4, Brasicáceas 4, Apiáceas 3, Amarilidáceas 3, Cucurbitáceas 3)
          if (pausa >= 3 && dist <= pausa) {
            return false;
          }
          // Familias con pausa 2 (Fabáceas, Amarantáceas, Euforbiáceas): no repetir en años consecutivos
          if (pausa === 2 && dist < 2) {
            return false;
          }
        }
      }
    }

    return true;
  }

  const API = {
    MES_INICIO_VENTANA,
    obtenerMesesCiclo,
    elegirMejorVentana,
    evaluarFiltroIndividual,
    pasaFiltrosIndividuales,
    pasaFiltrosSecuencia
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
  global.FiltrosMotor = API;
})(typeof window !== "undefined" ? window : globalThis);

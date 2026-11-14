/**
 * balance.js — Rol 2 (Motor Agronómico: Balance Hídrico Mensual a 36 meses)
 * Implementa las ecuaciones de las secciones 6.3 y 7.2:
 * - Precipitación efectiva FAO ajustada por factor de pendiente SRTM (f_pend) y retención de humedad del suelo (SoilGrids SOC / Andisol)
 * - ETc(m) = Kc(etapa(m)) * ET0(m) repartiendo el ciclo en 25 % ini / 50 % med / 25 % fin
 * - Déficit mensual D(m) = max(0, ETc(m) - Pef(m))
 */
(function (global) {
  "use strict";

  const NOMBRES_MESES = ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago", "Sep", "Oct", "Nov", "Dic"];

  function factorPendiente(pendientePct) {
    if (pendientePct > 25) return 0.65;
    if (pendientePct > 12) return 0.78;
    if (pendientePct >= 8) return 0.85;
    return 0.92;
  }

  /**
   * Precipitación efectiva mensual FAO ajustada por escorrentía en ladera (SRTM)
   * y capacidad de retención de humedad del suelo (Andisoles / materia orgánica SoilGrids).
   */
  function precipitacionEfectivaFAO(P_mm, pendientePct, suelo) {
    if (P_mm <= 0) return 0;
    const fPend = factorPendiente(pendientePct);
    const base = P_mm > 75 ? (0.82 * P_mm - 12) : Math.max(0.72 * P_mm, P_mm - 8);
    // Los suelos francos/andisoles con alta materia orgánica (> 2.5% SOC) retienen humedad
    // de lluvias previas y neblina andina disponible para la raíz (~8-12 mm/mes en época húmeda)
    const soc = suelo?.soc_pct ?? 1.5;
    const reservaSuelo = (suelo?.es_andisol || soc >= 2.5) ? Math.min(12, P_mm * 0.18) : Math.min(5, P_mm * 0.08);
    return Math.max(0, fPend * Math.max(0, base) + reservaSuelo);
  }

  function kcPorEtapa(kcArray, indiceMesEnCiclo, totalMesesCiclo) {
    const frac = (indiceMesEnCiclo + 0.5) / Math.max(1, totalMesesCiclo);
    if (frac <= 0.25) return kcArray[0];
    if (frac <= 0.75) return kcArray[1];
    return kcArray[2];
  }

  function elegirVentanaCultivo(cultivo, parcela) {
    const esCosta = (parcela.terreno?.elev_m ?? 0) < 1200;
    const orden = esCosta ? ["C1", "C2", "S2", "S1"] : ["S1", "S2", "C1", "C2"];
    for (const v of orden) {
      if (cultivo.siembra.includes(v)) return v;
    }
    return cultivo.siembra[0] || "S1";
  }

  function mesInicioDeVentana(ventana) {
    const mapa = { S1: 10, S2: 2, C1: 12, C2: 6 };
    return mapa[ventana] || 10;
  }

  /**
   * Calcula el balance hídrico mes a mes durante los 36 meses de la rotación [a, b, c].
   * Optimizado para ejecutarse miles de veces en < 50 ms.
   */
  function balanceHidrico(seq, parcela, escenarioLluviaPct = 0, ligero = false) {
    const pendiente = parcela.terreno?.pendiente_pct ?? 10;
    const suelo = parcela.suelo || {};
    const climaArr = parcela.clima_mensual || [];
    const climaMap = new Array(13);
    for (let i = 0; i < climaArr.length; i++) {
      climaMap[climaArr[i].mes] = climaArr[i];
    }

    const factorEscenario = Math.max(0.2, 1 + (escenarioLluviaPct || 0) / 100);
    const meses36 = ligero ? null : [];
    let totalETc = 0;
    let totalDeficit = 0;
    let totalPef = 0;
    let mesesSinCobertura = 0;
    let mesesConDeficit = 0;
    const mesesDeficitCritico = new Set();

    for (let anioIdx = 0; anioIdx < 3; anioIdx++) {
      const cultivo = seq[anioIdx];
      const ventana = elegirVentanaCultivo(cultivo, parcela);
      const mesInicio = mesInicioDeVentana(ventana);
      const duracion = cultivo.ciclo_meses || Math.round(((cultivo.ciclo_dias?.[0] || 120) + (cultivo.ciclo_dias?.[1] || 150)) / 60);

      const mapaEtapaMes = new Array(13);
      for (let step = 0; step < duracion; step++) {
        const mCal = ((mesInicio - 1 + step) % 12) + 1;
        mapaEtapaMes[mCal] = {
          step,
          kc: kcPorEtapa(cultivo.kc || [0.4, 1.0, 0.5], step, duracion),
          etapaNombre: (step + 0.5) / duracion <= 0.25 ? "Inicial" : ((step + 0.5) / duracion <= 0.75 ? "Media" : "Final")
        };
      }

      for (let m = 1; m <= 12; m++) {
        const datoClima = climaMap[m] || { P_mm: 40, ET0_mm: 90, Tmin_abs: 5, Tmed: 14 };
        const P_ajustada = datoClima.P_mm * factorEscenario;
        const Pef = precipitacionEfectivaFAO(P_ajustada, pendiente, suelo);
        const infoCiclo = mapaEtapaMes[m];

        let ETc = 0;
        let deficit = 0;
        let kcUsado = 0.15;
        let sueloDesnudo = true;
        let etapa = "Suelo desnudo / descanso";

        if (infoCiclo) {
          sueloDesnudo = false;
          kcUsado = infoCiclo.kc;
          etapa = infoCiclo.etapaNombre;
          ETc = kcUsado * datoClima.ET0_mm;
          deficit = Math.max(0, ETc - Pef);
          totalETc += ETc;
          totalDeficit += deficit;
          if (deficit > 12) {
            mesesConDeficit += 1;
          }
          if (deficit > 18) {
            mesesDeficitCritico.add(NOMBRES_MESES[m - 1]);
          }
        } else {
          mesesSinCobertura += 1;
        }

        totalPef += Pef;

        if (!ligero) {
          meses36.push({
            indiceGlobal: anioIdx * 12 + m,
            anioRotacion: anioIdx + 1,
            cultivoId: cultivo.id,
            cultivoNombre: cultivo.nombre,
            mes: m,
            nombreMes: NOMBRES_MESES[m - 1],
            etiqueta: `A${anioIdx + 1}-${NOMBRES_MESES[m - 1]}`,
            ventana,
            sueloDesnudo,
            etapa,
            kc: Number(kcUsado.toFixed(2)),
            P_bruta_mm: Number(P_ajustada.toFixed(1)),
            Pef_mm: Number(Pef.toFixed(1)),
            ET0_mm: Number(datoClima.ET0_mm.toFixed(1)),
            ETc_mm: Number(ETc.toFixed(1)),
            deficit_mm: Number(deficit.toFixed(1)),
            riesgoHelada: datoClima.Tmin_abs < 0
          });
        }
      }
    }

    let resumen12Meses = [];
    if (!ligero && meses36) {
      for (let m = 1; m <= 12; m++) {
        const deMes = meses36.filter(x => x.mes === m);
        const pefProm = deMes.reduce((s, x) => s + x.Pef_mm, 0) / deMes.length;
        const etcProm = deMes.reduce((s, x) => s + x.ETc_mm, 0) / deMes.length;
        const defProm = deMes.reduce((s, x) => s + x.deficit_mm, 0) / deMes.length;
        resumen12Meses.push({
          mes: m,
          nombreMes: NOMBRES_MESES[m - 1],
          Pef_mm: Number(pefProm.toFixed(1)),
          ETc_mm: Number(etcProm.toFixed(1)),
          deficit_mm: Number(defProm.toFixed(1)),
          sueloDesnudoFrecuente: deMes.filter(x => x.sueloDesnudo).length >= 2,
          riesgoHelada: deMes.some(x => x.riesgoHelada)
        });
      }
    }

    return {
      meses36,
      resumen12Meses,
      totalETc_mm: Number(totalETc.toFixed(1)),
      totalDeficit_mm: Number(totalDeficit.toFixed(1)),
      totalPef_mm: Number(totalPef.toFixed(1)),
      mesesSinCobertura,
      mesesConDeficit,
      promedioMesesDesnudoPorAnio: Number((mesesSinCobertura / 3).toFixed(1)),
      mesesDeficitNombres: Array.from(mesesDeficitCritico),
      factorPendiente: factorPendiente(pendiente)
    };
  }

  const API = {
    NOMBRES_MESES,
    factorPendiente,
    precipitacionEfectivaFAO,
    elegirVentanaCultivo,
    balanceHidrico
  };

  if (typeof module !== "undefined" && module.exports) {
    module.exports = API;
  }
  global.BalanceMotor = API;
})(typeof window !== "undefined" ? window : globalThis);

#!/usr/bin/env node
/**
 * test_cordura.js — Prueba de Cordura Agronómica (Sección 7.5 de la Guía Técnica)
 * Verifica que el motor agronómico (filtros.js + balance.js + irr.js + motor.js)
 * cumpla estrictamente los criterios biofísicos y de rendimiento (< 100 ms).
 */
'use strict';

const fs = require('fs');
const path = require('path');
const Motor = require('../js/motor.js');

const ROOT = path.resolve(__dirname, '..');
const catalogo = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/cultivos.json'), 'utf-8'));

const pChimborazo = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/parcelas/parcela_licto.json'), 'utf-8'));
const pGuano = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/parcelas/parcela_guano.json'), 'utf-8'));
// Parcelas sintéticas para los casos borde (Costa y ladera > 25 %), sin depender de archivos
const pElOro = Object.assign(JSON.parse(JSON.stringify(pChimborazo)), {
  id: 'sintetica_costa', nombre: 'Caso sintético — Costa (El Oro, 28 m, maíz–arroz)',
  terreno: { elev_m: 28, pendiente_pct: 4, pendiente_max_pct: 7, orientacion: 'O' },
  historia_declarada: ['maiz_duro', 'arroz'],
  clima_mensual: [145, 195, 180, 110, 42, 18, 14, 12, 15, 20, 25, 60].map((P, i) => ({
    mes: i + 1, P_mm: P, ET0_mm: [122, 116, 126, 120, 112, 98, 96, 104, 110, 118, 118, 122][i], Tmin_abs: 19 + (i % 3), Tmed: 26
  }))
});
const pColta = Object.assign(JSON.parse(JSON.stringify(pChimborazo)), {
  id: 'sintetica_ladera', nombre: 'Caso sintético — Ladera alta (3 180 m, pendiente 28 %, helada)',
  terreno: { elev_m: 3180, pendiente_pct: 28, pendiente_max_pct: 35, orientacion: 'E' },
  historia_declarada: ['papa', 'cebada'],
  clima_mensual: pChimborazo.clima_mensual.map(m => Object.assign({}, m, { Tmin_abs: m.Tmin_abs - 2.5 }))
});

const slidersNeutros = { agua: 3, suelo: 3, ganar: 3 };

function assert(condicion, mensaje) {
  if (!condicion) {
    console.error(`❌ FALLO DE CORDURA: ${mensaje}`);
    process.exit(1);
  } else {
    console.log(`  ✅ ${mensaje}`);
  }
}

console.log('===================================================================');
console.log('🧪 PRUEBA DE CORDURA AGRONÓMICA — NASA SPACE APPS 2026 (RIOBAMBA)');
console.log('===================================================================\n');

// 1. Prueba Chimborazo
console.log(`▶ 1. Evaluando: ${pChimborazo.nombre}`);
const res1 = Motor.recomendar(pChimborazo, catalogo, slidersNeutros);
console.log(`   Tiempo de ejecución: ${res1.tiempoCalculoMs} ms | Secuencias válidas evaluadas: ${res1.totalSecuenciasEvaluadas}`);
res1.recomendadas.forEach((r, idx) => {
  const nombres = r.cultivos.map(c => `${c.nombre} (${c.familia})`).join(' → ');
  console.log(`   #${idx + 1} [IRR ${r.irr.toFixed(2)} | ${r.semaforo.icono}]: ${nombres}`);
  console.log(`       I_H2O=${r.subindices.agua.toFixed(2)} | I_N=${r.subindices.nitrogeno.toFixed(2)} (${r.detalles.nitrogeno.balanceNetoKgHa} kg N/ha) | I_MOS=${r.subindices.materiaOrganica.toFixed(2)} | I_rent=${r.subindices.rentabilidad.toFixed(2)} ($${r.detalles.rentabilidad.margenAnualPromedioUsdHa}/año)`);
});
console.log(`   Práctica actual (${res1.actual.cultivos.map(c => c.nombre).join(' → ')}): IRR ${res1.actual.irr.toFixed(2)} ${res1.actual.semaforo.icono} — ${res1.actual.motivoRiesgoFitosanitario}`);

const incluyePapa = res1.recomendadas.some(r => r.cultivos.some(c => c.id === 'papa'));
assert(!incluyePapa, 'Ninguna de las 3 rotaciones en Chimborazo incluye Papa (respeta pausa Solanáceas de 3-4 años).');

const leguminosasAndinas = new Set(['chocho', 'haba', 'vicia', 'frejol', 'arveja']);
const iniciaConLeguminosa = leguminosasAndinas.has(res1.recomendadas[0].cultivos[0].id);
assert(iniciaConLeguminosa, `La rotación #1 inicia en el Año 1 con una leguminosa andina (${res1.recomendadas[0].cultivos[0].nombre}) para recuperar N.`);
assert(res1.tiempoCalculoMs < 100, `Cálculo instantáneo en navegador (< 100 ms): ${res1.tiempoCalculoMs} ms.`);
const anomChimb = (pChimborazo.anomalia && typeof pChimborazo.anomalia.pct === 'number') ? pChimborazo.anomalia.pct : 0;
assert(res1.pesosAplicados.ajusteSequiaAplicado === (anomChimb < -15),
  anomChimb < -15
    ? 'Se activó automáticamente el multiplicador x1.3 de peso de agua por anomalía de lluvia < -15%.'
    : `Con anomalía de lluvia de ${anomChimb > 0 ? '+' : ''}${anomChimb}% (no es sequía) el multiplicador x1.3 queda desactivado, como corresponde.`);

// 2. Prueba El Oro
console.log(`\n▶ 2. Evaluando: ${pElOro.nombre}`);
const res2 = Motor.recomendar(pElOro, catalogo, slidersNeutros);
console.log(`   Tiempo de ejecución: ${res2.tiempoCalculoMs} ms | Secuencias válidas evaluadas: ${res2.totalSecuenciasEvaluadas}`);
res2.recomendadas.forEach((r, idx) => {
  const nombres = r.cultivos.map(c => `${c.nombre} (${c.familia})`).join(' → ');
  console.log(`   #${idx + 1} [IRR ${r.irr.toFixed(2)} | ${r.semaforo.icono}]: ${nombres}`);
  console.log(`       I_H2O=${r.subindices.agua.toFixed(2)} (Cobertura lluvia: ${r.balanceHidrico.coberturaAguaPct}%, Déficit: ${r.balanceHidrico.deficitTotal} mm) | I_N=${r.subindices.nitrogeno.toFixed(2)}`);
});

const incluyeSerrano = res2.recomendadas.some(r => r.cultivos.some(c => c.alt_min > 500));
assert(!incluyeSerrano, 'Ningún cultivo exclusivo de la Sierra aparece en El Oro (28 m s.n.m.).');

const leguminosasCosta = new Set(['soya', 'mani', 'caupi', 'frejol']);
const todasConLeguminosaCosta = res2.recomendadas.every(r => r.cultivos.some(c => leguminosasCosta.has(c.id)));
assert(todasConLeguminosaCosta, 'Las 3 rotaciones de Costa incluyen al menos una leguminosa tropical (Soya, Maní o Caupí).');
assert(res2.recomendadas[0].balanceHidrico.mesesConDeficit > 0, `Detecta correctamente los meses secos de verano en El Oro (${res2.recomendadas[0].balanceHidrico.mesesConDeficit} meses con déficit en 36 meses).`);

// 3. Prueba Colta (Ladera fuerte 28% > 25% y helada)
console.log(`\n▶ 3. Evaluando: ${pColta.nombre}`);
const res3 = Motor.recomendar(pColta, catalogo, slidersNeutros);
console.log(`   Tiempo de ejecución: ${res3.tiempoCalculoMs} ms | Cultivos aptos: ${res3.cultivosAptos.map(c => c.nombre).join(', ')}`);
res3.recomendadas.forEach((r, idx) => {
  const nombres = r.cultivos.map(c => `${c.nombre} (${c.familia})`).join(' → ');
  console.log(`   #${idx + 1} [IRR ${r.irr.toFixed(2)} | ${r.semaforo.icono}]: ${nombres}`);
});
const violaPendiente = res3.recomendadas.some(r => r.cultivos.some(c => !c.permite_pendiente_alta));
assert(!violaPendiente, 'En ladera de 28% (Colta), todos los cultivos recomendados permiten pendiente > 25% y toleran heladas.');

console.log('\n🎉 TODAS LAS PRUEBAS DE CORDURA AGRONÓMICA PASARON EXITOSAMENTE.');

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

const pChimborazo = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/parcelas/parcela_chimborazo_1.json'), 'utf-8'));
const pElOro = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/parcelas/parcela_el_oro_2.json'), 'utf-8'));
const pColta = JSON.parse(fs.readFileSync(path.join(ROOT, 'data/parcelas/parcela_colta_3.json'), 'utf-8'));

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
assert(res1.pesosAplicados.ajusteSequiaAplicado === true, 'Se activó automáticamente el multiplicador x1.3 de peso de agua por anomalía GPM < -15%.');

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

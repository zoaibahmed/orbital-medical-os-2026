/**
 * ============================================================================
 * NASA SPACE APPS CHALLENGE - 3D HOLOGRAPHIC MEDICAL BAY
 * BACKEND VERIFICATION & TEST SUITE
 * AUTHOR: Saad (Backend, State Management & Data Integration Engineer)
 * ============================================================================
 *
 * Run with: node test-simulation.js
 */

import { vitalsSimulator, SIMULATION_MODES } from '../services/vitalsSimulator.js';
import { radiationCalculator } from '../services/radiationCalculator.js';
import { MusculoskeletalCalculator, SANSCalculator, SleepTracker } from '../services/healthCalculators.js';
import { AIDiagnosticsEngine } from '../services/aiDiagnosticsEngine.js';
import { storageService } from '../services/storageService.js';

console.log('\n================================================================');
console.log('🧪 RUNNING NASA MEDICAL BAY BACKEND TEST SUITE (SAAD)');
console.log('================================================================\n');

let passCount = 0;
let failCount = 0;

function assert(description, condition) {
  if (condition) {
    console.log(`  ✅ PASS: ${description}`);
    passCount++;
  } else {
    console.error(`  ❌ FAIL: ${description}`);
    failCount++;
  }
}

// -------------------------------------------------------------
// TEST 1: Vitals Simulator (Fluctuations & Hypoxia Detection)
// -------------------------------------------------------------
console.log('--- TEST 1: Crew Biometrics & Vitals Simulation ---');
vitalsSimulator.setMode(SIMULATION_MODES.NOMINAL);
const nominalVitals = vitalsSimulator.step();
assert('Nominal Heart Rate is within microgravity bounds (55-90 bpm)', nominalVitals.heartRate >= 55 && nominalVitals.heartRate <= 90);
assert('Nominal SpO2 is healthy (>95%)', nominalVitals.spo2 >= 95);

// Test Hypoxia Trigger
vitalsSimulator.setMode(SIMULATION_MODES.HYPOXIA_EVENT);
for (let i = 0; i < 5; i++) vitalsSimulator.step();
const hypoxiaVitals = vitalsSimulator.getSnapshot();
assert('Hypoxia mode drops SpO2 below 94%', hypoxiaVitals.spo2 < 94);
assert('Hypoxia triggers WARNING or CRITICAL status', hypoxiaVitals.status === 'WARNING' || hypoxiaVitals.status === 'CRITICAL');
assert('Hypoxia alert message generated', hypoxiaVitals.activeAlerts.length > 0);

// Reset simulator
vitalsSimulator.setMode(SIMULATION_MODES.NOMINAL);

// -------------------------------------------------------------
// TEST 2: Space Radiation & CANS Dosimetry
// -------------------------------------------------------------
console.log('\n--- TEST 2: Space Radiation & CANS Spectrometer ---');
const nominalRad = radiationCalculator.sampleSensor(false);
assert('Baseline GCR dose rate calculated', nominalRad.gcrDoseRate > 0);
assert('CANS neutron dose rate captured', nominalRad.cansNeutronDoseRate > 0);
assert('Cumulative dose tracked', nominalRad.cumulativeDoseMsv > 0);
assert('NASA Career limit % calculated', nominalRad.careerLimitPercentage >= 0 && nominalRad.careerLimitPercentage <= 100);

// Test Solar Flare Spike
const stormRad = radiationCalculator.sampleSensor(true);
assert('Solar Particle Event (SPE) triggers CRITICAL_SPE alert', stormRad.alertLevel === 'CRITICAL_SPE');
assert('Storm shelter recommended during CME flare', stormRad.stormShelterRecommended === true);

// -------------------------------------------------------------
// TEST 3: Musculoskeletal & Exercise Countermeasure
// -------------------------------------------------------------
console.log('\n--- TEST 3: Musculoskeletal & SANS Assessment ---');
const zeroExerciseAssessment = MusculoskeletalCalculator.assessLoss(90, []);
assert('Unmitigated 90-day microgravity causes bone loss', zeroExerciseAssessment.netBoneLossPct > 3.0);

const goodExerciseAssessment = MusculoskeletalCalculator.assessLoss(90, [
  { type: 'ARED', durationMin: 60, intensityPercent: 90 },
  { type: 'T2_TREADMILL', durationMin: 60, intensityPercent: 85 }
]);
assert('Exercise countermeasures mitigate bone & muscle loss', goodExerciseAssessment.netBoneLossPct < zeroExerciseAssessment.netBoneLossPct);

// SANS Assessment
const sansAssessment = SANSCalculator.evaluate({
  frisenGrade: 2,
  blurredNearVision: true,
  globeFlatteningPresent: true,
  cottonWoolSpots: true,
  choroidalFolds: true,
  headacheSeverity: 6
});
assert('SANS evaluation detects elevated optic edema', sansAssessment.sansScore >= 5);
assert('SANS prescribes LBNP (Lower Body Negative Pressure) countermeasure', sansAssessment.actionProtocol.includes('LBNP'));

// Sleep Score
const sleepAssessment = SleepTracker.calculateSleepScore({
  hoursSlept: 4.5,
  awakeningsCount: 5,
  remFractionPct: 10,
  lightExposureSync: false
});
assert('Poor sleep detects circadian desynchrony & sleep debt', sleepAssessment.sleepScore < 60);

// -------------------------------------------------------------
// TEST 4: AI Diagnostics & 1-Click Emergency Override
// -------------------------------------------------------------
console.log('\n--- TEST 4: AI Diagnostics & Emergency Protocols ---');
const aiDiag = AIDiagnosticsEngine.runDiagnosticScan({
  vitals: hypoxiaVitals,
  radiation: stormRad,
  sans: sansAssessment,
  sleep: sleepAssessment,
  mood: { moodScore: 4, stressScore: 9 }
});
assert('AI Diagnostics detects CRITICAL threat when hypoxia + storm active', aiDiag.threatLevel === 'CRITICAL');
assert('AI Diagnostics produces actionable clinical findings', aiDiag.findings.length >= 3);

// Emergency Override Protocol
const depressProtocol = AIDiagnosticsEngine.getEmergencyOverrideProtocol('RAPID_DEPRESS');
assert('Rapid Depressurization protocol contains triage steps', depressProtocol.triageSteps.length >= 4);

// -------------------------------------------------------------
// TEST 5: Storage & Mock Database Layer
// -------------------------------------------------------------
console.log('\n--- TEST 5: Storage & Persistence Layer ---');
const savedMood = storageService.saveMoodLog({ moodScore: 8, stressScore: 4, notes: 'Day 85 flight nominal' });
assert('Mood check-in successfully saved with unique ID', savedMood.id.startsWith('MOOD_'));

const savedWorkout = storageService.saveExerciseLog({ type: 'ARED', durationMin: 50, intensityPercent: 85 });
assert('Exercise log successfully stored', savedWorkout.id.startsWith('EX_'));

console.log('\n================================================================');
console.log(`🏁 TEST RESULTS: ${passCount} PASSED | ${failCount} FAILED`);
console.log('================================================================\n');

if (failCount === 0) {
  console.log('🎉 ALL BACKEND SYSTEMS NOMINAL! Ready for integration with Zohaib, Faiz, and Minal.\n');
} else {
  process.exit(1);
}

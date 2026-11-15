/**
 * ============================================================================
 * NASA SPACE APPS CHALLENGE - 3D HOLOGRAPHIC MEDICAL BAY
 * MODULE: AI Diagnostics & Emergency Override Protocol Engine
 * AUTHOR: Saad (Backend, State Management & Data Integration Engineer)
 * ============================================================================
 *
 * DESCRIPTION:
 * Rule-based Intelligent Clinical Decision Support System (CDSS) tailored
 * specifically for deep space missions (e.g. Artemis Moon or Mars Transit)
 * where Earth-ground communication has a 4 to 22-minute latency delay!
 *
 * FUNCTIONS:
 * 1. AI Health Diagnostic evaluation across all 5 NASA Hazards:
 *    - Hazard 1: Space Radiation (SPE / GCR)
 *    - Hazard 2: Isolation & Confinement (Behavioral & Sleep)
 *    - Hazard 3: Distance from Earth (Autonomous decision support)
 *    - Hazard 4: Gravity Fields (Microgravity deconditioning / SANS)
 *    - Hazard 5: Hostile Closed Environments (Toxic gas, hypoxia, depressurization)
 * 2. 1-Click Emergency Override Protocol:
 *    - Generates step-by-step triage checklists for the crew
 *    - Triggers emergency broadcast state for Zohaib's 3D lights (Red strobe)
 *      and Faiz's HUD alarm banners.
 */

export class AIDiagnosticsEngine {
  /**
   * Run full autonomous multi-system diagnostic scan
   * @param {Object} input
   * - vitals: current vitals snapshot { heartRate, spo2, bloodPressure, hrv, status }
   * - radiation: telemetry snapshot { speDoseRate, cumulativeDoseMsv, alertLevel }
   * - sans: SANS evaluation snapshot { sansScore, riskLevel }
   * - sleep: sleep evaluation snapshot { sleepScore, status }
   * - mood: { moodScore: 1-10, stressScore: 1-10 }
   */
  static runDiagnosticScan({ vitals, radiation, sans, mood }) {
    const findings = [];
    let overallThreatLevel = 'NOMINAL'; // 'NOMINAL' | 'ELEVATED' | 'CRITICAL'
    let requiresImmediateIntervention = false;

    // --- CHECK 1: OXYGEN & LIFE SUPPORT (Hypoxia / Suffocation) ---
    if (vitals && vitals.spo2 < 90) {
      overallThreatLevel = 'CRITICAL';
      requiresImmediateIntervention = true;
      findings.push({
        system: 'RESPIRATORY & LIFE SUPPORT',
        severity: 'CRITICAL',
        code: 'ACUTE_HYPOXIA_CRISIS',
        observation: `SpO2 at dangerously low ${vitals.spo2}%. Risk of cognitive impairment in <60 seconds.`,
        action: '1. Don emergency quick-don oxygen mask immediately.\n2. Verify habitat atmospheric partial pressure of O2.\n3. Administer high-flow 100% O2.'
      });
    } else if (vitals && vitals.spo2 < 94) {
      if (overallThreatLevel !== 'CRITICAL') overallThreatLevel = 'ELEVATED';
      findings.push({
        system: 'RESPIRATORY',
        severity: 'WARNING',
        code: 'MILD_HYPOXIA',
        observation: `SpO2 degraded to ${vitals.spo2}%. Possible cabin scrubbers saturation.`,
        action: 'Check CO2 scrubber canister status and increase air circulation.'
      });
    }

    // --- CHECK 2: CARDIAC & AUTONOMIC STRESS ---
    if (vitals && vitals.heartRate > 130) {
      overallThreatLevel = 'CRITICAL';
      findings.push({
        system: 'CARDIOVASCULAR',
        severity: 'CRITICAL',
        code: 'TACHYARRHYTHMIA',
        observation: `Heart rate spiked to ${vitals.heartRate} BPM under resting conditions.`,
        action: 'Perform 12-lead ECG, initiate vagal maneuver, prepare anti-arrhythmic meds if sustained.'
      });
    } else if (vitals && vitals.hrv < 25) {
      if (overallThreatLevel === 'NOMINAL') overallThreatLevel = 'ELEVATED';
      findings.push({
        system: 'AUTONOMIC NERVOUS SYSTEM',
        severity: 'WARNING',
        code: 'SEVERE_AUTONOMIC_FATIGUE',
        observation: `Heart Rate Variability at ${vitals.hrv} ms indicates high sympathetic overdrive and exhaustion.`,
        action: 'Mandate 4 hours of off-duty rest. Delay non-critical EVA tasks.'
      });
    }

    // --- CHECK 3: SOLAR RADIATION & CANS TELEMETRY ---
    if (radiation && (radiation.alertLevel === 'CRITICAL_SPE' || radiation.speDoseRate > 1.0)) {
      overallThreatLevel = 'CRITICAL';
      requiresImmediateIntervention = true;
      findings.push({
        system: 'SPACE RADIATION DOSIMETRY',
        severity: 'CRITICAL',
        code: 'SOLAR_PARTICLE_EVENT_BURST',
        observation: `Solar Particle Event detected! Dose rate surged to ${radiation.speDoseRate} mSv/hr.`,
        action: 'Sound cabin solar storm siren. All crew retreat to radiation-shielded water/polyethylene Storm Bunker.'
      });
    }

    // --- CHECK 4: SANS (NEURO-OCULAR FLUID SHIFT) ---
    if (sans && sans.riskLevel === 'HIGH') {
      if (overallThreatLevel === 'NOMINAL') overallThreatLevel = 'ELEVATED';
      findings.push({
        system: 'OPHTHALMIC & NEUROLOGICAL',
        severity: 'ELEVATED',
        code: 'SANS_PROGRESSION_STAGE_2',
        observation: `High SANS risk score (${sans.sansScore}/16). Microgravity optic disc edema worsening.`,
        action: 'Initiate daily 50 mmHg Lower Body Negative Pressure (LBNP) protocol and schedule fundoscopic scan.'
      });
    }

    // --- CHECK 5: PSYCHOLOGICAL & ISOLATION STRESS ---
    if (mood && mood.stressScore >= 8) {
      if (overallThreatLevel === 'NOMINAL') overallThreatLevel = 'ELEVATED';
      findings.push({
        system: 'BEHAVIORAL & PSYCHOLOGICAL',
        severity: 'WARNING',
        code: 'ACUTE_ISOLATION_CONFINEMENT_STRESS',
        observation: `Astronaut reports stress level ${mood.stressScore}/10 and prolonged mission isolation fatigue.`,
        action: 'Trigger relaxation audio protocol, schedule Earth family asynchronous video comms, reduce workload.'
      });
    }

    // Compile high-level diagnostic summary
    let summaryText = 'All astronaut physiological telemetry within safe mission boundaries.';
    if (overallThreatLevel === 'CRITICAL') {
      summaryText = 'CRITICAL ALERT: Multi-system hazard detected! Immediate medical countermeasure execution required.';
    } else if (overallThreatLevel === 'ELEVATED') {
      summaryText = 'CAUTION: Sub-nominal biological parameters observed. Preventive countermeasures initiated.';
    }

    return {
      timestamp: new Date().toISOString(),
      threatLevel: overallThreatLevel,
      requiresImmediateIntervention,
      summary: summaryText,
      findingsCount: findings.length,
      findings
    };
  }

  /**
   * Generate 1-Click Emergency Override Protocol checklist
   * @param {string} emergencyType - 'RAPID_DEPRESS' | 'SOLAR_SPE' | 'CARDIAC_ARREST' | 'TOXIC_LEAK'
   */
  static getEmergencyOverrideProtocol(emergencyType = 'GENERAL_EMERGENCY') {
    const protocols = {
      RAPID_DEPRESS: {
        title: 'EMERGENCY PROTOCOL: RAPID CABIN DEPRESSURIZATION',
        severity: 'CRITICAL',
        color: '#FF0033',
        audioWarning: 'ALARM_RAPID_DEPRESS.WAV',
        triageSteps: [
          '1. Immediately seal helmet visor and check suit pressure seal (3.5 - 4.3 psi).',
          '2. Secure umbilical oxygen feed and switch to secondary emergency O2 bottle.',
          '3. Navigate to Medical Bay Airlock Compartment B and initiate hatch lockdown.',
          '4. Sound ship-wide automated distress beacon to Mission Control (Houston / CSA).'
        ]
      },
      SOLAR_SPE: {
        title: 'EMERGENCY PROTOCOL: MASSIVE SOLAR PARTICLE EVENT (SPE)',
        severity: 'CRITICAL',
        color: '#FF6600',
        audioWarning: 'ALARM_RADIATION_SPE.WAV',
        triageSteps: [
          '1. Cease all Extravehicular Activities (EVAs) and return to airlock immediately.',
          '2. Proceed to the central habitat water-wall radiation storm haven.',
          '3. Deploy supplemental polyethylene shielding slabs around medical berths.',
          '4. Administer radioprotective antioxidants / colony-stimulating factor as prescribed.'
        ]
      },
      CARDIAC_ARREST: {
        title: 'EMERGENCY PROTOCOL: CARDIOVASCULAR COLLAPSE / ARREST',
        severity: 'CRITICAL',
        color: '#FF0055',
        audioWarning: 'ALARM_CODE_BLUE.WAV',
        triageSteps: [
          '1. Secure astronaut to the Crew Medical Restraint System (CMRS) board (essential in microgravity).',
          '2. Apply automated external defibrillator (AED) pads and enable cardiac rhythm analyzer.',
          '3. Begin hand-stand or reverse-compression CPR (microgravity modified technique).',
          '4. Administer IV Epinephrine 1mg via automatic injector.'
        ]
      },
      GENERAL_EMERGENCY: {
        title: '1-CLICK EMERGENCY OVERRIDE TRIGGERED',
        severity: 'CRITICAL',
        color: '#FF0033',
        audioWarning: 'ALARM_GENERAL_ALARM.WAV',
        triageSteps: [
          '1. Medical Bay status switched to EMERGENCY OVERRIDE.',
          '2. Automated life support pumps and high-flow O2 lines engaged.',
          '3. Vital biometrics broadcast transmitted to Earth Ground Station.',
          '4. Stand by for automated diagnostic triage guidance on holographic HUD.'
        ]
      }
    };

    return protocols[emergencyType] || protocols.GENERAL_EMERGENCY;
  }
}

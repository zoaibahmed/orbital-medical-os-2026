/**
 * ============================================================================
 * NASA SPACE APPS CHALLENGE - 3D HOLOGRAPHIC MEDICAL BAY
 * MODULE: Crew Biometrics & Vitals Real-Time Simulation Engine
 * AUTHOR: Saad (Backend, State Management & Data Integration Engineer)
 * ============================================================================
 *
 * DESCRIPTION:
 * Simulates real-time physiological vitals for astronauts aboard a spacecraft
 * or planetary medical bay. Uses realistic microgravity baseline values and
 * generates smooth, continuous biometrics fluctuations (sine oscillations +
 * randomized micro-drift) rather than erratic random numbers.
 *
 * FEATURES:
 * 1. Heart Rate (BPM) & Blood Pressure (Systolic/Diastolic)
 * 2. Oxygen Saturation (SpO2) with Hypoxia early-warning trigger (< 94%)
 * 3. Heart Rate Variability (HRV in ms) indicating autonomic nervous stress
 * 4. Respiration Rate & Core Body Temperature
 * 5. Simulation Scenarios: NOMINAL, EVA_ACTIVE, HYPOXIA_EVENT, SOLAR_FLARE
 * 6. Rolling 30-point telemetry history for Faiz's real-time holographic charts
 */

export const SIMULATION_MODES = {
  NOMINAL: 'NOMINAL',
  EVA_ACTIVE: 'EVA_ACTIVE',
  HYPOXIA_EVENT: 'HYPOXIA_EVENT',
  SOLAR_FLARE: 'SOLAR_FLARE',
  EMERGENCY_INJURY: 'EMERGENCY_INJURY'
};

export class VitalsSimulator {
  constructor(initialAstronautId = 'ASTRO-01') {
    this.astronautId = initialAstronautId;
    this.mode = SIMULATION_MODES.NOMINAL;
    this.tickCount = 0;
    this.maxHistoryLength = 30; // Store last 30 seconds for live chart rendering

    // Baseline physiological states (NASA Astronaut Nominal Microgravity baseline)
    this.currentVitals = {
      timestamp: new Date().toISOString(),
      astronautId: this.astronautId,
      heartRate: 72,          // beats per minute (bpm)
      bloodPressure: {
        systolic: 118,        // mmHg (Cephalic fluid shift consideration)
        diastolic: 76         // mmHg
      },
      spo2: 98.4,             // Oxygen saturation percentage (%)
      hrv: 64,                // Heart Rate Variability (ms) - indicator of fatigue/stress
      respirationRate: 14,    // Breaths per minute
      coreTemperature: 37.0,  // Degrees Celsius
      status: 'NOMINAL',      // 'NOMINAL' | 'WARNING' | 'CRITICAL'
      activeAlerts: []        // Array of active medical warnings
    };

    // Rolling historical buffer for frontend holographic charts
    this.history = [];
    this.subscribers = new Set();
    this.intervalId = null;
  }

  /**
   * Set active scenario mode (e.g. switch to Spacewalk or Hypoxia event)
   */
  setMode(newMode) {
    if (SIMULATION_MODES[newMode]) {
      this.mode = newMode;
      return { success: true, mode: this.mode };
    }
    return { success: false, error: 'Invalid simulation mode' };
  }

  getMode() {
    return this.mode;
  }

  /**
   * Core mathematical step function: computes next tick vitals based on mode & drift
   */
  step() {
    this.tickCount++;
    const t = this.tickCount * 0.2; // Smooth phase parameter

    let targetHR;
    let targetSystolic;
    let targetDiastolic;
    let targetSpO2;
    let targetHRV;
    let targetResp;
    let targetTemp;

    // Apply scenario profiles based on NASA mission events
    switch (this.mode) {
      case SIMULATION_MODES.EVA_ACTIVE:
        // Spacewalk physical exertion: Elevated HR, elevated respiration, lower HRV
        targetHR = 118;
        targetSystolic = 135;
        targetDiastolic = 84;
        targetSpO2 = 97.2;
        targetHRV = 36;
        targetResp = 22;
        targetTemp = 37.3;
        break;

      case SIMULATION_MODES.HYPOXIA_EVENT:
        // Life support / EVA Suit leak: Rapid drop in SpO2, tachycardia compensatory response
        targetHR = 124;
        targetSystolic = 142;
        targetDiastolic = 92;
        targetSpO2 = 88.5; // CRITICAL HYPOXIA (< 90%)
        targetHRV = 28;
        targetResp = 26;
        targetTemp = 36.6;
        break;

      case SIMULATION_MODES.SOLAR_FLARE:
        // High radiation environment stress: autonomic distress, fatigue
        targetHR = 88;
        targetSystolic = 128;
        targetDiastolic = 82;
        targetSpO2 = 96.5;
        targetHRV = 42;
        targetResp = 16;
        targetTemp = 37.4;
        break;

      case SIMULATION_MODES.EMERGENCY_INJURY:
        // Severe trauma / cabin depressurization
        targetHR = 138;
        targetSystolic = 95;  // Hypotension shock
        targetDiastolic = 60;
        targetSpO2 = 86.0;
        targetHRV = 20;
        targetResp = 30;
        targetTemp = 36.2;
        break;

      case SIMULATION_MODES.NOMINAL:
      default:
        // Calm resting microgravity baseline
        targetHR = 72;
        targetSystolic = 118;
        targetDiastolic = 76;
        targetSpO2 = 98.5;
        targetHRV = 65;
        targetResp = 14;
        targetTemp = 37.0;
        break;
    }

    // Natural sinusoidal wave + gentle Gaussian jitter
    const wave = Math.sin(t);
    const microJitter = (Math.random() - 0.5) * 1.5;

    // Compute updated values with gradual easing towards target
    const current = this.currentVitals;
    const hr = Math.round(current.heartRate + (targetHR - current.heartRate) * 0.2 + wave * 1.5 + microJitter);
    const systolic = Math.round(current.bloodPressure.systolic + (targetSystolic - current.bloodPressure.systolic) * 0.15 + (Math.random() - 0.5));
    const diastolic = Math.round(current.bloodPressure.diastolic + (targetDiastolic - current.bloodPressure.diastolic) * 0.15 + (Math.random() - 0.5));

    // SpO2 calculation (clamped between 75% and 100%)
    let spo2 = +(current.spo2 + (targetSpO2 - current.spo2) * 0.15 + (Math.random() - 0.5) * 0.2).toFixed(1);
    spo2 = Math.min(100, Math.max(75, spo2));

    const hrv = Math.round(current.hrv + (targetHRV - current.hrv) * 0.15 + microJitter);
    const resp = Math.round(current.respirationRate + (targetResp - current.respirationRate) * 0.15 + (Math.random() - 0.5));
    const temp = +(current.coreTemperature + (targetTemp - current.coreTemperature) * 0.1 + (Math.random() - 0.5) * 0.04).toFixed(1);

    // Evaluate health alerts
    const alerts = [];
    let status = 'NOMINAL';

    // Hypoxia threshold evaluation
    if (spo2 < 90) {
      status = 'CRITICAL';
      alerts.push({
        id: 'ALERT_HYPOXIA_CRITICAL',
        level: 'CRITICAL',
        code: 'SPO2_SEVERELY_LOW',
        message: `CRITICAL HYPOXIA: SpO2 at ${spo2}%. Immediate Supplemental O2 Required!`
      });
    } else if (spo2 < 94) {
      if (status !== 'CRITICAL') status = 'WARNING';
      alerts.push({
        id: 'ALERT_HYPOXIA_STAGE_1',
        level: 'WARNING',
        code: 'SPO2_DEGRADED',
        message: `Hypoxia Warning: SpO2 dropped to ${spo2}%. Inspect suit/cabin seal.`
      });
    }

    // Tachycardia / Cardiac Arrhythmia checks
    if (hr > 130) {
      status = 'CRITICAL';
      alerts.push({
        id: 'ALERT_TACHYCARDIA',
        level: 'CRITICAL',
        code: 'HEART_RATE_EXTREME',
        message: `Severe Tachycardia: Heart Rate exceeding ${hr} BPM!`
      });
    } else if (hr > 105 && this.mode === SIMULATION_MODES.NOMINAL) {
      if (status !== 'CRITICAL') status = 'WARNING';
      alerts.push({
        id: 'ALERT_HR_ELEVATED',
        level: 'WARNING',
        code: 'HEART_RATE_ELEVATED',
        message: `Elevated Resting Heart Rate (${hr} BPM) detected in nominal mode.`
      });
    }

    // Blood Pressure hypotension warning
    if (systolic < 95) {
      status = 'CRITICAL';
      alerts.push({
        id: 'ALERT_HYPOTENSION',
        level: 'CRITICAL',
        code: 'BLOOD_PRESSURE_LOW',
        message: `Hypotensive Shock Risk: Blood Pressure ${systolic}/${diastolic} mmHg.`
      });
    }

    // HRV severe autonomic stress
    if (hrv < 30) {
      if (status !== 'CRITICAL') status = 'WARNING';
      alerts.push({
        id: 'ALERT_AUTONOMIC_FATIGUE',
        level: 'WARNING',
        code: 'HRV_EXHAUSTION',
        message: `Autonomic Nervous Exhaustion: HRV critically depressed at ${hrv} ms.`
      });
    }

    // Construct snapshot
    this.currentVitals = {
      timestamp: new Date().toISOString(),
      astronautId: this.astronautId,
      heartRate: hr,
      bloodPressure: { systolic, diastolic },
      spo2,
      hrv,
      respirationRate: resp,
      coreTemperature: temp,
      status,
      activeAlerts: alerts
    };

    // Append to historical rolling buffer
    this.history.push({ ...this.currentVitals });
    if (this.history.length > this.maxHistoryLength) {
      this.history.shift();
    }

    // Notify all active listeners/subscribers (UI components, websockets)
    this._notify();

    return this.currentVitals;
  }

  /**
   * Get latest vitals snapshot
   */
  getSnapshot() {
    return { ...this.currentVitals };
  }

  /**
   * Get historical telemetry data for chart visualization
   */
  getHistory() {
    return [...this.history];
  }

  /**
   * Start live simulation interval (defaults to 1 tick per second)
   */
  start(intervalMs = 1000) {
    if (this.intervalId) return;
    this.step(); // Immediate first step
    this.intervalId = setInterval(() => {
      this.step();
    }, intervalMs);
  }

  /**
   * Stop simulation loop
   */
  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }
  }

  /**
   * Subscribe to vitals updates
   */
  subscribe(callback) {
    this.subscribers.add(callback);
    return () => this.subscribers.delete(callback);
  }

  _notify() {
    for (const callback of this.subscribers) {
      try {
        callback(this.currentVitals, this.history);
      } catch (err) {
        console.error('Error in vitals subscriber callback:', err);
      }
    }
  }
}

// Export singleton instance for app-wide data integration
export const vitalsSimulator = new VitalsSimulator();
export default vitalsSimulator;

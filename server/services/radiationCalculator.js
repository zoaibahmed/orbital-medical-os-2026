/**
 * ============================================================================
 * NASA SPACE APPS CHALLENGE - 3D HOLOGRAPHIC MEDICAL BAY
 * MODULE: Space Radiation Monitoring & Risk Calculator (CANS Inspired)
 * AUTHOR: Saad (Backend, State Management & Data Integration Engineer)
 * ============================================================================
 *
 * DESCRIPTION:
 * Modeled after the Canadian Space Agency (CSA) CANS (Complex Airborne and
 * Space Neutron Spectrometer) payload and NASA Human Research Program (HRP)
 * radiation safety guidelines.
 *
 * Tracks:
 * 1. Real-time Galactic Cosmic Rays (GCR) background dose rate
 * 2. Solar Particle Events (SPE) coronal mass ejection spikes
 * 3. Neutron dose equivalent (mSv/hr) via CANS spectrometer simulation
 * 4. Cumulative mission dose (mSv) & NASA career limit percentage (600 mSv max)
 * 5. Lifetime REIC (Risk of Exposure-Induced Cancer death) percentage calculation
 * 6. Acute Radiation Syndrome (ARS) alert thresholds
 */

// NASA 2021 Standard Career Permissible Exposure Limit (mSv)
export const NASA_CAREER_LIMIT_MSV = 600.0;
// NASA 30-day mission safety limit (mSv)
export const NASA_30_DAY_LIMIT_MSV = 250.0;

export class RadiationCalculator {
  constructor(initialDoseMsv = 42.5, missionElapsedDays = 85) {
    this.missionElapsedDays = missionElapsedDays;
    this.cumulativeDoseMsv = initialDoseMsv; // Lifetime cumulative dose to date

    // Live CANS sensor telemetry values
    this.telemetry = {
      timestamp: new Date().toISOString(),
      gcrDoseRate: 0.052,         // mSv / hour (Galactic Cosmic Rays background)
      speDoseRate: 0.000,         // mSv / hour (Solar Particle Events)
      cansNeutronDoseRate: 0.024, // mSv / hour (CANS High-LET neutron fraction)
      totalInstantRate: 0.076,    // mSv / hour combined
      cumulativeDoseMsv: this.cumulativeDoseMsv,
      careerLimitPercentage: +(this.cumulativeDoseMsv / NASA_CAREER_LIMIT_MSV * 100).toFixed(2),
      cancerRiskPercent: +(this.cumulativeDoseMsv * 0.005).toFixed(2), // ~5% per Sievert (ICRP 103)
      alertLevel: 'NOMINAL',      // 'NOMINAL' | 'ELEVATED' | 'CRITICAL_SPE'
      stormShelterRecommended: false
    };

    this.history = [];
    this.maxHistory = 30;
  }

  /**
   * Calculate risk metrics based on current cumulative dose
   * @param {number} doseMsv - cumulative dose in milliSieverts
   */
  calculateRiskMetrics(doseMsv) {
    const careerPct = +((doseMsv / NASA_CAREER_LIMIT_MSV) * 100).toFixed(2);
    // Biological cancer risk model (approx 5% per 1,000 mSv / 1 Sv)
    const cancerRisk = +( (doseMsv / 1000) * 5.0 ).toFixed(3);

    let healthAssessment = 'Within normal NASA deep-space operational limits.';
    if (careerPct > 80) {
      healthAssessment = 'CRITICAL: Approaching NASA Career Radiation Exposure Limit (PEL). Grounding recommended.';
    } else if (careerPct > 50) {
      healthAssessment = 'CAUTION: Over 50% of Career Permissible Exposure Limit consumed.';
    } else if (doseMsv > 100) {
      healthAssessment = 'ELEVATED: Cellular chromosome aberration tracking active.';
    }

    return {
      cumulativeDoseMsv: +doseMsv.toFixed(3),
      careerLimitMaxMsv: NASA_CAREER_LIMIT_MSV,
      careerLimitPercentage: Math.min(100, careerPct),
      cancerRiskPercent: cancerRisk,
      healthAssessment
    };
  }

  /**
   * Simulate a live CANS spectrometer sensor reading
   * @param {boolean} isSolarStormActive - simulate solar storm flare
   */
  sampleSensor(isSolarStormActive = false) {
    // GCR baseline micro-fluctuations (0.045 to 0.065 mSv/hr in interplanetary space)
    const gcrBase = 0.052 + (Math.sin(Date.now() / 10000) * 0.008) + (Math.random() - 0.5) * 0.004;

    // CANS Neutron fraction (~35-45% of total high-energy dose)
    const neutronBase = gcrBase * 0.42 + (Math.random() - 0.5) * 0.002;

    // SPE Solar Particle Event (Can surge 50x - 200x during coronal mass ejections)
    let speRate = 0.000;
    let alertLevel = 'NOMINAL';
    let stormShelter = false;

    if (isSolarStormActive) {
      speRate = 2.45 + Math.random() * 3.8; // High spike in mSv/hr
      alertLevel = 'CRITICAL_SPE';
      stormShelter = true;
    } else if (Math.random() < 0.05) {
      // Occasional minor solar micro-flare
      speRate = 0.12 + Math.random() * 0.15;
      alertLevel = 'ELEVATED';
    }

    const totalInstantRate = +(gcrBase + speRate + neutronBase).toFixed(4);

    // Increment cumulative dose (scaled for realistic 1-second simulation tick)
    // 1 tick = fraction of hour (e.g. 1 hour simulated per 10 seconds or realistic tick)
    const simulatedHourSlice = 1 / 3600;
    this.cumulativeDoseMsv += totalInstantRate * simulatedHourSlice * 10; // 10x accelerated for demo clarity

    const risk = this.calculateRiskMetrics(this.cumulativeDoseMsv);

    this.telemetry = {
      timestamp: new Date().toISOString(),
      gcrDoseRate: +gcrBase.toFixed(4),
      speDoseRate: +speRate.toFixed(4),
      cansNeutronDoseRate: +neutronBase.toFixed(4),
      totalInstantRate,
      cumulativeDoseMsv: risk.cumulativeDoseMsv,
      careerLimitPercentage: risk.careerLimitPercentage,
      cancerRiskPercent: risk.cancerRiskPercent,
      alertLevel,
      stormShelterRecommended: stormShelter,
      guidance: stormShelter
        ? 'CORONAL MASS EJECTION ACTIVE: Astronaut must retreat immediately to Water-Shielded Storm Haven!'
        : 'CANS radiation levels nominal. Standard deep-space shielding effective.'
    };

    this.history.push({ ...this.telemetry });
    if (this.history.length > this.maxHistory) {
      this.history.shift();
    }

    return this.telemetry;
  }

  getTelemetry() {
    return { ...this.telemetry };
  }

  getHistory() {
    return [...this.history];
  }
}

export const radiationCalculator = new RadiationCalculator();
export default radiationCalculator;

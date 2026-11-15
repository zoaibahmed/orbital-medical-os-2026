/**
 * ============================================================================
 * NASA SPACE APPS CHALLENGE - 3D HOLOGRAPHIC MEDICAL BAY
 * MODULE: Physiological, Musculoskeletal & SANS Risk Assessment Engine
 * AUTHOR: Saad (Backend, State Management & Data Integration Engineer)
 * ============================================================================
 *
 * SCIENTIFIC BACKGROUND (NASA HRP Guidelines):
 * 1. Microgravity Bone & Muscle Loss:
 *    - In microgravity, lack of mechanical load leads to ~1.0-1.5% bone mineral
 *      density (BMD) loss per month in lumbar spine and femoral neck.
 *    - Muscle atrophy decreases volume by up to 5% weekly without exercise.
 *    - Countermeasures: High-intensity resistive exercise (ARED) & T2 Treadmill.
 *
 * 2. SANS (Spaceflight-Associated Neuro-ocular Syndrome):
 *    - Cephalic fluid shift causes optic disc edema, globe flattening, choroidal
 *      folds, and hyperopic refractive shifts.
 *
 * 3. Sleep & Circadian Rhythm:
 *    - Disrupted by 90-minute day/night orbital cycles and microgravity.
 */

// ==========================================
// 1. MUSCULOSKELETAL & EXERCISE ASSESSMENT
// ==========================================
export class MusculoskeletalCalculator {
  /**
   * Calculate cumulative bone & muscle atrophy vs countermeasure mitigation
   * @param {number} missionDays - Days in microgravity
   * @param {Array} exerciseLogs - Array of { type: 'ARED'|'T2_TREADMILL', durationMin: number, intensityPercent: number }
   */
  static assessLoss(missionDays = 90, exerciseLogs = []) {
    // Baseline unmitigated loss rates
    const unmitigatedBoneLossPct = (missionDays / 30) * 1.25; // 1.25% per 30 days
    const unmitigatedMuscleLossPct = (missionDays / 7) * 4.0;  // 4% per week

    // Total exercise countermeasure credits
    let aredMinutes = 0;
    let t2Minutes = 0;

    exerciseLogs.forEach(log => {
      const duration = log.durationMin || 0;
      const intensity = (log.intensityPercent ?? 80) / 100;
      if (log.type === 'ARED') {
        aredMinutes += duration * intensity;
      } else if (log.type === 'T2_TREADMILL' || log.type === 'CYCLE') {
        t2Minutes += duration * intensity;
      }
    });

    // Required NASA target: 2.5 hours per day (150 min/day)
    const targetExerciseMinutes = missionDays * 120; // 2 hrs/day expected
    const actualMinutes = aredMinutes + t2Minutes;
    const complianceRatio = Math.min(1.0, actualMinutes / Math.max(1, targetExerciseMinutes));

    // Mitigated net loss
    // ARED mitigates up to 85% of bone loss and 75% of muscle loss
    const boneMitigation = complianceRatio * 0.85;
    const muscleMitigation = complianceRatio * 0.80;

    const netBoneLossPct = +(unmitigatedBoneLossPct * (1 - boneMitigation)).toFixed(2);
    const netMuscleLossPct = +(unmitigatedMuscleLossPct * (1 - muscleMitigation)).toFixed(2);

    let status = 'NOMINAL';
    let recommendations = 'Exercise countermeasure adherence on track.';

    if (netBoneLossPct > 4.5 || netMuscleLossPct > 15.0) {
      status = 'CRITICAL';
      recommendations = 'Severe bone demineralization detected! Increase ARED load resistance and verify Vitamin D/Calcium intake.';
    } else if (netBoneLossPct > 2.5 || netMuscleLossPct > 8.0) {
      status = 'WARNING';
      recommendations = 'Moderate musculoskeletal degradation. Increase daily treadmill and resistive load by 20%.';
    }

    return {
      missionDays,
      complianceRatio: +(complianceRatio * 100).toFixed(1), // % compliance
      netBoneLossPct,
      netMuscleLossPct,
      estimatedBoneDensityIndex: +(100 - netBoneLossPct).toFixed(1), // Starts at 100%
      estimatedMuscleMassIndex: +(100 - netMuscleLossPct).toFixed(1), // Starts at 100%
      status,
      recommendations
    };
  }
}

// ==========================================
// 2. SANS (NEURO-OCULAR SYNDROME) CHECKER
// ==========================================
export class SANSCalculator {
  /**
   * Diagnostic assessment based on clinical questionnaire answers
   * @param {Object} responses - Answers to SANS checklist
   * {
   *   frisenGrade: 0-5 (Optic Disc Edema grade),
   *   blurredNearVision: boolean,
   *   globeFlatteningPresent: boolean,
   *   cottonWoolSpots: boolean,
   *   choroidalFolds: boolean,
   *   headacheSeverity: 0-10 (Intracranial pressure symptom)
   * }
   */
  static evaluate(responses = {}) {
    const {
      frisenGrade = 0,
      blurredNearVision = false,
      globeFlatteningPresent = false,
      cottonWoolSpots = false,
      choroidalFolds = false,
      headacheSeverity = 0
    } = responses;

    let score = 0;

    // Frisén scale weight (Optic Disc Swelling)
    score += frisenGrade * 2.5;

    // Optical changes
    if (blurredNearVision) score += 2;
    if (globeFlatteningPresent) score += 3;
    if (cottonWoolSpots) score += 2.5;
    if (choroidalFolds) score += 3;

    // Elevated Intracranial Pressure (ICP) marker
    if (headacheSeverity >= 7) score += 3;
    else if (headacheSeverity >= 4) score += 1.5;

    let riskLevel = 'LOW';
    let clinicalGrade = 'Grade 0 (Nominal)';
    let actionProtocol = 'Standard periodic optical OCT scanning every 30 days.';

    if (score >= 9 || frisenGrade >= 3) {
      riskLevel = 'HIGH';
      clinicalGrade = 'Grade 3/4 (Severe Neuro-Ocular Edema)';
      actionProtocol = 'Immediate Lower Body Negative Pressure (LBNP) therapy (20 mmHg for 2 hrs/day) to pull cephalic fluids down. Administer space adjust-glasses and notify Flight Surgeon.';
    } else if (score >= 4 || frisenGrade >= 1) {
      riskLevel = 'MODERATE';
      clinicalGrade = 'Grade 1/2 (Early SANS Onset)';
      actionProtocol = 'Prescribe resistive exercise adjustments and schedule weekly fundoscopic & optical coherence tomography (OCT) review.';
    }

    return {
      sansScore: +score.toFixed(1),
      maxScore: 16.0,
      riskLevel,
      clinicalGrade,
      actionProtocol,
      symptomsDetected: {
        frisenGrade,
        blurredNearVision,
        globeFlatteningPresent,
        cottonWoolSpots,
        choroidalFolds,
        headacheSeverity
      }
    };
  }
}

// ==========================================
// 3. SLEEP & CIRCADIAN RHYTHM TRACKER
// ==========================================
export class SleepTracker {
  /**
   * Evaluates sleep log and computes Circadian Desynchrony & Sleep Score
   * @param {Object} log - { hoursSlept: number, awakeningsCount: number, remFractionPct: number, lightExposureSync: boolean }
   */
  static calculateSleepScore(log = {}) {
    const {
      hoursSlept = 6.5,
      awakeningsCount = 2,
      remFractionPct = 20,
      lightExposureSync = true
    } = log;

    // NASA target sleep is 8.0 hours
    const durationScore = Math.min(100, (hoursSlept / 8.0) * 50); // 50 pts max
    const continuityScore = Math.max(0, 25 - awakeningsCount * 5); // 25 pts max
    const qualityScore = Math.min(25, (remFractionPct / 25) * 25); // 25 pts max

    let totalScore = Math.round(durationScore + continuityScore + qualityScore);
    if (!lightExposureSync) {
      totalScore = Math.max(0, totalScore - 15); // Circadian desynchrony penalty
    }

    let status = 'OPTIMAL';
    let recommendation = 'Circadian sleep cycle healthy. Melatonin production stable.';

    if (totalScore < 50) {
      status = 'SEVERE_SLEEP_DEBT';
      recommendation = 'High cognitive error risk. Recommend blue-light filtering goggles 2 hrs before sleep + 0.5mg melatonin.';
    } else if (totalScore < 70) {
      status = 'MILD_FATIGUE';
      recommendation = 'Sleep debt accumulating. Schedule a 30-minute afternoon nap countermeasure before EVA duties.';
    }

    return {
      hoursSlept,
      sleepScore: Math.min(100, Math.max(0, totalScore)),
      status,
      recommendation,
      circadianDesynchronyWarning: !lightExposureSync
    };
  }
}

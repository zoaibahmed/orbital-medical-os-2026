import type { BiometricMeasurements, SleepRecord } from '../../../domain/contracts'
import { MeasurementTile } from '../../../ui/medical/MeasurementTile'
import { MedicalPanel } from '../../../ui/medical/MedicalPanel'
import { RingGauge } from '../../../ui/medical/RingGauge'
import { HeartRateTrend, type HeartRateSample } from './HeartRateTrend'

export function VitalsDashboard({ biometrics, sleep, heartRateHistory }: { biometrics: BiometricMeasurements; sleep: SleepRecord; heartRateHistory?: readonly HeartRateSample[] }) {
  return <div className="grid gap-5 lg:grid-cols-[1.4fr_1fr]">
    <div className="grid gap-5">
      <MedicalPanel title="Heart" severity={biometrics.heartRate.severity}>
        <div className="grid gap-3 sm:grid-cols-2">
          <MeasurementTile label="Heart rate" measurement={biometrics.heartRate} />
          <MeasurementTile label="Heart rate variability" measurement={biometrics.heartRateVariability} />
        </div>
        <div className="mt-4"><HeartRateTrend samples={heartRateHistory} /></div>
      </MedicalPanel>
      <MedicalPanel title="Blood pressure" severity={biometrics.systolicPressure.severity}>
        <div className="grid gap-3 sm:grid-cols-2">
          <MeasurementTile label="Systolic" measurement={biometrics.systolicPressure} />
          <MeasurementTile label="Diastolic" measurement={biometrics.diastolicPressure} />
        </div>
      </MedicalPanel>
    </div>
    <div className="grid content-start gap-5">
      <MedicalPanel title="Oxygen" severity={biometrics.oxygenSaturation.severity}>
        <RingGauge measurement={biometrics.oxygenSaturation} max={100} label="Oxygen saturation" />
        <p className="!mb-0 mt-3 text-center text-xs text-[var(--os-muted)]">Measured {biometrics.oxygenSaturation.measuredAt.slice(0, 16).replace('T', ' ')} UTC</p>
      </MedicalPanel>
      <MedicalPanel title="Sleep" severity={sleep.duration.severity}>
        <MeasurementTile label="Last sleep" measurement={sleep.duration} />
        <p className="!mb-0 mt-3 text-sm text-[var(--os-muted)]">Sleep score: {sleep.suppliedScore ?? 'Not supplied'}</p>
      </MedicalPanel>
    </div>
  </div>
}

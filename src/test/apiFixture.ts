import { getFixtureSnapshot } from '../data/fixtures'
import type { CrewApiState } from '../services/api/contracts'
export function apiFixture(crewId='crew-01'):CrewApiState{
  const snapshot=structuredClone(getFixtureSnapshot(crewId)!)
  snapshot.source='external'
  for(const measurement of [...Object.values(snapshot.biometrics),snapshot.radiation.doseRate,snapshot.radiation.cumulativeDose,snapshot.sleep.duration,snapshot.physical.boneDensityChange,snapshot.physical.muscleMassChange])measurement.source='external'
  snapshot.wellbeing.scale={min:1,max:10};snapshot.diagnostic.source='external';snapshot.diagnostic.kind='supplied-result'
  return {schemaVersion:1,crewId,simulation:true,reviewStatus:'draft',mode:'NOMINAL',snapshot,
    heartRateHistory:[{measuredAt:snapshot.capturedAt,bpm:72}],radiationHistory:[],records:{exercises:[],checkIns:[],sleep:[],sans:[]},
    diagnostics:{timestamp:snapshot.capturedAt,threatLevel:'NOMINAL',summary:'Fictional test',findingsCount:0,findings:[],requiresImmediateIntervention:false},
    emergency:{isActive:false,type:null,timestamp:null},limitations:['Fictional test fixture']}
}

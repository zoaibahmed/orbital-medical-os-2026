import patient from '../assets/patient-manifest.json'

/** Runtime metres measured against the accepted GLB/posed patient (hash in manifest).
 * Aperture plane is the midpoint of the original .55 m ceramic liner at z=-1.22.
 * +Z follows the longitudinal bed axis. Full travel includes a 20 mm endpoint margin. */
export const scannerTravel = {
  axis:'z',apertureZ:-1.22,apertureCenter:[-.4,1] as const,innerRadius:.767,
  // Original bed console reaches radius .8507 m about the gantry centre.
  // 1.16 = round-up((.8507 + .035 m clearance) / .767 m original bore).
  clearanceScale:1.16,
  crownVentDrop:.09,
  headZ:patient.boundsThree[2]![0]!,feetZ:patient.boundsThree[2]![1]!,parkZ:0,
  get endZ(){return this.feetZ+.02-this.apertureZ},
  get railCenters(){return [-1.55,.75].map(x=>-.4+(x+.4)*this.clearanceScale)},
}

export function scannerClearancePoint(x:number,y:number,z:number):[number,number,number]{
  const vent=y>=2.2649&&y<=2.34&&z>=-1.14&&z<=-1.06&&x>=-.56&&x<=-.24
  return [-.4+(x+.4)*scannerTravel.clearanceScale,(y>1?1+(y-1)*scannerTravel.clearanceScale:y)-(vent?scannerTravel.crownVentDrop:0),z]
}

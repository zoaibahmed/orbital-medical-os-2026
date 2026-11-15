import type { ProfilerOnRenderCallback } from 'react'

declare global {
  interface Window {
    __orbitalProbe?: {
      active: boolean
      frames: Array<{ time: number; cpuMs: number; calls: number; triangles: number; geometries: number; textures: number; position: number[]; visible: boolean; moving?: boolean }>
      react: Array<{ phase: string; duration: number; time: number }>
      lifecycles: Array<{ id: string; event: string; time: number }>
      resources: Array<{ kind: string; time: number }>
      renderer?: string
      parallelCompile?: boolean
      checkComposite?: () => {samples:number;meanChannelError:number;maxChannelError:number}
      projectPoint?: (point:number[])=>{x:number;y:number}
      patientSnapshot?: () => {visible:boolean;bounds:number[][];meshes:Array<{name:string;bones:number;vertices:number;morph:number}>}|null
      scannerSnapshot?: () => {assemblies:number;offset:number;vertex:number[];parts:number;triangles:number;sheetZ:number|null}|null
      resourceSnapshot?: () => { geometries: string[]; materials: string[]; textures: string[] }
      checkClearance?: (positions: number[][]) => { blocked: number[]; radius: number }
    }
  }
}

export const recordCommit: ProfilerOnRenderCallback = (_id, phase, duration) => {
  const probe = window.__orbitalProbe
  if (probe && probe.react.length < 12000) probe.react.push({ phase, duration, time: performance.now() })
}

export function recordResource(kind: string) {
  window.__orbitalProbe?.resources.push({ kind, time: performance.now() })
}


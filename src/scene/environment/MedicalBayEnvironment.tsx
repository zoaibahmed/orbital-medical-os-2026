import { use, useEffect, useMemo, useRef, useState } from 'react'
import type { ThreeEvent } from '@react-three/fiber'
import { useFrame, useThree } from '@react-three/fiber'
import { Mesh, MeshStandardMaterial, Texture, Vector2, WebGLRenderTarget } from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { getEnvironmentResource } from '../assets/loadModel'
import type { QualityTier } from '../quality/config'
import type { CameraView } from '../navigation/presets'
import { createStationRegistry } from '../interaction/stationRegistry'
import { createBayMaterials, disposeBayMaterials } from './materials'
import { recordResource } from '../quality/probeStore'
import { releaseBedRestraints } from './releasedRestraints'
import { useClinical } from '../../state/clinical'

function ModelInstance({ model, materials, kind, selected, onSelect, reducedMotion, standbyRun, liveDisplay, occupied, scanning }: { model: GLTF; materials: Map<string, MeshStandardMaterial>; kind: CameraView; selected: boolean; onSelect: (view: CameraView) => void; reducedMotion: boolean; standbyRun: number; liveDisplay: boolean; occupied:boolean; scanning:boolean }) {
  const [hovered, setHovered] = useState(false)
  const canvas = useThree(state => state.gl.domElement)
  const invalidate = useThree(state => state.invalidate)
  const gl=useThree(state=>state.gl)
  const pulse = useRef({ active: false, started: 0 })
  const { scene, highlightMaterials, indicatorMaterials } = useMemo(() => {
    recordResource('model-instance-cloned')
    const scene = model.scene.clone(true)
    const highlightMaterials: MeshStandardMaterial[] = []
    const indicatorMaterials: MeshStandardMaterial[] = []
    scene.traverse(object => {
      if (!(object instanceof Mesh)) return
      if (liveDisplay && kind === 'equipment' && object.material instanceof MeshStandardMaterial && object.material.name === 'Instrument display ink') object.visible=false
      object.receiveShadow = !object.name.replaceAll('_',' ').includes('NASA Earth')
      object.castShadow = !object.name.replaceAll('_',' ').includes('NASA Earth') && !object.name.replaceAll('_',' ').includes('Thin optical glazing')
      if (object.material instanceof MeshStandardMaterial) object.material = materials.get(object.material.name) ?? object.material
      // Forward transparency must blend after the cached HDR opaque room is
      // tone mapped, matching the ordinary renderer's display-space ordering.
      if(object.material instanceof MeshStandardMaterial&&object.material.transparent)object.layers.set(1)
      if (kind !== 'overview' && object.material instanceof MeshStandardMaterial && object.material.name === 'Ceramic medical shell') {
        object.material = object.material.clone()
        highlightMaterials.push(object.material)
      }
      if (kind === 'examination' && object.material instanceof MeshStandardMaterial && object.material.name === 'Scanner sensing indicator') {
        object.layers.set(1)
        object.material = object.material.clone()
        indicatorMaterials.push(object.material)
      }
    })
    return { scene, highlightMaterials, indicatorMaterials }
  }, [model, kind, materials, liveDisplay])
  const restraints=useMemo(()=>kind==='examination'?releaseBedRestraints(scene):null,[kind,scene])
  useEffect(()=>{restraints?.setOccupied(occupied);if(restraints){canvas.dataset.restraintTriangles=String(restraints.triangles);canvas.dataset.restraints=occupied?'released':'flat'}canvas.dataset.sceneRevision=String(Number(canvas.dataset.sceneRevision??0)+1);gl.shadowMap.needsUpdate=true;invalidate()},[occupied,restraints,canvas,gl,invalidate])
  useEffect(()=>()=>restraints?.dispose(),[restraints])
  useEffect(() => {
    highlightMaterials.forEach(material => { material.emissive.set('#63dceb'); material.emissiveIntensity = hovered ? .12 : selected ? .045 : 0 })
    canvas.dataset.sceneRevision=String(Number(canvas.dataset.sceneRevision??0)+1)
    invalidate()
  }, [hovered, selected, highlightMaterials, invalidate, canvas])
  useEffect(() => {
    if (!hovered) return
    canvas.style.cursor = 'pointer'
    return () => { canvas.style.cursor = '' }
  }, [canvas, hovered])
  useEffect(() => () => { highlightMaterials.forEach(material => material.dispose()); indicatorMaterials.forEach(material => material.dispose()) }, [highlightMaterials, indicatorMaterials])
  useEffect(() => {
    if (kind !== 'examination') return
    pulse.current = { active: standbyRun > 0 && !reducedMotion, started: performance.now() }
    indicatorMaterials.forEach(material => { material.emissiveIntensity = scanning ? 1.2 : .65 })
    canvas.dataset.scannerAnimation = standbyRun === 0 ? 'idle' : reducedMotion ? 'static' : 'running'
    invalidate()
  }, [standbyRun, reducedMotion, kind, indicatorMaterials, canvas, invalidate, scanning])
  useFrame(state => {
    if (!pulse.current.active) return
    const progress = Math.min((performance.now() - pulse.current.started) / 1600, 1)
    indicatorMaterials.forEach(material => { material.emissiveIntensity = .65 + Math.sin(progress * Math.PI) * .45 })
    if (progress === 1) { pulse.current.active = false; canvas.dataset.scannerAnimation = 'complete' }
    state.invalidate()
  })
  const interactive = kind !== 'overview'
  function pick(event: ThreeEvent<MouseEvent>) {
    if (!interactive || event.delta > 5) return
    event.stopPropagation()
    onSelect(kind)
  }
  return <group name={`interactive-${kind}`} onClick={pick} onPointerOver={event => { if (interactive) { event.stopPropagation(); setHovered(true) } }} onPointerOut={() => setHovered(false)}>
    <primitive object={scene} dispose={null} />
  </group>
}

export function MedicalBayEnvironment({ quality, view, onSelect, onLoaded, reducedMotion, standbyRun, warmup = false, liveDisplay = false, crewId='crew-01', prepareReady=true }: { quality: QualityTier; view: CameraView; onSelect: (view: CameraView) => void; onLoaded: () => void; reducedMotion: boolean; standbyRun: number; warmup?: boolean; liveDisplay?: boolean; crewId?:string; prepareReady?:boolean }) {
  const clinical=useClinical(crewId)
  const { gl, scene: world, camera, invalidate } = useThree()
  const [compileError, setCompileError] = useState<Error | null>(null)
  const models = use(getEnvironmentResource(quality))
  const materials = useMemo(() => createBayMaterials(models), [models])
  useEffect(() => () => disposeBayMaterials(materials), [materials])
  const registry = useMemo(() => createStationRegistry(), [])
  useEffect(() => {
    const unregisterBed = registry.register({ stationId: 'vitals', nodeName: 'anchor_vitals', label: 'Examination station', anchor: [-.4, 1.7, -.2] })
    const unregisterEquipment = registry.register({ stationId: 'diagnostics', nodeName: 'anchor_diagnostics', label: 'Diagnostic trolley', anchor: [2.1, 2.35, -2.2] })
    let cancelled = false
    if (warmup && prepareReady) {
      // compileAsync alone doesn't initialize uniforms, textures or shadow programs.
      // Prepare every mesh once behind the responsive loading interface, not on first navigation.
      const prepare = async () => {
        await new Promise<void>(resolve => requestAnimationFrame(() => resolve()))
        if (cancelled) return
        const textures = new Set<Texture>()
        materials.forEach(material => Object.values(material).forEach(value => { if (value instanceof Texture) textures.add(value) }))
        world.traverse(o=>{if(o instanceof Mesh)for(const material of Array.isArray(o.material)?o.material:[o.material])Object.values(material).forEach(value=>{if(value instanceof Texture)textures.add(value)})})
        for (const texture of textures) gl.initTexture(texture)
        const culling = new Map<Mesh,boolean>()
        world.traverse(object => { if (object instanceof Mesh) { culling.set(object,object.frustumCulled); object.frustumCulled=false } })
        const previous = gl.getRenderTarget()
        const layerMask=camera.layers.mask;camera.layers.enable(1)
        const warmTarget = new WebGLRenderTarget(128,128)
        const patient=world.getObjectByName('licensed-examination-patient'),patientVisible=patient?.visible
        if(patient)patient.visible=true
        try {
          // Render targets use different tone-mapping/output programs. Compile
          // those asynchronously too; otherwise warmup links them on first draw.
          gl.setRenderTarget(warmTarget)
          const offscreenPrograms=gl.compileAsync(world,camera)
          gl.setRenderTarget(previous)
          await offscreenPrograms
          if(cancelled)return
          gl.setRenderTarget(warmTarget);gl.shadowMap.needsUpdate=true;gl.render(world,camera)
          // Offscreen programs omit display tone mapping. Exercise the real
          // default-framebuffer variants too, behind the loading interface.
          gl.setRenderTarget(previous)
          await gl.compileAsync(world,camera)
          if(cancelled)return
          gl.setViewport(0,0,128,128);gl.render(world,camera)
        }
        finally { if(patient)patient.visible=patientVisible!;camera.layers.mask=layerMask;gl.setRenderTarget(previous);const size=gl.getSize(new Vector2());gl.setViewport(0,0,size.x,size.y);warmTarget.dispose(); culling.forEach((culled,mesh)=>{mesh.frustumCulled=culled}) }
        if (!cancelled) { onLoaded(); invalidate() }
      }
      void prepare().catch(error => { if (!cancelled) setCompileError(error instanceof Error ? error : new Error('GPU preparation failed')) })
    } else if(!warmup) { gl.shadowMap.needsUpdate = true; onLoaded() }
    return () => { cancelled = true; unregisterBed(); unregisterEquipment() }
  }, [onLoaded, registry, gl, world, camera, invalidate, warmup, quality, materials, prepareReady])
  const kinds: CameraView[] = ['overview', 'examination', 'equipment']
  if (compileError) throw compileError
  return <group name="medical-bay-vertical-slice">{models.map((model, index) => <ModelInstance key={kinds[index]} model={model} materials={materials} kind={kinds[index]!} selected={view === kinds[index]} onSelect={onSelect} reducedMotion={reducedMotion} standbyRun={standbyRun} liveDisplay={liveDisplay} occupied={clinical.examination!=='EMPTY_BED'} scanning={clinical.examination==='SCAN_ACTIVE'} />)}</group>
}

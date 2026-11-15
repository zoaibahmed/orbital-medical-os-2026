import { useEffect } from 'react'
import { useThree } from '@react-three/fiber'
import { Box3, Mesh, Raycaster, SkinnedMesh, Texture, Vector3, type Camera, type Object3D } from 'three'
import './probeStore'

let rendererCount = 0
const identities = new WeakMap<object, string>()

/** Opt-in measurement only. CPU submission is not a GPU-completion timer. */
export function RuntimeProbe() {
  const { gl, scene, camera } = useThree()
  useEffect(() => {
    let id = identities.get(gl)
    if (!id) { id = `renderer-${++rendererCount}`; identities.set(gl, id) }
    gl.domElement.dataset.rendererInstance = id
    const probe = window.__orbitalProbe
    if (!probe) return
    probe.lifecycles.push({ id, event: 'mount', time: performance.now() })
    const context = gl.getContext()
    const debug = context.getExtension('WEBGL_debug_renderer_info')
    probe.renderer = debug ? context.getParameter(debug.UNMASKED_RENDERER_WEBGL) : context.getParameter(context.RENDERER)
    probe.parallelCompile = !!context.getExtension('KHR_parallel_shader_compile')
    probe.projectPoint=point=>{const p=new Vector3().fromArray(point).project(camera),rect=gl.domElement.getBoundingClientRect();return{x:rect.left+(p.x+1)*rect.width/2,y:rect.top+(1-p.y)*rect.height/2}}
    probe.patientSnapshot=()=>{
      const patient=scene.getObjectByName('licensed-examination-patient')
      if(!patient)return null
      const meshes:Array<{name:string;bones:number;vertices:number;morph:number}>=[]
      patient.traverse(o=>{if(o instanceof SkinnedMesh)meshes.push({name:o.name,bones:o.skeleton.bones.length,vertices:o.geometry.getAttribute('position').count,morph:o.morphTargetInfluences?.[o.morphTargetDictionary?.Respiration??-1]??0})})
      const b=new Box3().setFromObject(patient,true)
      return {visible:patient.visible,bounds:[b.min.toArray(),b.max.toArray()],meshes}
    }
    probe.scannerSnapshot=()=>{
      const gantry=scene.getObjectByName('physical-scanner-gantry')
      if(!gantry)return null
      gantry.updateWorldMatrix(true,true)
      const part=gantry.children.find(o=>o instanceof Mesh) as Mesh|undefined
      if(!part)return null
      const index=part.geometry.index,vertex=new Vector3().fromBufferAttribute(part.geometry.getAttribute('position'),index?.getX(0)??0).applyMatrix4(part.matrixWorld)
      const sheet=scene.getObjectByName('examination-light-sheet')
      let assemblies=0;scene.traverse(o=>{if(o.name==='physical-scanner-gantry')assemblies++})
      return {assemblies,offset:gantry.getWorldPosition(new Vector3()).z,vertex:vertex.toArray(),parts:gantry.children.length,triangles:gantry.children.reduce((sum,o)=>sum+(o instanceof Mesh?(o.geometry.index?.count??0)/3:0),0),sheetZ:sheet?.getWorldPosition(new Vector3()).z??null}
    }
    probe.checkClearance = positions => {
      const radius=.16, blocked:number[]=[]
      const ray=new Raycaster(new Vector3(),new Vector3(),0,radius)
      const directions=[new Vector3(1,0,0),new Vector3(-1,0,0),new Vector3(0,1,0),new Vector3(0,-1,0),new Vector3(0,0,1),new Vector3(0,0,-1)]
      scene.updateMatrixWorld(true)
      positions.forEach((position,i)=>{ if(directions.some(direction=>{ray.set(new Vector3().fromArray(position),direction);return ray.intersectObjects(scene.children,true).length>0}))blocked.push(i) })
      return {blocked,radius}
    }
    probe.resourceSnapshot = () => {
      const geometries = new Set<string>(), materials = new Set<string>(), textures = new Set<string>()
      scene.traverse(object => {
        if (!(object instanceof Mesh)) return
        geometries.add(object.geometry.uuid)
        for (const material of Array.isArray(object.material) ? object.material : [object.material]) {
          materials.add(material.uuid)
          for (const value of Object.values(material)) if (value instanceof Texture) textures.add(value.uuid)
        }
      })
      return { geometries: [...geometries].sort(), materials: [...materials].sort(), textures: [...textures].sort() }
    }
    const original = gl.render
    let accumulated={time:0,cpuMs:0,calls:0,triangles:0}
    function measured(scene: Object3D, camera: Camera) {
      const start = performance.now()
      original.call(gl, scene, camera)
      if(!probe?.active){accumulated={time:0,cpuMs:0,calls:0,triangles:0};return}
      accumulated.time||=start;accumulated.cpuMs+=performance.now()-start;accumulated.calls+=gl.info.render.calls;accumulated.triangles+=gl.info.render.triangles
      // Count presented frames, never the cache/composite passes as extra FPS.
      if(gl.domElement.dataset.renderPass==='cache'||gl.domElement.dataset.renderPass==='compose')return
      if (probe.frames.length < 12000) probe.frames.push({ ...accumulated, geometries: gl.info.memory.geometries, textures: gl.info.memory.textures, position: camera.position.toArray(), visible: document.visibilityState === 'visible', moving: gl.domElement.dataset.cameraTransition === 'moving' })
      accumulated={time:0,cpuMs:0,calls:0,triangles:0}
    }
    gl.render = measured
    return () => {
      if (gl.render === measured) gl.render = original
      probe.lifecycles.push({ id, event: 'unmount', time: performance.now() })
      probe.resourceSnapshot = undefined
      probe.checkClearance = undefined
      probe.patientSnapshot = undefined
      probe.scannerSnapshot = undefined
      probe.projectPoint = undefined
    }
  }, [gl, scene, camera])
  return null
}

import { DataTexture, Mesh, MeshStandardMaterial, RepeatWrapping, Texture } from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { recordResource } from '../quality/probeStore'

const slots = ['map','normalMap','roughnessMap','metalnessMap','emissiveMap','aoMap'] as const
/** Instance-owned clones preserve authored linear colours, PBR response and UV scale. */
export function createBayMaterials(models: GLTF[]): Map<string, MeshStandardMaterial> {
  recordResource('material-set-created')
  const materials = new Map<string, MeshStandardMaterial>()
  const textures = new Map<Texture,Texture>()
  let weave:DataTexture|undefined
  models.forEach(model => model.scene.traverse(object => {
    if (!(object instanceof Mesh) || !(object.material instanceof MeshStandardMaterial)) return
    const name = object.material.name
    if (materials.has(name)) return
    const material = object.material.clone()
    for (const slot of slots) {
      const source = material[slot]
      if (!source) continue
      if (!textures.has(source)) {
        const texture = source.clone()
        texture.anisotropy = 2
        texture.needsUpdate = true
        textures.set(source,texture)
      }
      material[slot] = textures.get(source)!
    }
    // Preserve authored colours/large-scale maps. Tiny, seamless weave adds
    // tangent-space detail only to previously smooth rubber/textile surfaces.
    if(['Restraint webbing','Layered silicone edge seal'].includes(name)&&!material.normalMap){
      if(!weave){const size=64,pixels=new Uint8Array(size*size*4);for(let y=0;y<size;y++)for(let x=0;x<size;x++){const i=(y*size+x)*4;pixels[i]=128+Math.round(Math.sin(y*Math.PI/2)*7);pixels[i+1]=128+Math.round(Math.sin(x*Math.PI/2)*7);pixels[i+2]=255;pixels[i+3]=255}weave=new DataTexture(pixels,size,size);weave.wrapS=weave.wrapT=RepeatWrapping;weave.repeat.set(6,6);weave.generateMipmaps=true;weave.needsUpdate=true}
      material.normalMap=weave;material.normalScale.setScalar(name==='Restraint webbing'?.28:.08)
    }
    if(name==='Recess and gasket'){material.metalness=.02;material.roughness=.78}
    if(name==='Dark optical glass'){material.metalness=0;material.roughness=.12}
    if(name==='Coated pressure frame'){material.metalness=.28;material.roughness=.52}
    if(name==='Graphite enamel')material.metalness=.08
    if(name==='Medical upholstery')material.normalScale.setScalar(.16)
    materials.set(name,material)
  }))
  return materials
}
export function disposeBayMaterials(materials: Map<string, MeshStandardMaterial>) {
  const textures = new Set<Texture>()
  materials.forEach(material => {
    for (const slot of slots) { const texture=material[slot]; if(texture) textures.add(texture) }
    material.dispose()
  })
  textures.forEach(texture => texture.dispose())
}

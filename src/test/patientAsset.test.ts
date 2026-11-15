import {readFileSync} from 'node:fs'
import {createHash} from 'node:crypto'
import {describe,it,expect} from 'vitest'
import metadata from '../scene/assets/patient-manifest.json'

describe('delivered licensed patient asset',()=>{
 it('contains actual skinned geometry and bounded anterior chest deformation',()=>{
  const buffer=readFileSync('public/assets/models/patient/patient-examination.glb'),length=buffer.readUInt32LE(12),gltf=JSON.parse(buffer.subarray(20,20+length).toString('utf8')),binary=28+length
  expect(createHash('sha256').update(buffer).digest('hex')).toBe(metadata.sha256)
  expect(gltf.skins[0].joints).toHaveLength(163);expect(gltf.meshes).toHaveLength(5)
  let targets=0
  for(const mesh of gltf.meshes)for(const primitive of mesh.primitives){
   expect(primitive.attributes.JOINTS_0).toBeDefined();expect(primitive.attributes.WEIGHTS_0).toBeDefined()
   for(const target of primitive.targets??[]){
    targets++;const accessor=gltf.accessors[target.POSITION],values=new Float32Array(accessor.count*3)
    if(accessor.bufferView!==undefined){const view=gltf.bufferViews[accessor.bufferView],offset=binary+(view.byteOffset??0)+(accessor.byteOffset??0),stride=view.byteStride??12;for(let i=0;i<accessor.count;i++)for(let k=0;k<3;k++)values[i*3+k]=buffer.readFloatLE(offset+i*stride+k*4)}
    if(accessor.sparse){const sparse=accessor.sparse,iv=gltf.bufferViews[sparse.indices.bufferView],vv=gltf.bufferViews[sparse.values.bufferView],io=binary+(iv.byteOffset??0)+(sparse.indices.byteOffset??0),vo=binary+(vv.byteOffset??0)+(sparse.values.byteOffset??0),bytes=sparse.indices.componentType===5121?1:sparse.indices.componentType===5123?2:4;for(let i=0;i<sparse.count;i++){const index=buffer.readUIntLE(io+i*bytes,bytes);for(let k=0;k<3;k++)values[index*3+k]=buffer.readFloatLE(vo+i*12+k*4)}}
    let max=0
    for(let i=0;i<accessor.count;i++){expect(Math.abs(values[i*3]!)).toBeLessThan(1e-6);expect(Math.abs(values[i*3+2]!)).toBeLessThan(1e-6);const dy=values[i*3+1]!;expect(dy).toBeGreaterThanOrEqual(-1e-6);max=Math.max(max,dy)}
    expect(max).toBeGreaterThan(.0025);expect(max).toBeLessThanOrEqual(.00301)
   }
  }
  expect(targets).toBe(2);expect(readFileSync('public/assets/licenses/MAKEHUMAN-PATIENT-CC0.md','utf8')).toContain('CC0')
 })
})

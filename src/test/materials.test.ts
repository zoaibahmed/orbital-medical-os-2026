import { describe, expect, it } from 'vitest'
import { Group, Mesh, MeshStandardMaterial, BoxGeometry, Texture, Color } from 'three'
import type { GLTF } from 'three/addons/loaders/GLTFLoader.js'
import { createBayMaterials, disposeBayMaterials } from '../scene/environment/materials'

describe('authored medical material contract',()=>{
 it('separates rubber and optical response without mutating source materials',()=>{
  const scene=new Group(),geometry=new BoxGeometry(),rubber=new MeshStandardMaterial({metalness:.25}),glass=new MeshStandardMaterial({metalness:.35});rubber.name='Recess and gasket';glass.name='Dark optical glass';scene.add(new Mesh(geometry,rubber),new Mesh(geometry,glass));const materials=createBayMaterials([{scene} as unknown as GLTF]);expect(materials.get(rubber.name)!.metalness).toBe(.02);expect(materials.get(glass.name)!.metalness).toBe(0);expect(rubber.metalness).toBe(.25);disposeBayMaterials(materials);geometry.dispose();rubber.dispose();glass.dispose()
 })
 it('preserves warm ceramic response and texture scale without mutating the cached source',()=>{
  const source=new MeshStandardMaterial({color:new Color('#d8d0bb'),roughness:.31,metalness:.08})
  source.name='Ceramic medical shell'
  const map=new Texture();map.repeat.set(.8,.8);source.roughnessMap=map
  const scene=new Group();const geometry=new BoxGeometry();scene.add(new Mesh(geometry,source))
  const materials=createBayMaterials([{scene} as unknown as GLTF]);const result=materials.get(source.name)!
  expect(result.color.equals(source.color)).toBe(true)
  expect(result.roughness).toBe(.31);expect(result.metalness).toBe(.08)
  expect(result.roughnessMap?.repeat.toArray()).toEqual([.8,.8])
  expect(result.roughnessMap).not.toBe(map)
  disposeBayMaterials(materials)
  expect(source.color.getHexString()).toBe('d8d0bb');expect(map.repeat.toArray()).toEqual([.8,.8])
  geometry.dispose();source.dispose();map.dispose()
 })
})

import { BufferAttribute, Mesh, MeshStandardMaterial, Vector3 } from 'three'

/** Partition only the two measured flat bed straps and their buckles. The source
 * GLB stays immutable. Released copies hang outside the port rail. */
export function releaseBedRestraints(scene: import('three').Object3D) {
  const pairs: Array<{mesh: Mesh; original: import('three').BufferGeometry; released: import('three').BufferGeometry; stowed: Mesh}> = []
  scene.updateMatrixWorld(true)
  const meshes:Mesh[]=[];scene.traverse(o=>{if(o instanceof Mesh)meshes.push(o)})
  for(const object of meshes){
    if (!(object.material instanceof MeshStandardMaterial)) continue
    const name=object.material.name
    if (!['Restraint webbing','Upholstery seam thread','Satin aluminium','Ochre anodized service fittings','Recess and gasket'].includes(name)) continue
    const geometry=object.geometry,index=geometry.index,position=geometry.getAttribute('position')
    if (!index) continue
    const keep:number[]=[],remove:number[]=[],p=new Vector3()
    for(let i=0;i<index.count;i+=3){
      const ids=[index.getX(i),index.getX(i+1),index.getX(i+2)]
      const band=ids.every(id=>{
        p.fromBufferAttribute(position,id).applyMatrix4(object.matrixWorld)
        const longitudinal=Math.abs(p.z+.20)<.042||Math.abs(p.z-.59)<.042
        const textile=name==='Restraint webbing'||name==='Upholstery seam thread'
        return longitudinal && (textile ? p.x>=-1.025&&p.x<=.225&&p.y>=.93&&p.y<=1.125 : p.x>=-.15&&p.x<=-.01&&p.y>=1.10&&p.y<=1.16)
      })
      ;(band?remove:keep).push(...ids)
    }
    if(!remove.length)continue
    const released=geometry.clone();released.setIndex(keep)
    const hanging=geometry.clone();hanging.setIndex(remove)
    const moved=position.clone(),inverse=object.matrixWorld.clone().invert()
    for(const id of new Set(remove)){
      p.fromBufferAttribute(position,id).applyMatrix4(object.matrixWorld)
      p.set(-1.035-(p.y-.94)*.15,.94-(p.x+1.01)*.5,p.z).applyMatrix4(inverse)
      moved.setXYZ(id,p.x,p.y,p.z)
    }
    hanging.setAttribute('position',new BufferAttribute(new Float32Array(moved.array),3));hanging.computeVertexNormals();hanging.computeBoundingSphere()
    const stowed=new Mesh(hanging,object.material);stowed.name='Released restraint / port rail';stowed.castShadow=true;stowed.receiveShadow=true;stowed.visible=false
    object.add(stowed);pairs.push({mesh:object,original:geometry,released,stowed})
  }
  return {
    triangles:pairs.reduce((sum,p)=>sum+(p.stowed.geometry.index?.count??0)/3,0),
    setOccupied(occupied:boolean){for(const p of pairs){p.mesh.geometry=occupied?p.released:p.original;p.stowed.visible=occupied}},
    dispose(){for(const p of pairs){p.released.dispose();p.stowed.geometry.dispose();p.stowed.removeFromParent()}}
  }
}

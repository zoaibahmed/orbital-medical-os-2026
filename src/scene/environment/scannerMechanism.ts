import { Box3, BoxGeometry, Group, Matrix4, Mesh, MeshStandardMaterial, Sphere, Vector3, type BufferGeometry, type Object3D } from 'three'
import { scannerClearancePoint, scannerTravel } from './scannerMeasurements'

/** Measured from the accepted examination GLB and its reference/high-bed authoring.
 * Runtime metres, +Z = head to feet. No original GLB buffers are modified. */
export function isScannerVertex(x:number,y:number,z:number){
  return z>=-1.93&&z<=-.70&&y<=2.40&&(x< -1.17||x>.37||(y>=.985&&Math.hypot(x+.4,y-1)>=.75))
}

export function separateScannerAssembly(scene:Object3D){
  scene.updateMatrixWorld(true)
  const moving=new Group();moving.name='physical-scanner-gantry'
  const inverse=scene.matrixWorld.clone().invert(),point=new Vector3(),worldMatrix=new Matrix4()
  const parts:Array<{mesh:Mesh;source:BufferGeometry;fixed:BufferGeometry;travelling:BufferGeometry}>=[]
  const meshes:Mesh[]=[];scene.traverse(object=>{if(object instanceof Mesh)meshes.push(object)})
  let triangles=0
  const bounds=new Box3().makeEmpty()
  for(const mesh of meshes){
    const source=mesh.geometry,index=source.index,position=source.getAttribute('position')
    if(!index)continue
    const keep:number[]=[],travel:number[]=[]
    for(let i=0;i<index.count;i+=3){
      let belongs=true
      for(let j=0;j<3;j++){
        point.fromBufferAttribute(position,index.getX(i+j)).applyMatrix4(mesh.matrixWorld)
        if(!isScannerVertex(point.x,point.y,point.z)){belongs=false;break}
      }
      const target=belongs?travel:keep
      target.push(index.getX(i),index.getX(i+1),index.getX(i+2))
    }
    if(!travel.length)continue
    // Own the partition geometry; the cached source buffers remain immutable.
    const fixed=source.clone();fixed.setIndex(keep)
    const travelling=source.clone();travelling.setIndex(travel)
    const travellingPosition=travelling.getAttribute('position'),local=mesh.matrixWorld.clone().invert(),partBounds=new Box3().makeEmpty()
    for(const id of new Set(travel)){
      point.fromBufferAttribute(position,id).applyMatrix4(mesh.matrixWorld)
      point.fromArray(scannerClearancePoint(point.x,point.y,point.z))
      bounds.expandByPoint(point);point.applyMatrix4(local);partBounds.expandByPoint(point)
      travellingPosition.setXYZ(id,point.x,point.y,point.z)
    }
    travelling.computeVertexNormals()
    // Only indexed gantry vertices define its culling volume, rather than all
    // unused bed vertices retained in this material batch's position buffer.
    travelling.boundingBox=partBounds;travelling.boundingSphere=partBounds.getBoundingSphere(new Sphere())
    mesh.geometry=fixed
    const part=new Mesh(travelling,mesh.material);part.name=`gantry/${mesh.name}`
    worldMatrix.multiplyMatrices(inverse,mesh.matrixWorld);part.matrix.copy(worldMatrix);part.matrixAutoUpdate=false
    part.layers.set(1);part.castShadow=false;part.receiveShadow=true
    moving.add(part);triangles+=travel.length/3;parts.push({mesh,source,fixed,travelling})
  }
  scene.add(moving)
  const size=bounds.getSize(new Vector3())
  if(triangles<2000||size.x<1.5||size.y<1.5){
    for(const p of parts){p.mesh.geometry=p.source;p.fixed.dispose();p.travelling.dispose()}
    moving.removeFromParent();throw new Error('The measured scanner assembly could not be isolated safely')
  }
  // Low-profile linear guide channels fit below the measured pedestal gaskets
  // (bottom y=.06). They sit outside the bed/lift envelope and stay fixed.
  const rails=new Group();rails.name='scanner-fixed-linear-guides'
  const railGeometry=new BoxGeometry(.15,.022,scannerTravel.endZ+.88)
  const railMaterial=meshes.flatMap(m=>Array.isArray(m.material)?m.material:[m.material]).find(m=>m instanceof MeshStandardMaterial&&m.name==='Satin aluminium')
  for(const x of scannerTravel.railCenters){
    const rail=new Mesh(railGeometry,railMaterial);rail.name='Recessed gantry guide rail'
    rail.position.set(x,.049,-1.34+scannerTravel.endZ/2);rail.castShadow=false;rail.receiveShadow=true;rails.add(rail)
  }
  scene.add(rails)
  let travelling:boolean|undefined
  const setTravelling=(active:boolean)=>{
    if(travelling===active)return false
    travelling=active
    for(const object of moving.children){
      const part=object as Mesh,materials=Array.isArray(part.material)?part.material:[part.material]
      part.layers.set(active||materials.some(m=>m.transparent||m.name==='Scanner sensing indicator')?1:0)
    }
    return true
  }
  setTravelling(false)
  return {moving,triangles,bounds,
    move(offset:number){moving.position.z=offset;moving.updateMatrixWorld(true)},
    setTravelling,
    // Retain owned topology through StrictMode's cleanup/setup probe. The
    // primitive removes this graph on real unmount; shared GLB data stays intact.
    dispose(){for(const p of parts){p.fixed.dispose();p.travelling.dispose()}railGeometry.dispose()},
  }
}

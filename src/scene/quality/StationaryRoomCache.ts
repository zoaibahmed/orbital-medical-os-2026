import { AlwaysDepth, DepthTexture, HalfFloatType, Mesh, OrthographicCamera, PlaneGeometry, Scene, ShaderMaterial, UnsignedIntType, Vector2, WebGLRenderTarget, type Camera, type WebGLRenderer } from 'three'

/** Cache actual room colour AND depth only while the camera is stationary.
 * Patient/display/indicators remain live, depth-tested geometry. HDR storage
 * preserves display tone mapping, applied exactly once by the composite. */
export class StationaryRoomCache {
 private target:WebGLRenderTarget
 private screen=new Scene()
 private camera=new OrthographicCamera(-1,1,1,-1,0,1)
 private geometry=new PlaneGeometry(2,2)
 private material:ShaderMaterial
 private size=new Vector2()
 private key=''
 constructor(){
  this.target=new WebGLRenderTarget(1,1,{type:HalfFloatType,depthBuffer:true})
  this.target.depthTexture=new DepthTexture(1,1,UnsignedIntType)
  this.material=new ShaderMaterial({uniforms:{colour:{value:this.target.texture},depth:{value:this.target.depthTexture}},vertexShader:'varying vec2 vUv; void main(){vUv=uv;gl_Position=vec4(position.xy,0.0,1.0);}',fragmentShader:'uniform sampler2D colour;uniform sampler2D depth;varying vec2 vUv;void main(){gl_FragColor=texture2D(colour,vUv);gl_FragDepth=texture2D(depth,vUv).r;if(gl_FragDepth<1.0){\n#include <tonemapping_fragment>\n}\n#include <colorspace_fragment>\n}',depthTest:false,depthWrite:true})
  this.material.depthTest=true;this.material.depthFunc=AlwaysDepth
  this.screen.add(new Mesh(this.geometry,this.material))
 }
 render(gl:WebGLRenderer,scene:Scene,camera:Camera){
  gl.getDrawingBufferSize(this.size)
  const key=`${camera.matrixWorld.elements.join(',')}:${camera.projectionMatrix.elements.join(',')}:${this.size.x}:${this.size.y}:${gl.domElement.dataset.sceneRevision??0}`
  const mask=camera.layers.mask,background=scene.background,autoClear=gl.autoClear,target=gl.getRenderTarget()
  try{
   if(key!==this.key||gl.shadowMap.needsUpdate){
    if(this.target.width!==this.size.x||this.target.height!==this.size.y)this.target.setSize(this.size.x,this.size.y)
    camera.layers.set(0);gl.autoClear=true;gl.setRenderTarget(this.target);gl.domElement.dataset.renderPass='cache';gl.render(scene,camera);gl.setRenderTarget(target);this.key=key
    gl.domElement.dataset.roomCacheBuilds=String(Number(gl.domElement.dataset.roomCacheBuilds??0)+1)
   }
   gl.autoClear=true;gl.domElement.dataset.renderPass='compose';gl.render(this.screen,this.camera)
   scene.background=null;gl.autoClear=false;camera.layers.set(1);gl.domElement.dataset.renderPass='present';gl.render(scene,camera)
  }finally{camera.layers.mask=mask;scene.background=background;gl.autoClear=autoClear;gl.setRenderTarget(target)}
 }
 prepare(gl:WebGLRenderer){return gl.compileAsync(this.screen,this.camera)}
 dispose(){this.target.dispose();this.target.depthTexture?.dispose();this.geometry.dispose();this.material.dispose()}
}

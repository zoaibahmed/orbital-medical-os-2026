import bpy, json, math, os, hashlib
from pathlib import Path
from mathutils import Vector,Matrix,Quaternion
from mathutils.bvhtree import BVHTree
ROOT=Path(__file__).resolve().parents[1];SRC=ROOT/'assets/source/patient';OUT=ROOT/'public/assets/models/patient';OUT.mkdir(parents=True,exist_ok=True)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
# Parse source without invoking/redistributing MakeHuman application code.
def parse_obj(path):
 v=[];uv=[];faces=[];groups=[];group=''
 for line in path.read_text().splitlines():
  a=line.split()
  if not a:continue
  if a[0]=='v':v.append(Vector(tuple(map(float,a[1:4]))))
  elif a[0]=='vt':uv.append(tuple(map(float,a[1:3])))
  elif a[0]=='g':group=a[1]
  elif a[0]=='f':faces.append([(int(x.split('/')[0])-1,int(x.split('/')[1])-1 if '/' in x and x.split('/')[1] else 0) for x in a[1:]]);groups.append(group)
 return v,uv,faces,groups
base,uv,faces,groups=parse_obj(SRC/'base.obj');rig=json.loads((SRC/'default.mhskel').read_text());weights=json.loads((SRC/'default_weights.mhw').read_text())['weights']
vertex_weights=[{} for v in base]
for bone,rows in weights.items():
 for index,w in rows:vertex_weights[index][bone]=w
S=.105
upright=lambda v:Vector((v.x*S,-v.z*S,v.y*S))
def make(name,verts,uv,faces):
 used=sorted(set(i for f in faces for i,t in f));lookup={v:i for i,v in enumerate(used)}
 mesh=bpy.data.meshes.new(name);mesh.from_pydata([upright(verts[i]) for i in used],[],[[lookup[i] for i,t in f] for f in faces]);mesh.update()
 layer=mesh.uv_layers.new(name='UVMap')
 for polygon,face in zip(mesh.polygons,faces):
  polygon.use_smooth=True
  for loop,(index,t) in zip(polygon.loop_indices,face):layer.data[loop].uv=uv[t]
 obj=bpy.data.objects.new(name,mesh);bpy.context.collection.objects.link(obj)
 return obj,used
# Fit garment/eyes/hair by their authored barycentric binding, not arbitrary mesh offsets.
def fitted(path,objpath):
 v,uv,f,g=parse_obj(objpath);lines=path.read_text().splitlines();start=next(i for i,x in enumerate(lines) if x.startswith('verts '))+1
 rows=[];scales=[1.,1.,1.]
 for line in lines[:start]:
  a=line.split()
  if a and a[0] in ['x_scale','y_scale','z_scale']:
   axis={'x_scale':0,'y_scale':1,'z_scale':2}[a[0]];scales[axis]=abs(base[int(a[1])][axis]-base[int(a[2])][axis])/float(a[3])
 for line in lines[start:]:
  a=line.split()
  if not a or a[0].startswith('#'):continue
  try:
   if len(a)>=9:
    ids=list(map(int,a[:3]));ws=list(map(float,a[3:6]));off=list(map(float,a[6:9]));rows.append((ids,ws,off))
   elif len(a)==1 and a[0].isdigit():rows.append(([int(a[0])],[1.],[0,0,0]))
   else:break
  except ValueError:break
 assert len(rows)==len(v),(str(path),len(rows),len(v))
 fitted=[];vw=[]
 for ids,ws,offset in rows:
  fitted.append(sum((base[i]*w for i,w in zip(ids,ws)),Vector())+Vector([offset[k]*scales[k] for k in range(3)]))
  out={}
  for i,w in zip(ids,ws):
   for b,bw in vertex_weights[i].items():out[b]=out.get(b,0)+w*bw
  vw.append(out)
 return fitted,uv,f,vw
# Source skin and garment maps are the official CC0 system assets. Resize for runtime.
def image(path,size=1024):
 im=bpy.data.images.load(str(path),check_existing=True)
 if max(im.size)>size:im.scale(size,size)
 im.pack();return im

def mat(name,color,rough=.65,texture=None,normal=None,alpha=False):
 m=bpy.data.materials.new(name);m.use_nodes=True;p=m.node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Roughness'].default_value=rough
 if texture:
  n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=image(texture);m.node_tree.links.new(n.outputs['Color'],p.inputs['Base Color'])
  if alpha:m.node_tree.links.new(n.outputs['Alpha'],p.inputs['Alpha']);m.surface_render_method='DITHERED'
 if normal:
  n=m.node_tree.nodes.new('ShaderNodeTexImage');n.image=image(normal,512);n.image.colorspace_settings.name='Non-Color';node=m.node_tree.nodes.new('ShaderNodeNormalMap');node.inputs['Strength'].default_value=.35;m.node_tree.links.new(n.outputs['Color'],node.inputs['Color']);m.node_tree.links.new(node.outputs['Normal'],p.inputs['Normal'])
 return m
skin=mat('Patient skin / CC0 MakeHuman',(.52,.32,.22),.63,SRC/'system/skins/young_caucasian_male/young_lightskinned_male_diffuse.png')
cloth=mat('Orbital examination uniform / woven textile',(.08,.20,.21),.86,None,SRC/'system/clothes/male_casualsuit01/male_casualsuit01_normal.png')
# Keep medical uniform restrained. Original normal detail carries fabric seams/folds.
hairmat=mat('Short cropped hair',(.045,.029,.021),.85,SRC/'system/hair/short01/short01_diffuse.png',alpha=True)
browmat=mat('Natural brows',(.04,.02,.015),.8,SRC/'system/eyebrows/eyebrow001/eyebrow001.png',alpha=True)
eyemat=mat('Brown patient eyes',(.5,.4,.3),.23,SRC/'brown_eye.png')
# Use MHCLO delete mask to prevent hidden skin intersecting the fitted garment.
clopath=SRC/'system/clothes/male_casualsuit01/male_casualsuit01.mhclo';clines=clopath.read_text().splitlines();deleted=set()
if 'delete_verts' in clines:
 for line in clines[clines.index('delete_verts')+1:]:
  a=line.replace('-',' - ').split();last=None;i=0
  while i<len(a):
   if a[i].isdigit():deleted.add(int(a[i]));last=int(a[i])
   elif a[i]=='-' and last is not None and i+1<len(a) and a[i+1].isdigit():deleted.update(range(last,int(a[i+1])+1));i+=1
   i+=1
body,used=make('Patient detailed head hands and body',base,uv,[f for f,g in zip(faces,groups) if g=='body' and not all(i in deleted for i,t in f)]);body.data.materials.append(skin);objects=[(body,[vertex_weights[i] for i in used])]
for name,path,objpath,material in [('Patient uniform',clopath,clopath.with_suffix('.obj'),cloth),('Patient cropped hair',SRC/'system/hair/short01/short01.mhclo',SRC/'system/hair/short01/short01.obj',hairmat),('Patient brows',SRC/'system/eyebrows/eyebrow001/eyebrow001.mhclo',SRC/'system/eyebrows/eyebrow001/eyebrow001.obj',browmat),('Patient eyes',SRC/'high-poly.mhclo',SRC/'high-poly.obj',eyemat)]:
 v,u,f,w=fitted(path,objpath);o,ix=make(name,v,u,f);o.data.materials.append(material);objects.append((o,[w[i] for i in ix]))
armdata=bpy.data.armatures.new('MakeHuman CC0 articulated patient rig');arm=bpy.data.objects.new('PatientRig',armdata);bpy.context.collection.objects.link(arm);bpy.context.view_layer.objects.active=arm;arm.select_set(True);bpy.ops.object.mode_set(mode='EDIT')
def joint(key):return upright(sum((base[i] for i in rig['joints'][key]),Vector())/len(rig['joints'][key]))
for name,b in rig['bones'].items():
 bone=armdata.edit_bones.new(name);bone.head=joint(b['head']);bone.tail=joint(b['tail'])
 if (bone.tail-bone.head).length<.0001:bone.tail.z+=.001
for name,b in rig['bones'].items():
 if b['parent']:armdata.edit_bones[name].parent=armdata.edit_bones[b['parent']]
bpy.ops.object.mode_set(mode='OBJECT')
for obj,vertices in objects:
 for i,ws in enumerate(vertices):
  clean=sorted([(b,max(0,w)) for b,w in ws.items() if b in rig['bones'] and w>0],key=lambda x:-x[1])[:4];total=sum(w for b,w in clean)
  if not total:clean=[('root',1.)];total=1
  for b,w in clean:
   group=obj.vertex_groups.get(b) or obj.vertex_groups.new(name=b);group.add([i],w/total,'REPLACE')
 mod=obj.modifiers.new('Patient skeletal deformation','ARMATURE');mod.object=arm;obj.parent=arm
# Articulate shoulders/forearms and reduce leg spread using the actual sourced skeleton.
for side,sign in [('L',1),('R',-1)]:
 for name,axis,angle in [('upperarm01.'+side,Vector((0,1,0)),sign*25),('lowerarm01.'+side,Vector((math.cos(math.radians(25)),0,-sign*math.sin(math.radians(25)))),57),('upperleg01.'+side,Vector((0,1,0)),sign*5)]:
  pb=arm.pose.bones[name];head=pb.head.copy();pb.matrix=Matrix.Translation(head)@Quaternion(axis,math.radians(angle)).to_matrix().to_4x4()@Matrix.Translation(-head)@pb.matrix;bpy.context.view_layer.update()
# Bake examination pose and retain a correctly bound articulated rest skeleton.
deps=bpy.context.evaluated_depsgraph_get();posed={name:(pb.head.copy(),pb.tail.copy()) for name,pb in arm.pose.bones.items()}
for obj,weights in objects:
 evaluated=obj.evaluated_get(deps);mesh=bpy.data.meshes.new_from_object(evaluated);obj.modifiers.clear();obj.data=mesh
for pb in arm.pose.bones:pb.matrix_basis=Matrix.Identity(4)
# Read actual accepted mattress triangles in Blender; all placement uses these bounds.
bpy.ops.import_scene.gltf(filepath=str(ROOT/'public/assets/models/benchmark/examination-standard.glb'))
bed=[o for o in bpy.context.selected_objects if o.type=='MESH'];upholstery=[o for o in bed if any(m and m.name.startswith('Medical upholstery') for m in o.data.materials)]
verts=[];tri=[]
for o in upholstery:
 mesh=o.data;mesh.calc_loop_triangles();n=len(verts);verts.extend(o.matrix_world@v.co for v in mesh.vertices);tri.extend(tuple(n+i for i in t.vertices) for t in mesh.loop_triangles)
assert verts,'Accepted mattress geometry not found';surface=BVHTree.FromPolygons(verts,tri,all_triangles=True)
def bed_height(x,z):
 hit=surface.ray_cast(Vector((x,-z,3)),Vector((0,0,-1)))
 return hit[0].z if hit[0] is not None else None
# Convert upright model to bed axes. Longitudinal bins fit the back to actual mattress/pillow.
def flat(p):return Vector((p.x-.4,p.z+.25,-p.y))
bodyflat=[flat(v.co) for v in body.data.vertices]
# Clothing supplies dorsal contact where skin is masked out.
allflat=[flat(v.co) for o,w in objects[:2] for v in o.data.vertices]
contact={}
for k in range(-35,30):
 z=k*.04;candidates=[p.z for p in allflat if abs(-p.y-z)<.045 and abs(p.x+.4)<.19]
 target=bed_height(-.4,z)
 if candidates and target is not None:contact[k]=target-min(candidates)+.002
keys=sorted(contact)
def offset(z):
 k=z/.04;lo=max([q for q in keys if q<=k],default=keys[0]);hi=min([q for q in keys if q>=k],default=keys[-1]);t=(k-lo)/(hi-lo) if hi!=lo else 0;return contact[lo]*(1-t)+contact[hi]*t
# Smooth support deformation across longitudinal bins; no arbitrary scale placement.
for repeat in range(5):
 contact={k:sum(contact.get(q,contact[k]) for q in [k-1,k,k+1])/3 for k in keys}
def placed(p):
 q=flat(p);q.z+=offset(-q.y);return q
# Smoothing alone can cut through the steep pillow edge. Enforce measured
# clearance with a continuous, local support correction, shared by bones/clothes.
corrections=[]
for obj,w in objects[:2]:
 for v in obj.data.vertices:
  q=placed(v.co);height=bed_height(q.x,-q.y)
  if height is not None and height+.003>q.z:corrections.append((-q.y,height+.003-q.z))
correction_grid={k:max((d*max(0,1-abs(k*.01-z)/.14) for z,d in corrections),default=0) for k in range(-150,130)}
def clearance(z):
 k=z/.01;lo=math.floor(k);t=k-lo;return correction_grid.get(lo,0)*(1-t)+correction_grid.get(lo+1,0)*t
unconstrained=placed
def placed(p):
 q=unconstrained(p);q.z+=clearance(-q.y);return q
for obj,w in objects:
 for v in obj.data.vertices:v.co=placed(v.co)
# Compress only posterior hair cards at the real pillow contact, leaving the
# scalp/head and the visible upper silhouette unchanged.
for obj,w in objects:
 if obj.name=='Patient cropped hair':
  for v in obj.data.vertices:
   h=bed_height(v.co.x,-v.co.y)
   if h is not None:v.co.z=max(v.co.z,h+.003)
# Rebind all bones to the same deformed supine rest space.
bpy.context.view_layer.objects.active=arm;bpy.ops.object.mode_set(mode='EDIT')
for name,(head,tail) in posed.items():armdata.edit_bones[name].head=placed(head);armdata.edit_bones[name].tail=placed(tail)
bpy.ops.object.mode_set(mode='OBJECT')
for obj,w in objects:
 mod=obj.modifiers.new('Verified examination rest binding','ARMATURE');mod.object=arm
 # Restrained respiration morph only on the anterior chest, not whole-body scaling.
 if obj in [body,objects[1][0]]:
  obj.shape_key_add(name='Basis');key=obj.shape_key_add(name='Respiration')
  for i,v in enumerate(obj.data.vertices):
   z=-v.co.y;chest=math.exp(-((z+.64)/.24)**4);front=max(0,min(1,(v.co.z-(bed_height(-.4,z) or 1.0)-.08)/.12));key.data[i].co.z+=.003*chest*front
# Metrics/collision audit is saved rather than any render or screenshot.
patientverts=[o.matrix_world@v.co for o,w in objects for v in o.data.vertices]
bounds=[[min(v[i] for v in patientverts),max(v[i] for v in patientverts)] for i in range(3)]
metrics={'source':'MakeHuman official CC0 base/rig/weights/system assets','bones':len(armdata.bones),'objects':[{ 'name':o.name,'vertices':len(o.data.vertices),'triangles':sum(len(p.vertices)-2 for p in o.data.polygons)} for o,w in objects],'boundsBlender':bounds,'boundsThree':[[bounds[0][0],bounds[0][1]],[bounds[2][0],bounds[2][1]],[-bounds[1][1],-bounds[1][0]]],'mattressBoundsBlender':[[min(v[i] for v in verts),max(v[i] for v in verts)] for i in range(3)],'supportOffsets':contact,'restraints':'Original flat bands require released-state filtering when patient occupied','bodyLengthLyingM':bounds[1][1]-bounds[1][0],'breathingAmplitudeM':.003,'licence':'CC0'}
# Save actual authored source and export only the patient, never replace room assets.
for o in bpy.context.scene.objects:o.select_set(False)
for o,w in objects:o.select_set(True)
arm.select_set(True);bpy.context.view_layer.objects.active=arm
bpy.ops.wm.save_as_mainfile(filepath=str(SRC/'patient-examination.blend'))
bpy.ops.export_scene.gltf(filepath=str(OUT/'patient-examination.glb'),export_format='GLB',use_selection=True,export_skins=True,export_morph=True,export_animations=False,export_yup=True,export_apply=False,export_image_format='AUTO')
metrics['bytes']=(OUT/'patient-examination.glb').stat().st_size;metrics['sha256']=hashlib.sha256((OUT/'patient-examination.glb').read_bytes()).hexdigest();(SRC/'patient-metrics.json').write_text(json.dumps(metrics,indent=2));print('PATIENT_METRICS',json.dumps(metrics)[:1500])

# Keep runtime metadata reproducible when this asset is rebuilt.
metadata={'id':'patient-examination','path':'assets/models/patient/patient-examination.glb','version':metrics['sha256'][:12],'sha256':metrics['sha256'],'bytes':metrics['bytes'],'station':'physical','tier':'standard','triangles':sum(x['triangles'] for x in metrics['objects']),'bones':metrics['bones'],'license':{'source':'https://static.makehumancommunity.org/assets/assetpacks/makehuman_system_assets.html','author':'MakeHuman contributors / Data Collection AB / Joel Palmius / Jonas Hauquier','name':'CC0','attribution':'Official CC0 MakeHuman core, rig, eyes, skin, casualsuit01, short01 and eyebrow001. See public/assets/licenses/MAKEHUMAN-PATIENT-CC0.md.'},'animations':['Respiration / localized chest morph'],'boundsThree':metrics['boundsThree']}
(ROOT/'src/scene/assets/patient-manifest.json').write_text(json.dumps(metadata,indent=2),encoding='utf-8')
(ROOT/'public/assets/licenses/MAKEHUMAN-PATIENT-CC0.md').write_bytes((SRC/'LICENSE.md').read_bytes())

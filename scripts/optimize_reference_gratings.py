"""Remove wasteful subpixel grating bevels only; keep medical assets untouched.
The generator now authors the equivalent six-face flat strips directly.
"""
import bpy,os,json,bmesh,math
from mathutils import Vector
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
result=[]
for tier in ['low','standard']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
 bpy.ops.outliner.orphans_purge(do_recursive=True)
 path=os.path.join(ROOT,'public','assets','models','benchmark','shell-'+tier+'.glb')
 bpy.ops.import_scene.gltf(filepath=path)
 removed=0
 for ob in list(bpy.context.scene.objects):
  if ob.type!='MESH' or not any(m and m.name.split('.')[0] in ['Satin aluminium','Recessed titanium panels'] for m in ob.data.materials):continue
  bm=bmesh.new();bm.from_mesh(ob.data);faces=[]
  for f in bm.faces:
   coords=[ob.matrix_world@v.co for v in f.verts]
   if all(.030<=v.z<=.047 and any(abs(v.x-x)<.245 for x in [-1.73,1.20,2.66]) for v in coords):faces.append(f)
  removed+=len(faces);bmesh.ops.delete(bm,geom=faces,context='FACES');bm.to_mesh(ob.data);bm.free();ob.data.update()
 verts=[];faces=[];indices=[]
 def xyz(p):return(p[0],-p[2],p[1])
 for x in [-1.73,1.20,2.66]:
  for z in [-2.65,-1.05,.55,1.95]:
   for i in range(16 if tier=='low' else 24):
    zz=z-.51+i*1.02/(15 if tier=='low' else 23)
    for sign in [-1,1]:
     a=Vector((x-.23,.038,zz-.035*sign));b=Vector((x+.23,.038,zz+.035*sign));side=Vector((-(b-a).z,0,(b-a).x)).normalized()*.007
     points=[a-side,a+side,b+side,b-side];offset=len(verts);verts.extend([xyz((p.x,p.y+d,p.z)) for d in [-.002,.002] for p in points])
     faces.extend([tuple(offset+j for j in f) for f in [(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]]);indices.extend([int(sign==1)]*6)
 data=bpy.data.meshes.new('Efficient expanded metal grating');data.from_pydata(verts,[],faces);data.update();uv=data.uv_layers.new(name='UVMap');ao=data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
 for c in ao.data:c.color=(.80,.80,.80,1)
 for loop in data.loops:uv.data[loop.index].uv=(data.vertices[loop.vertex_index].co.x,data.vertices[loop.vertex_index].co.y)
 ob=bpy.data.objects.new('Traction strips optimized',data);bpy.context.collection.objects.link(ob)
 for name in ['Satin aluminium','Recessed titanium panels']:data.materials.append(next(m for m in bpy.data.materials if m.name.split('.')[0]==name))
 for p,idx in zip(data.polygons,indices):p.material_index=idx
 # Rebatch by material, preserving the baked vertex data on retained architecture.
 batches={}
 for ob in bpy.context.scene.objects:
  if ob.type!='MESH':continue
  if len(ob.data.materials)>1:
   bpy.ops.object.select_all(action='DESELECT');ob.select_set(True);bpy.context.view_layer.objects.active=ob;bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.separate(type='MATERIAL');bpy.ops.object.mode_set(mode='OBJECT')
 for ob in list(bpy.context.scene.objects):
  if ob.type=='MESH':batches.setdefault(ob.data.materials[0].name,[]).append(ob)
 for name,objects in batches.items():
  bpy.ops.object.select_all(action='DESELECT')
  for ob in objects:ob.select_set(True)
  bpy.context.view_layer.objects.active=objects[0]
  if len(objects)>1:bpy.ops.object.join()
  bpy.context.object.data.color_attributes.active_color_index=0;bpy.context.object.data.color_attributes.render_color_index=0
 tris=sum(len(p.vertices)-2 for ob in bpy.context.scene.objects if ob.type=='MESH' for p in ob.data.polygons)
 bpy.ops.export_scene.gltf(filepath=path,export_format='GLB',export_yup=True,export_apply=True,export_vertex_color='ACTIVE',export_all_vertex_colors=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_cameras=False,export_lights=False)
 result.append({'tier':tier,'removedGratingFaces':removed,'trianglesAfter':tris})
with open(os.path.join(ROOT,'docs','reviews','reference-upgrade','grating-optimization.json'),'w') as f:json.dump(result,f,indent=2)
print('GRATING_OPTIMIZATION',result)


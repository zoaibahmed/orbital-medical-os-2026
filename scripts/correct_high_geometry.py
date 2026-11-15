import bpy,os,math,json
from mathutils import Vector
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
def mesh(name,verts,faces,mat):
 data=bpy.data.meshes.new(name);data.from_pydata([(x,-z,y) for x,y,z in verts],[],faces);data.update();data.materials.append(mat);uv=data.uv_layers.new(name='UVMap')
 for loop in data.loops:uv.data[loop.index].uv=(data.vertices[loop.vertex_index].co.x,data.vertices[loop.vertex_index].co.y)
 ao=data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
 for c in ao.data:c.color=(.85,.85,.85,1)
 ob=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(ob);return ob
faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
for part in ['shell','examination']:
 bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.ops.outliner.orphans_purge(do_recursive=True)
 path=os.path.join(ROOT,'public','assets','models','benchmark',part+'-standard.glb');bpy.ops.import_scene.gltf(filepath=path)
 if part=='shell':
  mat=next(m for m in bpy.data.materials if m.name=='Graphite enamel')
  mesh('Closed viewport pressure seam',[(x,y,z) for z in [.56,1.18] for x,y in [(-3.49,1.16),(-3.31,1.16),(-3.31,2.94),(-3.49,2.94)]],faces,mat)
  for ob in bpy.context.scene.objects:
   if ob.type=='MESH' and any(m and 'NASA Earth' in m.name for m in ob.data.materials):
    world=ob.matrix_world.copy();world.translation=Vector((-11,6.4,-3.6));ob.matrix_world=world;ob.rotation_euler.z+=2.2
 else:
  mat=next(m for m in bpy.data.materials if m.name=='Recessed titanium panels')
  mesh('Thoracic load bearing support shell',[(x,y+d,z) for d in [0,.045] for x,y,z in [(-.82,1.00,-.70),(.02,1.00,-.70),(.02,1.22,-1.28),(-.82,1.22,-1.28)]],faces,mat)
  metal=next(m for m in bpy.data.materials if m.name=='Satin aluminium')
  for x in [-.81,.01]:
   mesh('Locked backrest support brace',[(x+dx,y,z) for dx in [-.018,.018] for y,z in [(.94,-1.13),(.96,-1.10),(1.22,-1.20),(1.20,-1.23)]],faces,metal)
 # Rebatch added pressure/support meshes by their original material.
 batches={}
 for ob in bpy.context.scene.objects:
  if ob.type=='MESH':batches.setdefault(ob.data.materials[0].name,[]).append(ob)
 for name,objects in batches.items():
  bpy.ops.object.select_all(action='DESELECT')
  for ob in objects:ob.select_set(True)
  bpy.context.view_layer.objects.active=objects[0]
  if len(objects)>1:bpy.ops.object.join()
  bpy.context.object.data.color_attributes.active_color_index=0;bpy.context.object.data.color_attributes.render_color_index=0
 bpy.ops.export_scene.gltf(filepath=path,export_format='GLB',export_yup=True,export_apply=True,export_vertex_color='ACTIVE',export_all_vertex_colors=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_cameras=False,export_lights=False)
print('HIGH_GEOMETRY_CORRECTIONS_COMPLETE')

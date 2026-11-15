import bpy,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.ops.outliner.orphans_purge(do_recursive=True)
path=os.path.join(ROOT,'public','assets','models','benchmark','shell-standard.glb');bpy.ops.import_scene.gltf(filepath=path)
mat=next(m for m in bpy.data.materials if m.name=='Graphite enamel');items=[]
for sy in [-1,1]:
 for sz in [-1,1]:
  points=[(2.07+sy*.92,-.90+sz*1.55),(2.07+sy*.92,-.90+sz*1.116),(2.07+sy*.6624,-.90+sz*1.55)]
  data=bpy.data.meshes.new('Closed aperture corner');data.from_pydata([(x,-z,y) for x in [-3.49,-3.31] for y,z in points],[],[(0,2,1),(3,4,5),(0,1,4,3),(1,2,5,4),(2,0,3,5)]);data.update();data.materials.append(mat);uv=data.uv_layers.new(name='UVMap');ao=data.color_attributes.new(name='Color',type='FLOAT_COLOR',domain='POINT')
  for c in ao.data:c.color=(.85,.85,.85,1)
  ob=bpy.data.objects.new('Viewport pressure corner infill',data);bpy.context.collection.objects.link(ob);items.append(ob)
target=next(o for o in bpy.context.scene.objects if o.type=='MESH' and o not in items and o.data.materials[0]==mat)
bpy.ops.object.select_all(action='DESELECT');target.select_set(True)
for o in items:o.select_set(True)
bpy.context.view_layer.objects.active=target;bpy.ops.object.join();target.data.color_attributes.active_color_index=0;target.data.color_attributes.render_color_index=0
bpy.ops.export_scene.gltf(filepath=path,export_format='GLB',export_yup=True,export_apply=True,export_vertex_color='ACTIVE',export_all_vertex_colors=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_cameras=False,export_lights=False)

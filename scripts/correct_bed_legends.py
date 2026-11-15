import bpy,os
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False);bpy.ops.outliner.orphans_purge(do_recursive=True)
path=os.path.join(ROOT,'public','assets','models','benchmark','examination-standard.glb');bpy.ops.import_scene.gltf(filepath=path)
for ob in list(bpy.context.scene.objects):
 if ob.type!='MESH':continue
 names=[m.name for m in ob.data.materials if m]
 if 'Ivory equipment marking' in names:bpy.data.objects.remove(ob,do_unlink=True);continue
 if 'Applied graphite legends' not in names:continue
 for v in ob.data.vertices:
  p=ob.matrix_world@v.co
  if -p.y>1.20:p.x+=.15;p.z-=.04;p.y+=.034
  elif .90<-p.y<1.10:p.x+=.08;p.z+=.03;p.y+=.034
  v.co=ob.matrix_world.inverted()@p
bpy.ops.export_scene.gltf(filepath=path,export_format='GLB',export_yup=True,export_apply=True,export_vertex_color='ACTIVE',export_all_vertex_colors=False,export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_cameras=False,export_lights=False)

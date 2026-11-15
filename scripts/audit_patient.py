import bpy,json
from pathlib import Path
from mathutils import Vector
from mathutils.bvhtree import BVHTree
root=Path(__file__).resolve().parents[1]
bpy.ops.wm.open_mainfile(filepath=str(root/'assets/source/patient/patient-examination.blend'))
bed=[o for o in bpy.context.scene.objects if o.type=='MESH' and not o.name.startswith('Patient')]
verts=[];tri=[]
for o in bed:
 if any(m and m.name.startswith('Medical upholstery') for m in o.data.materials):
  o.data.calc_loop_triangles();n=len(verts);verts.extend(o.matrix_world@v.co for v in o.data.vertices);tri.extend(tuple(n+i for i in t.vertices) for t in o.data.loop_triangles)
surface=BVHTree.FromPolygons(verts,tri,all_triangles=True)
report={'contacts':[],'bedMeshes':[],'rigBindingError':0};allcontacts=[]
deps=bpy.context.evaluated_depsgraph_get()
for o in bpy.context.scene.objects:
 if o.type!='MESH' or not o.name.startswith('Patient'):continue
 evaluated=o.evaluated_get(deps);mesh=evaluated.to_mesh()
report['rigBindingError']=max((v.co-o.data.vertices[i].co).length for o in bpy.context.scene.objects if o.type=='MESH' and o.name.startswith('Patient') for i,v in enumerate(o.evaluated_get(deps).data.vertices))
for o in bpy.context.scene.objects:
 if o.type!='MESH' or o.name not in ['Patient uniform','Patient detailed head hands and body']:continue
 points=[]
 for v in o.data.vertices:
  p=o.matrix_world@v.co;hit=surface.ray_cast(Vector((p.x,p.y,3)),Vector((0,0,-1)))
  if hit[0] is not None:points.append((p.z-hit[0].z,-p.y,p.x))
 report['contacts'].append({'mesh':o.name,'minimumClearance':min(p[0] for p in points),'penetratingVertices':sum(p[0]<-.002 for p in points),'deepest':sorted(points)[:8]})
 allcontacts.extend(points)
report['regionalMinimumSupportClearance']={name:min((p[0] for p in allcontacts if a<=p[1]<=b),default=None) for name,a,b in [('head',-1.16,-.92),('thorax',-.92,-.46),('pelvis',-.46,-.04),('legs',-.04,.40),('heels',.40,.58)]}
solidv=[];solidt=[]
for o in bed:
 material=o.data.materials[0].name;o.data.calc_loop_triangles()
 for triangle in o.data.loop_triangles:
  ps=[o.matrix_world@o.data.vertices[i].co for i in triangle.vertices]
  def original_band(p):
   x,y,z=p.x,p.z,-p.y;textile=material in ['Restraint webbing','Upholstery seam thread']
   return (abs(z+.20)<.042 or abs(z-.59)<.042) and ((-1.025<=x<=.225 and .93<=y<=1.125) if textile else (-.15<=x<=-.01 and 1.10<=y<=1.16))
  if material in ['Restraint webbing','Upholstery seam thread','Satin aluminium','Ochre anodized service fittings','Recess and gasket'] and all(original_band(p) for p in ps):continue
  n=len(solidv);solidv.extend(ps);solidt.append((n,n+1,n+2))
solid=BVHTree.FromPolygons(solidv,solidt,all_triangles=True);intersections=[]
for o in bpy.context.scene.objects:
 if o.type!='MESH' or not o.name.startswith('Patient'):continue
 o.data.calc_loop_triangles();pv=[o.matrix_world@v.co for v in o.data.vertices];pt=[tuple(t.vertices) for t in o.data.loop_triangles]
 pairs=BVHTree.FromPolygons(pv,pt,all_triangles=True).overlap(solid)
 intersections.append({'mesh':o.name,'triangleIntersectionsWithBed':len(pairs)})
report['surfaceIntersectionAudit']=intersections
for o in bed:
 bounds=[[min((o.matrix_world@v.co)[i] for v in o.data.vertices),max((o.matrix_world@v.co)[i] for v in o.data.vertices)] for i in range(3)]
 report['bedMeshes'].append({'name':o.name,'materials':[m.name for m in o.data.materials],'bounds':bounds})
(root/'assets/source/patient/placement-audit.json').write_text(json.dumps(report,indent=2),encoding='utf-8')
print(json.dumps(report))

"""Visual benchmark v2: original mesh art, Blender 4.5. No external models/maps.
Uses shared manufacturing helpers; new lofted shells, quilted surfaces and segmented gantry.
"""
import os, math, json
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
exec(compile(open(os.path.join(ROOT,'scripts','build_medical_bay.py'),encoding='utf8').read().split('manifest=[]')[0], 'shared_authoring', 'exec'))
OUT=os.path.join(ROOT,'public','assets','models','benchmark');os.makedirs(OUT,exist_ok=True)
# Calibrated physical distinctions; do not override these to roughness=1 at runtime.
for key,col,metal,rough in [('hull',(.40,.44,.43),.12,.62),('panel',(.26,.31,.32),.65,.39),('metal',(.57,.63,.64),.88,.27),('white',(.81,.83,.77),.02,.31),('cushion',(.19,.28,.27),0,.76),('rib',(.11,.15,.17),.72,.38),('deck',(.17,.21,.22),.5,.46)]:
 p=M[key].node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*col,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 # Existing roughness maps carry their old baseline: adjust via math node.
 for link in list(M[key].node_tree.links):
  if link.to_socket==p.inputs['Roughness']:
   M[key].node_tree.links.remove(link)
# New tangent-space weave/brushing at 512px, non-color embedded PNG maps.
for key,mode in [('metal','brushed'),('cushion','weave'),('hull','coating')]:
 nodes=M[key].node_tree.nodes;links=M[key].node_tree.links;p=nodes.get('Principled BSDF');n=512;yy,xx=np.mgrid[0:n,0:n];rng=np.random.default_rng(541)
 h=(np.sin(yy*1.91)*.3+rng.random((n,n))*.2) if mode=='brushed' else (np.sin(xx*1.57)*np.sin(yy*1.57)*.4 if mode=='weave' else rng.random((n,n))*.15)
 gx,gy=np.gradient(h);pix=np.ones((n,n,4),dtype=np.float32);pix[:,:,0]=.5-gx*.18;pix[:,:,1]=.5-gy*.18;pix[:,:,2]=1
 im=bpy.data.images.new('Authored '+mode+' normal',n,n);im.colorspace_settings.name='Non-Color';im.pixels.foreach_set(pix.ravel());im.pack();tex=nodes.new('ShaderNodeTexImage');tex.image=im;normal=nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.45;links.new(tex.outputs['Color'],normal.inputs['Color']);links.new(normal.outputs['Normal'],p.inputs['Normal'])

def mesh(name,verts,faces,mat,bevel=.006):
 data=bpy.data.meshes.new(name);data.from_pydata([xyz(v) for v in verts],[],faces);data.update();o=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(o);bpy.context.view_layer.objects.active=o;bpy.ops.object.select_all(action='DESELECT');o.select_set(True);bpy.ops.object.mode_set(mode='EDIT');bpy.ops.mesh.select_all(action='SELECT');bpy.ops.mesh.normals_make_consistent(inside=False);bpy.ops.uv.smart_project(island_margin=.008);bpy.ops.object.mode_set(mode='OBJECT');return finish(o,name,mat,bevel)

def loft(name,rings,mat):
 # Eight-sided engineered cross sections; variable width, crown and chamfer along Z.
 verts=[]
 for z,w,y,h in rings:
  for x,dy in [(-w*.82,0),(w*.82,0),(w,h*.22),(w,h*.73),(w*.82,h),(-w*.82,h),(-w,h*.73),(-w,h*.22)]:verts.append((x-.4,y+dy,z))
 faces=[tuple(range(7,-1,-1))]
 for j in range(len(rings)-1):
  for i in range(8):faces.append((j*8+i,j*8+(i+1)%8,(j+1)*8+(i+1)%8,(j+1)*8+i))
 faces.append(tuple(range((len(rings)-1)*8,len(rings)*8)));return mesh(name,verts,faces,mat,.025)

def pad(name,z0,z1,width,y):
 # Custom double-curved cushion grid, rounded perimeter and crown, not a scaled cube.
 nu,nv=(12,14) if LOW else (20,24);v=[];f=[]
 for j in range(nv+1):
  t=j/nv;z=z0+(z1-z0)*t
  for i in range(nu+1):
   u=i/nu*2-1;edge=math.sin(math.pi*t)**.18;w=width*(.86+.14*edge);crown=.055*(max(0,1-u*u)**.6)*(math.sin(math.pi*t)**.3)
   v.append((-.4+u*w,y+crown,z))
 for j in range(nv):
  for i in range(nu):a=j*(nu+1)+i;f.append((a,a+1,a+nu+2,a+nu+1))
 o=mesh(name,v,f,'cushion',0)
 for p in o.data.polygons:p.use_smooth=True
 solid=o.modifiers.new('Upholstery body','SOLIDIFY');solid.thickness=.055;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=solid.name)
 for side in [-1,1]:cable('Welded upholstery seam',[(side*width*.92-.4,y+.014,z0+.03),(side*width-.4,y+.02,(z0+z1)/2),(side*width*.92-.4,y+.014,z1-.03)],.004,'rubber')

def new_bed():
 loft('Anchored plinth',[(-1.3,.30,.08,.12),(-1.05,.50,.08,.18),(.65,.50,.08,.18),(1.18,.25,.08,.12)],'rib')
 for z in [-.85,.65]:
  for x in [-.72,-.08]:
   rod('Lift actuator ram',(x,.22,z),(x,.76,z-.19),.049,'metal');rod('Lift actuator sleeve',(x,.20,z),(x,.52,z-.10),.071,'panel')
   rod('Articulation clevis',(x-.08,.73,z-.18),(x+.08,.73,z-.18),.071,'rib')
 loft('Tapered ceramic chassis',[(-1.65,.35,.76,.17),(-1.40,.55,.76,.21),(-.7,.59,.76,.22),(.45,.53,.76,.21),(1.25,.43,.76,.15),(1.42,.29,.76,.10)],'white')
 loft('Lower forged exoskeleton',[(-1.53,.32,.68,.09),(-1.25,.51,.68,.12),(.65,.48,.68,.12),(1.32,.28,.68,.08)],'metal')
 for a,b,w,dy in [(-1.48,-.86,.43,.96),(-.82,.03,.49,.965),(.07,.77,.44,.96),(.81,1.25,.33,.945)]:pad('Contoured pressure relief cushion',a,b,w,dy)
 for x in [-1.04,.24]:
  cable('Articulated access guard',[(x,.85,.9),(x,1.10,.73),(x,1.13,.12),(x,.94,-.03)],.024,'metal')
  for z in [.05,.72]:
   rod('Guard locking hinge',(x-.032,.88,z),(x+.032,.88,z),.061,'rib')
  for z in [-.6,.36]:
   box('Restraint anchor housing',(.10,.07,.12),(x,.94,z),'rib',.018);rod('Restraint D ring',(x,.97,z-.04),(x,.97,z+.04),.018,'metal')
  for z in [-1.12,-.65,-.18,.29,.76]:
   rod('Countersunk chassis fastener',(x,.84,z),(x+.008,.84,z),.014,'metal',8)
 for x in [-.94,.14]:
  rod('Precision scanner guide',(x,.71,-1.65),(x,.71,.85),.028,'metal')
  box('Scanner linear bearing carriage',(.18,.18,.30),(x,.79,-1.18),'rib',.025)
 # 18 mechanically separated wedge housings, exposed backplane, cooling fins and sensor apertures.
 center=(-.4,1.02,-1.22)
 arch('Scanner structural backplane',center,.82,1.05,.35,0,math.pi,'rib')
 arch('Scanner rear titanium flange',(-.4,1.02,-1.43),.84,1.09,.055,0,math.pi,'metal')
 for i in range(18):
  a=i*math.pi/18+.012;b=(i+1)*math.pi/18-.012
  arch('Gantry segmented ceramic service shell',(-.4,1.02,-1.22),.88,1.085,.23,a,b,'white')
  t=(a+b)/2;x=-.4+math.cos(t)*.855;y=1.02+math.sin(t)*.855
  rod('Optical sensor recessed barrel',(x,y,-1.06),(x,y,-1.025),.025,'dark',10)
  rod('Sensor optical window',(x,y,-1.024),(x,y,-1.019),.014,'scanner',10)
  if i%2==0:
   for dz in [-1.40,-1.35,-1.30]:arch('Heat exchange fin',(-.4,1.02,dz),1.087,1.135,.012,a+.025,b-.025,'metal')
  for r in [.93,1.04]:
   xx=-.4+math.cos(t)*r;yy=1.02+math.sin(t)*r;rod('Gantry captive screw',(xx,yy,-1.094),(xx,yy,-1.087),.010,'metal',8)
 arch('Patient aperture elastomer seal',(-.4,1.02,-1.06),.81,.84,.045,0,math.pi,'rubber')
 for x in [-1.39,.59]:
  box('Gantry motor cowling',(.24,.29,.46),(x,.94,-1.25),'panel',.06)
  cable('Scanner service loom',[(x,.79,-1.49),(x,.55,-1.7),(x*.8,.31,-1.8),(-.4,.25,-1.3)],.018,'rubber')
 box('Operator touch housing',(.26,.08,.37),(.32,.98,.62),'rib',.045)
 box('Embedded control glass',(.21,.008,.28),(.32,1.026,.62),'dark',.015)
 for z in [.54,.61,.68]:box('Control status scale',(.12,.003,.008),(.32,1.032,z),'scanner',.002)
 label('AESCULUS  /  04',(-.92,.855,1.37),.045)

def new_shell():
 box('Pressure deck',(7,.15,8),(0,-.12,-.5),'dark',.02)
 for x in [-2.6,-1.3,0,1.3,2.6]:
  for z in [-3,-1.5,0,1.5]:
   plate('Chamfered non slip deck tile',[(x-.62,z-.70),(x+.55,z-.70),(x+.62,z-.62),(x+.62,z+.70),(x-.55,z+.70),(x-.62,z+.62)],-.025,.05,'deck')
 for x in [-2.94,2.94]:
  for z in [-3,-1,1]:
   for k in range(16):box('Deck ventilation grille',(.22,.015,.025),(x,.02,z+k*.045),'rib',.002)
 # rear wall is formed from faceted cassettes, separated pressure ribs and exposed service chases
 box('Aft pressure boundary',(7,3.7,.16),(0,1.8,-3.85),'dark')
 for x in [-2.65,-1.35,1.35,2.65]:
  plate_outline=[(x-.60,-3.78),(x+.60,-3.78),(x+.60,-3.66),(x+.48,-3.57),(x-.48,-3.57),(x-.60,-3.66)]
  plate('Formed composite bulkhead cassette',plate_outline,.28,2.88,'hull')
  for y in [.45,2.94]:box('Cassette retaining sill',(1.08,.06,.08),(x,y,-3.51),'metal',.009)
  for y in [.62,2.75]:
   for xx in [x-.46,x+.46]:fastener(xx,y,-3.51)
  for k in range(13):box('Recessed air return vane',(.65,.018,.035),(x,2.25+k*.028,-3.50),'rib',.003)
  box('Service access recess',(.85,.65,.028),(x,1.38,-3.50),'dark',.07)
  box('Service access cover',(.79,.59,.025),(x,1.38,-3.474),'panel',.055)
  rod('Flush latch',(x+.27,1.38,-3.45),(x+.27,1.38,-3.43),.04,'metal',8)
 for x in [-3.3,-2,-.68,.68,2,3.3]:
  for y in [1.8]:box('Pressure rib web',(.07,3.5,.23),(x,y,-3.52),'rib',.012)
  for xx in [x-.055,x+.055]:box('Pressure rib flange',(.032,3.5,.31),(xx,1.8,-3.52),'metal',.007)
 # flattened octagonal pressure hatch, hinges, dogs, gasket and release wheel
 arch('Hatch upper pressure flange',(0,2.10,-3.40),.68,.79,.16,0,math.pi,'metal')
 box('Hatch pressure door',(1.32,1.65,.10),(0,1.22,-3.43),'hull',.12)
 arch('Hatch upper leaf',(0,2.04,-3.43),0,.66,.10,0,math.pi,'hull')
 for x in [-.73,.73]:box('Hatch side seal',(.035,1.72,.06),(x,1.25,-3.32),'rubber',.012)
 for y in [.65,1.40,2.1]:
  box('Hatch locking dog',(.19,.075,.10),(.70,y,-3.27),'metal',.017)
 for y in [.72,1.86]:rod('Hatch hinge pin',(-.77,y-.12,-3.28),(-.77,y+.12,-3.28),.035,'metal')
 for t in range(6):
  a=t*math.pi/3;rod('Release wheel spoke',(-.10,1.25,-3.24),(-.10+math.cos(a)*.20,1.25+math.sin(a)*.20,-3.24),.013,'metal')
 arch('Hatch release handwheel',(-.10,1.25,-3.24),.18,.21,.025,0,2*math.pi,'metal')
 label('MEDICAL  /  04',(-.43,2.31,-3.30),.09)
 for x in [-3.4,3.4]:
  box('Side pressure liner',(.12,3.5,7),(x,1.7,-.5),'hull',.03)
  for z in [-3,-1.5,0,1.5]:
   cable('Swept structural knee',[(x*.85,.12,z),(x*.98,.5,z),(x,2.65,z),(x*.82,3.35,z),(x*.65,3.45,z)],.065,'rib')
   for y in [.72,.85]:rod('Medical utility line',(x*.95,y,-3.4),(x*.95,y,2),.023,'metal')
 # overhead longitudinal service keel and recessed task fixtures
 for x in [-2.2,1.8]:
  box('Overhead service raceway',(.45,.17,6.7),(x,3.30,-.5),'rib',.045)
  for z in [-2.8,-1.1,.6,2.1]:
   box('Recessed luminaire housing',(.37,.07,1.25),(x,3.19,z),'dark',.025)
   box('Diffused medical luminaire',(.24,.012,1.12),(x,3.147,z),'light',.018)
 for z in [-3,-1.4,.2,1.8]:rod('Overhead cross tie',(-3.2,3.42,z),(3.2,3.42,z),.04,'metal')
 for side in [-1,1]:
  xx=side*3.26
  for z in [-2.6,-1.2,.2,1.6]:
   box('Equipment rack recessed seal',(.07,1.75,1.22),(xx,1.82,z),'dark',.06)
   box('Formed side stowage housing',(.12,1.63,1.10),(xx-side*.04,1.82,z),'panel',.075)
   for y in [1.30,1.82,2.34]:
    box('Medical cassette drawer',(.09,.43,.97),(xx-side*.12,y,z),'hull',.035)
    rod('Stowage recessed pull',(xx-side*.18,y,z-.14),(xx-side*.18,y,z+.14),.018,'metal')
   for zz in [z-.45,z+.45]:
    rod('Rack bolted mounting rail',(xx-side*.19,.91,zz),(xx-side*.19,2.75,zz),.020,'metal')
  for z in [-2.8,-1.2,.4,2]:
   box('Overhead acoustic service cassette',(1.8,.06,1.42),(side*1.0,3.48,z),'hull',.065)
  for y in [2.88,3.0]:
   rod('Managed overhead oxygen conduit',(xx-side*.12,y,-3.2),(xx-side*.12,y,2.1),.025,'metal')
 for i in range(4):
  cable('Managed ceiling service conduit',[(-3,3.31,-3.2+i*.09),(-2.5,3.39,-3.2+i*.09),(1,3.39,-3.2+i*.09),(2.9,3.25,-3.2+i*.09)],.022,'rubber')

def new_equipment():
 equipment()
 # Re-engineer outer casing silhouette with tapered shoulder, rails and strain-relieved connectors.
 for x in [1.74,2.66]:
  cable('Equipment protective chassis rail',[(x,.35,-1.84),(x,.46,-1.78),(x,1.1,-1.78),(x,1.28,-1.93)],.025,'metal')
 for x in [1.96,2.17,2.38]:
  rod('Instrument connector socket',(x,1.12,-1.855),(x,1.12,-1.79),.041,'metal')
  rod('Cable strain relief',(x,1.12,-1.79),(x,1.12,-1.72),.029,'rubber')
  cable('Managed instrument lead',[(x,1.12,-1.72),(x+.12,.9,-1.63),(x+.18,.63,-1.70),(2.8,.56,-2.2)],.011,'rubber')
 # thin monitor service heatsink fins, back articulated VESA mount
 for i in range(10):box('Monitor rear cooling fin',(.56,.022,.06),(2.08,1.73+i*.038,-2.43),'metal',.003)
 box('Articulated VESA mount',(.18,.23,.06),(2.08,1.91,-2.47),'rib',.02)

# Ray-traced vertex AO in authored space; no runtime SSAO or bloom.
import bmesh
from mathutils.bvhtree import BVHTree
original_export=export_asset
source=open(os.path.join(ROOT,'scripts','build_medical_bay.py'),encoding='utf8').read()
export_source=source[source.index('def export_asset('):source.index('manifest=[]')]
export_source=export_source.replace('    path=os.path.join', '''    bm=bmesh.new()
    for ob in merged:
        temp=bmesh.new();temp.from_mesh(ob.data);temp.transform(ob.matrix_world)
        # Consolidate transformed vertices into one occlusion BVH.
        temp.free()
    verts=[];polys=[]
    for ob in merged:
        offset=len(verts);verts.extend([ob.matrix_world @ v.co for v in ob.data.vertices]);polys.extend([tuple(offset+i for i in p.vertices) for p in ob.data.polygons])
    tree=BVHTree.FromPolygons(verts,polys,all_triangles=False)
    for ob in merged:
        attr=ob.data.color_attributes.new(name='Baked cavity occlusion',type='FLOAT_COLOR',domain='POINT')
        ob.data.color_attributes.active_color_index=len(ob.data.color_attributes)-1
        ob.data.color_attributes.render_color_index=len(ob.data.color_attributes)-1
        for v in ob.data.vertices:
            n=(ob.matrix_world.to_3x3() @ v.normal).normalized();pos=ob.matrix_world @ v.co+n*.003
            tangent=n.cross(Vector((0,0,1)))
            if tangent.length<.1:tangent=n.cross(Vector((0,1,0)))
            tangent.normalize();bitangent=n.cross(tangent);blocked=0
            for k in range(8):
                angle=k*2.39996;h=.35+.6*(k+.5)/8;r=math.sqrt(1-h*h)
                direction=(n*h+tangent*(math.cos(angle)*r)+bitangent*(math.sin(angle)*r)).normalized()
                hit=tree.ray_cast(pos,direction,.38)
                if hit[0] is not None:blocked+=1
            ao=1-.56*blocked/8;attr.data[v.index].color=(ao,ao,ao,1)
    bm.free()
    path=os.path.join''')
export_source=export_source.replace("export_format='GLB'","export_format='GLB',export_vertex_color='ACTIVE',export_all_vertex_colors=False")
exec(export_source)

manifest=[]
for low in [True,False]:
 for name,build in [('shell',new_shell),('examination',new_bed),('equipment',new_equipment)]:
  a=export_asset(name,build,low);a['path']='assets/models/benchmark/'+os.path.basename(a['path']);a['authoring']='Original profile-lofted chassis, double-curved upholstery grids, segmented gantry wedges, swept conduits, bevels/weighted normals, UVs, embedded tangent normal maps, material batches and Draco';a['status']='Visual benchmark v2 — review required; not production-ready';manifest.append(a)
with open(os.path.join(OUT,'manifest.json'),'w') as f:json.dump(manifest,f,indent=2)
with open(os.path.join(ROOT,'src','scene','assets','benchmark-manifest.json'),'w') as f:json.dump(manifest,f,indent=2)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
for asset in manifest:
 if asset['tier']=='standard':bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT,'public',asset['path']))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'assets','source','visual-benchmark.blend'))
print('BENCHMARK_COMPLETE',json.dumps(manifest))

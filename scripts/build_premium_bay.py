"""High-only public refinement. Independent geometry, original reference not used as texture.
Reuses the verified mesh/material/UV/vertex-AO export pipeline; preserves internal low assets.
"""
import os,math,json,hashlib
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
source=open(os.path.join(ROOT,'scripts','build_reference_bay.py'),encoding='utf-8-sig').read()
exec(compile(source.split('# Reuse the verified export/AO')[0],'reference_construction','exec'))
base_bed=reference_bed;base_shell=reference_shell;base_equipment=reference_equipment
# More detailed high-tier surface maps, without amplifying paint into rough stone.
for material in M.values():
 p=material.node_tree.nodes.get('Principled BSDF')
 for node in material.node_tree.nodes:
  if node.type=='NORMAL_MAP' and material not in [M['deck']]:node.inputs['Strength'].default_value=.10 if material in [M['white'],M['hull']] else .22
M['glass_clear']=surface('Thin optical glazing',(.18,.31,.34),.05,.12)
M['glass_clear'].node_tree.nodes.get('Principled BSDF').inputs['Alpha'].default_value=.22
M['glass_clear'].surface_render_method='DITHERED'
M['seal']=surface('Layered silicone edge seal',(.018,.026,.025),0,.71)
M['labels']=surface('Applied graphite legends',(.016,.023,.025),0,.78)
M['stitch']=surface('Upholstery seam thread',(.025,.065,.064),0,.82)

def remove_objects(objects):
 for o in objects:
  if o in OBJECTS:OBJECTS.remove(o)
  bpy.data.objects.remove(o,do_unlink=True)

def transform_objects(objects,fn):
 for o in objects:
  for v in o.data.vertices:
   world=o.matrix_world@v.co;runtime=Vector((world.x,world.z,-world.y));p=fn(runtime);v.co=o.matrix_world.inverted()@Vector(xyz(p))

def side_frame(name,x,y,z,w,h,border,depth,mat):
 # Actual aperture: front/back annulus around a chamfered pressure opening.
 def outline(ww,hh):return[(-ww*.5,-hh*.36),(-ww*.36,-hh*.5),(ww*.36,-hh*.5),(ww*.5,-hh*.36),(ww*.5,hh*.36),(ww*.36,hh*.5),(-ww*.36,hh*.5),(-ww*.5,hh*.36)]
 outer=outline(w,h);inner=outline(w-2*border,h-2*border);v=[]
 for xx in [x-depth/2,x+depth/2]:
  for shape in [outer,inner]:v.extend([(xx,y+dy,z+dz) for dz,dy in shape])
 f=[]
 for i in range(8):
  j=(i+1)%8;f.extend([(i,j,8+j,8+i),(16+i,24+i,24+j,16+j),(i,16+i,16+j,j),(8+i,8+j,24+j,24+i)])
 return mesh(name,v,f,mat,.012)

def link_arm(name,a,b,width=.06,thickness=.045,mat='metal'):
 a=Vector(a);b=Vector(b);side=(b-a).cross(Vector((1,0,0))).normalized()*width
 v=[tuple(p+Vector((d,0,0))) for d in [-thickness/2,thickness/2] for p in [a-side,a+side,b+side,b-side]]
 return mesh(name,v,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],mat,.009)

def strap(z):
 # Wide ribbon with a continuous load path from both frame anchors.
 pts=[(-1.01,.94),(-.91,1.03),(-.80,1.09),(-.4,1.105),(0,1.09),(.11,1.03),(.21,.94)]
 v=[(x,y,z+dz) for dz in [-.035,.035] for x,y in pts];n=len(pts);f=[(i,i+1,n+i+1,n+i) for i in range(n-1)]
 o=mesh('Flat woven patient restraint',v,f,'rubber',0);solid=o.modifiers.new('Webbing thickness','SOLIDIFY');solid.thickness=.007;bpy.context.view_layer.objects.active=o;bpy.ops.object.modifier_apply(modifier=solid.name)
 for dz in [-.029,.029]:cable('Webbing woven edge',[(x,y+.003,z+dz) for x,y in pts],.0018,'stitch')
 box('Restraint forged buckle',(.12,.029,.096),(-.08,1.12,z),'metal',.012)
 box('Buckle receiver recess',(.076,.009,.057),(-.08,1.139,z),'dark',.006)
 box('Buckle release latch',(.042,.008,.038),(-.08,1.147,z),'ochre',.005)

def high_bed():
 start=len(OBJECTS);base_bed();new=OBJECTS[start:]
 remove_objects([o for o in new if o.name.startswith(('Contoured pressure relief','Welded upholstery','Raised occipital','Patient restraint webbing','Restraint buckle body','Buckle latch','Label AESCULUS'))])
 # Anatomically separated contoured surfaces, with an inclined back support instead of a flat slab.
 for name,a,b,w,y in [('Calf support',.60,1.04,.33,1.00),('Thigh support',.05,.57,.43,1.035),('Pelvic support',-.64,.01,.46,1.04)]:
  s=len(OBJECTS);pad(name,a,b,w,y)
  for edge in [-1,1]:cable('Upholstery stitched border',[(edge*w*.91-.4,y+.021,a+.035),(edge*w*.98-.4,y+.03,(a+b)/2),(edge*w*.91-.4,y+.021,b-.035)],.002,'stitch')
 s=len(OBJECTS);pad('Inclined thoracic support',-1.28,-.70,.40,1.085)
 transform_objects(OBJECTS[s:],lambda p:(p.x,p.y+max(0,min(1,(-p.z-.70)/.58))*.22,p.z))
 # Inclined load-bearing shell under the thoracic cushion, with locked support struts.
 v=[(x,y+d,z) for d in [0,.045] for x,y,z in [(-.82,1.00,-.70),(.02,1.00,-.70),(.02,1.22,-1.28),(-.82,1.22,-1.28)]]
 mesh('Thoracic support shell',v,[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)],'panel',.012)
 for x in [-.81,.01]:
  rod('Backrest hinge axis',(x-.05,1.035,-.70),(x+.05,1.035,-.70),.052,'metal',16)
  link_arm('Backrest locked support brace',(x,.94,-1.12),(x,1.20,-1.22),.028,.025,'metal')
 s=len(OBJECTS);pad('Contoured cervical pillow',-1.19,-.98,.31,1.35)
 for z in [-.20,.59]:strap(z)
 # Forged pantograph link plates with hubs, pins, actuator sleeves and mechanical stops.
 for x in [-.77,-.03]:
  for z in [-.73,.44]:
   link_arm('Lift pantograph upper link',(x,.31,z+.22),(x,.70,z-.18),.055,.05,'panel')
   link_arm('Lift pantograph lower link',(x+.065,.31,z-.18),(x+.065,.70,z+.22),.055,.05,'metal')
   for y,zz in [(.31,z-.18),(.70,z+.22),(.50,z+.02)]:
    rod('Lift bearing hub',(x-.03,y,zz),(x+.12,y,zz),.073,'rib',20)
    rod('Lift bearing polished pin',(x+.12,y,zz),(x+.133,y,zz),.034,'metal',16)
   rod('Actuator cylinder sleeve',(x,.26,z+.16),(x,.49,z+.02),.047,'white',16)
   rod('Actuator polished piston',(x,.49,z+.02),(x,.70,z-.12),.021,'metal',16)
  box('Rubber travel stop',(.09,.055,.13),(x,.28,.04),'rubber',.01)
 # Side service connectors with physically connected lines.
 for z in [-.73,-.43,-.13]:
  rod('Patient interface side socket',(.13,.78,z),(.19,.78,z),.030,'metal',16)
  rod('Patient interface dark insert',(.19,.78,z),(.195,.78,z),.018,'dark',12)
  cable('Patient interface bundled lead',[(.20,.78,z),(.28,.63,z),(.22,.44,z-.17),(.04,.34,z-.30)],.009,'rubber')
 # Mechanical rail latches and telescoping support collars.
 for x in [-1.04,.24]:
  for z in [.03,.62]:
   rod('Guard hinge stop sleeve',(x-.054,.92,z),(x+.054,.92,z),.078,'white',20)
   rod('Guard locking pin',(x-.061,.92,z),(x+.061,.92,z),.030,'metal',16)
   box('Guard quick release',(.065,.032,.10),(x,.99,z),'ochre',.012)
 label('PATIENT INTERFACE',(-.67,.83,1.226),.026,'labels')
 label('KEEP CLEAR',(-.58,.45,.926),.025,'labels')
 # Deeper segmented liner and actual screw/aperture layers inside the gantry.
 for i in range(9):
  a=i*math.pi/9+.012;b=(i+1)*math.pi/9-.012
  ring('Internal gantry panel gasket',(-.4,1,-1.20),.767,.796,.43,a,b,'seal')
  ring('Internal detector liner cassette',(-.4,1,-1.20),.774,.786,.38,a+.01,b-.01,'white')
  t=(a+b)/2;xx=-.4+math.cos(t)*.787;yy=1+math.sin(t)*.787
  port('Inner detector collar',xx,yy,-.985,.016)
 # Crown sensor pod and dual optics, offset vertically from the ceiling inspection head.
 box('Gantry crown detector housing',(.40,.21,.22),(-.4,2.15,-.90),'white',.06)
 box('Crown detector fascia',(.32,.13,.025),(-.4,2.15,-.774),'dark',.025)
 for x in [-.49,-.31]:
  port('Crown optical lens',x,2.16,-.751,.041)
  rod('Crown lens optical glass',(x,2.16,-.724),(x,2.16,-.719),.024,'glass',20)
 grille('Crown cooling exchange',-.4,2.30,-1.10,.28,.07)
 # Exposed service bearing in a protected lower-side inspection aperture.
 for x in [-1.55,.75]:
  box('Service bearing recessed pocket',(.24,.22,.025),(x,.82,-.975),'dark',.04)
  ring('Exposed drive-bearing ring',(x,.82,-.947),.046,.081,.025,0,2*math.pi,'metal')
  rod('Drive bearing axis',(x,.82,-.94),(x,.82,-.915),.031,'panel',20)
  for i in range(12):
   t=i*math.pi/6;xx=x+math.cos(t)*.094;yy=.82+math.sin(t)*.094
   rod('Drive-ring tooth',(xx,yy,-.94),(xx,yy,-.925),.008,'ochre',6)
 # Service hatches have perimeter seals, latches and off-center identification plates.
 for i in [1,4]:
  t=(i+.5)*math.pi/6;x=-.4+math.cos(t)*1.14;y=1+math.sin(t)*1.14
  box('Scanner service legend plate',(.10,.035,.008),(x,y,-.928),'dark',.004)
  for dx in [-.042,.042]:fasten_face(x+dx,y,-.918)
 # Ventilation intake on optical head and a connected braided service line.
 grille('Optical head micro intake',-.4,2.66,-.424,.16,.055)
 cable('Ceiling detector service loop',[(-.55,3.22,-1.04),(-.69,2.97,-1.04),(-.64,2.74,-.93),(-.49,2.67,-.72)],.013,'rubber')


def high_shell():
 start=len(OBJECTS);base_shell()
 # Replace blank wall and floating-ended knees with an actual pressure viewport and layered construction.
 prefixes=('Left side pressure liner','Service module pressure','Faceted medical manifold','Medical manifold','Medical pressure gauge','Pressure gauge','Manifold','Individual manifold','Service module retaining')
 remove_objects([o for o in OBJECTS[start:] if o.name.startswith(prefixes)])
 # Remove only the left structural knee crossing the new aperture.
 remove_objects([o for o in OBJECTS[start:] if o.name.startswith('Chamfered pressure knee') and sum((o.matrix_world@v.co).x for v in o.data.vertices)/max(1,len(o.data.vertices))<0])
 # Opaque wall portions surrounding a real opening, no image-backed wall.
 for size,pos in [((.16,1.20,7),(-3.4,.59,-.3)),((.16,.50,7),(-3.4,3.18,-.3)),((.16,1.76,1.2),(-3.4,2.05,-2.94)),((.16,1.76,2.6),(-3.4,2.05,1.9))]:box('Viewport surrounding pressure hull',size,pos,'hull',.025)
 # Close the triangular corner fields outside the chamfered aperture.
 for sy in [-1,1]:
  for sz in [-1,1]:
   points=[(2.07+sy*.92,-.90+sz*1.55),(2.07+sy*.92,-.90+sz*1.116),(2.07+sy*.6624,-.90+sz*1.55)]
   mesh('Viewport pressure corner infill',[(x,y,z) for x in [-3.49,-3.31] for y,z in points],[(0,2,1),(3,4,5),(0,1,4,3),(1,2,5,4),(2,0,3,5)],'hull',0)
 side_frame('Viewport structural pressure frame',-3.32,2.07,-.90,3.10,1.84,.16,.22,'rib')
 side_frame('Viewport machined retaining flange',-3.18,2.07,-.90,2.94,1.68,.055,.12,'metal')
 side_frame('Viewport compression gasket',-3.105,2.07,-.90,2.84,1.57,.034,.05,'seal')
 side_frame('Viewport interior reveal',-3.07,2.07,-.90,2.79,1.52,.06,.08,'white')
 # Thin glazing: alpha-blended dielectric approximation, not full refractive ray tracing.
 box('Observation viewport glazing',(.006,1.33,2.56),(-3.12,2.07,-.90),'glass_clear',.04)
 for z in [-2.27,-1.58,-.9,-.22,.47]:
  for y in [1.27,2.86]:rod('Viewport retaining fastener',(-3.035,y,z),(-3.01,y,z),.014,'metal',12)
 # Actual independently modelled Earth, textured with NASA globe data, outside the hull.
 earth_mat=surface('NASA Earth Observatory globe',(1,1,1),0,.90)
 tex=earth_mat.node_tree.nodes.new('ShaderNodeTexImage');tex.image=bpy.data.images.load(os.path.join(ROOT,'assets','source','high-refinement','nasa-earth.jpg'));tex.image.scale(2048,1024);tex.image.pack()
 shader=earth_mat.node_tree.nodes.get('Principled BSDF');earth_mat.node_tree.links.new(tex.outputs['Color'],shader.inputs['Base Color']);earth_mat.node_tree.links.new(tex.outputs['Color'],shader.inputs['Emission Color']);shader.inputs['Emission Strength'].default_value=.72
 M['earth']=earth_mat
 bpy.ops.mesh.primitive_uv_sphere_add(segments=64,ring_count=40,radius=5.6,location=xyz((-11,-3.6,-6.4)));o=bpy.context.object;o.rotation_euler=(0,.12,3.1);finish(o,'Exterior Earth sphere','earth');
 for face in o.data.polygons:face.use_smooth=True
 # Window sill and task rail are tied to the hull, not loosely floating counter blocks.
 box('Viewport sill service raceway',(.28,.10,3.14),(-3.08,1.19,-.90),'panel',.035)
 cable('Viewport upper warm practical',[(-3.035,2.91,-2.18),(-3.035,2.91,.38)],.012,'amber')
 # Faceted overhead and aft covers create secondary layers instead of empty wall fields.
 for x in [-1.38,1.38]:
  for y in [1.13,2.32]:
   box('Aft inset service gasket',(.45,.68,.055),(x,y,-3.51),'seal',.06)
   box('Aft bevelled access leaf',(.39,.61,.028),(x,y,-3.466),'white',.055)
   grille('Aft equipment return',x,y+.15,-3.443,.24,.15)
   for xx in [x-.145,x+.145]:fasten_face(xx,y-.22,-3.443)
 for x in [-3.24,3.24]:
  for z in [-3.1,1.12,2.75]:
   box('Bulkhead knee web',(.095,2.8,.12),(x,1.65,z),'rib',.014)
   box('Bulkhead knee retaining flange',(.20,.14,.24),(x,.35,z),'metal',.025)
   box('Bulkhead knee retaining flange',(.20,.14,.24),(x,2.96,z),'metal',.025)
 # Denser ceiling service bundles and clamped serpentine feeds.
 for i in range(3):
  x=-2.72+i*.13
  cable('Clamped ceiling data conduit',[(x,3.24,-3.2),(x,3.31,-2.6),(x+.15,3.31,-1.0),(x+.15,3.24,2.3)],.023,'rubber' if i%2 else 'copper')
  for z in [-2.6,-1.4,-.2,1.,2.]:box('Conduit saddle clamp',(.45,.035,.055),(-2.58,3.29,z),'metal',.008)
 # Counter instruments, pipette rack and a specimen carrier establish human scale.
 box('Specimen transport case',(.34,.25,.40),(-2.96,1.14,-1.93),'white',.045)
 box('Specimen case seal',(.35,.028,.41),(-2.96,1.24,-1.93),'seal',.012)
 for z in [-2.05,-1.81]:rod('Specimen case latch',(-2.77,1.19,z),(-2.73,1.19,z),.023,'metal',12)
 box('Sample vial holding rack',(.23,.07,.42),(-2.92,1.06,-.62),'panel',.016)
 for z in [-.75,-.62,-.49]:
  rod('Sample tube',(-2.92,1.08,z),(-2.92,1.24,z),.025,'glass_clear',16)
  rod('Sample tube cap',(-2.92,1.24,z),(-2.92,1.265,z),.027,'ochre',16)
 # Structural fasteners/edge strips and cabinet seams remain bounded by material batching.
 for y in [.35,2.88]:
  for x in [-2.9,-2.2,-1.4,1.4,2.2,2.9]:fasten_face(x,y,-3.43)
 label('PRESSURE ACCESS',(-.40,2.35,-3.20),.037,'labels')
 label('MEDICAL SUPPLIES',(-2.97,2.45,-3.19),.035,'labels')


def high_equipment():
 start=len(OBJECTS);base_equipment()
 remove_objects([o for o in OBJECTS[start:] if o.name.startswith('Translucent-look supply reservoir')])
 # Thin-walled containers with independent fluid volumes and capped tubing fittings.
 for x in [2.64,2.89]:
  rod('Supply reservoir transparent wall',(x,2.05,-2.5),(x,2.32,-2.5),.058,'glass_clear',24)
  rod('Visible reservoir fluid',(x,2.055,-2.5),(x,2.20,-2.5),.046,'bottle',24)
  rod('Reservoir neck fitting',(x,2.32,-2.5),(x,2.35,-2.5),.036,'metal',16)
  rod('Reservoir bottom connector',(x,2.025,-2.5),(x,2.05,-2.5),.022,'metal',12)
  box('Reservoir label band',(.056,.05,.006),(x,2.24,-2.439),'white',.003)
 # Protective corner details and exact physical monitor connections.
 for x in [1.66,2.56]:
  for y in [1.70,2.26]:
   box('Display protective corner cap',(.07,.07,.10),(x,y,-2.34),'rib',.022)
   fasten_face(x,y,-2.275)
 for x in [1.82,2.38]:port('Display interface port',x,1.68,-2.27,.020)
 cable('Display managed signal loop',[(2.44,1.68,-2.43),(2.56,1.50,-2.55),(2.48,1.31,-2.52),(2.44,1.28,-2.48)],.012,'rubber')
 # Drawer guides, identity labels, catches and gasket seams.
 for y in [.48,.72,.96]:
  for x in [1.88,2.52]:
   box('Drawer metal guide edge',(.016,.16,.018),(x,y,-1.825),'metal',.004)
   rod('Drawer catch pin',(x,y-.06,-1.824),(x,y-.06,-1.811),.012,'ochre',10)
  label('INSTRUMENT', (1.92,y-.03,-1.822),.023,'ink')
 # Scan probe with a connected dock rather than a text-labelled cube.
 box('Probe dock rubber cradle',(.17,.08,.25),(2.78,1.27,-2.18),'rubber',.025)
 cable('Ergonomic probe handle',[(2.78,1.30,-2.20),(2.78,1.43,-2.16),(2.78,1.52,-2.12)],.032,'white')
 box('Probe contact transducer',(.12,.065,.095),(2.78,1.55,-2.12),'white',.025)
 box('Probe contact acoustic face',(.10,.018,.070),(2.78,1.59,-2.12),'glass',.015)
 cable('Docked probe service cable',[(2.78,1.32,-2.20),(2.95,1.08,-2.16),(2.98,.65,-2.14),(2.78,.45,-2.18),(2.62,.56,-2.16)],.012,'rubber')
 # Rear chassis vent and external powered interface bank.
 grille('Console lower thermal exchange',2.2,.34,-1.806,.53,.075)
 for x in [1.86,2.54]:
  for y in [.33,1.11]:fasten_face(x,y,-1.80)
 label('ORBITAL / CLINICAL SYSTEMS', (1.86,1.12,-1.802),.028,'labels')

# Export the actual high assets. Internal low diagnostics remain preserved, not public choices.
exporter=source[source.index('# Reuse the verified export/AO'):source.index("parts=os.environ")]
exec(compile(exporter,'premium_exporter','exec'))
LOW=False
manifest=json.load(open(os.path.join(ROOT,'src','scene','assets','benchmark-manifest.json')))
for name,build in [('shell',high_shell),('examination',high_bed),('equipment',high_equipment)]:
 a=export_asset(name,build,False);a['path']='assets/models/benchmark/'+os.path.basename(a['path']);a['authoring']='High refinement: independent layered hard-surface geometry, inclined cushions, ribbon restraints, pantograph mechanisms, optical gantry components, true viewport aperture and external Earth sphere; UVs, cavity vertex bake, static caster shadows, Draco';a['license']='Original project geometry/maps; Poly Haven metal_plate_03 CC0; Barlow Condensed SIL OFL 1.1; NASA Earth Observatory globe imagery with attribution, subject to NASA Media Usage Guidelines. Reference is documentation only.';a['status']='High-only public refinement; art review pending';manifest=[old for old in manifest if old['id']!=a['id']];manifest.append(a)
for a in manifest:finalize_deck(a)
order={'shell':0,'examination':1,'equipment':2};manifest.sort(key=lambda a:(a['tier'],order[a['id'].rsplit('-',1)[0]]))
with open(os.path.join(OUT,'manifest.json'),'w') as f:json.dump(manifest,f,indent=2)
with open(os.path.join(ROOT,'src','scene','assets','benchmark-manifest.json'),'w') as f:json.dump(manifest,f,indent=2)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
for a in manifest:
 if a['tier']=='standard':bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT,'public',a['path']))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'assets','source','high-refinement','medical-bay-high.blend'))
print('PREMIUM_ASSETS_COMPLETE',json.dumps(manifest))

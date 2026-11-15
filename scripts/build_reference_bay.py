"""Reference-led independently authored environment. Reference image is never used as an asset.
Run local Blender 4.5 --background --python scripts/build_reference_bay.py.
"""
import os, math, json
ROOT=os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
prior=open(os.path.join(ROOT,'scripts','build_visual_benchmark.py'),encoding='utf-8-sig').read()
exec(compile(prior.split('# Ray-traced vertex AO')[0],'benchmark_helpers','exec'))
base_rod=rod
base_cable=cable
def cable(name,points,radius=.016,mat='rubber'):
 if name!='Simulated instrument ECG illustration':return base_cable(name,points,radius,mat)
 curve=bpy.data.curves.new(name,'CURVE');curve.dimensions='3D';curve.bevel_depth=radius;curve.bevel_resolution=0
 spline=curve.splines.new('POLY');spline.points.add(len(points)-1)
 for point,p in zip(spline.points,points):point.co=(*xyz(p),1)
 obj=bpy.data.objects.new(name,curve);bpy.context.collection.objects.link(obj);bpy.ops.object.select_all(action='DESELECT');obj.select_set(True);bpy.context.view_layer.objects.active=obj;bpy.ops.object.convert(target='MESH');return finish(bpy.context.object,name,mat)
def rod(name,start,end,radius,mat='metal',vertices=None):
 if not name.startswith('Expanded deck'):return base_rod(name,start,end,radius,mat,vertices)
 a,b=Vector(start),Vector(end);side=Vector((-(b-a).z,0,(b-a).x)).normalized()*radius
 points=[a-side,a+side,b+side,b-side];v=[xyz((p.x,p.y+d,p.z)) for d in [-.002,.002] for p in points];faces=[(0,3,2,1),(4,5,6,7),(0,1,5,4),(1,2,6,5),(2,3,7,6),(3,0,4,7)]
 data=bpy.data.meshes.new(name);data.from_pydata(v,[],faces);data.update();uv=data.uv_layers.new(name='UVMap')
 for loop in data.loops:uv.data[loop.index].uv=(data.vertices[loop.vertex_index].co.x,data.vertices[loop.vertex_index].co.y)
 obj=bpy.data.objects.new(name,data);bpy.context.collection.objects.link(obj);return finish(obj,name,mat)
# All colors below are linear working-space values, not display hex literals.
colors={'hull':((.21,.205,.18),.22,.49),'panel':((.075,.095,.10),.65,.37),'metal':((.38,.41,.40),.85,.27),'white':((.64,.58,.46),.08,.34),'cushion':((.025,.13,.14),0,.52),'rib':((.035,.042,.043),.65,.44),'deck':((.055,.065,.068),.78,.41),'dark':((.009,.014,.016),.25,.35),'rubber':((.012,.016,.015),0,.84),'ink':((.61,.58,.48),.1,.62)}
for key,(color,metal,rough) in colors.items():
 p=M[key].node_tree.nodes.get('Principled BSDF');p.inputs['Base Color'].default_value=(*color,1);p.inputs['Metallic'].default_value=metal;p.inputs['Roughness'].default_value=rough
 # Remove inherited coarse normal patterns that looked like bands rather than surface grain.
 for link in list(M[key].node_tree.links):
  if link.to_socket in [p.inputs['Normal'],p.inputs['Roughness']]:M[key].node_tree.links.remove(link)
M['ochre']=surface('Ochre anodized service fittings',(.42,.17,.025),.5,.39)
M['copper']=surface('Copper utility conduit',(.34,.105,.033),.72,.30)
M['amber']=surface('Warm service practical',(1,.37,.08),0,.32,emissive=2)
M['glass']=surface('Dark optical glass',(.007,.022,.027),.35,.17)
M['bottle']=surface('Amber supply vial',(.22,.075,.016),.15,.28)
M['screen']=surface('Instrument display ink',(.035,.25,.27),.0,.45,emissive=.75)
# Authored 512px micro-surface maps: subtle irregular grain, not broad uniform stripes.
for key,rough,amount in [('white',.34,.06),('hull',.49,.09),('cushion',.52,.075),('metal',.27,.12)]:
 m=M[key];p=m.node_tree.nodes.get('Principled BSDF');n=512;rng=np.random.default_rng(238);yy,xx=np.mgrid[0:n,0:n];grain=rng.random((n,n));h=grain*.15
 if key=='cushion':h+=np.sin(xx*2.8)*np.sin(yy*2.8)*.12
 gx,gy=np.gradient(h)
 for name in ['rough','normal']:
  pixels=np.ones((n,n,4),dtype=np.float32)
  if name=='rough':pixels[:,:,:3]=np.clip(rough+(grain[:,:,None]-.5)*amount,.04,.95)
  else:pixels[:,:,0]=.5-gx*.3;pixels[:,:,1]=.5-gy*.3;pixels[:,:,2]=1
  im=bpy.data.images.new('Maintained '+key+' '+name,n,n);im.colorspace_settings.name='Non-Color';im.pixels.foreach_set(pixels.ravel());im.pack();tex=m.node_tree.nodes.new('ShaderNodeTexImage');tex.image=im
  if name=='rough':m.node_tree.links.new(tex.outputs['Color'],p.inputs['Roughness'])
  else:
   normal=m.node_tree.nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.22;m.node_tree.links.new(tex.outputs['Color'],normal.inputs['Color']);m.node_tree.links.new(normal.outputs['Normal'],p.inputs['Normal'])
# Sourced CC0 dark traction metal. Shared maps are embedded only in the shell GLB.
for filename,slot,color in [('deck-color.jpg','Base Color','sRGB'),('deck-roughness.png','Roughness','Non-Color'),('deck-normal.png','Normal','Non-Color')]:
 im=bpy.data.images.load(os.path.join(ROOT,'assets','source','reference-upgrade',filename));im.colorspace_settings.name=color;im.scale(512,512);im.pack();tex=M['deck'].node_tree.nodes.new('ShaderNodeTexImage');tex.image=im;p=M['deck'].node_tree.nodes.get('Principled BSDF')
 if slot=='Normal':
  normal=M['deck'].node_tree.nodes.new('ShaderNodeNormalMap');normal.inputs['Strength'].default_value=.65;M['deck'].node_tree.links.new(tex.outputs['Color'],normal.inputs['Color']);M['deck'].node_tree.links.new(normal.outputs['Normal'],p.inputs['Normal'])
 elif slot=='Base Color':
  multiply=M['deck'].node_tree.nodes.new('ShaderNodeMixRGB');multiply.blend_type='MULTIPLY';multiply.inputs[0].default_value=1;multiply.inputs[2].default_value=(.40,.55,.64,1);M['deck'].node_tree.links.new(tex.outputs['Color'],multiply.inputs[1]);M['deck'].node_tree.links.new(multiply.outputs[0],p.inputs[slot])
 else:M['deck'].node_tree.links.new(tex.outputs['Color'],p.inputs[slot])

# Radial sampling follows arc length. Narrow casing sectors do not receive full semicircle tessellation.
def ring(name,center,inner,outer,depth,a=0,b=math.pi,mat='metal'):
 count=max(2,math.ceil((24 if LOW else 48)*(b-a)/math.pi));v=[];f=[]
 for z in [-depth/2,depth/2]:
  for r in [inner,outer]:
   for i in range(count+1):
    t=a+(b-a)*i/count;v.append((center[0]+math.cos(t)*r,center[1]+math.sin(t)*r,center[2]+z))
 n=count+1
 for i in range(count):f.extend([(i,i+1,n+i+1,n+i),(2*n+i,3*n+i,3*n+i+1,2*n+i+1),(i,2*n+i,2*n+i+1,i+1),(n+i,n+i+1,3*n+i+1,3*n+i)])
 f.extend([(0,n,3*n,2*n),(count,2*n+count,3*n+count,n+count)])
 return mesh(name,v,f,mat,.009)

def port(name,x,y,z,r=.035):
 rod(name+' collar',(x,y,z-.025),(x,y,z+.02),r,'metal',12);rod(name+' recess',(x,y,z+.02),(x,y,z+.024),r*.64,'dark',12)

def grille(name,x,y,z,w,h):
 box(name+' cavity',(w,h,.018),(x,y,z),'dark',.025)
 for i in range(6 if LOW else 9):box(name+' angled blade',(w*.87,.013,.031),(x,y-h*.37+i*h*.74/(5 if LOW else 8),z+.015),'panel',.003)

def fasten_face(x,y,z):
 rod('Recessed captive bolt',(x,y,z-.006),(x,y,z+.004),.012,'metal',8)
 box('Bolt tool recess',(.010,.003,.002),(x,y,z+.006),'dark',0)

def reference_bed():
 start=len(OBJECTS);new_bed()
 # Replace the prior thin scanner completely, retain only patient platform manufacturing geometry.
 prefixes=('Scanner','Gantry','Optical','Sensor','Heat exchange','Patient aperture')
 remove=[o for o in OBJECTS[start:] if o.name.startswith(prefixes)]
 for o in remove:OBJECTS.remove(o);bpy.data.objects.remove(o,do_unlink=True)
 # Reduce the platform's exaggerated length; scanner is independently mounted below.
 for o in OBJECTS[start:]:
  for v in o.data.vertices:v.co.y*=.86
  o.location.y*=.86
 # Deep removable side covers and access panels, asymmetrical upper/lower mechanisms.
 loft('Lower actuator service cover',[(-1.2,.30,.31,.26),(-.9,.40,.28,.34),(.55,.38,.28,.34),(.92,.22,.34,.25)],'white')
 for x in [-.83,.03]:
  for z in [-.74,.38]:
   rod('Bed lift pivot axle',(x-.06,.43,z),(x+.06,.43,z),.08,'metal')
   rod('Lift linkage exposed piston',(x,.38,z),(x,.68,z-.26),.033,'metal')
  for z in [-.7,-.3,.1,.5]:box('Bed shell service vent',(.012,.055,.13),(x,.48,z),'dark',.007)
  cable('Bed flexible utility harness',[(x,.64,-1),(x,.49,-1.2),(x,.22,-1.15),(x,.20,-.6)],.022,'rubber')
 # Actual restraint bands across the mattress with buckles and stiffened stitched edges.
 for z in [-.20,.58]:
  cable('Patient restraint webbing',[(-1.0,.94,z),(-.84,1.045,z),(-.4,1.06,z),(.04,1.045,z),(.20,.94,z)],.028,'rubber')
  box('Restraint buckle body',(.11,.032,.10),(.01,1.073,z),'metal',.012)
  box('Buckle latch',(.05,.018,.066),(.01,1.095,z),'rubber',.005)
 for z in [-1.05,.95]:
  for x in [-.92,.12]:box('Safety release tab',(.09,.045,.16),(x,.73,z),'ochre',.014)
 pad('Raised occipital support',-1.19,-.92,.31,1.07)
 # Major scanner volumes: deep backplane, six removable shells, internal service channel.
 ring('Deep gantry forged spine',(-.4,1.0,-1.28),.80,1.24,.56,mat='rib')
 ring('Gantry rear machined flange',(-.4,1.0,-1.60),.80,1.26,.065,mat='metal')
 ring('Patient aperture ceramic liner',(-.4,1.0,-1.22),.78,.86,.55,mat='white')
 ring('Recessed optical track',(-.4,1.0,-.924),.855,.90,.025,mat='dark')
 for i in range(6):
  a=i*math.pi/6+.012;b=(i+1)*math.pi/6-.012;t=(a+b)/2
  ring('Sculpted removable scanner sector',(-.4,1.0,-1.24),.91,1.255,.49,a,b,'white')
  ring('Sector edge metal trim',(-.4,1.0,-.98),.94,1.24,.025,a+.008,b-.008,'metal')
  ring('Sector recessed service inlay',(-.4,1.0,-.956),1.015,1.16,.013,a+.05,b-.05,'panel')
  for k in range(5):
   theta=t+(k-2)*.031
   x=-.4+math.cos(theta)*1.085;y=1+math.sin(theta)*1.085
   rod('Radial cooling louvre',(x-.023*math.cos(theta),y-.023*math.sin(theta),-.94),(x+.023*math.cos(theta),y+.023*math.sin(theta),-.94),.006,'dark',6)
  for theta in [a+.035,b-.035]:
   for r in [.95,1.22]:fasten_face(-.4+math.cos(theta)*r,1+math.sin(theta)*r,-.968)
  # Narrow controlled indicators follow the patient aperture, leaving most housing unlit.
  ring('Patient aperture light guide',(-.4,1.0,-.936),.805,.825,.012,a+.08,b-.08,'scanner')
 for x in [-1.55,.75]:
  box('Scanner pedestal gasket',(.39,.08,.79),(x,.10,-1.34),'rubber',.06)
  box('Scanner motor pedestal',(.34,.74,.69),(x,.51,-1.35),'white',.11)
  grille('Pedestal air return',x,.50,-.992,.23,.37)
  box('Drive service badge',(.13,.12,.015),(x,.80,-.988),'ochre',.016)
  cable('Managed gantry power hose',[(x,.35,-1.64),(x+.2,.15,-1.88),(x+.3,.12,-1.72),(x+.3,.12,-1.20)],.032,'rubber')
  for k in range(10 if LOW else 22):
   z=-1.69+k*.02;rod('Hose strain relief corrugation',(x+.3-.037,.12,z),(x+.3+.037,.12,z),.010,'rib',8)
 # Connected ceiling optical head; visible mechanical joints and physically connected arm.
 rod('Ceiling detector mount',(-.4,3.29,-1.0),(-.4,2.90,-1.0),.095,'metal')
 rod('Detector upper sleeve',(-.4,3.24,-1.0),(-.4,3.04,-1.0),.16,'white')
 rod('Detector tilt pivot',(-.54,2.89,-1.0),(-.26,2.89,-1.0),.105,'panel')
 cable('Detector articulated support',[(-.4,2.89,-1.0),(-.4,2.66,-.92),(-.4,2.63,-.63)],.065,'white')
 box('Sculpted optical detector head',(.46,.22,.25),(-.4,2.64,-.58),'white',.085)
 box('Detector recessed fascia',(.38,.15,.025),(-.4,2.64,-.439),'dark',.04)
 for x in [-.51,-.29]:
  port('Detector lens',x,2.65,-.412,.055);rod('Detector optical glass',(x,2.65,-.387),(x,2.65,-.38),.033,'glass',16)
 label('AESCULUS',(-.67,.855,1.24),.045)

def hatch():
 # Chamfered pressure enclosure outlines, not a rounded rectangle with an arch pasted on top.
 profile=[(-.78,.32),(.78,.32),(.99,.57),(.99,2.29),(.64,2.65),(-.64,2.65),(-.99,2.29),(-.99,.57)]
 def outline_layer(name,scale,z,mat):
  verts=[(x*scale,y,z+d) for d in [-.04,.04] for x,y in profile];n=8;faces=[tuple(range(7,-1,-1)),tuple(range(8,16))]+[(i,(i+1)%n,(i+1)%n+n,i+n) for i in range(n)];return mesh(name,verts,faces,mat,.025)
 outline_layer('Hatch structural reveal',1.10,-3.52,'rib');outline_layer('Hatch rubber compression seal',1.035,-3.40,'rubber');outline_layer('Pressure leaf chamfered shell',1,-3.31,'hull')
 box('Hatch vision glass',(.44,.56,.025),(0,1.69,-3.243),'glass',.075)
 for x in [-.29,.29]:box('Hatch vision frame',(.04,.64,.05),(x,1.69,-3.22),'metal',.012)
 for y in [1.36,2.02]:box('Hatch vision sill',(.61,.04,.05),(0,y,-3.22),'metal',.012)
 for y in [.62,1.28,2.22]:
  box('Pressure locking dog',(.16,.08,.14),(.91,y,-3.17),'metal',.02)
  rod('Hatch hinge barrel',(-.94,y-.12,-3.19),(-.94,y+.12,-3.19),.033,'metal')
 for x in [-.65,.65]:
  for y in [.51,2.38]:fasten_face(x,y,-3.21)
 box('Emergency release handle',(.16,.23,.09),(.61,1.22,-3.13),'ochre',.03)
 for x in [-.56,-.31,-.06,.19,.44]:box('Hatch safety toe marking',(.16,.07,.01),(x,.38,-3.20),'ochre',.003)
 label('MEDICAL 04',(-.40,2.46,-3.22),.065)

def reference_shell():
 box('Pressure floor substrate',(7,.16,7.5),(0,-.13,-.3),'rib',.01)
 for x in [-2.72,-1.36,0,1.36,2.72]:
  for z in [-2.8,-1.3,.2,1.7]:
   plate('Textured traction deck',[(x-.66,z-.72),(x+.58,z-.72),(x+.66,z-.64),(x+.66,z+.72),(x-.58,z+.72),(x-.66,z+.64)],-.025,.045,'deck')
   for xx in [x-.55,x+.55]:
    for zz in [z-.61,z+.61]:rod('Flush floor fastener',(xx,.023,zz),(xx,.028,zz),.015,'metal',8)
 # Expanded-metal traction inserts: actual crossed strips over a recessed dark field.
 for x in [-1.73,1.20,2.66]:
  for z in [-2.65,-1.05,.55,1.95]:
   box('Traction well',(.50,.012,1.14),(x,.026,z),'dark',.012)
   for i in range(16 if LOW else 24):
    zz=z-.51+i*1.02/(15 if LOW else 23)
    rod('Expanded deck diagonal',(x-.23,.038,zz-.035),(x+.23,.038,zz+.035),.007,'metal',6)
    rod('Expanded deck cross tie',(x-.23,.038,zz+.035),(x+.23,.038,zz-.035),.007,'panel',6)
 # Equipment foundation anchors, no floating slab.
 for x in [-.95,.15]:
  rod('Foundation anchor channel',(x,.035,-1.75),(x,.035,1.5),.026,'metal')
  for z in [-1.55,1.28]:box('Foundation locking clamp',(.20,.05,.20),(x,.055,z),'ochre',.02)
 box('Aft pressure shell',(7,3.5,.16),(0,1.72,-3.72),'rib',.03)
 hatch()
 for x in [-2.55,2.55]:
  # Unequal utility installations on the same pressure-wall construction.
  box('Aft medical service housing',(1.26,2.80,.14),(x,1.68,-3.55),'hull',.09)
  for y in [.38,2.96]:box('Bulkhead clamp sill',(1.21,.055,.06),(x,y,-3.44),'metal',.008)
  grille('Aft environmental return',x,2.64,-3.44,.90,.31)
  for xx in [x-.52,x+.52]:
   for y in [.52,2.85]:fasten_face(xx,y,-3.43)
 # Left supply installation: separate counter and recessed shelf, not a drawer grid.
 box('Left side pressure liner',(.12,3.45,7),(-3.4,1.7,-.3),'hull',.03)
 box('Right side pressure liner',(.12,3.45,7),(3.4,1.7,-.3),'hull',.03)
 for x in [-3.25,3.25]:
  for z in [-3.2,-1.0,1.2]:
   cable('Chamfered pressure knee',[(x*.90,.12,z),(x,.46,z),(x,2.65,z),(x*.82,3.34,z),(x*.63,3.39,z)],.07,'rib')
  for y in [3.05,3.18]:
   rod('Copper service feed',(x*.96,y,-3.4),(x*.96,y,2.2),.028,'copper')
   for z in [-2.9,-1.6,-.3,1,2]:rod('Pipe retaining collar',(x*.96,y,z-.028),(x*.96,y,z+.028),.039,'metal')
 # Shelf facing camera on rear-left, varied bottle silhouettes and support dividers.
 box('Supply recess shadow well',(1.18,1.52,.20),(-2.53,1.72,-3.40),'dark',.09)
 for y in [1.12,1.69,2.26]:box('Supply cabinet shelf',(1.08,.04,.35),(-2.53,y,-3.25),'metal',.015)
 for row in range(2):
  for i in range(4):
   x=-2.93+i*.25;y=1.16+row*.57;h=.18+(i%2)*.07
   rod('Supply vial body',(x,y,-3.21),(x,y+h,-3.21),.052,'bottle',12)
   rod('Vial cap',(x,y+h,-3.21),(x,y+h+.035,-3.21),.056,'metal',12)
   box('Vial paper label',(.063,.060,.006),(x,y+h*.5,-3.151),'white',.004)
 for x in [-3.11,-1.95]:box('Cabinet medical strip',(.015,1.38,.012),(x,1.72,-3.19),'scanner',.004)
 # Chamfered side utility manifold fills the upper service zone with functional fittings.
 def side_leaf(name,xx,yy,zz,w,h,mat):
  outline=[(-w*.5,-h*.34),(-w*.34,-h*.5),(w*.34,-h*.5),(w*.5,-h*.34),(w*.5,h*.34),(w*.34,h*.5),(-w*.34,h*.5),(-w*.5,h*.34)]
  v=[(xx+depth,yy+y,zz+z) for depth in [-.025,.025] for z,y in outline]
  faces=[tuple(range(7,-1,-1)),tuple(range(8,16))]+[(i,(i+1)%8,(i+1)%8+8,i+8) for i in range(8)]
  return mesh(name,v,faces,mat,.018)
 side_leaf('Service module pressure frame',-3.23,2.10,-1.15,2.42,1.16,'rib')
 side_leaf('Faceted medical manifold panel',-3.17,2.10,-1.15,2.29,1.03,'white')
 for z in [-2.0,-1.45,-.90,-.35]:
  rod('Medical manifold metal bezel',(-3.115,2.18,z),(-3.06,2.18,z),.098,'metal',16)
  rod('Medical pressure gauge lens',(-3.058,2.18,z),(-3.051,2.18,z),.079,'glass',16)
  rod('Pressure gauge needle',(-3.048,2.18,z),(-3.048,2.225,z+.039),.003,'ink',6)
  rod('Manifold valve body',(-3.115,1.88,z),(-3.02,1.88,z),.047,'metal',12)
  rod('Manifold ochre valve grip',(-3.01,1.84,z),(-3.01,1.92,z),.012,'ochre',8)
  cable('Individual manifold supply loop',[(-3.12,1.85,z),(-3.07,1.67,z),(-3.07,1.57,z+.14),(-3.25,1.50,z+.14)],.013,'copper')
 for z in [-2.16,-.14]:
  for y in [1.76,2.44]:rod('Service module retaining bolt',(-3.11,y,z),(-3.08,y,z),.015,'metal',8)
 # Side counter is asymmetrical and built from two body lengths, not identical modules.
 for z,length in [(-1.85,1.24),(-.36,1.52)]:
  box('Side clinical cabinet',(.69,.79,length),(-2.95,.53,z),'white',.075)
  box('Sterile counter',(.82,.07,length+.04),(-2.94,.97,z),'metal',.025)
  for y in [.33,.69]:
   box('Recessed cabinet drawer',(.026,.30,length-.13),(-2.585,y,z),'panel',.025)
   rod('Drawer pull',(-2.55,y,z-.18),(-2.55,y,z+.18),.014,'metal')
 # Ceiling engineered cassettes with recessed vent/chase rather than uninterrupted light plane.
 for z in [-2.8,-1.2,.4,2.0]:
  for x in [-2.25,0,2.25]:
   box('Ceiling structural tray',(2.10,.09,1.44),(x,3.43,z),'rib',.03)
   box('Ceiling acoustic insert',(1.87,.025,1.19),(x,3.365,z),'panel',.025)
   for k in range(6):box('Ceiling cooling channel',(1.5,.015,.018),(x,3.341,z-.39+k*.15),'dark',.002)
 for x in [-1.55,1.55]:
  for z in [-2.7,-.8,1.1]:
   box('Overhead task housing',(.55,.09,1.28),(x,3.25,z),'rib',.03)
   box('Overhead practical diffuser',(.40,.018,1.12),(x,3.192,z),'light',.02)
 for z in [-3.05,-1.1,.85,2.5]:
  box('Ceiling transverse brace',(6.6,.12,.10),(0,3.34,z),'metal',.025)
 for x in [-2.35,2.35]:
  rod('Ceiling amber utility line',(x,3.30,-3.45),(x,3.30,2.5),.036,'copper')
  for z in [-3,-2,-1,0,1,2]:rod('Line compression coupling',(x,3.30,z-.04),(x,3.30,z+.04),.049,'ochre')
 # Warm practical strips anchor low wall and aft reveal; small cool indicators are localized.
 for x in [-2.55,2.55]:
  for y in [.22,2.93]:box('Warm rear service light',(.70,.028,.028),(x,y,-3.35),'amber',.01)
 for z in [-1.8,.2]:box('Warm counter toe light',(.026,.025,.55),(-2.59,.13,z),'amber',.007)
 # Planar deck UVs preserve real texture scale instead of unrelated smart UV fragments.
 for o in OBJECTS:
  if o.name.startswith('Textured traction deck'):
   for poly in o.data.polygons:
    for loop in poly.loop_indices:
     v=o.matrix_world @ o.data.vertices[o.data.loops[loop].vertex_index].co;o.data.uv_layers.active.data[loop].uv=(v.x*.80,v.y*.80)

def instrument_trace(x,y,z,w,h):
 box('Instrument recessed display',(w,h,.025),(x,y,z),'glass',.025)
 # Actual independently authored thin-line graphics: simulated illustrative chart, not a reference-image screenshot.
 for i in range(7):box('Instrument horizontal reticle',(w*.88,.002,.002),(x,y-h*.35+i*h*.10,z+.017),'panel',0)
 pts=[]
 pattern=[0,.02,.00,.02,.13,.02,-.06,.44,-.20,.01,.03,.10,.03,0]
 for i in range(61):
  p=pattern[i%len(pattern)];pts.append((x-w*.43+i*w*.86/60,y+h*.07+p*h*.62,z+.022))
 cable('Simulated instrument ECG illustration',pts,.0025,'screen')
 for k in range(3):
  label(['72 bpm','98 %','118 / 76'][k],(x-w*.40,y-h*.12-k*.07,z+.021),.038,'screen')
 for k in range(4):box('Instrument display channel',(w*.19,.008,.002),(x+w*.27,y-h*.13-k*.055,z+.02),'screen',.001)

def reference_equipment():
 # Replace inherited trolley enclosure with a tapered chassis and separate insert drawers.
 for x in [1.84,2.56]:
  for z in [-2.58,-1.94]:
   rod('Caster tyre',(x-.048,.12,z),(x+.048,.12,z),.087,'rubber',12)
   rod('Caster axle',(x-.065,.12,z),(x+.065,.12,z),.029,'metal')
   box('Caster suspension fork',(.12,.15,.08),(x,.23,z),'panel',.02)
 box('Mobile trolley lower bumper',(.97,.11,.83),(2.2,.31,-2.25),'rubber',.075)
 box('Mobile medical chassis',(.89,.84,.76),(2.2,.77,-2.25),'white',.08)
 for y in [.48,.72,.96]:
  box('Instrument drawer dark insert',(.72,.19,.045),(2.2,y,-1.852),'panel',.018)
  box('Drawer recessed latch',(.29,.027,.018),(2.2,y+.04,-1.824),'metal',.006)
  for x in [1.89,2.51]:fasten_face(x,y,-1.82)
 box('Trolley upper sterile tray',(1.04,.09,.89),(2.2,1.24,-2.25),'white',.045)
 box('Recessed tray mat',(.77,.014,.60),(2.2,1.293,-2.25),'cushion',.025)
 box('Tray warm task slot',(.65,.018,.012),(2.2,1.18,-1.795),'amber',.005)
 for x in [1.76,2.64]:cable('Trolley impact protection rail',[(x,.37,-1.88),(x,.50,-1.80),(x,1.02,-1.80),(x,1.22,-1.95)],.022,'metal')
 # Double-link, pivoted monitor mount rather than a pole holding a rectangle.
 for a,b in [((2.44,1.30,-2.52),(2.44,1.57,-2.52)),((2.44,1.57,-2.52),(2.15,1.81,-2.43))]:
  rod('Display articulated support',a,b,.033,'metal')
  cable('Display sleeve',[a,b],.054,'white')
 for x,y,z in [(2.44,1.57,-2.52),(2.15,1.81,-2.43)]:rod('Display mount pivot',(x-.08,y,z),(x+.08,y,z),.075,'panel')
 box('Medical monitor contoured housing',(.94,.64,.12),(2.11,1.98,-2.34),'white',.06)
 instrument_trace(2.11,1.99,-2.267,.80,.48)
 for x in [1.77,2.45]:port('Instrument physical selector',x,1.72,-2.26,.018)
 for i in range(9):box('Monitor rear cooling slot',(.43,.014,.015),(2.11,1.80+i*.04,-2.41),'dark',.003)
 # A physical small control keyboard and connected probe dock.
 box('Recessed control keyboard',(.49,.025,.19),(2.08,1.32,-1.99),'rib',.02)
 for row in range(3):
  for col in range(9):box('Keyboard tactile key',(.032,.008,.031),(1.90+col*.044,1.341,-1.93-row*.044),'hull',.003)
 for i in range(3):
  x=1.98+i*.20;port('Probe interface',x,1.10,-1.81,.029)
  cable('Trolley service lead',[(x,1.10,-1.78),(x,.91,-1.65),(x+.08,.55,-1.72),(2.7,.45,-2.15)],.012,'rubber')
 rod('Instrument pole',(2.78,.40,-2.5),(2.78,2.45,-2.5),.018,'metal')
 rod('Pole hanger',(2.55,2.42,-2.5),(2.95,2.42,-2.5),.012,'metal')
 for x in [2.64,2.89]:
  box('Translucent-look supply reservoir',(.10,.26,.08),(x,2.20,-2.5),'bottle',.035)
  cable('Supply reservoir tube',[(x,2.04,-2.5),(x+.06,1.70,-2.4),(2.75,1.45,-2.3)],.004,'rubber')
 label('SIMULATED', (1.80,1.70,-2.257),.032,'ink')

# Reuse the verified export/AO implementation; build only the three environment parts, both tiers.
exporter=prior[prior.index('# Ray-traced vertex AO'):prior.index('\nmanifest=[]\n',prior.index('# Ray-traced vertex AO'))]
exec(compile(exporter,'vertex_ao_exporter','exec'))
def finalize_deck(asset):
 import struct
 path=os.path.join(ROOT,'public',asset['path']);data=open(path,'rb').read();size=struct.unpack_from('<I',data,12)[0];model=json.loads(data[20:20+size]);rest=data[20+size:]
 for material in model.get('materials',[]):
  if material.get('name')=='Anodized deck alloy':material['pbrMetallicRoughness']['baseColorFactor']=[.45,.66,.78,1]
 encoded=json.dumps(model,separators=(',',':')).encode('utf8');encoded+=b' '*((-len(encoded))%4);header=bytearray(data[:20]);struct.pack_into('<I',header,8,20+len(encoded)+len(rest));struct.pack_into('<I',header,12,len(encoded));result=bytes(header)+encoded+rest
 open(path,'wb').write(result);asset['bytes']=len(result);asset['sha256']=hashlib.sha256(result).hexdigest()
parts=os.environ.get('BAY_PARTS','all')
manifest=[] if parts=='all' else json.load(open(os.path.join(ROOT,'src','scene','assets','benchmark-manifest.json')))
texture_sources=[(im,im.size[0],im.size[1],np.array(im.pixels[:],dtype=np.float32)) for im in bpy.data.images if im.size[0]>0 and im.size[0]<=2048]
for low in [True,False]:
 for im,w,h,pixels in texture_sources:
  im.scale(w,h);im.pixels.foreach_set(pixels)
  if low and w>256:im.scale(256,256)
  im.pack()
 for name,build in [('shell',reference_shell),('examination',reference_bed),('equipment',reference_equipment)]:
  if parts!='all' and name not in parts.split(','):continue
  a=export_asset(name,build,low);a['path']='assets/models/benchmark/'+os.path.basename(a['path']);a['authoring']='Reference-led independent profile/swept mesh authoring; deep gantry sectors, linked support hardware, physically connected service details; UVs, eight-ray vertex AO, embedded PBR, material batching, Draco';a['license']='Original project geometry and authored maps; Poly Haven metal_plate_03 PBR maps CC0; Barlow Condensed glyphs SIL OFL 1.1. Supplied reference image is not used as runtime art.';a['status']='Reference-driven revision — visual approval pending';manifest=[old for old in manifest if old['id']!=a['id']];manifest.append(a)
for asset in manifest:finalize_deck(asset)
with open(os.path.join(OUT,'manifest.json'),'w') as f:json.dump(manifest,f,indent=2)
with open(os.path.join(ROOT,'src','scene','assets','benchmark-manifest.json'),'w') as f:json.dump(manifest,f,indent=2)
bpy.ops.object.select_all(action='SELECT');bpy.ops.object.delete(use_global=False)
for a in manifest:
 if a['tier']=='standard':bpy.ops.import_scene.gltf(filepath=os.path.join(ROOT,'public',a['path']))
bpy.ops.wm.save_as_mainfile(filepath=os.path.join(ROOT,'assets','source','reference-upgrade','medical-bay.blend'))
print('REFERENCE_ASSETS_COMPLETE',json.dumps(manifest))


"""Original project art, authored in meters with Blender 4.5 LTS.
Run: blender --background --python scripts/build_medical_bay.py
Original models/textures; Barlow Condensed glyphs used under SIL OFL 1.1.
Runtime coordinates: X/right, Y/up, Z/front.
"""
import bpy
import math
import json
import os
import hashlib
import numpy as np
from mathutils import Vector

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
OUT = os.path.join(ROOT, 'public', 'assets', 'models')
os.makedirs(OUT, exist_ok=True)
bpy.ops.object.select_all(action='SELECT')
bpy.ops.object.delete(use_global=False)
OBJECTS = []
LOW = False
FONT_PATH = os.path.join(ROOT, '.tools', 'fonts', 'BarlowCondensed-Medium.ttf')
LABEL_FONT = bpy.data.fonts.load(FONT_PATH)

def xyz(p):
    return (p[0], -p[2], p[1])

def surface(name, color, metal, rough, texture=None, emissive=0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    p = m.node_tree.nodes.get('Principled BSDF')
    p.inputs['Base Color'].default_value = (*color, 1)
    p.inputs['Metallic'].default_value = metal
    p.inputs['Roughness'].default_value = rough
    if emissive:
        p.inputs['Emission Color'].default_value = (*color, 1)
        p.inputs['Emission Strength'].default_value = emissive
    if texture:
        # Original small, deterministic roughness/normal textures; actual UVs on the meshes.
        n = 128
        yy, xx = np.mgrid[0:n, 0:n]
        grain = np.random.default_rng(71 if texture == 'brushed' else 23).random((n, n))
        variation = np.sin(yy * 2.7) * .045 + (grain - .5) * .055
        image = bpy.data.images.new(name + '_roughness', n, n)
        image.colorspace_settings.name = 'Non-Color'
        pixels = np.ones((n, n, 4), dtype=np.float32)
        pixels[:, :, :3] = np.clip(rough + variation[:, :, None], 0, 1)
        image.pixels.foreach_set(pixels.ravel())
        image.update()
        image.pack()
        tex = m.node_tree.nodes.new('ShaderNodeTexImage')
        tex.image = image
        m.node_tree.links.new(tex.outputs['Color'], p.inputs['Roughness'])
        normal_image = bpy.data.images.new(name + '_normal', n, n)
        normal_image.colorspace_settings.name = 'Non-Color'
        pixels[:, :, 0] = .5 + (grain - .5) * .04
        pixels[:, :, 1] = .5 + np.sin(yy * 2.7) * .022
        pixels[:, :, 2] = 1
        normal_image.pixels.foreach_set(pixels.ravel())
        normal_image.update()
        normal_image.pack()
        t = m.node_tree.nodes.new('ShaderNodeTexImage')
        t.image = normal_image
        normal = m.node_tree.nodes.new('ShaderNodeNormalMap')
        normal.inputs['Strength'].default_value = .3
        m.node_tree.links.new(t.outputs['Color'], normal.inputs['Color'])
        m.node_tree.links.new(normal.outputs['Normal'], p.inputs['Normal'])
    return m

M = {
    'hull': surface('Graphite enamel', (.12, .16, .19), .32, .59, 'paint'),
    'panel': surface('Recessed titanium panels', (.23, .29, .32), .55, .48, 'brushed'),
    'metal': surface('Satin aluminium', (.53, .61, .65), .82, .32, 'brushed'),
    'dark': surface('Recess and gasket', (.018, .028, .035), .08, .79),
    'white': surface('Ceramic medical shell', (.78, .82, .78), .04, .38, 'paint'),
    'cushion': surface('Medical upholstery', (.095, .20, .22), .0, .87, 'fabric'),
    'rubber': surface('Restraint webbing', (.035, .048, .057), .0, .91),
    'light': surface('Warm practical diffuser', (1, .89, .69), .0, .34, emissive=3.0),
    'cyan': surface('Cyan operational indicator', (.13, .74, .79), .1, .38, emissive=1.4),
    'ink': surface('Ivory equipment marking', (.66, .76, .76), .0, .78),
    'rib': surface('Coated pressure frame', (.09, .12, .14), .5, .52, 'paint'),
    'deck': surface('Anodized deck alloy', (.10, .14, .17), .36, .68, 'brushed'),
    'scanner': surface('Scanner sensing indicator', (.12, .65, .72), .0, .48, emissive=1.1),
}

def finish(obj, name, mat, bevel=0):
    obj.name = name
    obj.data.materials.clear()
    obj.data.materials.append(M[mat])
    if bevel:
        b = obj.modifiers.new('Manufactured edge radius', 'BEVEL')
        b.width = bevel
        b.segments = 2 if LOW else 3
        bpy.context.view_layer.objects.active = obj
        bpy.ops.object.modifier_apply(modifier=b.name)
        for p in obj.data.polygons:
            p.use_smooth = True
        w = obj.modifiers.new('Face weighted normals', 'WEIGHTED_NORMAL')
        w.keep_sharp = True
        bpy.ops.object.modifier_apply(modifier=w.name)
    OBJECTS.append(obj)
    return obj

def box(name, size, pos, mat='hull', radius=.015, rotation=None):
    bpy.ops.mesh.primitive_cube_add(size=1, location=xyz(pos))
    o = bpy.context.object
    o.dimensions = (size[0], size[2], size[1])
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    if rotation:
        # runtime X tilt equals Blender X tilt; opposite Z yaw equals Blender Z rotation.
        o.rotation_euler = rotation
    return finish(o, name, mat, min(radius, min(size) * .42))

def rod(name, start, end, radius, mat='metal', vertices=None):
    a, b = Vector(xyz(start)), Vector(xyz(end))
    bpy.ops.mesh.primitive_cylinder_add(vertices=vertices or (10 if LOW else 16), radius=radius, depth=(b-a).length, location=(a+b)/2)
    o = bpy.context.object
    o.rotation_euler = (b-a).to_track_quat('Z', 'Y').to_euler()
    return finish(o, name, mat, min(radius*.16, .008))

def arch(name, center, inner, outer, depth, start=0, end=math.pi, mat='metal'):
    count = 24 if LOW else 48
    verts, faces = [], []
    for z in [-depth/2, depth/2]:
        for r in [inner, outer]:
            for i in range(count+1):
                t = start + (end-start)*i/count
                verts.append(xyz((center[0]+math.cos(t)*r, center[1]+math.sin(t)*r, center[2]+z)))
    stride = count+1
    for i in range(count):
        faces += [(i, i+1, stride+i+1, stride+i), (2*stride+i, 3*stride+i, 3*stride+i+1, 2*stride+i+1), (i, 2*stride+i, 2*stride+i+1, i+1), (stride+i, stride+i+1, 3*stride+i+1, 3*stride+i)]
    faces += [(0, stride, 3*stride, 2*stride), (count, 2*stride+count, 3*stride+count, stride+count)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    o = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o
    o.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.uv.smart_project(island_margin=.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    o.select_set(False)
    return finish(o, name, mat, .008)

def plate(name, outline, bottom, height, mat='white'):
    verts = [xyz((x,y,z)) for y in [bottom, bottom+height] for x,z in outline]
    n = len(outline)
    faces = [tuple(range(n-1,-1,-1)), tuple(range(n,2*n))]
    faces += [(i, (i+1)%n, (i+1)%n+n, i+n) for i in range(n)]
    mesh = bpy.data.meshes.new(name)
    mesh.from_pydata(verts, [], faces)
    mesh.update()
    o = bpy.data.objects.new(name, mesh)
    bpy.context.collection.objects.link(o)
    bpy.context.view_layer.objects.active = o
    bpy.ops.object.select_all(action='DESELECT')
    o.select_set(True)
    bpy.ops.object.mode_set(mode='EDIT')
    bpy.ops.mesh.select_all(action='SELECT')
    bpy.ops.mesh.normals_make_consistent(inside=False)
    bpy.ops.uv.smart_project(island_margin=.02)
    bpy.ops.object.mode_set(mode='OBJECT')
    return finish(o, name, mat, .025)

def label(text, pos, height=.12, mat='ink'):
    # Converted font outlines, not the old coarse voxel stencil. OFL font retained in authoring tools.
    curve=bpy.data.curves.new('Equipment lettering','FONT')
    curve.body=text
    curve.font=LABEL_FONT
    curve.size=height*1.4
    curve.space_character=1.05
    curve.extrude=.0003
    curve.resolution_u=2 if LOW else 3
    obj=bpy.data.objects.new('Label '+text,curve)
    obj.location=xyz((pos[0],pos[1]-height,pos[2]))
    obj.rotation_euler=(math.pi/2,0,0)
    bpy.context.collection.objects.link(obj)
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active=obj
    bpy.ops.object.convert(target='MESH')
    return finish(bpy.context.object,'Label '+text,mat)

def fastener(x, y, z):
    if not LOW:
        rod('Captive panel fastener', (x,y,z-.006), (x,y,z+.006), .018, 'metal', 8)
        box('Fastener slot', (.018,.004,.002), (x,y,z+.007), 'dark', 0)

def cable(name, points, radius=.016, mat='rubber'):
    curve=bpy.data.curves.new(name,'CURVE')
    curve.dimensions='3D'
    curve.resolution_u=8 if LOW else 12
    curve.bevel_depth=radius
    curve.bevel_resolution=1 if LOW else 2
    spline=curve.splines.new('BEZIER')
    spline.bezier_points.add(len(points)-1)
    for point,position in zip(spline.bezier_points,points):
        point.co=xyz(position)
        point.handle_left_type=point.handle_right_type='AUTO'
    obj=bpy.data.objects.new(name,curve)
    bpy.context.collection.objects.link(obj)
    bpy.ops.object.select_all(action='DESELECT')
    obj.select_set(True)
    bpy.context.view_layer.objects.active=obj
    bpy.ops.object.convert(target='MESH')
    return finish(bpy.context.object,name,mat)

def shell():
    box('Pressure hull floor substrate', (8.1,.18,9), (0,-.12,0), 'dark')
    # Individually recessed floor cassettes and maintenance panels.
    for x in [-3,-1,1,3]:
        for z in [-3.45,-1.15,1.15,3.45]:
            box('Deck cassette', (1.96,.065,2.24), (x,.015,z), 'hull', .025)
            box('Maintenance access inset', (1.75,.012,1.98), (x,.054,z), 'deck', .015)
            for dz in [-.87,.87]:
                box('Flush access handle', (.25,.012,.04), (x,.065,z+dz), 'dark', .008)
            if not LOW:
                for k in range(4):
                    box('Deck traction insert', (1.45,.008,.016), (x,.067,z-.45+k*.3), 'hull', .003)
    for x in [-3.65,3.65]:
        box('Longitudinal equipment rail', (.11,.09,8.8), (x,.07,0), 'metal', .012)
        for z in [-3.5,-2.5,-1.5,-.5,.5,1.5,2.5,3.5]:
            box('Rail anchor socket', (.075,.012,.16), (x,.121,z), 'dark', .007)
    # Rear wall layered panel sections, around a central sealed hatch.
    box('Rear pressure shell', (8.1,3.8,.16), (0,1.9,-4.45), 'hull', .035)
    for x in [-3.35,-2.05,2.05,3.35]:
        for y in [.65,1.7,2.75]:
            box('Bulkhead panel gasket', (1.22,.96,.06), (x,y,-4.32), 'dark', .035)
            box('Recessed bulkhead cassette', (1.14,.88,.075), (x,y,-4.29), 'panel', .035)
            for dx in [-.46,.46]:
                fastener(x+dx,y+.32,-4.24)
                fastener(x+dx,y-.32,-4.24)
    # Pressure hatch: octagonal jamb and seal, layered door leaves, locking mechanisms.
    for i, (inn,out,mat,z) in enumerate([(1.00,1.18,'metal',-4.23),(.94,1.01,'dark',-4.16)]):
        # Top curved header plus straight jambs produces a pressure-door silhouette.
        arch('Pressure hatch crown', (0,2.0,z), inn,out,.16,0,math.pi,mat)
        for x in [-1,1]: box('Pressure hatch jamb', (out-inn,1.9,.16), (x*(inn+out)/2,1.05,z), mat,.02)
    for x in [-.46,.46]:
        box('Sealed hatch leaf', (.9,2.7,.12), (x,1.48,-4.30), 'hull', .11)
        box('Hatch inset face', (.72,2.23,.04), (x,1.55,-4.21), 'panel', .07)
    box('Hatch vertical pressure seal', (.028,2.65,.025), (0,1.48,-4.17), 'dark', .01)
    box('Hatch transom light', (1.25,.025,.025), (0,2.67,-4.10), 'cyan', .007)
    label('MED BAY', (-.52,2.35,-4.13), .15)
    label('PRESSURE SEAL', (-.65,.75,-4.13), .10)
    for x in [-.68,.68]:
        rod('Pressure wheel axle', (x,1.45,-4.15), (x,1.45,-4.0), .045)
        for angle in [0,math.pi/3,2*math.pi/3]:
            dx,dy=math.cos(angle)*.13,math.sin(angle)*.13
            rod('Door wheel spoke', (x-dx,1.45-dy,-3.98), (x+dx,1.45+dy,-3.98), .015)
        for y in [.4,1.0,2.0]: box('Pressure latch', (.22,.13,.08), (x,y,-4.09), 'metal', .025)
    box('Hatch threshold', (2.15,.10,.32), (0,.1,-4.12), 'metal', .02)
    # Side walls: structural jambs, recessed equipment backs, lower service chase.
    for side in [-1,1]:
        box('Side pressure skin', (.14,3.8,9), (side*4.05,1.9,0), 'hull')
        box('Service chase cover', (.18,.48,8.85), (side*3.9,.35,0), 'panel')
        for z in [-3.4,-1.15,1.15,3.4]:
            box('Recessed side bay', (.085,2.35,2.08), (side*3.94,1.85,z), 'dark', .025)
            box('Side bay inner panel', (.095,2.15,1.89), (side*3.88,1.85,z), 'panel' if z < 0 else 'hull', .025)
            box('Horizontal service seam', (.055,.035,1.76), (side*3.80,1.83,z), 'dark', .006)
            if z in [-1.15,3.4]:
                box('Service cartridge surround', (.10,.62,1.15), (side*3.76,1.52,z), 'rib', .04)
                box('Recessed access leaf', (.075,.49,1.02), (side*3.69,1.52,z), 'hull', .025)
                box('Flush service pull', (.035,.055,.32), (side*3.635,1.52,z), 'metal', .012)
            for y in [.98,2.7]:
                box('Ventilation recess', (.06,.23,1.6), (side*3.80,y,z), 'dark', .01)
                for k in range(6 if LOW else 11):
                    box('Technical vent fin', (.05,.15,.025), (side*3.75,y,z-.70+k*(1.4/(5 if LOW else 10))), 'metal', .005)
        for y in [.67,3.0]:
            rod('Routed utility conduit', (side*3.72,y,-4.15), (side*3.72,y,4.3), .025, 'metal')
            for z in [-3,-1,1,3]: box('Conduit service clamp', (.12,.11,.05), (side*3.72,y,z), 'hull')
    # Full overhead skeleton; central panels separated by seams, with bevelled haunches.
    for z in [-4.25,-2.2,0,2.2,4.3]:
        for side in [-1,1]:
            box('Pressure frame vertical rib', (.20,2.9,.20), (side*3.7,1.5,z), 'rib', .035)
            rod('Ceiling haunch strut', (side*3.7,2.9,z), (side*2.8,3.62,z), .095, 'rib', 8)
            for y in [.20,2.85]:
                box('Pressure frame joint shoe', (.26,.20,.27), (side*3.7,y,z), 'metal', .026)
        box('Overhead structural rib', (5.6,.20,.22), (0,3.62,z), 'rib', .035)
    box('Central ceiling service spine', (.76,.18,8.6), (0,3.59,0), 'dark', .025)
    for z in [-3.25,-1.1,1.1,3.25]:
        box('Ceiling inset cassette', (5.6,.10,2.0), (0,3.78,z), 'hull', .02)
        box('Spine removable service cover', (.60,.055,1.78), (0,3.48,z), 'rib', .02)
        for x in [-.26,.26]: box('Service cover edge reveal', (.015,.015,1.6), (x,3.446,z), 'metal', .004)
        for x in [-2.25,2.25]:
            box('Recessed luminaire housing', (.40,.12,1.72), (x,3.57,z), 'dark', .025)
            box('Warm overhead diffuser', (.24,.035,1.55), (x,3.50,z), 'light', .016)
            for dx in [-.18,.18]: box('Luminaire edge trim', (.025,.07,1.7), (x+dx,3.51,z), 'metal', .007)
    # Rear medical lockers are integrated into the architecture.
    for x in [-2.75,2.75]:
        box('Recessed storage housing', (1.5,1.35,.4), (x,1.25,-4.0), 'hull', .06)
        for y in [.86,1.27,1.68]:
            box('Sealed instrument drawer', (1.38,.37,.13), (x,y,-3.73), 'white', .035)
            box('Recessed drawer handle', (.44,.045,.025), (x,y+.03,-3.65), 'dark', .012)
        box('Sterile storage identification plaque', (.82,.20,.025), (x,2.08,-4.16), 'dark', .015)
        label('Sterile storage', (x-.34,2.14,-4.14), .085)
    label('ORBITAL / 01', (-3.5,3.05,-4.15), .13)
    label('SERVICE', (2.4,3.05,-4.15), .13)

def bed():
    # Two deck mounting tracks, four keyed anchor shoes and articulated lift.
    for x in [-1.02,.22]:
        box('Examination deck track', (.16,.12,3.15), (x,.13,-.15), 'metal', .02)
        for z in [-1.4,1.1]:
            box('Keyed station anchor', (.33,.15,.30), (x,.25,z), 'hull', .04)
            rod('Mount lock pin', (x-.08,.34,z), (x+.08,.34,z), .035)
    plate('Compact keyed lift plinth', [(-.83,-1.20),(.03,-1.20),(.17,-1.0),(.17,.70),(-.03,.9),(-.77,.9),(-.97,.70),(-.97,-1.0)], .25,.16,'rib')
    for z in [-.85,.65]:
        rod('Lift linkage', (-.91,.44,z), (.05,.85,z), .055)
        rod('Lift linkage', (.05,.44,z), (-.91,.85,z), .055)
        for x in [-.91,.05]: rod('Lift pivot', (x,.46,z-.07), (x,.46,z+.07), .085,'hull')
        rod('Chrome adjustment piston', (-.7,.4,z), (-.35,.9,z), .045)
        rod('Actuator cylinder', (-.7,.4,z), (-.52,.67,z), .075,'hull')
        for x in [-.91,.05]:
            rod('Pivot retaining cap', (x,.46,z+.075), (x,.46,z+.09), .061,'metal')
            rod('Upper platform pivot', (x,.84,z-.07), (x,.84,z+.07), .070,'rib')
        box('Lift crossmember', (1.0,.075,.095), (-.43,.78,z), 'rib', .02)
    cable('Lift actuator service loom',[(-.65,.43,-.9),(-.79,.55,-.7),(-.73,.70,-.45),(-.65,.80,-.25)],.018)
    outline=[(-.94,-1.65),(.14,-1.65),(.32,-1.38),(.32,.92),(.12,1.34),(-.92,1.34),(-1.12,.92),(-1.12,-1.38)]
    plate('Contoured ceramic examination deck',outline,.88,.17,'white')
    plate('Underside service shell',[(x*.94-.025,z*.94) for x,z in outline],.78,.12,'hull')
    # Four independently profiled pads make the equipment read as an examination cradle.
    for name,width,length,z,y in [('Cervical support',.77,.46,-1.29,1.12),('Thoracic pad',.97,.68,-.65,1.09),('Pelvic pad',1.0,.58,.03,1.08),('Leg support',.78,.68,.71,1.07)]:
        box(name,(width,.16,length),(-.4,y,z),'cushion',.075)
        if not LOW:
            for dx in [-width/2+.035,width/2-.035]:
                box('Cushion welt seam',(.012,.012,length-.12),(-.4+dx,y+.078,z),'panel',.004)
    box('Raised head cradle',(.5,.075,.28),(-.4,1.235,-1.36),'cushion',.09)
    for x in [-1.09,.29]:
        for z in [-1.05,-.2,.7]:
            rod('Restraint attachment eye', (x,.99,z-.055),(x,.99,z+.055),.028)
        for z in [-1.15,.65]:
            rod('Side rail upright',(x,1.0,z),(x,1.27,z),.024)
        rod('Integrated safety rail',(x,1.27,-1.15),(x,1.27,.65),.029)
        for z in [-.55,.4]:
            box('Medical restraint webbing',(.09,.015,.1),(x,1.08,z),'rubber',.01)
            box('Restraint buckle',(.11,.035,.075),(x,1.12,z),'metal',.008)
    for z in [-.55,.4]:
        box('Released restraint section',(.2,.018,.075),(.10,1.18,z),'rubber',.008)
    for z in [-.75,-.45,-.15]:
        rod('Equipment interface socket',(.325,.94,z),(.355,.94,z),.035,'dark')
        rod('Socket collar',(.33,.94,z),(.35,.94,z),.048,'metal')
    for z in [-.9,.8]:
        box('Underside service access cover', (.035,.11,.24), (.29,.83,z), 'rib', .018)
    cable('Scanner carriage supply',[ (.66,.96,-1.15),(.73,.82,-1.02),(.63,.73,-.75),(.37,.78,-.50)],.017)
    box('Bedside control bezel',(.24,.13,.31),(.45,1.04,.74),'hull',.035)
    box('Bedside control face',(.19,.014,.25),(.45,1.112,.74),'dark',.02)
    for z in [.67,.76,.85]: box('Tactile control key',(.08,.008,.035),(.45,1.125,z),'cyan',.005)
    label('EXAM 01',(-.87,.99,1.345),.085,'hull')
    # Rail-mounted U scanner: ceramic segmented arch with open patient access.
    arch('Scanner ceramic arch',(-.4,1.08,-1.12),.90,1.10,.27,0,math.pi,'white')
    arch('Scanner outer frame',(-.4,1.08,-1.12),1.10,1.15,.20,0,math.pi,'metal')
    arch('Scanner sensing channel',(-.4,1.08,-.97),.925,.98,.018,0,math.pi,'dark')
    arch('Scanner cyan status trace',(-.4,1.08,-.955),.931,.943,.014,.18,math.pi-.18,'scanner')
    for x in [-1.43,.63]:
        box('Scanner rail carriage',(.28,.26,.48),(x,1.0,-1.12),'hull',.045)
        rod('Scanner drive rail',(x,.89,-1.5),(x,.89,.7),.035)
    for t in [.3,.8,1.3,1.8,2.3,2.8]:
        x,y=-.4+math.cos(t)*1.035,1.08+math.sin(t)*1.035
        fastener(x,y,-.97)
        box('Scanner sensor cassette',(.10,.125,.055),(x,y,-.925),'rib',.018,rotation=(0,-(t-math.pi/2),0))
        box('Sensor lens inset',(.045,.055,.009),(x,y,-.893),'dark',.008,rotation=(0,-(t-math.pi/2),0))
    box('Scanner crown identification inset',(.38,.12,.025),(-.4,2.12,-.965),'dark',.018)
    label('SCAN / 01',(-.55,2.16,-.944),.065,'ink')
    for x in [-1.43,.63]:
        box('Carriage drive gearbox',(.20,.14,.19),(x,1.06,-.88),'rib',.025)
        rod('Drive pulley hub',(x,1.06,-.77),(x,1.06,-.75),.038,'metal')

def equipment():
    # Purpose-built diagnostic trolley with articulated monitor and probe dock.
    for x in [1.85,2.55]:
        for z in [-2.55,-1.95]:
            rod('Trolley lockable caster axle',(x-.055,.155,z),(x+.055,.155,z),.085,'rubber')
            box('Caster fork',(.15,.19,.1),(x,.28,z),'metal',.02)
    box('Diagnostic trolley chassis',(.96,.14,.91),(2.2,.32,-2.25),'hull',.065)
    box('Ceramic diagnostic enclosure',(.83,.80,.74),(2.2,.79,-2.25),'white',.09)
    for y in [.56,.80]:
        box('Equipment drawer fascia',(.72,.19,.04),(2.2,y,-1.86),'panel',.025)
        box('Equipment drawer pull',(.32,.025,.04),(2.2,y,-1.82),'metal',.008)
    box('Instrument top tray',(.99,.09,.9),(2.2,1.25,-2.25),'white',.045)
    box('Tray sterile insert',(.77,.02,.66),(2.2,1.305,-2.25),'cushion',.035)
    rod('Monitor lower pivot',(2.38,1.27,-2.51),(2.38,1.61,-2.51),.055,'metal')
    rod('Monitor articulated boom',(2.38,1.60,-2.51),(2.11,1.85,-2.39),.045,'metal')
    rod('Monitor elbow',(2.30,1.62,-2.50),(2.44,1.62,-2.50),.09,'hull')
    box('Medical monitor ceramic housing',(.94,.62,.14),(2.08,1.91,-2.32),'white',.06)
    box('Recessed instrument display',(.81,.48,.025),(2.08,1.94,-2.235),'dark',.028)
    label('Diagnostics',(1.76,2.10,-2.21),.085,'cyan')
    label('Standby',(1.85,1.91,-2.21),.065)
    for x in [1.64,2.52]:
        box('Display protective edge cap',(.055,.44,.06),(x,1.93,-2.27),'rib',.02)
    # Abstract hardware status bars: no medical chart or false biometric waveform.
    for k,w in enumerate([.43,.31,.52]):
        box('Hardware readiness strip',(w,.012,.003),(2.02,1.80-k*.035,-2.21),'panel',.002)
    for x in [1.86,2.06,2.26]:
        rod('Instrument tactile key',(x,1.65,-2.24),(x,1.65,-2.20),.025,'hull')
    box('Probe charging cradle',(.22,.14,.3),(2.88,1.1,-2.2),'hull',.03)
    rod('Diagnostic probe handle',(2.88,1.15,-2.2),(2.88,1.43,-2.2),.045,'white')
    box('Probe transducer head',(.14,.07,.10),(2.88,1.47,-2.2),'white',.03)
    # Flexible cable polyline with physically coherent start/end points.
    points=[(2.88,1.18,-2.2),(2.98,.95,-2.15),(3.02,.56,-2.1),(2.86,.40,-2.05),(2.66,.55,-2.08)]
    cable('Probe service cable',points,.018)
    for k in range(6 if LOW else 12):
        box('Trolley ventilation slot',(.28,.012,.008),(2.2,.92+k*.015,-1.868),'dark',.002)
    label('MED / 02',(1.96,.44,-1.79),.06)
    # Wall utility manifold and integrated sample storage, not unrelated props.
    box('Rear utility manifold',(1.0,.42,.18),(-2.8,2.55,-4.05),'white',.04)
    for x in [-3.08,-2.8,-2.52]:
        rod('Utility interface port',(x,2.56,-3.94),(x,2.56,-3.86),.065,'metal')
        rod('Utility port insert',(x,2.56,-3.85),(x,2.56,-3.84),.04,'dark')
    label('UTILITY',(-3.16,2.88,-4.14),.09)

def export_asset(name, build, low):
    global OBJECTS, LOW
    LOW = low
    bpy.ops.object.select_all(action='SELECT')
    bpy.ops.object.delete(use_global=False)
    OBJECTS = []
    build()
    # Merge static geometry by material: one draw per material, not one per bolt/letter.
    merged=[]
    batches=[(mat,[o for o in OBJECTS if o.type=='MESH' and o.data.materials[0]==mat]) for mat in M.values()]
    for mat,matching in batches:
        if not matching: continue
        bpy.ops.object.select_all(action='DESELECT')
        for o in matching: o.select_set(True)
        bpy.context.view_layer.objects.active=matching[0]
        if len(matching)>1: bpy.ops.object.join()
        o=bpy.context.object
        o.name=name+'__'+mat.name
        bpy.ops.object.transform_apply(location=False,rotation=True,scale=True)
        merged.append(o)
    # Named future mount locations survive export as empty nodes.
    anchors = {'shell': [('anchor_display',(-2.5,2.5,-3.6))], 'examination': [('anchor_vitals',(-.4,1.7,-.2))], 'equipment': [('anchor_diagnostics',(2.1,2.35,-2.2))]}
    for label_,position in anchors.get(name,[]):
        obj=bpy.data.objects.new(label_,None)
        obj.location=xyz(position)
        bpy.context.collection.objects.link(obj)
    path=os.path.join(OUT,f'{name}-'+('low' if low else 'standard')+'.glb')
    triangles=sum(len(p.vertices)-2 for o in merged for p in o.data.polygons)
    bpy.ops.export_scene.gltf(filepath=path,export_format='GLB',export_yup=True,export_apply=True,export_texcoords=True,export_normals=True,export_materials='EXPORT',export_draco_mesh_compression_enable=True,export_draco_mesh_compression_level=6,export_draco_position_quantization=14,export_cameras=False,export_lights=False)
    return {'id':name+'-'+('low' if low else 'standard'),'path':'assets/models/'+os.path.basename(path),'bytes':os.path.getsize(path),'triangles':triangles,'drawCalls':len(merged),'sha256':hashlib.sha256(open(path,'rb').read()).hexdigest(),'tier':'low' if low else 'standard','authoring':'Original Blender Python mesh authoring; bevels, weighted normals, UV mapping, material batching, embedded procedural textures, Draco compression','license':'Original project geometry/maps; Barlow Condensed glyph outlines under SIL OFL 1.1; no third-party models/images','status':'Vertical slice asset; art review pending'}

manifest=[]
for low in [False,True]:
    for name,build in [('shell',shell),('examination',bed),('equipment',equipment)]:
        manifest.append(export_asset(name,build,low))
with open(os.path.join(OUT,'manifest.json'),'w') as f: json.dump(manifest,f,indent=2)
with open(os.path.join(ROOT,'src','scene','assets','generated-manifest.json'),'w') as f: json.dump(manifest,f,indent=2)
print('MEDICAL_BAY_ASSETS',json.dumps(manifest))

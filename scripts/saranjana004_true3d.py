import bpy, math, os
from mathutils import Vector
from math import sin, cos, pi

# Saranjana004 cinematic 3D rebuild — procedural assets only; no paid services.
# Render target: 540x960, 24 fps, 55 seconds. Bang Stick identity is preserved.
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for d in list(bpy.data.materials): bpy.data.materials.remove(d)
scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE_NEXT'
scene.render.resolution_x=540; scene.render.resolution_y=960; scene.render.resolution_percentage=100
scene.render.fps=24; scene.frame_start=1; scene.frame_end=1320; scene.frame_step=2
scene.render.image_settings.file_format='PNG'; scene.render.image_settings.color_mode='RGB'
os.makedirs('/tmp/saranjana_frames',exist_ok=True)
scene.render.filepath='/tmp/saranjana_frames/frame_'
scene.world.color=(.008,.012,.028)
scene.view_settings.view_transform='AgX'
scene.render.image_settings.color_mode='RGB'
scene.camera=None

def material(name,color,metal=0,rough=.5,emission=None,strength=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 p=m.node_tree.nodes.get('Principled BSDF')
 p.inputs['Base Color'].default_value=(*color,1); p.inputs['Metallic'].default_value=metal; p.inputs['Roughness'].default_value=rough
 if emission:
  p.inputs['Emission Color'].default_value=(*emission,1); p.inputs['Emission Strength'].default_value=strength
 return m
ink=material('Bang Stick | deep black',(.008,.012,.02),rough=.34)
porcelain=material('Bang Stick | white porcelain',(.94,.96,1),rough=.22)
dark=material('Midnight stone',(.018,.035,.06),.18,.38)
roadmat=material('Wet obsidian road',(.018,.03,.045),.35,.22)
gold=material('Warm lantern glass',(1,.32,.055),.15,.24,(1,.22,.025),3)
blue=material('Saranjana blue energy',(.025,.32,.8),.3,.2,(.015,.18,1),3.8)
teal=material('Mystic teal',(.025,.25,.24),.25,.3,(.01,.12,.14),.7)
leaf=material('Tropical leaves',(.018,.12,.065),0,.9)
earth=material('Dark earth',(.025,.045,.045),0,.95)
stone=material('Ancient gateway stone',(.12,.16,.2),.25,.5)
window=material('Golden windows',(1,.48,.12),.1,.3,(1,.28,.04),2.2)

def smooth(o,mat=None):
 if mat:o.data.materials.append(mat)
 if o.type=='MESH':
  for f in o.data.polygons:f.use_smooth=True
 return o
def ball(name,loc,scale,mat):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=32,ring_count=20,location=loc)
 o=bpy.context.object;o.name=name;o.scale=scale;return smooth(o,mat)
def rod(name,a,b,r,mat,verts=20):
 a=Vector(a);b=Vector(b);v=b-a
 bpy.ops.mesh.primitive_cylinder_add(vertices=verts,radius=r,depth=v.length,location=(a+b)/2)
 o=bpy.context.object;o.name=name;o.rotation_mode='QUATERNION';o.rotation_quaternion=v.to_track_quat('Z','Y')
 return smooth(o,mat)
def block(name,loc,scale,mat,bevel=.08):
 bpy.ops.mesh.primitive_cube_add(size=1,location=loc);o=bpy.context.object;o.name=name;o.dimensions=scale
 bpy.ops.object.transform_apply(location=False,rotation=False,scale=True)
 if bevel:
  b=o.modifiers.new('Rounded machined edges','BEVEL');b.width=bevel;b.segments=3
  o.modifiers.new('Weighted corner normals','WEIGHTED_NORMAL')
 return smooth(o,mat)
def empty(name,loc):
 o=bpy.data.objects.new(name,None);scene.collection.objects.link(o);o.location=loc;return o
def parent_keep(child,p):
 mw=child.matrix_world.copy();child.parent=p;child.matrix_world=mw
 return child
def point(obj,target):
 obj.rotation_euler=(Vector(target)-obj.location).to_track_quat('-Z','Y').to_euler()

# Ground, road, river and layered terrain create real depth and reflections.
block('Ground plane',(0,4,-.32),(80,90,.5),earth,0)
block('Ancient road',(0,-.1,-.035),(3.5,32,.12),roadmat,.12)
for side in (-1,1):
 block('Road edge',(side*1.83,-.1,.015),(.12,32,.13),stone,.03)
for i in range(14):
 block('Road inset',(0,-14+i*2.1,.04),(.045,1.05,.018),teal,.005)
# Water channels flanking the road
for x in (-5.4,5.4):
 block('Mystic river',(x,5,-.13),(2.1,35,.16),blue,.08)
 for i in range(18):
  ball('Water glint',(x+sin(i*2)*.55,-10+i*1.8,-.035),(.12,.42,.025),porcelain)
# Distant hills and tropical forest
for i in range(11):
 x=-13+i*2.6
 ball('Layered jungle hill',(x,15,-.6),(2.8,2.8,2.2+(i%3)*.55),leaf)
for x,y in [(-7,-2),(-5,5),(6,0),(8,8),(-8,12),(7,16)]:
 rod('Palm trunk',(x,y,0),(x+.35,y,4.4),.16,stone)
 for k in range(7):
  a=2*pi*k/7
  end=(x+.35+1.7*cos(a),y+1.25*sin(a),4.1-.45*abs(cos(a)))
  rod('Palm leaf stem',(x+.35,y,4.15),end,.055,leaf,12)
  ball('Palm leaf tip',end,(.16,.16,.12),leaf)

# Old village buildings on both sides, with dimensional roofs and lit interiors.
for idx,(x,y,s) in enumerate([(-4,1,1.0),(4,4,.9),(-4.5,10,1.1),(4.5,13,1.0)]):
 w=2.3*s;h=2.0*s
 block('Village timber house',(x,y,h/2),(w,1.7*s,h),stone,.08)
 block('House warm facade',(x,y-.87*s,h*.48),(w*.82,.05,h*.68),window,.025)
 for dx in (-.48,.48):
  block('Dark doorway',(x+dx*s,y-.91*s,.65*s),(.42*s,.06,1.1*s),dark,.025)
  for z in (1.3,1.75):
   block('Window frame',(x+dx*s,y-.95*s,z*s),(.5*s,.07,.32*s),gold,.02)
 # pitched roof using two slanted slabs
 for side in (-1,1):
  roof=block('Tiled pitched roof',(x+side*.58*s,y,h+ .48*s), (1.35*s,2.0*s,.18*s),dark,.04)
  roof.rotation_euler[1]=side*.55
# City skyline: varied 3D towers with emissive windows.
for i in range(18):
 x=-9+(i%6)*3.5;y=19+(i//6)*3.3;h=4.5+(i*13%8)*.75;w=1.3+(i%3)*.25
 block('Saranjana tower',(x,y,h/2),(w,w,h),dark,.1)
 block('Tower luminous crown',(x,y,h+.12),(w*.65,w*.65,.18),blue,.05)
 for z in [1+j*.65 for j in range(int(h/.65))]:
  for side in (-1,1):
   block('Tower window',(x+side*(w/2+.012),y-.18,z),(.025,.22,.22),window,.008)
# Monumental gateway before the hidden city.
for x in (-2.6,2.6):
 block('Gateway pillar',(x,16,3.2),(.58,.72,6.4),stone,.12)
 for z in (1.0,2.0,3.0,4.0,5.0):
  block('Gateway blue rune',(x,15.61,z),(.68,.035,.075),blue,.02)
block('Gateway lintel',(0,16,6.45),(6.0,.85,.55),stone,.12)
block('Gateway glowing keystone',(0,15.52,6.45),(.8,.08,.8),blue,.12)
# Floating motes and lanterns.
for i in range(42):
 x=-7+(i*19%140)/10;y=1+(i*11%250)/10;z=.5+(i*17%55)/10
 ball('Suspended spirit light',(x,y,z),(.045,.045,.045),gold if i%3 else blue)

# Bang Stick: exact silhouette, rounded white head, two black tufts, slim black body,
# white gloves and white shoes. Articulated pivots are located at actual joints.
root=empty('BANG STICK | animated character root',(0,-3,0))
def char_ball(name,loc,scale,mat):
 return parent_keep(ball(name,loc,scale,mat),root)
def char_rod(name,a,b,r,mat):
 return parent_keep(rod(name,a,b,r,mat),root)
char_rod('Slim torso',(0,0,1.15),(0,0,2.55),.19,ink)
char_ball('Neck',(0,0,2.58),(.14,.14,.16),ink)
char_ball('Round white head',(0,-.015,3.12),(.58,.49,.57),porcelain)
# Exactly two upward black tufts
char_rod('Hair tuft left',(-.24,0,3.52),(-.32,0,3.91),.105,ink)
char_rod('Hair tuft right',(.17,0,3.55),(.28,0,3.98),.105,ink)
# Face is toward camera (-Y)
char_ball('Left eye',(-.2,-.475,3.18),(.06,.035,.085),ink)
char_ball('Right eye',(.2,-.475,3.18),(.06,.035,.085),ink)
# curved smile
cu=bpy.data.curves.new('Friendly smile','CURVE');cu.dimensions='3D';cu.bevel_depth=.018;cu.bevel_resolution=3
sp=cu.splines.new('POLY');sp.points.add(10)
for i,p in enumerate(sp.points):
 x=-.13+i*.026;z=3.00-.045*(1-(x/.13)**2);p.co=(x,-.49,z,1)
sm=bpy.data.objects.new('Smile',cu);scene.collection.objects.link(sm);sm.data.materials.append(ink);parent_keep(sm,root)

# Pivot-based arms and legs. Each limb segment is a true 3D mesh.
limb_pivots=[]
for side in (-1,1):
 shoulder=empty('Shoulder pivot',(side*.2,-.005,2.42));parent_keep(shoulder,root)
 upper=rod('Upper arm',(side*.2,0,2.42),(side*.53,-.015,1.99),.085,ink);parent_keep(upper,shoulder)
 elbow=empty('Elbow pivot',(side*.53,-.015,1.99));parent_keep(elbow,root)
 fore=rod('Forearm',(side*.53,-.015,1.99),(side*.64,-.05,1.65),.073,ink);parent_keep(fore,elbow)
 glove=ball('White glove',(side*.66,-.06,1.59),(.17,.16,.17),porcelain);parent_keep(glove,elbow)
 hip=empty('Hip pivot',(side*.105,0,1.22));parent_keep(hip,root)
 thigh=rod('Thigh',(side*.105,0,1.22),(side*.16,0,.62),.09,ink);parent_keep(thigh,hip)
 knee=empty('Knee pivot',(side*.16,0,.62));parent_keep(knee,hip)
 shin=rod('Shin',(side*.16,0,.62),(side*.19,-.015,.22),.075,ink);parent_keep(shin,knee)
 shoe=ball('White shoe',(side*.19,-.13,.16),(.24,.36,.14),porcelain);parent_keep(shoe,knee)
 limb_pivots.append((shoulder,elbow,hip,knee,side))

# Cinematic camera, real perspective and depth of field.
bpy.ops.object.camera_add(location=(0,-14,5.2));cam=bpy.context.object;cam.name='Saranjana cinematic camera'
scene.camera=cam;cam.data.lens=42;cam.data.dof.use_dof=True
cam.data.dof.focus_object=root;cam.data.dof.aperture_fstop=5.6
point(cam,(0,2.5,2.5))
def area(name,loc,power,color,size,target):
 bpy.ops.object.light_add(type='AREA',location=loc);l=bpy.context.object;l.name=name;l.data.energy=power;l.data.color=color;l.data.shape='DISK';l.data.size=size;point(l,target)
area('Moon key',(-5,-7,10),1800,(.48,.66,1),7,(0,0,2))
area('Warm village bounce',(5,-1,5),1200,(1,.38,.12),5,(0,0,2))
area('Blue city rim',(0,12,8),2400,(.08,.3,1),6,(0,8,2))
area('Soft face fill',(1,-8,3.5),650,(.8,.9,1),4,(0,-3,2))
# Add gentle atmospheric haze with world volume kept subtle for render speed.
scene.world.use_nodes=True
world_nodes=scene.world.node_tree.nodes
world_bg=world_nodes.get('Background');world_bg.inputs['Color'].default_value=(.012,.022,.055,1);world_bg.inputs['Strength'].default_value=.28

# Smooth motion curves and six cinematic camera beats.
def keyloc(obj,frame,loc):
 obj.location=loc;obj.keyframe_insert(data_path='location',frame=frame)
beats=[
 (1,(0,-14,5.2),(0,2,2.4)),
 (220,(-1.8,-11,4.3),(-1,1,2.2)),
 (440,(1.7,-9.5,3.9),(0,4,2.4)),
 (660,(0,-8.5,3.5),(0,8,2.5)),
 (880,(0,-12,5.0),(0,13,2.8)),
 (1100,(0,-10,4.2),(0,16,3.0)),
 (1320,(0,-14,5.2),(0,12,2.5))]
for fr,loc,target in beats:
 cam.location=loc;point(cam,target)
 cam.keyframe_insert(data_path='location',frame=fr)
 cam.keyframe_insert(data_path='rotation_euler',frame=fr)
for f in range(1,1321,6):
 t=f/24
 walk=sin(t*5.0) if f<980 else sin(t*2.0)*.25
 root.location=(.22*sin(t*.42),-3+.018*f/1320,.035+abs(walk)*.045)
 root.rotation_euler[2]=.05*sin(t*.6)
 root.keyframe_insert(data_path='location',frame=f)
 root.keyframe_insert(data_path='rotation_euler',frame=f)
 for shoulder,elbow,hip,knee,side in limb_pivots:
  shoulder.rotation_euler[1]=side*(.10+walk*.22)
  elbow.rotation_euler[1]=side*(.08+max(0,walk)*.12)
  hip.rotation_euler[1]=side*walk*.34
  knee.rotation_euler[1]=side*max(0,-walk)*.48
  for pivot in (shoulder,elbow,hip,knee):
   pivot.keyframe_insert(data_path='rotation_euler',frame=f)
# Interpolation: smooth ease through camera and character motion.
for obj in scene.objects:
 if obj.animation_data and obj.animation_data.action:
  for fc in obj.animation_data.action.fcurves:
   for kp in fc.keyframe_points:kp.interpolation='BEZIER'
scene.render.image_settings.file_format='PNG';scene.render.filepath='/tmp/saranjana_frames/frame_'
scene.render.resolution_percentage=100
scene.render.film_transparent=False
scene.render.image_settings.color_mode='RGB'
scene.render.engine='BLENDER_EEVEE_NEXT'
scene.render.image_settings.color_depth='8'
scene.eevee.taa_render_samples=16
scene.render.filepath='/tmp/saranjana_frames/frame_'
scene.frame_set(1)
bpy.ops.render.render(animation=True)

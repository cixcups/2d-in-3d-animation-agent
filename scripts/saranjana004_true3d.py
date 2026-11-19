import bpy, math, os
from mathutils import Vector
from math import sin, cos, pi

# Saranjana004 — procedural true-3D short, no external assets or paid services.
bpy.ops.object.select_all(action='SELECT'); bpy.ops.object.delete(use_global=False)
for d in bpy.data.materials: bpy.data.materials.remove(d)
scene=bpy.context.scene
scene.render.engine='BLENDER_EEVEE_NEXT' if hasattr(bpy.types, 'BlenderEEVEEPreferences') else 'BLENDER_EEVEE'
scene.render.resolution_x=540; scene.render.resolution_y=960; scene.render.resolution_percentage=100
scene.render.fps=24; scene.frame_start=1; scene.frame_end=1320; scene.frame_step=2
scene.render.image_settings.file_format='PNG'
scene.render.image_settings.color_mode='RGB'
os.makedirs('/tmp/saranjana_frames', exist_ok=True)
scene.render.filepath='/tmp/saranjana_frames/frame_'
scene.render.image_settings.color_mode='RGB'
scene.world.color=(0.018,0.025,0.055)
scene.view_settings.view_transform='Standard'

def mat(name, color, metallic=0, rough=.55, emission=None, strength=0):
 m=bpy.data.materials.new(name); m.diffuse_color=(*color,1); m.use_nodes=True
 bs=m.node_tree.nodes.get('Principled BSDF'); bs.inputs['Base Color'].default_value=(*color,1); bs.inputs['Metallic'].default_value=metallic; bs.inputs['Roughness'].default_value=rough
 if emission:
  bs.inputs['Emission Color'].default_value=(*emission,1); bs.inputs['Emission Strength'].default_value=strength
 return m
black=mat('Bang Stick | matte black',(0.012,.016,.024),rough=.42)
white=mat('Bang Stick | porcelain white',(.92,.94,1),rough=.28)
eye=mat('Eyes',(0.005,.008,.015),rough=.2)
gold=mat('Warm window glow',(1,.36,.07),emission=(1,.22,.035),strength=2.2)
cyan=mat('Saranjana cyan glow',(.08,.62,1),emission=(.025,.3,1),strength=2.5)
green=mat('Tropical foliage',(.025,.19,.095),rough=.9)
ground=mat('Earth',(.035,.055,.07),rough=1)
mist=mat('Mist',(.23,.34,.48),emission=(.08,.16,.28),strength=.35)

def smooth(o, material):
 if material: o.data.materials.append(material)
 if o.type=='MESH':
  for p in o.data.polygons: p.use_smooth=True
 return o
def uv(name, loc, scale, material):
 bpy.ops.mesh.primitive_uv_sphere_add(segments=24, ring_count=16, location=loc); o=bpy.context.object; o.name=name; o.scale=scale; return smooth(o,material)
def cyl(name,a,b,r,material,vertices=16):
 mid=(Vector(a)+Vector(b))/2; direction=Vector(b)-Vector(a)
 bpy.ops.mesh.primitive_cylinder_add(vertices=vertices, radius=r, depth=direction.length, location=mid)
 o=bpy.context.object; o.name=name; o.rotation_mode='QUATERNION'; o.rotation_quaternion=direction.to_track_quat('Z','Y'); return smooth(o,material)
def cone(name,loc,r1,r2,depth,material):
 bpy.ops.mesh.primitive_cone_add(vertices=16, radius1=r1, radius2=r2, depth=depth, location=loc); return smooth(bpy.context.object,material)
def cube(name,loc,scale,material, bevel=.08):
 bpy.ops.mesh.primitive_cube_add(size=1, location=loc); o=bpy.context.object; o.name=name; o.dimensions=scale; bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
 if bevel:
  mod=o.modifiers.new('Soft bevel','BEVEL'); mod.width=bevel; mod.segments=3
  o.modifiers.new('Weighted normals','WEIGHTED_NORMAL')
 return smooth(o,material)

# Character group: recognizable, clean 3D stick silhouette with two tufts.
root=bpy.data.objects.new('BANG STICK | root',None); scene.collection.objects.link(root)
def parent(o): o.parent=root; return o
parent(cyl('Slim black torso',(0,0,1.35),(0,0,2.55),.19,black))
parent(uv('Neck',(0,0,2.55),(.13,.13,.16),black))
parent(uv('Round white head',(0,0,3.02),(.57,.48,.55),white))
# Exactly two black hair tufts
parent(cone('Hair tuft left',(-.22,-.02,3.56),.14,.018,.34,black))
parent(cone('Hair tuft right',(.18,-.02,3.59),.14,.018,.38,black))
# face toward camera (-Y)
parent(uv('Left eye',(-.19,-.444,3.08),(.055,.035,.075),eye))
parent(uv('Right eye',(.19,-.444,3.08),(.055,.035,.075),eye))
# subtle smile curve
cu=bpy.data.curves.new('Smile','CURVE'); cu.dimensions='3D'; cu.bevel_depth=.018; cu.bevel_resolution=3
sp=cu.splines.new('POLY'); sp.points.add(8)
for i,p in enumerate(sp.points):
 x=-.11+i*.0275; z=2.88-.045*(1-(x/.11)**2); p.co=(x,-.468,z,1)
sm=bpy.data.objects.new('Small smile',cu); scene.collection.objects.link(sm); sm.data.materials.append(eye); parent(sm)
# articulated limbs with animated end points via helper objects
limbs=[]
for side in (-1,1):
 x=side*.19
 arm=cyl('Upper arm', (x,0,2.35),(x+side*.34,0,1.95),.075,black); parent(arm)
 fore=cyl('Forearm',(x+side*.34,0,1.95),(x+side*.46,-.02,1.68),.065,black); parent(fore)
 glove=uv('White glove',(x+side*.47,-.03,1.63),(.14,.13,.14),white); parent(glove)
 thigh=cyl('Leg',(side*.10,0,1.28),(side*.14,0,.58),.085,black); parent(thigh)
 shoe=uv('White shoe',(side*.15,-.09,.27),(.23,.34,.13),white); parent(shoe)
 limbs.append((arm,fore,glove,thigh,shoe,side))
# scene props
cube('Ground',(0,0,-.12),(200,200,.2),ground,0)
# distant hill silhouettes
for i in range(9):
 x=-10+i*2.5
 uv('Rounded tropical hill',(x,7,-.8),(2.5,1.2,1.5+(i%3)*.35),green)
# palm trunks and leaves
for x in (-5,-3.7,4.2,5.4):
 cyl('Palm trunk',(x,2,0),(x+.35,2,3.6),.12,ground)
 for k in range(6):
  ang=k*pi/3
  end=(x+.35+1.15*cos(ang),2+1.0*sin(ang),3.55-.25*abs(cos(ang)))
  cyl('Palm frond',(x+.35,2,3.55),end,.035,green,10)
# glowing skyline at back right; buildings are genuine meshes
for i in range(12):
 x=3.8+(i%4)*1.0; y=5+(i//4)*1.3; h=2.2+(i*37%7)*.65
 cube('Saranjana tower',(x,y,h/2),(0.72,.72,h),cyan if i%4==0 else black,.06)
 for z in [0.5+j*.42 for j in range(int(h/0.42))]:
  if z<h-.1:
   cube('Lit window',(x,y-.37,z),(.16,.025,.12),gold,.01)
# atmospheric floating lights
for i in range(35):
 x=-5+(i*17%100)/10; z=.5+(i*13%40)/10
 uv('Floating city light',(x,3.5,z),(.025,.025,.025),gold if i%2 else cyan)

# Camera and lighting
bpy.ops.object.camera_add(location=(0,-13,5.3)); cam=bpy.context.object; cam.name='Cinematic camera'; scene.camera=cam
def point(o, target): o.rotation_euler=(Vector(target)-o.location).to_track_quat('-Z','Y').to_euler()
point(cam,(0,0,2.0)); cam.data.type='ORTHO'; cam.data.ortho_scale=8.8; cam.data.lens=50
def area(name,loc,power,color,size,target):
 bpy.ops.object.light_add(type='AREA', location=loc); l=bpy.context.object; l.name=name; l.data.energy=power; l.data.color=color; l.data.shape='DISK'; l.data.size=size; point(l,target)
area('Soft key',( -4,-6,8),1100,(.72,.84,1),6,(0,0,2))
area('Warm rim',(4,2,6),1500,(1,.35,.12),5,(0,0,2))
area('Front fill',(3,-5,3),450,(.25,.55,1),4,(0,0,2))
scene.camera.data.dof.use_dof=False
# Timeline: 6 story beats with animated character, camera push and changing city atmosphere.
def key(obj, frame, loc=None, rot=None):
 if loc is not None: obj.location=loc; obj.keyframe_insert(data_path='location',frame=frame)
 if rot is not None: obj.rotation_euler=rot; obj.keyframe_insert(data_path='rotation_euler',frame=frame)
for f in range(1,1321,12):
 scene.frame_set(f)
 t=f/24
 # gentle breathing/bobbing and walking cycle; pause at dramatic beats
 walk=sin(t*5.2) if f<900 else sin(t*2.1)*.25
 root.location=(.18*sin(t*.55),0,.06+abs(walk)*.055)
 root.rotation_euler[2]=.07*sin(t*.7)
 for arm,fore,glove,thigh,shoe,side in limbs:
  arm.rotation_euler[1]=side*.10+walk*.13*side
  fore.rotation_euler[1]=walk*.09*side
  thigh.rotation_euler[1]=walk*.23*side
  shoe.rotation_euler[1]=walk*.18*side
  arm.keyframe_insert(data_path='rotation_euler',frame=f)
  fore.keyframe_insert(data_path='rotation_euler',frame=f)
  thigh.keyframe_insert(data_path='rotation_euler',frame=f)
  shoe.keyframe_insert(data_path='rotation_euler',frame=f)
 root.keyframe_insert(data_path='location',frame=f)
 root.keyframe_insert(data_path='rotation_euler',frame=f)
 # camera slowly pushes in across story
 cam.data.ortho_scale=8.8-.8*(f/1320)
 cam.data.keyframe_insert(data_path='ortho_scale',frame=f)
# Camera cuts simulated by position and framing shifts at scene beats
for fr,loc,target in [(1,(0,-13,5.3),(0,0,2)),(240,(-.8,-12,5),(0,1,2)),(480,(1.3,-11,4.7),(1,2,2)),(720,(0,-10,4.3),(1,2,2)),(960,(0,-12,5),(0,1,2)),(1200,(0,-13,5.4),(0,1,2))]:
 cam.location=loc; point(cam,target); cam.keyframe_insert(data_path='location',frame=fr); cam.keyframe_insert(data_path='rotation_euler',frame=fr)
# Render settings and color management
scene.render.image_settings.color_mode='RGB'
scene.render.ffmpeg.audio_codec='AAC'
scene.render.resolution_percentage=100
available_engines={item.identifier for item in scene.render.bl_rna.properties['engine'].enum_items}
scene.render.engine='BLENDER_EEVEE' if 'BLENDER_EEVEE' in available_engines else ('BLENDER_EEVEE_NEXT' if 'BLENDER_EEVEE_NEXT' in available_engines else 'CYCLES')
if hasattr(scene, 'eevee') and hasattr(scene.eevee, 'taa_render_samples'):
 scene.eevee.taa_render_samples=8
scene.render.image_settings.file_format='PNG'
scene.render.filepath='/tmp/saranjana_frames/frame_'
scene.frame_set(1)
bpy.ops.render.render(animation=True)

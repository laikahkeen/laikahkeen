# The "enter the server" room: modelled, lit and baked here, exported to
# public/models/server-room.glb. Run through scripts/build-server-room.sh, not directly.
#
# Contract with src/server/scene.ts, by node name:
#   room                  every static surface, one mesh, lighting baked into its texture
#   glow                  LEDs and lamps, unbaked: flat emissive, lit by bloom on the page
#   screen_<tool>         the three terminal screens, unbaked: the page draws on them
#   cam_<stop>/look_<stop> camera position and target per stop: entry and each tool
import math
import random
import sys

import bpy
from mathutils import Vector

OUT = sys.argv[sys.argv.index("--") + 1]
BAKE_SIZE = 2048
TOOLS = ["list_projects", "get_project", "get_experience"]
rand = random.Random(0x5EED)

bpy.ops.wm.read_factory_settings(use_empty=True)
scene = bpy.context.scene
scene.render.engine = "CYCLES"
scene.cycles.samples = 256
scene.cycles.use_denoising = True
prefs = bpy.context.preferences.addons["cycles"].preferences
prefs.compute_device_type = "METAL"
prefs.get_devices()
for d in prefs.devices:
    d.use = True
scene.cycles.device = "GPU"
scene.world = bpy.data.worlds.new("world")
scene.world.color = (0, 0, 0)


def material(name, color, emit=0.0):
    m = bpy.data.materials.new(name)
    m.use_nodes = True
    bsdf = m.node_tree.nodes["Principled BSDF"]
    bsdf.inputs["Base Color"].default_value = (*color, 1)
    bsdf.inputs["Roughness"].default_value = 0.8
    if emit:
        bsdf.inputs["Emission Color"].default_value = (*color, 1)
        bsdf.inputs["Emission Strength"].default_value = emit
    return m


SHELL = material("shell", (0.035, 0.035, 0.038))
FLOOR = material("floor", (0.05, 0.05, 0.052))
RACK = material("rack", (0.075, 0.075, 0.08))
METAL = material("metal", (0.22, 0.22, 0.23))
LINE = material("line", (0.16, 0.16, 0.17))
LED = material("led", (0.85, 0.9, 1.0), emit=12)
LAMP = material("lamp", (1, 1, 1), emit=12)
# Dim on purpose: the page draws a dark UI on these, so a bright bake would halo the bezels.
SCREEN = material("screen", (0.8, 0.82, 0.9), emit=0.5)

static, glow = [], []


def box(name, size, loc, mat, rot=(0, 0, 0), group=static):
    bpy.ops.mesh.primitive_cube_add(size=1, location=loc, rotation=rot)
    o = bpy.context.active_object
    o.name = name
    o.scale = size
    # location and rotation default to True too; the screens need their pose as node TRS.
    bpy.ops.object.transform_apply(location=False, rotation=False, scale=True)
    o.data.materials.append(mat)
    if group is not None:
        group.append(o)
    return o


# Shell: a long hall, x across, y deep, z up. Open toward the entry camera.
W, D0, D1, H = 9.0, -18.0, 7.0, 4.6
box("floor", (2 * W, D1 - D0, 0.1), (0, (D0 + D1) / 2, -0.05), FLOOR)
box("ceiling", (2 * W, D1 - D0, 0.1), (0, (D0 + D1) / 2, H + 0.05), SHELL)
box("back", (2 * W, 0.1, H), (0, D1 + 0.05, H / 2), SHELL)
for s in (-1, 1):
    box(f"wall{s}", (0.1, D1 - D0, H), (s * (W + 0.05), (D0 + D1) / 2, H / 2), SHELL)

# Floor grid, a hair proud of the floor so it bakes as its own lighter line.
for x in range(-8, 9, 2):
    box(f"gx{x}", (0.02, D1 - D0, 0.004), (x, (D0 + D1) / 2, 0.002), LINE)
for y in range(int(D0), int(D1) + 1, 2):
    box(f"gy{y}", (2 * W, 0.02, 0.004), (0, y, 0.002), LINE)

# Racks in two rows each side of the aisle, fronts facing the aisle.
for side in (-1, 1):
    for row, x in enumerate((3.4, 6.6)):
        for i in range(12):
            y = -15.5 + i * 0.72
            cx = side * x
            box(f"rack{side}{row}{i}", (0.95, 0.66, 2.3), (cx, y, 1.15), RACK)
            face = cx - side * 0.48
            for k in range(rand.randint(3, 9)):
                z = 0.35 + rand.random() * 1.8
                box(f"led{side}{row}{i}{k}", (0.012, rand.choice((0.04, 0.08, 0.2)), 0.012), (face, y + rand.uniform(-0.22, 0.22), z), LED, group=glow)
        box(f"tray{side}{row}", (0.4, 9.0, 0.06), (side * x, -11.5, 3.2), METAL)

# Ceiling strips over the aisle, the main light.
for y in range(-16, 6, 3):
    box(f"lamp{y}", (0.12, 1.6, 0.04), (0, y, H - 0.04), LAMP, group=glow)
for side in (-1, 1):
    box(f"cove{side}", (0.06, D1 - D0 - 2, 0.04), (side * (W - 0.15), (D0 + D1) / 2, H - 0.3), LAMP, group=glow)

# Terminals: an arc at the head of the aisle, each turned to face the walkway.
FOCUS = Vector((0, -6, 1.5))
for i, tool in enumerate(TOOLS):
    a = math.radians((i - 1) * 32)
    base = Vector((math.sin(a) * 5.0, 3.2 - (1 - math.cos(a)) * 5.0, 0))
    to = (FOCUS - base)
    yaw = math.atan2(to.x, -to.y)
    box(f"plinth_{tool}", (0.9, 0.7, 0.9), (base.x, base.y, 0.45), RACK, rot=(0, 0, yaw))
    box(f"stem_{tool}", (0.12, 0.12, 0.6), (base.x, base.y, 1.2), METAL, rot=(0, 0, yaw))
    tilt = math.radians(-12)
    centre = base + Vector((0, 0, 1.95))
    box(f"bezel_{tool}", (2.1, 0.08, 1.3), centre, RACK, rot=(tilt, 0, yaw))
    normal = Vector((0, -1, 0))
    normal.rotate(bpy.data.objects[f"bezel_{tool}"].rotation_euler)
    s = box(f"screen_{tool}", (1.92, 0.01, 1.12), centre + normal * 0.046, SCREEN, rot=(tilt, 0, yaw), group=None)
    for name, loc in ((f"cam_{tool}", centre + normal * 2.6 + Vector((0, 0, 0.05))), (f"look_{tool}", centre)):
        e = bpy.data.objects.new(name, None)
        e.location = loc
        scene.collection.objects.link(e)

for name, loc in (("cam_entry", (0, -17, 1.7)), ("look_entry", (0, 2, 1.6))):
    e = bpy.data.objects.new(name, None)
    e.location = loc
    scene.collection.objects.link(e)


def join(objects, name):
    bpy.ops.object.select_all(action="DESELECT")
    for o in objects:
        o.select_set(True)
    bpy.context.view_layer.objects.active = objects[0]
    bpy.ops.object.join()
    o = bpy.context.active_object
    o.name = o.data.name = name
    return o


# One mesh, one lightmap. Glow and screens stay out of it but still light the bake.
join(glow, "glow")
room = join(static, "room")

bake_uv = room.data.uv_layers.new(name="bake")
room.data.uv_layers.active = bake_uv
bpy.ops.object.mode_set(mode="EDIT")
bpy.ops.mesh.select_all(action="SELECT")
# Smart project keeps islands at their world size, so texels go where the area is.
bpy.ops.uv.smart_project(angle_limit=math.radians(66), island_margin=0.002, scale_to_bounds=False)
bpy.ops.object.mode_set(mode="OBJECT")
for uv in list(room.data.uv_layers):
    if uv.name != "bake":
        room.data.uv_layers.remove(uv)

image = bpy.data.images.new("room_bake", BAKE_SIZE, BAKE_SIZE)
for m in room.data.materials:
    node = m.node_tree.nodes.new("ShaderNodeTexImage")
    node.image = image
    m.node_tree.nodes.active = node

scene.cycles.bake_type = "COMBINED"
scene.render.bake.use_pass_direct = True
scene.render.bake.use_pass_indirect = True
scene.render.bake.margin = 4
bpy.ops.object.select_all(action="DESELECT")
room.select_set(True)
bpy.ops.object.bake(type="COMBINED")

# Swap the room to a single emission-only material reading the bake: unlit on export.
baked = bpy.data.materials.new("room_baked")
baked.use_nodes = True
nt = baked.node_tree
nt.nodes.clear()
tex = nt.nodes.new("ShaderNodeTexImage")
tex.image = image
out = nt.nodes.new("ShaderNodeOutputMaterial")
nt.links.new(tex.outputs["Color"], nt.nodes.new("ShaderNodeBsdfPrincipled").inputs["Base Color"])
nt.links.new(nt.nodes["Principled BSDF"].outputs["BSDF"], out.inputs["Surface"])
room.data.materials.clear()
room.data.materials.append(baked)

image.pack()

bpy.ops.export_scene.gltf(
    filepath=OUT,
    export_format="GLB",
    export_image_format="JPEG",
    export_jpeg_quality=85,
    export_apply=True,
    export_yup=True,
)
print(f"wrote {OUT}")

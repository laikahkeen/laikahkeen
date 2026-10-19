// The "enter the server" room. Lazy-loaded by ServerGame.vue. The model and its
// baked lighting come from scripts/build-server-room.sh; node names are the contract.
import {
  ACESFilmicToneMapping,
  Box3,
  Color,
  Fog,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  Raycaster,
  Scene,
  SRGBColorSpace,
  Vector2,
  Vector3,
  WebGLRenderer,
  type Material,
  type Object3D,
  type Texture,
} from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { OutputPass } from 'three/addons/postprocessing/OutputPass.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import type { McpToolName } from '../types/index.ts';
import { canvasPanel, type CanvasPanel } from './panels';

export const TOOLS: McpToolName[] = ['list_projects', 'get_project', 'get_experience'];
export type Stop = 'entry' | McpToolName;

// Where a screen sits, so things can be placed in front of it.
export interface Frame {
  centre: Vector3;
  right: Vector3;
  up: Vector3;
  normal: Vector3;
}

export interface ServerScene {
  camera: PerspectiveCamera;
  // The camera looks here every frame; tween it with the position.
  target: Vector3;
  stops: Record<Stop, { pos: Vector3; look: Vector3 }>;
  screens: Record<McpToolName, CanvasPanel & { frame: Frame }>;
  // Everything the tool calls conjure goes in here.
  world: Group;
  pick(x: number, y: number): McpToolName | null;
  render(): void;
  resize(width: number, height: number): void;
  dispose(): void;
}

const SCREEN_PX = 1024;

export async function createServerScene(
  canvas: HTMLCanvasElement,
  opts: { width: number; height: number; model: string }
): Promise<ServerScene> {
  const gltf = await new GLTFLoader().loadAsync(opts.model);

  const renderer = new WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
  renderer.toneMapping = ACESFilmicToneMapping;
  renderer.outputColorSpace = SRGBColorSpace;

  const scene = new Scene();
  scene.background = new Color(0x000000);
  scene.fog = new Fog(0x000000, 10, 34);
  scene.add(gltf.scene);

  const node = (name: string) => {
    const o = gltf.scene.getObjectByName(name);
    if (!o) throw new Error(`server-room.glb: no node "${name}"`);
    return o;
  };

  // Baked lighting is the whole look: show the texture as it is, unlit.
  const room = node('room') as Mesh;
  const baked = (room.material as MeshBasicMaterial).map as Texture;
  baked.colorSpace = SRGBColorSpace;
  // Not tone mapped: the bake is already the final image, and a texel can never reach
  // the bloom threshold, so only the glow mesh blooms.
  room.material = new MeshBasicMaterial({ map: baked, toneMapped: false });
  // Over 1.0 so bloom picks up the LEDs and lamps and nothing else.
  (node('glow') as Mesh).material = new MeshBasicMaterial({ color: new Color(1.25, 1.25, 1.35) });

  gltf.scene.updateMatrixWorld(true);
  const world = new Group();
  scene.add(world);

  const stops = {} as ServerScene['stops'];
  for (const stop of ['entry', ...TOOLS] as Stop[]) {
    stops[stop] = {
      pos: node(`cam_${stop}`).getWorldPosition(new Vector3()),
      look: node(`look_${stop}`).getWorldPosition(new Vector3()),
    };
  }

  // The exported screens are boxes with cube UVs; draw on a plane laid over each face.
  const screens = {} as ServerScene['screens'];
  for (const tool of TOOLS) {
    const box = node(`screen_${tool}`) as Mesh;
    box.visible = false;
    const size = new Box3().setFromBufferAttribute(box.geometry.attributes.position as never).getSize(new Vector3());
    const panel = canvasPanel(size.x, size.y, SCREEN_PX);
    box.parent!.add(panel.mesh);
    panel.mesh.position.copy(box.position);
    panel.mesh.quaternion.copy(box.quaternion);
    panel.mesh.translateZ(size.z / 2 + 0.002);
    panel.mesh.updateMatrixWorld();
    const e = panel.mesh.matrixWorld.elements;
    screens[tool] = {
      ...panel,
      frame: {
        centre: panel.mesh.getWorldPosition(new Vector3()),
        right: new Vector3(e[0], e[1], e[2]).normalize(),
        up: new Vector3(e[4], e[5], e[6]).normalize(),
        normal: new Vector3(e[8], e[9], e[10]).normalize(),
      },
    };
    panel.mesh.userData.tool = tool;
  }

  const camera = new PerspectiveCamera(50, opts.width / opts.height, 0.05, 80);
  camera.position.copy(stops.entry.pos);
  const target = stops.entry.look.clone();

  const composer = new EffectComposer(renderer);
  composer.addPass(new RenderPass(scene, camera));
  const bloom = new UnrealBloomPass(new Vector2(opts.width, opts.height), 0.35, 0.05, 1.0);
  composer.addPass(bloom);
  composer.addPass(new OutputPass());

  const resize = (w: number, h: number) => {
    renderer.setSize(w, h, false);
    composer.setSize(w, h);
    camera.aspect = w / h;
    // Portrait needs a wider lens to keep a terminal and its output both in frame.
    camera.fov = w / h < 1 ? 68 : 50;
    camera.updateProjectionMatrix();
  };
  resize(opts.width, opts.height);

  const raycaster = new Raycaster();
  const pickable = TOOLS.map((t) => screens[t].mesh);

  return {
    camera,
    target,
    stops,
    screens,
    world,
    pick(x, y) {
      raycaster.setFromCamera(new Vector2(x, y), camera);
      const hit = raycaster.intersectObjects(pickable, false)[0];
      return (hit?.object.userData.tool as McpToolName | undefined) ?? null;
    },
    render() {
      camera.lookAt(target);
      composer.render();
    },
    resize,
    dispose() {
      scene.traverse((o: Object3D) => {
        const m = o as Mesh;
        m.geometry?.dispose();
        for (const mat of ([] as Material[]).concat(m.material ?? [])) {
          (mat as MeshBasicMaterial).map?.dispose();
          mat.dispose();
        }
      });
      composer.dispose();
      renderer.dispose();
    },
  };
}

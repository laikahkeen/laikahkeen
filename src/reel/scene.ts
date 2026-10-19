// The hero reel's WebGL layer. Lazy-loaded by HeroReel.vue, so three.js stays
// out of the home page's first load.
import {
  BufferAttribute,
  BufferGeometry,
  Color,
  DoubleSide,
  Group,
  Mesh,
  MeshBasicMaterial,
  PerspectiveCamera,
  PlaneGeometry,
  Points,
  Scene,
  ShaderMaterial,
  SRGBColorSpace,
  TextureLoader,
  Vector3,
  WebGLRenderer,
} from 'three';
import { plane as planeShape, type Shape } from './shapes';

const FOV = 40;

// Each particle eases from aFrom to aTo with its own delay; swirl and drift sit on top
// so a formation can breathe without changing its targets.
const vertexShader = /* glsl */ `
  attribute vec3 aFrom;
  attribute vec3 aTo;
  attribute float aSeed;
  uniform float uMix;
  uniform float uTime;
  uniform float uDrift;
  uniform float uSwirl;
  uniform float uSize;
  uniform float uDist;
  uniform float uPixelRatio;

  void main() {
    float t = clamp((uMix - aSeed * 0.3) / 0.7, 0.0, 1.0);
    t = t < 0.5 ? 4.0 * t * t * t : 1.0 - pow(-2.0 * t + 2.0, 3.0) / 2.0;
    vec3 p = mix(aFrom, aTo, t);
    p.z += sin(t * 3.14159) * (aSeed - 0.5) * 900.0;

    float a = uSwirl * (1.0 - clamp(length(p.xy) / 1600.0, 0.0, 1.0));
    p.xy = mat2(cos(a), sin(a), -sin(a), cos(a)) * p.xy;

    p += uDrift * 36.0 * vec3(
      sin(uTime * 0.7 + aSeed * 40.0),
      cos(uTime * 0.6 + aSeed * 31.0),
      sin(uTime * 0.5 + aSeed * 17.0)
    );

    vec4 mv = modelViewMatrix * vec4(p, 1.0);
    gl_PointSize = uSize * uPixelRatio * (uDist / -mv.z);
    gl_Position = projectionMatrix * mv;
  }
`;

const fragmentShader = /* glsl */ `
  uniform vec3 uColor;
  uniform float uOpacity;
  void main() {
    vec2 c = gl_PointCoord - 0.5;
    if (dot(c, c) > 0.25) discard;
    gl_FragColor = vec4(uColor, uOpacity);
  }
`;

export interface ReelScene {
  uniforms: {
    uMix: { value: number };
    uTime: { value: number };
    uDrift: { value: number };
    uSwirl: { value: number };
    uSize: { value: number };
    uOpacity: { value: number };
  };
  group: Group;
  product: Mesh<PlaneGeometry, MeshBasicMaterial>;
  // Start a new formation from wherever the last one landed. Tween uMix 0 -> 1 after.
  morph(to: Shape): void;
  // Jump straight to a formation, no transition.
  snap(to: Shape): void;
  // The product plane, as particles, at the plane's current pose.
  productShape(): Shape;
  setInk(light: boolean): void;
  render(time: number): void;
  dispose(): void;
}

export function createReelScene(
  canvas: HTMLCanvasElement,
  opts: { width: number; height: number; count: number; image: string; start: Shape }
): ReelScene {
  const { width, height, count } = opts;
  const renderer = new WebGLRenderer({ canvas, antialias: true });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(width, height, false);

  // At this distance one world unit is one CSS pixel on the z = 0 plane, so DOM
  // rects map straight into the scene — which is what lets the swarm land on the h1.
  const dist = height / 2 / Math.tan(((FOV / 2) * Math.PI) / 180);
  const camera = new PerspectiveCamera(FOV, width / height, 1, dist * 4);
  camera.position.set(0, 0, dist);

  const scene = new Scene();
  const group = new Group();
  scene.add(group);

  const geometry = new BufferGeometry();
  const from = new BufferAttribute(new Float32Array(opts.start), 3);
  const to = new BufferAttribute(new Float32Array(opts.start), 3);
  const seeds = new Float32Array(count);
  for (let i = 0; i < count; i++) seeds[i] = (i * 0.618034) % 1;
  geometry.setAttribute('position', new BufferAttribute(new Float32Array(opts.start), 3));
  geometry.setAttribute('aFrom', from);
  geometry.setAttribute('aTo', to);
  geometry.setAttribute('aSeed', new BufferAttribute(seeds, 1));

  const uniforms = {
    uMix: { value: 1 },
    uTime: { value: 0 },
    uDrift: { value: 1 },
    uSwirl: { value: 0 },
    uSize: { value: 2 },
    uOpacity: { value: 1 },
    uDist: { value: dist },
    uPixelRatio: { value: renderer.getPixelRatio() },
    uColor: { value: new Color(0xffffff) },
  };
  const material = new ShaderMaterial({
    vertexShader,
    fragmentShader,
    uniforms,
    transparent: true,
    depthTest: false,
    depthWrite: false,
  });
  const points = new Points(geometry, material);
  // Formations span the viewport and beyond; the default bounding sphere would cull them.
  points.frustumCulled = false;
  group.add(points);

  const pw = Math.min(width * (width < 768 ? 0.92 : 0.72), 1100);
  const ph = (pw * 9) / 16;
  // Cover-fit, top-aligned: the plane's shape is fixed before the image arrives.
  const texture = new TextureLoader().load(opts.image, (t) => {
    const img = t.image as HTMLImageElement;
    const ratio = img.width / img.height / (pw / ph);
    if (ratio > 1) {
      t.repeat.set(1 / ratio, 1);
      t.offset.set((1 - 1 / ratio) / 2, 0);
    } else {
      t.repeat.set(1, ratio);
      t.offset.set(0, 1 - ratio);
    }
  });
  texture.colorSpace = SRGBColorSpace;
  const product = new Mesh(
    new PlaneGeometry(pw, ph),
    new MeshBasicMaterial({ map: texture, transparent: true, opacity: 0, side: DoubleSide })
  );
  group.add(product);

  renderer.setClearColor(0x000000);

  const v = new Vector3();
  return {
    uniforms,
    group,
    product,
    morph(shape) {
      (from.array as Float32Array).set(to.array as Float32Array);
      (to.array as Float32Array).set(shape);
      from.needsUpdate = true;
      to.needsUpdate = true;
      uniforms.uMix.value = 0;
    },
    snap(shape) {
      (from.array as Float32Array).set(shape);
      (to.array as Float32Array).set(shape);
      from.needsUpdate = true;
      to.needsUpdate = true;
      uniforms.uMix.value = 1;
    },
    productShape() {
      product.updateMatrix();
      const { width: w, height: h } = product.geometry.parameters;
      return planeShape(count, w, h, ([x, y, z]) => {
        v.set(x, y, z).applyMatrix4(product.matrix);
        return [v.x, v.y, v.z];
      });
    },
    setInk(light) {
      renderer.setClearColor(light ? 0xffffff : 0x000000);
      uniforms.uColor.value.set(light ? 0x000000 : 0xffffff);
    },
    render(time) {
      uniforms.uTime.value = time;
      renderer.render(scene, camera);
    },
    dispose() {
      geometry.dispose();
      material.dispose();
      product.geometry.dispose();
      product.material.dispose();
      texture.dispose();
      renderer.dispose();
    },
  };
}

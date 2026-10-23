"use client";

import { useEffect, useRef } from "react";
import type * as T from "three";

/**
 * Developer-portfolio background built with three.js
 *  - a deep 3D star field that twinkles, drifts, reacts to the cursor and parallaxes while you scroll
 *  - a "network" of glowing nodes joined by live lines (like a dependency graph);
 *    the cursor becomes a node of its own and links to whatever is close
 *  - a few slow wireframe polyhedra that spin faster when you scroll
 * Palette matches the hero: cyan -> mint -> magenta.
 */

const CAM_Z = 30;
const FOV = 60;

const PALETTE: Array<[number, number, number]> = [
  [0, 0.78, 1], // cyan
  [0, 1, 0.78], // mint
  [1, 0, 0.78], // magenta
];

const rand = (a: number, b: number) => a + Math.random() * (b - a);

function pickColor(): [number, number, number] {
  const r = Math.random();
  const base = r < 0.55 ? PALETTE[0] : r < 0.88 ? PALETTE[1] : PALETTE[2];
  const white = Math.random() * 0.3; // a little variation so it doesn't look flat
  return [base[0] + (1 - base[0]) * white, base[1] + (1 - base[1]) * white, base[2] + (1 - base[2]) * white];
}

const STAR_VERTEX = /* glsl */ `
  uniform float uTime;
  uniform float uScale;
  uniform float uSize;
  uniform float uScroll;
  uniform float uTan;
  uniform float uAspect;
  uniform float uCamZ;
  uniform vec2 uMouse;
  uniform float uMouseOn;

  attribute vec3 aColor;
  attribute float aSeed;

  varying vec3 vColor;
  varying float vAlpha;

  void main() {
    vec3 pos = position;

    // slow organic drift
    pos.x += sin(uTime * 0.15 + aSeed * 20.0) * 1.2;
    pos.y += cos(uTime * 0.12 + aSeed * 30.0) * 1.0;
    pos.z += sin(uTime * 0.10 + aSeed * 10.0) * 1.5;

    // scroll parallax: nearer stars travel further than distant ones
    float near = clamp((pos.z + 40.0) / 55.0, 0.0, 1.0);
    pos.y = mod(pos.y + uScroll * (0.25 + near * 0.75) + 45.0, 90.0) - 45.0;

    // cursor repel, computed at each star's own depth so it feels right in 3D
    vec2 m = uMouse * vec2(uTan * uAspect, uTan) * (uCamZ - pos.z);
    vec2 d = pos.xy - m;
    float f = smoothstep(7.0, 0.0, length(d)) * uMouseOn;
    pos.xy += normalize(d + vec2(0.0001)) * f * 3.0;

    vec4 mv = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mv;

    float twinkle = 0.6 + 0.4 * sin(uTime * 1.5 + aSeed * 50.0);
    gl_PointSize = uSize * uScale / -mv.z * (0.6 + aSeed) * (1.0 + f * 0.8);

    vColor = mix(aColor, vec3(1.0), f * 0.5);
    vAlpha = twinkle * (0.35 + aSeed * 0.65);
  }
`;

const STAR_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  varying float vAlpha;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float a = smoothstep(0.5, 0.0, d);
    gl_FragColor = vec4(vColor, a * a * vAlpha);
  }
`;

const NODE_VERTEX = /* glsl */ `
  uniform float uScale;
  uniform float uSize;
  attribute vec3 aColor;
  varying vec3 vColor;
  void main() {
    vec4 mv = modelViewMatrix * vec4(position, 1.0);
    gl_Position = projectionMatrix * mv;
    gl_PointSize = uSize * uScale / -mv.z;
    vColor = aColor;
  }
`;

const NODE_FRAGMENT = /* glsl */ `
  varying vec3 vColor;
  void main() {
    float d = length(gl_PointCoord - 0.5);
    if (d > 0.5) discard;
    float halo = smoothstep(0.5, 0.1, d) * 0.55;
    float core = smoothstep(0.16, 0.05, d);
    vec3 col = mix(vColor, vec3(1.0), core);
    gl_FragColor = vec4(col, halo + core);
  }
`;

const ParticleBackground: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    let cancelled = false;
    let raf = 0;
    let cleanup: (() => void) | undefined;

    const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    const start = async () => {
      let THREE: typeof T;
      let renderer: T.WebGLRenderer;
      try {
        THREE = await import("three");
        if (cancelled) return;
        renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: false, powerPreference: "high-performance" });
      } catch {
        return; // no WebGL: the CSS gradient on the canvas is the fallback
      }

      const isMobile = window.innerWidth < 768;
      const pixelRatio = Math.min(window.devicePixelRatio || 1, isMobile ? 1.5 : 2);
      renderer.setPixelRatio(pixelRatio);
      renderer.setClearColor(0x000000, 0);

      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(FOV, 1, 0.1, 200);
      camera.position.set(0, 0, CAM_Z);
      const tanHalf = Math.tan(THREE.MathUtils.degToRad(FOV / 2));

      const disposables: Array<{ dispose: () => void }> = [];

      /* ---------------- star field ---------------- */
      const STAR_COUNT = isMobile ? 900 : 2000;
      const sPos = new Float32Array(STAR_COUNT * 3);
      const sCol = new Float32Array(STAR_COUNT * 3);
      const sSeed = new Float32Array(STAR_COUNT);
      for (let i = 0; i < STAR_COUNT; i++) {
        sPos.set([rand(-70, 70), rand(-45, 45), rand(-40, 15)], i * 3);
        sCol.set(pickColor(), i * 3);
        sSeed[i] = Math.random();
      }
      const starGeo = new THREE.BufferGeometry();
      starGeo.setAttribute("position", new THREE.BufferAttribute(sPos, 3));
      starGeo.setAttribute("aColor", new THREE.BufferAttribute(sCol, 3));
      starGeo.setAttribute("aSeed", new THREE.BufferAttribute(sSeed, 1));

      const starUniforms = {
        uTime: { value: 0 },
        uScale: { value: 1 },
        uSize: { value: 0.3 },
        uScroll: { value: 0 },
        uTan: { value: tanHalf },
        uAspect: { value: 1 },
        uCamZ: { value: CAM_Z },
        uMouse: { value: new THREE.Vector2(9, 9) },
        uMouseOn: { value: 0 },
      };
      const starMat = new THREE.ShaderMaterial({
        uniforms: starUniforms,
        vertexShader: STAR_VERTEX,
        fragmentShader: STAR_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const stars = new THREE.Points(starGeo, starMat);
      stars.frustumCulled = false;
      scene.add(stars);
      disposables.push(starGeo, starMat);

      /* ---------------- node network ---------------- */
      const NODE_COUNT = isMobile ? 34 : 70;
      const LINK_DIST = isMobile ? 11 : 13;
      const CURSOR_LINK_DIST = 16;
      const BOUNDS = { x: 42, y: 24, zMin: -18, zMax: 2 };

      const nPos = new Float32Array(NODE_COUNT * 3);
      const nVel = new Float32Array(NODE_COUNT * 3);
      const nCol = new Float32Array(NODE_COUNT * 3);
      for (let i = 0; i < NODE_COUNT; i++) {
        nPos.set([rand(-BOUNDS.x, BOUNDS.x), rand(-BOUNDS.y, BOUNDS.y), rand(BOUNDS.zMin, BOUNDS.zMax)], i * 3);
        nVel.set([rand(-1, 1) * 0.9, rand(-1, 1) * 0.7, rand(-1, 1) * 0.3], i * 3);
        nCol.set(pickColor(), i * 3);
      }
      const nodeGeo = new THREE.BufferGeometry();
      const nodePosAttr = new THREE.BufferAttribute(nPos, 3);
      nodePosAttr.setUsage(THREE.DynamicDrawUsage);
      nodeGeo.setAttribute("position", nodePosAttr);
      nodeGeo.setAttribute("aColor", new THREE.BufferAttribute(nCol, 3));
      const nodeUniforms = { uScale: { value: 1 }, uSize: { value: 0.85 } };
      const nodeMat = new THREE.ShaderMaterial({
        uniforms: nodeUniforms,
        vertexShader: NODE_VERTEX,
        fragmentShader: NODE_FRAGMENT,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const nodes = new THREE.Points(nodeGeo, nodeMat);
      nodes.frustumCulled = false;
      scene.add(nodes);
      disposables.push(nodeGeo, nodeMat);

      const MAX_SEGMENTS = NODE_COUNT * 5 + NODE_COUNT;
      const linePos = new Float32Array(MAX_SEGMENTS * 6);
      const lineCol = new Float32Array(MAX_SEGMENTS * 6);
      const lineGeo = new THREE.BufferGeometry();
      const linePosAttr = new THREE.BufferAttribute(linePos, 3);
      const lineColAttr = new THREE.BufferAttribute(lineCol, 3);
      linePosAttr.setUsage(THREE.DynamicDrawUsage);
      lineColAttr.setUsage(THREE.DynamicDrawUsage);
      lineGeo.setAttribute("position", linePosAttr);
      lineGeo.setAttribute("color", lineColAttr);
      lineGeo.setDrawRange(0, 0);
      const lineMat = new THREE.LineBasicMaterial({
        vertexColors: true,
        transparent: true,
        depthWrite: false,
        blending: THREE.AdditiveBlending,
      });
      const lines = new THREE.LineSegments(lineGeo, lineMat);
      lines.frustumCulled = false;
      scene.add(lines);
      disposables.push(lineGeo, lineMat);

      /* ---------------- wireframe polyhedra ---------------- */
      const shapeDefs: Array<{ geo: T.BufferGeometry; color: number; fx: number; fy: number; z: number }> = [
        { geo: new THREE.IcosahedronGeometry(4.5, 0), color: 0x00c8ff, fx: -0.8, fy: 0.5, z: -20 },
        { geo: new THREE.OctahedronGeometry(4, 0), color: 0xff00c8, fx: 0.82, fy: -0.4, z: -24 },
        { geo: new THREE.DodecahedronGeometry(3.2, 0), color: 0x00ffc8, fx: 0.6, fy: 0.72, z: -16 },
      ];
      const shapes = shapeDefs.map((d, i) => {
        const edges = new THREE.EdgesGeometry(d.geo);
        d.geo.dispose();
        const mat = new THREE.LineBasicMaterial({
          color: d.color,
          transparent: true,
          opacity: 0.28,
          depthWrite: false,
          blending: THREE.AdditiveBlending,
        });
        const mesh = new THREE.LineSegments(edges, mat);
        mesh.rotation.set(rand(0, 3), rand(0, 3), 0);
        scene.add(mesh);
        disposables.push(edges, mat);
        return { mesh, def: d, speed: 0.08 + i * 0.03, phase: rand(0, 6) };
      });

      /* ---------------- sizing ---------------- */
      let aspect = 1;
      const layout = () => {
        const w = canvas.clientWidth || window.innerWidth;
        const h = canvas.clientHeight || window.innerHeight;
        renderer.setSize(w, h, false);
        aspect = w / h;
        camera.aspect = aspect;
        camera.updateProjectionMatrix();
        starUniforms.uAspect.value = aspect;
        const scale = (renderer.domElement.height) / (2 * tanHalf);
        starUniforms.uScale.value = scale;
        nodeUniforms.uScale.value = scale;

        // keep the polyhedra at the screen edges, whatever the aspect ratio
        shapes.forEach((s, i) => {
          const depth = CAM_Z - s.def.z;
          const halfH = tanHalf * depth;
          const halfW = halfH * aspect;
          s.mesh.position.set(s.def.fx * halfW, s.def.fy * halfH, s.def.z);
          const k = Math.min(Math.max(halfW / 30, 0.45), 1);
          s.mesh.scale.setScalar(k);
          s.mesh.visible = !(isMobile && i === 2);
        });
      };
      layout();

      /* ---------------- input ---------------- */
      const mouseTarget = new THREE.Vector2(0, 0);
      let mouseOnTarget = 0;
      let scrollTarget = window.scrollY;
      let scrollSmooth = scrollTarget;

      const onPointerMove = (e: PointerEvent) => {
        mouseTarget.set((e.clientX / window.innerWidth) * 2 - 1, -((e.clientY / window.innerHeight) * 2 - 1));
        mouseOnTarget = 1;
      };
      const onPointerOff = () => {
        mouseOnTarget = 0;
      };
      const onScroll = () => {
        scrollTarget = window.scrollY;
      };

      if (!reduceMotion) {
        window.addEventListener("pointermove", onPointerMove, { passive: true });
        window.addEventListener("pointerup", onPointerOff, { passive: true });
        window.addEventListener("pointercancel", onPointerOff, { passive: true });
        document.addEventListener("pointerleave", onPointerOff);
        window.addEventListener("scroll", onScroll, { passive: true });
      }

      let lastWidth = canvas.clientWidth;
      const resizeObserver = new ResizeObserver(() => {
        // ignore height-only jitter caused by mobile browser bars
        if (canvas.clientWidth === lastWidth && renderer.domElement.height > 0) return;
        lastWidth = canvas.clientWidth;
        layout();
        if (reduceMotion) renderer.render(scene, camera);
      });
      resizeObserver.observe(canvas);

      /* ---------------- frame ---------------- */
      const mouseSmooth = new THREE.Vector2(0, 0);
      const cursorWorld = new THREE.Vector3();
      const tmp = new THREE.Vector3();
      let time = 0;
      let last = performance.now();

      const writeSegment = (
        n: number,
        ax: number, ay: number, az: number,
        bx: number, by: number, bz: number,
        r: number, g: number, b: number,
      ) => {
        const o = n * 6;
        linePos[o] = ax; linePos[o + 1] = ay; linePos[o + 2] = az;
        linePos[o + 3] = bx; linePos[o + 4] = by; linePos[o + 5] = bz;
        lineCol[o] = r; lineCol[o + 1] = g; lineCol[o + 2] = b;
        lineCol[o + 3] = r; lineCol[o + 4] = g; lineCol[o + 5] = b;
      };

      const frame = (dt: number) => {
        time += dt;
        starUniforms.uTime.value = time;

        // smooth scroll + pointer
        const prevScroll = scrollSmooth;
        scrollSmooth += (scrollTarget - scrollSmooth) * (1 - Math.exp(-dt * 6));
        const scrollVel = scrollSmooth - prevScroll;
        starUniforms.uScroll.value = scrollSmooth * 0.012;

        mouseSmooth.lerp(mouseTarget, 1 - Math.exp(-dt * 10));
        starUniforms.uMouse.value.copy(mouseSmooth);
        starUniforms.uMouseOn.value += (mouseOnTarget - starUniforms.uMouseOn.value) * (1 - Math.exp(-dt * 6));

        // gentle camera parallax
        camera.position.x += (mouseSmooth.x * 2.5 - camera.position.x) * (1 - Math.exp(-dt * 2));
        camera.position.y += (mouseSmooth.y * 1.5 - camera.position.y) * (1 - Math.exp(-dt * 2));
        camera.lookAt(0, 0, 0);
        camera.updateMatrixWorld();

        // cursor as a node on the z = -5 plane
        const cursorActive = starUniforms.uMouseOn.value > 0.2;
        if (cursorActive) {
          tmp.set(mouseSmooth.x, mouseSmooth.y, 0.5).unproject(camera).sub(camera.position).normalize();
          const t = (-5 - camera.position.z) / tmp.z;
          cursorWorld.copy(camera.position).addScaledVector(tmp, t);
        }

        // move nodes
        for (let i = 0; i < NODE_COUNT; i++) {
          const o = i * 3;
          nPos[o] += nVel[o] * dt;
          nPos[o + 1] += nVel[o + 1] * dt;
          nPos[o + 2] += nVel[o + 2] * dt;
          if (nPos[o] > BOUNDS.x || nPos[o] < -BOUNDS.x) nVel[o] *= -1;
          if (nPos[o + 1] > BOUNDS.y || nPos[o + 1] < -BOUNDS.y) nVel[o + 1] *= -1;
          if (nPos[o + 2] > BOUNDS.zMax || nPos[o + 2] < BOUNDS.zMin) nVel[o + 2] *= -1;
        }
        nodePosAttr.needsUpdate = true;

        // links between close nodes
        let seg = 0;
        const linkSq = LINK_DIST * LINK_DIST;
        for (let i = 0; i < NODE_COUNT && seg < MAX_SEGMENTS; i++) {
          const ia = i * 3;
          for (let j = i + 1; j < NODE_COUNT && seg < MAX_SEGMENTS; j++) {
            const ja = j * 3;
            const dx = nPos[ia] - nPos[ja];
            const dy = nPos[ia + 1] - nPos[ja + 1];
            const dz = nPos[ia + 2] - nPos[ja + 2];
            const d2 = dx * dx + dy * dy + dz * dz;
            if (d2 < linkSq) {
              const k = 1 - Math.sqrt(d2) / LINK_DIST;
              writeSegment(seg++, nPos[ia], nPos[ia + 1], nPos[ia + 2], nPos[ja], nPos[ja + 1], nPos[ja + 2], 0, 0.55 * k, 0.8 * k);
            }
          }
        }
        // links from the cursor
        if (cursorActive) {
          const strength = starUniforms.uMouseOn.value;
          for (let i = 0; i < NODE_COUNT && seg < MAX_SEGMENTS; i++) {
            const o = i * 3;
            const dx = nPos[o] - cursorWorld.x;
            const dy = nPos[o + 1] - cursorWorld.y;
            const dz = nPos[o + 2] - cursorWorld.z;
            const d = Math.sqrt(dx * dx + dy * dy + dz * dz);
            if (d < CURSOR_LINK_DIST) {
              const k = (1 - d / CURSOR_LINK_DIST) * strength;
              writeSegment(seg++, nPos[o], nPos[o + 1], nPos[o + 2], cursorWorld.x, cursorWorld.y, cursorWorld.z, 0.1 * k, 1.0 * k, 0.8 * k);
            }
          }
        }
        linePosAttr.needsUpdate = true;
        lineColAttr.needsUpdate = true;
        lineGeo.setDrawRange(0, seg * 2);

        // polyhedra: slow spin, spins up with scroll speed
        shapes.forEach((s) => {
          s.mesh.rotation.x += dt * s.speed + scrollVel * 0.004;
          s.mesh.rotation.y += dt * s.speed * 1.3 + scrollVel * 0.006;
          s.mesh.position.y += Math.sin(time * 0.4 + s.phase) * dt * 0.4;
        });

        renderer.render(scene, camera);
      };

      let rafActive = true;
      const loop = (now: number) => {
        if (!rafActive) return;
        raf = requestAnimationFrame(loop);
        const dt = Math.min((now - last) / 1000, 0.05);
        last = now;
        if (document.hidden) return;
        frame(dt);
      };

      if (reduceMotion) {
        frame(0);
      } else {
        raf = requestAnimationFrame(loop);
      }
      canvas.style.opacity = "1"; // soft fade-in once the first frame is ready

      cleanup = () => {
        rafActive = false;
        cancelAnimationFrame(raf);
        window.removeEventListener("pointermove", onPointerMove);
        window.removeEventListener("pointerup", onPointerOff);
        window.removeEventListener("pointercancel", onPointerOff);
        document.removeEventListener("pointerleave", onPointerOff);
        window.removeEventListener("scroll", onScroll);
        resizeObserver.disconnect();
        disposables.forEach((d) => d.dispose());
        renderer.dispose();
      };
    };

    start();

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup?.();
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
        width: "100%",
        height: "100vh",
        zIndex: 0,
        pointerEvents: "none",
        display: "block",
        background: "linear-gradient(to bottom, #0a0a1a, #121230)",
        opacity: 0,
        transition: "opacity 1.2s ease",
      }}
      ref-note="height is upgraded to 100lvh in the effect-free style below"
    />
  );
};

export default ParticleBackground;
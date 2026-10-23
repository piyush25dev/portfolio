'use client';

import { useEffect, useRef } from 'react';
import type * as T from 'three';

interface ScatterText3DProps {
  /** Element that contains the texts. Every `[data-scatter]` element inside it is animated. */
  containerRef: React.RefObject<HTMLElement | null>;
  /** The animation plays each time this turns true, and is reset when it turns false. */
  play: boolean;
  /** Called when the animation ends (or is skipped) so the real DOM text can be shown. */
  onComplete: () => void;
}

const DURATION = 1.5; // seconds each letter takes to settle
const GRADIENT = [
  [0, 200, 255],
  [0, 255, 200],
  [255, 0, 200],
];

const rand = (min: number, max: number) => min + Math.random() * (max - min);

function gradientColor(t: number) {
  const x = Math.min(Math.max(t, 0), 1) * (GRADIENT.length - 1);
  const i = Math.min(Math.floor(x), GRADIENT.length - 2);
  const f = x - i;
  const [a, b] = [GRADIENT[i], GRADIENT[i + 1]];
  const c = a.map((v, k) => Math.round(v + (b[k] - v) * f));
  return `rgb(${c[0]},${c[1]},${c[2]})`;
}

interface Glyph {
  char: string;
  left: number; // relative to its element
  top: number;
  w: number;
  h: number;
  font: string;
  fontSize: number;
  color: string;
  gradientT: number | null;
}

/** Reads the exact position of every letter from the browser's own layout. */
function collectGlyphs(el: HTMLElement) {
  const elRect = el.getBoundingClientRect();
  const glyphs: Glyph[] = [];
  const walker = document.createTreeWalker(el, NodeFilter.SHOW_TEXT);
  const range = document.createRange();

  let node = walker.nextNode() as Text | null;
  while (node) {
    const parent = node.parentElement;
    if (parent) {
      const cs = getComputedStyle(parent);
      const gradientEl = parent.closest('[data-scatter-gradient]') as HTMLElement | null;
      const gradientRect = gradientEl?.getBoundingClientRect();
      const upper = cs.textTransform === 'uppercase';

      for (let i = 0; i < node.data.length; i++) {
        const ch = node.data[i];
        if (!ch.trim()) continue;
        range.setStart(node, i);
        range.setEnd(node, i + 1);
        const r = range.getBoundingClientRect();
        if (!r.width || !r.height) continue;

        glyphs.push({
          char: upper ? ch.toUpperCase() : ch,
          left: r.left - elRect.left,
          top: r.top - elRect.top,
          w: r.width,
          h: r.height,
          font: `${cs.fontStyle} ${cs.fontWeight} ${cs.fontSize} ${cs.fontFamily}`,
          fontSize: parseFloat(cs.fontSize),
          color: cs.color,
          gradientT: gradientRect
            ? (r.left + r.width / 2 - gradientRect.left) / Math.max(gradientRect.width, 1)
            : null,
        });
      }
    }
    node = walker.nextNode() as Text | null;
  }
  return { elRect, glyphs };
}

const ScatterText3D: React.FC<ScatterText3DProps> = ({ containerRef, play, onComplete }) => {
  const onCompleteRef = useRef(onComplete);
  onCompleteRef.current = onComplete;

  useEffect(() => {
    const root = containerRef.current;
    if (!root || !play) return;

    let cancelled = false;
    let raf = 0;
    let disposeAll: (() => void) | undefined;

    const finishWithoutAnimation = () => onCompleteRef.current();

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      finishWithoutAnimation();
      return;
    }

    const run = async () => {
      // wait for the web fonts + a layout pass so measured positions are final
      await document.fonts?.ready;
      await new Promise((r) => requestAnimationFrame(() => r(null)));
      if (cancelled) return;

      let THREE: typeof T;
      let renderer: T.WebGLRenderer;
      try {
        THREE = await import('three');
        renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
      } catch {
        finishWithoutAnimation();
        return;
      }
      if (cancelled) {
        renderer.dispose();
        return;
      }

      const rootRect = root.getBoundingClientRect();
      const W = rootRect.width;
      const H = rootRect.height;
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      const maxTexture = renderer.capabilities.maxTextureSize;
      // smaller screens -> letters start closer, so the motion stays gentle and on-screen
      const spread = Math.min(Math.max(W / 900, 0.5), 1);

      renderer.setPixelRatio(dpr);
      renderer.setSize(W, H);
      renderer.setClearColor(0x000000, 0);
      const canvas = renderer.domElement;
      Object.assign(canvas.style, {
        position: 'absolute',
        inset: '0',
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: '2',
      });
      root.appendChild(canvas);

      const scene = new THREE.Scene();
      // 1 unit = 1 CSS pixel, origin at the bottom-left of the hero
      const camera = new THREE.OrthographicCamera(0, W, H, 0, -1000, 1000);
      camera.position.z = 10;

      const textures: T.CanvasTexture[] = [];
      const geometries: T.PlaneGeometry[] = [];
      const materials: T.MeshBasicMaterial[] = [];

      interface Item {
        mesh: T.Mesh;
        material: T.MeshBasicMaterial;
        tx: number;
        ty: number;
        dx: number;
        dy: number;
        rx: number;
        ry: number;
        rz: number;
        delay: number;
      }
      const items: Item[] = [];

      const elements = Array.from(root.querySelectorAll<HTMLElement>('[data-scatter]'));
      let totalTime = 0;

      elements.forEach((el, elIndex) => {
        const { elRect, glyphs } = collectGlyphs(el);
        if (!glyphs.length) return;

        // draw the whole element once onto a canvas; each letter is a slice of it
        const tex = document.createElement('canvas');
        const k = Math.min(dpr, maxTexture / Math.max(elRect.width, elRect.height, 1));
        tex.width = Math.ceil(elRect.width * k);
        tex.height = Math.ceil(elRect.height * k);
        const ctx = tex.getContext('2d')!;
        ctx.scale(k, k);
        ctx.textBaseline = 'alphabetic';
        ctx.textAlign = 'left';

        glyphs.forEach((g) => {
          ctx.font = g.font;
          const m = ctx.measureText(g.char);
          const ascent = m.fontBoundingBoxAscent ?? g.fontSize * 0.8;
          ctx.fillStyle = g.gradientT !== null ? gradientColor(g.gradientT) : g.color;
          ctx.fillText(g.char, g.left, g.top + ascent);
        });

        const texture = new THREE.CanvasTexture(tex);
        texture.colorSpace = THREE.SRGBColorSpace;
        texture.generateMipmaps = false;
        texture.minFilter = THREE.LinearFilter;
        texture.anisotropy = renderer.capabilities.getMaxAnisotropy();
        textures.push(texture);

        const baseX = elRect.left - rootRect.left;
        const baseY = elRect.top - rootRect.top;

        glyphs.forEach((g, i) => {
          const geometry = new THREE.PlaneGeometry(g.w, g.h);
          const u0 = g.left / elRect.width;
          const u1 = (g.left + g.w) / elRect.width;
          const vTop = 1 - g.top / elRect.height;
          const vBottom = 1 - (g.top + g.h) / elRect.height;
          const uv = geometry.attributes.uv;
          uv.setXY(0, u0, vTop);
          uv.setXY(1, u1, vTop);
          uv.setXY(2, u0, vBottom);
          uv.setXY(3, u1, vBottom);
          geometry.attributes.uv.needsUpdate = true;
          geometries.push(geometry);

          const material = new THREE.MeshBasicMaterial({
            map: texture,
            transparent: true,
            opacity: 0,
            depthWrite: false,
            side: THREE.DoubleSide,
          });
          materials.push(material);

          const mesh = new THREE.Mesh(geometry, material);
          scene.add(mesh);

          const tx = baseX + g.left + g.w / 2;
          const ty = H - (baseY + g.top + g.h / 2);
          const angle = rand(0, Math.PI * 2);
          const dist = rand(80, 280) * spread;
          // elements start one after another, letters ripple within each element
          const delay = elIndex * 0.28 + (i / glyphs.length) * 0.45 + rand(0, 0.25);
          totalTime = Math.max(totalTime, delay + DURATION);

          items.push({
            mesh,
            material,
            tx,
            ty,
            dx: Math.cos(angle) * dist * 1.3,
            dy: Math.sin(angle) * dist * 0.7,
            rx: rand(-0.9, 0.9),
            ry: rand(-0.9, 0.9),
            rz: rand(-0.5, 0.5),
            delay,
          });
        });
      });

      let disposed = false;
      const dispose = () => {
        if (disposed) return;
        disposed = true;
        cancelAnimationFrame(raf);
        window.removeEventListener('resize', onResize);
        geometries.forEach((g) => g.dispose());
        materials.forEach((m) => m.dispose());
        textures.forEach((t) => t.dispose());
        renderer.dispose();
        canvas.remove();
      };
      disposeAll = dispose;

      // Mobile browsers fire `resize` while scrolling (address bar show/hide), so only a real
      // width change (rotation, window resize) counts: positions are stale then, so reveal the text.
      let lastWidth = window.innerWidth;
      const onResize = () => {
        if (window.innerWidth === lastWidth) return;
        lastWidth = window.innerWidth;
        onCompleteRef.current();
        dispose();
      };
      window.addEventListener('resize', onResize);

      const finish = () => {
        onCompleteRef.current(); // real text appears instantly, right underneath the canvas
        canvas.style.transition = 'opacity 0.3s ease 0.15s'; // then the identical canvas fades away
        canvas.style.opacity = '0';
        window.setTimeout(dispose, 700);
      };

      const start = performance.now();
      const loop = (now: number) => {
        if (disposed) return;
        const t = (now - start) / 1000;

        for (const it of items) {
          const p = Math.min(Math.max((t - it.delay) / DURATION, 0), 1);
          const e = 1 - Math.pow(1 - p, 3); // easeOutCubic: soft landing
          const inv = 1 - e;
          it.mesh.position.set(it.tx + it.dx * inv, it.ty + it.dy * inv, 0);
          it.mesh.rotation.set(it.rx * inv, it.ry * inv, it.rz * inv);
          it.mesh.scale.setScalar(0.6 + 0.4 * e);
          it.material.opacity = Math.min(p * 2.5, 1);
        }
        renderer.render(scene, camera);

        if (t < totalTime) {
          raf = requestAnimationFrame(loop);
        } else {
          finish();
        }
      };
      raf = requestAnimationFrame(loop);
    };

    run().catch(finishWithoutAnimation);

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      disposeAll?.();
    };
  }, [containerRef, play]);

  return null;
};

export default ScatterText3D;
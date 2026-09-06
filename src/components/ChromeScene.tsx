import { useEffect, useRef } from "react";

type Props = {
  className?: string;
  intensity?: "hero" | "ambient";
};

/**
 * Iridescent vapor-chrome torus knot — optimised for fast first paint.
 * Three.js is loaded after a short idle delay so it never blocks the main thread.
 */
export default function ChromeScene({ className = "", intensity = "hero" }: Props) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    let cancelled = false;
    let cleanup: (() => void) | undefined;

    // Defer heavy WebGL work until the browser is idle / after 300ms
    const handle = (window.requestIdleCallback || ((cb) => setTimeout(cb, 300)))(
      () => {
        (async () => {
          const THREE = await import("three");
          const { RoomEnvironment } = await import(
            "three/examples/jsm/environments/RoomEnvironment.js"
          );
          if (cancelled || !ref.current) return;

          const canvas = ref.current;
          let renderer: any;
          try {
            renderer = new THREE.WebGLRenderer({
              canvas,
              alpha: true,
              antialias: false,
              powerPreference: "low-power",
              precision: "mediump",
            });
          } catch (e) {
            console.warn("[ChromeScene] WebGL unavailable, falling back:", e);
            return;
          }
          // Cap pixel ratio at 1 on mobile, 1.25 on desktop for perf
          renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
          renderer.toneMapping = THREE.ACESFilmicToneMapping;
          renderer.toneMappingExposure = 1.05;

          const scene = new THREE.Scene();
          const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 100);
          camera.position.set(0, 0, intensity === "hero" ? 4.6 : 6);

          scene.add(new THREE.AmbientLight(0xffffff, 0.35));
          const l1 = new THREE.PointLight(0xa78bfa, 9, 25);
          l1.position.set(3.2, 2.4, 3);
          const l2 = new THREE.PointLight(0x67e8f9, 7, 25);
          l2.position.set(-3, -2, 2.5);
          const l3 = new THREE.PointLight(0xf5d0fe, 4, 25);
          l3.position.set(0, 3, -2.5);
          scene.add(l1, l2, l3);

          // Reduced geometry segments for faster load
          const geo = new THREE.TorusKnotGeometry(1.05, 0.34, 160, 24);
          const mat = new THREE.MeshPhysicalMaterial({
            color: 0xffffff,
            metalness: 1,
            roughness: 0.12,
            iridescence: 1,
            iridescenceIOR: 1.35,
            iridescenceThicknessRange: [120, 520],
            clearcoat: 1,
            clearcoatRoughness: 0.08,
            envMapIntensity: 1.05,
          });
          const mesh = new THREE.Mesh(geo, mat);
          scene.add(mesh);

          const ringGeo = new THREE.TorusGeometry(1.9, 0.012, 8, 120);
          const ringMat = new THREE.MeshBasicMaterial({
            color: 0xc4b5fd,
            transparent: true,
            opacity: 0.55,
          });
          const ring = new THREE.Mesh(ringGeo, ringMat);
          ring.rotation.x = Math.PI / 2.2;
          scene.add(ring);

          // Fewer particles for perf
          const pCount = intensity === "hero" ? 120 : 60;
          const pGeo = new THREE.BufferGeometry();
          const positions = new Float32Array(pCount * 3);
          for (let i = 0; i < pCount; i++) {
            positions[i * 3] = (Math.random() - 0.5) * 9;
            positions[i * 3 + 1] = (Math.random() - 0.5) * 6;
            positions[i * 3 + 2] = (Math.random() - 0.5) * 4;
          }
          pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
          const pMat = new THREE.PointsMaterial({
            color: 0xa5f3fc,
            size: 0.022,
            transparent: true,
            opacity: 0.75,
            depthWrite: false,
            blending: THREE.AdditiveBlending,
          });
          const points = new THREE.Points(pGeo, pMat);
          scene.add(points);

          const pmrem = new THREE.PMREMGenerator(renderer);
          scene.environment = pmrem.fromScene(new RoomEnvironment(), 0.04).texture;

          let mx = 0, my = 0, tx = 0, ty = 0;
          const onMove = (e: PointerEvent) => {
            mx = e.clientX / window.innerWidth - 0.5;
            my = e.clientY / window.innerHeight - 0.5;
          };
          window.addEventListener("pointermove", onMove, { passive: true });

          const resize = () => {
            const w = canvas.clientWidth || 1;
            const h = canvas.clientHeight || 1;
            renderer.setSize(w, h, false);
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
          };
          const obs = new ResizeObserver(resize);
          obs.observe(canvas);
          resize();

          let raf = 0;
          let isRendering = true;
          const t0 = performance.now();
          const tick = () => {
            if (!isRendering) return;
            const t = (performance.now() - t0) * 0.001;
            tx += (mx - tx) * 0.06;
            ty += (my - ty) * 0.06;
            mesh.rotation.x = t * 0.45 + ty * 1.1;
            mesh.rotation.y = t * 0.65 + tx * 1.4;
            ring.rotation.z = t * 0.35;
            ring.rotation.x = Math.PI / 2.2 + ty * 0.5;
            points.rotation.y = t * 0.08;
            camera.position.x += (tx * 0.6 - camera.position.x) * 0.05;
            camera.position.y += (-ty * 0.5 - camera.position.y) * 0.05;
            camera.lookAt(0, 0, 0);
            renderer.render(scene, camera);
            raf = requestAnimationFrame(tick);
          };
          tick();

          const onVisibility = () => {
            if (document.hidden) {
              isRendering = false;
              cancelAnimationFrame(raf);
            } else if (!isRendering) {
              isRendering = true;
              raf = requestAnimationFrame(tick);
            }
          };
          document.addEventListener("visibilitychange", onVisibility);

          cleanup = () => {
            isRendering = false;
            cancelAnimationFrame(raf);
            document.removeEventListener("visibilitychange", onVisibility);
            obs.disconnect();
            window.removeEventListener("pointermove", onMove);
            geo.dispose();
            mat.dispose();
            ringGeo.dispose();
            ringMat.dispose();
            pGeo.dispose();
            pMat.dispose();
            pmrem.dispose();
            renderer.dispose();
          };
        })();
      },
      { timeout: 600 },
    );

    return () => {
      cancelled = true;
      if (typeof handle === "number") clearTimeout(handle);
      cleanup?.();
    };
  }, [intensity]);

  return <canvas ref={ref} className={className} aria-hidden="true" />;
}
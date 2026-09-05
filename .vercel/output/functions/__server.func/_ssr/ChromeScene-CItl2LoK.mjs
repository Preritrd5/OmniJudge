import { i as __toESM } from "../_runtime.mjs";
import { a as require_react, i as require_jsx_runtime } from "../_libs/react+tanstack__react-query.mjs";
//#region node_modules/.nitro/vite/services/ssr/assets/ChromeScene-CItl2LoK.js
var import_react = /* @__PURE__ */ __toESM(require_react());
var import_jsx_runtime = require_jsx_runtime();
/**
* Iridescent vapor-chrome torus knot — optimised for fast first paint.
* Three.js is loaded after a short idle delay so it never blocks the main thread.
*/
function ChromeScene({ className = "", intensity = "hero" }) {
	const ref = (0, import_react.useRef)(null);
	(0, import_react.useEffect)(() => {
		let cancelled = false;
		let cleanup;
		const handle = (window.requestIdleCallback || ((cb) => setTimeout(cb, 300)))(() => {
			(async () => {
				const THREE = await import("../_libs/three.mjs").then((n) => n.n);
				const { RoomEnvironment } = await import("../_libs/three.mjs").then((n) => n.t);
				if (cancelled || !ref.current) return;
				const canvas = ref.current;
				const renderer = new THREE.WebGLRenderer({
					canvas,
					alpha: true,
					antialias: false,
					powerPreference: "low-power"
				});
				renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.5));
				renderer.toneMapping = THREE.ACESFilmicToneMapping;
				renderer.toneMappingExposure = 1.05;
				const scene = new THREE.Scene();
				const camera = new THREE.PerspectiveCamera(45, 1, .1, 100);
				camera.position.set(0, 0, intensity === "hero" ? 4.6 : 6);
				scene.add(new THREE.AmbientLight(16777215, .35));
				const l1 = new THREE.PointLight(10980346, 9, 25);
				l1.position.set(3.2, 2.4, 3);
				const l2 = new THREE.PointLight(6809849, 7, 25);
				l2.position.set(-3, -2, 2.5);
				const l3 = new THREE.PointLight(16109822, 4, 25);
				l3.position.set(0, 3, -2.5);
				scene.add(l1, l2, l3);
				const geo = new THREE.TorusKnotGeometry(1.05, .34, 160, 24);
				const mat = new THREE.MeshPhysicalMaterial({
					color: 16777215,
					metalness: 1,
					roughness: .12,
					iridescence: 1,
					iridescenceIOR: 1.35,
					iridescenceThicknessRange: [120, 520],
					clearcoat: 1,
					clearcoatRoughness: .08,
					envMapIntensity: 1.05
				});
				const mesh = new THREE.Mesh(geo, mat);
				scene.add(mesh);
				const ringGeo = new THREE.TorusGeometry(1.9, .012, 8, 120);
				const ringMat = new THREE.MeshBasicMaterial({
					color: 12891645,
					transparent: true,
					opacity: .55
				});
				const ring = new THREE.Mesh(ringGeo, ringMat);
				ring.rotation.x = Math.PI / 2.2;
				scene.add(ring);
				const pCount = intensity === "hero" ? 120 : 60;
				const pGeo = new THREE.BufferGeometry();
				const positions = new Float32Array(pCount * 3);
				for (let i = 0; i < pCount; i++) {
					positions[i * 3] = (Math.random() - .5) * 9;
					positions[i * 3 + 1] = (Math.random() - .5) * 6;
					positions[i * 3 + 2] = (Math.random() - .5) * 4;
				}
				pGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
				const pMat = new THREE.PointsMaterial({
					color: 10875900,
					size: .022,
					transparent: true,
					opacity: .75,
					depthWrite: false,
					blending: THREE.AdditiveBlending
				});
				const points = new THREE.Points(pGeo, pMat);
				scene.add(points);
				const pmrem = new THREE.PMREMGenerator(renderer);
				scene.environment = pmrem.fromScene(new RoomEnvironment(), .04).texture;
				let mx = 0, my = 0, tx = 0, ty = 0;
				const onMove = (e) => {
					mx = e.clientX / window.innerWidth - .5;
					my = e.clientY / window.innerHeight - .5;
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
				const t0 = performance.now();
				const tick = () => {
					const t = (performance.now() - t0) * .001;
					tx += (mx - tx) * .06;
					ty += (my - ty) * .06;
					mesh.rotation.x = t * .45 + ty * 1.1;
					mesh.rotation.y = t * .65 + tx * 1.4;
					ring.rotation.z = t * .35;
					ring.rotation.x = Math.PI / 2.2 + ty * .5;
					points.rotation.y = t * .08;
					camera.position.x += (tx * .6 - camera.position.x) * .05;
					camera.position.y += (-ty * .5 - camera.position.y) * .05;
					camera.lookAt(0, 0, 0);
					renderer.render(scene, camera);
					raf = requestAnimationFrame(tick);
				};
				tick();
				cleanup = () => {
					cancelAnimationFrame(raf);
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
		}, { timeout: 600 });
		return () => {
			cancelled = true;
			if (typeof handle === "number") clearTimeout(handle);
			cleanup?.();
		};
	}, [intensity]);
	return /* @__PURE__ */ (0, import_jsx_runtime.jsx)("canvas", {
		ref,
		className,
		"aria-hidden": "true"
	});
}
//#endregion
export { ChromeScene as t };

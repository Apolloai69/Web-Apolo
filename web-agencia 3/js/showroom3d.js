/* Showroom 3D: los coches con data-glb se pueden girar 360° arrastrando (three.js r128 + GLTFLoader).
   Al cambiar de coche, el actual sale disparado hacia un lado y el nuevo entra derrapando desde el otro.
   Los que no tienen modelo se muestran con su foto de estudio. */
(function () {
  const showroom = document.getElementById("showroom");
  const canvas = document.getElementById("sr3d");
  if (!showroom || !canvas || !window.THREE || !THREE.GLTFLoader) return;

  const cars = Array.from(showroom.querySelectorAll(".sr-car"));
  const hint = showroom.querySelector(".sr-hint");
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  let renderer;
  try {
    renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
  } catch (e) { return; }
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.outputEncoding = THREE.sRGBEncoding;
  renderer.toneMapping = THREE.ACESFilmicToneMapping;
  renderer.toneMappingExposure = 1.05;

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
  const CAM_Z = 7.2;
  camera.position.set(0, 1.25, CAM_Z);
  camera.lookAt(0, 0.8, 0);

  // Entorno de estudio para reflejos en la pintura
  const pmrem = new THREE.PMREMGenerator(renderer);
  if (THREE.RoomEnvironment) scene.environment = pmrem.fromScene(new THREE.RoomEnvironment(), 0.04).texture;
  scene.add(new THREE.HemisphereLight(0xe9dcff, 0x1a0b2e, 0.6));
  const key = new THREE.DirectionalLight(0xffffff, 1.4);
  key.position.set(3, 5, 4);
  scene.add(key);
  const rim = new THREE.DirectionalLight(0xa855f7, 1.6);
  rim.position.set(-4, 2.5, -4);
  scene.add(rim);
  const RIM = 1.6;

  // Sombra de contacto suave bajo el coche
  const sh = document.createElement("canvas");
  sh.width = sh.height = 128;
  const g = sh.getContext("2d");
  const grd = g.createRadialGradient(64, 64, 0, 64, 64, 64);
  grd.addColorStop(0, "rgba(0,0,0,.75)");
  grd.addColorStop(1, "rgba(0,0,0,0)");
  g.fillStyle = grd;
  g.fillRect(0, 0, 128, 128);
  const shadowMat = new THREE.MeshBasicMaterial({ map: new THREE.CanvasTexture(sh), transparent: true, depthWrite: false });
  const shadowGeo = new THREE.PlaneGeometry(1, 1);

  const loader = new THREE.GLTFLoader();
  const cache = {};

  function load(url) {
    if (!cache[url]) {
      cache[url] = new Promise((res, rej) => loader.load(url, (gltf) => {
        const obj = gltf.scene;
        // escala a 4 unidades de largo, centrado y apoyado en el suelo
        const box = new THREE.Box3().setFromObject(obj);
        const size = box.getSize(new THREE.Vector3());
        obj.scale.setScalar(4 / Math.max(size.x, size.z));
        box.setFromObject(obj);
        const c = box.getCenter(new THREE.Vector3());
        obj.position.sub(new THREE.Vector3(c.x, box.min.y, c.z));
        obj.traverse((m) => { if (m.isMesh && m.material) m.material.envMapIntensity = 1.1; });
        const f = box.getSize(new THREE.Vector3());
        const shadow = new THREE.Mesh(shadowGeo, shadowMat);
        shadow.rotation.x = -Math.PI / 2;
        shadow.position.y = 0.01;
        shadow.scale.set(f.x * 1.25, f.z * 1.35, 1);
        const spin = new THREE.Group();   // giro del usuario
        spin.add(obj, shadow);
        const slot = new THREE.Group();   // posición y escala de la transición
        slot.add(spin);
        slot.userData.spin = spin;
        res(slot);
      }, undefined, rej));
    }
    return cache[url];
  }

  const ease = {
    inCubic: (t) => t * t * t,
    outBack: (t) => { const c = 1.35; return 1 + (c + 1) * Math.pow(t - 1, 3) + c * Math.pow(t - 1, 2); },
    outCubic: (t) => 1 - Math.pow(1 - t, 3),
  };

  const BASE_ROT = -0.6;
  let active = null, activeFig = null;
  let rotY = BASE_ROT, vel = 0, dragging = false, lastX = 0, idleAt = 0;
  const leaving = [];        // coches que salen: { slot, t0, dir }
  let enterAt = 0, enterDir = 1, flashAt = -1e9;
  const T_OUT = 520, T_IN = 950;

  // Giro por arrastre con inercia; gira solo despacio cuando nadie lo toca
  canvas.addEventListener("pointerdown", (e) => {
    if (!active) return;
    dragging = true; lastX = e.clientX; vel = 0;
    canvas.setPointerCapture(e.pointerId);
    showroom.classList.add("grabbing");
    if (hint) hint.classList.add("gone");
  });
  canvas.addEventListener("pointermove", (e) => {
    if (!dragging) return;
    const dx = e.clientX - lastX;
    lastX = e.clientX;
    vel = dx * 0.012;
    rotY += vel;
  });
  const end = () => { dragging = false; idleAt = performance.now(); showroom.classList.remove("grabbing"); };
  canvas.addEventListener("pointerup", end);
  canvas.addEventListener("pointercancel", end);

  async function show(i, dir) {
    const fig = cars[i];
    activeFig = fig;
    const url = fig && fig.dataset.glb;
    const now = performance.now();
    if (active) {
      // el coche actual sale disparado hacia el lado contrario conservando su giro
      leaving.push({ slot: active, t0: now, dir, rot: rotY });
      active = null;
    }
    showroom.classList.toggle("is-3d", !!url);
    if (!url) return;
    try {
      const model = await load(url);
      if (activeFig !== fig) return;
      // si ya estaba en escena saliendo, se reutiliza
      const k = leaving.findIndex((l) => l.slot === model);
      if (k >= 0) leaving.splice(k, 1);
      if (!model.parent) scene.add(model);
      active = model;
      enterAt = performance.now();
      enterDir = dir;
      flashAt = enterAt;
      vel = 0;
      rotY = BASE_ROT + (reduceMotion ? 0 : -dir * Math.PI * 0.9);
      fig.classList.add("ready3d");
    } catch (e) {
      showroom.classList.remove("is-3d");
    }
  }

  function resize() {
    const r = canvas.getBoundingClientRect();
    if (!r.width) return;
    renderer.setSize(r.width, r.height, false);
    camera.aspect = r.width / r.height;
    camera.updateProjectionMatrix();
  }
  window.addEventListener("resize", resize);

  let visible = false, last = performance.now();
  new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(showroom);
  (function tick(now) {
    requestAnimationFrame(tick);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    if (!visible || (!active && !leaving.length)) return;

    // salida: acelera hacia fuera, se encoge un poco y gira
    for (let j = leaving.length - 1; j >= 0; j--) {
      const l = leaving[j];
      const t = Math.min(1, (now - l.t0) / T_OUT);
      const e = ease.inCubic(t);
      l.slot.position.set(-l.dir * 9 * e, 0, -1.5 * e);
      l.slot.scale.setScalar(1 - 0.15 * e);
      l.slot.userData.spin.rotation.y = l.rot - l.dir * 1.2 * e;
      if (t >= 1) { scene.remove(l.slot); leaving.splice(j, 1); }
    }

    if (active) {
      // entrada: llega desde el lado del cambio, frena con un pequeño rebote y endereza el giro
      const t = reduceMotion ? 1 : Math.min(1, (now - enterAt) / T_IN);
      const e = ease.outBack(t);
      active.position.set(enterDir * 8 * (1 - e), 0, -1.2 * (1 - ease.outCubic(t)));
      active.scale.setScalar(0.88 + 0.12 * ease.outCubic(t));
      if (t < 1) {
        rotY += (BASE_ROT - rotY) * (1 - Math.pow(0.0008, dt));
      } else if (!dragging) {
        vel *= Math.pow(0.04, dt);
        rotY += vel;
        if (!reduceMotion && now - Math.max(idleAt, enterAt + T_IN) > 1500 && Math.abs(vel) < 0.002) rotY += dt * 0.35;
      }
      active.userData.spin.rotation.y = rotY;
    }

    // destello de luz al llegar y pequeño empujón de cámara
    const f = Math.max(0, 1 - (now - flashAt) / 900);
    rim.intensity = RIM + 3.5 * f * f;
    key.intensity = 1.4 + 0.8 * f * f;
    camera.position.z = CAM_Z + 0.35 * Math.sin(Math.min(1, (now - flashAt) / T_IN) * Math.PI) * (reduceMotion ? 0 : 1);

    renderer.render(scene, camera);
  })(last);

  showroom.addEventListener("srchange", (e) => {
    const d = e.detail;
    show(typeof d === "number" ? d : d.index, (d && d.dir) || 1);
  });
  resize();
  // primero el coche visible y, justo después, el resto para que el cambio sea instantáneo
  show(0, 1).then(() => cars.forEach((c) => c.dataset.glb && load(c.dataset.glb).then(() => c.classList.add("ready3d"), () => {})));
})();

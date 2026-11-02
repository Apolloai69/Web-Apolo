/* =========================================================
   APOLO MK · La Tierra vista desde satélite (three.js)
   Gira de una ubicación a otra y traza un arco desde Madrid.
   ========================================================= */
(() => {
  const host = document.getElementById("earth");
  if (!host) return;

  const THREE_URL = "https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  const PLACES = [
    { n: "Madrid", c: "España", lat: 40.42, lon: -3.70, hq: true },
    { n: "Nueva York", c: "Estados Unidos", lat: 40.71, lon: -74.01 },
    { n: "Ciudad de México", c: "México", lat: 19.43, lon: -99.13 },
    { n: "Londres", c: "Reino Unido", lat: 51.51, lon: -0.13 },
    { n: "Dubái", c: "Emiratos Árabes", lat: 25.20, lon: 55.27 },
    { n: "Bogotá", c: "Colombia", lat: 4.71, lon: -74.07 },
    { n: "Berlín", c: "Alemania", lat: 52.52, lon: 13.40 },
    { n: "Buenos Aires", c: "Argentina", lat: -34.60, lon: -58.38 },
    { n: "Tokio", c: "Japón", lat: 35.68, lon: 139.69 },
    { n: "París", c: "Francia", lat: 48.86, lon: 2.35 },
    { n: "Miami", c: "Estados Unidos", lat: 25.76, lon: -80.19 },
    { n: "São Paulo", c: "Brasil", lat: -23.55, lon: -46.63 },
    { n: "Singapur", c: "Singapur", lat: 1.35, lon: 103.82 },
    { n: "Lisboa", c: "Portugal", lat: 38.72, lon: -9.14 },
    { n: "Los Ángeles", c: "Estados Unidos", lat: 34.05, lon: -118.24 },
    { n: "Riad", c: "Arabia Saudí", lat: 24.71, lon: 46.68 },
    { n: "Lima", c: "Perú", lat: -12.05, lon: -77.04 },
    { n: "Milán", c: "Italia", lat: 45.46, lon: 9.19 },
    { n: "Sídney", c: "Australia", lat: -33.87, lon: 151.21 },
    { n: "Toronto", c: "Canadá", lat: 43.65, lon: -79.38 },
    { n: "Santiago", c: "Chile", lat: -33.45, lon: -70.67 },
    { n: "Ciudad del Cabo", c: "Sudáfrica", lat: -33.92, lon: 18.42 },
    { n: "Ámsterdam", c: "Países Bajos", lat: 52.37, lon: 4.90 },
    { n: "Casablanca", c: "Marruecos", lat: 33.57, lon: -7.59 },
    { n: "Barcelona", c: "España", lat: 41.39, lon: 2.17 },
  ];

  const fmt = (v, pos, neg) => `${Math.abs(v).toFixed(2)}° ${v >= 0 ? pos : neg}`;
  const coordText = (p) => `${fmt(p.lat, "N", "S")} · ${fmt(p.lon, "E", "O")}`;

  // Carga three.js solo cuando la sección se acerca a la pantalla
  const lazy = new IntersectionObserver((entries) => {
    if (!entries.some((e) => e.isIntersecting)) return;
    lazy.disconnect();
    if (window.THREE) return init();
    const s = document.createElement("script");
    s.src = THREE_URL;
    s.onload = init;
    document.head.appendChild(s);
  }, { rootMargin: "600px 0px" });
  lazy.observe(host);

  function init() {
    const THREE = window.THREE;
    const mount = document.getElementById("earthCanvas");
    const labelsEl = document.getElementById("earthLabels");
    const hudCity = document.getElementById("ehCity");
    const hudCoord = document.getElementById("ehCoord");

    let renderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch (e) {
      return; // sin WebGL: se queda el globo CSS de respaldo
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
    renderer.outputEncoding = THREE.sRGBEncoding;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(30, 1, 0.1, 100);
    camera.position.set(0, 0, 4.9);

    // Luz como la del sol: cara iluminada a la izquierda, terminador suave a la derecha
    scene.add(new THREE.AmbientLight(0xffffff, 0.42));
    const sun = new THREE.DirectionalLight(0xffffff, 1.15);
    sun.position.set(-4, 2, 5);
    scene.add(sun);
    const rim = new THREE.DirectionalLight(0xb48cff, 0.55);
    rim.position.set(5, -1, -2);
    scene.add(rim);

    const globe = new THREE.Group();
    scene.add(globe);

    // Posición sobre la esfera, alineada con el UV de SphereGeometry
    const toVec = (lat, lon, r = 1) => {
      const phi = (lon + 180) * Math.PI / 180;
      const theta = (90 - lat) * Math.PI / 180;
      return new THREE.Vector3(
        -r * Math.cos(phi) * Math.sin(theta),
        r * Math.cos(theta),
        r * Math.sin(phi) * Math.sin(theta)
      );
    };

    const loader = new THREE.TextureLoader();
    const earthMap = loader.load("img/tierra/earth.jpg", () => host.classList.add("gl-ready"));
    earthMap.encoding = THREE.sRGBEncoding;
    earthMap.anisotropy = renderer.capabilities.getMaxAnisotropy();
    const bump = loader.load("img/tierra/bump.png");

    const earth = new THREE.Mesh(
      new THREE.SphereGeometry(1, 96, 96),
      new THREE.MeshPhongMaterial({
        map: earthMap, bumpMap: bump, bumpScale: 0.025,
        specular: new THREE.Color(0x221a40), shininess: 10,
      })
    );
    globe.add(earth);

    // Brillo violeta de la atmósfera (borde interior + halo exterior)
    const fresnel = (power, strength, side, color) => new THREE.ShaderMaterial({
      uniforms: { c: { value: new THREE.Color(color) } },
      vertexShader: "varying vec3 vN; void main(){ vN = normalize(normalMatrix * normal); gl_Position = projectionMatrix * modelViewMatrix * vec4(position,1.0); }",
      fragmentShader: side === THREE.BackSide
        ? `uniform vec3 c; varying vec3 vN; void main(){ float i = pow(max(0.0, 0.62 - dot(vN, vec3(0.0,0.0,1.0))), ${power.toFixed(1)}) * ${strength.toFixed(2)}; gl_FragColor = vec4(c, 1.0) * i; }`
        : `uniform vec3 c; varying vec3 vN; void main(){ float i = pow(1.0 - max(0.0, dot(vN, vec3(0.0,0.0,1.0))), ${power.toFixed(1)}) * ${strength.toFixed(2)}; gl_FragColor = vec4(c, i); }`,
      side, blending: THREE.AdditiveBlending, transparent: true, depthWrite: false,
    });
    const rimGlow = new THREE.Mesh(new THREE.SphereGeometry(1.004, 64, 64), fresnel(3.5, 0.6, THREE.FrontSide, 0x9d6bff));
    scene.add(rimGlow);
    const halo = new THREE.Mesh(new THREE.SphereGeometry(1.16, 64, 64), fresnel(3, 1.5, THREE.BackSide, 0x8b5cf6));
    scene.add(halo);

    // Estrellas de fondo
    const starPos = [];
    for (let i = 0; i < 700; i++) {
      const v = new THREE.Vector3().randomDirection ? new THREE.Vector3().randomDirection() : new THREE.Vector3(Math.random() - .5, Math.random() - .5, Math.random() - .5).normalize();
      v.multiplyScalar(14 + Math.random() * 6);
      if (v.z > -2) v.z = -v.z - 4; // siempre detrás del planeta
      starPos.push(v.x, v.y, v.z);
    }
    const starGeo = new THREE.BufferGeometry();
    starGeo.setAttribute("position", new THREE.Float32BufferAttribute(starPos, 3));
    scene.add(new THREE.Points(starGeo, new THREE.PointsMaterial({ color: 0xd8c8ff, size: 0.05, transparent: true, opacity: 0.75 })));

    // Marcadores
    const markers = PLACES.map((p) => {
      const pos = toVec(p.lat, p.lon);
      const g = new THREE.Group();
      g.position.copy(pos.clone().multiplyScalar(1.003));
      g.lookAt(pos.clone().multiplyScalar(2));
      const dot = new THREE.Mesh(
        new THREE.CircleGeometry(p.hq ? 0.017 : 0.011, 24),
        new THREE.MeshBasicMaterial({ color: p.hq ? 0xe879f9 : 0xffffff, side: THREE.DoubleSide })
      );
      const ring = new THREE.Mesh(
        new THREE.RingGeometry(0.02, 0.026, 40),
        new THREE.MeshBasicMaterial({ color: 0xe879f9, transparent: true, opacity: 0, side: THREE.DoubleSide, depthWrite: false })
      );
      g.add(dot, ring);
      globe.add(g);

      const lbl = document.createElement("div");
      lbl.className = "e-lbl" + (p.hq ? " hq" : "");
      lbl.innerHTML = p.hq ? `${p.n} HQ` : `${p.n}<small>${p.c}</small>`;
      lbl.style.opacity = 0;
      labelsEl.appendChild(lbl);
      return { p, pos, g, ring, lbl, phase: Math.random() * Math.PI * 2 };
    });
    const hq = markers[0];

    // Arco Madrid → destino, con un punto de luz recorriéndolo
    const ARC_N = 72;
    const arcGeo = new THREE.BufferGeometry();
    arcGeo.setAttribute("position", new THREE.Float32BufferAttribute(new Float32Array(ARC_N * 3), 3));
    const arc = new THREE.Line(arcGeo, new THREE.LineBasicMaterial({ color: 0xf0abfc, transparent: true, opacity: 0.95 }));
    arc.visible = false;
    globe.add(arc);
    const spark = new THREE.Mesh(new THREE.SphereGeometry(0.014, 12, 12), new THREE.MeshBasicMaterial({ color: 0xffffff }));
    spark.visible = false;
    globe.add(spark);
    let arcPts = [];

    const buildArc = (to) => {
      const a = hq.pos.clone().normalize(), b = to.pos.clone().normalize();
      const ang = a.angleTo(b);
      const lift = 0.06 + ang * 0.16;
      arcPts = [];
      const arr = arcGeo.attributes.position.array;
      for (let i = 0; i < ARC_N; i++) {
        const t = i / (ARC_N - 1);
        // slerp manual entre los dos puntos
        const s = Math.sin(ang) || 1;
        const v = a.clone().multiplyScalar(Math.sin((1 - t) * ang) / s).add(b.clone().multiplyScalar(Math.sin(t * ang) / s));
        v.normalize().multiplyScalar(1.004 + Math.sin(Math.PI * t) * lift);
        arcPts.push(v);
        arr[i * 3] = v.x; arr[i * 3 + 1] = v.y; arr[i * 3 + 2] = v.z;
      }
      arcGeo.attributes.position.needsUpdate = true;
      arcGeo.setDrawRange(0, 0);
    };

    // Rotación del globo: Ry primero, luego Rx (orden XYZ de three.js)
    const rot = { x: 0, y: 0 }, target = { x: 0, y: 0 };
    const aimAt = (m) => {
      const v = m.pos;
      target.y = -Math.atan2(v.x, v.z);
      target.x = (m.p.lat * Math.PI / 180) * 0.75;
      // giro más corto
      const d = target.y - rot.y;
      target.y = rot.y + Math.atan2(Math.sin(d), Math.cos(d));
    };

    let idx = 0, active = hq, arrivedAt = 0, phaseStart = performance.now();
    const HOLD = 3400;
    const goTo = (i) => {
      idx = i;
      active = markers[i];
      aimAt(active);
      if (active !== hq) buildArc(active);
      arc.visible = active !== hq;
      spark.visible = false;
      arrivedAt = 0;
      phaseStart = performance.now();
      hudCity.textContent = `${active.p.n}, ${active.p.c}`;
      hudCoord.textContent = coordText(active.p);
    };
    goTo(0);
    rot.x = target.x; rot.y = target.y;

    // Arrastrar para girar (pausa el recorrido unos segundos)
    let drag = null, pausedUntil = 0;
    renderer.domElement.addEventListener("pointerdown", (e) => {
      drag = { x: e.clientX, y: e.clientY, rx: rot.x, ry: rot.y };
    });
    window.addEventListener("pointermove", (e) => {
      if (!drag) return;
      const k = 3.2 / host.clientWidth;
      rot.y = drag.ry + (e.clientX - drag.x) * k;
      rot.x = Math.max(-1.1, Math.min(1.1, drag.rx + (e.clientY - drag.y) * k));
      target.x = rot.x; target.y = rot.y;
      pausedUntil = performance.now() + 4000;
    });
    window.addEventListener("pointerup", () => { drag = null; });

    const resize = () => {
      const w = mount.clientWidth, h = mount.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    window.addEventListener("resize", resize);

    // Solo renderiza cuando el globo está visible
    let visible = true;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }).observe(host);

    const tmp = new THREE.Vector3(), camDir = new THREE.Vector3();
    const tick = (now) => {
      requestAnimationFrame(tick);
      if (!visible || document.hidden) return;

      if (!drag) {
        const ease = reduceMotion ? 1 : 0.045;
        rot.x += (target.x - rot.x) * ease;
        rot.y += (target.y - rot.y) * ease;
      }
      globe.rotation.set(rot.x, rot.y, 0);

      const settled = Math.abs(target.y - rot.y) < 0.01 && Math.abs(target.x - rot.x) < 0.01;
      if (settled && !arrivedAt) arrivedAt = now;
      if (!drag && arrivedAt && arc.visible) {
        const t = Math.min(1, (now - arrivedAt) / 900);
        arcGeo.setDrawRange(0, Math.floor(t * ARC_N));
        const st = ((now - arrivedAt) % 1800) / 1800;
        spark.visible = t === 1;
        if (spark.visible) spark.position.copy(arcPts[Math.floor(st * (ARC_N - 1))]);
      }
      if (!reduceMotion && !drag && now > pausedUntil && arrivedAt && now - arrivedAt > HOLD) {
        goTo((idx + 1) % markers.length);
      }

      // Anillos que laten y etiquetas proyectadas sobre el canvas
      const w = mount.clientWidth, h = mount.clientHeight;
      camDir.copy(camera.position).normalize();
      markers.forEach((m) => {
        const isActive = m === active;
        const pulse = ((now / 1600) + m.phase / 6.28) % 1;
        const s = isActive ? 1 + pulse * 2.4 : 1 + pulse * 1.2;
        m.ring.scale.set(s, s, s);
        m.ring.material.opacity = (isActive || m.p.hq ? 0.9 : 0.35) * (1 - pulse);

        m.g.getWorldPosition(tmp);
        const facing = tmp.clone().normalize().dot(camDir);
        const show = facing > 0.25 && (isActive || m.p.hq);
        tmp.project(camera);
        const x = (tmp.x * 0.5 + 0.5) * w, y = (-tmp.y * 0.5 + 0.5) * h;
        m.lbl.classList.toggle("active", isActive && !m.p.hq);
        m.lbl.style.opacity = show ? 1 : 0;
        m.lbl.style.transform = `translate(${x}px, ${y}px) translate(-50%, calc(-100% - 12px))`;
      });

      renderer.render(scene, camera);
    };
    requestAnimationFrame(tick);
  }
})();

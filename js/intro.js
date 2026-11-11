/* =========================================================
   APOLO MK · Intro
   Un cohete 3D entra desde la esquina inferior, traza la flecha
   del logo, se lanza contra la pantalla y rompe el cristal.
   ========================================================= */
window.APOLO_INTRO = function playIntro(pre, A_PATH) {
  const MAIN = "M498 672 C625 630 770 562 856 458";
  const TIP = { x: 918, y: 365 };
  const sparks = Array.from({ length: 16 }, (_, i) => {
    const a = (i / 16) * Math.PI * 2;
    return `<line x1="${TIP.x + Math.cos(a) * 22}" y1="${TIP.y + Math.sin(a) * 22}" x2="${TIP.x + Math.cos(a) * 70}" y2="${TIP.y + Math.sin(a) * 70}" pathLength="1"/>`;
  }).join("");

  pre.innerHTML = `
    <div class="pl-bg"></div>
    <div class="pl-dust">${Array.from({ length: 36 }, () => `<i style="left:${Math.random() * 100}%;top:${Math.random() * 100}%;--d:${(Math.random() * 3).toFixed(2)}s;--s:${(2 + Math.random() * 3).toFixed(1)}px"></i>`).join("")}</div>
    <div class="pl-stage">
      <svg class="pl-svg" viewBox="330 200 680 560" aria-hidden="true">
        <defs>
          <linearGradient id="plShine" gradientUnits="userSpaceOnUse" x1="380" y1="290" x2="560" y2="470">
            <stop offset="0" stop-color="#fff" stop-opacity="0"/><stop offset=".5" stop-color="#e9d5ff" stop-opacity="1"/><stop offset="1" stop-color="#fff" stop-opacity="0"/>
          </linearGradient>
        </defs>
        <circle class="pl-halo" cx="652" cy="505" r="250"/>
        <g mask="url(#apoloGap)">
          <path class="pl-a-fill" d="${A_PATH}"/>
          <path class="pl-a-shine" d="${A_PATH}" fill="url(#plShine)"/>
        </g>
        <path class="pl-a-line" pathLength="1" d="${A_PATH}"/>
        <path class="pl-shaft-line" d="${MAIN}"/>
        <path class="pl-shaft" d="M497 668 C620 625 760 560 842 450 L870 466 C792 572 640 640 500 677 Z"/>
        <g class="pl-burst">${sparks}</g>
        <circle class="pl-ring r1" cx="${TIP.x}" cy="${TIP.y}" r="10"/><circle class="pl-ring r2" cx="${TIP.x}" cy="${TIP.y}" r="10"/>
        <polygon class="pl-head" points="790,428 918,365 903,492 872,464 848,449"/>
      </svg>
      <div class="pl-word">${[..."APOLO"].map((c, i) => `<span style="--i:${i}">${c}</span>`).join("")}</div>
      <div class="pl-mk"><i></i><span>MARKETING</span><i></i></div>
    </div>
    <div class="pl-gl"></div>
    <svg class="pl-cracks" aria-hidden="true"></svg>
    <div class="pl-whiteflash"></div>
    <div class="pl-bar"><span></span><b>0%</b></div>`;

  document.body.classList.add("intro");
  const q = (sel) => pre.querySelector(sel);
  const timers = [];
  const later = (ms, fn) => timers.push(setTimeout(fn, ms));
  const tw = (delay, dur, fn, ease = (t) => t) => later(delay, () => {
    const t0 = performance.now();
    const step = (now) => { const t = Math.min(1, (now - t0) / dur); fn(ease(t)); if (t < 1) requestAnimationFrame(step); };
    requestAnimationFrame(step);
  });
  const ease = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
  const out = (t) => 1 - Math.pow(1 - t, 3);
  const back = (t) => 1 + 2.7 * Math.pow(t - 1, 3) + 1.7 * Math.pow(t - 1, 2);

  const svg = q(".pl-svg");
  const toScreen = (x, y) => new DOMPoint(x, y).matrixTransform(svg.getScreenCTM());

  pre.classList.add("go");

  // 1. Se dibuja la A
  const aLine = q(".pl-a-line"), aFill = q(".pl-a-fill");
  tw(120, 750, (t) => (aLine.style.strokeDashoffset = 1 - t), ease);
  tw(780, 320, (t) => { aFill.style.opacity = t; aLine.style.opacity = 1 - t; });

  const shaftLine = q(".pl-shaft-line"), shaft = q(".pl-shaft"), head = q(".pl-head");
  const mainLen = shaftLine.getTotalLength();
  shaftLine.style.strokeDasharray = mainLen;
  shaftLine.style.strokeDashoffset = mainLen;

  // Tiempos (ms)
  const T_ENTER = 950, T_ARROW = 1750, T_DIVE = 2350, T_IMPACT = 2800;

  // 2. Cohete 3D
  const rocket3d = window.THREE ? buildRocketScene(q(".pl-gl")) : null;
  if (rocket3d) {
    const W = () => innerWidth, H = () => innerHeight;
    const start = performance.now();
    // Recorrido continuo: entra desde la esquina inferior izquierda y enlaza con la flecha
    // sin cambiar de dirección (la curva de entrada termina con la misma tangente que la flecha)
    const buildRoute = () => {
      const S = toScreen(498, 672), S2 = toScreen(625, 630);
      const tx = S2.x - S.x, ty = S2.y - S.y, tl = Math.hypot(tx, ty);
      const T = { x: tx / tl, y: ty / tl };
      const A = { x: -0.08 * W(), y: 1.1 * H() };
      const dist = Math.hypot(S.x - A.x, S.y - A.y);
      const C1 = { x: A.x + (S.x - A.x) * .3, y: A.y + (S.y - A.y) * .3 + dist * .05 };
      const C2 = { x: S.x - T.x * dist * .45, y: S.y - T.y * dist * .45 };
      const pts = [], cum = [0];
      for (let i = 0; i <= 60; i++) {
        const t = i / 60, u = 1 - t;
        pts.push({
          x: u * u * u * A.x + 3 * u * u * t * C1.x + 3 * u * t * t * C2.x + t * t * t * S.x,
          y: u * u * u * A.y + 3 * u * u * t * C1.y + 3 * u * t * t * C2.y + t * t * t * S.y,
        });
        if (i) cum.push(cum[i - 1] + Math.hypot(pts[i].x - pts[i - 1].x, pts[i].y - pts[i - 1].y));
      }
      const ctm = svg.getScreenCTM();
      return { pts, cum, entryLen: cum[60], arrowLen: mainLen * Math.hypot(ctm.a, ctm.b) };
    };
    let route = null;
    const along = (d) => {
      const { pts, cum, entryLen, arrowLen } = route;
      if (d < entryLen) {
        let i = 1;
        while (i < cum.length - 1 && cum[i] < d) i++;
        const f = (d - cum[i - 1]) / ((cum[i] - cum[i - 1]) || 1);
        const u = d / entryLen;
        return { x: pts[i - 1].x + (pts[i].x - pts[i - 1].x) * f, y: pts[i - 1].y + (pts[i].y - pts[i - 1].y) * f, z: 4.5 * Math.pow(1 - u, 2) };
      }
      const k = Math.min(1, (d - entryLen) / arrowLen);
      const p = shaftLine.getPointAtLength(k * mainLen), sp = toScreen(p.x, p.y);
      return { x: sp.x, y: sp.y, z: 0, arrow: k };
    };
    const pathAt = (ms) => {
      if (!route) route = buildRoute();
      if (ms < T_DIVE) {
        // Acelera de forma continua durante todo el trayecto (sin frenar en el enlace)
        const t = Math.max(0, (ms - T_ENTER) / (T_DIVE - T_ENTER));
        const f = .55 * t + .45 * t * t;
        return along(f * (route.entryLen + route.arrowLen));
      }
      // Al acabar la flecha gira hacia la cámara y rompe la pantalla
      const t = Math.min(1, (ms - T_DIVE) / (T_IMPACT - T_DIVE));
      const e = toScreen(856, 458), i = toScreen(TIP.x, TIP.y), k = Math.pow(t, 2.2);
      return { x: e.x + (i.x - e.x) * out(t), y: e.y + (i.y - e.y) * out(t), z: 9.35 * k };
    };
    rocket3d.run((now) => {
      const ms = now - start;
      if (ms < T_ENTER) return { hidden: true };
      if (ms >= T_IMPACT) return { hidden: true, stopEngine: true };
      const p = pathAt(ms), n = pathAt(ms + 16);
      if (p.arrow !== undefined) shaftLine.style.strokeDashoffset = mainLen * (1 - p.arrow);
      return { p, n };
    });
    later(T_IMPACT + 1400, () => rocket3d.dispose());
  } else {
    tw(T_ARROW, T_DIVE - T_ARROW, (t) => (shaftLine.style.strokeDashoffset = mainLen * (1 - t)), ease);
  }
  later(T_DIVE, () => (shaftLine.style.strokeDashoffset = 0));
  tw(T_DIVE, 300, (t) => { shaft.style.opacity = t; shaftLine.style.opacity = 1 - t; });

  // 3. Impacto: el cohete choca contra el cristal de la pantalla
  let crack = null;
  const doImpact = () => {
    if (crack) return;
    const i = toScreen(TIP.x, TIP.y);
    crack = makeCracks(q(".pl-cracks"), i.x, i.y);
    head.style.opacity = 1;
    pre.classList.add("land", "impact");
    later(500, () => pre.classList.remove("impact"));
  };
  later(T_IMPACT, doImpact);
  tw(T_IMPACT, 520, (t) => {
    head.style.transformOrigin = "903px 400px";
    const s = t < .2 ? 1 + .5 * out(t / .2) : 1 + .5 * (1 - back((t - .2) / .8));
    head.style.transform = `scale(${s})`;
  });

  // 4. Texto, brillo y barra
  later(T_IMPACT + 250, () => pre.classList.add("words"));
  const shine = q("#plShine");
  tw(T_IMPACT + 700, 900, (t) => shine.setAttribute("gradientTransform", `translate(${-400 + 1100 * t} ${-300 + 700 * t})`), ease);
  const bar = q(".pl-bar span"), pct = q(".pl-bar b");
  tw(0, 4700, (t) => { bar.style.transform = `scaleX(${t})`; pct.textContent = Math.round(t * 100) + "%"; }, (t) => t < .85 ? t * .95 / .85 : .95 + (t - .85) / .15 * .05);

  // 5. El cristal se rompe en pedazos y cae, descubriendo la web
  let done = false;
  const finish = () => {
    if (done) return;
    done = true;
    timers.forEach(clearTimeout);
    if (!crack) {
      crack = makeCracks(q(".pl-cracks"), innerWidth / 2, innerHeight * .45);
      head.style.opacity = 1; shaft.style.opacity = 1;
    }
    shatter(pre, crack);
    if (rocket3d) rocket3d.dispose();
    document.body.classList.remove("intro");
    setTimeout(() => pre.remove(), 1700);
  };
  later(4900, finish);
  pre.addEventListener("click", finish);

  /* ---------------- grietas ---------------- */
  function makeCracks(el, cx, cy) {
    const W = innerWidth, H = innerHeight, k = Math.min(W, H) / 800;
    const RAYS = 15;
    const radii = [0, 60, 170, 360, 700, 3200].map((r) => r * k);
    const angles = [];
    for (let i = 0; i < RAYS; i++) angles.push(((i + Math.random() * .6 - .3) / RAYS) * Math.PI * 2);
    const P = angles.map((a) => radii.map((r, j) => {
      if (!j) return { x: cx, y: cy };
      const jr = r * (1 + (Math.random() - .5) * .35), ja = a + (Math.random() - .5) * .12;
      return { x: cx + Math.cos(ja) * jr, y: cy + Math.sin(ja) * jr };
    }));
    el.setAttribute("viewBox", `0 0 ${W} ${H}`);
    const jag = (p, q, n, amp) => {
      let d = "";
      for (let t = 1; t <= n; t++) {
        const f = t / n, x = p.x + (q.x - p.x) * f, y = p.y + (q.y - p.y) * f;
        const nx = -(q.y - p.y), ny = q.x - p.x, len = Math.hypot(nx, ny) || 1, o = t < n ? (Math.random() - .5) * amp : 0;
        d += ` L${(x + nx / len * o).toFixed(1)} ${(y + ny / len * o).toFixed(1)}`;
      }
      return d;
    };
    let html = `<defs><radialGradient id="ckSpot"><stop offset="0" stop-color="#fff" stop-opacity=".95"/><stop offset=".4" stop-color="#e9d5ff" stop-opacity=".5"/><stop offset="1" stop-color="#fff" stop-opacity="0"/></radialGradient></defs>`;
    html += `<circle class="ck-spot" cx="${cx}" cy="${cy}" r="${70 * k}" fill="url(#ckSpot)"/>`;
    // Rayos irregulares con ramificaciones
    P.forEach((ray, i) => {
      let d = `M${cx} ${cy}`;
      for (let j = 1; j < ray.length; j++) d += jag(ray[j - 1], ray[j], 2 + j, (2 + j * 3) * k);
      html += `<path class="ck-ray" pathLength="1" style="--d:${(i % 5) * 16}ms" d="${d}"/>`;
      for (let b = 0; b < 2; b++) {
        const j = 1 + Math.floor(Math.random() * 3), p = ray[j];
        const a = Math.atan2(p.y - cy, p.x - cx) + (Math.random() < .5 ? -1 : 1) * (.35 + Math.random() * .5);
        const len = (40 + Math.random() * 120) * k * j;
        const q = { x: p.x + Math.cos(a) * len, y: p.y + Math.sin(a) * len };
        html += `<path class="ck-ray thin" pathLength="1" style="--d:${120 + j * 40}ms" d="M${p.x.toFixed(1)} ${p.y.toFixed(1)}${jag(p, q, 2, 4 * k)}"/>`;
      }
    });
    // Anillos solo cerca del impacto
    for (let j = 1; j <= 2; j++) {
      for (let i = 0; i < RAYS; i++) {
        if (j === 2 && Math.random() < .35) continue;
        const a = P[i][j], b = P[(i + 1) % RAYS][j];
        html += `<path class="ck-ring" style="--d:${50 + j * 60}ms" d="M${a.x.toFixed(1)} ${a.y.toFixed(1)}${jag(a, b, 1, 0)}"/>`;
      }
    }
    // Astillas alrededor del impacto
    for (let i = 0; i < 18; i++) {
      const a = Math.random() * Math.PI * 2, r = (10 + Math.random() * 40) * k, s = (3 + Math.random() * 7) * k;
      const x = cx + Math.cos(a) * r, y = cy + Math.sin(a) * r;
      html += `<polygon class="ck-chip" points="${x},${y} ${x + s},${y + s * .4} ${x + s * .3},${y + s}"/>`;
    }
    el.innerHTML = html;
    flyingChips(el, cx, cy, k);
    return { P, radii, RAYS, cx, cy, W, H };
  }

  // Fragmentos de cristal que salen disparados hacia la cámara
  function flyingChips(el, cx, cy, k) {
    const NS = "http://www.w3.org/2000/svg";
    for (let i = 0; i < 14; i++) {
      const g = document.createElementNS(NS, "polygon");
      const s = (4 + Math.random() * 9) * k;
      g.setAttribute("points", `0,0 ${s},${s * .3} ${s * .4},${s}`);
      g.setAttribute("class", "ck-fly");
      el.appendChild(g);
      const a = Math.random() * Math.PI * 2, v = (200 + Math.random() * 600) * k, rot = (Math.random() - .5) * 900;
      const dur = 450 + Math.random() * 350;
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur), e = out(t);
        const x = cx + Math.cos(a) * v * e, y = cy + Math.sin(a) * v * e + 300 * k * t * t;
        g.setAttribute("transform", `translate(${x} ${y}) rotate(${rot * t}) scale(${1 + t * 2.5})`);
        g.setAttribute("opacity", 1 - t);
        t < 1 ? requestAnimationFrame(step) : g.remove();
      };
      requestAnimationFrame(step);
    }
  }

  /* ---------------- rotura final ---------------- */
  function shatter(pre, c) {
    const NS = "http://www.w3.org/2000/svg";
    const { P, radii, RAYS, cx, cy } = c;
    const W = innerWidth, H = innerHeight, R = Math.max(W, H);
    const layer = document.createElementNS(NS, "svg");
    layer.setAttribute("class", "pl-shards");
    layer.setAttribute("viewBox", `0 0 ${W} ${H}`);
    layer.innerHTML = `<defs>
      <radialGradient id="shG1" gradientUnits="userSpaceOnUse" cx="${W * .5}" cy="${H * .42}" r="${R * .55}"><stop offset="0" stop-color="#7c3aed" stop-opacity=".45"/><stop offset="1" stop-color="#7c3aed" stop-opacity="0"/></radialGradient>
      <radialGradient id="shG2" gradientUnits="userSpaceOnUse" cx="${W * .7}" cy="${H * .3}" r="${R * .3}"><stop offset="0" stop-color="#d946ef" stop-opacity=".22"/><stop offset="1" stop-color="#d946ef" stop-opacity="0"/></radialGradient>
      <linearGradient id="shGlass" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#fff" stop-opacity=".12"/><stop offset=".5" stop-color="#fff" stop-opacity="0"/><stop offset="1" stop-color="#c4b5fd" stop-opacity=".08"/></linearGradient>
    </defs>`;
    const shards = [];
    for (let j = 0; j < radii.length - 1; j++) {
      for (let i = 0; i < RAYS; i++) {
        const n = (i + 1) % RAYS;
        const pts = j === 0 ? [P[i][0], P[i][1], P[n][1]] : [P[i][j], P[i][j + 1], P[n][j + 1], P[n][j]];
        const str = pts.map((p) => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(" ");
        const g = document.createElementNS(NS, "g");
        g.innerHTML = `<polygon points="${str}" fill="#07020f"/><polygon points="${str}" fill="url(#shG1)"/><polygon points="${str}" fill="url(#shG2)"/><polygon points="${str}" fill="url(#shGlass)" stroke="rgba(233,213,255,.75)" stroke-width="1.2" stroke-linejoin="round"/>`;
        layer.appendChild(g);
        const ccx = pts.reduce((s, p) => s + p.x, 0) / pts.length, ccy = pts.reduce((s, p) => s + p.y, 0) / pts.length;
        const dx = ccx - cx, dy = ccy - cy, dist = Math.hypot(dx, dy) || 1;
        shards.push({
          g, ccx, ccy,
          delay: Math.min(380, dist * .35) + Math.random() * 60,
          vx: (dx / dist) * (1.5 + Math.random() * 4) + (Math.random() - .5) * 2,
          vy: (dy / dist) * (1 + Math.random() * 3) - Math.random() * 3,
          vr: (Math.random() - .5) * 9,
          vs: .004 + Math.random() * .01,
        });
      }
    }
    pre.insertBefore(layer, pre.firstChild);
    pre.classList.add("shatter");
    const t0 = performance.now();
    const step = (now) => {
      const ms = now - t0;
      let alive = false;
      shards.forEach((s) => {
        const t = (ms - s.delay) / 16.7;
        if (t <= 0) { alive = true; return; }
        const x = s.vx * t, y = s.vy * t + .35 * t * t, r = s.vr * t, sc = 1 + s.vs * t;
        s.g.setAttribute("transform", `translate(${x} ${y}) rotate(${r} ${s.ccx} ${s.ccy}) translate(${s.ccx} ${s.ccy}) scale(${sc}) translate(${-s.ccx} ${-s.ccy})`);
        const op = Math.max(0, 1 - t / 70);
        s.g.setAttribute("opacity", op);
        if (op > 0 && y < H * 1.5) alive = true;
      });
      if (alive) requestAnimationFrame(step);
    };
    requestAnimationFrame(step);
  }

  /* ---------------- cohete 3D (three.js) ---------------- */
  function buildRocketScene(host) {
    const THREE = window.THREE;
    let renderer;
    try { renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true }); } catch (e) { return null; }
    const dpr = Math.min(window.devicePixelRatio || 1, 2);
    renderer.setPixelRatio(dpr);
    renderer.setSize(innerWidth, innerHeight);
    renderer.outputEncoding = THREE.sRGBEncoding;
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.0;
    host.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const FOV = 40, CAM_Z = 10;
    const camera = new THREE.PerspectiveCamera(FOV, innerWidth / innerHeight, 0.05, 100);
    camera.position.set(0, 0, CAM_Z);

    // Entorno para reflejos metálicos: cubo pintado en canvas (cielo violeta con paneles de luz)
    const face = (draw) => {
      const c = document.createElement("canvas"); c.width = c.height = 256;
      const g = c.getContext("2d"); draw(g); return c;
    };
    const sky = (g, top, bot) => { const gr = g.createLinearGradient(0, 0, 0, 256); gr.addColorStop(0, top); gr.addColorStop(1, bot); g.fillStyle = gr; g.fillRect(0, 0, 256, 256); };
    const softbox = (g, x, y, w, h, color) => { g.fillStyle = color; g.shadowColor = color; g.shadowBlur = 40; g.fillRect(x, y, w, h); g.shadowBlur = 0; };
    const side = (lights) => face((g) => { sky(g, "#3b2a66", "#07020f"); lights && lights(g); });
    const cube = new THREE.CubeTexture([
      side((g) => softbox(g, 60, 40, 140, 70, "#ffffff")),       // +x
      side((g) => softbox(g, 30, 60, 60, 150, "#c4a1ff")),       // -x
      face((g) => { sky(g, "#6d55a8", "#3a2470"); softbox(g, 70, 70, 116, 116, "#ffffff"); }), // +y
      face((g) => sky(g, "#0b0414", "#0b0414")),                  // -y
      side((g) => softbox(g, 150, 30, 80, 60, "#ffe9ff")),        // +z
      side(),                                                     // -z
    ]);
    cube.encoding = THREE.sRGBEncoding;
    cube.needsUpdate = true;
    const pmrem = new THREE.PMREMGenerator(renderer);
    const envTex = pmrem.fromCubemap(cube).texture;
    scene.environment = envTex;

    scene.add(new THREE.HemisphereLight(0xd9c8ff, 0x12061f, .45));
    const key = new THREE.DirectionalLight(0xffffff, 2.2); key.position.set(4, 6, 8); scene.add(key);
    const rim = new THREE.DirectionalLight(0xc084fc, 1.6); rim.position.set(-6, -2, -4); scene.add(rim);

    // Modelo del cohete (eje +Y)
    const rocket = new THREE.Group();
    const V = (x, y) => new THREE.Vector2(x, y);
    const metal = new THREE.MeshStandardMaterial({ color: 0xeeeaf6, metalness: .7, roughness: .2, envMap: envTex, envMapIntensity: 1 });
    const purple = new THREE.MeshStandardMaterial({ color: 0x5b21b6, metalness: .3, roughness: .38, envMap: envTex, envMapIntensity: .3 });
    const dark = new THREE.MeshStandardMaterial({ color: 0x2a2340, metalness: .8, roughness: .35, envMap: envTex });
    const chrome = new THREE.MeshStandardMaterial({ color: 0xffffff, metalness: 1, roughness: .08, envMap: envTex });

    const bodyProfile = [V(0, -1.5), V(.4, -1.5), V(.47, -1.38), V(.5, -1.1), V(.51, -.3), V(.5, .6), V(.47, .95)];
    rocket.add(new THREE.Mesh(new THREE.LatheGeometry(bodyProfile, 64), metal));
    const noseProfile = [V(.47, .95), V(.43, 1.2), V(.35, 1.48), V(.24, 1.72), V(.12, 1.9), V(.03, 1.99), V(0, 2.0)];
    rocket.add(new THREE.Mesh(new THREE.LatheGeometry(noseProfile, 64), purple));
    const band = new THREE.Mesh(new THREE.CylinderGeometry(.515, .515, .2, 64, 1, true), purple);
    band.position.y = -1.0; rocket.add(band);
    [.25, -.45].forEach((y) => {
      const ring = new THREE.Mesh(new THREE.TorusGeometry(.508, .012, 8, 64), dark);
      ring.rotation.x = Math.PI / 2; ring.position.y = y; rocket.add(ring);
    });
    // Ventanilla
    const win = new THREE.Mesh(new THREE.TorusGeometry(.2, .045, 16, 48), chrome);
    win.position.set(0, .45, .5); rocket.add(win);
    const glass = new THREE.Mesh(new THREE.SphereGeometry(.18, 32, 16), new THREE.MeshStandardMaterial({ color: 0x2e1065, metalness: .9, roughness: .04, emissive: 0x5b21b6, emissiveIntensity: .45, envMap: envTex }));
    glass.scale.z = .35; glass.position.set(0, .45, .49); rocket.add(glass);
    // Aletas
    const fs = new THREE.Shape();
    fs.moveTo(0, .1); fs.lineTo(0, -1.0); fs.quadraticCurveTo(.45, -1.2, .62, -1.42); fs.lineTo(.64, -1.0); fs.quadraticCurveTo(.4, -.5, 0, .1);
    const finGeo = new THREE.ExtrudeGeometry(fs, { depth: .06, bevelEnabled: true, bevelThickness: .015, bevelSize: .015, bevelSegments: 2 });
    finGeo.translate(.44, -.4, -.03);
    for (let i = 0; i < 3; i++) {
      const f = new THREE.Mesh(finGeo, purple);
      f.rotation.y = (i / 3) * Math.PI * 2 + Math.PI / 6;
      rocket.add(f);
    }
    // Tobera
    const nozProfile = [V(.22, -1.5), V(.26, -1.6), V(.34, -1.75), V(.42, -1.9)];
    const noz = new THREE.Mesh(new THREE.LatheGeometry(nozProfile, 48), new THREE.MeshStandardMaterial({ color: 0x3b3550, metalness: .85, roughness: .3, side: THREE.DoubleSide, envMap: envTex }));
    rocket.add(noz);

    // Fuego morado: conos aditivos con degradado
    const fireMat = (color, intensity) => new THREE.ShaderMaterial({
      uniforms: { uColor: { value: new THREE.Color(color) }, uI: { value: intensity } },
      vertexShader: "varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ vUv = uv; vN = normalize(normalMatrix * normal); vec4 mv = modelViewMatrix * vec4(position,1.0); vV = normalize(-mv.xyz); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "uniform vec3 uColor; uniform float uI; varying vec2 vUv; varying vec3 vN; varying vec3 vV; void main(){ float along = 1.0 - vUv.y; float rim = pow(abs(dot(vN, vV)), 1.4); float a = pow(along, 1.6) * rim * uI; gl_FragColor = vec4(uColor * a, a); }",
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending, side: THREE.DoubleSide,
    });
    const fire = new THREE.Group();
    fire.position.y = -1.85;
    const cone = (r, h, mat) => {
      const m = new THREE.Mesh(new THREE.ConeGeometry(r, h, 32, 1, true), mat);
      m.rotation.x = Math.PI; m.position.y = -h / 2; fire.add(m); return m;
    };
    cone(.44, 4.2, fireMat(0x7c3aed, 1.7));
    cone(.3, 2.9, fireMat(0xc026d3, 2));
    cone(.17, 1.3, fireMat(0xfdf4ff, 2.4));
    rocket.add(fire);
    const flameLight = new THREE.PointLight(0xb45cff, 6, 6, 2);
    flameLight.position.y = -2.4; rocket.add(flameLight);

    const holder = new THREE.Group();
    holder.add(rocket);
    scene.add(holder);

    // Partículas del motor
    const N = 1400;
    const pos = new Float32Array(N * 3), col = new Float32Array(N * 3), alpha = new Float32Array(N), size = new Float32Array(N);
    const vel = new Float32Array(N * 3), life = new Float32Array(N), maxLife = new Float32Array(N), baseSize = new Float32Array(N);
    const pg = new THREE.BufferGeometry();
    pg.setAttribute("position", new THREE.BufferAttribute(pos, 3));
    pg.setAttribute("aColor", new THREE.BufferAttribute(col, 3));
    pg.setAttribute("aAlpha", new THREE.BufferAttribute(alpha, 1));
    pg.setAttribute("aSize", new THREE.BufferAttribute(size, 1));
    const pMat = new THREE.ShaderMaterial({
      uniforms: { uScale: { value: innerHeight * dpr / (2 * Math.tan(FOV * Math.PI / 360)) } },
      vertexShader: "attribute vec3 aColor; attribute float aAlpha; attribute float aSize; uniform float uScale; varying vec3 vC; varying float vA; void main(){ vC = aColor; vA = aAlpha; vec4 mv = modelViewMatrix * vec4(position,1.0); gl_PointSize = aSize * uScale / max(.1, -mv.z); gl_Position = projectionMatrix * mv; }",
      fragmentShader: "varying vec3 vC; varying float vA; void main(){ float d = length(gl_PointCoord - .5); if (d > .5) discard; float a = pow(1. - d * 2., 1.7) * vA; gl_FragColor = vec4(vC * a, a); }",
      transparent: true, depthWrite: false, blending: THREE.AdditiveBlending,
    });
    const points = new THREE.Points(pg, pMat);
    points.frustumCulled = false;
    scene.add(points);
    const C1 = new THREE.Color(0xfbe7ff), C2 = new THREE.Color(0xe879f9), C3 = new THREE.Color(0x8b5cf6), C4 = new THREE.Color(0x2e1065);
    const tmpC = new THREE.Color();
    let head = 0;

    const Y = new THREE.Vector3(0, 1, 0);
    const nozzleW = new THREE.Vector3(), dirW = new THREE.Vector3(), velW = new THREE.Vector3();
    const qDir = new THREE.Quaternion(), qRoll = new THREE.Quaternion();
    const tanH = Math.tan(FOV * Math.PI / 360);
    const unproject = (px, py, z) => {
      const d = CAM_Z - z, hh = d * tanH, hw = hh * camera.aspect;
      return new THREE.Vector3((px / innerWidth * 2 - 1) * hw, -(py / innerHeight * 2 - 1) * hh, z);
    };
    // Escala: el cohete mide ~16 % del lado corto de la pantalla a profundidad 0
    const rocketScale = () => (Math.min(innerWidth, innerHeight) * .2) / (3.9 * innerHeight / (2 * CAM_Z * tanH));

    let raf, stopped = false, engineOn = true, last = performance.now(), roll = 0;
    const onResize = () => {
      renderer.setSize(innerWidth, innerHeight);
      camera.aspect = innerWidth / innerHeight; camera.updateProjectionMatrix();
      pMat.uniforms.uScale.value = innerHeight * dpr / (2 * tanH);
    };
    addEventListener("resize", onResize);

    const emit = (count, s, rocketVel) => {
      for (let k = 0; k < count; k++) {
        const i = head; head = (head + 1) % N;
        const spread = .55;
        const ox = (Math.random() - .5) * .25 * s, oy = (Math.random() - .5) * .25 * s, oz = (Math.random() - .5) * .25 * s;
        pos[i * 3] = nozzleW.x + ox; pos[i * 3 + 1] = nozzleW.y + oy; pos[i * 3 + 2] = nozzleW.z + oz;
        const sp = (3 + Math.random() * 4) * s;
        vel[i * 3] = -dirW.x * sp + (Math.random() - .5) * spread * sp + rocketVel.x * .25;
        vel[i * 3 + 1] = -dirW.y * sp + (Math.random() - .5) * spread * sp + rocketVel.y * .25;
        vel[i * 3 + 2] = -dirW.z * sp + (Math.random() - .5) * spread * sp + rocketVel.z * .25;
        maxLife[i] = .25 + Math.random() * .55; life[i] = 0;
        baseSize[i] = (.35 + Math.random() * .5) * s;
      }
    };

    return {
      run(getState) {
        const frame = (now) => {
          if (stopped) return;
          raf = requestAnimationFrame(frame);
          const dt = Math.min(.05, (now - last) / 1000); last = now;
          const st = getState(now);
          const s = rocketScale();
          if (st.hidden) {
            holder.visible = false;
            if (st.stopEngine) engineOn = false;
          } else {
            holder.visible = true;
            const p = unproject(st.p.x, st.p.y, st.p.z), n = unproject(st.n.x, st.n.y, st.n.z);
            velW.copy(n).sub(p).divideScalar(.016);
            dirW.copy(n).sub(p);
            if (dirW.lengthSq() < 1e-8) dirW.set(1, 1, 0);
            dirW.normalize();
            holder.position.copy(p);
            holder.scale.setScalar(s);
            roll += dt * 2.2;
            qDir.setFromUnitVectors(Y, dirW);
            qRoll.setFromAxisAngle(Y, roll);
            qDir.multiply(qRoll);
            // Orientación suavizada: el giro hacia la pantalla es progresivo, sin saltos
            if (!holder.userData.init) { holder.quaternion.copy(qDir); holder.userData.init = true; }
            else holder.quaternion.slerp(qDir, 1 - Math.exp(-dt * 14));
            // Llama viva
            fire.scale.set(.92 + Math.random() * .16, .85 + Math.random() * .35, .92 + Math.random() * .16);
            flameLight.intensity = 5 + Math.random() * 3;
            nozzleW.set(0, -1.9, 0).applyQuaternion(holder.quaternion).multiplyScalar(s).add(p);
            if (engineOn) emit(Math.round(900 * dt), s, velW);
          }
          // Actualiza partículas
          for (let i = 0; i < N; i++) {
            if (life[i] >= maxLife[i]) { alpha[i] = 0; continue; }
            life[i] += dt;
            const t = Math.min(1, life[i] / maxLife[i]);
            const drag = 1 - 2.2 * dt;
            vel[i * 3] *= drag; vel[i * 3 + 1] *= drag; vel[i * 3 + 2] *= drag;
            pos[i * 3] += vel[i * 3] * dt; pos[i * 3 + 1] += vel[i * 3 + 1] * dt; pos[i * 3 + 2] += vel[i * 3 + 2] * dt;
            if (t < .15) tmpC.copy(C1).lerp(C2, t / .15);
            else if (t < .5) tmpC.copy(C2).lerp(C3, (t - .15) / .35);
            else tmpC.copy(C3).lerp(C4, (t - .5) / .5);
            col[i * 3] = tmpC.r; col[i * 3 + 1] = tmpC.g; col[i * 3 + 2] = tmpC.b;
            alpha[i] = Math.pow(1 - t, 1.3) * (t < .06 ? t / .06 : 1) * .9;
            size[i] = baseSize[i] * (.5 + t * 1.8);
          }
          pg.attributes.position.needsUpdate = true;
          pg.attributes.aColor.needsUpdate = true;
          pg.attributes.aAlpha.needsUpdate = true;
          pg.attributes.aSize.needsUpdate = true;
          renderer.render(scene, camera);
        };
        raf = requestAnimationFrame(frame);
      },
      dispose() {
        if (stopped) return;
        stopped = true;
        cancelAnimationFrame(raf);
        removeEventListener("resize", onResize);
        envTex.dispose(); cube.dispose(); pmrem.dispose();
        scene.traverse((o) => { if (o.geometry) o.geometry.dispose(); if (o.material) o.material.dispose(); });
        renderer.dispose();
        renderer.domElement.remove();
      },
    };
  }
};

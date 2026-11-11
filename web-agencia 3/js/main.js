/* =========================================================
   APOLO MK · Interacciones y animaciones
   ========================================================= */
(function () {
  const page = document.body.dataset.page || "home";
  const home = page === "home" ? "" : "index.html";
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const $ = (s, el = document) => el.querySelector(s);
  const $$ = (s, el = document) => Array.from(el.querySelectorAll(s));

  /* ---------- Logo APOLO (SVG reutilizable) ---------- */
  const A_PATH = "M388 718 L585 300 L665 300 L866 718 L778 718 L628 405 L476 718 Z";
  document.body.insertAdjacentHTML("afterbegin", `
    <svg class="svg-sprite" aria-hidden="true" focusable="false">
      <defs>
        <linearGradient id="apoloArrow" gradientUnits="userSpaceOnUse" x1="497" y1="680" x2="918" y2="365">
          <stop offset="0" stop-color="#7c3aed"/><stop offset="1" stop-color="#a855f7"/>
        </linearGradient>
        <clipPath id="apoloClip"><rect x="655" y="290" width="270" height="435"/></clipPath>
        <mask id="apoloGap" maskUnits="userSpaceOnUse" x="380" y="290" width="545" height="435">
          <rect x="380" y="290" width="545" height="435" fill="#fff"/>
          <path d="M600 640 C700 600 790 540 860 455" stroke="#000" stroke-width="48" fill="none" clip-path="url(#apoloClip)"/>
        </mask>
        <symbol id="apolo-mark" viewBox="380 290 545 435">
          <path d="${A_PATH}" style="fill:var(--mk-a,#fff)" mask="url(#apoloGap)"/>
          <path d="M497 668 C620 625 760 560 842 450 L870 466 C792 572 640 640 500 677 Z" style="fill:var(--mk-arrow,url(#apoloArrow))"/>
          <polygon points="790,428 918,365 903,492 872,464 848,449" style="fill:var(--mk-arrow,url(#apoloArrow))"/>
        </symbol>
      </defs>
    </svg>`);
  const mark = (cls = "") => `<svg class="mark ${cls}" viewBox="0 0 545 435" aria-hidden="true"><use href="#apolo-mark" width="545" height="435"/></svg>`;
  const lockup = (variant = "") => `
    <span class="lockup ${variant}">
      ${mark()}
      <span class="lk-text"><span class="lk-apolo">APOLO</span><span class="lk-mk"><i></i>MARKETING<i></i></span></span>
    </span>`;
  $$("[data-mark]").forEach((el) => (el.innerHTML = mark()));
  $$("[data-lockup]").forEach((el) => (el.innerHTML = lockup("stack " + el.dataset.lockup)));

  /* ---------- Cabecera y pie compartidos ---------- */
  const logo = `<a href="${home || "#inicio"}" class="logo" aria-label="APOLO Marketing, inicio">${lockup()}</a>`;

  const links = [
    ["Redes sociales", `${home}#redes`],
    ["Servicios", `${home}#servicios`],
    ["ChatGPT Ads", `${home}#chatgpt-ads`],
    ["Sectores", `${home}#sectores`],
    ["Blog", "blog.html"],
  ];

  const header = $("#site-header");
  if (header) {
    header.outerHTML = `
      <header class="nav" id="nav">
        <div class="container nav-inner">
          ${logo}
          <ul class="nav-links">
            ${links.map(([t, h]) => `<li><a href="${h}" class="${t === "Blog" && page !== "home" ? "active" : ""}">${t}</a></li>`).join("")}
          </ul>
          <div class="nav-cta">
            <a href="${home}#simulador" class="btn btn-ghost">Simulador</a>
            <a href="${home}#contacto" class="btn btn-primary magnetic">Auditoría gratis <span class="arrow">→</span></a>
            <button class="burger" id="burger" aria-label="Abrir menú" aria-expanded="false"><span></span><span></span><span></span></button>
          </div>
        </div>
      </header>
      <nav class="mobile-menu" id="mobileMenu" aria-label="Menú móvil">
        ${links.map(([t, h]) => `<a href="${h}">${t}</a>`).join("")}
        <a href="${home}#contacto" class="btn btn-primary btn-lg">Solicitar auditoría gratis →</a>
      </nav>`;
  }

  const footer = $("#site-footer");
  if (footer) {
    footer.outerHTML = `
      <footer>
        <div class="container">
          <div class="foot-grid">
            <div>
              ${logo}
              <p style="margin-top:16px;max-width:320px">Agencia de marketing en redes sociales con sede en Madrid. Captamos clientes para empresas de todo el mundo.</p>
              <div class="socials">
                <a href="#" aria-label="Instagram"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="5"/><circle cx="12" cy="12" r="4"/><circle cx="17.5" cy="6.5" r="1" fill="currentColor"/></svg></a>
                <a href="#" aria-label="TikTok"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M14 3v11.5a3.5 3.5 0 1 1-3.5-3.5"/><path d="M14 3c.5 2.8 2.4 4.6 5 5"/></svg></a>
                <a href="#" aria-label="LinkedIn"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><rect x="3" y="3" width="18" height="18" rx="3"/><path d="M8 10v7M8 7v.01M12 17v-4a2 2 0 0 1 4 0v4M12 10v7"/></svg></a>
              </div>
            </div>
            <div>
              <h4>Servicios</h4>
              <ul>
                <li><a href="${home}#redes">Marketing en redes sociales</a></li>
                <li><a href="${home}#redes">Publicidad en redes</a></li>
                <li><a href="${home}#redes">Community management</a></li>
                <li><a href="${home}#chatgpt-ads">ChatGPT Ads</a></li>
                <li><a href="${home}#servicios">Diseño web</a></li>
                <li><a href="${home}#servicios">Imagen y branding</a></li>
              </ul>
            </div>
            <div>
              <h4>Empresa</h4>
              <ul>
                <li><a href="${home}#sectores">Sectores</a></li>
                <li><a href="${home}#proceso">Cómo trabajamos</a></li>
                <li><a href="blog.html">Blog</a></li>
                <li><a href="${home}#faq">Preguntas frecuentes</a></li>
              </ul>
            </div>
            <div>
              <h4>Contacto</h4>
              <ul>
                <li><a href="mailto:apollo.ai.contact@gmail.com">apollo.ai.contact@gmail.com</a></li>
                <li><a href="${home}#global">Madrid, España</a></li>
                <li><a href="${home}#contacto">Solicitar auditoría</a></li>
                <li><a href="legal.html">Términos legales</a></li>
              </ul>
            </div>
          </div>
          <div class="foot-bottom">
            <span>© ${new Date().getFullYear()} APOLO MK · Madrid, España</span>
            <span class="legal-links">
              <a href="legal.html#aviso-legal">Aviso legal</a>
              <a href="legal.html#privacidad">Privacidad</a>
              <a href="legal.html#cookies">Cookies</a>
              <a href="legal.html#condiciones">Condiciones</a>
            </span>
          </div>
        </div>
      </footer>`;
  }

  /* ---------- Intro con el logo (una vez por sesión) ---------- */
  const pre = $("#preloader");
  if (pre) {
    let seen = false;
    try { seen = sessionStorage.getItem("apoloIntro") === "1"; sessionStorage.setItem("apoloIntro", "1"); } catch (e) {}
    if (seen || reduceMotion) pre.remove();
    else if (window.APOLO_INTRO) window.APOLO_INTRO(pre, A_PATH);
    else pre.remove();
  }

  /* ---------- Letras del logo animado en portada ---------- */
  const hw = $(".hw-apolo");
  if (hw) hw.innerHTML = [...hw.textContent].map((ch, i) => `<span style="--i:${i}">${ch}</span>`).join("");

  /* ---------- Nav: scroll + menú móvil ---------- */
  const nav = $("#nav");
  const progress = $(".scroll-progress");
  const floatCta = $("#floatCta");
  const onScroll = () => {
    const y = window.scrollY;
    nav && nav.classList.toggle("scrolled", y > 30);
    if (progress) {
      const h = document.documentElement.scrollHeight - innerHeight;
      progress.style.width = (h > 0 ? (y / h) * 100 : 0) + "%";
    }
    if (floatCta) {
      const contact = $("#contacto");
      const nearContact = contact && contact.getBoundingClientRect().top < innerHeight * 0.8;
      floatCta.classList.toggle("show", y > innerHeight * 0.9 && !nearContact);
    }
  };
  addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  const burger = $("#burger");
  const menu = $("#mobileMenu");
  if (burger && menu) {
    const toggle = (open) => {
      burger.classList.toggle("open", open);
      menu.classList.toggle("open", open);
      burger.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    };
    burger.addEventListener("click", () => toggle(!menu.classList.contains("open")));
    $$("a", menu).forEach((a) => a.addEventListener("click", () => toggle(false)));
  }

  /* ---------- Brillo que sigue al cursor ---------- */
  const glow = $(".cursor-glow");
  if (glow && !reduceMotion) {
    let tx = innerWidth / 2, ty = innerHeight / 2, cx = tx, cy = ty;
    addEventListener("mousemove", (e) => { tx = e.clientX; ty = e.clientY; });
    (function loop() {
      cx += (tx - cx) * 0.12; cy += (ty - cy) * 0.12;
      glow.style.transform = `translate(${cx - 210}px, ${cy - 210}px)`;
      requestAnimationFrame(loop);
    })();
  }

  /* ---------- Reveal + contadores al hacer scroll ---------- */
  const fmt = (n, format) => {
    if (format === "k") return (n / 1000).toFixed(1).replace(".", ",") + "K";
    return Math.round(n).toLocaleString("es-ES");
  };
  const countUp = (el) => {
    const to = parseFloat(el.dataset.to);
    const format = el.dataset.format;
    if (reduceMotion) { el.textContent = fmt(to, format); return; }
    const dur = 1800, start = performance.now();
    const tick = (now) => {
      const p = Math.min((now - start) / dur, 1);
      el.textContent = fmt(to * (1 - Math.pow(1 - p, 3)), format);
      if (p < 1) requestAnimationFrame(tick);
    };
    requestAnimationFrame(tick);
  };

  const io = new IntersectionObserver((entries) => {
    entries.forEach((en) => {
      if (!en.isIntersecting) return;
      const t = en.target;
      if (t.classList.contains("count")) countUp(t);
      else t.classList.add("in");
      io.unobserve(t);
    });
  }, { threshold: 0.15, rootMargin: "0px 0px -40px 0px" });
  const observeAll = (root = document) => $$(".reveal, .count", root).forEach((el) => io.observe(el));
  observeAll();

  /* ---------- Texto escrito en el hero ---------- */
  const typed = $("#typed");
  if (typed && !reduceMotion) {
    const words = ["Instagram", "TikTok", "Facebook", "LinkedIn", "ChatGPT Ads", "redes sociales"];
    const emojis = ["📸", "🎵", "👍", "💼", "🤖", "🚀"];
    const emoji = $("#typedEmoji");
    // Copias invisibles de cada palabra (con su emoji): el hueco mide siempre lo que la más larga y el párrafo no se mueve
    const slot = $("#typedSlot");
    words.forEach((wd, k) => slot.insertAdjacentHTML("beforeend", `<span class="typed-ghost" aria-hidden="true">${wd}<span class="typed-emoji">${emojis[k]}</span></span>`));
    let w = 0, i = words[0].length, deleting = true;
    setTimeout(function type() {
      const word = words[w];
      if (deleting && i === word.length) emoji.classList.remove("pop");
      i += deleting ? -1 : 1;
      typed.textContent = word.slice(0, i);
      let delay = deleting ? 55 : 95;
      if (!deleting && i === word.length) {
        // Palabra terminada: aparece su emoji
        emoji.textContent = emojis[w];
        emoji.classList.remove("pop"); void emoji.offsetWidth; emoji.classList.add("pop");
        deleting = true; delay = 1900;
      }
      else if (deleting && i === 0) { deleting = false; w = (w + 1) % words.length; delay = 300; }
      setTimeout(type, delay);
    }, 2200);
  }

  /* ---------- Efecto 3D tilt + brillo en tarjetas ---------- */
  const enableHover = window.matchMedia("(hover: hover)").matches && !reduceMotion;
  const bindTilt = (root = document) => {
    if (!enableHover) return;
    $$(".tilt", root).forEach((el) => {
      el.addEventListener("mousemove", (e) => {
        const r = el.getBoundingClientRect();
        const x = (e.clientX - r.left) / r.width, y = (e.clientY - r.top) / r.height;
        el.style.transform = `perspective(900px) rotateX(${(0.5 - y) * 8}deg) rotateY(${(x - 0.5) * 10}deg) translateY(-4px)`;
        el.style.setProperty("--mx", x * 100 + "%");
        el.style.setProperty("--my", y * 100 + "%");
      });
      el.addEventListener("mouseleave", () => { el.style.transform = ""; });
    });
  };
  bindTilt();

  /* ---------- Botones magnéticos ---------- */
  if (enableHover) {
    document.addEventListener("mousemove", (e) => {
      const btn = e.target.closest(".magnetic");
      $$(".magnetic.pulling").forEach((b) => { if (b !== btn) { b.style.transform = ""; b.classList.remove("pulling"); } });
      if (!btn) return;
      const r = btn.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2), dy = e.clientY - (r.top + r.height / 2);
      btn.style.transform = `translate(${dx * 0.18}px, ${dy * 0.3}px)`;
      btn.classList.add("pulling");
    });
  }

  /* ---------- Demo de chat ChatGPT Ads ---------- */
  const chat = $("#chatDemo");
  if (chat) {
    const msgs = $$(".msg", chat);
    const play = () => {
      msgs.forEach((m) => m.classList.remove("show"));
      msgs.forEach((m, i) => setTimeout(() => m.classList.add("show"), 400 + i * 1100));
    };
    new IntersectionObserver((en, obs) => {
      if (en[0].isIntersecting) { play(); obs.disconnect(); setInterval(play, 11000); }
    }, { threshold: 0.4 }).observe(chat);
  }

  /* ---------- Caja registradora de la ilustración de leads ---------- */
  const money = $("#moneyIllu");
  if (money) {
    const NS = "http://www.w3.org/2000/svg";
    const el = (tag, attrs, parent) => {
      const n = document.createElementNS(NS, tag);
      for (const k in attrs) n.setAttribute(k, attrs[k]);
      if (parent) parent.appendChild(n);
      return n;
    };
    const tween = (dur, fn) => new Promise((res) => {
      const t0 = performance.now();
      const step = (now) => {
        const t = Math.min(1, (now - t0) / dur);
        fn(t);
        t < 1 ? requestAnimationFrame(step) : res();
      };
      requestAnimationFrame(step);
    });
    const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
    const easeIO = (t) => (t < .5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
    const easeOut = (t) => 1 - Math.pow(1 - t, 3);
    const eur = (v) => String(Math.round(v)).replace(/\B(?=(\d{3})+(?!\d))/g, ".") + " €";

    const people = $$(".mi-person", money);
    const bars = $$(".mi-bar", money);
    const coins = $$(".mi-coin", money);
    const reg = $("#miRegister"), totalEl = $("#miTotal"), clientsEl = $("#miClients");
    const fx = $("#miFx"), flights = $("#miFlights"), slot = $("#miSlot");
    const SLOT = { x: 452, y: 134 };
    const AMOUNTS = [450, 890, 1200, 650, 980, 1500, 720, 1100, 860];
    let total = 0, shown = 0, clients = 0;

    const setTotal = (from, to) => tween(700, (t) => { shown = from + (to - from) * easeOut(t); totalEl.textContent = eur(shown); });

    // Destellos, anillo y "+importe" cuando el billete entra en la caja
    const celebrate = (amount) => {
      reg.classList.remove("hit"); void reg.getBBox(); reg.classList.add("hit");
      setTimeout(() => reg.classList.remove("hit"), 260);
      const ring = el("circle", { cx: SLOT.x, cy: SLOT.y, r: 6, fill: "none", stroke: "#86efac", "stroke-width": 2 }, fx);
      tween(650, (t) => { ring.setAttribute("r", 6 + easeOut(t) * 46); ring.setAttribute("opacity", 1 - t); }).then(() => ring.remove());
      const colors = ["#fbbf24", "#86efac", "#f0abfc", "#fff"];
      for (let i = 0; i < 12; i++) {
        const a = -Math.PI * (0.1 + 0.8 * Math.random()) - (i % 2 ? 0 : Math.PI * 0.05), d = 26 + Math.random() * 34;
        const sp = el("circle", { r: 1.6 + Math.random() * 2, fill: colors[i % 4], filter: "url(#miGlow)" }, fx);
        tween(700 + Math.random() * 300, (t) => {
          const e = easeOut(t);
          sp.setAttribute("cx", SLOT.x + Math.cos(a) * d * e);
          sp.setAttribute("cy", SLOT.y + Math.sin(a) * d * e + t * t * 18);
          sp.setAttribute("opacity", 1 - t);
        }).then(() => sp.remove());
      }
      const plus = el("text", { x: SLOT.x, y: SLOT.y - 8, class: "mi-plus" }, fx);
      plus.textContent = "+" + eur(amount);
      tween(1300, (t) => { plus.setAttribute("y", SLOT.y - 8 - easeOut(t) * 46); plus.setAttribute("opacity", t < .7 ? 1 : (1 - t) / .3); }).then(() => plus.remove());
    };

    const give = async (k) => {
      const person = people[k % 3];
      const x0 = +person.getAttribute("transform").match(/translate\(([\d.]+)/)[1];
      const arm = $(".mi-arm", person), held = $(".mi-held", person);
      person.classList.add("active");
      // Levanta el brazo
      await tween(380, (t) => arm.setAttribute("transform", `rotate(${-26 * easeOut(t)} 16 -118)`));
      held.classList.add("gone");
      tween(520, (t) => arm.setAttribute("transform", `rotate(${-26 * (1 - easeIO(t))} 16 -118)`));

      // Vuelo del billete en arco, con estela
      const bill = el("g", {}, flights);
      el("use", { href: "#miBill", x: -19, y: -11 }, bill);
      const p0 = { x: x0 + 56, y: 300 - 140 }, p2 = { x: SLOT.x, y: SLOT.y - 16 };
      const p1 = { x: (p0.x + p2.x) / 2, y: Math.min(p0.y, p2.y) - 95 - (2 - (k % 3)) * 12 };
      let lastTrail = 0;
      await tween(1050, (t) => {
        const e = easeIO(t), u = 1 - e;
        const x = u * u * p0.x + 2 * u * e * p1.x + e * e * p2.x;
        const y = u * u * p0.y + 2 * u * e * p1.y + e * e * p2.y;
        const rot = Math.sin(t * Math.PI * 3) * 16 * (1 - t);
        bill.setAttribute("transform", `translate(${x} ${y}) rotate(${rot}) scale(${1 - t * .12})`);
        if (t - lastTrail > .05 && t < .95) {
          lastTrail = t;
          const dot = el("circle", { cx: x, cy: y, r: 2.4, fill: "#86efac", filter: "url(#miGlow)" }, fx);
          tween(500, (q) => { dot.setAttribute("opacity", .8 * (1 - q)); dot.setAttribute("r", 2.4 * (1 - q)); }).then(() => dot.remove());
        }
      });
      // Entra por la ranura
      slot.appendChild(bill);
      await tween(260, (t) => bill.setAttribute("transform", `translate(${SLOT.x} ${p2.y + easeIO(t) * 30}) scale(.88)`));
      bill.remove();

      const amount = AMOUNTS[k];
      celebrate(amount);
      setTotal(total, total + amount);
      total += amount;
      bars[k] && bars[k].classList.add("on");
      coins[k] && coins[k].classList.add("on");
      if (!person.classList.contains("paid")) {
        clients++;
        clientsEl.textContent = `${clients} cliente${clients > 1 ? "s" : ""} nuevo${clients > 1 ? "s" : ""}`;
        person.classList.add("paid");
        const badge = $(".mi-badge", person);
        badge.classList.remove("flip"); void badge.getBBox(); badge.classList.add("flip");
      }
      setTimeout(() => { held.classList.remove("gone"); person.classList.remove("active"); }, 500);
    };

    let visible = false;
    new IntersectionObserver((en) => { visible = en[0].isIntersecting; }, { threshold: 0.2 }).observe(money);
    const whenVisible = async () => { while (!visible || document.hidden) await sleep(300); };

    if (reduceMotion) {
      money.classList.add("static");
      totalEl.textContent = eur(AMOUNTS.reduce((a, b) => a + b, 0));
      clientsEl.textContent = "3 clientes nuevos";
      people.forEach((p) => p.classList.add("paid"));
    } else {
      (async () => {
        for (;;) {
          for (let k = 0; k < AMOUNTS.length; k++) {
            await whenVisible();
            give(k);
            await sleep(1500);
          }
          await sleep(2600);
          // Reinicio suave del mes
          coins.forEach((c) => { c.classList.add("out"); c.classList.remove("on"); });
          bars.forEach((b) => b.classList.remove("on"));
          people.forEach((p) => p.classList.remove("paid"));
          setTotal(total, 0);
          total = 0; clients = 0;
          clientsEl.textContent = "0 clientes nuevos";
          await sleep(900);
          coins.forEach((c) => c.classList.remove("out"));
        }
      })();
    }
  }

  /* ---------- Showroom de vehículos ---------- */
  const showroom = $("#showroom");
  if (showroom) {
    const cars = $$(".sr-car", showroom);
    const dots = $("#srDots");
    dots.innerHTML = cars.map((c, i) => `<button type="button" aria-label="Ver ${c.dataset.name}" data-i="${i}"></button>`).join("");
    let cur = 0, timer;
    const go = (i) => {
      const next = (i + cars.length) % cars.length;
      if (next === cur && cars[cur].classList.contains("on")) return;
      const dir = i < cur ? -1 : 1;
      showroom.style.setProperty("--dir", dir);
      cars[cur].classList.remove("on"); cars[cur].classList.add("out");
      const prev = cars[cur];
      setTimeout(() => prev.classList.remove("out"), 900);
      cur = next;
      cars[cur].classList.add("on");
      // la barra de info cambia con un barrido en la dirección del cambio
      const info = $(".sr-info", showroom);
      info.classList.remove("swap"); void info.offsetWidth; info.classList.add("swap");
      setTimeout(() => {
        $("#srName").textContent = cars[cur].dataset.name;
        $("#srType").textContent = cars[cur].dataset.type;
        $("#srPrice").textContent = cars[cur].dataset.price || "";
      }, 180);
      showroom.classList.remove("swapping"); void showroom.offsetWidth; showroom.classList.add("swapping");
      clearTimeout(showroom._swapT);
      showroom._swapT = setTimeout(() => showroom.classList.remove("swapping"), 1100);
      showroom.dispatchEvent(new CustomEvent("srchange", { detail: { index: cur, dir } }));
      $$("button", dots).forEach((d, j) => d.classList.toggle("on", j === cur));
    };
    // los coches en 3D se quedan más tiempo para dar tiempo a girarlos
    const play = () => { clearTimeout(timer); if (!reduceMotion) timer = setTimeout(() => { go(cur + 1); play(); }, cars[cur].dataset.glb ? 9000 : 4200); };
    $$("button", dots)[0].classList.add("on");
    $("#srPrev").addEventListener("click", () => { go(cur - 1); play(); });
    $("#srNext").addEventListener("click", () => { go(cur + 1); play(); });
    dots.addEventListener("click", (e) => { const b = e.target.closest("button"); if (b) { go(+b.dataset.i); play(); } });
    showroom.addEventListener("mouseenter", () => clearTimeout(timer));
    showroom.addEventListener("pointerdown", () => { clearTimeout(timer); setTimeout(play, 6000); });
    showroom.addEventListener("mouseleave", play);
    play();
  }

  /* ---------- Simulador de resultados ---------- */
  const ticket = $("#ticket"), close = $("#close");
  if (ticket && close) {
    const eur = (n) => Math.round(n).toLocaleString("es-ES") + " €";
    const channels = $$("#channels button");
    const update = () => {
      const mult = channels.filter((b) => b.classList.contains("on")).reduce((a, b) => a + parseFloat(b.dataset.mult), 0);
      const leads = Math.round(50 * mult);
      const clients = Math.max(1, Math.round(leads * (close.value / 100)));
      $("#ticketOut").textContent = eur(ticket.value);
      $("#closeOut").textContent = close.value + "%";
      $("#oLeads").textContent = leads;
      $("#oClients").textContent = clients;
      $("#oRevenue").textContent = eur(clients * ticket.value);
      [ticket, close].forEach((r) => {
        const p = ((r.value - r.min) / (r.max - r.min)) * 100;
        r.style.background = `linear-gradient(90deg, #8b5cf6, #d946ef ${p}%, rgba(255,255,255,.1) ${p}%)`;
      });
    };
    channels.forEach((b, i) => b.addEventListener("click", () => { if (i > 0) b.classList.toggle("on"); update(); }));
    ticket.addEventListener("input", update);
    close.addEventListener("input", update);
    update();
  }

  /* ---------- Explorador de redes sociales ---------- */
  const netTabs = $("#netTabs");
  if (netTabs) {
    const icons = $$(".hero-socials .hs-ic svg").map((svg) => svg.outerHTML);
    const nets = [
      { name: "Instagram", color: "#e1306c", emoji: "📸", cta: "Enviar mensaje →",
        title: "Instagram: tu escaparate y tu canal de ventas",
        desc: "Convertimos tu perfil en una herramienta comercial: contenido que engancha, anuncios que captan leads y mensajes directos que acaban en venta.",
        kpis: [["Reels", "formato estrella"], ["DM", "leads por mensaje"], ["25–45", "edad clave"]],
        formats: ["Reels", "Carruseles", "Stories", "Anuncios de formulario", "Colaboraciones"],
        items: ["Estrategia de contenido y calendario mensual", "Producción de Reels y carruseles", "Campañas de captación con formularios instantáneos", "Gestión de mensajes directos y comentarios"] },
      { name: "TikTok", color: "#25f4ee", emoji: "🎵", cta: "Más información →",
        title: "TikTok: alcance masivo con contenido nativo",
        desc: "Creamos vídeos que parecen contenido orgánico y funcionan como anuncios. Ideal para generar visitas a gran escala con costes competitivos.",
        kpis: [["Viral", "potencial de alcance"], ["9:16", "vídeo vertical"], ["18–40", "edad clave"]],
        formats: ["Vídeos nativos", "Spark Ads", "Creadores UGC", "Lead Gen", "Tendencias"],
        items: ["Guiones basados en tendencias y ganchos", "Grabación con creadores y perfiles reales", "Campañas Spark Ads y de generación de leads", "SEO social para aparecer en búsquedas"] },
      { name: "Facebook", color: "#1877f2", emoji: "👍", cta: "Reservar ahora →",
        title: "Facebook y Meta Ads: precisión y volumen",
        desc: "La plataforma publicitaria más completa para segmentar por intereses, ubicación y comportamiento, y escalar la captación de leads mes a mes.",
        kpis: [["Meta", "Ads Manager"], ["Local", "segmentación geo"], ["30–65", "edad clave"]],
        formats: ["Lead Ads", "Catálogo", "Vídeo", "Retargeting", "Grupos"],
        items: ["Estructura de campañas orientada a leads", "Retargeting a visitantes e interacciones", "Anuncios de catálogo y ofertas locales", "Integración de leads con tu CRM"] },
      { name: "LinkedIn", color: "#0a66c2", emoji: "💼", cta: "Solicitar demo →",
        title: "LinkedIn: clientes B2B y decisores",
        desc: "Llegamos a directivos y responsables de compra por cargo, sector y tamaño de empresa. Perfecto para servicios profesionales y ventas de alto valor.",
        kpis: [["B2B", "decisores"], ["Cargo", "segmentación"], ["Alto", "valor por lead"]],
        formats: ["Lead Gen Forms", "Documentos", "Thought leadership", "Mensajes", "Vídeo"],
        items: ["Marca personal de fundadores y directivos", "Contenido de autoridad y casos de éxito", "Campañas con formularios de generación de leads", "Secuencias para pasar del contacto a la reunión"] },
      { name: "ChatGPT", color: "#10a37f", emoji: "✦", cta: "Preguntar más →",
        title: "ChatGPT Ads: aparece cuando te están buscando",
        desc: "Somos de los primeros en integrar ChatGPT Ads. Tu marca aparece en las conversaciones donde el usuario ya pregunta qué comprar o a quién contratar.",
        kpis: [["Pioneros", "en el canal"], ["Alta", "intención de compra"], ["Menos", "competencia"]],
        formats: ["Anuncios conversacionales", "Respuestas patrocinadas", "Landing integrada", "Retargeting en RRSS"],
        items: ["Investigación de las preguntas reales de tus clientes", "Mensajes adaptados a cada conversación", "Integración con tus campañas en redes sociales", "Medición conjunta de leads y coste por lead"] },
    ];
    const comments = [["laura.mad", "¡Me interesa! ¿Precio? 😍"], ["carlos_88", "Os escribo por privado"], ["ana.rs", "Justo lo que buscaba 🙌"], ["javi.biz", "¿Tenéis disponibilidad esta semana?"]];
    const stage = $(".net-stage"), panel = $("#netPanel");
    netTabs.innerHTML = nets.map((n, i) => `<button type="button" role="tab" class="net-tab" style="--c:${n.color}" data-i="${i}">${icons[i] || ""}${n.name}</button>`).join("");
    let current = 0, auto;
    const show = (i) => {
      current = i;
      const n = nets[i];
      $$(".net-tab", netTabs).forEach((b, j) => { b.classList.toggle("on", j === i); b.setAttribute("aria-selected", j === i); });
      stage.style.setProperty("--nc", n.color);
      panel.classList.remove("swap"); void panel.offsetWidth; panel.classList.add("swap");
      panel.innerHTML = `
        <h3>${n.title}</h3>
        <p>${n.desc}</p>
        <div class="net-kpis">${n.kpis.map(([a, b]) => `<div><strong>${a}</strong><span>${b}</span></div>`).join("")}</div>
        <ul>${n.items.map((t) => `<li>${t}</li>`).join("")}</ul>
        <div class="formats">${n.formats.map((f) => `<span>${f}</span>`).join("")}</div>
        <a href="#contacto" class="btn btn-primary magnetic">Quiero crecer en ${n.name} <span class="arrow">→</span></a>`;
      $("#phNet").textContent = `${n.name} · Patrocinado`;
      $("#phEmoji").textContent = n.emoji;
      $("#phCta").textContent = n.cta;
    };
    const restart = () => { clearInterval(auto); auto = setInterval(() => show((current + 1) % nets.length), 7000); };
    netTabs.addEventListener("click", (e) => { const b = e.target.closest(".net-tab"); if (b) { show(+b.dataset.i); restart(); } });
    $$(".hero-socials .hs-ic").forEach((a) => a.addEventListener("click", () => { show(+a.dataset.net); restart(); }));
    show(0); restart();

    // Actividad simulada en el móvil: likes, comentarios y aviso de lead
    let likes = 12480, c = 0;
    const likesEl = $("#phLikes"), box = $("#phComments"), toast = $("#phToast");
    setInterval(() => { likes += Math.floor(Math.random() * 9) + 1; likesEl.textContent = likes.toLocaleString("es-ES"); }, 700);
    setInterval(() => {
      const [u, t] = comments[c++ % comments.length];
      const d = document.createElement("div");
      d.innerHTML = `<b>${u}</b> ${t}`;
      box.prepend(d);
      while (box.children.length > 3) box.lastChild.remove();
      if (c % 3 === 0) { toast.classList.add("show"); setTimeout(() => toast.classList.remove("show"), 2200); }
    }, 1900);
  }

  /* ---------- FAQ acordeón ---------- */
  $$(".faq-item").forEach((item) => {
    const q = $(".faq-q", item), a = $(".faq-a", item);
    q.addEventListener("click", () => {
      const open = !item.classList.contains("open");
      $$(".faq-item.open").forEach((o) => { o.classList.remove("open"); $(".faq-a", o).style.maxHeight = null; $(".faq-q", o).setAttribute("aria-expanded", false); });
      if (open) { item.classList.add("open"); a.style.maxHeight = a.scrollHeight + "px"; q.setAttribute("aria-expanded", true); }
    });
  });

  /* ---------- Formulario de contacto ---------- */
  // Los envíos llegan por email a través de Web3Forms (https://web3forms.com).
  // Pega aquí la "Access Key" que Web3Forms envía a tu correo.
  const FORM_ACCESS_KEY = "8141c068-c89e-447d-9b48-633ab7d35753";
  const form = $("#leadForm");
  if (form) {
    const submitBtn = $("button[type=submit]", form);
    const errorBox = $(".form-error", form);
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      let ok = true;
      $$("[required]", form).forEach((f) => {
        const valid = f.type === "checkbox" ? f.checked : f.value.trim() && (f.type !== "email" || /\S+@\S+\.\S+/.test(f.value));
        if (f.type === "checkbox") f.classList.toggle("invalid", !valid);
        else f.style.borderColor = valid ? "" : "#f472b6";
        if (!valid) ok = false;
      });
      if (!ok) return;

      const data = new FormData(form);
      const payload = {
        access_key: FORM_ACCESS_KEY,
        subject: `Nuevo lead web: ${data.get("company")} (${data.get("sector")})`,
        from_name: "Web APOLO MK",
        replyto: data.get("email"),
        Nombre: data.get("name"),
        Empresa: data.get("company"),
        Email: data.get("email"),
        "Teléfono": data.get("phone") || "—",
        Sector: data.get("sector"),
        Servicios: data.getAll("svc").join(", ") || "—",
        Mensaje: data.get("message") || "—",
        "Acepta privacidad": "Sí",
        "Acepta comunicaciones comerciales": data.get("marketing") ? "Sí" : "No",
      };
      if (data.get("botcheck")) { form.classList.add("sent"); return; } // bot: se descarta en silencio

      errorBox.hidden = true;
      submitBtn.disabled = true;
      const label = submitBtn.innerHTML;
      submitBtn.innerHTML = "Enviando…";
      try {
        if (FORM_ACCESS_KEY.startsWith("PEGA-AQUI")) throw new Error("Falta la Access Key de Web3Forms en js/main.js");
        const res = await fetch("https://api.web3forms.com/submit", {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify(payload),
        });
        const json = await res.json();
        if (!res.ok || !json.success) throw new Error(json.message || "Error al enviar");
        form.classList.add("sent");
        form.reset();
      } catch (err) {
        console.error(err);
        errorBox.hidden = false;
      } finally {
        submitBtn.disabled = false;
        submitBtn.innerHTML = label;
      }
    });
  }

  /* ---------- Blog ---------- */
  const posts = window.ARTICLES || [];
  const cardHTML = (p, i) => `
    <a class="post tilt reveal ${i % 3 === 1 ? "d1" : i % 3 === 2 ? "d2" : ""}" href="articulo.html?slug=${p.slug}">
      <div class="post-cover">${window.coverSVG ? coverSVG(p, posts.indexOf(p)) : ""}<span class="cat">${p.category}</span></div>
      <div class="post-body">
        <div class="post-meta"><span>${p.date}</span><span>· ${p.read} min de lectura</span></div>
        <h3>${p.title}</h3>
        <p>${p.excerpt}</p>
        <span class="more">Leer artículo →</span>
      </div>
    </a>`;

  const latest = $("#latestPosts");
  if (latest) {
    latest.innerHTML = posts.slice(0, 3).map(cardHTML).join("");
    observeAll(latest); bindTilt(latest);
  }

  const grid = $("#blogGrid");
  if (grid) {
    const feat = posts[0];
    $("#featured").innerHTML = `
      <a class="featured-post reveal" href="articulo.html?slug=${feat.slug}">
        <div class="post-cover">${window.coverSVG ? coverSVG(feat, 0) : ""}<span class="cat">Destacado · ${feat.category}</span></div>
        <div class="post-body">
          <div class="post-meta"><span>${feat.date}</span><span>· ${feat.read} min de lectura</span></div>
          <h2>${feat.title}</h2>
          <p>${feat.excerpt}</p>
          <span class="btn btn-primary" style="align-self:flex-start;margin-top:10px">Leer artículo <span class="arrow">→</span></span>
        </div>
      </a>`;

    const cats = ["Todos", ...new Set(posts.map((p) => p.category))];
    const filters = $("#filters");
    filters.innerHTML = cats.map((c, i) => `<button type="button" class="${i ? "" : "on"}" data-cat="${c}">${c}</button>`).join("");
    const search = $("#search");
    let cat = "Todos";
    const render = () => {
      const q = search.value.trim().toLowerCase();
      const list = posts.filter((p) => (cat === "Todos" || p.category === cat) &&
        (!q || (p.title + " " + p.excerpt + " " + p.category).toLowerCase().includes(q)));
      grid.innerHTML = list.map(cardHTML).join("");
      $("#empty").style.display = list.length ? "none" : "block";
      $("#count").textContent = `${list.length} artículo${list.length === 1 ? "" : "s"}`;
      observeAll(grid); bindTilt(grid);
    };
    filters.addEventListener("click", (e) => {
      const b = e.target.closest("button"); if (!b) return;
      $$("button", filters).forEach((x) => x.classList.toggle("on", x === b));
      cat = b.dataset.cat; render();
    });
    search.addEventListener("input", render);
    observeAll($("#featured"));
    render();
  }

  /* ---------- Página legal: índice activo ---------- */
  const legalNav = $(".legal-nav");
  if (legalNav) {
    const navLinks = $$("a[href^='#']", legalNav);
    const legalObs = new IntersectionObserver((entries) => {
      entries.forEach((en) => {
        if (en.isIntersecting) navLinks.forEach((a) => a.classList.toggle("on", a.getAttribute("href") === "#" + en.target.id));
      });
    }, { rootMargin: "-30% 0px -60% 0px" });
    $$(".legal-doc").forEach((d) => legalObs.observe(d));
  }

  /* ---------- Página de artículo ---------- */
  const art = $("#article");
  if (art) {
    const slug = new URLSearchParams(location.search).get("slug");
    const idx = Math.max(0, posts.findIndex((p) => p.slug === slug));
    const p = posts[idx];
    document.title = `${p.title} · Blog APOLO MK`;
    const metaDesc = $('meta[name="description"]');
    if (metaDesc) metaDesc.setAttribute("content", p.excerpt);

    const body = p.sections.map((s, i) => `
      <h2 id="s${i}">${s.h}</h2>
      ${s.p.map((t) => `<p>${t}</p>`).join("")}
      ${s.list ? `<ul>${s.list.map((li) => `<li><span>${li}</span></li>`).join("")}</ul>` : ""}`).join("");

    const related = posts.filter((x) => x.slug !== p.slug && x.category === p.category).concat(posts.filter((x) => x.category !== p.category && x.slug !== p.slug)).slice(0, 3);

    art.innerHTML = `
      <section class="article-hero">
        <div class="container">
          <a class="back" href="blog.html">← Volver al blog</a>
          <span class="eyebrow" style="display:flex;width:max-content">${p.category}</span>
          <h1>${p.title}</h1>
          <div class="article-meta"><span>✍️ Equipo APOLO MK</span><span>📅 ${p.date}</span><span>⏱️ ${p.read} min de lectura</span></div>
        </div>
      </section>
      <div class="container">
        <div class="article-cover">${window.coverSVG ? coverSVG(p, idx) : ""}</div>
        <div class="article-layout">
          <article class="prose">
            <p class="lead">${p.intro}</p>
            ${body}
            <div class="callout"><p><strong>Conclusión:</strong> ${p.takeaway}</p></div>
          </article>
          <aside class="aside">
            <div class="aside-card">
              <h4>En este artículo</h4>
              <ul class="toc">${p.sections.map((s, i) => `<li><a href="#s${i}">${s.h}</a></li>`).join("")}</ul>
            </div>
            <div class="aside-card cta"><div class="aside-mark">${mark()}</div>
              <h4>¿Quieres mínimo 50 leads al mes?</h4>
              <p>Aplicamos estas estrategias en tu marca con un mínimo de 50 leads al mes desde redes sociales, garantizado por contrato.</p>
              <a href="index.html#contacto" class="btn btn-white btn-block">Auditoría gratuita →</a>
            </div>
            <div class="aside-card">
              <h4>Compartir</h4>
              <div class="share">
                <button type="button" id="copyLink">🔗 Copiar enlace</button>
              </div>
            </div>
          </aside>
        </div>
        <div style="display:flex;justify-content:space-between;gap:14px;flex-wrap:wrap;margin:70px 0 30px">
          ${idx > 0 ? `<a class="btn btn-ghost" href="articulo.html?slug=${posts[idx - 1].slug}">← Anterior</a>` : "<span></span>"}
          ${idx < posts.length - 1 ? `<a class="btn btn-ghost" href="articulo.html?slug=${posts[idx + 1].slug}">Siguiente →</a>` : ""}
        </div>
        <h2 style="margin-top:40px">Sigue leyendo</h2>
        <div class="posts" style="margin:30px 0 40px">${related.map(cardHTML).join("")}</div>
      </div>`;

    observeAll(art); bindTilt(art);

    const copy = $("#copyLink");
    copy.addEventListener("click", () => {
      navigator.clipboard?.writeText(location.href).then(() => { copy.textContent = "✓ Copiado"; setTimeout(() => (copy.textContent = "🔗 Copiar enlace"), 2000); });
    });
  }

  /* ---------- Animaciones ligadas al scroll ---------- */
  if (!reduceMotion && document.body.dataset.page === "home") {
    // Capas de parallax: velocidad relativa al centro de la pantalla
    const layers = [
      [".hero .blob-1", .35], [".hero .blob-2", -.25], [".hero .blob-3", .5],
      [".fc-1", .18], [".fc-2", -.14], [".fc-3", .26],
      [".wm", .22], [".money-illu", -.06], [".globe-wrap", -.08], [".gpt-visual", -.05],
      [".showroom .sr-cars", -.07], [".bb-logo", .1],
    ].flatMap(([sel, k]) => $$(sel).map((el) => ({ el, k, cur: 0 })));
    const heroText = $(".hero-grid > div:first-child"), logoStage = $("#logoStage"), hero = $(".hero");
    const containers = $$("main > .section > .container");
    const process = $(".process"), steps = $$(".process .step");
    const marquee = $(".marquee"), mTrack = $(".marquee-track");
    const wms = $$(".wm");
    let lastY = scrollY, vel = 0, ticking = false;

    const frame = () => {
      ticking = false;
      const vh = innerHeight, y = scrollY;
      vel += ((y - lastY) - vel) * 0.25;
      lastY = y;

      // Portada: el texto sube y se desvanece, el logo se aleja girando
      if (hero) {
        const h = Math.min(1, Math.max(0, y / (hero.offsetHeight * .85)));
        const wide = innerWidth > 980; // en móvil el logo va encima del texto: solo se aleja, sin desplazarse
        if (heroText && wide) { heroText.style.translate = `0 ${-h * 90}px`; heroText.style.opacity = 1 - h * .9; }
        if (logoStage) { logoStage.style.scale = 1 - h * .18; logoStage.style.rotate = `${h * -6}deg`; logoStage.style.translate = wide ? `0 ${h * 60}px` : ""; }
      }

      layers.forEach((l) => {
        const r = l.el.getBoundingClientRect();
        const center = r.top + r.height / 2 - l.cur;
        if (center < -vh || center > vh * 2) return;
        l.cur = (center - vh / 2) * -l.k;
        l.el.style.translate = `0 ${l.cur.toFixed(1)}px`;
      });

      // Cada sección crece ligeramente al entrar en pantalla
      containers.forEach((c) => {
        const r = c.getBoundingClientRect();
        const p = Math.min(1, Math.max(0, (vh - r.top) / (vh * .55)));
        c.style.scale = (0.94 + 0.06 * p).toFixed(4);
        c.style.opacity = (0.35 + 0.65 * p).toFixed(3);
      });

      // Marcas de agua giran con el scroll
      wms.forEach((w) => { w.style.rotate = `${(y * 0.03) % 360}deg`; });

      // Línea del proceso que se llena y pasos que se encienden
      if (process) {
        const r = process.getBoundingClientRect();
        const pp = Math.min(1, Math.max(0, (vh * .75 - r.top) / (r.height + vh * .2)));
        process.style.setProperty("--pp", pp.toFixed(3));
        steps.forEach((s, i) => s.classList.toggle("lit", pp >= (i + .5) / steps.length));
      }

      // La cinta de canales acelera e inclina según la velocidad del scroll
      if (marquee && mTrack) {
        const a = mTrack.getAnimations()[0];
        if (a) a.playbackRate = 1 + Math.min(6, Math.abs(vel) * 0.25) * (vel < 0 ? -1 : 1);
        marquee.style.setProperty("--skew", `${Math.max(-12, Math.min(12, -vel * .4))}deg`);
      }

      if (Math.abs(vel) > .1) requestTick();
    };
    const requestTick = () => { if (!ticking) { ticking = true; requestAnimationFrame(frame); } };
    addEventListener("scroll", requestTick, { passive: true });
    addEventListener("resize", requestTick);
    requestTick();
  }
})();

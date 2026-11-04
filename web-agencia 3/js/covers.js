/* =========================================================
   APOLO MK · Portadas ilustradas del blog
   Cada artículo tiene una ilustración vectorial propia con la
   identidad de marca: fondo morado, flecha de crecimiento y
   elementos planos en blanco, violeta y magenta.
   ========================================================= */
(function () {
  const W = 640, H = 360;
  const C = { white: "#ffffff", soft: "#ede9fe", lilac: "#c4b5fd", violet: "#a855f7", purple: "#8b3dff", deep: "#2b0f52", ink: "#12061f", pink: "#e879f9", green: "#34d399", amber: "#fbbf24" };
  const palettes = [
    ["#4c1d95", "#12061f", "#a855f7"],
    ["#3b0764", "#0b0414", "#d946ef"],
    ["#312e81", "#12061f", "#8b5cf6"],
    ["#581c87", "#0b0414", "#c084fc"],
    ["#4a044e", "#12061f", "#e879f9"],
  ];

  /* ---------- Primitivas ---------- */
  const r = (x, y, w, h, rx, fill, extra = "") => `<rect x="${x}" y="${y}" width="${w}" height="${h}" rx="${rx}" fill="${fill}" ${extra}/>`;
  const c = (x, y, rad, fill, extra = "") => `<circle cx="${x}" cy="${y}" r="${rad}" fill="${fill}" ${extra}/>`;
  const t = (x, y, s, size, fill = C.white, weight = 700, anchor = "middle") =>
    `<text x="${x}" y="${y}" font-family="Space Grotesk, Plus Jakarta Sans, sans-serif" font-size="${size}" font-weight="${weight}" fill="${fill}" text-anchor="${anchor}">${s}</text>`;
  const lines = (x, y, widths, gap = 14, fill = "rgba(255,255,255,.35)", h = 6) =>
    widths.map((w, i) => r(x, y + i * gap, w, h, h / 2, fill)).join("");
  const shadow = `filter="url(#cvShadow)"`;
  const person = (x, y, s = 1, shirt = C.violet, skin = "#f2c9a5") =>
    `<g transform="translate(${x} ${y}) scale(${s})">${c(0, -30, 12, skin)}<path d="M-20 12 Q-20 -14 0 -14 Q20 -14 20 12 Z" fill="${shirt}"/></g>`;
  const avatar = (x, y, rad, ring = C.pink, shirt = C.violet, skin = "#f2c9a5") =>
    `<g transform="translate(${x} ${y})">${c(0, 0, rad, C.deep, `stroke="${ring}" stroke-width="3"`)}<clipPath id="av${x}${y}"><circle r="${rad - 2}"/></clipPath><g clip-path="url(#av${x}${y})">${c(0, -rad * .18, rad * .38, skin)}<ellipse cx="0" cy="${rad * .78}" rx="${rad * .7}" ry="${rad * .55}" fill="${shirt}"/></g></g>`;
  const phone = (x, y, w, h, inner = "") =>
    `<g ${shadow}>${r(x, y, w, h, 22, C.ink, `stroke="${C.lilac}" stroke-opacity=".5" stroke-width="2"`)}${r(x + w / 2 - 22, y + 8, 44, 8, 4, "#241238")}<g transform="translate(${x} ${y})">${inner}</g></g>`;
  const browser = (x, y, w, h, inner = "") =>
    `<g ${shadow}>${r(x, y, w, h, 14, C.white)}${r(x, y, w, 26, 14, C.soft)}${r(x, y + 14, w, 12, 0, C.soft)}${c(x + 16, y + 13, 4, "#f87171")}${c(x + 30, y + 13, 4, C.amber)}${c(x + 44, y + 13, 4, C.green)}${r(x + 60, y + 7, w - 80, 12, 6, C.white)}<g transform="translate(${x} ${y + 26})">${inner}</g></g>`;
  const card = (x, y, w, h, fill = "rgba(255,255,255,.08)", stroke = "rgba(196,181,253,.35)") => r(x, y, w, h, 16, fill, `stroke="${stroke}" stroke-width="1.5"`);
  const arrowUp = (x1, y1, x2, y2, color = C.pink, w = 8) => {
    const mx = (x1 + x2) / 2 + 30, my = (y1 + y2) / 2 + 30;
    return `<path d="M${x1} ${y1} Q${mx} ${my} ${x2} ${y2}" fill="none" stroke="${color}" stroke-width="${w}" stroke-linecap="round"/>` +
      `<path d="M${x2 - 26} ${y2 - 2} L${x2 + 10} ${y2 - 18} L${x2 + 2} ${y2 + 20} Z" fill="${color}"/>`;
  };
  const sparkle = (x, y, s = 1, fill = C.white) =>
    `<path transform="translate(${x} ${y}) scale(${s})" d="M0 -12 L3 -3 L12 0 L3 3 L0 12 L-3 3 L-12 0 L-3 -3 Z" fill="${fill}"/>`;
  const check = (x, y, s = 1) => `<g transform="translate(${x} ${y}) scale(${s})">${c(0, 0, 12, C.green)}<path d="M-5 0 L-1 4 L6 -4" stroke="#fff" stroke-width="2.6" fill="none" stroke-linecap="round" stroke-linejoin="round"/></g>`;
  const heart = (x, y, s = 1, fill = C.pink) => `<path transform="translate(${x} ${y}) scale(${s})" d="M0 6 C-14 -4 -10 -16 0 -9 C10 -16 14 -4 0 6 Z" fill="${fill}"/>`;

  /* ---------- Escenas por artículo ---------- */
  const scenes = {
    "como-conseguir-50-leads-al-mes-con-redes-sociales": () => {
      const dots = Array.from({ length: 14 }, (_, i) => c(150 + (i % 7) * 52, 70 + Math.floor(i / 7) * 34, 9, i % 3 ? C.lilac : C.pink, `opacity="${.6 + (i % 4) * .1}"`)).join("");
      return dots +
        `<path d="M150 135 L490 135 L380 225 L380 285 L260 300 L260 225 Z" fill="url(#cvAccent)" ${shadow}/>` +
        `<path d="M150 135 L490 135 L470 152 L170 152 Z" fill="rgba(255,255,255,.25)"/>` +
        card(470, 230, 120, 70, C.white, "transparent") + t(530, 270, "50+", 30, C.deep) + t(530, 290, "LEADS / MES", 10, C.violet, 700) +
        `<path d="M385 280 Q430 290 465 270" stroke="${C.white}" stroke-width="3" fill="none" stroke-dasharray="6 6"/>` +
        check(590, 232, 1);
    },
    "chatgpt-ads-guia-para-empresas": () =>
      browser(110, 50, 300, 250,
        r(20, 20, 180, 30, 15, C.purple) + lines(30, 30, [150], 10, "rgba(255,255,255,.8)") +
        r(100, 66, 180, 66, 16, C.soft) + lines(116, 80, [140, 120, 90], 14, "#a78bfa") +
        r(20, 146, 260, 66, 14, "#f5f3ff", `stroke="${C.pink}" stroke-width="2"`) + t(36, 166, "PATROCINADO", 10, "#c026d3", 800, "start") + lines(36, 176, [180, 130], 12, "#c4b5fd")) +
      `<g ${shadow}>${c(480, 150, 70, "url(#cvAccent)")}${c(480, 150, 48, C.ink)}${t(480, 162, "IA", 34)}</g>` +
      sparkle(560, 80, 1.6) + sparkle(420, 70, .9, C.pink) + sparkle(560, 240, 1.1, C.lilac),
    "marketing-redes-sociales-sector-automocion": () =>
      `<ellipse cx="320" cy="300" rx="240" ry="26" fill="${C.purple}" opacity=".45" filter="url(#cvBlur)"/>` +
      `<image href="img/vehiculos/renault-clio.png" x="150" y="96" width="340" height="211" preserveAspectRatio="xMidYMid meet" ${shadow}/>` +
      `<g ${shadow}>${card(60, 60, 150, 54, C.white, "transparent")}${t(80, 84, "Test drive", 14, C.deep, 700, "start")}${t(80, 102, "Reservado", 12, C.violet, 600, "start")}${check(185, 87, .9)}</g>` +
      `<g ${shadow}>${card(450, 46, 140, 54, C.white, "transparent")}${t(470, 70, "Nuevo lead", 14, C.deep, 700, "start")}${t(470, 88, "Instagram Ads", 12, C.violet, 600, "start")}</g>` +
      `<path d="M555 120 c-14 0 -24 10 -24 23 c0 18 24 40 24 40 s24 -22 24 -40 c0 -13 -10 -23 -24 -23z" fill="${C.pink}"/>${c(555, 143, 8, C.white)}`,
    "tendencias-marketing-redes-sociales-2027": () =>
      t(320, 210, "2027", 150, "rgba(255,255,255,.1)", 800) +
      `<path d="M80 280 L180 240 L260 256 L350 190 L430 200 L540 100" fill="none" stroke="${C.white}" stroke-width="6" stroke-linecap="round" stroke-linejoin="round"/>` +
      `<path d="M80 280 L180 240 L260 256 L350 190 L430 200 L540 100 L540 300 L80 300 Z" fill="url(#cvAccent)" opacity=".35"/>` +
      [[180, 240], [260, 256], [350, 190], [430, 200]].map(([x, y]) => c(x, y, 8, C.ink, `stroke="${C.white}" stroke-width="4"`)).join("") +
      `<path d="M514 96 L560 86 L548 130 Z" fill="${C.white}"/>` +
      sparkle(130, 90, 1.4) + sparkle(470, 70, 1, C.pink) + sparkle(570, 200, .8, C.lilac),
    "instagram-reels-que-convierten": () =>
      phone(240, 30, 160, 300,
        r(10, 24, 140, 230, 14, "url(#cvAccent)") + c(80, 130, 28, "rgba(255,255,255,.9)") + `<path d="M72 116 L96 130 L72 144 Z" fill="${C.purple}"/>` +
        r(20, 228, 120, 5, 3, "rgba(255,255,255,.3)") + r(20, 228, 70, 5, 3, C.white) + heart(132, 70, 1.2, C.white) + heart(132, 100, 1.2, C.white)) +
      `<g ${shadow}>${card(70, 70, 150, 50, C.white, "transparent")}${t(90, 101, "0-3s · Gancho", 15, C.deep, 700, "start")}</g>` +
      `<g ${shadow}>${card(420, 150, 160, 50, C.white, "transparent")}${t(440, 181, "Prueba + CTA", 15, C.deep, 700, "start")}</g>` +
      `<g ${shadow}>${card(90, 230, 130, 50, C.purple, "transparent")}${t(155, 261, "Subtítulos", 15)}</g>`,
    "tiktok-ads-para-empresas": () =>
      phone(250, 30, 150, 300,
        r(10, 24, 130, 250, 14, "#1a0b2e") + `<path d="M82 90 v70 a18 18 0 1 1 -12 -17" stroke="${C.white}" stroke-width="8" fill="none" stroke-linecap="round"/><path d="M82 90 c4 16 16 26 30 28" stroke="${C.pink}" stroke-width="8" fill="none" stroke-linecap="round"/>` +
        c(122, 200, 9, C.lilac) + heart(122, 226, 1, C.pink) + lines(16, 236, [90, 60], 12)) +
      heart(470, 110, 2.4) + heart(520, 170, 1.6, C.lilac) + heart(450, 220, 1.2) + heart(540, 80, 1, C.white) +
      `<g ${shadow}>${card(70, 120, 150, 54, C.white, "transparent")}${t(90, 145, "Spark Ads", 15, C.deep, 700, "start")}${t(90, 163, "Contenido nativo", 11, C.violet, 600, "start")}</g>` +
      `<g ${shadow}>${card(90, 210, 130, 50, C.purple, "transparent")}${t(155, 241, "UGC", 16)}</g>`,
    "meta-ads-estructura-de-campanas": () => {
      const node = (x, y, w, label, fill) => `<g ${shadow}>${r(x - w / 2, y - 22, w, 44, 14, fill)}${t(x, y + 6, label, 15, fill === C.white ? C.deep : C.white)}</g>`;
      const link = (x1, y1, x2, y2) => `<path d="M${x1} ${y1} C${x1} ${(y1 + y2) / 2} ${x2} ${(y1 + y2) / 2} ${x2} ${y2}" stroke="${C.lilac}" stroke-width="3" fill="none" opacity=".7"/>`;
      return link(320, 80, 180, 170) + link(320, 80, 460, 170) + link(180, 192, 110, 270) + link(180, 192, 250, 270) + link(460, 192, 390, 270) + link(460, 192, 530, 270) +
        node(320, 70, 170, "Campaña", "url(#cvAccent)") + node(180, 180, 150, "Prospección", C.purple) + node(460, 180, 150, "Retargeting", C.purple) +
        [110, 250, 390, 530].map((x, i) => node(x, 280, 110, `Anuncio ${i + 1}`, C.white)).join("");
    },
    "linkedin-para-empresas-b2b": () =>
      `<g ${shadow}>${card(150, 50, 260, 260, C.white, "transparent")}${r(150, 50, 260, 70, 16, "url(#cvAccent)")}${r(150, 100, 260, 20, 0, "url(#cvAccent)")}</g>` +
      avatar(280, 120, 38, C.white, C.purple) + t(280, 192, "Directora Comercial", 17, C.deep) + t(280, 214, "Decisora de compra · B2B", 12, C.violet, 600) +
      r(190, 236, 180, 36, 18, C.purple) + t(280, 259, "+ Conectar", 14) +
      [[490, 90], [560, 170], [480, 250]].map(([x, y]) => `<path d="M410 170 L${x} ${y}" stroke="${C.lilac}" stroke-width="2" stroke-dasharray="4 6"/>` + avatar(x, y, 26, C.pink, C.violet, "#c68b59")).join("") +
      `<g transform="translate(70 190)" ${shadow}>${r(-34, -20, 68, 50, 10, C.amber)}${r(-14, -32, 28, 14, 6, "none", `stroke="${C.amber}" stroke-width="5"`)}${r(-34, -2, 68, 6, 0, "rgba(0,0,0,.15)")}</g>`,
    "calendario-de-contenidos-redes-sociales": () => {
      const cols = ["L", "M", "X", "J", "V", "S", "D"];
      const chips = { 2: C.pink, 4: C.purple, 8: C.green, 10: C.pink, 12: C.amber, 15: C.purple, 17: C.pink, 19: C.green, 23: C.purple, 25: C.pink };
      let cells = "";
      for (let i = 0; i < 28; i++) {
        const x = 150 + (i % 7) * 50, y = 112 + Math.floor(i / 7) * 46;
        cells += r(x, y, 42, 38, 8, "rgba(43,15,82,.06)") + t(x + 8, y + 14, i + 1, 10, "#7c6aa6", 600, "start") + (chips[i] ? r(x + 6, y + 22, 30, 9, 4, chips[i]) : "");
      }
      return `<g ${shadow}>${card(130, 50, 380, 260, C.white, "transparent")}</g>` + r(130, 50, 380, 46, 16, "url(#cvAccent)") + r(130, 80, 380, 16, 0, "url(#cvAccent)") +
        t(150, 80, "Calendario de contenidos", 17, C.white, 700, "start") + cols.map((d, i) => t(171 + i * 50, 106, d, 10, C.violet, 700)).join("") + cells +
        `<g ${shadow}>${c(540, 70, 30, C.pink)}${t(540, 79, "✓", 26)}</g>`;
    },
    "kpis-marketing-redes-sociales": () =>
      `<g ${shadow}>${card(80, 50, 480, 260, C.white, "transparent")}</g>` +
      [["Leads", "+62"], ["Coste/lead", "-18%"], ["ROAS", "4,2x"]].map(([k, v], i) => r(104 + i * 148, 72, 132, 70, 12, i === 0 ? "url(#cvAccent)" : "#f5f3ff") + t(120 + i * 148, 98, k, 12, i === 0 ? C.soft : C.violet, 600, "start") + t(120 + i * 148, 128, v, 24, i === 0 ? C.white : C.deep, 700, "start")).join("") +
      [60, 90, 75, 120, 100, 140, 125].map((h, i) => r(110 + i * 62, 290 - h, 34, h, 6, i === 6 ? C.pink : i % 2 ? C.violet : C.lilac)).join("") +
      `<path d="M127 250 L189 220 L251 235 L313 190 L375 205 L437 160 L499 170" stroke="${C.deep}" stroke-width="3" fill="none" stroke-linejoin="round"/>`,
    "landing-page-para-campanas-en-redes": () =>
      browser(110, 40, 420, 280,
        r(24, 20, 200, 18, 6, C.deep) + r(24, 46, 170, 18, 6, C.purple) + lines(24, 80, [190, 160, 120], 12, "#c4b5fd") + r(24, 130, 140, 36, 18, "url(#cvAccent)") + t(94, 153, "Quiero mi oferta", 12) +
        r(250, 20, 150, 200, 14, "#f5f3ff", `stroke="#ddd6fe"`) + t(325, 46, "Solicita info", 13, C.deep) + [64, 102, 140].map((y) => r(266, y, 118, 26, 8, C.white, `stroke="#ddd6fe"`)).join("") + r(266, 178, 118, 28, 14, C.purple) + t(325, 197, "Enviar", 12)) +
      `<path d="M318 216 L318 250 L327 242 L334 258 L341 255 L334 239 L346 239 Z" fill="${C.ink}" stroke="#fff" stroke-width="2" transform="translate(30 0)"/>` +
      `<g ${shadow}>${c(560, 90, 30, C.green)}${t(560, 99, "↑", 26)}</g>`,
    "branding-en-redes-sociales": () =>
      [C.purple, C.violet, C.pink, C.lilac, C.ink].map((col, i) => `<g ${shadow}>${r(90 + i * 62, 90 + (i % 2) * 20, 52, 150, 14, col, col === C.ink ? `stroke="${C.lilac}" stroke-width="2"` : "")}</g>`).join("") +
      `<g ${shadow}>${card(420, 70, 150, 150, C.white, "transparent")}</g>` + t(495, 170, "Aa", 72, C.deep, 700) +
      `<g ${shadow}>${card(420, 236, 150, 60, "url(#cvAccent)", "transparent")}</g>` + t(495, 274, "Tu marca", 18) +
      sparkle(110, 64, 1.2, C.white) + sparkle(380, 290, .9, C.pink),
    "retargeting-en-redes-sociales": () =>
      `<circle cx="320" cy="180" r="120" fill="none" stroke="${C.lilac}" stroke-width="6" stroke-dasharray="18 14" opacity=".8"/>` +
      `<path d="M430 120 L446 92 L462 126 Z" fill="${C.pink}" transform="rotate(20 446 110)"/><path d="M210 240 L194 268 L178 234 Z" fill="${C.pink}" transform="rotate(20 194 250)"/>` +
      avatar(320, 180, 52, C.white, C.purple) +
      `<g ${shadow}>${browser(110, 50, 120, 84, lines(14, 14, [80, 60], 12, "#c4b5fd"))}</g>` +
      `<g ${shadow}>${phone(470, 190, 70, 120, r(8, 22, 54, 70, 8, "url(#cvAccent)") + heart(35, 60, 1, C.white))}</g>` +
      `<g ${shadow}>${card(430, 50, 150, 50, C.white, "transparent")}${t(505, 81, "Vuelve a verte", 14, C.deep)}</g>`,
    "marketing-con-influencers-y-microcreadores": () =>
      [[150, 110, 30, "#c68b59"], [230, 250, 34, "#f2c9a5"], [420, 260, 30, "#8d5524"], [500, 110, 32, "#f2c9a5"]].map(([x, y, rad, sk]) => `<path d="M320 180 L${x} ${y}" stroke="${C.lilac}" stroke-width="2" stroke-dasharray="4 6"/>` + avatar(x, y, rad, C.lilac, C.violet, sk)).join("") +
      `<circle cx="320" cy="180" r="74" fill="none" stroke="url(#cvAccent)" stroke-width="6"/>` + avatar(320, 180, 62, C.white, C.pink, "#e0ac69") +
      `<g ${shadow}>${r(352, 110, 50, 50, 25, C.amber)}</g>` + `<path transform="translate(377 135) scale(1.1)" d="M0 -14 L4 -4 L14 -4 L6 3 L9 13 L0 7 L-9 13 L-6 3 L-14 -4 L-4 -4 Z" fill="#fff"/>` +
      sparkle(90, 230, 1.2) + sparkle(560, 220, 1, C.pink),
    "seo-social-tiktok-instagram-buscador": () =>
      phone(380, 40, 150, 290, [0, 1, 2].map((i) => r(12, 34 + i * 82, 126, 72, 10, i === 0 ? "url(#cvAccent)" : "#241238") + lines(22, 90 + i * 82, [70], 10, "rgba(255,255,255,.5)")).join("")) +
      `<g ${shadow}>${r(70, 120, 300, 56, 28, C.white)}</g>` + t(120, 155, "agencia redes madrid", 17, C.deep, 600, "start") +
      `<g transform="translate(100 148)"><circle r="11" fill="none" stroke="${C.purple}" stroke-width="4"/><path d="M8 8 L16 16" stroke="${C.purple}" stroke-width="4" stroke-linecap="round"/></g>` +
      `<g ${shadow}>${card(90, 200, 220, 46, C.purple, "transparent")}${t(110, 229, "#1 en resultados", 15, C.white, 700, "start")}</g>` + sparkle(330, 90, 1.2, C.pink),
    "inteligencia-artificial-en-marketing-de-redes": () => {
      const pts = [[120, 90], [120, 180], [120, 270], [520, 90], [520, 180], [520, 270], [230, 60], [410, 60], [230, 300], [410, 300]];
      return pts.map(([x, y]) => `<path d="M320 180 L${x} ${y}" stroke="${C.lilac}" stroke-width="2" opacity=".6"/>` + c(x, y, 12, C.ink, `stroke="${C.pink}" stroke-width="3"`)).join("") +
        `<g ${shadow}>${r(250, 110, 140, 140, 28, "url(#cvAccent)")}</g>` + r(272, 132, 96, 96, 18, C.ink) +
        [0, 1, 2, 3].map((i) => r(268 + i * 30, 96, 10, 16, 3, C.lilac) + r(268 + i * 30, 248, 10, 16, 3, C.lilac) + r(236, 128 + i * 30, 16, 10, 3, C.lilac) + r(388, 128 + i * 30, 16, 10, 3, C.lilac)).join("") +
        t(320, 192, "IA", 40) + sparkle(560, 50, 1.2, C.white);
    },
    "presupuesto-publicidad-redes-sociales": () =>
      [0, 1, 2, 3, 4].map((i) => `<ellipse cx="200" cy="${280 - i * 18}" rx="56" ry="16" fill="${C.amber}" stroke="#b45309" stroke-width="2"/>`).join("") +
      [0, 1, 2].map((i) => `<ellipse cx="300" cy="${280 - i * 18}" rx="46" ry="14" fill="${C.amber}" stroke="#b45309" stroke-width="2"/>`).join("") +
      t(200, 214, "€", 26, "#78350f", 800) +
      `<g ${shadow}>${r(400, 60, 160, 240, 22, C.white)}</g>` + r(418, 80, 124, 50, 10, C.ink) + t(530, 115, "1.500 €", 22, C.green, 700, "end") +
      [0, 1, 2, 3].map((row) => [0, 1, 2].map((col) => r(418 + col * 44, 146 + row * 36, 36, 28, 8, row === 3 && col === 2 ? C.pink : "#ede9fe")).join("")).join("") +
      arrowUp(110, 150, 240, 70, C.green, 7),
    "copywriting-para-anuncios-en-redes": () =>
      `<g ${shadow}>${card(140, 40, 300, 280, C.white, "transparent")}</g>` + t(170, 110, "“", 80, C.purple, 700, "start") +
      r(170, 120, 230, 16, 8, C.deep) + r(170, 146, 180, 16, 8, C.purple) + lines(170, 182, [240, 220, 200, 150], 16, "#ddd6fe", 8) + r(170, 260, 120, 34, 17, "url(#cvAccent)") + t(230, 282, "Llamada a la acción", 10) +
      `<g transform="translate(480 200) rotate(35)" ${shadow}>${r(-12, -110, 24, 170, 6, C.pink)}${r(-12, -110, 24, 26, 6, C.ink)}<path d="M-12 60 L0 90 L12 60 Z" fill="#fde68a"/></g>` +
      sparkle(520, 70, 1.3) + sparkle(110, 280, 1, C.pink),
    "como-elegir-agencia-de-marketing-en-redes": () =>
      `<g ${shadow}>${r(180, 50, 240, 280, 22, C.white)}</g>` + r(255, 36, 90, 32, 10, C.purple) + c(300, 44, 6, C.white) +
      [0, 1, 2, 3, 4].map((i) => check(222, 110 + i * 44, .9) + r(246, 104 + i * 44, i % 2 ? 120 : 140, 12, 6, "#ddd6fe")).join("") +
      `<g ${shadow}>${card(440, 120, 150, 120, "url(#cvAccent)", "transparent")}</g>` + t(515, 174, "Garantía", 18) + t(515, 200, "por contrato", 13, C.soft, 600) +
      sparkle(110, 100, 1.3, C.pink) + sparkle(120, 260, .9),
    "marketing-internacional-en-redes-sociales": () =>
      `<g ${shadow}>${c(320, 190, 130, "url(#cvAccent)")}</g>` +
      `<ellipse cx="320" cy="190" rx="130" ry="46" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/><ellipse cx="320" cy="190" rx="56" ry="130" fill="none" stroke="rgba(255,255,255,.35)" stroke-width="2"/><path d="M190 190 L450 190" stroke="rgba(255,255,255,.35)" stroke-width="2"/>` +
      `<ellipse cx="320" cy="190" rx="168" ry="60" fill="none" stroke="${C.pink}" stroke-width="2.5" stroke-dasharray="6 8" transform="rotate(-18 320 190)"/>` +
      [[300, 150, "Madrid", true], [220, 130, "Nueva York"], [250, 250, "México"], [400, 140, "Berlín"], [420, 230, "Dubái"]].map(([x, y, n, hq]) =>
        `<g ${shadow}>${c(x, y, hq ? 10 : 7, hq ? C.pink : C.white, `stroke="${C.ink}" stroke-width="3"`)}${r(x - 38, y - 38, 76, 22, 11, hq ? C.pink : C.ink)}${t(x, y - 23, n, 11, C.white)}</g>`).join("") +
      sparkle(90, 80, 1.3) + sparkle(560, 290, 1, C.pink),
  };

  /* ---------- Fondo de marca común ---------- */
  const frame = (idx, body) => {
    const [a, b, glow] = palettes[idx % palettes.length];
    return `<svg class="cover-svg" viewBox="0 0 ${W} ${H}" preserveAspectRatio="xMidYMid slice" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
      <defs>
        <linearGradient id="cvBg${idx}" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${a}"/><stop offset="1" stop-color="${b}"/></linearGradient>
        <linearGradient id="cvAccent" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#8b3dff"/><stop offset="1" stop-color="#d946ef"/></linearGradient>
        <filter id="cvBlur" x="-50%" y="-50%" width="200%" height="200%"><feGaussianBlur stdDeviation="30"/></filter>
        <filter id="cvShadow" x="-20%" y="-20%" width="140%" height="160%"><feDropShadow dx="0" dy="10" stdDeviation="12" flood-color="#000" flood-opacity=".35"/></filter>
        <pattern id="cvGrid" width="32" height="32" patternUnits="userSpaceOnUse"><path d="M32 0 H0 V32" fill="none" stroke="rgba(196,181,253,.08)" stroke-width="1"/></pattern>
      </defs>
      <rect width="${W}" height="${H}" fill="url(#cvBg${idx})"/>
      <rect width="${W}" height="${H}" fill="url(#cvGrid)"/>
      <circle cx="${W * .72}" cy="${H * .3}" r="160" fill="${glow}" opacity=".35" filter="url(#cvBlur)"/>
      <circle cx="${W * .2}" cy="${H * .9}" r="120" fill="#6366f1" opacity=".25" filter="url(#cvBlur)"/>
      <path d="M-20 ${H - 30} Q${W * .45} ${H - 70} ${W + 20} ${40}" fill="none" stroke="rgba(232,121,249,.14)" stroke-width="26" stroke-linecap="round"/>
      <g class="cover-art">${body}</g>
      <g opacity=".9" transform="translate(${W - 58} ${H - 44})"><svg width="40" height="32" viewBox="0 0 545 435"><use href="#apolo-mark" width="545" height="435"/></svg></g>
    </svg>`;
  };

  window.coverSVG = (post, idx = 0) => frame(idx, (scenes[post.slug] || scenes["como-conseguir-50-leads-al-mes-con-redes-sociales"])());
})();

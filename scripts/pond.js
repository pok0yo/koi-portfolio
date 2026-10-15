"use strict";
/* Original code. Techniques credited: boids flocking (Reynolds / Shiffman, as in trykhov/FishPond), follow-the-leader
fish chain, height-field water (as in P0RTSIDE/Ripple). Look inspired by the Nagomi pond; no code or art copied. */

/* ===== 1. CONFIG: edit me ===== */
const CONFIG = {
  name: "Yuri Ante",
  tagline: "computer science student · web & mobile developer", // Introductory text displayed above the pond
  pxTarget: 340, // art pixels across a desktop screen (higher = finer pixels)
  koiSpeed: 1, // global swim speed
  restless: 1, // 0.5 = calm and glidey ... 2 = skittish, darting koi
  waveHz: 40, // water simulation steps per second
  waveDamp: 0.986, // lower = ripples die faster
  cameraZoom: 1.7, // moderate pond magnification; fish and scenery share the same scale
  cameraDuration: 700, // milliseconds, also used to settle a selected koi
  focusGlide: 3, // gentle movement radius, in art pixels
};
// One koi per project (taken from the resume). kind: kohaku | sanke | ogon | shiro | tancho | beni
// koiScale: editorial prominence multiplier (0.9 practice, 1 standard, 1.3 featured).
// Seeded proportions remain independent; notebook emblems do not use this value.
const PROJECTS = [
  {
    name: "Flutter Learning App",
    tools: "Dart · Flutter",
    kind: "kohaku",
    seed: 11,
    koiScale: 1.3,
  },
  {
    name: "Sales Automations",
    tools: "n8n · HubSpot API",
    kind: "sanke",
    seed: 23,
    koiScale: 1.3,
  },
  {
    name: "Calculator",
    tools: "JavaScript · DOM",
    kind: "ogon",
    seed: 5,
    koiScale: 0.9,
  },
  {
    name: "Etch-a-Sketch",
    tools: "JavaScript · DOM",
    kind: "shiro",
    seed: 41,
    koiScale: 0.9,
  },
  {
    name: "Rock-Paper-Scissors",
    tools: "JavaScript",
    kind: "tancho",
    seed: 7,
    koiScale: 0.9,
  },
  {
    name: "Blendgo — Landing Page",
    tools: "HTML · CSS Flexbox",
    kind: "kohaku",
    seed: 64,
    koiScale: 0.9,
  },
  {
    name: "Recipe Browser",
    tools: "Semantic HTML",
    kind: "beni",
    seed: 3,
    koiScale: 0.9,
  },
];
// Resume-grounded descriptions. Add live/code URLs only when real links are supplied.
// Résumé and supplied screenshots establish implementation claims; lessons provide learning context.
const PROJECT_DETAILS = [
  {
    category: "Internship work · VDart",
    role: "Strategy Enablement Analyst Intern · UI design and front-end development",
    summary:
      "An educational and lifestyle app intended to help children in India learn practical life skills and build lasting habits.",
    sections: [
      [
        "Purpose",
        "The product was planned to give children opportunities to develop everyday skills alongside habits they could carry into later life.",
      ],
      [
        "My contribution",
        "As part of the VDart development team, I helped design and plan the UI and built the front end in Dart and Flutter.",
      ],
      [
        "Delivered work",
        "I delivered four core modules: a login system, calendar, progress tracker, and course-path content pages. These are development deliverables; the educational benefits describe the intended purpose, not measured learning outcomes or a confirmed launch.",
      ],
    ],
  },
  {
    category: "Internship work · VDart",
    role: "Strategy Enablement Analyst Intern · Automation development and testing",
    tools: "n8n · HubSpot API · Google Sheets",
    summary:
      "Sales automation work supporting prospect discovery, outreach, and less repetitive CRM work.",
    sections: [
      [
        "Problem and workflow",
        "VDart needed a better way to identify suitable potential customers. The team’s workflow used an AI agent to examine search results, keywords, and public information for prospect discovery, followed by automated email outreach.",
      ],
      [
        "My contribution",
        "I designed and tested pipelines integrating n8n, the HubSpot API, and Google Sheets. I also co-developed an AI-driven Sales Manager for redundant CRM and pipeline tasks; this was collaborative internship work.",
      ],
      [
        "Documented results",
        "The automated pipelines reduced sales process time by 20–60 hours per month. Separately, the AI-driven Sales Manager cut manual workflow time by 4–6 hours per week for individual sales representatives. These résumé results refer to those respective workflows, not a measured increase in customers or outreach conversions.",
      ],
    ],
  },
  {
    summary:
      "An on-screen calculator combining numerical operations with a clear, button-driven interface.",
    image: "assets/projects/calculator.png",
    alt: "Dark calculator interface with a large number display, digit keys, arithmetic operators, clear, backspace, decimal and sign controls.",
    caption: "Calculator — supplied interface screenshot.",
    sections: [
      [
        "The interface",
        "A dark display separates the current value from the operation above it. Rounded digit and operator buttons form the main keypad, with visible clear, backspace, decimal, and sign controls.",
      ],
      [
        "Development focus",
        "I built the calculator with HTML, CSS, and JavaScript. The exercise connects input handling, numerical operations, and displayed state; my résumé also records work on numerical edge cases.",
      ],
    ],
    lesson: "calculator",
    category: "Practice project · The Odin Project · Summer 2026",
    role: "Developer · learning project",
    tools: "HTML · CSS · JavaScript · DOM",
  },
  {
    summary: "A browser drawing exercise that turns a grid of small cells into a sketch surface.",
    image: "assets/projects/etch-a-sketch.png",
    alt: "Etch-a-Sketch square grid with black cells forming a drawing and a Custom Size button above it.",
    caption: "Etch-a-Sketch — grid drawing and Custom Size control.",
    sections: [
      [
        "The interface",
        "The drawing area uses a dense square grid, with darkened cells forming a pixel-like sketch. A Custom Size control sits above the canvas-like surface.",
      ],
      [
        "Development focus",
        "I built the interactive grid using JavaScript DOM manipulation, HTML, and CSS. The exercise develops understanding of generated elements, user interaction, and styling individual cells as part of a larger layout.",
      ],
    ],
    lesson: "etch-a-sketch",
    category: "Practice project · The Odin Project · Summer 2026",
    role: "Developer · learning project",
    tools: "HTML · CSS · JavaScript · DOM",
  },
  {
    summary:
      "A browser-based Rock-Paper-Scissors game with direct choices and visible round feedback.",
    image: "assets/projects/rock-paper-scissors.png",
    alt: "Rock-Paper-Scissors game with three large choice buttons and text showing the human choice, computer choice, and winner.",
    caption: "Rock-Paper-Scissors — choices and round result.",
    sections: [
      [
        "The interface",
        "Three large buttons let the player choose rock, paper, or scissors. Text below them reports the human choice, computer choice, and winner for the round.",
      ],
      [
        "Development focus",
        "I implemented the game logic and win-condition tracking using JavaScript, HTML, and CSS. This practice connects conditional logic with user input and understandable feedback in the page.",
      ],
    ],
    lesson: "rock-paper-scissors",
    category: "Practice project · The Odin Project · Summer 2026",
    role: "Developer · learning project",
    tools: "HTML · CSS · JavaScript",
  },
  {
    summary:
      "Blendgo is a practice landing page exploring visual hierarchy and responsive layout with CSS Flexbox.",
    image: "assets/projects/blendgo.png",
    alt: "Blendgo landing page with a dark hero, Home About and Contact Us navigation, a large headline, Sign up button, and laptop photograph.",
    caption: "Blendgo — Landing Page hero and navigation.",
    sections: [
      [
        "The interface",
        "The hero pairs a large headline and sign-up button with a laptop photograph. A simple navigation row and generous spacing establish the page hierarchy. The screenshot includes sample copy; this is a layout exercise, not a commercial service.",
      ],
      [
        "Development focus",
        "I built the page structure with HTML and CSS Flexbox, creating a responsive layout that adapts across screen sizes. The exercise focuses on alignment, spacing, typography, and arranging related content.",
      ],
    ],
    lesson: "landing-page",
    category: "Practice project · The Odin Project · Summer 2026",
    role: "Developer · learning project",
  },
  {
    summary:
      "A static recipe browsing project built around clear document structure and navigation.",
    image: "assets/projects/recipe-browser.png",
    alt: "Lumpia recipe page with a Home Page link, food photograph, What is Lumpia heading, and introductory recipe text.",
    caption: "Recipe Browser — the Lumpia page.",
    sections: [
      [
        "The interface",
        "The supplied Lumpia page presents a prominent title, a Home Page link, a food photograph, and an introduction to the dish. Its straightforward layout keeps the recipe content central.",
      ],
      [
        "Development focus",
        "I structured the recipe content with semantic HTML for clear, accessible navigation. This early exercise focuses on headings, links, images, and organizing a readable web document.",
      ],
    ],
    lesson: "recipes",
    category: "Practice project · The Odin Project · Summer 2026",
    role: "Developer · learning project",
  },
];
PROJECTS.forEach((p, i) => Object.assign(p, PROJECT_DETAILS[i]));
// Edge lily pads: [x, y, radius] (x and y are fractions of the screen). Lotus: [pad index, offset x, offset y].
const PADS = [
  [0.07, 0.12, 26],
  [0.24, 0.03, 17],
  [0.015, 0.42, 19],
  [0.1, 0.66, 25],
  [0.05, 0.93, 21],
  [0.27, 0.98, 16],
  [0.93, 0.1, 21],
  [0.82, 0.03, 15],
  [0.99, 0.47, 23],
  [0.9, 0.73, 26],
  [0.78, 0.97, 21],
  [0.97, 0.97, 17],
  [0.5, 1.02, 14],
  [0.62, -0.01, 13],
];
const LOTUS = [
  [0, 0.15, 0.2],
  [9, -0.1, -0.15],
  [3, 0.1, 0.1],
];

/* ===== 2. PALETTE & helpers ===== */
const hexC = (s) => {
  const n = parseInt(s.slice(1), 16);
  return (255 << 24) | ((n & 255) << 16) | (n & 65280) | (n >> 16);
}; // "#RRGGBB" -> ABGR int
const PALETTE = {
  water: [
    "#174C4B",
    "#1B6266",
    "#207E91",
    "#2694A6",
    "#3AADB5",
    "#59BDBD",
    "#80CEC8",
    "#A4DFD7",
    "#C5EEE3",
  ], // deep -> bright
  pad: {
    dark: "#0B2F1E",
    mid: "#175F39",
    lite: "#25874F",
    vein: "#124D2E",
  },
  lotus: {
    out: "#E85A9A",
    lite: "#F7A3C6",
    edge: "#8F2A63",
    core: "#F2D35B",
  },
  weed: ["#39D353", "#6BE04A", "#2FA84F", "#9BF26B"],
  koi: {
    cream: "#F2ECD8",
    red: "#D63A2F",
    black: "#1B1B20",
    gold: "#F0A030",
    orange: "#EE7A2E",
  },
};
const toC = (o) =>
  typeof o === "string"
    ? hexC(o)
    : Array.isArray(o)
      ? o.map(toC)
      : Object.fromEntries(Object.entries(o).map(([k, v]) => [k, toC(v)]));
const C = toC(PALETTE),
  WHITE = hexC("#FFFFFF"),
  WT = { r: 34, g: 118, b: 130 },
  ramp = Uint32Array.from(C.water);
const mixC = (a, b, t) => {
  const r = (a & 255) * (1 - t) + (b & 255) * t,
    g = ((a >> 8) & 255) * (1 - t) + ((b >> 8) & 255) * t,
    l = ((a >> 16) & 255) * (1 - t) + ((b >> 16) & 255) * t;
  return (255 << 24) | ((l | 0) << 16) | ((g | 0) << 8) | (r | 0);
};
// koi seen through water: blend toward the water tint by m, then dim by f
const dep = (c, m, f) => {
  const r = ((c & 255) * (1 - m) + WT.r * m) * f,
    g = (((c >> 8) & 255) * (1 - m) + WT.g * m) * f,
    b = (((c >> 16) & 255) * (1 - m) + WT.b * m) * f;
  return (255 << 24) | ((b | 0) << 16) | ((g | 0) << 8) | (r | 0);
};
const dk = (c) => ((c >> 1) & 0x7f7f7f) | 0xff000000; // 50% darker
const dk2 = (c) => (((c >> 1) & 0x7f7f7f) + ((c >> 2) & 0x3f3f3f)) | 0xff000000; // 25% darker
const rng = (a) => () => {
  let t = (a += 0x6d2b79f5);
  t = Math.imul(t ^ (t >>> 15), t | 1);
  t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
  return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
};
const angDiff = (a, b) => {
  let d = a - b;
  while (d > Math.PI) d -= 6.2832;
  while (d < -Math.PI) d += 6.2832;
  return d;
};

/* ===== 3. Shared scene state ===== */
// W/H: pond dimensions in art pixels. PXS: CSS pixels per art pixel.
// U: responsive object-size multiplier. camera.z is a separate temporary zoom.
// World -> screen: (world * camera.z + camera offset) * PXS.
// Pointer input uses the inverse transform; DOM artwork uses the forward transform.
const $ = (id) => document.getElementById(id),
  cv = $("pond"),
  ctx = cv.getContext("2d", { alpha: false }),
  tip = $("tip"),
  hint = $("hint");
const motionQuery = matchMedia("(prefers-reduced-motion: reduce)");
let reduce = motionQuery.matches;
const scene = document.createElement("canvas"),
  sceneCtx = scene.getContext("2d", { alpha: false });
const camera = {
  x: 0,
  y: 0,
  z: 1,
  shade: 0,
  from: null,
  to: null,
  elapsed: 0,
};
let selected = null,
  focusPose = null,
  returnFocus = null;
let W,
  H,
  U,
  PXS,
  buf,
  img,
  base,
  stamp,
  hA,
  hB,
  stampId = 0,
  T = 0,
  acc = 0,
  hover = null,
  tipT = 0;
const pads = [],
  lotuses = [],
  weeds = [],
  koi = [],
  pend = [];
const put = (x, y, c) => {
  if (x >= 0 && y >= 0 && x < W && y < H) buf[y * W + x] = c;
};

/* ===== 4. Water: non-repeating, warped caustics in pond coordinates ===== */
// Ripple amplitudes are simulation units; spacing is in art pixels and rate is samples/second.
const RIPPLE = {
  strength: 25,
  speedGain: 0.028,
  maxStrength: 43,
  trailSpacing: 2.5,
  maxInputRate: 60,
  maxTrailSamples: 256,
  contrast: 0.0034,
  maxContrast: 0.18,
  distortion: 0.024,
};
// Sun direction is degrees; causticScale is art pixels; intensity/strength/speed are multipliers.
const WATER = {
  sunDirection: 42,
  sunIntensity: 0.9,
  causticScale: 27,
  lineStrength: 0.76,
  motionSpeed: 0.32,
};
let waterBase,
  waterLight,
  waterWarpX,
  waterWarpY,
  waterBreaks,
  waterFrame,
  waterReady = false;
let lightNodes = [],
  lightCols = 0,
  lightRows = 0,
  waterXWave,
  waterYWave;
function fieldHash(x, y, seed = 0) {
  let h = Math.imul(x, 374761393) ^ Math.imul(y, 668265263) ^ Math.imul(seed, 1274126177);
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  return ((h ^ (h >>> 16)) >>> 0) / 4294967295;
}
function fieldNoise(x, y, seed) {
  const ix = Math.floor(x),
    iy = Math.floor(y),
    fx = x - ix,
    fy = y - iy,
    u = fx * fx * (3 - 2 * fx),
    v = fy * fy * (3 - 2 * fy);
  const a = fieldHash(ix, iy, seed),
    b = fieldHash(ix + 1, iy, seed),
    c = fieldHash(ix, iy + 1, seed),
    d = fieldHash(ix + 1, iy + 1, seed);
  return (a + (b - a) * u) * (1 - v) + (c + (d - c) * u) * v;
}
/* Cloud shadows: overhead illumination */
/* Overhead light field: continuous, untiled noise in unzoomed pond coordinates.
One clock and one mask are shared by the scene and HTML object canvases. */
// Strength/coverage are fractions; size is unscaled art pixels, wind is degrees, speed is art pixels/second.
const CLOUD = {
  strength: 0.18,
  size: 105,
  coverage: 0.46,
  windDirection: 28,
  speed: 1.25,
};
const CLOUD_TINT = hexC("#163F49"),
  CLOUD_GRID = 6;
let cloudTime = 0,
  cloudMask,
  cloudGrid,
  cloudCols = 0,
  cloudRows = 0,
  cloudReady = false;
const cloudSprites = {};
function cloudDensity(x, y) {
  const angle = (CLOUD.windDirection * Math.PI) / 180,
    travel = cloudTime * CLOUD.speed;
  const u = (x / U - Math.cos(angle) * travel) / CLOUD.size,
    v = (y / U - Math.sin(angle) * travel) / CLOUD.size;
  const warpX = fieldNoise(u * 0.63 + 4.7, v * 0.63 + cloudTime * 0.0018, 211) - 0.5;
  const warpY = fieldNoise(u * 0.57 - 8.3, v * 0.57 - cloudTime * 0.0014, 307) - 0.5;
  const broad = fieldNoise(u + warpX * 0.85 + 12.6, v + warpY * 0.85 + 7.1, 419);
  const detail = fieldNoise(
    u * 2.17 + warpY * 0.5 + cloudTime * 0.001,
    v * 2.17 + warpX * 0.5,
    523,
  );
  const value = broad * 0.77 + detail * 0.23;
  const edge = 1 - CLOUD.coverage;
  const a = clamp((value - edge) / 0.23, 0, 1);
  return a * a * (3 - 2 * a);
}
function buildCloudField() {
  cloudCols = Math.ceil(W / CLOUD_GRID) + 1;
  cloudRows = Math.ceil(H / CLOUD_GRID) + 1;
  cloudGrid = new Float32Array(cloudCols * cloudRows);
  cloudMask = new Float32Array(W * H);
  cloudReady = false;
}
function updateCloudField(dt) {
  if (reduce && cloudReady) return;
  if (!reduce) cloudTime += dt;
  for (let y = 0, i = 0; y < cloudRows; y++)
    for (let x = 0; x < cloudCols; x++, i++)
      cloudGrid[i] = cloudDensity(x * CLOUD_GRID, y * CLOUD_GRID);
  for (let y = 0, i = 0; y < H; y++) {
    const gy = Math.floor(y / CLOUD_GRID),
      fy = y / CLOUD_GRID - gy,
      row = gy * cloudCols;
    for (let x = 0; x < W; x++, i++) {
      const gx = Math.floor(x / CLOUD_GRID),
        fx = x / CLOUD_GRID - gx,
        a = cloudGrid[row + gx],
        b = cloudGrid[row + gx + 1],
        c = cloudGrid[row + cloudCols + gx],
        d = cloudGrid[row + cloudCols + gx + 1];
      cloudMask[i] = (a + (b - a) * fx) * (1 - fy) + (c + (d - c) * fx) * fy;
    }
  }
  cloudReady = true;
}
function cloudAt(x, y) {
  // The same interpolation also covers the foreground motion pad's world footprint.
  if (x < 0 || y < 0 || x >= W - 1 || y >= H - 1) return cloudDensity(x, y);
  const ix = Math.floor(x),
    iy = Math.floor(y),
    fx = x - ix,
    fy = y - iy,
    i = iy * W + ix;
  return (
    (cloudMask[i] * (1 - fx) + cloudMask[i + 1] * fx) * (1 - fy) +
    (cloudMask[i + W] * (1 - fx) + cloudMask[i + W + 1] * fx) * fy
  );
}
function shadeCloud(c, density) {
  return mixC(c, CLOUD_TINT, density * CLOUD.strength);
}
function captureCloudSprite(id) {
  const context = $(id).getContext("2d"),
    image = context.getImageData(0, 0, $(id).width, $(id).height);
  cloudSprites[id] = {
    context,
    image,
    pixels: new Uint32Array(image.data.buffer),
    original: new Uint32Array(image.data.buffer.slice(0)),
  };
}
function shadeCloudSprite(id, x, y, width, height) {
  const s = cloudSprites[id],
    sw = s.image.width,
    sh = s.image.height;
  for (let j = 0, i = 0; j < sh; j++)
    for (let k = 0; k < sw; k++, i++) {
      const color = s.original[i];
      if (!(color >>> 24)) continue;
      s.pixels[i] =
        (shadeCloud(color, cloudAt(x + ((k + 0.5) * width) / sw, y + ((j + 0.5) * height) / sh)) &
          0xffffff) |
        (color & 0xff000000);
    }
  s.context.putImageData(s.image, 0, 0);
}
function shadeCloudObjects() {
  shadeCloudSprite("dock-art", dockWorld.x, dockWorld.y, dockWorld.width, dockWorld.height);
  shadeCloudSprite(
    "boat-art",
    boat.x - boat.artWidth / 2,
    boat.y - boat.artHeight / 2,
    boat.artWidth,
    boat.artHeight,
  );
}
function buildWater() {
  waterBase = new Uint32Array(W * H);
  waterLight = new Float32Array(W * H);
  waterWarpX = new Float32Array(W * H);
  waterWarpY = new Float32Array(W * H);
  waterBreaks = new Float32Array(W * H);
  waterFrame = new Uint32Array(W * H);
  waterReady = false;
  waterXWave = new Float32Array(W);
  waterYWave = new Float32Array(H);
  const angle = (WATER.sunDirection * Math.PI) / 180,
    ca = Math.cos(angle),
    sa = Math.sin(angle),
    span = Math.min(W, H) * 0.65;
  for (let y = 0, i = 0; y < H; y++)
    for (let x = 0; x < W; x++, i++) {
      const n = fieldNoise(x / 85, y / 85, 17),
        fine = fieldNoise(x / 36, y / 36, 29),
        edge = Math.min(x, W - x, y, H - y);
      // Uneven broad illumination crosses the pond diagonally, with soft foliage shade.
      const across = -sa * (x - W * 0.13) + ca * (y - H * 0.12) + (n - 0.5) * span * 0.8;
      const beam = Math.exp(-Math.pow(across / (span * 0.52), 2));
      const shade = Math.min(1, edge / 27) * (0.55 + 0.45 * fieldNoise(x / 52, y / 52, 42));
      const sun = beam * shade * (0.55 + 0.45 * n) * WATER.sunIntensity;
      const shallow = Math.exp(-Math.pow((edge - 28) / 30, 2));
      let col = mixC(C.water[1], C.water[4], 0.22 + 0.45 * n + 0.23 * shallow);
      col = mixC(col, C.pad.dark, Math.exp(-edge / 12) * 0.25);
      waterBase[i] = mixC(col, C.water[7], sun * 0.62);
      waterLight[i] = 0.18 + sun * 0.9;
      waterWarpX[i] =
        (fieldNoise(x / 42, y / 42, 8) - 0.5) * 24 + (fieldNoise(x / 18, y / 18, 23) - 0.5) * 11;
      waterWarpY[i] = (fieldNoise(x / 26, y / 26, 13) - 0.5) * 21;
      waterBreaks[i] = fieldNoise(x / 19, y / 19, 31);
    }
  // Independent moving features; hashing never wraps into a repeating texture tile.
  lightCols = Math.ceil(W / WATER.causticScale) + 6;
  lightRows = Math.ceil(H / WATER.causticScale) + 6;
  lightNodes = [];
  for (let y = 0; y < lightRows; y++)
    for (let x = 0; x < lightCols; x++) {
      const h = fieldHash(x - 3, y - 3, 73),
        j = fieldHash(x - 3, y - 3, 97);
      lightNodes.push({
        bx: x - 3 + 0.15 + h * 0.7,
        by: y - 3 + 0.15 + j * 0.7,
        x: 0,
        y: 0,
        phase: h * 23,
        rate: 0.35 + j * 0.45,
      });
    }
}
function drawWater() {
  if (reduce && waterReady) {
    buf.set(waterFrame);
    return;
  }
  const t = ecoTime * WATER.motionSpeed,
    scale = WATER.causticScale;
  for (const p of lightNodes) {
    p.x = p.bx + Math.sin(t * p.rate + p.phase) * 0.19;
    p.y = p.by + Math.cos(t * p.rate * 0.79 + p.phase * 1.7) * 0.19;
  }
  for (let x = 0; x < W; x++)
    waterXWave[x] = Math.sin(x * 0.033 + t * 0.57) * 3 + Math.sin(x * 0.071 - t * 0.29) * 1.2;
  for (let y = 0; y < H; y++)
    waterYWave[y] = Math.sin(y * 0.043 - t * 0.43) * 3 + Math.sin(y * 0.025 + t * 0.31) * 1.6;
  for (let y = 0, i = 0; y < H; y++)
    for (let x = 0; x < W; x++, i++) {
      const ripple = hA[i],
        u = (x + waterWarpX[i] + waterYWave[y] + ripple * RIPPLE.distortion) / scale,
        v = (y + waterWarpY[i] + waterXWave[x] - ripple * RIPPLE.distortion * 0.8) / scale;
      const gx = Math.floor(u) + 3,
        gy = Math.floor(v) + 3;
      let first = 1e6,
        second = 1e6;
      for (let oy = -1; oy <= 1; oy++)
        for (let ox = -1; ox <= 1; ox++) {
          const p = lightNodes[(gy + oy) * lightCols + gx + ox];
          if (!p) continue;
          const dx = u - p.x,
            dy = v - p.y,
            d = dx * dx + dy * dy;
          if (d < first) {
            second = first;
            first = d;
          } else if (d < second) second = d;
        }
      const gap = (Math.sqrt(second) - Math.sqrt(first)) * scale;
      const width = 0.55 + waterBreaks[i] * 0.85;
      const ridge = Math.max(0, 1 - gap / width);
      // Broken lines and varying strength, not a uniformly outlined cellular grid.
      const broken = Math.max(0, Math.min(1, (waterBreaks[i] - 0.24) * 2.4));
      const light =
        ridge * ridge * broken * waterLight[i] * WATER.lineStrength * (1 - cloudMask[i] * 0.45);
      let color = mixC(waterBase[i], C.water[8], light);
      if (Math.abs(ripple) > 0.1)
        color = mixC(
          color,
          ripple > 0 ? C.water[7] : C.water[0],
          Math.min(RIPPLE.maxContrast, Math.abs(ripple) * RIPPLE.contrast),
        );
      buf[i] = color;
    }
  waterFrame.set(buf);
  waterReady = true;
}
function splat(x, y, a) {
  // drop energy into the water
  if (reduce) return;
  const cx = x | 0,
    cy = y | 0;
  if (cx < 2 || cy < 2 || cx >= W - 2 || cy >= H - 2) return;
  const i = cy * W + cx;
  hA[i] += a;
  hA[i - 1] += a * 0.5;
  hA[i + 1] += a * 0.5;
  hA[i - W] += a * 0.5;
  hA[i + W] += a * 0.5;
}
function waveStep() {
  // classic two-buffer wave equation; edges reflect
  const d = CONFIG.waveDamp;
  for (let y = 1; y < H - 1; y++) {
    let i = y * W + 1;
    for (let x = 1; x < W - 1; x++, i++) {
      let v = (hA[i - 1] + hA[i + 1] + hA[i - W] + hA[i + W]) * 0.5 - hB[i];
      v *= d;
      hB[i] = v > -0.03 && v < 0.03 ? 0 : v;
    }
  }
  const t = hA;
  hA = hB;
  hB = t;
}

/* ===== 5. Sprites: lily pads and lotus, generated pixel by pixel ===== */
const mk = (w, h) => ({ w, h, d: new Uint32Array(w * h) });
function makePad(R, seed) {
  const r = rng(seed),
    n = 2 * R + 3,
    c = R + 1,
    s = mk(n, n),
    notch = r() * 6.283,
    P = C.pad;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const dx = x - c,
        dy = y - c,
        d = Math.hypot(dx, dy);
      if (d > R) continue;
      const a = Math.atan2(dy, dx);
      if (d > 2 && Math.abs(((a - notch + 9.4248) % 6.2832) - 3.1416) < 0.17) continue; // the V-shaped notch
      const lit = (-0.6 * dx - 0.8 * dy) / (d || 1);
      let col = P.mid;
      if (d > R - 1.2)
        col = P.dark; // outline
      else if (d > R * 0.68 && lit > 0.45)
        col = P.lite; // sunlit rim, top-left
      else if (d > 3 && Math.abs(((((a + 3.1416) / 6.2832) * 14) % 1) - 0.5) < 0.06)
        col = P.vein; // radial veins
      else if (d < 2) col = P.dark;
      s.d[y * n + x] = col;
    }
  return s;
}
function makeLotus(seed) {
  const r = rng(seed),
    ph = r() * 6.283,
    n = 19,
    c = 9,
    s = mk(n, n),
    L = C.lotus;
  for (let y = 0; y < n; y++)
    for (let x = 0; x < n; x++) {
      const dx = x - c,
        dy = y - c,
        d = Math.hypot(dx, dy),
        cs = Math.cos(8 * (Math.atan2(dy, dx) - ph)),
        R = 7.6 + 1.4 * cs; // 8 scalloped petals
      if (d > R) continue;
      s.d[y * n + x] =
        d < 1.8
          ? L.core
          : d > R - 1.1
            ? L.edge
            : d > 3 && cs < -0.8
              ? L.edge
              : d < 3.6
                ? L.lite
                : L.out;
    }
  return s;
}
function blit(s, x, y, sh) {
  for (let j = 0; j < s.h; j++) {
    const Y = y + j;
    if (Y < 0 || Y >= H) continue;
    for (let i = 0; i < s.w; i++) {
      const c = s.d[j * s.w + i];
      if (!c) continue;
      const X = x + i;
      if (X < 0 || X >= W) continue;
      const o = Y * W + X;
      buf[o] = sh ? dk(buf[o]) : c;
    }
  }
}
function buildScene() {
  pads.length = lotuses.length = weeds.length = 0;
  PADS.forEach(([fx, fy, r], i) => {
    const R = Math.round(r * U);
    pads.push({
      x: fx * W,
      y: fy * H,
      R,
      s: makePad(R, i * 31 + 7),
      p: i * 1.7,
      sx: 0,
      sy: 0,
    });
  });
  LOTUS.forEach(([pi, ox, oy], i) =>
    lotuses.push({
      pad: pads[pi],
      ox,
      oy,
      s: makeLotus(i + 5),
      p: i * 2.3,
    }),
  );
  // duckweed: loose green clusters around the pads and along the edges
  const r = rng(99),
    n = Math.round((W * H) / 190),
    cent = [];
  for (let i = 0; i < 14; i++) {
    const p = pads[(r() * pads.length) | 0],
      a = r() * 6.283;
    cent.push([p.x + Math.cos(a) * p.R * 1.1, p.y + Math.sin(a) * p.R * 1.1]);
  }
  for (let i = 0; i < 5; i++) cent.push([r() < 0.5 ? r() * W * 0.1 : W - r() * W * 0.1, r() * H]);
  for (let i = 0; i < n; i++) {
    const [cx, cy] = cent[(r() * cent.length) | 0],
      hx = cx + (r() + r() - 1) * 12,
      hy = cy + (r() + r() - 1) * 12;
    weeds.push({
      x: hx,
      y: hy,
      hx,
      hy,
      vx: 0,
      vy: 0,
      c: C.weed[(r() * 4) | 0],
      p: r() * 6.283,
    });
  }
}

/* Decorative ecosystem: all positions live in pond coordinates, no hit targets. */
// Counts control desktop/phone density. Fish speed is art pixels/second; flight/rest times are seconds.
const ECO = {
  schools: 3,
  phoneSchools: 2,
  fishPerSchool: 7,
  phoneFish: 5,
  butterflies: 3,
  phoneButterflies: 2,
  fishSpeed: 9,
  butterflyFlight: 9,
  butterflyRest: 15,
  fishColors: ["#EDAC95", "#E5D293", "#B9DAE7"],
  wingColors: ["#F3D67C", "#EEB397", "#BAC6EC"],
};
const ecoRandom = rng(813),
  schools = [],
  butterflies = [],
  petals = [];
let ecoTime = 0,
  ecoActivity = 1;
function ecosystemResize(ow, oh) {
  if (!schools.length) {
    for (let i = 0; i < ECO.schools; i++)
      schools.push({
        x: W * (0.25 + i * 0.24),
        y: H * (0.25 + i * 0.2),
        a: i * 2,
        tx: W * 0.5,
        ty: H * 0.5,
        t: 0,
        fish: Array.from({ length: ECO.fishPerSchool }, (_, j) => ({
          x: W * (0.25 + i * 0.24) + (j % 3) * 5,
          y: H * (0.25 + i * 0.2) + Math.floor(j / 3) * 5,
          a: i * 2,
          phase: ecoRandom() * 6.28,
        })),
      });
    for (let i = 0; i < ECO.butterflies; i++)
      butterflies.push({
        pad: [0, 3, 9][i],
        fromX: 0.2 + i * 0.28,
        fromY: 0.3,
        phase: i * 9,
        flight: false,
        x: 0,
        y: 0,
      });
  } else if (ow && oh) {
    for (const g of schools) {
      g.x *= W / ow;
      g.y *= H / oh;
      g.tx *= W / ow;
      g.ty *= H / oh;
      for (const f of g.fish) {
        f.x *= W / ow;
        f.y *= H / oh;
      }
    }
  }
  petals.length = 0;
  const r = rng(910);
  for (let i = 0; i < 22; i++) {
    const p = pads[[0, 3, 4, 7, 9, 10][i % 6]],
      a = r() * 6.28;
    petals.push({
      x: p.x + Math.cos(a) * (p.R + 3 + r() * 8),
      y: p.y + Math.sin(a) * (p.R + 3 + r() * 8),
      c: hexC(i % 3 ? "#DFA8AE" : "#D8DB93"),
    });
  }
}
function updateEcosystem(dt) {
  if (reduce) return;
  ecoActivity += ((selected ? 0.28 : 1) - ecoActivity) * (1 - Math.exp(-dt * 2));
  const realDt = dt;
  dt *= ecoActivity;
  ecoTime += dt;
  const phone = innerWidth < 600;
  for (const [i, g] of schools.entries()) {
    if (i >= (phone ? ECO.phoneSchools : ECO.schools)) continue;
    if ((g.t -= dt) <= 0 || Math.hypot(g.tx - g.x, g.ty - g.y) < 12) {
      g.tx = W * (0.16 + ecoRandom() * 0.68);
      g.ty = H * (0.18 + ecoRandom() * 0.64);
      g.t = 7 + ecoRandom() * 7;
    }
    g.a += angDiff(Math.atan2(g.ty - g.y, g.tx - g.x), g.a) * Math.min(1, dt * 0.65);
    g.x += Math.cos(g.a) * ECO.fishSpeed * dt;
    g.y += Math.sin(g.a) * ECO.fishSpeed * dt;
    for (const [j, f] of g.fish.entries()) {
      const along = -(j % 3) * 7,
        across = (Math.floor(j / 3) - 1) * 8;
      let tx =
        g.x +
        Math.cos(g.a) * along -
        Math.sin(g.a) * across +
        Math.sin(ecoTime * 0.6 + f.phase) * 3;
      let ty =
        g.y +
        Math.sin(g.a) * along +
        Math.cos(g.a) * across +
        Math.cos(ecoTime * 0.5 + f.phase) * 3;
      for (const k of koi) {
        const h = k.pts[0],
          dx = f.x - h.x,
          dy = f.y - h.y,
          d = Math.hypot(dx, dy);
        if (d < 22) {
          tx += (dx / (d || 1)) * (22 - d) * 2;
          ty += (dy / (d || 1)) * (22 - d) * 2;
        }
      }
      const reaction = f.reaction;
      if (reaction) {
        reaction.age += realDt;
        const weight = Math.max(0, 1 - reaction.age / REACTION.smallDuration);
        // Blend avoidance back into the moving school's target, never the click.
        const blend = Math.min(1, weight * 2);
        tx =
          tx * (1 - blend) +
          (f.x + reaction.x * REACTION.smallStrength * U * reaction.strength) * blend;
        ty =
          ty * (1 - blend) +
          (f.y + reaction.y * REACTION.smallStrength * U * reaction.strength) * blend;
        if (weight === 0) f.reaction = null;
      }
      const dx = tx - f.x,
        dy = ty - f.y,
        d = Math.hypot(dx, dy),
        targetSpeed = Math.min(
          reaction ? REACTION.smallMaxSpeed * U : ECO.fishSpeed * 1.7,
          d * 0.9,
        );
      const motionDt = reaction ? realDt : dt;
      f.speed =
        (f.speed ?? targetSpeed) +
        clamp(
          targetSpeed - (f.speed ?? targetSpeed),
          -REACTION.smallAcceleration * U * motionDt,
          REACTION.smallAcceleration * U * motionDt,
        );
      f.a += clamp(
        angDiff(Math.atan2(dy, dx), f.a) * (1 - Math.exp(-motionDt * 3)),
        -motionDt * 3,
        motionDt * 3,
      );
      f.x = Math.max(8, Math.min(W - 8, f.x + Math.cos(f.a) * f.speed * motionDt));
      f.y = Math.max(8, Math.min(H - 8, f.y + Math.sin(f.a) * f.speed * motionDt));
    }
  }
  for (const b of butterflies) {
    b.phase += dt;
    const duration = b.flight ? ECO.butterflyFlight : ECO.butterflyRest;
    if (b.phase > duration) {
      b.phase = 0;
      b.flight = !b.flight;
      if (b.flight) {
        const old = pads[b.pad];
        b.fromX = (old.x + old.sx) / W;
        b.fromY = (old.y + old.sy) / H;
        const targets = [0, 3, 4, 7, 9, 10];
        b.pad =
          targets[(targets.indexOf(b.pad) + 1 + Math.floor(ecoRandom() * 3)) % targets.length];
      }
    }
  }
}
function drawMinnows() {
  const phone = innerWidth < 600;
  for (const [i, g] of schools.entries()) {
    if (i >= (phone ? ECO.phoneSchools : ECO.schools)) continue;
    const c = mixC(hexC(ECO.fishColors[i]), C.water[3], 0.2);
    for (const [j, f] of g.fish.entries()) {
      if (j >= (phone ? ECO.phoneFish : ECO.fishPerSchool)) continue;
      const ca = Math.cos(f.a),
        sa = Math.sin(f.a),
        tail = Math.sin(ecoTime * 8 + f.phase);
      for (let u = -4; u <= 2; u++)
        for (let v = -1; v <= 1; v++) {
          if (u === 2 && v !== 0) continue;
          const lateral = v + (u < -2 ? tail : 0),
            x = Math.round(f.x + ca * u - sa * lateral),
            y = Math.round(f.y + sa * u + ca * lateral);
          put(x, y, u === 2 ? dk2(c) : v === -1 ? mixC(c, WHITE, 0.2) : c);
        }
    }
  }
}
function drawButterflies() {
  const phone = innerWidth < 600,
    rect = book.hidden ? null : book.getBoundingClientRect();
  for (const [i, b] of butterflies.entries()) {
    if (i >= (phone ? ECO.phoneButterflies : ECO.butterflies)) continue;
    const p = pads[b.pad],
      t = b.flight ? Math.min(1, b.phase / ECO.butterflyFlight) : 1,
      e = t * t * (3 - 2 * t);
    const x = b.flight
      ? b.fromX * W * (1 - e) + (p.x + p.sx) * e + Math.sin(t * Math.PI) * 12
      : p.x + p.sx;
    const y = b.flight
      ? b.fromY * H * (1 - e) + (p.y + p.sy) * e - Math.sin(t * Math.PI) * 18
      : p.y + p.sy;
    b.x = x;
    b.y = y;
    const sx = (x * camera.z + camera.x) * PXS,
      sy = (y * camera.z + camera.y) * PXS;
    // Keep flying silhouettes away from readable UI and the foreground motion pad.
    if (
      (rect &&
        sx > rect.left - 22 &&
        sx < rect.right + 22 &&
        sy > rect.top - 22 &&
        sy < rect.bottom + 22) ||
      (sx > innerWidth - 125 && sy < 150) ||
      (sy < (phone ? 125 : 105) && sx < 470)
    )
      continue;
    const wing = b.flight ? 1 + Math.round(2 * Math.abs(Math.sin(ecoTime * 13 + i))) : 2;
    const c = hexC(ECO.wingColors[i]);
    for (let v = -3; v <= 3; v++)
      for (let u = -wing; u <= wing; u++) {
        if (!u || (Math.abs(v) === 3 && Math.abs(u) > 1)) continue;
        const xx = Math.round(x + u),
          yy = Math.round(y + v);
        const shadowX = xx + 2,
          shadowY = yy + (b.flight ? 5 : 2);
        if (shadowX >= 0 && shadowX < W && shadowY >= 0 && shadowY < H)
          put(shadowX, shadowY, dk2(buf[shadowY * W + shadowX]));
      }
    for (let v = -3; v <= 3; v++)
      for (let u = -wing; u <= wing; u++) {
        if (Math.abs(v) === 3 && Math.abs(u) > 1) continue;
        put(
          Math.round(x + u),
          Math.round(y + v),
          !u ? C.pad.dark : Math.abs(v) > 1 ? c : mixC(c, WHITE, 0.3),
        );
      }
  }
}

/* ===== 6. Koi: a head that steers, a chain of body segments that follows, patterns painted from a seed ===== */
const PU = 28,
  PV = 11,
  NSEG = 12;
function paint(kind, seed) {
  // pattern texture: PU along the body x PV across
  const r = rng(seed),
    K = C.koi,
    b = kind === "ogon" ? K.gold : kind === "beni" ? K.orange : K.cream,
    c = new Uint32Array(PU * PV).fill(b);
  const blob = (cu, cv2, ru, rv, col) => {
    for (let u = 0; u < PU; u++)
      for (let v = 0; v < PV; v++) {
        const du = ((u + 0.5) / PU - cu) / ru,
          dv = (((v + 0.5) / PV) * 2 - 1 - cv2) / rv;
        if (du * du + dv * dv < 1) c[u * PV + v] = col;
      }
  };
  if (kind === "kohaku" || kind === "sanke") {
    const n = 3 + ((r() * 2) | 0);
    for (let i = 0; i < n; i++)
      blob(0.1 + 0.55 * r(), (r() - 0.5) * 0.8, 0.07 + 0.1 * r(), 0.35 + 0.4 * r(), K.red);
  }
  if (kind === "sanke")
    for (let i = 0; i < 4; i++)
      blob(0.12 + 0.6 * r(), (r() - 0.5) * 1.4, 0.035 + 0.04 * r(), 0.15 + 0.15 * r(), K.black);
  if (kind === "tancho") blob(0.1, 0, 0.065, 0.6, K.red); // single red spot on the head
  if (kind === "ogon" || kind === "beni")
    for (let i = 0; i < 8; i++) blob(r(), (r() - 0.5) * 1.6, 0.04, 0.14, mixC(b, WHITE, 0.3)); // scale shimmer
  return { c, b };
}
function makeKoi(p, i) {
  const r = rng(p.seed * 977 + i),
    a = r() * 6.283,
    { c, b } = paint(p.kind, p.seed),
    warm = p.kind === "ogon" || p.kind === "beni",
    RS = CONFIG.restless;
  const k = {
    i,
    name: p.name,
    tools: p.tools,
    s: 0.92 + r() * 0.22,
    koiScale: Number.isFinite(p.koiScale) ? clamp(p.koiScale, 0.75, 1.4) : 1,
    z: r() * 0.5,
    zt: r() * 0.6,
    zc: 2 + r() * 6,
    a,
    sp: 0,
    ph: r() * 6.283,
    amp: 1 + r() * 0.5,
    ampE: 1.2,
    cruise: 13 + r() * 9,
    drag: 0.55 + r() * 0.6,
    kr: 0.9 + r() * 1.4,
    kt: r() * 1.5,
    kick: 0,
    bold: 0.1 + r() * 0.3, // personal rhythm: speed, glide length, kick spacing
    ft: (2 + r() * 6) / RS,
    fl: 0,
    fa: 0,
    det: 0,
    dtT: (6 + r() * 20) / RS,
    dx: 0,
    dy: 0,
    df: null,
    p1: r() * 6.283,
    p2: r() * 6.283,
    idle: false,
    rt: makeRoute(i, r),
    orb: r() < 0.5 ? 1 : -1,
    hov: false,
    c,
    fin: mixC(b, warm ? WHITE : C.water[6], 0.4),
    pts: [],
  };
  const [px, py] =
      k.rt.kind === "hop" ? [W * (0.2 + 0.6 * r()), H * (0.2 + 0.6 * r())] : routePoint(k.rt),
    L = 3.3 * koiUnit(k);
  for (let j = 0; j < NSEG; j++)
    k.pts.push({
      x: px - Math.cos(a) * L * j,
      y: py - Math.sin(a) * L * j,
    });
  containKoi(k);
  return k;
}
/* Every koi has its own route, rhythm and mood. The route is a path the koi chases a "carrot" along; the koi never
follows it exactly, because flicks, detours and burst-and-glide swimming keep knocking it off and it swims back. */
const ROUTES = ["patrol", "edge", "drift", "shuttle", "hop", "pads"],
  LISS = [
    [2, 3],
    [3, 4],
    [1, 2],
    [3, 2],
    [2, 1],
    [4, 3],
    [5, 4],
    [1, 3],
  ];
function makeRoute(i, r) {
  const R = {
    kind: ROUTES[i % ROUTES.length],
    u: r() * 6.283,
    w: (0.16 + r() * 0.16) * (r() < 0.5 ? 1 : -1),
    a: 0.28 + r() * 0.12,
    b: 0.24 + r() * 0.12,
    ph: r() * 6.283,
    lin: 0,
    wp: null,
    arrived: false,
  };
  [R.fx, R.fy] = LISS[(r() * LISS.length) | 0];
  R.A = [0.18 + r() * 0.2, 0.2 + r() * 0.6];
  R.B = [0.62 + r() * 0.2, 0.2 + r() * 0.6]; // shuttle ends (fractions of the pond)
  R.pi = (r() * PADS.length) | 0;
  R.pj = (R.pi + 3 + ((r() * 6) | 0)) % PADS.length; // the two pads a "pads" koi commutes between
  return R;
}
function routePoint(R) {
  const u = R.u,
    c = Math.cos(u),
    s = Math.sin(u),
    sg = Math.sign;
  switch (R.kind) {
    case "patrol":
      return [W * (0.5 + R.a * Math.sin(R.fx * u + R.ph)), H * (0.5 + R.b * Math.sin(R.fy * u))]; // big Lissajous loop
    case "edge":
      return [
        W * (0.5 + 0.4 * sg(c) * Math.pow(Math.abs(c), 0.55)),
        H * (0.5 + 0.38 * sg(s) * Math.pow(Math.abs(s), 0.55)),
      ]; // laps round the margins
    case "drift":
      return [W * (0.5 + 0.16 * s), H * (0.5 + 0.14 * Math.sin(2 * u + R.ph))]; // small figure-eight in the middle
    case "shuttle": {
      const t = 0.5 + 0.5 * Math.sin(u * 0.8);
      return [
        W * (R.A[0] + (R.B[0] - R.A[0]) * t),
        H * (R.A[1] + (R.B[1] - R.A[1]) * t + 0.05 * Math.sin(u * 2.3 + R.ph)),
      ];
    }
    default: {
      const p = pads[R.pi],
        q = pads[R.pj],
        t = 0.5 + 0.5 * Math.sin(u * 0.7);
      return [(p.x + (q.x - p.x) * t) * 0.8 + W * 0.1, (p.y + (q.y - p.y) * t) * 0.8 + H * 0.1];
    } // pad to pad
  }
}
function routeTarget(k, dt) {
  // where this koi is heading right now
  const R = k.rt,
    h = k.pts[0];
  if (k.det > 0) {
    k.det -= dt;
    if (k.det <= 0) k.dtT = (9 + Math.random() * 20) / CONFIG.restless;
    return k.df ? [k.df.pts[3].x, k.df.pts[3].y] : [k.dx, k.dy];
  } // detour: wander off route, or trail another koi
  k.dtT -= dt;
  if (k.dtT <= 0 && !k.reaction) {
    k.det = 3 + Math.random() * 5;
    const o = koi[(Math.random() * koi.length) | 0];
    if (o !== k && Math.random() < 0.4) k.df = o;
    else {
      k.df = null;
      k.dx = W * (0.12 + Math.random() * 0.76);
      k.dy = H * (0.14 + Math.random() * 0.72);
    }
  }
  if (R.kind === "hop") {
    // waypoint hopper: swim, linger, pick somewhere new
    if (R.lin > 0) {
      R.lin -= dt;
      k.idle = true;
    } else if (!R.wp || Math.hypot(R.wp[0] - h.x, R.wp[1] - h.y) < 10 * U) {
      if (R.wp && !R.arrived) {
        R.arrived = true;
        R.lin = 1.5 + Math.random() * 3.5;
      } else {
        R.wp = [W * (0.12 + Math.random() * 0.76), H * (0.14 + Math.random() * 0.72)];
        R.arrived = false;
      }
    }
    return R.wp || [h.x, h.y];
  }
  const [tx, ty] = routePoint(R),
    d = Math.hypot(tx - h.x, ty - h.y),
    PL = 34 * U;
  if (d < PL) R.u += R.w * dt * (1 + 3 * (1 - d / PL)) * (1 + 0.35 * Math.sin(T * 0.13 + R.ph)); // the carrot only moves on while the koi is near it
  return [tx, ty];
}
// Click reactions use pond art units; only locally affected fish own a response.
// Distances/speeds/accelerations scale by U. Times are seconds; turn rates are radians/second.
const REACTION = {
  koiRadius: 88,
  smallRadius: 54,
  scatterStrength: 42,
  scatterDuration: 0.78,
  returnDuration: 3.4,
  gatherSpread: 22,
  holdTime: 1.5,
  releaseTime: 1,
  maxSpeed: 46,
  maxAcceleration: 55,
  maxTurnRate: 3.2,
  smallStrength: 36,
  smallDuration: 2.2,
  smallMaxSpeed: 26,
  smallAcceleration: 45,
};
function koiUnit(k) {
  return k.s * (k.koiScale ?? 1) * U * (1 - 0.22 * k.z);
}
function koiClearance(k) {
  return Math.max(18 * U, 16 * koiUnit(k));
}
function containKoi(k) {
  // Shift the whole skeleton at an edge; never clamp individual joints and distort the fish.
  const pad = (6 + 1.6 * k.ampE) * koiUnit(k) + 3;
  let left = Infinity,
    right = -Infinity,
    top = Infinity,
    bottom = -Infinity;
  for (const p of k.pts) {
    left = Math.min(left, p.x);
    right = Math.max(right, p.x);
    top = Math.min(top, p.y);
    bottom = Math.max(bottom, p.y);
  }
  const dx = left < pad ? pad - left : right > W - pad ? W - pad - right : 0;
  const dy = top < pad ? pad - top : bottom > H - pad ? H - pad - bottom : 0;
  if (dx || dy)
    for (const p of k.pts) {
      p.x += dx;
      p.y += dy;
    }
}
function reactToWater(x, y) {
  if (reduce) return;
  for (const k of koi) {
    if (k === selected) continue;
    const h = k.pts[0],
      distance = Math.hypot(h.x - x, h.y - y),
      radius = REACTION.koiRadius * U;
    if (distance > radius) continue;
    const proximity = 1 - distance / radius,
      angle = (distance > 0.1 ? Math.atan2(h.y - y, h.x - x) : k.a) + (Math.random() - 0.5) * 0.5;
    const slot = k.i * 2.39996,
      spread = REACTION.gatherSpread * U * (0.65 + (k.i % 3) * 0.2),
      margin = koiClearance(k);
    k.reaction = {
      age: 0,
      awayX: Math.cos(angle),
      awayY: Math.sin(angle),
      proximity,
      x: clamp(x + Math.cos(slot) * spread, margin, W - margin),
      y: clamp(y + Math.sin(slot) * spread, margin, H - margin),
      scatter: REACTION.scatterDuration * (0.75 + Math.random() * 0.5),
      returnTime: REACTION.returnDuration * (0.85 + Math.random() * 0.3),
      hold: REACTION.holdTime * (0.8 + Math.random() * 0.4),
    };
    k.fl = 0;
    k.det = 0;
    k.df = null;
    k.hov = false;
    k.kt = 1;
    k.ft = 2;
  }
  for (const [i, g] of schools.entries()) {
    if (i >= (innerWidth < 600 ? ECO.phoneSchools : ECO.schools)) continue;
    for (const [j, f] of g.fish.entries()) {
      if (j >= (innerWidth < 600 ? ECO.phoneFish : ECO.fishPerSchool)) continue;
      const d = Math.hypot(f.x - x, f.y - y);
      if (d > REACTION.smallRadius * U) continue;
      const a = (d > 0.1 ? Math.atan2(f.y - y, f.x - x) : f.a) + (Math.random() - 0.5) * 0.65;
      f.reaction = {
        age: 0,
        x: Math.cos(a),
        y: Math.sin(a),
        strength: 0.45 + 0.55 * (1 - d / (REACTION.smallRadius * U)),
      };
    }
  }
}
// A single age counter advances scatter -> return -> hold -> release; new clicks replace this state.
function koiReaction(k, dt, routeX, routeY) {
  const r = k.reaction;
  if (!r) return null;
  r.age += dt;
  const h = k.pts[0],
    returnEnd = r.scatter + r.returnTime,
    holdEnd = returnEnd + r.hold;
  let x = r.x,
    y = r.y,
    speed;
  if (r.age < r.scatter) {
    x = h.x + r.awayX * 60 * U;
    y = h.y + r.awayY * 60 * U;
    speed = REACTION.scatterStrength * U * (0.6 + 0.4 * r.proximity);
  } else {
    const d = Math.hypot(x - h.x, y - h.y);
    speed = Math.min(REACTION.maxSpeed * U, (d / Math.max(0.45, returnEnd - r.age)) * 1.45);
    if (r.age >= returnEnd) speed = Math.min(14 * U, d * 1.6);
    if (r.age > holdEnd) {
      const blend = clamp((r.age - holdEnd) / REACTION.releaseTime, 0, 1);
      x += (routeX - x) * blend;
      y += (routeY - y) * blend;
      speed += (k.cruise * U - speed) * blend;
      if (blend === 1) {
        k.reaction = null;
        k.kt = 0.6;
        k.ft = 2;
      }
    }
  }
  return { x, y, speed };
}
function clearReactions() {
  for (const k of koi) k.reaction = null;
  for (const g of schools) for (const f of g.fish) f.reaction = null;
}
function updateKoi(k, dt) {
  if (k === selected) {
    updateFocusedKoi(k, dt);
    return;
  }
  const P = k.pts,
    h = P[0],
    sc = koiUnit(k),
    RS = CONFIG.restless;
  k.idle = false;
  k.zc -= dt;
  if (k.zc <= 0) {
    k.zt = Math.random() < 0.3 ? Math.random() * 0.2 : 0.3 + Math.random() * 0.6;
    k.zc = 5 + Math.random() * 9;
  } // depth drift
  k.z += (k.zt - k.z) * Math.min(1, dt * 0.45);
  const [routeX, routeY] = routeTarget(k, dt),
    response = koiReaction(k, dt, routeX, routeY),
    tx = response ? response.x : routeX,
    ty = response ? response.y : routeY,
    sx = tx - h.x,
    sy = ty - h.y,
    sd = Math.hypot(sx, sy) || 1,
    nz = 0.9 * Math.sin(T * 0.53 + k.p1) + 0.6 * Math.sin(T * 0.91 + k.p2);
  // steering: own route + smooth S-curves + stay in the pond + very loose boids + sporadic flicks + local click reactions
  let dx = (sx / sd) * (response ? 3 : 1.3) + Math.cos(k.a + nz * 0.55) * (response ? 0 : 0.6),
    dy = (sy / sd) * (response ? 3 : 1.3) + Math.sin(k.a + nz * 0.55) * (response ? 0 : 0.6);
  const m = Math.max(20 * U, koiClearance(k));
  if (h.x < m) dx += ((m - h.x) / m) * 2.4;
  else if (h.x > W - m) dx -= ((h.x - W + m) / m) * 2.4;
  if (h.y < m) dy += ((m - h.y) / m) * 2.4;
  else if (h.y > H - m) dy -= ((h.y - H + m) / m) * 2.4;
  for (const o of koi) {
    if (o === k || Math.abs(o.z - k.z) > 0.45) continue; // koi at very different depths ignore each other
    const ex = h.x - o.pts[0].x,
      ey = h.y - o.pts[0].y,
      d = Math.hypot(ex, ey) || 1,
      sr = Math.max((o === selected ? 45 : 15) * U, 8 * (koiUnit(k) + koiUnit(o)));
    if (d < sr) {
      dx += (((ex / d) * (sr - d)) / sr) * 2.8;
      dy += (((ey / d) * (sr - d)) / sr) * 2.8;
    } // separation
    else if (!response && d < 60 * U) {
      dx += (-ex / d) * 0.05 + Math.cos(o.a) * 0.07;
      dy += (-ey / d) * 0.05 + Math.sin(o.a) * 0.07;
    }
  } // faint cohesion + alignment
  k.ft -= dt;
  if (k.ft <= 0 && !k.reaction && !k.hov && !k.idle) {
    k.ft = (2.5 + Math.random() * 6.5) / RS;
    k.fl = 0.5; // flick: a sudden turn plus a burst
    k.fa = k.a + (Math.random() < 0.5 ? -1 : 1) * (0.7 + Math.random() * 1.5);
    k.sp += k.cruise * U * 0.8;
    k.kick = 1;
  }
  if (k.fl > 0) {
    k.fl -= dt;
    dx += Math.cos(k.fa) * 3.4;
    dy += Math.sin(k.fa) * 3.4;
  }
  // speed: burst-and-glide. Tail kicks add speed and drag bleeds it off, so koi pulse forward instead of cruising evenly
  const cr = k.cruise * U * CONFIG.koiSpeed * (reduce ? 0.15 : 1) * (1 - 0.2 * k.z),
    still = k.hov || k.idle;
  const previousSpeed = k.sp;
  k.kt -= dt * RS;
  if (!response && k.kt <= 0 && !still) {
    k.sp +=
      cr * k.drag * k.kr * (0.7 + Math.random() * 0.6) * (Math.random() < k.bold * RS ? 1.7 : 1);
    k.kick = 1;
    k.kt = k.kr * (0.55 + Math.random() * 0.9);
  }
  k.sp *= Math.exp(-dt * k.drag * (still ? 3 : 1));
  k.sp = Math.min(k.sp, cr * 2.8);
  if (!still) k.sp = Math.max(k.sp, cr * 0.14);
  if (response) {
    const target = Math.min(REACTION.maxSpeed * U, response.speed),
      change = REACTION.maxAcceleration * U * dt;
    k.sp = previousSpeed + clamp(target - previousSpeed, -change, change);
    k.kick = Math.min(1, k.sp / (REACTION.maxSpeed * U));
  }
  k.kick *= Math.exp(-dt * 2.6);
  const mt = response
    ? dt * REACTION.maxTurnRate
    : dt * (0.7 + 1.6 * Math.min(1, k.sp / cr)) * (k.fl > 0 ? 3.2 : 1); // slow koi turn in wide arcs, bursting koi turn sharply
  k.a += Math.max(-mt, Math.min(mt, angDiff(Math.atan2(dy, dx), k.a) * Math.min(1, dt * 3.5)));
  h.x = Math.max(1, Math.min(W - 2, h.x + Math.cos(k.a) * k.sp * dt));
  h.y = Math.max(1, Math.min(H - 2, h.y + Math.sin(k.a) * k.sp * dt));
  const L = 3.3 * sc; // each segment trails the one in front
  for (let i = 1; i < P.length; i++) {
    const a = P[i - 1],
      b = P[i];
    let vx = b.x - a.x,
      vy = b.y - a.y;
    const d = Math.hypot(vx, vy) || 1;
    b.x = a.x + (vx / d) * L;
    b.y = a.y + (vy / d) * L;
  }
  containKoi(k);
  k.ph += dt * (1.6 + (k.sp / cr) * 1.4 + k.kick * 3.2) * 1.9; // the tail beats faster in a burst
  k.ampE +=
    ((0.35 + 0.65 * Math.min(1.4, k.sp / cr) + 0.5 * k.kick) * k.amp - k.ampE) *
    Math.min(1, dt * 5);
  if (k.z < 0.5 && !reduce) {
    const i = (h.y | 0) * W + (h.x | 0);
    hA[i] += k.sp * 0.05 * (1 - k.z * 2);
  } // surface koi leave a faint wake
}
/* Koi rendering: sample the segmented body and apply its seeded pigment pattern. */
function renderKoi(k, shadow) {
  const P = k.pts,
    N = P.length,
    M = (N - 1) * 6,
    sc = koiUnit(k),
    W0 = 3.7 * sc,
    f = 1 - 0.42 * k.z,
    m = 0.08 + 0.42 * k.z,
    sid = ++stampId;
  for (let j = M; j >= 0; j--) {
    // tail first so the head ends up on top
    const t = j / M,
      ft = t * (N - 1),
      i = Math.min(N - 2, ft | 0),
      g = ft - i,
      a = P[i],
      b = P[i + 1];
    let tx = b.x - a.x,
      ty = b.y - a.y;
    const l = Math.hypot(tx, ty) || 1;
    tx /= l;
    ty /= l;
    const nx = -ty,
      ny = tx,
      wob = Math.sin(k.ph - t * 6) * k.ampE * t * t * sc * 1.6,
      cx = a.x + (b.x - a.x) * g + nx * wob,
      cy = a.y + (b.y - a.y) * g + ny * wob,
      body = t < 0.72,
      tf = (t - 0.72) / 0.28,
      w =
        W0 *
        (body
          ? 0.18 + 0.82 * Math.sin(Math.PI * Math.pow(t / 0.72, 0.62))
          : 0.18 + 1.05 * Math.pow(tf, 0.85) * (1 - 0.3 * tf));
    for (let q = -w; q <= w; q += 0.5) {
      const X = Math.round(cx + nx * q) + (shadow ? Math.round(2 * sc) : 0),
        Y = Math.round(cy + ny * q) + (shadow ? Math.round(3 * sc) : 0);
      if (X < 0 || Y < 0 || X >= W || Y >= H) continue;
      const o = Y * W + X;
      if (shadow) {
        if (stamp[o] !== sid) {
          stamp[o] = sid;
          buf[o] = dk2(buf[o]);
        }
        continue;
      }
      let c;
      if (body) {
        const u = Math.min(PU - 1, ((t / 0.72) * PU) | 0),
          v = Math.min(PV - 1, Math.max(0, (((q / w) * 0.5 + 0.5) * PV) | 0));
        c = dep(k.c[u * PV + v], m, Math.abs(q) > w * 0.7 ? f * 0.82 : f);
      } // darker edges round the body
      else {
        if (tf > 0.8 && Math.abs(q) < (tf - 0.8) * w * 1.6) continue;
        if (tf > 0.35 && (X + Y) & 1) continue;
        c = dep(k.fin, m, f);
      } // forked, dithered tail
      buf[o] = c;
    }
  }
  if (shadow) return;
  if (k.z < 0.6) {
    const hx = P[0].x - P[1].x,
      hy = P[0].y - P[1].y,
      l = Math.hypot(hx, hy) || 1; // eyes
    for (const sd of [-1, 1])
      put(
        Math.round(P[0].x - (hx / l) * 2 * sc - (hy / l) * sd * W0 * 0.55),
        Math.round(P[0].y - (hy / l) * 2 * sc + (hx / l) * sd * W0 * 0.55),
        dep(C.koi.black, m, f),
      );
  }
  const o = P[2],
    fx = P[3].x - P[1].x,
    fy = P[3].y - P[1].y,
    fl = Math.hypot(fx, fy) || 1,
    fw = 1 + 0.5 * Math.sin(k.ph * 0.8); // pectoral fins
  for (const sd of [-1, 1])
    for (let q = 1; q <= 4; q++) {
      const e = W0 * 0.8 + q * 0.7 * fw * sc,
        X = Math.round(o.x - (fy / fl) * sd * e + (fx / fl) * q * 0.9 * sc),
        Y = Math.round(o.y + (fx / fl) * sd * e + (fy / fl) * q * 0.9 * sc);
      if (!((X + Y) & 1)) put(X, Y, dep(k.fin, m, f));
    }
}
function pick(x, y) {
  // Distance to the bent, animated body, rather than broad circles around its joints.
  // A modest CSS-pixel tolerance remains constant through zoom; closest surface wins.
  let best = null,
    bestDistance = Infinity,
    bestCenter = Infinity;
  const tolerance = 6 / (PXS * camera.z);
  for (const k of koi) {
    const sc = koiUnit(k),
      count = (k.pts.length - 1) * 6;
    for (let j = 0; j <= count; j++) {
      const t = j / count,
        ft = t * (k.pts.length - 1);
      const i = Math.min(k.pts.length - 2, Math.floor(ft)),
        g = ft - i;
      const a = k.pts[i],
        b = k.pts[i + 1];
      const length = Math.hypot(b.x - a.x, b.y - a.y) || 1;
      const wob = Math.sin(k.ph - t * 6) * k.ampE * t * t * sc * 1.6;
      const cx = a.x + (b.x - a.x) * g - ((b.y - a.y) / length) * wob;
      const cy = a.y + (b.y - a.y) * g + ((b.x - a.x) / length) * wob;
      const tf = (t - 0.72) / 0.28;
      const width =
        3.7 *
        sc *
        (t < 0.72
          ? 0.18 + 0.82 * Math.sin(Math.PI * Math.pow(t / 0.72, 0.62))
          : 0.18 + 1.05 * Math.pow(tf, 0.85) * (1 - 0.3 * tf));
      const centerDistance = Math.hypot(x - cx, y - cy);
      const distance = Math.max(0, centerDistance - width);
      if (
        distance <= tolerance &&
        (distance < bestDistance || (distance === bestDistance && centerDistance < bestCenter))
      ) {
        best = k;
        bestDistance = distance;
        bestCenter = centerDistance;
      }
    }
  }
  return best;
}

/* ===== 7. Simulation step and drawing ===== */
const MOTION_PAD = 6;
let padHovered = false,
  padFocused = false,
  padHeld = false;
function drawMotionPad() {
  const p = pads[MOTION_PAD];
  if (!p) return;
  const x = Math.round((innerWidth - 48) / PXS) + p.sx,
    y = Math.round(40 / PXS) + p.sy;
  // Foreground pond layer: same sprite and blitter, independent of the fish camera.
  buf.set(new Uint32Array(ctx.getImageData(0, 0, W, H).data.buffer));
  const left = x - (p.s.w >> 1),
    top = y - (p.s.h >> 1);
  blit(p.s, left + 2, top + 3, 1);
  for (let j = 0; j < p.s.h; j++)
    for (let i = 0; i < p.s.w; i++) {
      const color = p.s.d[j * p.s.w + i];
      if (color)
        put(
          left + i,
          top + j,
          shadeCloud(
            color,
            cloudAt((left + i - camera.x) / camera.z, (top + j - camera.y) / camera.z),
          ),
        );
    }
  for (const [dx, dy] of [
    [-2, -3],
    [-1, -3],
    [0, -3],
    [1, -3],
    [2, -2],
    [3, -1],
    [3, 0],
    [2, 1],
    [1, 2],
    [0, 2],
    [-1, 2],
    [-2, 1],
    [-3, 0],
    [-3, -1],
    [-2, -2],
  ])
    put(
      x + dx,
      y + dy,
      shadeCloud(
        0xffd4e9ee,
        cloudAt((x + dx - camera.x) / camera.z, (y + dy - camera.y) / camera.z),
      ),
    );
  ctx.putImageData(img, 0, 0);
  const button = $("motion"),
    size = Math.max(44, p.s.w * PXS);
  button.style.left = x * PXS - size / 2 + "px";
  button.style.top = y * PXS - size / 2 + "px";
  button.style.width = size + "px";
  button.style.height = size + "px";
}
function step(dt) {
  updateCloudField(dt);
  updateCamera(dt);
  updateBoat(dt);
  flushWake(dt);
  updateEcosystem(dt);
  T += dt;
  for (let i = pend.length; i--; ) {
    const q = pend[i];
    if ((q.t -= dt) <= 0) {
      splat(q.x, q.y, q.a);
      pend.splice(i, 1);
    }
  }
  acc += dt;
  for (let n = 0; acc >= 1 / CONFIG.waveHz && n < 3; n++) {
    waveStep();
    acc -= 1 / CONFIG.waveHz;
  }
  acc = Math.min(acc, 0.1);
  for (const k of koi) if (!reduce) updateKoi(k, dt);
  const m = reduce ? 0 : 1,
    damp = Math.pow(0.2, dt);
  for (const p of pads) {
    if (reduce || (p === pads[MOTION_PAD] && (padHovered || padFocused || padHeld))) continue;
    p.sx = Math.round(Math.sin(T * 0.5 + p.p) * 1.2 * m);
    p.sy = Math.round(Math.cos(T * 0.4 + p.p) * 1.2 * m);
  }
  for (const w of weeds) {
    // duckweed drifts home and gets nudged by koi
    if (reduce) continue;
    w.vx += (Math.sin(T * 0.4 + w.p) * 3 + (w.hx - w.x)) * dt * m;
    w.vy += (Math.cos(T * 0.33 + w.p * 1.3) * 3 + (w.hy - w.y)) * dt * m;
    for (const k of koi) {
      if (k.z > 0.5) continue;
      const q = k.pts[0],
        dx = w.x - q.x,
        dy = w.y - q.y,
        d = Math.hypot(dx, dy);
      if (d < 9) {
        const f = (9 - d) * 35 * dt;
        w.vx += (dx / (d || 1)) * f;
        w.vy += (dy / (d || 1)) * f;
      }
    }
    w.vx *= damp;
    w.vy *= damp;
    w.x += w.vx * dt;
    w.y += w.vy * dt;
  }
}
function draw() {
  drawWater();
  drawMinnows();
  const order = koi.slice().sort((a, b) => b.z - a.z); // deepest first
  for (const k of order) if (k.z < 0.75) renderKoi(k, true);
  for (const k of order) renderKoi(k, false);
  for (const w of weeds) put(Math.round(w.x), Math.round(w.y), w.c);
  for (const p of pads)
    if (p !== pads[MOTION_PAD])
      blit(
        p.s,
        Math.round(p.x - (p.s.w >> 1) + p.sx) + 2,
        Math.round(p.y - (p.s.h >> 1) + p.sy) + 3,
        1,
      ); // pad shadows
  for (const p of pads)
    if (p !== pads[MOTION_PAD])
      blit(p.s, Math.round(p.x - (p.s.w >> 1) + p.sx), Math.round(p.y - (p.s.h >> 1) + p.sy), 0);
  for (const l of lotuses) {
    const p = l.pad,
      x = Math.round(p.x + l.ox * p.R + p.sx - (l.s.w >> 1)),
      y = Math.round(
        p.y + l.oy * p.R + p.sy - (l.s.h >> 1) + (reduce ? 0 : Math.sin(T * 1.1 + l.p)),
      );
    blit(l.s, x + 1, y + 2, 1);
    blit(l.s, x, y, 0);
  }
  for (const p of petals) {
    put(Math.round(p.x), Math.round(p.y), p.c);
    put(Math.round(p.x) + 1, Math.round(p.y), p.c);
  }
  for (const i of [1, 5, 7, 10]) {
    const p = pads[i],
      x = Math.round(p.x + p.sx + p.R * 0.3),
      y = Math.round(p.y + p.sy);
    put(x, y + 2, C.pad.lite);
    put(x, y, C.lotus.out);
    put(x - 1, y, C.lotus.lite);
    put(x, y - 1, C.lotus.core);
  }
  drawButterflies();
  // Shade scenery, then redraw the featured koi at full brightness above the pads.
  if (camera.shade > 0) {
    for (let i = 0; i < buf.length; i++) buf[i] = mixC(buf[i], C.water[0], camera.shade);
  }
  if (selected) renderKoi(selected, false);
  // Cloud illumination affects each world pixel once, including the focused koi.
  for (let i = 0; i < buf.length; i++)
    if (cloudMask[i] > 0.001) buf[i] = shadeCloud(buf[i], cloudMask[i]);
  shadeCloudObjects();
  sceneCtx.putImageData(img, 0, 0);
  ctx.setTransform(camera.z, 0, 0, camera.z, camera.x, camera.y);
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(scene, 0, 0);
  ctx.resetTransform();
  drawMotionPad();
}

/* ===== 8. Project selection and a fixed camera (never chase the swimming head) ===== */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const ease = (t) => t * t * (3 - 2 * t);
function focusLayout() {
  const mobile = innerWidth <= 700 && innerHeight > 480;
  const book = $("book"),
    inset = 12 / PXS;
  const left = inset,
    // Leave the world-anchored dock to the right of the phone's viewing strip.
    right = mobile ? Math.min(W - inset, dockWorld.x - inset) : book.offsetLeft / PXS - inset;
  const top = (mobile ? 16 : 64) / PXS;
  const bottom = mobile ? book.offsetTop / PXS - inset : H - inset;
  return {
    x: (left + right) / 2,
    y: (top + bottom) / 2,
    width: right - left,
    height: bottom - top,
    mobile,
  };
}
function setCamera(target, instant = false) {
  camera.from = {
    x: camera.x,
    y: camera.y,
    z: camera.z,
    shade: camera.shade,
  };
  camera.to = target;
  camera.elapsed = 0;
  if (instant || reduce) {
    Object.assign(camera, target);
    camera.from = null;
  }
}
function updateCamera(dt) {
  if (!camera.from) return;
  camera.elapsed += dt * 1000;
  const t = ease(clamp(camera.elapsed / CONFIG.cameraDuration, 0, 1));
  for (const key of ["x", "y", "z", "shade"])
    camera[key] = camera.from[key] + (camera.to[key] - camera.from[key]) * t;
  if (t === 1) camera.from = null;
}
function prepareFocus(instant = false) {
  const k = selected,
    // Center the whole silhouette, not the front third, when fitting large koi.
    center = {
      x: (Math.min(...k.pts.map((p) => p.x)) + Math.max(...k.pts.map((p) => p.x))) / 2,
      y: (Math.min(...k.pts.map((p) => p.y)) + Math.max(...k.pts.map((p) => p.y))) / 2,
    },
    layout = focusLayout(),
    points = k.pts.map((p) => ({ x: p.x - center.x, y: p.y - center.y })),
    // On phones settle the fish along the short horizontal viewing strip.
    settleAngle = layout.mobile
      ? angDiff(0, Math.atan2(k.pts[0].y - k.pts[11].y, k.pts[0].x - k.pts[11].x))
      : 0,
    cs = Math.cos(settleAngle),
    sn = Math.sin(settleAngle),
    pad = (6 + 1.6 * Math.max(k.ampE, 0.45)) * koiUnit(k) + 3,
    glide = CONFIG.focusGlide * U;
  let rx = 0,
    ry = 0;
  for (const p of points) {
    const x = p.x * cs - p.y * sn,
      y = p.x * sn + p.y * cs;
    // Include the gentle +/-0.12-radian focused turn in the fitting envelope.
    rx = Math.max(rx, Math.abs(x) + Math.abs(y) * 0.12);
    ry = Math.max(ry, Math.abs(y) + Math.abs(x) * 0.12);
  }
  const z = Math.max(
    1,
    Math.min(
      CONFIG.cameraZoom,
      layout.width / (2 * (rx + pad + glide)),
      layout.height / (2 * (ry + pad + glide)),
    ),
  );
  // Clamp the camera to the pond. A koi near an edge settles into the nearest
  // readable framing, instead of exposing blank space beyond the canvas.
  const anchor = {
    x: clamp(center.x, layout.x / z, (layout.x + W * (z - 1)) / z),
    y: clamp(center.y, layout.y / z, (layout.y + H * (z - 1)) / z),
  };
  const dockBottom = dockWorld.height + 24 / PXS;
  const overlapsDock =
    anchor.x + rx + pad + glide > dockWorld.x &&
    anchor.x - rx - pad - glide < dockWorld.x + dockWorld.width &&
    anchor.y - ry - pad - glide < dockBottom;
  // Keep the selected silhouette clear of the HTML dock, including on short screens.
  if (
    !layout.mobile &&
    overlapsDock &&
    dockBottom + ry + pad + glide <= (layout.y + H * (z - 1)) / z
  ) {
    anchor.y = dockBottom + ry + pad + glide;
  } else if (layout.mobile || overlapsDock) {
    anchor.x = Math.max(layout.x / z, Math.min(anchor.x, dockWorld.x - rx - pad - glide - 8 / PXS));
  }
  focusPose = {
    origin: { x: center.x, y: center.y },
    anchor,
    points,
    settleAngle,
    angle: k.a,
    time: 0,
  };
  setCamera(
    {
      x: layout.x - anchor.x * z,
      y: layout.y - anchor.y * z,
      z,
      shade: 0.38,
    },
    instant,
  );
  if (instant || reduce) {
    focusPose.time = CONFIG.cameraDuration / 1000;
    updateFocusedKoi(k, 0);
  }
}
function updateFocusedKoi(k, dt) {
  const f = focusPose;
  if (!f) return;
  f.time += dt;
  const t = ease(clamp((f.time * 1000) / CONFIG.cameraDuration, 0, 1));
  const phase = reduce ? 0 : f.time * 0.45,
    turn = f.settleAngle * t + Math.sin(phase) * 0.12;
  const x = f.origin.x + (f.anchor.x - f.origin.x) * t + Math.sin(phase) * CONFIG.focusGlide * U;
  const y =
    f.origin.y + (f.anchor.y - f.origin.y) * t + Math.sin(phase * 0.7) * CONFIG.focusGlide * U;
  const cs = Math.cos(turn),
    sn = Math.sin(turn);
  k.pts.forEach((p, i) => {
    const q = f.points[i];
    p.x = x + q.x * cs - q.y * sn;
    p.y = y + q.x * sn + q.y * cs;
  });
  k.a = f.angle + turn;
  k.ph += dt * 0.9;
  k.ampE += (0.45 - k.ampE) * Math.min(1, dt * 3);
}
function releaseKoi() {
  if (selected) {
    selected.reaction = null;
    selected.sp = selected.cruise * U * 0.45;
    selected.fl = 0;
    selected.hov = false;
    selected.ft = 3;
    selected.kt = 0.6;
    selected.det = 0;
    selected.df = null;
  }
  selected = null;
  focusPose = null;
}
// The journal stamp uses the pond's same seeded pigment map, not a generic fish icon.
function renderEmblem(p, canvas = $("koi-emblem")) {
  const context = canvas.getContext("2d"),
    { c, b } = paint(p.kind, p.seed);
  const pixels = context.createImageData(80, 48),
    colors = new Uint32Array(pixels.data.buffer);
  const pixel = (x, y, col) => {
    if (x >= 0 && x < 80 && y >= 0 && y < 48) colors[y * 80 + x] = col;
  };
  const edge = hexC("#59604A");
  for (let x = 13; x < 66; x++) {
    const t = (x - 13) / 52,
      body = t < 0.76;
    const width = body ? 2 + 8 * Math.sin(Math.PI * Math.pow(t / 0.76, 0.7)) : 2 + (t - 0.76) * 25;
    for (let y = Math.ceil(24 - width); y <= 24 + width; y++) {
      const q = (y - 24) / width;
      if (!body && t > 0.91 && Math.abs(q) < (t - 0.91) * 7) continue;
      const u = Math.min(PU - 1, Math.floor((t / 0.76) * PU)),
        v = clamp(Math.floor((q * 0.5 + 0.5) * PV), 0, PV - 1);
      pixel(x, y, Math.abs(q) > 0.85 ? edge : body ? c[u * PV + v] : b);
    }
  }
  for (const side of [-1, 1])
    for (let x = 27; x < 36; x++)
      for (let y = 0; y < 5; y++)
        if (y < (x - 26) * 0.6) pixel(x, 24 + side * (8 + y), mixC(b, edge, 0.25));
  pixel(17, 21, edge);
  pixel(17, 27, edge);
  context.putImageData(pixels, 0, 0);
}
/* One book, scrollable project pages, and interruptible travel from the real cover bounds. */
const book = $("book"),
  cover = $("book-cover"),
  pageBody = $("page-body");
let bookState = "closed",
  travel = null,
  coverTravel = null,
  travelVersion = 0,
  pageTurn = null,
  leafTurn = null;
let pages = [],
  pageIndex = 0,
  readingProject = null,
  journalSection = "projects";
let journalOpener = null;
function stopTravel() {
  const pose = getComputedStyle(book).transform,
    coverPose = getComputedStyle(cover).transform,
    coverOpacity = getComputedStyle(cover).opacity;
  travel?.cancel();
  coverTravel?.cancel();
  book.style.transform = pose;
  cover.style.transform = coverPose;
  cover.style.opacity = coverOpacity;
}
function cornerTransform() {
  // offset dimensions are the untransformed reading bounds. The trigger is hidden
  // while travelling, so the cover is never shown twice.
  const r = $("index-toggle").getBoundingClientRect();
  return `translate(${r.left - book.offsetLeft}px,${r.top - book.offsetTop}px) scale(${r.width / book.offsetWidth},${r.height / book.offsetHeight})`;
}
function settleBook(open) {
  travel?.cancel();
  coverTravel?.cancel();
  book.style.transform = open ? "none" : cornerTransform();
  cover.style.transform = open ? "rotateY(-100deg)" : "none";
  cover.style.opacity = open ? "0" : "1";
  bookState = open ? "open" : "closed";
  book.hidden = !open;
  book.inert = !open;
  document.body.classList.toggle("book-visible", open);
  $("index-toggle").setAttribute("aria-expanded", String(open));
  if (!open) {
    updateBoat(0);
    restorePondFocus(journalOpener?.isConnected ? journalOpener : $("index-toggle"));
  }
}
function moveBook(open) {
  const wasClosed = bookState === "closed",
    version = ++travelVersion;
  if (!wasClosed) stopTravel();
  book.hidden = false;
  document.body.classList.add("book-visible");
  if (wasClosed) {
    book.style.transform = cornerTransform();
    cover.style.transform = "none";
    cover.style.opacity = "1";
  }
  book.inert = !open;
  bookState = open ? "opening" : "closing";
  $("index-toggle").setAttribute("aria-expanded", String(open));
  if (reduce) {
    settleBook(open);
    return;
  }
  const target = open ? "none" : cornerTransform();
  travel = book.animate([{ transform: book.style.transform }, { transform: target }], {
    duration: open ? 500 : 520,
    delay: open ? 0 : 180,
    easing: "cubic-bezier(.22,.7,.2,1)",
    fill: "forwards",
  });
  coverTravel = cover.animate(
    [
      {
        transform: cover.style.transform,
        opacity: getComputedStyle(cover).opacity,
      },
      {
        transform: open ? "rotateY(-100deg)" : "none",
        opacity: open ? 0 : 1,
      },
    ],
    {
      duration: open ? 350 : 250,
      delay: open ? 350 : 0,
      easing: "ease-in-out",
      fill: "forwards",
    },
  );
  Promise.all([travel.finished, coverTravel.finished])
    .then(() => {
      if (version === travelVersion) settleBook(open);
    })
    .catch(() => {});
}
function makeBlock(block) {
  if (block.type === "entry") {
    const button = document.createElement("button");
    button.type = "button";
    button.className = "index-choice";
    button.setAttribute("aria-label", `Open ${PROJECTS[block.project].name}`);
    const number = document.createElement("span");
    number.className = "index-number";
    number.textContent = String(block.project + 1).padStart(2, "0");
    const emblem = document.createElement("canvas");
    emblem.width = 80;
    emblem.height = 48;
    emblem.setAttribute("aria-hidden", "true");
    renderEmblem(PROJECTS[block.project], emblem);
    const name = document.createElement("span");
    name.textContent = PROJECTS[block.project].name;
    button.append(number, emblem, name);
    button.addEventListener("click", () => openProject(koi[block.project]));
    return button;
  }
  if (block.type === "photo") {
    const photo = document.createElement("div");
    photo.className = "page-photo";
    if (block.project.image) {
      const img = document.createElement("img");
      img.src = block.project.image;
      img.alt = block.project.alt;
      img.loading = "lazy";
      const caption = document.createElement("p");
      caption.textContent = block.project.caption;
      const link = paperLink("View screenshot (opens new tab)", block.project.image);
      link.target = "_blank";
      link.rel = "noopener noreferrer";
      photo.append(img, caption, link);
      return photo;
    }
    photo.style.minHeight = "145px";
    const title = document.createElement("span");
    title.textContent = "Project screenshot";
    const note = document.createElement("small");
    note.textContent = "Placeholder — image not supplied";
    photo.append(title, note);
    return photo;
  }
  if (block.type === "heading") return personalElement("h3", block.text, "personal-heading");
  if (block.type === "link") return paperLink(block.text, block.url);
  const paragraph = document.createElement("p");
  paragraph.className = "page-paragraph";
  paragraph.textContent = block.text;
  return paragraph;
}
function buildPages() {
  pages = [
    {
      project: null,
      blocks: [
        {
          type: "text",
          text: "Choose a field note. Each koi has a story.",
        },
        ...PROJECTS.map((p, i) => ({ type: "entry", project: i })),
        {
          type: "text",
          text: "Click a koi to open its story. Tap water: nearby fish scatter, then koi return. The marked pad controls Still water.",
        },
      ],
    },
  ];
  PROJECTS.forEach((p, i) =>
    pages.push({
      project: i,
      blocks: [
        { type: "text", text: p.category },
        { type: "text", text: p.summary },
        { type: "text", text: "My role: " + p.role },
        { type: "text", text: "Technologies: " + p.tools },
        { type: "photo", project: p },
        ...p.sections.flatMap(([title, text]) => [
          { type: "heading", text: title },
          { type: "text", text },
        ]),
        ...(p.lesson
          ? [
              {
                type: "text",
                text: "Based on The Odin Project. The assignment provides learning context; this entry describes my own practice implementation.",
              },
              {
                type: "link",
                text: "Assignment context — The Odin Project",
                url: "https://www.theodinproject.com/lessons/foundations-" + p.lesson,
              },
            ]
          : []),
        {
          type: "text",
          text:
            i < 2
              ? "My personal GitHub account; this is not a link to VDart source code."
              : "Browse my personal GitHub account; this is not a project-specific repository link.",
        },
        { type: "link", text: "GitHub profile", url: "https://github.com/pok0yo" },
      ],
    }),
  );
}
function showPage(index, animate = true) {
  journalSection = "projects";
  $("previous").parentElement.hidden = false;
  $("contents").hidden = false;
  $("page-emblem").hidden = false;
  pageIndex = clamp(index, 0, pages.length - 1);
  const page = pages[pageIndex];
  if (!page) return;
  readingProject = page.project;
  if (page.project === null) {
    releaseKoi();
    document.body.classList.remove("project-open");
    setCamera({ x: 0, y: 0, z: 1, shade: 0 });
  } else if (selected?.i !== page.project) {
    releaseKoi();
    selected = koi[page.project];
    selected.reaction = null;
    pend.length = 0;
    prepareFocus();
    document.body.classList.add("project-open");
  }
  const title = page.project === null ? "Project index" : PROJECTS[page.project].name;
  $("page-title").textContent = title;
  renderEmblem(PROJECTS[page.project ?? 0], $("page-emblem"));
  $("page-kicker").textContent =
    page.project === null ? "Contents" : `Entry ${String(page.project + 1).padStart(2, "0")}`;
  pageBody.replaceChildren(...page.blocks.map(makeBlock));
  pageBody.scrollTop = 0;
  $("page-count").textContent =
    page.project === null
      ? `${PROJECTS.length} projects`
      : `Project ${page.project + 1} of ${PROJECTS.length}`;
  $("previous").disabled = pageIndex <= 1;
  $("next").disabled = pageIndex === pages.length - 1;
  pageTurn?.cancel();
  leafTurn?.cancel();
  if (animate && !reduce) {
    pageTurn = pageBody.animate([{ opacity: 0.3 }, { opacity: 1 }], {
      duration: 180,
    });
    leafTurn = $("page-leaf").animate(
      [
        { transform: "rotateY(0)", opacity: 0.7 },
        { transform: "rotateY(-130deg)", opacity: 0 },
      ],
      { duration: 260, easing: "ease-out" },
    );
  }
  $("announcement").textContent = `${title}. ${$("page-count").textContent}.`;
}
function openIndex(event) {
  captureJournalOpener(event?.currentTarget);
  if (bookState === "closed") {
    book.hidden = false;
    book.style.visibility = "hidden";
    buildPages();
    book.style.visibility = "";
  }
  if (!pages.length) buildPages();
  readingProject = null;
  showPage(
    pages.findIndex((p) => p.project === null),
    false,
  );
  moveBook(true);
  $("page-title").focus({ preventScroll: true });
}
function openProject(k) {
  if (!k) return;
  captureJournalOpener($("index-toggle"));
  hover = null;
  koi.forEach((o) => (o.hov = false));
  showTip(null);
  if (bookState === "closed") {
    book.hidden = false;
    book.style.visibility = "hidden";
    buildPages();
    book.style.visibility = "";
  }
  if (!pages.length) buildPages();
  showPage(
    pages.findIndex((p) => p.project === k.i),
    false,
  );
  if (bookState !== "open" && bookState !== "opening") moveBook(true);
  $("page-title").focus({ preventScroll: true });
}
function captureJournalOpener(trigger) {
  pendingObjectFocus = null;
  if (!aboutBoard.hidden) closeAbout(false, true);
  if (bookState === "closed" || bookState === "closing" || (trigger && !book.contains(trigger)))
    journalOpener = trigger || $("index-toggle");
  resetWake();
  showTip(null);
}
/* About and Contact: supplied personal content and separate reading surfaces. */
function personalElement(tag, text, className) {
  const e = document.createElement(tag);
  e.textContent = text;
  if (className) e.className = className;
  return e;
}
function paperLink(label, url, download = false) {
  const a = personalElement("a", label, "paper-link");
  a.href = url;
  if (download) a.download = "Yuri-Ante-Resume-Public.pdf";
  else if (url.startsWith("https:")) {
    a.target = "_blank";
    a.rel = "noopener noreferrer";
  }
  return a;
}
function renderPersonalContent(section, host) {
  host.replaceChildren();
  const add = (tag, text, cls) => host.append(personalElement(tag, text, cls));
  if (section === "about") {
    add(
      "p",
      "I’m Yuri Ante, a computer science student at the University of Georgia. My work includes web projects, a Flutter mobile app, and workflow automation.",
      "page-paragraph",
    );
    add("h3", "Education", "personal-heading");
    add("p", "University of Georgia · Bachelor of Science in Computer Science", "page-paragraph");
    add("p", "Expected graduation: May 2028", "personal-meta");
    add("h3", "Experience", "personal-heading");
    add("p", "VDart · Strategy Enablement Analyst Intern", "page-paragraph");
    add("p", "August 2025 – January 2026", "personal-meta");
    add(
      "p",
      "As part of a development team, designed the UI and built the Dart and Flutter front end for an educational app, delivering login, calendar, progress tracking, and course-path modules. Designed and tested n8n, HubSpot API, and Google Sheets pipelines that reduced sales process time by 20–60 hours per month.",
      "page-paragraph",
    );
    add(
      "p",
      "At VDart, also co-developed an AI-driven Sales Manager that automated CRM and pipeline tasks, cutting manual workflow time by 4–6 hours per week per sales representative.",
      "page-paragraph",
    );
    add("p", "Surcheros · Crew Member", "page-paragraph");
    add("p", "January 2026 – August 2026", "personal-meta");
    add(
      "p",
      "Trained two new employees on kitchen procedures and customer service standards, and operated the cash register while verifying order details.",
      "page-paragraph",
    );
    add("h3", "Technical strengths", "personal-heading");
    add(
      "p",
      "JavaScript, HTML, CSS and Flexbox for web interfaces; Dart and Flutter for mobile development; Python, Java and R. My toolkit also includes Git, GitHub, Linux, n8n and HubSpot CRM, with Next.js and Supabase listed among my skills.",
      "page-paragraph",
    );
    const details = document.createElement("details");
    details.className = "resume-note";
    details.append(personalElement("summary", "Résumé · open document note"));
    details.append(
      personalElement("p", "Public résumé copy with street address and phone number omitted."),
    );
    details.append(paperLink("Download résumé", "assets/yuri-ante-resume-public.pdf", true));
    host.append(details);
  } else {
    add("p", "You can reach me by email or find me on these platforms.", "page-paragraph");
    const links = document.createElement("div");
    links.className = "contact-links";
    links.append(
      paperLink("yla10995@uga.edu", "mailto:yla10995@uga.edu"),
      paperLink("LinkedIn", "https://www.linkedin.com/in/yuri-ante-12b7a0432/"),
      paperLink("GitHub", "https://github.com/pok0yo"),
      paperLink("Instagram", "https://www.instagram.com/yuri_ant3/?hl=en"),
      paperLink("Handshake", "https://app.joinhandshake.com/profiles/g4y2be"),
    );
    host.append(links);
  }
}
function openPersonal(section, trigger) {
  if (section === "about") {
    openAbout(trigger);
    return;
  }
  captureJournalOpener(trigger);
  journalSection = section;
  releaseKoi();
  document.body.classList.remove("project-open");
  setCamera({ x: 0, y: 0, z: 1, shade: 0 });
  pend.length = 0;
  hover = null;
  koi.forEach((k) => (k.hov = false));
  pageTurn?.cancel();
  leafTurn?.cancel();
  $("previous").parentElement.hidden = true;
  $("contents").hidden = true;
  $("page-emblem").hidden = true;
  $("page-title").textContent = section === "about" ? "About Yuri" : "Let’s connect";
  $("page-kicker").textContent =
    section === "about" ? "A note from the dock" : "Post from the pond";
  $("page-count").textContent = section === "about" ? "About" : "Contact";
  renderPersonalContent(section, pageBody);
  pageBody.scrollTop = 0;
  if (bookState !== "open" && bookState !== "opening") moveBook(true);
  $("page-title").focus({ preventScroll: true });
  $("announcement").textContent = $("page-title").textContent;
  updateBoat(0);
}
const aboutBoard = $("about-board");
let aboutOpen = false,
  aboutOpener = null,
  aboutAnimation = null,
  aboutVersion = 0,
  aboutReturnCamera = null;
function openAbout(trigger) {
  pendingObjectFocus = null;
  if (aboutOpen) {
    $("about-title").focus({ preventScroll: true });
    return;
  }
  aboutOpener = trigger || $("about-dock");
  aboutReturnCamera = selected
    ? { x: 0, y: 0, z: 1, shade: 0 }
    : { x: camera.x, y: camera.y, z: camera.z, shade: camera.shade };
  travelVersion++;
  travel?.cancel();
  coverTravel?.cancel();
  bookState = "closed";
  book.hidden = true;
  book.inert = true;
  document.body.classList.remove("book-visible", "project-open");
  $("index-toggle").setAttribute("aria-expanded", "false");
  releaseKoi();
  setCamera({ x: 0, y: 0, z: 1, shade: 0 });
  resetWake();
  showTip(null);
  pend.length = 0;
  aboutVersion++;
  aboutAnimation?.cancel();
  aboutOpen = true;
  aboutBoard.hidden = false;
  aboutBoard.inert = false;
  document.body.classList.add("about-open");
  $("about-dock").setAttribute("aria-expanded", "true");
  renderPersonalContent("about", $("about-content"));
  $("about-content").querySelector(".resume-note")?.remove();
  $("about-content").scrollTop = 0;
  aboutBoard.classList.add("opening");
  if (!reduce)
    aboutAnimation = aboutBoard.animate([{ opacity: 0 }, { opacity: 1 }], { duration: 240 });
  $("about-title").focus({ preventScroll: true });
  $("announcement").textContent = "About Yuri. Dockside reading board.";
  updateBoat(0);
}
function closeAbout(restore = true, instant = false) {
  if (!aboutOpen && aboutBoard.hidden) return;
  const version = ++aboutVersion;
  aboutOpen = false;
  aboutAnimation?.cancel();
  aboutBoard.inert = true;
  $("about-dock").setAttribute("aria-expanded", "false");
  const finish = () => {
    if (version !== aboutVersion) return;
    aboutBoard.hidden = true;
    document.body.classList.remove("about-open");
    aboutBoard.classList.remove("opening");
    updateBoat(0);
    if (restore) {
      restorePondFocus(aboutOpener || $("about-dock"));
    }
  };
  if (restore) setCamera(aboutReturnCamera || { x: 0, y: 0, z: 1, shade: 0 });
  if (instant || reduce) finish();
  else {
    aboutAnimation = aboutBoard.animate([{ opacity: 1 }, { opacity: 0 }], { duration: 160 });
    aboutAnimation.finished.then(finish).catch(() => {});
  }
}
$("about-back").addEventListener("click", () => closeAbout());
aboutBoard.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    closeAbout();
  }
});
function drawDock() {
  const c = $("dock-art").getContext("2d"),
    r = rng(420);
  c.clearRect(0, 0, 48, 108);
  const rect = (x, y, w, h, col) => {
    c.fillStyle = col;
    c.fillRect(x, y, w, h);
  };
  rect(4, 24, 41, 84, "#193E4566");
  rect(7, 14, 34, 88, "#493D29");
  rect(0, 0, 48, 14, "#685438");
  rect(9, 0, 30, 18, "#886B45");
  for (let i = 0; i < 55; i++) {
    const x = Math.floor(r() * 48),
      y = Math.floor(r() * 16);
    if (x < 10 || x > 37) rect(x, y, 2, 2, r() > 0.5 ? "#8D9B4D" : "#456F3D");
  }
  for (let i = 0; i < 10; i++) {
    const y = 18 + i * 8,
      x = 7 + (i % 3 === 0 ? 1 : 0);
    rect(x, y, 33, 7, i % 3 === 0 ? "#A8854A" : "#B08A4E");
    rect(x, y, 33, 1, "#D0AD69");
    rect(x, y + 6, 33, 1, "#715332");
    for (let j = 0; j < 4; j++)
      rect(
        10 + Math.floor(r() * 23),
        y + 2 + Math.floor(r() * 3),
        2 + Math.floor(r() * 7),
        1,
        "#8A673C",
      );
    rect(10, y + 3, 1, 1, "#D9C998");
    rect(37, y + 3, 1, 1, "#615239");
  }
  for (const y of [20, 58, 95])
    for (const x of [3, 39]) {
      rect(x, y, 6, 11, "#57452E");
      rect(x + 1, y - 2, 4, 3, "#CFB17D");
      rect(x, y, 6, 3, "#AA8957");
      rect(x + 1, y + 3, 1, 7, "#8B6E43");
    }
}
function drawBoat() {
  const c = $("boat-art").getContext("2d");
  c.clearRect(0, 0, 56, 44);
  const rect = (x, y, w, h, col) => {
    c.fillStyle = col;
    c.fillRect(x, y, w, h);
  };
  rect(10, 38, 37, 2, "#9FCFC477");
  rect(16, 41, 21, 1, "#C5E8D577");
  for (let y = 3; y < 28; y++) {
    const half = Math.floor((y - 3) * 0.57);
    rect(28 - half, y, half, 1, "#FFF7CD");
    rect(28, y, half + 1, 1, "#E8DB99");
    rect(27, y, 1, 1, "#FFFFFF");
  }
  rect(3, 25, 50, 2, "#FFF6C8");
  for (let y = 27; y < 38; y++) {
    const inset = Math.floor((y - 27) * 0.9);
    rect(4 + inset, y, 24 - inset, 1, "#F7EDB7");
    rect(28, y, 24 - inset, 1, "#E5D799");
    rect(27, y, 1, 1, "#FFF6CF");
  }
  for (let i = 0; i < 17; i++) {
    rect(5 + i, 27 + Math.floor(i * 0.35), 2, 1, "#C9BC84");
    rect(49 - i, 27 + Math.floor(i * 0.35), 2, 1, "#FDF5C8");
  }
}
// Object sizes are unzoomed art pixels; boatSpeed is art pixels/second before applying U.
const OBJECT_SCALE = { boatWidth: 14, dockWidth: 32, boatSpeed: 3.8 }; // unzoomed pond art units
const BOAT = { speed: 3.8, turnRate: 0.8, clearance: 2 };
const dockWorld = { x: 0, y: 0, width: 0, height: 0 };
let pendingObjectFocus = null;
function scalePondObjects() {
  const sceneScale = PXS * U,
    dockWidth = OBJECT_SCALE.dockWidth * sceneScale,
    dockHeight = (dockWidth * 108) / 48;
  boat.artWidth = OBJECT_SCALE.boatWidth * U;
  boat.artHeight = (boat.artWidth * 44) / 56;
  boat.labelSize = Math.max(14, Math.min(20, 13 + sceneScale * 0.7));
  BOAT.speed = OBJECT_SCALE.boatSpeed * U;
  BOAT.clearance = 2 * U;
  // The dock is attached to the upper bank, never to the camera viewport.
  dockWorld.x = ((innerHeight <= 480 ? 0.3 : innerWidth <= 700 ? 0.46 : 0.32) * innerWidth) / PXS;
  dockWorld.y = 0;
  dockWorld.width = OBJECT_SCALE.dockWidth * U;
  dockWorld.height = (dockWorld.width * 108) / 48;
  const dockLeft = dockWorld.x * PXS,
    phone = innerWidth <= 700;
  const boardTop = phone
    ? Math.max(148, dockHeight + boat.labelSize * 1.2 + 22)
    : Math.max(80, dockHeight * 0.58);
  const values = {
    "object-label-size": boat.labelSize,
    "board-left": dockLeft + dockWidth + 8,
    "board-top": boardTop,
    "board-brace-left": dockLeft + dockWidth * 0.2 - 16,
  };
  for (const [key, value] of Object.entries(values))
    document.documentElement.style.setProperty("--" + key, value + "px");
  boat.layoutDirty = true;
}
const boat = {
  x: 0,
  y: 0,
  a: 0,
  target: null,
  pause: 0,
  held: false,
  initialized: false,
  layoutDirty: true,
  free: [],
  obstacles: [],
  halfW: 0,
  halfH: 0,
};
function boatClear(x, y) {
  const edge = 8 / PXS;
  if (
    x < boat.halfW + edge ||
    y < boat.halfH + edge ||
    x > W - boat.halfW - edge ||
    y > H - boat.halfH - 16 / PXS
  )
    return false;
  for (const o of boat.obstacles) {
    if (o.r) {
      if (
        Math.hypot(x - o.x, y - o.y) <
        o.r + Math.max(boat.halfW, boat.halfH) * 0.72 + BOAT.clearance
      )
        return false;
    } else if (
      x + boat.halfW + BOAT.clearance > o.left &&
      x - boat.halfW - BOAT.clearance < o.right &&
      y + boat.halfH + BOAT.clearance > o.top &&
      y - boat.halfH - BOAT.clearance < o.bottom
    )
      return false;
  }
  return true;
}
function scanBoatWater() {
  // Cache stable world obstacles only on layout changes. Project panels and camera
  // framing never alter a route or force the boat into a different visible berth.
  boat.halfW = Math.max(22 / PXS, boat.artWidth / 2, (boat.labelSize * 2) / PXS);
  boat.halfH = Math.max(22 / PXS, boat.artHeight / 2 + (boat.labelSize * 1.2 + 3) / PXS);
  boat.obstacles = pads.filter((p, i) => i !== MOTION_PAD).map((p) => ({ x: p.x, y: p.y, r: p.R }));
  boat.obstacles.push({
    left: dockWorld.x,
    top: 0,
    right: dockWorld.x + dockWorld.width,
    bottom: dockWorld.height + (boat.labelSize * 1.2 + 8) / PXS,
  });
  // Reserve the identity-view header, tucked journal, and marked foreground pad.
  // These exclusions remain fixed in the world even when their UI is hidden.
  boat.obstacles.push(
    {
      left: 0,
      top: 0,
      right: (innerWidth <= 700 ? 145 : Math.min(420, innerWidth * 0.3)) / PXS,
      bottom: 140 / PXS,
    },
    {
      left: 0,
      top: (innerHeight - 125) / PXS,
      right: 200 / PXS,
      bottom: H,
    },
    {
      left: (innerWidth - 110) / PXS,
      top: 0,
      right: W,
      bottom: 120 / PXS,
    },
  );
  boat.free = [];
  const grid = 28 / PXS;
  for (let y = boat.halfH + 12 / PXS; y < H - boat.halfH - 20 / PXS; y += grid)
    for (let x = boat.halfW + 12 / PXS; x < W - boat.halfW - 12 / PXS; x += grid)
      if (boatClear(x, y)) boat.free.push({ x, y });
  if (boat.free.length && (!boat.initialized || !boatClear(boat.x, boat.y))) {
    let best = boat.free[0],
      distance = Infinity;
    for (const p of boat.free) {
      const d = Math.hypot(
        p.x - (boat.initialized ? boat.x : W * 0.65),
        p.y - (boat.initialized ? boat.y : H * 0.6),
      );
      if (d < distance) {
        distance = d;
        best = p;
      }
    }
    boat.x = best.x;
    boat.y = best.y;
    boat.initialized = true;
    boat.target = null;
  }
  boat.layoutDirty = false;
}
/* Accessible object overlays: off-screen/covered artwork must not leave invisible tab stops. */
function placeWorldObject(el, left, top, width, height) {
  el.style.width = width + "px";
  el.style.height = height + "px";
  el.style.transform = `translate(${left}px,${top}px)`;
  const offscreen =
    left + width <= 0 || top + height <= 0 || left >= innerWidth || top >= innerHeight;
  // Prevent a fully covered object becoming an invisible keyboard stop.
  let covered = false;
  for (const panel of [book, aboutBoard])
    if (!panel.hidden && !panel.inert) {
      const r = panel.getBoundingClientRect();
      if (left >= r.left && top >= r.top && left + width <= r.right && top + height <= r.bottom)
        covered = true;
    }
  el.inert = offscreen || covered;
  el.tabIndex = el.inert ? -1 : 0;
  el.setAttribute("aria-hidden", String(el.inert));
  el.style.visibility = offscreen ? "hidden" : "visible";
}
function projectPondObjects() {
  const scale = PXS * camera.z,
    dx = (dockWorld.x * camera.z + camera.x) * PXS,
    dy = (dockWorld.y * camera.z + camera.y) * PXS;
  const dock = $("about-dock");
  placeWorldObject(dock, dx, dy, dockWorld.width * scale, dockWorld.height * scale);
  const artW = boat.artWidth * scale,
    artH = boat.artHeight * scale,
    hitW = Math.max(44, artW),
    hitH = Math.max(44, artH);
  const el = $("contact-boat");
  el.hidden = !boat.initialized;
  el.style.setProperty("--boat-art-width", artW + "px");
  el.style.setProperty("--boat-art-height", artH + "px");
  placeWorldObject(
    el,
    (boat.x * camera.z + camera.x) * PXS - hitW / 2,
    (boat.y * camera.z + camera.y) * PXS - hitH / 2,
    hitW,
    hitH,
  );
  if (pendingObjectFocus && !camera.from && bookState === "closed" && !aboutOpen) {
    const opener = pendingObjectFocus;
    pendingObjectFocus = null;
    (opener.isConnected && !opener.inert && !opener.hidden ? opener : $("index-toggle")).focus({
      preventScroll: true,
    });
  }
}
function restorePondFocus(opener) {
  pendingObjectFocus = opener || $("index-toggle");
  projectPondObjects();
}
function updateBoat(dt) {
  if (boat.layoutDirty) scanBoatWater();
  const el = $("contact-boat"),
    paused = reduce || boat.held || el.matches(":hover,:focus") || pendingObjectFocus === el;
  if (boat.initialized && boat.free.length && !paused) {
    boat.pause = Math.max(0, boat.pause - dt);
    if (!boat.target || !boatClear(boat.target.x, boat.target.y)) {
      const candidates = boat.free.filter((p) => Math.hypot(p.x - boat.x, p.y - boat.y) > 65 / PXS);
      boat.target = (candidates.length ? candidates : boat.free)[
        Math.floor(Math.random() * (candidates.length || boat.free.length))
      ];
    }
    if (boat.target && boat.pause === 0) {
      const dx = boat.target.x - boat.x,
        dy = boat.target.y - boat.y;
      if (Math.hypot(dx, dy) < 12 / PXS) {
        boat.target = null;
        boat.pause = 2 + Math.random() * 3;
      } else {
        boat.a += angDiff(Math.atan2(dy, dx), boat.a) * Math.min(1, dt * BOAT.turnRate);
        const nx = boat.x + Math.cos(boat.a) * BOAT.speed * dt,
          ny = boat.y + Math.sin(boat.a) * BOAT.speed * dt;
        if (boatClear(nx, ny)) {
          boat.x = nx;
          boat.y = ny;
        } else {
          boat.a += dt * 2;
          boat.target = null;
        }
      }
    }
  }
  projectPondObjects();
}
$("about-dock").addEventListener("click", (e) => openAbout(e.currentTarget));
$("contact-boat").addEventListener("click", (e) => openPersonal("contact", e.currentTarget));
$("contact-boat").addEventListener("pointerdown", () => (boat.held = true));
addEventListener("pointerup", () => (boat.held = false));
addEventListener("pointercancel", () => (boat.held = false));
drawBoat();
drawDock();
captureCloudSprite("boat-art");
captureCloudSprite("dock-art");
function closeProject() {
  if (bookState === "closed") return;
  releaseKoi();
  document.body.classList.remove("project-open");
  setCamera({ x: 0, y: 0, z: 1, shade: 0 });
  moveBook(false);
}
/* Accessibility: one motion policy for simulation, transitions, and click reactions. */
function setReducedMotion(value) {
  if (value) {
    aboutAnimation?.cancel();
    if (!aboutOpen && !aboutBoard.hidden) closeAbout(true, true);
  }
  resetWake();
  reduce = value;
  document.body.classList.toggle("calm", reduce);
  $("motion").setAttribute("aria-pressed", String(reduce));
  $("motion-state").textContent = reduce ? "On" : "Off";
  if (reduce) {
    clearReactions();
    hA?.fill(0);
    hB?.fill(0);
    pend.length = 0;
    pageTurn?.cancel();
    leafTurn?.cancel();
    if (bookState === "opening" || bookState === "closing") {
      travelVersion++;
      settleBook(bookState === "opening");
    }
  }
  if (selected) prepareFocus(true);
  else if (camera.to) setCamera(camera.to, true);
}
renderEmblem(PROJECTS[0], $("cover-emblem"));
renderEmblem(PROJECTS[0], $("moving-emblem"));
$("index-toggle").addEventListener("click", openIndex);
$("close-journal").addEventListener("click", closeProject);
$("contents").addEventListener("click", () => {
  showPage(0);
  $("page-title").focus({ preventScroll: true });
});
$("previous").addEventListener("click", () => showPage(pageIndex - 1));
$("next").addEventListener("click", () => showPage(pageIndex + 1));
book.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    e.preventDefault();
    e.stopPropagation();
    closeProject();
  } else if (
    journalSection === "projects" &&
    (e.key === "ArrowLeft" || e.key === "ArrowRight") &&
    !e.target.closest("button,input,select,textarea,a")
  ) {
    e.preventDefault();
    showPage(Math.max(pageIndex === 0 ? 0 : 1, pageIndex + (e.key === "ArrowRight" ? 1 : -1)));
  }
});
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape" && aboutOpen) {
    e.preventDefault();
    closeAbout();
    return;
  }
  if (e.key === "Escape" && bookState !== "closed") {
    e.preventDefault();
    closeProject();
  }
});
$("motion").addEventListener("click", () => setReducedMotion(!reduce));
$("motion").addEventListener("pointerenter", () => {
  padHovered = true;
  showTip(null);
});
$("motion").addEventListener("pointerleave", () => (padHovered = false));
$("motion").addEventListener("focus", () => (padFocused = true));
$("motion").addEventListener("blur", () => (padFocused = false));
$("motion").addEventListener("pointerdown", () => (padHeld = true));
addEventListener("pointerup", () => (padHeld = false));
addEventListener("pointercancel", () => (padHeld = false));
addEventListener("pointerup", () => $("motion").classList.remove("held"));
addEventListener("pointercancel", () => $("motion").classList.remove("held"));
motionQuery.addEventListener("change", (e) => setReducedMotion(e.matches));
function repaginate() {
  // Natural scroll layout preserves the current project and reading position.
  if (bookState === "opening" || bookState === "closing") {
    const open = bookState === "opening";
    travelVersion++;
    settleBook(open);
  }
}

document.fonts.ready.then(repaginate);
/* ===== 9. Input, layout, main loop ===== */
function resize() {
  resetWake();
  const vw = innerWidth,
    vh = innerHeight,
    ow = W,
    oh = H,
    oldU = U;
  PXS = vw < 600 ? 2 : Math.max(3, Math.round(vw / CONFIG.pxTarget)); // CSS pixels per art pixel (whole numbers stay crisp)
  W = cv.width = Math.ceil(vw / PXS);
  H = cv.height = Math.ceil(vh / PXS);
  scene.width = W;
  scene.height = H;
  cv.style.width = W * PXS + "px";
  cv.style.height = H * PXS + "px";
  U = Math.max(0.75, Math.min(1.3, Math.min(W, H * 1.7) / 340));
  if (boat.initialized && ow && oh) {
    boat.x *= W / ow;
    boat.y *= H / oh;
    if (boat.target) {
      boat.target = {
        x: (boat.target.x * W) / ow,
        y: (boat.target.y * H) / oh,
      };
    }
  }
  scalePondObjects();
  buf = new Uint32Array(W * H);
  img = new ImageData(new Uint8ClampedArray(buf.buffer), W, H);
  stamp = new Uint32Array(W * H);
  hA = new Float32Array(W * H);
  hB = new Float32Array(W * H);
  buildCloudField();
  updateCloudField(0);
  buildWater();
  buildScene();
  ecosystemResize(ow, oh);
  pads[MOTION_PAD].R = Math.round(30 / PXS);
  pads[MOTION_PAD].s = makePad(pads[MOTION_PAD].R, MOTION_PAD * 31 + 7);
  if (!koi.length) PROJECTS.forEach((p, i) => koi.push(makeKoi(p, i)));
  else
    koi.forEach((k) => {
      // Reposition each fish for the new aspect ratio without stretching its body.
      const h = { ...k.pts[0] },
        nx = (h.x * W) / ow,
        ny = (h.y * H) / oh,
        scale = U / oldU;
      k.pts.forEach((q) => {
        q.x = nx + (q.x - h.x) * scale;
        q.y = ny + (q.y - h.y) * scale;
      });
      containKoi(k);
      k.rt.wp = null;
      if (k.reaction) {
        k.reaction.x = clamp((k.reaction.x * W) / ow, koiClearance(k), W - koiClearance(k));
        k.reaction.y = clamp((k.reaction.y * H) / oh, koiClearance(k), H - koiClearance(k));
      }
    });
  if (ow) {
    camera.x *= W / ow;
    camera.y *= H / oh;
  }
  if (selected) prepareFocus(true);
  else setCamera({ x: 0, y: 0, z: 1, shade: 0 }, true);
  updateBoat(0);
  repaginate();
}
function showTip(k, cx, cy) {
  if (!k) {
    tip.classList.remove("on");
    tip.replaceChildren();
    return;
  }
  tip.replaceChildren(document.createTextNode(k.name));
  const small = document.createElement("small");
  small.textContent = "View project";
  tip.append(small);
  tip.classList.add("on");
  tip.style.left = Math.min(cx + 14, innerWidth - tip.offsetWidth - 8) + "px";
  tip.style.top = Math.min(cy + 16, innerHeight - 52) + "px";
}
const art = (e) => [
  (e.clientX / PXS - camera.x) / camera.z,
  (e.clientY / PXS - camera.y) / camera.z,
];
// A fixed-size input queue preserves bends without allocating on pointer movement.
const wakePoints = new Float32Array(64 * 3);
let wakeCount = 0,
  wakeX = 0,
  wakeY = 0,
  wakeTime = 0,
  wakeActive = false,
  wakeBudget = 0;
function resetWake() {
  wakeCount = 0;
  wakeActive = false;
  wakeBudget = 0;
}
function recordWake(x, y, time, pointerType) {
  if (reduce || pointerType === "touch") {
    resetWake();
    return;
  }
  if (!wakeActive || time - wakeTime > 180) {
    wakeX = x;
    wakeY = y;
    wakeTime = time;
    wakeActive = true;
    wakeCount = 0;
    return;
  }
  const distance = Math.hypot(x - wakeX, y - wakeY);
  if (distance < 0.5) return;
  const speed = (distance / Math.max(8, time - wakeTime)) * 1000;
  // Keep the first point of each queued path, including direction changes.
  if (!wakeCount) {
    wakePoints[0] = wakeX;
    wakePoints[1] = wakeY;
    wakePoints[2] = RIPPLE.strength;
    wakeCount = 1;
  }
  const slot = Math.min(wakeCount, 63) * 3;
  wakePoints[slot] = x;
  wakePoints[slot + 1] = y;
  wakePoints[slot + 2] = Math.min(RIPPLE.maxStrength, RIPPLE.strength + speed * RIPPLE.speedGain);
  wakeCount = Math.min(64, wakeCount + 1);
  wakeX = x;
  wakeY = y;
  wakeTime = time;
}
function flushWake(dt) {
  if (reduce) {
    resetWake();
    return;
  }
  wakeBudget = Math.min(1, wakeBudget + dt * RIPPLE.maxInputRate);
  if (wakeBudget < 1 || wakeCount < 2) return;
  wakeBudget = 0;
  let total = 0;
  for (let j = 1; j < wakeCount; j++)
    total += Math.hypot(
      wakePoints[j * 3] - wakePoints[(j - 1) * 3],
      wakePoints[j * 3 + 1] - wakePoints[(j - 1) * 3 + 1],
    );
  const spacing = Math.max(
    RIPPLE.trailSpacing * PXS * camera.z,
    total / Math.max(1, RIPPLE.maxTrailSamples - wakeCount),
  );
  for (let j = 1; j < wakeCount; j++) {
    const a = (j - 1) * 3,
      b = j * 3,
      dx = wakePoints[b] - wakePoints[a],
      dy = wakePoints[b + 1] - wakePoints[a + 1],
      distance = Math.hypot(dx, dy),
      steps = Math.max(1, Math.ceil(distance / spacing));
    // Weight by distance so high-frequency tiny movements cannot build large waves.
    const strength = wakePoints[b + 2] * Math.min(1, distance / (steps * spacing));
    for (let k = 1; k <= steps; k++) {
      const t = k / steps;
      splat(
        ((wakePoints[a] + dx * t) / PXS - camera.x) / camera.z,
        ((wakePoints[a + 1] + dy * t) / PXS - camera.y) / camera.z,
        strength,
      );
    }
  }
  wakeCount = 0;
}
cv.addEventListener("pointermove", (e) => {
  const [x, y] = art(e);
  recordWake(e.clientX, e.clientY, e.timeStamp, e.pointerType);
  if (selected) return;
  hover = e.pointerType === "touch" ? null : pick(x, y);
  koi.forEach((k) => (k.hov = k === hover));
  showTip(hover, e.clientX, e.clientY);
});
cv.addEventListener("pointerleave", () => {
  resetWake();
  hover = null;
  koi.forEach((k) => (k.hov = false));
  showTip(null);
});
cv.addEventListener("pointercancel", resetWake);
cv.addEventListener("click", (e) => {
  const [x, y] = art(e);
  const hit = pick(x, y);
  if (hit) {
    if (hit !== selected) openProject(hit);
    return;
  }
  if (reduce) return;
  reactToWater(x, y);
  pend.length = 0; // A fresh click replaces pending ripple beats, never an unbounded queue.
  [
    [0, 170],
    [0.18, -110],
    [0.36, 90],
  ].forEach(([d, a]) => pend.push({ t: d, x, y, a }));
  hint.classList.add("done");
  if (e.pointerType === "touch") {
    showTip(pick(x, y), e.clientX, e.clientY);
    clearTimeout(tipT);
    tipT = setTimeout(() => showTip(null), 1800);
  }
});
let rz;
addEventListener("resize", () => {
  clearTimeout(rz);
  rz = setTimeout(resize, 120);
});
let last = performance.now(),
  frameId = 0;
function frame(now) {
  if (document.hidden) {
    frameId = 0;
    return;
  }
  const dt = Math.min(0.05, (now - last) / 1000);
  last = now;
  step(dt);
  draw();
  frameId = requestAnimationFrame(frame);
}
document.addEventListener("visibilitychange", () => {
  if (document.hidden) {
    cancelAnimationFrame(frameId);
    frameId = 0;
  } else if (!frameId) {
    last = performance.now();
    frameId = requestAnimationFrame(frame);
  }
});
/* Initialization: populate identity, build the scene, apply system motion preference, then animate. */
$("nm").textContent = CONFIG.name;
$("tg").textContent = CONFIG.tagline;
document.title = CONFIG.name + " · Portfolio";
resize();
setReducedMotion(reduce);
frameId = requestAnimationFrame(frame);

/* PaintView Pro — static MVP */

const STORAGE_KEY = "paintview-pro-project-v1";

const STARTER_COLOURS = [
  { name: "Warm Calico", hex: "#d8c3a5", code: "PV-CALICO-01" },
  { name: "Soft Sage", hex: "#a8b89d", code: "PV-SAGE-02" },
  { name: "Plaster Clay", hex: "#c98467", code: "PV-CLAY-03" },
  { name: "Studio White", hex: "#f4efe7", code: "PV-WHITE-04" },
  { name: "Deep Navy", hex: "#172033", code: "PV-NAVY-05" },
  { name: "Quiet Taupe", hex: "#b9a99a", code: "PV-TAUPE-06" },
];

const DEFAULT_POINTS = [
  { x: 0.15, y: 0.15 },
  { x: 0.85, y: 0.15 },
  { x: 0.85, y: 0.85 },
  { x: 0.15, y: 0.85 },
];

function generateRef() {
  const d = new Date();
  return `PV-${d.getFullYear()}${String(d.getMonth() + 1).padStart(2, "0")}${String(d.getDate()).padStart(2, "0")}-${String(d.getHours()).padStart(2, "0")}${String(d.getMinutes()).padStart(2, "0")}`;
}

function todayISO() {
  return new Date().toISOString().slice(0, 10);
}

function defaultState() {
  return {
    project: {
      projectName: "Living room repaint",
      clientName: "",
      clientEmail: "",
      clientPhone: "",
      address: "",
      decoratorName: "",
      decoratorEmail: "",
      decoratorPhone: "",
      quoteRef: generateRef(),
      quoteDate: todayISO(),
      notes: "",
    },
    imageDataUrl: null,
    points: [...DEFAULT_POINTS.map((p) => ({ ...p }))],
    walls: [],
    colour: { ...STARTER_COLOURS[1], brand: "Custom" },
    quote: {
      dayRate: 220,
      decorators: 1,
      estimatedDays: 2,
      paintCostPerLitre: 6.5,
      prepCost: 85,
      travelCost: 25,
      contingencyPercent: 5,
      vatEnabled: true,
      vatPercent: 20,
    },
    api: {
      openaiKey: "",
      supabaseUrl: "",
      supabaseAnon: "",
      stripeKey: "",
      paintApiKey: "",
      arProvider: "",
    },
    activeStep: "project",
    editingWallId: null,
  };
}

let state = defaultState();
let dragIndex = null;
let canvasImage = null;

/* ——— Calculations ——— */

function wallGross(w) {
  return w.width * w.height;
}

function wallNet(w) {
  return Math.max(0, wallGross(w) - (w.deductions || 0));
}

function wallLitres(w) {
  const base = (wallNet(w) * w.coats) / w.coveragePerLitre;
  return base * (1 + w.wastePercent / 100);
}

function suggestTins(litres) {
  let remaining = Math.ceil(litres * 10) / 10;
  const tins5L = Math.floor(remaining / 5);
  remaining -= tins5L * 5;
  const tins25L = remaining > 0 ? Math.ceil(remaining / 2.5) : 0;
  return { tins5L, tins25L, totalLitres: Math.ceil(litres * 10) / 10 };
}

function totals() {
  const totalArea = state.walls.reduce((s, w) => s + wallNet(w), 0);
  const totalLitres = state.walls.reduce((s, w) => s + wallLitres(w), 0);
  const tins = suggestTins(totalLitres);
  const q = state.quote;
  const paintCost = totalLitres * q.paintCostPerLitre;
  const labourCost = q.dayRate * q.decorators * q.estimatedDays;
  const subtotal = paintCost + labourCost + q.prepCost + q.travelCost;
  const contingency = subtotal * (q.contingencyPercent / 100);
  const preVat = subtotal + contingency;
  const vat = q.vatEnabled ? preVat * (q.vatPercent / 100) : 0;
  const total = preVat + vat;
  return {
    totalArea,
    totalLitres,
    tins,
    paintCost,
    labourCost,
    subtotal,
    contingency,
    preVat,
    vat,
    total,
  };
}

function gbp(n) {
  return new Intl.NumberFormat("en-GB", { style: "currency", currency: "GBP" }).format(n);
}

/* ——— Storage ——— */

function saveProject() {
  syncFormsToState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  toast("Project saved locally");
}

function loadProject() {
  const raw = localStorage.getItem(STORAGE_KEY);
  if (!raw) {
    toast("No saved project found");
    return false;
  }
  try {
    state = { ...defaultState(), ...JSON.parse(raw) };
    if (!state.points?.length) state.points = DEFAULT_POINTS.map((p) => ({ ...p }));
    hydrateUI();
    toast("Project loaded");
    return true;
  } catch {
    toast("Could not load saved project");
    return false;
  }
}

function clearProject() {
  if (!confirm("Clear all project data? This cannot be undone.")) return;
  localStorage.removeItem(STORAGE_KEY);
  state = defaultState();
  canvasImage = null;
  hydrateUI();
  toast("Project cleared");
}

/* ——— UI helpers ——— */

function $(sel) {
  return document.querySelector(sel);
}

function toast(msg) {
  const el = $("#toast");
  el.textContent = msg;
  el.classList.add("is-visible");
  clearTimeout(toast._t);
  toast._t = setTimeout(() => el.classList.remove("is-visible"), 2800);
}

function setStep(step) {
  state.activeStep = step;
  document.querySelectorAll(".step").forEach((btn) => {
    btn.classList.toggle("is-active", btn.dataset.step === step);
  });
  document.querySelectorAll(".panel").forEach((panel) => {
    panel.classList.toggle("is-visible", panel.dataset.section === step);
  });
  if (step === "photo") drawCanvas();
  if (step === "walls") renderWalls();
  if (step === "quote") renderQuote();
  saveProjectQuiet();
}

function saveProjectQuiet() {
  syncFormsToState();
  localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
}

function syncFormsToState() {
  const pf = $("#projectForm");
  if (pf) {
    for (const el of pf.elements) {
      if (!el.name) continue;
      state.project[el.name] = el.value;
    }
  }
  const qf = $("#quoteForm");
  if (qf) {
    for (const el of qf.elements) {
      if (!el.name) continue;
      if (el.type === "checkbox") state.quote[el.name] = el.checked;
      else if (el.type === "number") state.quote[el.name] = parseFloat(el.value) || 0;
    }
  }
  const cf = $("#colourForm");
  if (cf && state.colour) {
    state.colour.name = cf.colourName.value || state.colour.name;
    state.colour.hex = cf.colourHex.value || state.colour.hex;
    state.colour.brand = cf.colourBrand.value || state.colour.brand;
    state.colour.code = cf.colourCode.value || state.colour.code;
  }
  const af = $("#apiForm");
  if (af) {
    for (const el of af.elements) {
      if (!el.name) continue;
      state.api[el.name] = el.value;
    }
  }
}

function fillProjectForm() {
  const pf = $("#projectForm");
  for (const [k, v] of Object.entries(state.project)) {
    if (pf[k]) pf[k].value = v ?? "";
  }
}

function fillQuoteForm() {
  const qf = $("#quoteForm");
  for (const [k, v] of Object.entries(state.quote)) {
    if (!qf[k]) continue;
    if (qf[k].type === "checkbox") qf[k].checked = !!v;
    else qf[k].value = v;
  }
}

function fillColourForm() {
  const cf = $("#colourForm");
  if (!state.colour) return;
  cf.colourName.value = state.colour.name || "";
  cf.colourHex.value = state.colour.hex || "";
  cf.colourBrand.value = state.colour.brand || "";
  cf.colourCode.value = state.colour.code || "";
}

function fillApiForm() {
  const af = $("#apiForm");
  for (const [k, v] of Object.entries(state.api)) {
    if (af[k]) af[k].value = v ?? "";
  }
}

/* ——— Canvas / wall marking ——— */

function getCanvas() {
  return $("#photoCanvas");
}

function canvasMetrics() {
  const canvas = getCanvas();
  const rect = canvas.getBoundingClientRect();
  return { canvas, rect, w: rect.width, h: rect.height };
}

function drawCanvas() {
  const wrap = $("#canvasWrap");
  if (!state.imageDataUrl) {
    wrap.hidden = true;
    return;
  }
  wrap.hidden = false;
  const canvas = getCanvas();
  const ctx = canvas.getContext("2d");
  if (!canvasImage) {
    canvasImage = new Image();
    canvasImage.onload = () => drawCanvas();
    canvasImage.src = state.imageDataUrl;
    return;
  }
  const maxW = wrap.clientWidth;
  const ratio = canvasImage.height / canvasImage.width;
  const displayW = maxW;
  const displayH = maxW * ratio;
  canvas.width = displayW * devicePixelRatio;
  canvas.height = displayH * devicePixelRatio;
  canvas.style.width = displayW + "px";
  canvas.style.height = displayH + "px";
  ctx.setTransform(devicePixelRatio, 0, 0, devicePixelRatio, 0, 0);
  ctx.clearRect(0, 0, displayW, displayH);
  ctx.drawImage(canvasImage, 0, 0, displayW, displayH);

  const hex = state.colour?.hex || "#a8b89d";
  ctx.beginPath();
  state.points.forEach((p, i) => {
    const x = p.x * displayW;
    const y = p.y * displayH;
    if (i === 0) ctx.moveTo(x, y);
    else ctx.lineTo(x, y);
  });
  ctx.closePath();
  ctx.fillStyle = hexToRgba(hex, 0.42);
  ctx.fill();
  ctx.strokeStyle = "#8ba888";
  ctx.lineWidth = 2.5;
  ctx.stroke();

  state.points.forEach((p) => {
    const x = p.x * displayW;
    const y = p.y * displayH;
    ctx.beginPath();
    ctx.arc(x, y, 10, 0, Math.PI * 2);
    ctx.fillStyle = "#fff";
    ctx.fill();
    ctx.strokeStyle = "#8b5cf6";
    ctx.lineWidth = 2;
    ctx.stroke();
  });
}

function hexToRgba(hex, a) {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const n = parseInt(full, 16);
  const r = (n >> 16) & 255;
  const g = (n >> 8) & 255;
  const b = n & 255;
  return `rgba(${r},${g},${b},${a})`;
}

function pointerToNorm(e) {
  const { rect, w, h } = canvasMetrics();
  const clientX = e.touches ? e.touches[0].clientX : e.clientX;
  const clientY = e.touches ? e.touches[0].clientY : e.clientY;
  return {
    x: Math.min(1, Math.max(0, (clientX - rect.left) / w)),
    y: Math.min(1, Math.max(0, (clientY - rect.top) / h)),
  };
}

function hitTestPoint(norm) {
  const { w, h } = canvasMetrics();
  for (let i = 0; i < state.points.length; i++) {
    const px = state.points[i].x * w;
    const py = state.points[i].y * h;
    const dx = norm.x * w - px;
    const dy = norm.y * h - py;
    if (Math.hypot(dx, dy) < 22) return i;
  }
  return -1;
}

function setupCanvasEvents() {
  const canvas = getCanvas();
  canvas.addEventListener("pointerdown", (e) => {
    if (!state.imageDataUrl) return;
    const norm = pointerToNorm(e);
    const hit = hitTestPoint(norm);
    if (hit >= 0) {
      dragIndex = hit;
      canvas.setPointerCapture(e.pointerId);
    } else {
      state.points.push(norm);
      drawCanvas();
    }
  });
  canvas.addEventListener("pointermove", (e) => {
    if (dragIndex === null) return;
    state.points[dragIndex] = pointerToNorm(e);
    drawCanvas();
  });
  canvas.addEventListener("pointerup", () => {
    dragIndex = null;
    saveProjectQuiet();
  });
}

/* ——— Walls ——— */

function newWall() {
  return {
    id: "w-" + Date.now(),
    name: `Wall ${state.walls.length + 1}`,
    width: 3.4,
    height: 2.5,
    deductions: 0,
    coats: 2,
    coveragePerLitre: 10,
    wastePercent: 10,
    points: state.points.map((p) => ({ ...p })),
    imageDataUrl: state.imageDataUrl,
  };
}

function saveWallFromPhoto() {
  if (!state.imageDataUrl) {
    toast("Add a room photo first");
    return;
  }
  if (state.points.length < 3) {
    toast("Mark at least 3 corner points");
    return;
  }
  const wall = newWall();
  if (state.editingWallId) {
    const idx = state.walls.findIndex((w) => w.id === state.editingWallId);
    if (idx >= 0) {
      wall.name = state.walls[idx].name;
      wall.width = state.walls[idx].width;
      wall.height = state.walls[idx].height;
      wall.deductions = state.walls[idx].deductions;
      wall.coats = state.walls[idx].coats;
      wall.coveragePerLitre = state.walls[idx].coveragePerLitre;
      wall.wastePercent = state.walls[idx].wastePercent;
      state.walls[idx] = wall;
    }
  } else {
    state.walls.push(wall);
  }
  state.editingWallId = null;
  toast("Wall outline saved — enter measurements in Walls");
  setStep("walls");
}

function renderWalls() {
  const list = $("#wallsList");
  const metrics = $("#wallsMetrics");
  if (!state.walls.length) {
    list.innerHTML = `<p class="empty">No walls saved yet. Mark a wall on the photo and tap <strong>Save wall outline</strong>.</p>`;
    metrics.innerHTML = "";
    return;
  }
  list.innerHTML = state.walls
    .map(
      (w, i) => `
    <article class="wall-card" data-wall-id="${w.id}">
      <div class="wall-card__head">
        <h3>${escapeHtml(w.name)}</h3>
        <button type="button" class="link-btn" data-edit-wall="${w.id}">Edit on photo</button>
      </div>
      <div class="form-grid form-grid--compact">
        <label>Name<input data-field="name" data-wall="${w.id}" value="${escapeAttr(w.name)}" /></label>
        <label>Width (m)<input data-field="width" data-wall="${w.id}" type="number" min="0" step="0.01" value="${w.width}" /></label>
        <label>Height (m)<input data-field="height" data-wall="${w.id}" type="number" min="0" step="0.01" value="${w.height}" /></label>
        <label>Deductions (m²)<input data-field="deductions" data-wall="${w.id}" type="number" min="0" step="0.01" value="${w.deductions}" /></label>
        <label>Coats<input data-field="coats" data-wall="${w.id}" type="number" min="1" value="${w.coats}" /></label>
        <label>Coverage (m²/L)<input data-field="coveragePerLitre" data-wall="${w.id}" type="number" min="1" step="0.5" value="${w.coveragePerLitre}" /></label>
        <label>Waste %<input data-field="wastePercent" data-wall="${w.id}" type="number" min="0" value="${w.wastePercent}" /></label>
      </div>
      <dl class="wall-stats">
        <div><dt>Gross</dt><dd>${wallGross(w).toFixed(2)} m²</dd></div>
        <div><dt>Net</dt><dd>${wallNet(w).toFixed(2)} m²</dd></div>
        <div><dt>Paint</dt><dd>${wallLitres(w).toFixed(1)} L</dd></div>
      </dl>
      <button type="button" class="link-btn link-btn--danger" data-remove-wall="${w.id}">Remove wall</button>
    </article>`
    )
    .join("");

  list.querySelectorAll("[data-field]").forEach((input) => {
    input.addEventListener("input", () => {
      const wall = state.walls.find((w) => w.id === input.dataset.wall);
      if (!wall) return;
      const f = input.dataset.field;
      wall[f] = input.type === "number" ? parseFloat(input.value) || 0 : input.value;
      renderWalls();
      saveProjectQuiet();
    });
  });
  list.querySelectorAll("[data-edit-wall]").forEach((btn) => {
    btn.addEventListener("click", () => {
      const wall = state.walls.find((w) => w.id === btn.dataset.editWall);
      if (!wall) return;
      state.editingWallId = wall.id;
      state.imageDataUrl = wall.imageDataUrl;
      state.points = wall.points.map((p) => ({ ...p }));
      canvasImage = null;
      setStep("photo");
      toast("Editing wall on photo");
    });
  });
  list.querySelectorAll("[data-remove-wall]").forEach((btn) => {
    btn.addEventListener("click", () => {
      state.walls = state.walls.filter((w) => w.id !== btn.dataset.removeWall);
      renderWalls();
      saveProjectQuiet();
    });
  });

  const t = totals();
  metrics.innerHTML = `
    <div class="metric"><span>Total paintable area</span><strong>${t.totalArea.toFixed(2)} m²</strong></div>
    <div class="metric"><span>Total paint required</span><strong>${t.totalLitres.toFixed(1)} L</strong></div>
    <div class="metric"><span>Recommended tins</span><strong>${t.tins.tins5L} × 5L, ${t.tins.tins25L} × 2.5L</strong></div>`;
}

function escapeHtml(s) {
  return String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
}

function escapeAttr(s) {
  return escapeHtml(s).replace(/"/g, "&quot;");
}

/* ——— Colour ——— */

function renderSwatches() {
  const grid = $("#swatchGrid");
  grid.innerHTML = STARTER_COLOURS.map(
    (c) => `
    <button type="button" class="swatch ${state.colour?.code === c.code ? "is-selected" : ""}" data-code="${c.code}" role="listitem" aria-label="Select ${c.name}">
      <span class="swatch__chip" style="background:${c.hex}"></span>
      <span class="swatch__name">${c.name}</span>
      <span class="swatch__code">${c.code}</span>
    </button>`
  ).join("");
  grid.querySelectorAll(".swatch").forEach((btn) => {
    btn.addEventListener("click", () => {
      const c = STARTER_COLOURS.find((x) => x.code === btn.dataset.code);
      state.colour = { ...c, brand: state.colour?.brand || "Custom" };
      fillColourForm();
      renderSwatches();
      renderColourSummary();
      drawCanvas();
      saveProjectQuiet();
    });
  });
  renderColourSummary();
}

function renderColourSummary() {
  const el = $("#colourSummary");
  if (!state.colour) {
    el.innerHTML = "";
    return;
  }
  el.innerHTML = `
    <div class="colour-summary__chip" style="background:${state.colour.hex}"></div>
    <div>
      <strong>${escapeHtml(state.colour.name)}</strong>
      <p>${escapeHtml(state.colour.brand || "")} · ${escapeHtml(state.colour.code || "")} · ${state.colour.hex}</p>
    </div>`;
}

/* ——— Quote ——— */

function buildQuoteText() {
  syncFormsToState();
  const p = state.project;
  const c = state.colour || {};
  const t = totals();
  return `PaintView Pro Quote
Project: ${p.projectName}
Reference: ${p.quoteRef}
Client: ${p.clientName}
Address: ${p.address || "—"}
Paint specification: ${c.brand || ""} ${c.code || ""} — ${c.name || ""} (${c.hex || ""})
Total paintable area: ${t.totalArea.toFixed(2)} m²
Estimated paint required: ${t.totalLitres.toFixed(1)} litres
Recommended tins: ${t.tins.tins5L} × 5L, ${t.tins.tins25L} × 2.5L
Estimated labour: ${state.quote.estimatedDays} day(s)
Labour cost: ${gbp(t.labourCost)}
Paint materials: ${gbp(t.paintCost)}
Prep / materials: ${gbp(state.quote.prepCost)}
Travel / parking: ${gbp(state.quote.travelCost)}
Contingency: ${gbp(t.contingency)}
VAT: ${gbp(t.vat)}
Total quote: ${gbp(t.total)}

Notes:
${p.notes || "—"}

This quote is a guide until final site conditions are confirmed.`;
}

function renderQuote() {
  syncFormsToState();
  const t = totals();
  const p = state.project;
  const c = state.colour || {};
  $("#quoteSheet").innerHTML = `
    <div class="quote-sheet__header">
      <p class="quote-sheet__brand">PaintView Pro</p>
      <h3>${escapeHtml(p.projectName)}</h3>
      <p class="quote-sheet__meta">${escapeHtml(p.clientName)} · ${escapeHtml(p.address || "")}</p>
    </div>
    <dl class="quote-sheet__rows">
      <div><dt>Paint colour</dt><dd>${escapeHtml(c.name || "—")} <span class="paint-chip" style="background:${c.hex}"></span></dd></div>
      <div><dt>Paintable area</dt><dd>${t.totalArea.toFixed(2)} m²</dd></div>
      <div><dt>Paint required</dt><dd>${t.totalLitres.toFixed(1)} L (${t.tins.tins5L}×5L + ${t.tins.tins25L}×2.5L)</dd></div>
      <div><dt>Labour (${state.quote.estimatedDays} days)</dt><dd>${gbp(t.labourCost)}</dd></div>
      <div><dt>Paint materials</dt><dd>${gbp(t.paintCost)}</dd></div>
      <div><dt>Prep / travel</dt><dd>${gbp(state.quote.prepCost + state.quote.travelCost)}</dd></div>
      <div><dt>Contingency</dt><dd>${gbp(t.contingency)}</dd></div>
      <div><dt>VAT</dt><dd>${gbp(t.vat)}</dd></div>
      <div class="quote-sheet__total"><dt>Total</dt><dd>${gbp(t.total)}</dd></div>
    </dl>`;
}

async function copyQuote() {
  const text = buildQuoteText();
  await navigator.clipboard.writeText(text);
  toast("Quote copied to clipboard");
}

async function shareQuote() {
  const text = buildQuoteText();
  if (navigator.share) {
    await navigator.share({ title: "PaintView Pro Quote", text });
    toast("Share sheet opened");
  } else {
    await copyQuote();
  }
}

function printQuote() {
  window.print();
}

/* ——— Init ——— */

function hydrateUI() {
  fillProjectForm();
  fillQuoteForm();
  fillColourForm();
  fillApiForm();
  renderSwatches();
  renderWalls();
  renderQuote();
  drawCanvas();
  setStep(state.activeStep || "project");
}

function bindEvents() {
  $("#btnStartQuote").addEventListener("click", () => setStep("project"));
  $("#btnLoadProject").addEventListener("click", loadProject);
  $("#btnSaveProject").addEventListener("click", saveProject);
  $("#btnSaveQuote").addEventListener("click", saveProject);
  $("#btnClearProject").addEventListener("click", clearProject);
  $("#btnCopyQuote").addEventListener("click", copyQuote);
  $("#btnShareQuote").addEventListener("click", shareQuote);
  $("#btnPrintQuote").addEventListener("click", printQuote);
  $("#btnUseColour").addEventListener("click", () => {
    syncFormsToState();
    drawCanvas();
    toast("Colour applied to wall preview");
  });

  document.querySelectorAll("[data-goto]").forEach((btn) => {
    btn.addEventListener("click", () => setStep(btn.dataset.goto));
  });

  $("#stepNav").addEventListener("click", (e) => {
    const btn = e.target.closest(".step");
    if (btn) setStep(btn.dataset.step);
  });

  $("#photoInput").addEventListener("change", (e) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = () => {
      state.imageDataUrl = reader.result;
      canvasImage = null;
      state.points = DEFAULT_POINTS.map((p) => ({ ...p }));
      drawCanvas();
      saveProjectQuiet();
      toast("Photo loaded");
    };
    reader.readAsDataURL(file);
  });

  $("#btnResetPoints").addEventListener("click", () => {
    state.points = DEFAULT_POINTS.map((p) => ({ ...p }));
    drawCanvas();
  });
  $("#btnFullWall").addEventListener("click", () => {
    state.points = [
      { x: 0.02, y: 0.02 },
      { x: 0.98, y: 0.02 },
      { x: 0.98, y: 0.98 },
      { x: 0.02, y: 0.98 },
    ];
    drawCanvas();
  });
  $("#btnSaveWallFromPhoto").addEventListener("click", saveWallFromPhoto);
  $("#btnAddWall").addEventListener("click", () => {
    state.walls.push(newWall());
    renderWalls();
    saveProjectQuiet();
  });

  ["#projectForm", "#quoteForm", "#colourForm", "#apiForm"].forEach((sel) => {
    $(sel)?.addEventListener("input", () => {
      syncFormsToState();
      if (sel === "#quoteForm") renderQuote();
      if (sel === "#colourForm") {
        renderColourSummary();
        drawCanvas();
      }
      saveProjectQuiet();
    });
  });

  setupCanvasEvents();
  window.addEventListener("resize", () => {
    if (state.activeStep === "photo") drawCanvas();
  });
}

function init() {
  if (localStorage.getItem(STORAGE_KEY)) loadProject();
  else hydrateUI();
  bindEvents();
}

document.addEventListener("DOMContentLoaded", init);

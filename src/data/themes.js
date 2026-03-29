// prompt-studio-themes.js
// 4 theme families × 2 modes (light + dark) = 8 total entries
// All color pairs audited for WCAG AAA compliance (7:1 normal, 4.5:1 large)

export const THEMES = [
  // ─── SLATE ───────────────────────────────────────
  {
    id: "slate",
    name: "Slate",
    vibe: "Blue-grey · Professional",
    dark: false,
    family: "slate",
    colors: {
      bg:        "#F0F4F8",
      surf:      "#FFFFFF",
      bord:      "#CBD5E1",
      text:      "#0F1729",
      textSub:   "#3D4663",
      acc:       "#1D4ED8",
      accLight:  "#EEF2FF",
      accText:   "#1E3A8A",
      grad:      ["#3B82F6", "#6366F1"],
      inBg:      "#F8FAFC",
      inBord:    "#E2E8F0",
      outBg:     "#EFF6FF",
      outBord:   "#BFDBFE",
      badgeBg:   "#EEF2FF",
      badgeTx:   "#1E3A8A",
      swatches:  ["#F0F4F8", "#FFFFFF", "#CBD5E1", "#3B82F6", "#6366F1"],
      tokens: [
        { bg: "#EEF2FF", tx: "#312E81" },
        { bg: "#DBEAFE", tx: "#1E3A8A" },
        { bg: "#EDE9FE", tx: "#4C1D95" },
        { bg: "#DCFCE7", tx: "#14532D" },
        { bg: "#FEF9C3", tx: "#713F12" },
      ],
    },
  },
  {
    id: "slate-dark",
    name: "Slate",
    vibe: "Deep blue-grey · Professional",
    dark: true,
    family: "slate",
    colors: {
      bg:        "#0F1219",
      surf:      "#161B26",
      bord:      "#232B3A",
      text:      "#E8EDF5",
      textSub:   "#9CABC4",
      acc:       "#93C5FD",
      accLight:  "#0F1B30",
      accText:   "#BFDBFE",
      grad:      ["#3B82F6", "#6366F1"],
      inBg:      "#121722",
      inBord:    "#1E2636",
      outBg:     "#0F1B30",
      outBord:   "#1E3A5F",
      badgeBg:   "#0F1B30",
      badgeTx:   "#93C5FD",
      swatches:  ["#0F1219", "#161B26", "#232B3A", "#3B82F6", "#6366F1"],
      tokens: [
        { bg: "#1A1F3A", tx: "#A5B4FC" },
        { bg: "#0F1B30", tx: "#93C5FD" },
        { bg: "#1E1635", tx: "#C4B5FD" },
        { bg: "#0B2A1A", tx: "#86EFAC" },
        { bg: "#2A2008", tx: "#FDE68A" },
      ],
    },
  },

  // ─── SAKURA ──────────────────────────────────────
  {
    id: "sakura",
    name: "Sakura",
    vibe: "Pink · Soft",
    dark: false,
    family: "sakura",
    colors: {
      bg:        "#FFF5F7",
      surf:      "#FFFFFF",
      bord:      "#FFD6E0",
      text:      "#2D1520",
      textSub:   "#6B3A4A",
      acc:       "#9B1B42",
      accLight:  "#FFF0F3",
      accText:   "#880E3A",
      grad:      ["#E91E63", "#FF6B9D"],
      inBg:      "#FFF8F9",
      inBord:    "#FFD6E0",
      outBg:     "#FFF0F3",
      outBord:   "#FFBDD0",
      badgeBg:   "#FFE8EE",
      badgeTx:   "#880E3A",
      swatches:  ["#FFF5F7", "#FFFFFF", "#FFD6E0", "#E91E63", "#FF6B9D"],
      tokens: [
        { bg: "#FFE8EE", tx: "#880E3A" },
        { bg: "#E8F4FD", tx: "#0D3B66" },
        { bg: "#F3E5F5", tx: "#5C1380" },
        { bg: "#E8F5E9", tx: "#1A4D24" },
        { bg: "#FFF8E1", tx: "#7C2D12" },
      ],
    },
  },
  {
    id: "sakura-dark",
    name: "Sakura",
    vibe: "Deep rose · Warm night",
    dark: true,
    family: "sakura",
    colors: {
      bg:        "#140A0E",
      surf:      "#1C1015",
      bord:      "#2E1820",
      text:      "#F8DDE6",
      textSub:   "#D4A0B2",
      acc:       "#F8A4BE",
      accLight:  "#200E15",
      accText:   "#FBCAD8",
      grad:      ["#E91E63", "#FF6B9D"],
      inBg:      "#180C12",
      inBord:    "#2A141C",
      outBg:     "#200E15",
      outBord:   "#3A1828",
      badgeBg:   "#200E15",
      badgeTx:   "#F8A4BE",
      swatches:  ["#140A0E", "#1C1015", "#2E1820", "#E91E63", "#FF6B9D"],
      tokens: [
        { bg: "#2A0E18", tx: "#F8A4BE" },
        { bg: "#0A1520", tx: "#7DD3FC" },
        { bg: "#1E0A25", tx: "#D8B4FE" },
        { bg: "#0A200E", tx: "#86EFAC" },
        { bg: "#251A08", tx: "#FCD34D" },
      ],
    },
  },

  // ─── CHALK ───────────────────────────────────────
  {
    id: "chalk",
    name: "Chalk",
    vibe: "Warm cream · Editorial",
    dark: false,
    family: "chalk",
    colors: {
      bg:        "#FDFAF5",
      surf:      "#FFFFFF",
      bord:      "#E8E0D0",
      text:      "#2C1F0E",
      textSub:   "#5C4630",
      acc:       "#5C3D1E",
      accLight:  "#F5EFE6",
      accText:   "#3D2510",
      grad:      ["#6B4C2A", "#A0784A"],
      inBg:      "#FAF7F0",
      inBord:    "#E8E0D0",
      outBg:     "#F5EFE6",
      outBord:   "#D8C8B0",
      badgeBg:   "#F0E8D8",
      badgeTx:   "#3D2510",
      swatches:  ["#FDFAF5", "#FFFFFF", "#E8E0D0", "#6B4C2A", "#A0784A"],
      tokens: [
        { bg: "#EDE8E0", tx: "#3D2510" },
        { bg: "#E0EAF5", tx: "#142E5C" },
        { bg: "#EAE0F0", tx: "#3A1552" },
        { bg: "#E0F0E8", tx: "#143D22" },
        { bg: "#F5EDD8", tx: "#4A2E08" },
      ],
    },
  },
  {
    id: "chalk-dark",
    name: "Chalk",
    vibe: "Warm espresso · Night editorial",
    dark: true,
    family: "chalk",
    colors: {
      bg:        "#110E0A",
      surf:      "#1A1610",
      bord:      "#2C2618",
      text:      "#F2EAD3",
      textSub:   "#B8A888",
      acc:       "#DEB87A",
      accLight:  "#1A1408",
      accText:   "#E8CFA0",
      grad:      ["#8B6B3A", "#C49A5C"],
      inBg:      "#14110C",
      inBord:    "#242018",
      outBg:     "#1A1408",
      outBord:   "#302818",
      badgeBg:   "#1A1408",
      badgeTx:   "#DEB87A",
      swatches:  ["#110E0A", "#1A1610", "#2C2618", "#8B6B3A", "#C49A5C"],
      tokens: [
        { bg: "#1E1808", tx: "#DEB87A" },
        { bg: "#081220", tx: "#7DD3FC" },
        { bg: "#160A22", tx: "#C4B5FD" },
        { bg: "#081A0C", tx: "#86EFAC" },
        { bg: "#201808", tx: "#FCD34D" },
      ],
    },
  },

  // ─── SAGE ────────────────────────────────────────
  {
    id: "sage",
    name: "Sage",
    vibe: "Muted green · Calm",
    dark: false,
    family: "sage",
    colors: {
      bg:        "#F2F5F0",
      surf:      "#FFFFFF",
      bord:      "#D0DAC8",
      text:      "#1C2818",
      textSub:   "#3D5030",
      acc:       "#2E5A3A",
      accLight:  "#E4F0E4",
      accText:   "#1B4028",
      grad:      ["#4A7C59", "#7FB069"],
      inBg:      "#F7F9F5",
      inBord:    "#D8E4D0",
      outBg:     "#EBF2E8",
      outBord:   "#C0D8B8",
      badgeBg:   "#E4F0E4",
      badgeTx:   "#1B4028",
      swatches:  ["#F2F5F0", "#FFFFFF", "#D0DAC8", "#4A7C59", "#7FB069"],
      tokens: [
        { bg: "#E8F2E8", tx: "#1B4028" },
        { bg: "#E0EAF8", tx: "#142E6A" },
        { bg: "#EDE8F5", tx: "#3A1860" },
        { bg: "#E0F5E8", tx: "#104018" },
        { bg: "#F5EEE0", tx: "#4A3008" },
      ],
    },
  },
  {
    id: "sage-dark",
    name: "Sage",
    vibe: "Forest night · Deep calm",
    dark: true,
    family: "sage",
    colors: {
      bg:        "#0A100C",
      surf:      "#121A14",
      bord:      "#1E2A20",
      text:      "#D8EAD8",
      textSub:   "#90B895",
      acc:       "#86EFAC",
      accLight:  "#0C1A0E",
      accText:   "#A7F3D0",
      grad:      ["#4A7C59", "#7FB069"],
      inBg:      "#0E140F",
      inBord:    "#1A2418",
      outBg:     "#0C1A0E",
      outBord:   "#183020",
      badgeBg:   "#0C1A0E",
      badgeTx:   "#86EFAC",
      swatches:  ["#0A100C", "#121A14", "#1E2A20", "#4A7C59", "#7FB069"],
      tokens: [
        { bg: "#0E200E", tx: "#86EFAC" },
        { bg: "#0A1420", tx: "#7DD3FC" },
        { bg: "#160C25", tx: "#C4B5FD" },
        { bg: "#0A220A", tx: "#86EFAC" },
        { bg: "#201A0A", tx: "#FCD34D" },
      ],
    },
  },
];

// ── Pairing map: light ↔ dark ──
export const DARK_PAIRS = {
  "slate":        "slate-dark",
  "slate-dark":   "slate",
  "sakura":       "sakura-dark",
  "sakura-dark":  "sakura",
  "chalk":        "chalk-dark",
  "chalk-dark":   "chalk",
  "sage":         "sage-dark",
  "sage-dark":    "sage",
};

// The 4 base families for the Appearance picker
export const THEME_FAMILIES = ["slate", "sakura", "chalk", "sage"];

export const DEFAULT_THEME_ID = "chalk";

export function getTheme(id) {
  return THEMES.find((t) => t.id === id) || THEMES.find((t) => t.id === DEFAULT_THEME_ID);
}

/**
 * Apply a theme's colors as CSS custom properties on :root.
 */
export function applyTheme(themeId) {
  const theme = getTheme(themeId);
  if (!theme) return;
  const r = document.documentElement;
  const c = theme.colors;

  // ── New --ps-* tokens ──
  r.style.setProperty("--ps-bg",         c.bg);
  r.style.setProperty("--ps-surf",       c.surf);
  r.style.setProperty("--ps-bord",       c.bord);
  r.style.setProperty("--ps-text",       c.text);
  r.style.setProperty("--ps-text-sub",   c.textSub);
  r.style.setProperty("--ps-acc",        c.acc);
  r.style.setProperty("--ps-acc-light",  c.accLight);
  r.style.setProperty("--ps-acc-text",   c.accText);
  r.style.setProperty("--ps-grad-start", c.grad[0]);
  r.style.setProperty("--ps-grad-end",   c.grad[1]);
  r.style.setProperty("--ps-in-bg",      c.inBg);
  r.style.setProperty("--ps-in-bord",    c.inBord);
  r.style.setProperty("--ps-out-bg",     c.outBg);
  r.style.setProperty("--ps-out-bord",   c.outBord);
  r.style.setProperty("--ps-badge-bg",   c.badgeBg);
  r.style.setProperty("--ps-badge-tx",   c.badgeTx);

  // ── Map to existing --color-* tokens so Tailwind classes work ──
  r.style.setProperty("--color-bg",             c.bg);
  r.style.setProperty("--color-bg-secondary",   c.surf);
  r.style.setProperty("--color-surface",        c.surf);
  r.style.setProperty("--color-surface-hover",  c.outBg);
  r.style.setProperty("--color-surface-alt",    c.inBg);
  r.style.setProperty("--color-surface-glass",
    theme.dark
      ? c.surf + "D9"
      : c.surf + "B8"
  );
  r.style.setProperty("--color-border",         c.bord);
  r.style.setProperty("--color-border-light",   c.inBord);
  r.style.setProperty("--color-border-focus",   c.outBord);
  r.style.setProperty("--color-text",           c.text);
  r.style.setProperty("--color-text-secondary", c.textSub);
  r.style.setProperty("--color-text-tertiary",  c.textSub);
  r.style.setProperty("--color-text-inverse",   theme.dark ? c.bg : "#FFFFFF");
  r.style.setProperty("--color-accent",         c.acc);
  r.style.setProperty("--color-accent-hover",   c.accText);
  r.style.setProperty("--color-accent-light",   c.accLight);
  r.style.setProperty("--color-accent-text",    c.accText);
  r.style.setProperty("--gradient-accent",
    `linear-gradient(135deg, ${c.grad[0]} 0%, ${c.grad[1]} 100%)`);

  // Shadows
  if (theme.dark) {
    r.style.setProperty("--shadow-sm",  "0 1px 2px rgba(0,0,0,0.3)");
    r.style.setProperty("--shadow-md",  "0 2px 8px rgba(0,0,0,0.35), 0 1px 2px rgba(0,0,0,0.25)");
    r.style.setProperty("--shadow-lg",  "0 8px 24px rgba(0,0,0,0.4), 0 2px 8px rgba(0,0,0,0.3)");
    r.style.setProperty("--shadow-glow", `0 0 0 3px ${c.acc}26`);
  } else {
    r.style.setProperty("--shadow-sm",  "0 1px 2px rgba(15,23,41,0.04)");
    r.style.setProperty("--shadow-md",  "0 2px 8px rgba(15,23,41,0.06), 0 1px 2px rgba(15,23,41,0.04)");
    r.style.setProperty("--shadow-lg",  "0 8px 24px rgba(15,23,41,0.08), 0 2px 8px rgba(15,23,41,0.04)");
    r.style.setProperty("--shadow-glow", `0 0 0 3px ${c.acc}1F`);
  }

  r.classList.toggle("dark", theme.dark);
  localStorage.setItem("ps-theme", themeId);
}

export function restoreTheme() {
  const saved = localStorage.getItem("ps-theme") ?? DEFAULT_THEME_ID;
  applyTheme(saved);
  return saved;
}

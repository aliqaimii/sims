/**
 * Design tokens for SIMS — the single place to change how the app looks.
 *
 * ┌──────────────────────────────────────────────────────────────────────┐
 * │  TO RE-SKIN THE APP, EDIT THE FOUR VALUES IN `brand` BELOW.          │
 * │  Every tint, shade and surface is derived from them, and every       │
 * │  screen reads from `colors` — there are no hard-coded hex values     │
 * │  left in src/screens.                                               │
 * └──────────────────────────────────────────────────────────────────────┘
 */

// ---------------------------------------------------------------------------
// 1. Brand inputs — change these
// ---------------------------------------------------------------------------
export const brand = {
  /** Primary brand colour: headers, buttons, active states. */
  primary: '#00A473',
  /** Secondary highlight: links, "empty" hints, warnings that aren't errors. */
  accent: '#E08A1E',
  /** Darkest neutral — all text greys are mixed from this. */
  ink: '#16211D',
  /** The page behind the cards. */
  page: '#F5F7F8',
};

// ---------------------------------------------------------------------------
// 2. Colour maths — mixes the ramp so one brand value drives everything
// ---------------------------------------------------------------------------
const clamp = n => Math.max(0, Math.min(255, Math.round(n)));

const toRgb = hex => {
  let h = hex.replace('#', '');
  if (h.length === 3) {
    h = h[0] + h[0] + h[1] + h[1] + h[2] + h[2];
  }
  return [
    parseInt(h.slice(0, 2), 16),
    parseInt(h.slice(2, 4), 16),
    parseInt(h.slice(4, 6), 16),
  ];
};

const toHex = rgb =>
  '#' + rgb.map(v => clamp(v).toString(16).padStart(2, '0')).join('');

/** Blend two colours. amount 0 = a, 1 = b. */
export const mix = (a, b, amount) => {
  const [r1, g1, b1] = toRgb(a);
  const [r2, g2, b2] = toRgb(b);
  return toHex([
    r1 + (r2 - r1) * amount,
    g1 + (g2 - g1) * amount,
    b1 + (b2 - b1) * amount,
  ]);
};

/** Lighten towards white. */
export const tint = (hex, amount) => mix(hex, '#FFFFFF', amount);
/** Darken towards black. */
export const shade = (hex, amount) => mix(hex, '#000000', amount);

// ---------------------------------------------------------------------------
// 3. Derived palette — screens use these, never raw hex
// ---------------------------------------------------------------------------
export const colors = {
  // Brand ramp
  primary: brand.primary,
  primaryDark: shade(brand.primary, 0.22),
  primaryLight: tint(brand.primary, 0.35),
  /** Very light brand wash — icon chips, zebra rows, selected states. */
  primarySurface: tint(brand.primary, 0.9),
  onPrimary: '#FFFFFF',
  /** Muted white for secondary text on a primary background. */
  onPrimaryMuted: 'rgba(255, 255, 255, 0.82)',

  // Surfaces
  background: brand.page,
  surface: '#FFFFFF',
  surfaceAlt: mix(brand.page, '#FFFFFF', 0.55),

  // Lines
  border: mix(brand.ink, brand.page, 0.86),
  divider: mix(brand.ink, brand.page, 0.94),

  // Text
  textPrimary: brand.ink,
  textSecondary: tint(brand.ink, 0.42),
  textMuted: tint(brand.ink, 0.6),
  textOnDark: '#FFFFFF',

  // Accents and status
  accent: brand.accent,
  danger: '#D14343',
  success: '#2E9E5B',
  warning: tint(brand.accent, 0.15),
};

/** 4pt spacing scale. */
export const spacing = {
  xs: 4,
  sm: 8,
  md: 12,
  lg: 16,
  xl: 24,
  xxl: 32,
};

export const radius = {
  sm: 6,
  md: 10,
  lg: 16,
  pill: 999,
};

/** Type scale — replaces the ad-hoc 15/22/25/30/35 sizes. */
export const typography = {
  display: { fontSize: 28, fontWeight: '700', color: colors.textPrimary },
  title: { fontSize: 24, fontWeight: '600', color: colors.textPrimary },
  subtitle: { fontSize: 20, fontWeight: '600', color: colors.textPrimary },
  body: { fontSize: 16, fontWeight: '400', color: colors.textPrimary },
  label: {
    fontSize: 14,
    fontWeight: '600',
    color: colors.textSecondary,
    letterSpacing: 0.4,
  },
  caption: { fontSize: 12, fontWeight: '400', color: colors.textMuted },
};

/** Cross-platform elevation presets (iOS shadow + Android elevation). */
export const elevation = {
  low: {
    shadowColor: shade(brand.ink, 0.4),
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.08,
    shadowRadius: 2,
    elevation: 2,
  },
  medium: {
    shadowColor: shade(brand.ink, 0.4),
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.12,
    shadowRadius: 6,
    elevation: 5,
  },
};

export default { brand, colors, spacing, radius, typography, elevation, mix, tint, shade };

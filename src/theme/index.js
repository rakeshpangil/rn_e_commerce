/**
 * ============================================================
 * THEME INDEX  (src/theme/index.js)
 * ============================================================
 * Re-exports everything so consumers use one import:
 *   import { colors, typography, spacing } from '../theme';
 * ============================================================
 */

export { colors } from './colors';
export { typography } from './typography';

// ── Spacing scale (multiples of 4 px) ───────────────────────
export const spacing = {
    xs: 4,
    sm: 8,
    md: 12,
    base: 16,
    lg: 20,
    xl: 24,
    '2xl': 32,
    '3xl': 40,
    '4xl': 48,
    '5xl': 64,
};

// ── Border radius ────────────────────────────────────────────
export const borderRadius = {
    sm: 6,
    md: 10,
    lg: 14,
    xl: 20,
    full: 9999,
};

// ── Shadows (Platform-independent values) ────────────────────
export const shadow = {
    sm: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 1 },
        shadowOpacity: 0.05,
        shadowRadius: 3,
        elevation: 2,
    },
    md: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 8,
        elevation: 4,
    },
    lg: {
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 8 },
        shadowOpacity: 0.12,
        shadowRadius: 16,
        elevation: 8,
    },
};

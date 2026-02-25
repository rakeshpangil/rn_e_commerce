/**
 * ============================================================
 * TYPOGRAPHY  (src/theme/typography.js)
 * ============================================================
 * Consistent font sizes, line heights and weights.
 * Use these instead of raw numbers in StyleSheet objects.
 * ============================================================
 */

export const typography = {
    // ── Font sizes (scale based on 16 px base) ─────────────────
    fontSize: {
        xs: 11,
        sm: 13,
        base: 15,
        md: 17,
        lg: 20,
        xl: 24,
        '2xl': 28,
        '3xl': 34,
    },

    // ── Font weights ────────────────────────────────────────────
    fontWeight: {
        regular: '400',
        medium: '500',
        semibold: '600',
        bold: '700',
        extrabold: '800',
    },

    // ── Line heights ────────────────────────────────────────────
    lineHeight: {
        tight: 1.2,
        normal: 1.5,
        relaxed: 1.75,
    },

    // ── Letter spacing ──────────────────────────────────────────
    letterSpacing: {
        tight: -0.5,
        normal: 0,
        wide: 0.5,
        wider: 1,
    },
};

/**
 * ============================================================
 * COLOR PALETTE  (src/theme/colors.js)
 * ============================================================
 * Single source of truth for every colour in the app.
 * Never hard-code a hex value in a component — import from here.
 * ============================================================
 */

export const colors = {
    // ── Brand ──────────────────────────────────────────────────
    primary: '#6C63FF',       // main brand purple
    primaryDark: '#4B44CC',   // pressed / active states
    primaryLight: '#EEF0FF',  // backgrounds, chips

    secondary: '#FF6584',     // CTA accent (wishlist, sale badge)
    accent: '#43C6AC',        // success / confirmation tones

    // ── Backgrounds ────────────────────────────────────────────
    background: '#F5F6FF',    // main screen background
    surface: '#FFFFFF',       // cards, modals, inputs
    surfaceElevated: '#FAFAFF', // slightly raised surfaces

    // ── Text ───────────────────────────────────────────────────
    textPrimary: '#1A1A2E',   // headings, body copy
    textSecondary: '#6B7280', // subtitles, captions
    textMuted: '#9CA3AF',     // placeholders, disabled
    textInverse: '#FFFFFF',   // text on dark backgrounds

    // ── Semantic ───────────────────────────────────────────────
    error: '#EF4444',
    errorLight: '#FEF2F2',
    success: '#10B981',
    successLight: '#ECFDF5',
    warning: '#F59E0B',
    warningLight: '#FFFBEB',

    // ── Borders & Dividers ─────────────────────────────────────
    border: '#E5E7EB',
    divider: '#F3F4F6',

    // ── Misc ───────────────────────────────────────────────────
    shadow: '#000000',
    overlay: 'rgba(0,0,0,0.5)',
    transparent: 'transparent',

    // ── Rating stars ───────────────────────────────────────────
    star: '#F59E0B',
    starEmpty: '#D1D5DB',
};

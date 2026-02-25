/**
 * ============================================================
 * THEME CONTEXT  (src/context/ThemeContext.js)
 * ============================================================
 *
 * HOOKS DEMONSTRATED:
 *   ✅ createContext  — create a context object
 *   ✅ useContext     — consume context without prop drilling
 *   ✅ useState       — track the active theme name
 *   ✅ useMemo        — memoize the context value object
 *   ✅ useCallback    — stable toggleTheme function reference
 *
 * PATTERN: Context + custom hook
 *   Instead of exporting the raw ThemeContext and asking consumers
 *   to call useContext(ThemeContext), we expose a `useTheme()`
 *   hook. This gives a nicer API and lets us throw an error if
 *   the hook is used outside the provider.
 * ============================================================
 */

import React, {
    createContext,   // creates the context object
    useCallback,     // memoize callbacks
    useContext,      // consume context
    useMemo,         // memoize complex values
    useState,        // manage theme state
} from 'react';

import { colors } from '../theme/colors';

// ─── Theme definitions ────────────────────────────────────────
const lightTheme = {
    mode: 'light',
    colors: {
        ...colors,
        background: '#F5F6FF',
        surface: '#FFFFFF',
        textPrimary: '#1A1A2E',
        textSecondary: '#6B7280',
    },
};

const darkTheme = {
    mode: 'dark',
    colors: {
        ...colors,
        background: '#0F0F1A',
        surface: '#1C1C2E',
        textPrimary: '#F9FAFB',
        textSecondary: '#9CA3AF',
        border: '#374151',
    },
};

// ─── Create Context ───────────────────────────────────────────
/**
 * ThemeContext holds:
 *   theme        — the active theme object (lightTheme or darkTheme)
 *   isDark       — boolean shorthand
 *   toggleTheme  — function to switch themes
 */
const ThemeContext = createContext(null);

// ─── Provider Component ───────────────────────────────────────
/**
 * Wrap your entire app (or a sub-tree) with <ThemeProvider> to
 * make the theme available to all descendant components.
 */
export const ThemeProvider = ({ children }) => {
    // useState: track which theme is active
    const [isDark, setIsDark] = useState(false);

    // useCallback: keep toggleTheme reference stable across renders.
    // Without useCallback, every render creates a new function object,
    // causing child components that receive it as a prop to re-render
    // unnecessarily.
    const toggleTheme = useCallback(() => {
        setIsDark(prev => !prev);
    }, []); // empty deps → created once, never changes

    // useMemo: only recompute the context value when isDark changes.
    // This prevents all consumers from re-rendering on every parent render.
    const value = useMemo(
        () => ({
            theme: isDark ? darkTheme : lightTheme,
            isDark,
            toggleTheme,
        }),
        [isDark, toggleTheme],
    );

    return (
        <ThemeContext.Provider value={value}>
            {children}
        </ThemeContext.Provider>
    );
};

// ─── Custom Hook ──────────────────────────────────────────────
/**
 * useTheme()
 *
 * Custom hook that wraps useContext(ThemeContext).
 * Usage:
 *   const { theme, isDark, toggleTheme } = useTheme();
 *
 * Also throws a helpful error if used outside <ThemeProvider>.
 */
export const useTheme = () => {
    const context = useContext(ThemeContext);

    if (!context) {
        throw new Error(
            '[useTheme] Must be used inside <ThemeProvider>. ' +
            'Wrap your app root with <ThemeProvider>.',
        );
    }

    return context;
};

export default ThemeContext;

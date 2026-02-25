/**
 * ============================================================
 * CUSTOM HOOK — useLocalStorage  (src/hooks/useLocalStorage.js)
 * ============================================================
 *
 * Generic hook for persisting any value to AsyncStorage.
 * Combines local React state (fast UI updates) with
 * AsyncStorage persistence (survives app restarts).
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useState    — hold the in-memory value
 *   ✅ useEffect   — load persisted value on mount
 *   ✅ useCallback — stable setter / remover functions
 *
 * USAGE:
 *   const [user, setUser, removeUser] = useLocalStorage('@user', null);
 * ============================================================
 */

import { useState, useEffect, useCallback } from 'react';
import { getItem, setItem, removeItem } from '../utils/storage';

/**
 * @param {string} key          - AsyncStorage key
 * @param {any}    initialValue - Default value if key not found
 * @returns [storedValue, setValue, removeValue, isLoading]
 */
const useLocalStorage = (key, initialValue = null) => {
    const [storedValue, setStoredValue] = useState(initialValue);
    const [isLoading, setIsLoading] = useState(true);

    // ── Load from AsyncStorage on mount ──────────────────────
    useEffect(() => {
        let isMounted = true; // guard against setting state on unmounted component

        const load = async () => {
            try {
                const persisted = await getItem(key);
                if (isMounted) {
                    // Use the persisted value if it exists, otherwise keep the initial
                    setStoredValue(persisted !== null ? persisted : initialValue);
                }
            } catch (err) {
                console.warn(`[useLocalStorage] Failed to load key "${key}"`, err);
            } finally {
                if (isMounted) setIsLoading(false);
            }
        };

        load();

        // Cleanup: prevent state update if the component unmounts before load()
        return () => { isMounted = false; };
    }, [key]); // re-run if the key changes (unusual but safe)

    // ── Setter — updates both state and AsyncStorage ──────────
    const setValue = useCallback(
        async value => {
            try {
                // Support functional update pattern: setValue(prev => prev + 1)
                const valueToStore =
                    value instanceof Function ? value(storedValue) : value;

                setStoredValue(valueToStore);       // update React state (instant)
                await setItem(key, valueToStore);   // persist to disk (async)
            } catch (err) {
                console.error(`[useLocalStorage] Failed to set key "${key}"`, err);
            }
        },
        [key, storedValue],
    );

    // ── Remover — clears both state and AsyncStorage ──────────
    const removeValue = useCallback(async () => {
        try {
            setStoredValue(initialValue);
            await removeItem(key);
        } catch (err) {
            console.error(`[useLocalStorage] Failed to remove key "${key}"`, err);
        }
    }, [key, initialValue]);

    return [storedValue, setValue, removeValue, isLoading];
};

export default useLocalStorage;

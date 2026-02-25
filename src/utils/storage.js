/**
 * ============================================================
 * ASYNC STORAGE UTILS  (src/utils/storage.js)
 * ============================================================
 *
 * Thin wrapper around @react-native-async-storage/async-storage.
 *
 * WHY A WRAPPER?
 *   - AsyncStorage is inherently async and JSON-unaware.
 *     This wrapper handles JSON.stringify / JSON.parse for you.
 *   - Easy to swap the underlying storage engine later
 *     (e.g., encrypted storage) without touching business logic.
 *
 * LEARNING POINTS:
 *   - async/await pattern
 *   - try/catch error handling
 *   - Separation of concerns (utility vs. component)
 * ============================================================
 */

import AsyncStorage from '@react-native-async-storage/async-storage';

/**
 * Save any value (string, object, array) under `key`.
 * Objects are auto-serialized to JSON.
 */
export const setItem = async (key, value) => {
    try {
        const serialized = JSON.stringify(value);
        await AsyncStorage.setItem(key, serialized);
    } catch (error) {
        console.error(`[Storage] setItem failed for key "${key}":`, error);
        throw error;
    }
};

/**
 * Read and deserialize the value stored at `key`.
 * Returns `null` if the key doesn't exist.
 */
export const getItem = async key => {
    try {
        const raw = await AsyncStorage.getItem(key);
        return raw !== null ? JSON.parse(raw) : null;
    } catch (error) {
        console.error(`[Storage] getItem failed for key "${key}":`, error);
        return null;
    }
};

/**
 * Delete the value stored at `key`.
 */
export const removeItem = async key => {
    try {
        await AsyncStorage.removeItem(key);
    } catch (error) {
        console.error(`[Storage] removeItem failed for key "${key}":`, error);
    }
};

/**
 * Wipe ALL keys managed by your app.
 * Call during logout to clear all persisted data.
 */
export const clearStorage = async () => {
    try {
        await AsyncStorage.clear();
    } catch (error) {
        console.error('[Storage] clearStorage failed:', error);
    }
};

// ── Convenience keys ─────────────────────────────────────────
// Keep all AsyncStorage keys in one place to avoid typos
export const STORAGE_KEYS = {
    AUTH_TOKEN: '@rn_e_commerce/auth_token',
    USER: '@rn_e_commerce/user',
    CART: '@rn_e_commerce/cart',
    WISHLIST: '@rn_e_commerce/wishlist',
    THEME: '@rn_e_commerce/theme',
};

/**
 * ============================================================
 * WISHLIST SLICE  (src/store/slices/wishlistSlice.js)
 * ============================================================
 *
 * Manages the list of products the user has "liked".
 * Supports a toggle pattern: tapping the heart adds if absent,
 * removes if already present.
 * ============================================================
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    items: [], // array of full product objects (not IDs)
};

const wishlistSlice = createSlice({
    name: 'wishlist',
    initialState,
    reducers: {
        /**
         * Toggle a product in/out of the wishlist.
         * Payload: product object
         */
        toggleWishlist: (state, action) => {
            const product = action.payload;
            const index = state.items.findIndex(item => item.id === product.id);

            if (index !== -1) {
                // Already in wishlist → remove it
                state.items.splice(index, 1);
            } else {
                // Not in wishlist → add it
                state.items.push(product);
            }
        },

        /** Remove a specific product by ID */
        removeFromWishlist: (state, action) => {
            const productId = action.payload;
            state.items = state.items.filter(item => item.id !== productId);
        },

        /** Clear all wishlist items */
        clearWishlist: () => ({ ...initialState }),

        /** Hydrate from AsyncStorage on app start */
        hydrateWishlist: (state, action) => {
            state.items = action.payload || [];
        },
    },
});

export const {
    toggleWishlist,
    removeFromWishlist,
    clearWishlist,
    hydrateWishlist,
} = wishlistSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectWishlistItems = state => state.wishlist.items;
export const selectWishlistCount = state => state.wishlist.items.length;
export const selectIsWishlisted = productId => state =>
    state.wishlist.items.some(item => item.id === productId);

export default wishlistSlice.reducer;

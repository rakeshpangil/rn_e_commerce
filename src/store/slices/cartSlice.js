/**
 * ============================================================
 * CART SLICE  (src/store/slices/cartSlice.js)
 * ============================================================
 *
 * Cart state is kept entirely in Redux (in-memory + persisted
 * to AsyncStorage via middleware or saveCart saga).
 *
 * Cart item shape:
 *   { product: ProductObject, quantity: number }
 *
 * KEY PATTERNS:
 *   - Immer (built into RTK) lets you write mutations directly
 *     without spreading: state.items.push(...)  ✅ safe!
 *   - findIndex + splice for updates and removals
 * ============================================================
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    // Each element: { product: {...}, quantity: number }
    items: [],
};

const cartSlice = createSlice({
    name: 'cart',
    initialState,
    reducers: {
        /**
         * Add a product.
         * If the product already exists → increment its quantity.
         * Otherwise → push a new item.
         * Payload: { product, quantity }
         */
        addToCart: (state, action) => {
            const { product, quantity = 1 } = action.payload;
            const existing = state.items.findIndex(
                item => item.product.id === product.id,
            );

            if (existing !== -1) {
                // Product already in cart — just increase quantity
                state.items[existing].quantity += quantity;
            } else {
                // New product — add to list
                state.items.push({ product, quantity });
            }
        },

        /**
         * Remove a product entirely, regardless of quantity.
         * Payload: { productId }
         */
        removeFromCart: (state, action) => {
            const { productId } = action.payload;
            state.items = state.items.filter(
                item => item.product.id !== productId,
            );
        },

        /**
         * Set an exact quantity for a product.
         * If quantity ≤ 0 → remove the item.
         * Payload: { productId, quantity }
         */
        updateQuantity: (state, action) => {
            const { productId, quantity } = action.payload;
            const index = state.items.findIndex(
                item => item.product.id === productId,
            );

            if (index === -1) return;

            if (quantity <= 0) {
                state.items.splice(index, 1);
            } else {
                state.items[index].quantity = quantity;
            }
        },

        /** Empty the cart completely */
        clearCart: () => ({ ...initialState }),

        /** Hydrate cart from AsyncStorage on app start */
        hydrateCart: (state, action) => {
            state.items = action.payload || [];
        },
    },
});

export const {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    hydrateCart,
} = cartSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectCartItems = state => state.cart.items;
export const selectCartCount = state =>
    state.cart.items.reduce((n, item) => n + item.quantity, 0);
export const selectCartTotal = state =>
    state.cart.items.reduce(
        (total, item) => total + item.product.price * item.quantity,
        0,
    );

export default cartSlice.reducer;

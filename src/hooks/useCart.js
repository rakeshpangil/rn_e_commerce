/**
 * ============================================================
 * CUSTOM HOOK — useCart  (src/hooks/useCart.js)
 * ============================================================
 *
 * Encapsulates all cart-related Redux state and dispatch calls
 * into a clean, reusable hook.  Components never import slice
 * actions directly — they use this hook instead.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useSelector  — read cart state from Redux store
 *   ✅ useDispatch  — dispatch cart actions
 *   ✅ useCallback  — stable action dispatchers
 *   ✅ useMemo      — derived values (total, count)
 *
 * PATTERN:
 *   "Facade hook" — hides Redux implementation details from UI.
 *   If you later switch from Redux to Zustand, only this file changes.
 *
 * USAGE:
 *   const { items, totalPrice, addItem, removeItem } = useCart();
 * ============================================================
 */

import { useCallback, useMemo } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
} from '../store/slices/cartSlice';
import { calculateCartTotal, calculateCartCount, findCartItem } from '../utils/helpers';

const useCart = () => {
    const dispatch = useDispatch();

    // useSelector: subscribe to cart items from Redux store.
    // This component re-renders only when `cart.items` changes.
    const items = useSelector(state => state.cart.items);

    // ── Derived values with useMemo ───────────────────────────
    // useMemo caches the result and only recomputes when `items` changes.
    // Without useMemo, these calculations run on EVERY render.

    /** Total price of all items in cart */
    const totalPrice = useMemo(() => calculateCartTotal(items), [items]);

    /** Total number of individual units (not unique products) */
    const totalCount = useMemo(() => calculateCartCount(items), [items]);

    /** Whether the cart has any items */
    const isEmpty = useMemo(() => items.length === 0, [items]);

    // ── Stable action dispatchers with useCallback ─────────────
    // useCallback ensures the function reference stays the same
    // between renders, preventing unnecessary child re-renders.

    /** Add a product to the cart (or increment qty if already in cart) */
    const addItem = useCallback(
        product => dispatch(addToCart({ product, quantity: 1 })),
        [dispatch],
    );

    /** Completely remove a product from the cart */
    const removeItem = useCallback(
        productId => dispatch(removeFromCart({ productId })),
        [dispatch],
    );

    /** Set the exact quantity for a cart item */
    const setQuantity = useCallback(
        (productId, quantity) => dispatch(updateQuantity({ productId, quantity })),
        [dispatch],
    );

    /** Increment quantity by 1 */
    const incrementItem = useCallback(
        productId => {
            const item = findCartItem(items, productId);
            if (item) dispatch(updateQuantity({ productId, quantity: item.quantity + 1 }));
        },
        [dispatch, items],
    );

    /** Decrement quantity by 1 (remove if it reaches 0) */
    const decrementItem = useCallback(
        productId => {
            const item = findCartItem(items, productId);
            if (!item) return;
            if (item.quantity <= 1) {
                dispatch(removeFromCart({ productId }));
            } else {
                dispatch(updateQuantity({ productId, quantity: item.quantity - 1 }));
            }
        },
        [dispatch, items],
    );

    /** Remove all items from the cart */
    const clearAllItems = useCallback(() => dispatch(clearCart()), [dispatch]);

    /** Check if a product is already in the cart */
    const isInCart = useCallback(
        productId => items.some(item => item.product.id === productId),
        [items],
    );

    /** Get the quantity of a specific product in the cart */
    const getItemQuantity = useCallback(
        productId => {
            const item = findCartItem(items, productId);
            return item ? item.quantity : 0;
        },
        [items],
    );

    return {
        // State
        items,
        totalPrice,
        totalCount,
        isEmpty,
        // Actions
        addItem,
        removeItem,
        setQuantity,
        incrementItem,
        decrementItem,
        clearAllItems,
        // Utilities
        isInCart,
        getItemQuantity,
    };
};

export default useCart;

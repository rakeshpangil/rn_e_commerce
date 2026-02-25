/**
 * ============================================================
 * HELPER UTILITIES  (src/utils/helpers.js)
 * ============================================================
 * Pure functions used throughout the app.
 * Pure = no side effects, same input → same output.
 * Easy to unit-test in isolation.
 * ============================================================
 */

/**
 * Format a number as a USD currency string.
 * @example formatCurrency(19.99)  →  "$19.99"
 */
export const formatCurrency = (amount, currency = 'USD') => {
    return new Intl.NumberFormat('en-US', {
        style: 'currency',
        currency,
        minimumFractionDigits: 2,
    }).format(amount);
};

/**
 * Truncate a long string to `maxLength` chars and append "…".
 * @example truncateText("Hello World", 5)  →  "Hello…"
 */
export const truncateText = (text, maxLength = 50) => {
    if (!text || text.length <= maxLength) return text;
    return text.substring(0, maxLength) + '…';
};

/**
 * Capitalise the first letter of every word.
 * @example titleCase("hello world")  →  "Hello World"
 */
export const titleCase = str =>
    str
        .toLowerCase()
        .split(' ')
        .map(w => w.charAt(0).toUpperCase() + w.slice(1))
        .join(' ');

/**
 * Calculate the cart total from an array of cart items.
 * Each item: { product: { price }, quantity }
 */
export const calculateCartTotal = items =>
    items.reduce((total, item) => total + item.product.price * item.quantity, 0);

/**
 * Calculate the total number of items in the cart
 * (sum of all quantities, not unique products).
 */
export const calculateCartCount = items =>
    items.reduce((count, item) => count + item.quantity, 0);

/**
 * Round a number to N decimal places.
 * @example roundTo(3.14159, 2)  →  3.14
 */
export const roundTo = (num, decimals = 2) =>
    Math.round((num + Number.EPSILON) * 10 ** decimals) / 10 ** decimals;

/**
 * Generate star rating display data.
 * Returns array of 5 items: 'full' | 'half' | 'empty'
 */
export const getRatingStars = (rating = 0) => {
    return Array.from({ length: 5 }, (_, i) => {
        if (i < Math.floor(rating)) return 'full';
        if (i < rating) return 'half';
        return 'empty';
    });
};

/**
 * Check if a product is in a wishlist array.
 */
export const isInWishlist = (wishlistItems, productId) =>
    wishlistItems.some(item => item.id === productId);

/**
 * Check if a product is in the cart.
 */
export const isInCart = (cartItems, productId) =>
    cartItems.some(item => item.product.id === productId);

/**
 * Find cart item by product ID. Returns undefined if not found.
 */
export const findCartItem = (cartItems, productId) =>
    cartItems.find(item => item.product.id === productId);

/**
 * Calculate discount percentage between original and sale price.
 * @example getDiscountPercent(100, 75) → 25  (25% off)
 */
export const getDiscountPercent = (original, sale) =>
    Math.round(((original - sale) / original) * 100);

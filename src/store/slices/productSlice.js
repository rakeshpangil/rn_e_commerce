/**
 * ============================================================
 * PRODUCT SLICE  (src/store/slices/productSlice.js)
 * ============================================================
 *
 * Manages all product-related state:
 *   - The full list of products from the API
 *   - Category list
 *   - Currently selected product (for detail screen)
 *   - Search query & active category filter (local UI state)
 *   - Loading and error states
 *
 * IMPORTANT PATTERN — UI state in Redux vs. local state:
 *   searchQuery & selectedCategory live in Redux so the
 *   HomeScreen filter state survives tab navigation.
 *   If they were in local useState, they'd reset on navigate.
 * ============================================================
 */

import { createSlice } from '@reduxjs/toolkit';

const initialState = {
    list: [],      // all products array
    categories: [],      // ['electronics', 'jewelery', ...]
    selectedProduct: null,    // product object for detail screen
    selectedCategory: 'all',  // active filter category
    searchQuery: '',      // current search text
    loading: false,
    error: null,
};

const productSlice = createSlice({
    name: 'products',
    initialState,
    reducers: {
        // ── Fetch All Products ─────────────────────────────────
        fetchProductsRequest: (state) => {
            state.loading = true;
            state.error = null;
        },
        fetchProductsSuccess: (state, action) => {
            state.loading = false;
            state.list = action.payload; // array of product objects
        },
        fetchProductsFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ── Fetch Categories ───────────────────────────────────
        fetchCategoriesRequest: (state) => {
            // We can reuse the main loading flag or add a separate one
        },
        fetchCategoriesSuccess: (state, action) => {
            state.categories = action.payload;
        },
        fetchCategoriesFailure: (state, action) => {
            state.error = action.payload;
        },

        // ── Fetch Single Product ───────────────────────────────
        fetchProductByIdRequest: (state) => {
            state.loading = true;
            state.error = null;
            state.selectedProduct = null;
        },
        fetchProductByIdSuccess: (state, action) => {
            state.loading = false;
            state.selectedProduct = action.payload;
        },
        fetchProductByIdFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        clearSelectedProduct: (state) => {
            state.selectedProduct = null;
        },

        // ── Filter / Search ────────────────────────────────────
        setSelectedCategory: (state, action) => {
            state.selectedCategory = action.payload;
        },
        setSearchQuery: (state, action) => {
            state.searchQuery = action.payload;
        },
        clearFilters: (state) => {
            state.selectedCategory = 'all';
            state.searchQuery = '';
        },
    },
});

export const {
    fetchProductsRequest,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchCategoriesRequest,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    fetchProductByIdRequest,
    fetchProductByIdSuccess,
    fetchProductByIdFailure,
    clearSelectedProduct,
    setSelectedCategory,
    setSearchQuery,
    clearFilters,
} = productSlice.actions;

// ─── Selectors ────────────────────────────────────────────────
export const selectProducts = state => state.products.list;
export const selectCategories = state => state.products.categories;
export const selectSelectedProduct = state => state.products.selectedProduct;
export const selectSelectedCategory = state => state.products.selectedCategory;
export const selectSearchQuery = state => state.products.searchQuery;
export const selectProductsLoading = state => state.products.loading;
export const selectProductsError = state => state.products.error;

export default productSlice.reducer;

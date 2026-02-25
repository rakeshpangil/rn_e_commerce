/**
 * ============================================================
 * PRODUCT SAGA  (src/store/sagas/productSaga.js)
 * ============================================================
 *
 * Handles all async product operations:
 *   - Fetch all products (with optional category filter)
 *   - Fetch product categories
 *   - Fetch a single product by ID
 *
 * NEW SAGA EFFECTS DEMONSTRATED HERE:
 *   select(selector) — read a value from current Redux state
 *                      without dispatching an action
 *   takeEvery        — run the handler for EVERY action
 *                      (vs takeLatest which cancels previous)
 * ============================================================
 */

import { call, put, takeLatest, all, select } from 'redux-saga/effects';
import { productAPI } from '../../api/api';
import {
    fetchProductsRequest,
    fetchProductsSuccess,
    fetchProductsFailure,
    fetchCategoriesRequest,
    fetchCategoriesSuccess,
    fetchCategoriesFailure,
    fetchProductByIdRequest,
    fetchProductByIdSuccess,
    fetchProductByIdFailure,
    selectSelectedCategory,
} from '../slices/productSlice';

// ─── FETCH ALL PRODUCTS ───────────────────────────────────────
function* handleFetchProducts(action) {
    try {
        // `select` effect: read current category filter from Redux state.
        // This is how sagas access state WITHOUT needing it in the action payload.
        const selectedCategory = yield select(selectSelectedCategory);

        let products;
        if (selectedCategory && selectedCategory !== 'all') {
            // Fetch products filtered by category
            products = yield call(productAPI.getByCategory, selectedCategory);
        } else {
            // Fetch all products
            products = yield call(productAPI.getAll, 20);
        }

        yield put(fetchProductsSuccess(products));

    } catch (error) {
        yield put(fetchProductsFailure(error.message || 'Failed to load products'));
    }
}

// ─── FETCH CATEGORIES ─────────────────────────────────────────
function* handleFetchCategories() {
    try {
        // API returns: ["electronics", "jewelery", "men's clothing", "women's clothing"]
        const categories = yield call(productAPI.getCategories);
        yield put(fetchCategoriesSuccess(categories));
    } catch (error) {
        yield put(fetchCategoriesFailure(error.message));
    }
}

// ─── FETCH PRODUCT BY ID ──────────────────────────────────────
/**
 * action.payload = productId (number)
 *
 * `takeLatest` is perfect here: if the user navigates to a product
 * detail, then immediately goes back and opens another, the first
 * in-flight request is cancelled automatically.
 */
function* handleFetchProductById(action) {
    try {
        const product = yield call(productAPI.getById, action.payload);
        yield put(fetchProductByIdSuccess(product));
    } catch (error) {
        yield put(fetchProductByIdFailure(error.message));
    }
}

// ─── WATCHER SAGA ─────────────────────────────────────────────
export function* productSaga() {
    yield all([
        // takeLatest: cancels previous in-flight request if a new one arrives
        takeLatest(fetchProductsRequest.type, handleFetchProducts),
        takeLatest(fetchCategoriesRequest.type, handleFetchCategories),
        takeLatest(fetchProductByIdRequest.type, handleFetchProductById),
    ]);
}

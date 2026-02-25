/**
 * ============================================================
 * AUTH SAGA  (src/store/sagas/authSaga.js)
 * ============================================================
 *
 * WHAT IS REDUX SAGA?
 *   redux-saga is a middleware that intercepts Redux actions and
 *   runs "side effects" (API calls, storage access, etc.) in a
 *   controlled, testable way using ES6 Generator functions.
 *
 * WHY GENERATORS (function*)?
 *   Generators can pause (yield) and resume, making async code
 *   look like synchronous code — no callback hell, easy to test.
 *
 * SAGA EFFECTS (from 'redux-saga/effects'):
 *   call(fn, arg)         — call an async function, wait for result
 *   put(action)           — dispatch a Redux action
 *   takeLatest(type, fn)  — listen for action, cancel previous if still running
 *   takeEvery(type, fn)   — listen for action, run for every one
 *   all([...effects])     — run effects in parallel
 *
 * AUTH FLOW:
 *   1. LoginScreen dispatches loginRequest({ username, password })
 *   2. watchLogin saga intercepts it
 *   3. Calls authAPI.login()
 *   4a. Success → put(loginSuccess({ token, user }))
 *   4b. Failure → put(loginFailure(errorMessage))
 * ============================================================
 */

import { call, put, takeLatest, all } from 'redux-saga/effects';
import { authAPI } from '../../api/api';
import { setItem, removeItem, STORAGE_KEYS } from '../../utils/storage';
import {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
    registerRequest,
    registerSuccess,
    registerFailure,
} from '../slices/authSlice';
import { clearCart } from '../slices/cartSlice';
import { clearWishlist } from '../slices/wishlistSlice';

// ─── LOGIN SAGA ───────────────────────────────────────────────
/**
 * Generator function that handles the login flow.
 * `action` contains the payload from loginRequest({ username, password })
 */
function* handleLogin(action) {
    try {
        const { username, password } = action.payload;

        // `call` effect: pauses the saga and waits for the Promise to resolve.
        // This is like `await authAPI.login(...)` but saga-friendly.
        const response = yield call(authAPI.login, { username, password });

        // FakeStore API returns: { token: "..." }
        const token = response.token;

        // Build a minimal user object (FakeStore doesn't return user on login)
        const user = { username, id: Date.now() };

        // `call` effect: persist token to AsyncStorage
        yield call(setItem, STORAGE_KEYS.AUTH_TOKEN, token);
        yield call(setItem, STORAGE_KEYS.USER, user);

        // `put` effect: dispatch success action to Redux
        yield put(loginSuccess({ user, token }));

    } catch (error) {
        // put: dispatch failure action with the error message
        yield put(loginFailure(error.message || 'Login failed. Check your credentials.'));
    }
}

// ─── LOGOUT SAGA ──────────────────────────────────────────────
function* handleLogout() {
    try {
        // Clear persisted data from AsyncStorage
        yield call(removeItem, STORAGE_KEYS.AUTH_TOKEN);
        yield call(removeItem, STORAGE_KEYS.USER);

        // Also clear cart and wishlist from Redux + storage
        yield put(clearCart());
        yield put(clearWishlist());
        yield put(logoutSuccess());

    } catch (error) {
        console.error('[AuthSaga] Logout error:', error);
        // Still logout even if cleanup fails
        yield put(logoutSuccess());
    }
}

// ─── REGISTER SAGA ────────────────────────────────────────────
function* handleRegister(action) {
    try {
        const { username, email, password } = action.payload;

        // FakeStore API /users POST — it's a mock, always succeeds
        // In a real app you'd call authAPI.register(...)
        // Here we just simulate success with a fake token
        const fakeToken = `fake_token_${Date.now()}`;
        const user = { username, email };

        yield call(setItem, STORAGE_KEYS.AUTH_TOKEN, fakeToken);
        yield call(setItem, STORAGE_KEYS.USER, user);

        yield put(registerSuccess({ user, token: fakeToken }));

    } catch (error) {
        yield put(registerFailure(error.message || 'Registration failed.'));
    }
}

// ─── WATCHER SAGA ─────────────────────────────────────────────
/**
 * `takeLatest` listens for an action type and runs a handler.
 * "Latest" means: if the user taps Login twice quickly,
 * it cancels the first call and only processes the second.
 *
 * `takeEvery` would process EVERY action — good for logout
 * where cancellation doesn't make sense.
 */
export function* authSaga() {
    yield all([
        takeLatest(loginRequest.type, handleLogin),
        takeLatest(logoutRequest.type, handleLogout),
        takeLatest(registerRequest.type, handleRegister),
    ]);
}

/**
 * ============================================================
 * AUTH SLICE  (src/store/slices/authSlice.js)
 * ============================================================
 *
 * WHAT IS A SLICE?
 *   Redux Toolkit's createSlice() combines:
 *     1. Initial state definition
 *     2. Action creators (auto-generated from reducer names)
 *     3. Reducer function
 *   into a single file — no more separate actions + reducers!
 *
 * AUTH FLOW (with Redux Saga):
 *   Component dispatches  → loginRequest
 *   Saga intercepts       → calls authAPI.login()
 *   On success: Saga puts → loginSuccess  (stores token + user)
 *   On failure: Saga puts → loginFailure  (stores error message)
 *
 * Demo Credentials (FakeStore API):
 *   username: "johnd"
 *   password: "m38rmF$"
 * ============================================================
 */

import { createSlice } from '@reduxjs/toolkit';

// ─── Initial State ────────────────────────────────────────────
const initialState = {
    user: null,    // user profile object from API
    token: null,    // JWT token string
    isAuthenticated: false,   // quick boolean flag for nav decisions
    loading: false,   // show spinner while API call is in flight
    error: null,    // store error message string or null
};

// ─── Slice Definition ─────────────────────────────────────────
const authSlice = createSlice({
    name: 'auth', // prefix for all action types: "auth/loginRequest" etc.
    initialState,
    reducers: {
        // ── Login ──────────────────────────────────────────────
        /**
         * Dispatched by the Login screen.
         * Saga watches for this and starts the API call.
         * Payload: { username, password }
         */
        loginRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },

        /**
         * Dispatched by saga on success.
         * Payload: { user, token }
         */
        loginSuccess: (state, action) => {
            state.loading = false;
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
            state.error = null;
        },

        /**
         * Dispatched by saga on failure.
         * Payload: error message string
         */
        loginFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ── Logout ─────────────────────────────────────────────
        logoutRequest: state => {
            state.loading = true;
        },

        logoutSuccess: () => {
            // Return the initial state (clean slate after logout)
            // Note: returning a new state object replaces the entire state
            return { ...initialState };
        },

        // ── Register ────────────────────────────────────────────
        registerRequest: (state, action) => {
            state.loading = true;
            state.error = null;
        },

        registerSuccess: (state, action) => {
            state.loading = false;
            // FakeStore API doesn't return user data on register,
            // so we just store the input username for display
            state.user = { username: action.payload.username };
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },

        registerFailure: (state, action) => {
            state.loading = false;
            state.error = action.payload;
        },

        // ── Utility ─────────────────────────────────────────────
        clearError: state => {
            state.error = null;
        },

        // Restore session from AsyncStorage (called on app start)
        restoreSession: (state, action) => {
            state.user = action.payload.user;
            state.token = action.payload.token;
            state.isAuthenticated = true;
        },
    },
});

// ─── Export Actions ───────────────────────────────────────────
// Redux Toolkit auto-generates action creators matching each reducer name
export const {
    loginRequest,
    loginSuccess,
    loginFailure,
    logoutRequest,
    logoutSuccess,
    registerRequest,
    registerSuccess,
    registerFailure,
    clearError,
    restoreSession,
} = authSlice.actions;

// ─── Export Selectors ─────────────────────────────────────────
// Encapsulate selector logic here so components don't know state shape
export const selectAuth = state => state.auth;
export const selectUser = state => state.auth.user;
export const selectToken = state => state.auth.token;
export const selectIsAuthenticated = state => state.auth.isAuthenticated;
export const selectAuthLoading = state => state.auth.loading;
export const selectAuthError = state => state.auth.error;

// ─── Export Reducer ───────────────────────────────────────────
export default authSlice.reducer;

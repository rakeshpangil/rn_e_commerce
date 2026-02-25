/**
 * ============================================================
 * API CLIENT CONFIGURATION (src/api/api.js)
 * ============================================================
 *
 * PURPOSE:
 *   Centralised Axios instance used by every saga/hook that
 *   needs to talk to the backend.  One place to change the
 *   base URL, headers, auth token injection, and error handling.
 *
 * LEARNING POINTS:
 *   - Axios interceptors (request & response)
 *   - Centralized error handling pattern
 *   - API layer separation (screens never call fetch directly)
 *
 * DATA SOURCE:
 *   FakeStore API  →  https://fakestoreapi.com
 *   Demo login     →  username: "johnd"  password: "m38rmF$"
 * ============================================================
 */

import axios from 'axios';

// ─── Base URL ────────────────────────────────────────────────
const BASE_URL = 'https://fakestoreapi.com';

/**
 * Create a pre-configured Axios instance.
 * All requests made through `apiClient` will automatically
 * include these defaults.
 */
const apiClient = axios.create({
    baseURL: BASE_URL,
    timeout: 15000, // abort request if no response in 15 s
    headers: {
        'Content-Type': 'application/json',
    },
});

// ─── REQUEST INTERCEPTOR ─────────────────────────────────────
/**
 * Runs BEFORE every outgoing request.
 * Common uses:
 *   ✅ Inject Authorization header (Bearer token)
 *   ✅ Log outgoing requests in DEV mode
 *   ✅ Add timestamps / request IDs
 */
apiClient.interceptors.request.use(
    config => {
        // In a real app you'd read the token from AsyncStorage or Redux:
        // const token = store.getState().auth.token;
        // if (token) config.headers.Authorization = `Bearer ${token}`;

        if (__DEV__) {
            console.log(`[API ▶] ${config.method?.toUpperCase()} ${config.url}`);
        }
        return config;
    },
    error => {
        console.error('[API Request Error]', error);
        return Promise.reject(error);
    },
);

// ─── RESPONSE INTERCEPTOR ────────────────────────────────────
/**
 * Runs AFTER every response arrives.
 * Common uses:
 *   ✅ Return response.data instead of the full AxiosResponse
 *   ✅ Handle 401 Unauthorized (token refresh / force logout)
 *   ✅ Normalise error messages
 */
apiClient.interceptors.response.use(
    response => {
        // Strip the Axios wrapper — callers get plain data objects
        return response.data;
    },
    error => {
        if (error.response?.status === 401) {
            // TODO: dispatch logout action or trigger token refresh
            console.warn('[API] 401 Unauthorized');
        }

        const message =
            error.response?.data?.message ||
            error.message ||
            'An unexpected error occurred';

        if (__DEV__) {
            console.error(`[API ✖] ${error.response?.status} — ${message}`);
        }

        return Promise.reject(new Error(message));
    },
);

// ─── PRODUCT ENDPOINTS ───────────────────────────────────────
export const productAPI = {
    /** Fetch all products (optional limit param) */
    getAll: (limit = 20) => apiClient.get(`/products?limit=${limit}`),

    /** Fetch a single product by its ID */
    getById: id => apiClient.get(`/products/${id}`),

    /** Fetch the list of category strings */
    getCategories: () => apiClient.get('/products/categories'),

    /** Fetch products filtered by category name */
    getByCategory: category =>
        apiClient.get(`/products/category/${category}`),
};

// ─── AUTH ENDPOINTS ──────────────────────────────────────────
export const authAPI = {
    /**
     * POST /auth/login
     * Body: { username, password }
     * Returns: { token: "..." }
     */
    login: credentials => apiClient.post('/auth/login', credentials),
};

export default apiClient;

/**
 * ============================================================
 * ROOT REDUCER  (src/store/rootReducer.js)
 * ============================================================
 *
 * Combines all individual slice reducers into one root reducer.
 * The key names here define the shape of the Redux state tree:
 *
 *   state.auth      → managed by authReducer
 *   state.products  → managed by productReducer
 *   state.cart      → managed by cartReducer
 *   state.wishlist  → managed by wishlistReducer
 *
 * Adding a new feature? Just:
 *   1. Create a new slice
 *   2. Import its reducer here
 *   3. Add it to combineReducers
 * ============================================================
 */

import { combineReducers } from '@reduxjs/toolkit';

import authReducer from './slices/authSlice';
import productReducer from './slices/productSlice';
import cartReducer from './slices/cartSlice';
import wishlistReducer from './slices/wishlistSlice';

const rootReducer = combineReducers({
    auth: authReducer,
    products: productReducer,
    cart: cartReducer,
    wishlist: wishlistReducer,
});

export default rootReducer;

/**
 * ============================================================
 * APP NAVIGATOR  (src/navigation/AppNavigator.js)
 * ============================================================
 *
 * Root navigator — decides which navigator to show:
 *   isAuthenticated → MainNavigator (tabs + product screens)
 *   !isAuthenticated → AuthNavigator (login + register)
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useSelector      — read auth state
 *   ✅ useEffect        — restore persisted session on launch
 *   ✅ useDispatch      — dispatch restoreSession action
 *
 * NAVIGATION TRANSITION:
 *   When isAuthenticated changes (login/logout), the
 *   NavigationContainer automatically switches between
 *   AuthNavigator and MainNavigator with a smooth transition.
 * ============================================================
 */

import React, { useEffect } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { useSelector, useDispatch } from 'react-redux';

import AuthNavigator from './AuthNavigator';
import MainNavigator from './MainNavigator';
import Loading from '../components/common/Loading';
import {
    selectIsAuthenticated,
    selectAuthLoading,
    restoreSession,
} from '../store/slices/authSlice';
import { hydrateCart } from '../store/slices/cartSlice';
import { hydrateWishlist } from '../store/slices/wishlistSlice';
import { getItem, STORAGE_KEYS } from '../utils/storage';

const AppNavigator = () => {
    const dispatch = useDispatch();
    const isAuthenticated = useSelector(selectIsAuthenticated);
    const loading = useSelector(selectAuthLoading);

    // ── Restore session on app start ─────────────────────────
    // useEffect with empty deps runs once on mount — like componentDidMount
    useEffect(() => {
        const bootstrapApp = async () => {
            try {
                // Check if we have a stored token (from previous session)
                const token = await getItem(STORAGE_KEYS.AUTH_TOKEN);
                const user = await getItem(STORAGE_KEYS.USER);

                if (token && user) {
                    // Restore auth session without asking user to log in again
                    dispatch(restoreSession({ token, user }));
                }

                // Hydrate cart and wishlist from AsyncStorage
                const cart = await getItem(STORAGE_KEYS.CART);
                const wishlist = await getItem(STORAGE_KEYS.WISHLIST);

                if (cart) dispatch(hydrateCart(cart));
                if (wishlist) dispatch(hydrateWishlist(wishlist));

            } catch (error) {
                console.warn('[AppNavigator] Session restore failed:', error);
            }
        };

        bootstrapApp();
    }, [dispatch]);

    // Show a full-screen loader during auth state determination
    if (loading) {
        return <Loading fullScreen message="Loading your session…" />;
    }

    return (
        <NavigationContainer>
            {isAuthenticated ? <MainNavigator /> : <AuthNavigator />}
        </NavigationContainer>
    );
};

export default AppNavigator;

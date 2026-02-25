/**
 * ============================================================
 * APP ROOT  (App.js)
 * ============================================================
 *
 * The top-level component that wires together:
 *   🔴 Redux Provider     — makes store available app-wide
 *   🟣 ThemeProvider      — makes theme context available app-wide
 *   🔵 AppNavigator       — handles auth/main routing
 *
 * This file should stay thin — no business logic here.
 * It's just the composition root.
 * ============================================================
 */

import React from 'react';
import { Provider } from 'react-redux';

import store from './src/store';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { ThemeProvider } from './src/context/ThemeContext';
import AppNavigator from './src/navigation/AppNavigator';

const App = () => {
    return (
        /**
         * <Provider store={store}>
         *   Makes the Redux store accessible to ALL descendant
         *   components via useSelector() and useDispatch().
         *   Without this, those hooks would throw an error.
         */
        <SafeAreaProvider>
            <Provider store={store}>
                {/**
       * <ThemeProvider>
       *   Makes the theme context (useTheme hook) accessible
       *   to all components — demonstrates Context API pattern.
       */}
                <ThemeProvider>
                    {/**
         * <AppNavigator>
         *   Renders AuthNavigator or MainNavigator based on
         *   whether the user is authenticated.
         */}
                    <AppNavigator />
                </ThemeProvider>
            </Provider>
        </SafeAreaProvider>
    );
};

export default App;

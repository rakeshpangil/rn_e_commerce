/**
 * ============================================================
 * AUTH NAVIGATOR  (src/navigation/AuthNavigator.js)
 * ============================================================
 *
 * Stack navigator for unauthenticated users.
 * Screens: Login → Register
 *
 * REACT NAVIGATION CONCEPTS:
 *   - Stack Navigator: screens stack on top of each other
 *   - screenOptions: apply options to ALL screens in this navigator
 *   - headerShown: false = custom headers in each screen
 * ============================================================
 */

import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LoginScreen from '../screens/auth/LoginScreen';
import RegisterScreen from '../screens/auth/RegisterScreen';
import { colors } from '../theme';

// Create a Stack Navigator instance
// Stack = push, pop, back gesture like a deck of cards
const Stack = createStackNavigator();

const AuthNavigator = () => {
    return (
        <Stack.Navigator
            initialRouteName="Login"
            screenOptions={{
                headerShown: false,          // each screen manages its own header
                cardStyle: { backgroundColor: colors.background },
                gestureEnabled: true,        // iOS swipe-back gesture
            }}
        >
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
        </Stack.Navigator>
    );
};

export default AuthNavigator;

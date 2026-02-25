/**
 * ============================================================
 * MAIN NAVIGATOR  (src/navigation/MainNavigator.js)
 * ============================================================
 *
 * Main app navigator for authenticated users.
 * Structure:
 *   Bottom Tab Navigator
 *     ├── HomeStack (Stack)
 *     │     ├── HomeScreen
 *     │     └── ProductDetailScreen
 *     ├── CartScreen
 *     ├── WishlistScreen
 *     └── ProfileScreen
 *
 * CONCEPTS:
 *   - Bottom Tab Navigator: persistent tab bar at the bottom
 *   - Nested navigators: Stack inside Tab
 *   - tabBarBadge: show cart count on Cart tab icon
 *   - useSelector inside navigator: read cart count to show badge
 * ============================================================
 */

import React from 'react';
import { Text, View } from 'react-native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createStackNavigator } from '@react-navigation/stack';
import { useSelector } from 'react-redux';

import HomeScreen from '../screens/home/HomeScreen';
import ProductDetailScreen from '../screens/product/ProductDetailScreen';
import CartScreen from '../screens/cart/CartScreen';
import WishlistScreen from '../screens/wishlist/WishlistScreen';
import ProfileScreen from '../screens/profile/ProfileScreen';
import { selectCartCount } from '../store/slices/cartSlice';
import { colors, typography } from '../theme';

const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();

// ── Tab bar icon helper ──────────────────────────────────────
const TabIcon = ({ emoji, label, focused }) => (
    <View style={{ alignItems: 'center' }}>
        <Text style={{ fontSize: 22 }}>{emoji}</Text>
        <Text
            style={{
                fontSize: 10,
                color: focused ? colors.primary : colors.textMuted,
                fontWeight: focused
                    ? typography.fontWeight.semibold
                    : typography.fontWeight.regular,
                marginTop: 2,
            }}
        >
            {label}
        </Text>
    </View>
);

// ── Home Stack (nested inside the Home tab) ──────────────────
/**
 * Nested Stack Navigator inside the Home tab.
 * This lets the user navigate Home → ProductDetail while
 * keeping the tab bar visible at all times.
 */
const HomeStack = () => (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen name="ProductDetail" component={ProductDetailScreen} />
    </Stack.Navigator>
);

// ── Main Tab Navigator ───────────────────────────────────────
const MainNavigator = () => {
    // Read cart count from Redux to display the badge
    const cartCount = useSelector(selectCartCount);

    return (
        <Tab.Navigator
            screenOptions={{
                headerShown: false,
                tabBarShowLabel: false,     // we render custom labels in TabIcon
                tabBarStyle: {
                    backgroundColor: colors.surface,
                    borderTopColor: colors.border,
                    borderTopWidth: 1,
                    height: 64,
                    paddingBottom: 8,
                },
            }}
        >
            <Tab.Screen
                name="HomeTab"
                component={HomeStack}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon emoji="🏠" label="Home" focused={focused} />
                    ),
                }}
            />

            <Tab.Screen
                name="CartTab"
                component={CartScreen}
                options={{
                    // tabBarBadge shows the cart item count
                    tabBarBadge: cartCount > 0 ? cartCount : undefined,
                    tabBarBadgeStyle: {
                        backgroundColor: colors.secondary,
                        fontSize: 10,
                    },
                    tabBarIcon: ({ focused }) => (
                        <TabIcon emoji="🛒" label="Cart" focused={focused} />
                    ),
                }}
            />

            <Tab.Screen
                name="WishlistTab"
                component={WishlistScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon emoji="♥" label="Saved" focused={focused} />
                    ),
                }}
            />

            <Tab.Screen
                name="ProfileTab"
                component={ProfileScreen}
                options={{
                    tabBarIcon: ({ focused }) => (
                        <TabIcon emoji="👤" label="Profile" focused={focused} />
                    ),
                }}
            />
        </Tab.Navigator>
    );
};

export default MainNavigator;

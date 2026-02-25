/**
 * ============================================================
 * PROFILE SCREEN  (src/screens/profile/ProfileScreen.js)
 * ============================================================
 *
 * Shows user info and app settings.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useContext  — access theme via useTheme() custom hook
 *   ✅ useSelector — read user info
 *   ✅ useDispatch — dispatch logout
 *   ✅ useCallback — stable logout handler
 *   ✅ useCart     — show cart count summary
 * ============================================================
 */

import React, { useCallback } from 'react';
import {
    View, Text, StyleSheet, TouchableOpacity,
    Alert, Switch, ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/common/Button';
import useCart from '../../hooks/useCart';
import { useTheme } from '../../context/ThemeContext';
import { logoutRequest } from '../../store/slices/authSlice';
import { selectUser } from '../../store/slices/authSlice';
import { selectWishlistCount } from '../../store/slices/wishlistSlice';
import { colors, typography, spacing, borderRadius, shadow } from '../../theme';

// ── Reusable row component ────────────────────────────────────
const InfoRow = ({ label, value, isLast = false }) => (
    <View style={[rowStyles.row, !isLast && rowStyles.border]}>
        <Text style={rowStyles.label}>{label}</Text>
        <Text style={rowStyles.value}>{value}</Text>
    </View>
);

const rowStyles = StyleSheet.create({
    row: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: spacing.md },
    border: { borderBottomWidth: 1, borderBottomColor: colors.border },
    label: { fontSize: typography.fontSize.base, color: colors.textSecondary },
    value: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold, color: colors.textPrimary },
});

// ── Main Component ────────────────────────────────────────────
const ProfileScreen = () => {
    const dispatch = useDispatch();

    // ✅ useContext via custom useTheme hook
    const { isDark, toggleTheme } = useTheme();

    // ✅ useSelector — read data from Redux
    const user = useSelector(selectUser);
    const wishlistCount = useSelector(selectWishlistCount);

    // ✅ useCart custom hook — read cart data
    const { totalCount: cartCount, totalPrice, isEmpty } = useCart();

    // ✅ useCallback — stable logout handler
    const handleLogout = useCallback(() => {
        Alert.alert(
            'Sign Out',
            'Are you sure you want to sign out?',
            [
                { text: 'Cancel', style: 'cancel' },
                {
                    text: 'Sign Out',
                    style: 'destructive',
                    onPress: () => dispatch(logoutRequest()),
                },
            ],
        );
    }, [dispatch]);

    return (
        <SafeAreaView style={[styles.flex, isDark && styles.darkBg]}>
            <ScrollView showsVerticalScrollIndicator={false}>

                {/* Avatar Section */}
                <View style={styles.avatarSection}>
                    <View style={styles.avatar}>
                        <Text style={styles.avatarText}>
                            {user?.username?.[0]?.toUpperCase() || '?'}
                        </Text>
                    </View>
                    <Text style={styles.username}>{user?.username || 'Guest'}</Text>
                    {user?.email && (
                        <Text style={styles.email}>{user.email}</Text>
                    )}
                </View>

                {/* Stats Cards */}
                <View style={styles.statsRow}>
                    {[
                        { label: 'Cart Items', value: cartCount, emoji: '🛒' },
                        { label: 'Wishlist', value: wishlistCount, emoji: '♥' },
                        { label: 'Cart Total', value: `$${totalPrice.toFixed(0)}`, emoji: '💰' },
                    ].map(stat => (
                        <View key={stat.label} style={styles.statCard}>
                            <Text style={styles.statEmoji}>{stat.emoji}</Text>
                            <Text style={styles.statValue}>{stat.value}</Text>
                            <Text style={styles.statLabel}>{stat.label}</Text>
                        </View>
                    ))}
                </View>

                {/* Account Info */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Account Information</Text>
                    <InfoRow label="Username" value={user?.username || '—'} />
                    <InfoRow label="Account ID" value={`#${user?.id || '—'}`} />
                    <InfoRow label="Member since" value="2025" isLast />
                </View>

                {/* Settings */}
                <View style={styles.card}>
                    <Text style={styles.cardTitle}>Settings</Text>
                    <View style={rowStyles.row}>
                        <Text style={rowStyles.label}>
                            {isDark ? '🌙 Dark Mode' : '☀️ Light Mode'}
                        </Text>
                        {/* Switch toggles the theme via useTheme context */}
                        <Switch
                            value={isDark}
                            onValueChange={toggleTheme}
                            trackColor={{ false: colors.border, true: colors.primary }}
                            thumbColor={colors.surface}
                        />
                    </View>
                </View>

                {/* Logout */}
                <View style={styles.logoutSection}>
                    <Button
                        title="Sign Out"
                        onPress={handleLogout}
                        variant="outline"
                        style={styles.logoutBtn}
                    />
                </View>

            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    darkBg: { backgroundColor: '#0F0F1A' },
    avatarSection: { alignItems: 'center', paddingVertical: spacing['2xl'] },
    avatar: {
        width: 90, height: 90,
        borderRadius: borderRadius.full,
        backgroundColor: colors.primary,
        alignItems: 'center', justifyContent: 'center',
        marginBottom: spacing.md,
        ...shadow.lg,
    },
    avatarText: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.bold, color: colors.textInverse },
    username: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
    email: { fontSize: typography.fontSize.base, color: colors.textSecondary, marginTop: spacing.xs },
    statsRow: { flexDirection: 'row', paddingHorizontal: spacing.base, marginBottom: spacing.base, gap: spacing.sm },
    statCard: { flex: 1, backgroundColor: colors.surface, borderRadius: borderRadius.lg, padding: spacing.md, alignItems: 'center', ...shadow.sm },
    statEmoji: { fontSize: 22, marginBottom: spacing.xs },
    statValue: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.primary },
    statLabel: { fontSize: typography.fontSize.xs, color: colors.textSecondary, marginTop: 2, textAlign: 'center' },
    card: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, marginHorizontal: spacing.base, marginBottom: spacing.base, padding: spacing.xl, ...shadow.sm },
    cardTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.md },
    logoutSection: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'], marginTop: spacing.sm },
    logoutBtn: { borderColor: colors.error },
});

export default ProfileScreen;

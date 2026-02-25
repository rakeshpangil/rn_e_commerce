/**
 * ============================================================
 * CART SCREEN  (src/screens/cart/CartScreen.js)
 * ============================================================
 *
 * Shows cart items with quantity controls and order summary.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useCart (custom) — all cart logic via facade hook
 *   ✅ useMemo          — compute order summary values
 *   ✅ useCallback      — stable item action handlers
 * ============================================================
 */

import React, { useMemo, useCallback } from 'react';
import {
    View, Text, FlatList, Image,
    TouchableOpacity, StyleSheet, Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import Button from '../../components/common/Button';
import useCart from '../../hooks/useCart';
import { colors, typography, spacing, borderRadius, shadow } from '../../theme';
import { formatCurrency } from '../../utils/helpers';

const SHIPPING_THRESHOLD = 50; // free shipping above $50
const SHIPPING_COST = 5.99;
const TAX_RATE = 0.08; // 8%

const CartScreen = () => {
    // useCart — our custom "facade" hook. No direct Redux imports needed here!
    const {
        items,
        totalPrice,
        totalCount,
        isEmpty,
        incrementItem,
        decrementItem,
        removeItem,
        clearAllItems,
    } = useCart();

    // ── useMemo: order summary calculations ───────────────────
    // Only recompute when totalPrice changes (not on every render)
    const orderSummary = useMemo(() => {
        const shipping = totalPrice >= SHIPPING_THRESHOLD ? 0 : SHIPPING_COST;
        const tax = totalPrice * TAX_RATE;
        const total = totalPrice + shipping + tax;
        const isFreeShipping = totalPrice >= SHIPPING_THRESHOLD;

        return { shipping, tax, total, isFreeShipping };
    }, [totalPrice]);

    // ── useCallback: item action handlers ─────────────────────
    const handleRemove = useCallback((productId, title) => {
        Alert.alert(
            'Remove Item',
            `Remove "${title.substring(0, 30)}…" from cart?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Remove', style: 'destructive', onPress: () => removeItem(productId) },
            ],
        );
    }, [removeItem]);

    const handleClearCart = useCallback(() => {
        Alert.alert(
            'Clear Cart',
            'Remove all items from your cart?',
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Clear All', style: 'destructive', onPress: clearAllItems },
            ],
        );
    }, [clearAllItems]);

    const handleCheckout = useCallback(() => {
        Alert.alert('Checkout 🎉', 'Order placed successfully!\n(This is a demo app)', [
            { text: 'OK', onPress: clearAllItems },
        ]);
    }, [clearAllItems]);

    // ── Render cart item ───────────────────────────────────────
    const renderItem = useCallback(({ item }) => {
        const { product, quantity } = item;
        return (
            <View style={styles.cartItem}>
                <Image source={{ uri: product.image }} style={styles.itemImage} resizeMode="contain" />

                <View style={styles.itemInfo}>
                    <Text style={styles.itemTitle} numberOfLines={2}>
                        {product.title}
                    </Text>
                    <Text style={styles.itemPrice}>{formatCurrency(product.price)}</Text>

                    <View style={styles.controls}>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => decrementItem(product.id)}
                        >
                            <Text style={styles.qtyBtnText}>−</Text>
                        </TouchableOpacity>
                        <Text style={styles.qtyValue}>{quantity}</Text>
                        <TouchableOpacity
                            style={styles.qtyBtn}
                            onPress={() => incrementItem(product.id)}
                        >
                            <Text style={styles.qtyBtnText}>+</Text>
                        </TouchableOpacity>

                        <Text style={styles.itemTotal}>
                            = {formatCurrency(product.price * quantity)}
                        </Text>
                    </View>
                </View>

                <TouchableOpacity
                    style={styles.removeBtn}
                    onPress={() => handleRemove(product.id, product.title)}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text style={styles.removeBtnText}>✕</Text>
                </TouchableOpacity>
            </View>
        );
    }, [decrementItem, incrementItem, handleRemove]);

    // ── Empty state ────────────────────────────────────────────
    if (isEmpty) {
        return (
            <SafeAreaView style={[styles.flex, styles.center]}>
                <Text style={styles.emptyEmoji}>🛒</Text>
                <Text style={styles.emptyTitle}>Your cart is empty</Text>
                <Text style={styles.emptySubtext}>
                    Go back to the Home tab and add some products!
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.flex}>
            {/* Header */}
            <View style={styles.header}>
                <Text style={styles.headerTitle}>My Cart ({totalCount})</Text>
                <TouchableOpacity onPress={handleClearCart}>
                    <Text style={styles.clearText}>Clear all</Text>
                </TouchableOpacity>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => String(item.product.id)}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListFooterComponent={
                    <View style={styles.summary}>
                        <Text style={styles.summaryTitle}>Order Summary</Text>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Subtotal ({totalCount} item{totalCount !== 1 ? 's' : ''})
                            </Text>
                            <Text style={styles.summaryValue}>{formatCurrency(totalPrice)}</Text>
                        </View>

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>
                                Shipping {orderSummary.isFreeShipping ? '🎁' : ''}
                            </Text>
                            <Text style={[
                                styles.summaryValue,
                                orderSummary.isFreeShipping && styles.free,
                            ]}>
                                {orderSummary.isFreeShipping
                                    ? 'FREE'
                                    : formatCurrency(orderSummary.shipping)}
                            </Text>
                        </View>

                        {!orderSummary.isFreeShipping && (
                            <Text style={styles.freeShippingHint}>
                                Add {formatCurrency(SHIPPING_THRESHOLD - totalPrice)} more for free shipping!
                            </Text>
                        )}

                        <View style={styles.summaryRow}>
                            <Text style={styles.summaryLabel}>Tax (8%)</Text>
                            <Text style={styles.summaryValue}>{formatCurrency(orderSummary.tax)}</Text>
                        </View>

                        <View style={[styles.summaryRow, styles.totalRow]}>
                            <Text style={styles.totalLabel}>Total</Text>
                            <Text style={styles.totalValue}>{formatCurrency(orderSummary.total)}</Text>
                        </View>

                        <Button
                            title={`Checkout — ${formatCurrency(orderSummary.total)}`}
                            onPress={handleCheckout}
                            style={styles.checkoutBtn}
                        />
                    </View>
                }
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    center: { alignItems: 'center', justifyContent: 'center' },
    header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: spacing.base, paddingBottom: spacing.sm },
    headerTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
    clearText: { fontSize: typography.fontSize.sm, color: colors.error, fontWeight: typography.fontWeight.medium },
    list: { padding: spacing.base, paddingBottom: spacing['2xl'] },
    cartItem: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.md, padding: spacing.md, ...shadow.sm },
    itemImage: { width: 80, height: 80, borderRadius: borderRadius.md, backgroundColor: colors.background },
    itemInfo: { flex: 1, marginLeft: spacing.md },
    itemTitle: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.textPrimary, marginBottom: spacing.xs },
    itemPrice: { fontSize: typography.fontSize.sm, color: colors.textSecondary, marginBottom: spacing.sm },
    controls: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm },
    qtyBtn: { backgroundColor: colors.primaryLight, borderRadius: borderRadius.sm, width: 28, height: 28, alignItems: 'center', justifyContent: 'center' },
    qtyBtnText: { fontSize: 18, color: colors.primary, fontWeight: typography.fontWeight.bold, lineHeight: 22 },
    qtyValue: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, minWidth: 20, textAlign: 'center' },
    itemTotal: { fontSize: typography.fontSize.sm, color: colors.primary, fontWeight: typography.fontWeight.semibold },
    removeBtn: { padding: spacing.xs },
    removeBtnText: { fontSize: 16, color: colors.textMuted },
    summary: { backgroundColor: colors.surface, borderRadius: borderRadius.xl, padding: spacing.xl, marginTop: spacing.sm, ...shadow.md },
    summaryTitle: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.md },
    summaryRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: spacing.sm },
    summaryLabel: { fontSize: typography.fontSize.base, color: colors.textSecondary },
    summaryValue: { fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.medium, color: colors.textPrimary },
    free: { color: colors.success, fontWeight: typography.fontWeight.bold },
    freeShippingHint: { fontSize: typography.fontSize.xs, color: colors.warning, marginBottom: spacing.sm, textAlign: 'right' },
    totalRow: { borderTopWidth: 1, borderTopColor: colors.border, paddingTop: spacing.md, marginTop: spacing.sm },
    totalLabel: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
    totalValue: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.extrabold, color: colors.primary },
    checkoutBtn: { marginTop: spacing.lg },
    emptyEmoji: { fontSize: 64, marginBottom: spacing.lg },
    emptyTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
    emptySubtext: { fontSize: typography.fontSize.base, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing['2xl'] },
});

export default CartScreen;

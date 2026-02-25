/**
 * ============================================================
 * WISHLIST SCREEN  (src/screens/wishlist/WishlistScreen.js)
 * ============================================================
 *
 * Displays saved/wishlisted products in a list.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useSelector  — read wishlist items
 *   ✅ useDispatch  — dispatch toggle/remove actions
 *   ✅ useCallback  — stable remove and navigate handlers
 *   ✅ useCart      — add wishlist item directly to cart
 * ============================================================
 */

import React, { useCallback } from 'react';
import {
    View, Text, FlatList, Image,
    TouchableOpacity, StyleSheet,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigation } from '@react-navigation/native';

import Button from '../../components/common/Button';
import useCart from '../../hooks/useCart';
import { removeFromWishlist, selectWishlistItems } from '../../store/slices/wishlistSlice';
import { colors, typography, spacing, borderRadius, shadow } from '../../theme';
import { formatCurrency } from '../../utils/helpers';

const WishlistScreen = () => {
    const dispatch = useDispatch();
    const navigation = useNavigation();
    const { addItem, isInCart } = useCart();

    const items = useSelector(selectWishlistItems);

    const handleRemove = useCallback(
        productId => dispatch(removeFromWishlist(productId)),
        [dispatch],
    );

    const handleAddToCart = useCallback(
        product => addItem(product),
        [addItem],
    );

    const handleNavigateToProduct = useCallback(
        productId => {
            // Navigate to Home tab → HomeStack → ProductDetail
            navigation.navigate('HomeTab', {
                screen: 'ProductDetail',
                params: { productId },
            });
        },
        [navigation],
    );

    const renderItem = useCallback(({ item }) => {
        const inCart = isInCart(item.id);
        return (
            <TouchableOpacity
                style={styles.item}
                onPress={() => handleNavigateToProduct(item.id)}
                activeOpacity={0.85}
            >
                <Image source={{ uri: item.image }} style={styles.image} resizeMode="contain" />

                <View style={styles.info}>
                    <Text style={styles.title} numberOfLines={2}>{item.title}</Text>
                    <Text style={styles.category}>{item.category}</Text>
                    <Text style={styles.price}>{formatCurrency(item.price)}</Text>

                    <View style={styles.actions}>
                        <Button
                            title={inCart ? '✓ In Cart' : '+ Cart'}
                            onPress={() => handleAddToCart(item)}
                            variant={inCart ? 'outline' : 'primary'}
                            size="sm"
                            style={styles.cartBtn}
                        />
                        <TouchableOpacity
                            style={styles.removeBtn}
                            onPress={() => handleRemove(item.id)}
                        >
                            <Text style={styles.removeTxt}>🗑️</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </TouchableOpacity>
        );
    }, [handleNavigateToProduct, handleAddToCart, handleRemove, isInCart]);

    if (items.length === 0) {
        return (
            <SafeAreaView style={[styles.flex, styles.center]}>
                <Text style={styles.emptyEmoji}>♡</Text>
                <Text style={styles.emptyTitle}>Nothing saved yet</Text>
                <Text style={styles.emptySubtext}>
                    Tap the heart icon on any product to save it here
                </Text>
            </SafeAreaView>
        );
    }

    return (
        <SafeAreaView style={styles.flex}>
            <View style={styles.header}>
                <Text style={styles.headerTitle}>Saved Items ({items.length})</Text>
            </View>

            <FlatList
                data={items}
                renderItem={renderItem}
                keyExtractor={item => String(item.id)}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    center: { alignItems: 'center', justifyContent: 'center' },
    header: { padding: spacing.base, paddingBottom: spacing.sm },
    headerTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
    list: { padding: spacing.base },
    item: { flexDirection: 'row', backgroundColor: colors.surface, borderRadius: borderRadius.lg, marginBottom: spacing.md, padding: spacing.md, ...shadow.sm },
    image: { width: 90, height: 90, borderRadius: borderRadius.md, backgroundColor: colors.background },
    info: { flex: 1, marginLeft: spacing.md, justifyContent: 'space-between' },
    title: { fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.medium, color: colors.textPrimary },
    category: { fontSize: typography.fontSize.xs, color: colors.textMuted, textTransform: 'capitalize', marginTop: 2 },
    price: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.primary, marginTop: spacing.xs },
    actions: { flexDirection: 'row', alignItems: 'center', marginTop: spacing.sm, gap: spacing.sm },
    cartBtn: { flex: 1 },
    removeBtn: { padding: spacing.xs },
    removeTxt: { fontSize: 18 },
    emptyEmoji: { fontSize: 64, color: colors.secondary, marginBottom: spacing.md },
    emptyTitle: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
    emptySubtext: { fontSize: typography.fontSize.base, color: colors.textSecondary, textAlign: 'center', marginTop: spacing.sm, paddingHorizontal: spacing['2xl'] },
});

export default WishlistScreen;

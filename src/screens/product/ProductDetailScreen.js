/**
 * ============================================================
 * PRODUCT DETAIL SCREEN  (src/screens/product/ProductDetailScreen.js)
 * ============================================================
 *
 * Shows full product information with add-to-cart functionality.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useState        — quantity counter
 *   ✅ useEffect       — fetch product by ID from route params
 *   ✅ useCallback     — stable add-to-cart, wishlist handlers
 *   ✅ useSelector     — read selected product + cart/wishlist state
 *   ✅ useDispatch     — dispatch actions
 *   ✅ useLayoutEffect — set navigation header title
 *   ✅ useCart (custom)— cart operations
 * ============================================================
 */

import React, {
    useState,
    useEffect,
    useCallback,
    useLayoutEffect,
} from 'react';
import {
    View,
    Text,
    Image,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/common/Button';
import Loading from '../../components/common/Loading';
import useCart from '../../hooks/useCart';

import {
    fetchProductByIdRequest,
    selectSelectedProduct,
    selectProductsLoading,
} from '../../store/slices/productSlice';
import {
    toggleWishlist,
    selectIsWishlisted,
} from '../../store/slices/wishlistSlice';
import { colors, typography, spacing, borderRadius, shadow } from '../../theme';
import { formatCurrency, getRatingStars } from '../../utils/helpers';

const ProductDetailScreen = ({ route, navigation }) => {
    const dispatch = useDispatch();
    const { addItem, isInCart, getItemQuantity } = useCart();

    // Extract productId from navigation route params
    const { productId } = route.params;

    // ── Redux state ───────────────────────────────────────────
    const product = useSelector(selectSelectedProduct);
    const loading = useSelector(selectProductsLoading);
    const wishlisted = useSelector(selectIsWishlisted(productId));

    // ── Local state: quantity picker ──────────────────────────
    const [quantity, setQuantity] = useState(1);

    // ── useEffect: fetch product data on mount ─────────────────
    useEffect(() => {
        dispatch(fetchProductByIdRequest(productId));
    }, [productId, dispatch]);

    // ── useLayoutEffect: update header with product title ──────
    useLayoutEffect(() => {
        if (product?.title) {
            navigation.setOptions({
                headerTitle: product.title.substring(0, 20) + '…',
                headerShown: true,
                headerTintColor: colors.primary,
            });
        }
    }, [navigation, product?.title]);

    // ── useCallback: stable handlers ──────────────────────────
    const handleAddToCart = useCallback(() => {
        if (!product) return;
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        Alert.alert('Added to Cart ✅', `${quantity}x ${product.title.substring(0, 30)}…`);
    }, [addItem, product, quantity]);

    const handleWishlist = useCallback(() => {
        if (product) dispatch(toggleWishlist(product));
    }, [dispatch, product]);

    const incrementQty = useCallback(
        () => setQuantity(q => Math.min(q + 1, 10)),
        [],
    );
    const decrementQty = useCallback(
        () => setQuantity(q => Math.max(q - 1, 1)),
        [],
    );

    if (loading || !product) {
        return <Loading fullScreen message="Loading product…" />;
    }

    const stars = getRatingStars(product.rating?.rate || 0);
    const inCart = isInCart(product.id);

    return (
        <SafeAreaView style={styles.flex}>
            <ScrollView showsVerticalScrollIndicator={false}>
                {/* Product Image */}
                <View style={styles.imageContainer}>
                    <Image
                        source={{ uri: product.image }}
                        style={styles.image}
                        resizeMode="contain"
                    />
                    <TouchableOpacity style={styles.wishlistBtn} onPress={handleWishlist}>
                        <Text style={[styles.heart, wishlisted && styles.heartActive]}>
                            {wishlisted ? '♥' : '♡'}
                        </Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.content}>
                    {/* Category badge */}
                    <View style={styles.categoryBadge}>
                        <Text style={styles.categoryText}>{product.category}</Text>
                    </View>

                    {/* Title */}
                    <Text style={styles.title}>{product.title}</Text>

                    {/* Rating */}
                    <View style={styles.ratingRow}>
                        <Text style={styles.stars}>
                            {stars.map((s, i) =>
                                s === 'full' ? '★' : s === 'half' ? '½' : '☆',
                            ).join('')}
                        </Text>
                        <Text style={styles.ratingText}>
                            {product.rating?.rate} ({product.rating?.count} reviews)
                        </Text>
                    </View>

                    {/* Price */}
                    <Text style={styles.price}>{formatCurrency(product.price)}</Text>

                    {/* Description */}
                    <Text style={styles.sectionTitle}>About this product</Text>
                    <Text style={styles.description}>{product.description}</Text>

                    {/* Quantity Picker */}
                    <View style={styles.qtyRow}>
                        <Text style={styles.sectionTitle}>Quantity</Text>
                        <View style={styles.qtyControls}>
                            <TouchableOpacity style={styles.qtyBtn} onPress={decrementQty}>
                                <Text style={styles.qtyBtnText}>−</Text>
                            </TouchableOpacity>
                            <Text style={styles.qtyValue}>{quantity}</Text>
                            <TouchableOpacity style={styles.qtyBtn} onPress={incrementQty}>
                                <Text style={styles.qtyBtnText}>+</Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {/* Total */}
                    <View style={styles.totalRow}>
                        <Text style={styles.totalLabel}>Total</Text>
                        <Text style={styles.totalValue}>
                            {formatCurrency(product.price * quantity)}
                        </Text>
                    </View>
                </View>
            </ScrollView>

            {/* Add to Cart sticky footer */}
            <View style={styles.footer}>
                <Button
                    title={inCart ? '✓ Added — Add More' : 'Add to Cart 🛒'}
                    onPress={handleAddToCart}
                    variant={inCart ? 'outline' : 'primary'}
                    style={styles.addBtn}
                />
            </View>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    imageContainer: {
        height: 300,
        backgroundColor: colors.surface,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    image: { width: '70%', height: '70%' },
    wishlistBtn: {
        position: 'absolute', top: spacing.base, right: spacing.base,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.full, width: 44, height: 44,
        alignItems: 'center', justifyContent: 'center',
        ...shadow.md,
    },
    heart: { fontSize: 24, color: colors.textMuted },
    heartActive: { color: colors.secondary },
    content: { padding: spacing.base },
    categoryBadge: {
        alignSelf: 'flex-start',
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.full,
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.xs,
        marginBottom: spacing.sm,
    },
    categoryText: { fontSize: typography.fontSize.xs, color: colors.primary, fontWeight: typography.fontWeight.semibold, textTransform: 'capitalize' },
    title: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm, lineHeight: 26 },
    ratingRow: { flexDirection: 'row', alignItems: 'center', gap: spacing.sm, marginBottom: spacing.md },
    stars: { color: colors.star, fontSize: typography.fontSize.md },
    ratingText: { fontSize: typography.fontSize.sm, color: colors.textSecondary },
    price: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.extrabold, color: colors.primary, marginBottom: spacing.xl },
    sectionTitle: { fontSize: typography.fontSize.md, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginBottom: spacing.sm },
    description: { fontSize: typography.fontSize.base, color: colors.textSecondary, lineHeight: 24, marginBottom: spacing.xl },
    qtyRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: spacing.md },
    qtyControls: { flexDirection: 'row', alignItems: 'center', gap: spacing.md },
    qtyBtn: { backgroundColor: colors.primaryLight, borderRadius: borderRadius.md, width: 36, height: 36, alignItems: 'center', justifyContent: 'center' },
    qtyBtnText: { fontSize: 20, color: colors.primary, fontWeight: typography.fontWeight.bold },
    qtyValue: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, minWidth: 30, textAlign: 'center' },
    totalRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingTop: spacing.md, borderTopWidth: 1, borderTopColor: colors.border, marginBottom: spacing['4xl'] },
    totalLabel: { fontSize: typography.fontSize.md, color: colors.textSecondary, fontWeight: typography.fontWeight.medium },
    totalValue: { fontSize: typography.fontSize.xl, fontWeight: typography.fontWeight.extrabold, color: colors.primary },
    footer: { padding: spacing.base, backgroundColor: colors.surface, borderTopWidth: 1, borderTopColor: colors.border },
    addBtn: { width: '100%' },
});

export default ProductDetailScreen;

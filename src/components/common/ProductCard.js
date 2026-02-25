/**
 * ============================================================
 * PRODUCT CARD  (src/components/common/ProductCard.js)
 * ============================================================
 *
 * Displays a product thumbnail, name, price, rating, and
 * wishlist toggle in a compact card layout.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useState    — local wishlist state (optimistic UI update)
 *   ✅ useCallback — stable onPress handlers
 *   ✅ useMemo     — compute truncated title once
 * ============================================================
 */

import React, { useState, useCallback, useMemo } from 'react';
import {
    View,
    Text,
    Image,
    TouchableOpacity,
    StyleSheet,
    Dimensions,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { toggleWishlist, selectIsWishlisted } from '../../store/slices/wishlistSlice';
import { colors, typography, spacing, borderRadius, shadow } from '../../theme';
import { truncateText, formatCurrency } from '../../utils/helpers';

const { width } = Dimensions.get('window');
const CARD_WIDTH = (width - spacing.base * 3) / 2; // 2-column grid

const ProductCard = ({ product, onPress }) => {
    const dispatch = useDispatch();

    // useSelector with a parameterized selector
    const isWishlisted = useSelector(selectIsWishlisted(product?.id));

    // useCallback: memoize press handlers so they don't re-create on every render
    const handlePress = useCallback(() => {
        onPress?.(product);
    }, [onPress, product]);

    const handleWishlistToggle = useCallback(() => {
        dispatch(toggleWishlist(product));
    }, [dispatch, product]);

    // useMemo: truncate title once, recompute only when product changes
    const shortTitle = useMemo(
        () => truncateText(product?.title, 40),
        [product?.title],
    );

    if (!product) return null;

    const { image, price, rating } = product;

    return (
        <TouchableOpacity
            style={styles.card}
            onPress={handlePress}
            activeOpacity={0.85}
        >
            {/* Product Image */}
            <View style={styles.imageContainer}>
                <Image
                    source={{ uri: image }}
                    style={styles.image}
                    resizeMode="contain"
                />

                {/* Wishlist heart button — positioned top-right */}
                <TouchableOpacity
                    style={styles.wishlistBtn}
                    onPress={handleWishlistToggle}
                    hitSlop={{ top: 8, bottom: 8, left: 8, right: 8 }}
                >
                    <Text style={[styles.heart, isWishlisted && styles.heartActive]}>
                        {isWishlisted ? '♥' : '♡'}
                    </Text>
                </TouchableOpacity>
            </View>

            {/* Product Info */}
            <View style={styles.info}>
                <Text style={styles.title} numberOfLines={2}>
                    {shortTitle}
                </Text>

                <View style={styles.footer}>
                    <Text style={styles.price}>{formatCurrency(price)}</Text>

                    {rating && (
                        <View style={styles.rating}>
                            <Text style={styles.star}>★</Text>
                            <Text style={styles.ratingText}>
                                {rating.rate?.toFixed(1)}
                            </Text>
                        </View>
                    )}
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: CARD_WIDTH,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        marginBottom: spacing.base,
        overflow: 'hidden',
        ...shadow.md,
    },
    imageContainer: {
        height: CARD_WIDTH * 0.9,
        backgroundColor: colors.surfaceElevated,
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.sm,
    },
    image: {
        width: '80%',
        height: '80%',
    },
    wishlistBtn: {
        position: 'absolute',
        top: spacing.sm,
        right: spacing.sm,
        backgroundColor: colors.surface,
        borderRadius: borderRadius.full,
        width: 32,
        height: 32,
        alignItems: 'center',
        justifyContent: 'center',
        ...shadow.sm,
    },
    heart: {
        fontSize: 18,
        color: colors.textMuted,
    },
    heartActive: {
        color: colors.secondary,
    },
    info: {
        padding: spacing.md,
    },
    title: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.medium,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        lineHeight: 18,
    },
    footer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
    },
    price: {
        fontSize: typography.fontSize.md,
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
    rating: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 2,
    },
    star: {
        color: colors.star,
        fontSize: typography.fontSize.sm,
    },
    ratingText: {
        fontSize: typography.fontSize.xs,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
});

export default ProductCard;

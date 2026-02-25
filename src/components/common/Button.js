/**
 * ============================================================
 * BUTTON COMPONENT  (src/components/common/Button.js)
 * ============================================================
 *
 * Reusable button with multiple variants:
 *   primary  — filled purple (main CTAs)
 *   secondary — filled pink (secondary actions)
 *   outline  — bordered transparent (tertiary)
 *   ghost    — no border, just text
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useRef      — animate press feedback scale
 *   ✅ useCallback — stable onPress handler
 *   ✅ Animated    — React Native's built-in animation API
 * ============================================================
 */

import React, { useRef, useCallback } from 'react';
import {
    TouchableOpacity,
    Text,
    StyleSheet,
    ActivityIndicator,
    Animated,
    View,
} from 'react-native';
import { colors, typography, spacing, borderRadius } from '../../theme';

const Button = ({
    title,
    onPress,
    variant = 'primary',  // 'primary' | 'secondary' | 'outline' | 'ghost'
    size = 'md',          // 'sm' | 'md' | 'lg'
    loading = false,
    disabled = false,
    leftIcon = null,
    rightIcon = null,
    style,
    textStyle,
}) => {
    // useRef: holds the Animated.Value for scale — persists across renders
    // without triggering re-renders (unlike useState)
    const scaleAnim = useRef(new Animated.Value(1)).current;

    // Animate button scale down on press-in
    const handlePressIn = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 0.96,
            useNativeDriver: true, // run on the native UI thread for smooth animation
            speed: 50,
        }).start();
    }, [scaleAnim]);

    // Animate back to normal on press-out
    const handlePressOut = useCallback(() => {
        Animated.spring(scaleAnim, {
            toValue: 1,
            useNativeDriver: true,
            speed: 50,
        }).start();
    }, [scaleAnim]);

    const isDisabled = disabled || loading;

    return (
        <Animated.View style={[{ transform: [{ scale: scaleAnim }] }, style]}>
            <TouchableOpacity
                onPress={isDisabled ? undefined : onPress}
                onPressIn={handlePressIn}
                onPressOut={handlePressOut}
                activeOpacity={0.9}
                style={[
                    styles.base,
                    styles[`variant_${variant}`],
                    styles[`size_${size}`],
                    isDisabled && styles.disabled,
                ]}
            >
                {loading ? (
                    <ActivityIndicator
                        color={variant === 'outline' || variant === 'ghost'
                            ? colors.primary
                            : colors.textInverse}
                        size="small"
                    />
                ) : (
                    <View style={styles.content}>
                        {leftIcon && <View style={styles.leftIcon}>{leftIcon}</View>}
                        <Text
                            style={[
                                styles.text,
                                styles[`text_${variant}`],
                                styles[`textSize_${size}`],
                                textStyle,
                            ]}
                        >
                            {title}
                        </Text>
                        {rightIcon && <View style={styles.rightIcon}>{rightIcon}</View>}
                    </View>
                )}
            </TouchableOpacity>
        </Animated.View>
    );
};

const styles = StyleSheet.create({
    base: {
        borderRadius: borderRadius.md,
        alignItems: 'center',
        justifyContent: 'center',
        flexDirection: 'row',
    },
    content: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    leftIcon: { marginRight: spacing.sm },
    rightIcon: { marginLeft: spacing.sm },

    // ── Variants ──────────────────────────────────────────────
    variant_primary: {
        backgroundColor: colors.primary,
    },
    variant_secondary: {
        backgroundColor: colors.secondary,
    },
    variant_outline: {
        backgroundColor: colors.transparent,
        borderWidth: 1.5,
        borderColor: colors.primary,
    },
    variant_ghost: {
        backgroundColor: colors.transparent,
    },

    // ── Sizes ─────────────────────────────────────────────────
    size_sm: { paddingVertical: spacing.sm, paddingHorizontal: spacing.md },
    size_md: { paddingVertical: spacing.md, paddingHorizontal: spacing.xl },
    size_lg: { paddingVertical: spacing.base, paddingHorizontal: spacing['2xl'] },

    // ── Text styles per variant ────────────────────────────────
    text: {
        fontWeight: typography.fontWeight.semibold,
        letterSpacing: typography.letterSpacing.wide,
    },
    text_primary: { color: colors.textInverse },
    text_secondary: { color: colors.textInverse },
    text_outline: { color: colors.primary },
    text_ghost: { color: colors.primary },

    textSize_sm: { fontSize: typography.fontSize.sm },
    textSize_md: { fontSize: typography.fontSize.base },
    textSize_lg: { fontSize: typography.fontSize.md },

    disabled: { opacity: 0.5 },
});

export default Button;

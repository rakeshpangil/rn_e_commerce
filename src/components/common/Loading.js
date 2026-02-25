/**
 * ============================================================
 * LOADING COMPONENT  (src/components/common/Loading.js)
 * ============================================================
 *
 * Full-screen and inline loading indicators.
 * Uses Animated API to pulse the spinner for premium feel.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useEffect  — start fade animation on mount
 *   ✅ useRef     — store Animated.Value without re-renders
 * ============================================================
 */

import React, { useEffect, useRef } from 'react';
import {
    View,
    ActivityIndicator,
    Text,
    StyleSheet,
    Animated,
} from 'react-native';
import { colors, typography, spacing } from '../../theme';

const Loading = ({
    fullScreen = false,
    message = 'Loading...',
    size = 'large',
    color = colors.primary,
}) => {
    // useRef: Animated.Value persists without causing re-renders
    const fadeAnim = useRef(new Animated.Value(0)).current;

    useEffect(() => {
        // Fade in on mount
        Animated.timing(fadeAnim, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();

        // Cleanup: stop animation if component unmounts mid-animation
        return () => fadeAnim.stopAnimation();
    }, [fadeAnim]);

    const content = (
        <Animated.View style={[styles.container, { opacity: fadeAnim }]}>
            <ActivityIndicator size={size} color={color} />
            {message && <Text style={styles.message}>{message}</Text>}
        </Animated.View>
    );

    if (fullScreen) {
        return <View style={styles.fullScreen}>{content}</View>;
    }

    return content;
};

const styles = StyleSheet.create({
    fullScreen: {
        flex: 1,
        backgroundColor: colors.background,
        alignItems: 'center',
        justifyContent: 'center',
    },
    container: {
        alignItems: 'center',
        justifyContent: 'center',
        padding: spacing.xl,
    },
    message: {
        marginTop: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
        fontWeight: typography.fontWeight.medium,
    },
});

export default Loading;

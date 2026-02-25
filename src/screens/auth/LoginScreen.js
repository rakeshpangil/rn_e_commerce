import React, {
    useState,
    useEffect,
    useRef,
    useCallback,
} from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    KeyboardAvoidingView,
    Platform,
    ScrollView,
    Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';

import Button from '../../components/common/Button';
import {
    loginRequest,
    clearError,
    selectAuthLoading,
    selectAuthError,
} from '../../store/slices/authSlice';
import { colors, typography, spacing, borderRadius } from '../../theme';

const LoginScreen = ({ navigation }) => {
    const dispatch = useDispatch();
    const loading = useSelector(selectAuthLoading);
    const error = useSelector(selectAuthError);

    // ── useState: form fields ──────────────────────────────────
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);

    // ── useRef: reference the password input to auto-focus it ─
    // useRef gives a mutable object that persists between renders.
    // .current holds the actual TextInput instance.
    const passwordRef = useRef(null);

    // ── useEffect: clear API error when user edits inputs ─────
    // This gives immediate feedback that the error is "stale".
    useEffect(() => {
        if (error) dispatch(clearError());
    }, [username, password]); // re-run when inputs change

    // ── useEffect: show error as Alert ────────────────────────
    useEffect(() => {
        if (error) {
            Alert.alert('Login Failed', error, [{ text: 'OK' }]);
        }
    }, [error]);

    // ── useCallback: memoized submit function ─────────────────
    const handleLogin = useCallback(() => {
        if (!username.trim()) {
            Alert.alert('Validation', 'Please enter your username');
            return;
        }
        if (!password.trim()) {
            Alert.alert('Validation', 'Please enter your password');
            return;
        }
        // Dispatch the saga-intercepted action
        dispatch(loginRequest({ username: username.trim(), password }));
    }, [dispatch, username, password]);

    // Fill demo credentials with one tap
    const fillDemoCredentials = useCallback(() => {
        setUsername('johnd');
        setPassword('m38rmF$');
    }, []);

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                {/* Header */}
                <View style={styles.header}>
                    <Text style={styles.emoji}>🛍️</Text>
                    <Text style={styles.title}>ShopNative</Text>
                    <Text style={styles.subtitle}>Sign in to continue shopping</Text>
                </View>

                {/* Demo Hint */}
                <TouchableOpacity style={styles.demoHint} onPress={fillDemoCredentials}>
                    <Text style={styles.demoText}>
                        🔑 Tap to use demo credentials
                    </Text>
                    <Text style={styles.demoCredentials}>johnd  /  m38rmF$</Text>
                </TouchableOpacity>

                {/* Form Card */}
                <View style={styles.card}>
                    <Text style={styles.label}>Username</Text>
                    <TextInput
                        style={styles.input}
                        value={username}
                        onChangeText={setUsername}
                        placeholder="Enter username"
                        placeholderTextColor={colors.textMuted}
                        autoCapitalize="none"
                        autoCorrect={false}
                        returnKeyType="next"
                        // When user presses "Next" on keyboard → focus password field
                        onSubmitEditing={() => passwordRef.current?.focus()}
                    />

                    <Text style={styles.label}>Password</Text>
                    <View style={styles.passwordContainer}>
                        <TextInput
                            ref={passwordRef}  // useRef in action — connect ref to this input
                            style={[styles.input, styles.passwordInput]}
                            value={password}
                            onChangeText={setPassword}
                            placeholder="Enter password"
                            placeholderTextColor={colors.textMuted}
                            secureTextEntry={!showPassword}
                            returnKeyType="done"
                            onSubmitEditing={handleLogin}
                        />
                        <TouchableOpacity
                            style={styles.eyeBtn}
                            onPress={() => setShowPassword(v => !v)}
                        >
                            <Text>{showPassword ? '🙈' : '👁️'}</Text>
                        </TouchableOpacity>
                    </View>

                    <Button
                        title="Sign In"
                        onPress={handleLogin}
                        loading={loading}
                        disabled={loading}
                        style={styles.loginBtn}
                    />
                </View>

                {/* Navigate to Register */}
                <TouchableOpacity
                    style={styles.registerLink}
                    onPress={() => navigation.navigate('Register')}
                >
                    <Text style={styles.registerText}>
                        Don't have an account?{' '}
                        <Text style={styles.registerBold}>Create one</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: {
        flexGrow: 1,
        padding: spacing.base,
        justifyContent: 'center',
    },
    header: {
        alignItems: 'center',
        marginBottom: spacing['2xl'],
    },
    emoji: { fontSize: 56, marginBottom: spacing.md },
    title: {
        fontSize: typography.fontSize['2xl'],
        fontWeight: typography.fontWeight.extrabold,
        color: colors.primary,
        letterSpacing: -1,
    },
    subtitle: {
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
        marginTop: spacing.xs,
    },
    demoHint: {
        backgroundColor: colors.primaryLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        alignItems: 'center',
        marginBottom: spacing.base,
    },
    demoText: {
        fontSize: typography.fontSize.sm,
        color: colors.primary,
        fontWeight: typography.fontWeight.semibold,
    },
    demoCredentials: {
        fontSize: typography.fontSize.sm,
        color: colors.primaryDark,
        marginTop: spacing.xs,
        fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    },
    card: {
        backgroundColor: colors.surface,
        borderRadius: borderRadius.xl,
        padding: spacing.xl,
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 4 },
        shadowOpacity: 0.08,
        shadowRadius: 12,
        elevation: 4,
    },
    label: {
        fontSize: typography.fontSize.sm,
        fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary,
        marginBottom: spacing.sm,
        marginTop: spacing.md,
    },
    input: {
        borderWidth: 1.5,
        borderColor: colors.border,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
        backgroundColor: colors.background,
    },
    passwordContainer: {
        position: 'relative',
    },
    passwordInput: {
        paddingRight: 48,
    },
    eyeBtn: {
        position: 'absolute',
        right: spacing.md,
        top: spacing.md,
    },
    loginBtn: {
        marginTop: spacing.xl,
    },
    registerLink: {
        alignItems: 'center',
        marginTop: spacing.xl,
    },
    registerText: {
        fontSize: typography.fontSize.base,
        color: colors.textSecondary,
    },
    registerBold: {
        fontWeight: typography.fontWeight.bold,
        color: colors.primary,
    },
});

export default LoginScreen;

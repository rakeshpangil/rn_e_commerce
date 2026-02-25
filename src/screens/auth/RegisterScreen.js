/**
 * ============================================================
 * REGISTER SCREEN  (src/screens/auth/RegisterScreen.js)
 * ============================================================
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useReducer   — manage complex form state with a reducer
 *                     (alternative to multiple useState calls)
 *   ✅ useCallback  — memoised dispatch and submit
 *   ✅ useSelector  — read loading/error
 *   ✅ useDispatch  — dispatch registerRequest
 *
 * KEY CONCEPT — useReducer vs multiple useState:
 *   When form state has multiple related fields and validation,
 *   useReducer is cleaner than 4+ individual useState calls.
 *   Think of it as a "mini Redux" inside the component.
 * ============================================================
 */

import React, { useReducer, useCallback, useEffect } from 'react';
import {
    View, Text, TextInput, StyleSheet,
    TouchableOpacity, KeyboardAvoidingView,
    Platform, ScrollView, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import Button from '../../components/common/Button';
import {
    registerRequest, clearError,
    selectAuthLoading, selectAuthError,
} from '../../store/slices/authSlice';
import { colors, typography, spacing, borderRadius } from '../../theme';

// ── Form State Reducer ───────────────────────────────────────
/**
 * Instead of:
 *   const [username, setUsername] = useState('');
 *   const [email, setEmail]       = useState('');
 *   const [password, setPassword] = useState('');
 *
 * We use useReducer with a single state object.
 * This makes it easy to reset, validate, or batch updates.
 */
const formReducer = (state, action) => {
    switch (action.type) {
        case 'SET_FIELD':
            // Update a single field: { type: 'SET_FIELD', field: 'email', value: '...' }
            return { ...state, [action.field]: action.value, error: null };
        case 'SET_ERROR':
            return { ...state, error: action.message };
        case 'RESET':
            return initialFormState;
        default:
            return state;
    }
};

const initialFormState = {
    username: '',
    email: '',
    password: '',
    confirm: '',
    error: null,
};

// ── Component ────────────────────────────────────────────────
const RegisterScreen = ({ navigation }) => {
    const reduxDispatch = useDispatch();
    const loading = useSelector(selectAuthLoading);
    const reduxError = useSelector(selectAuthError);

    // useReducer returns [state, dispatch]
    // `dispatch` here is the LOCAL form reducer dispatch (not Redux dispatch)
    const [form, formDispatch] = useReducer(formReducer, initialFormState);

    useEffect(() => {
        if (reduxError) {
            Alert.alert('Registration Failed', reduxError);
            reduxDispatch(clearError());
        }
    }, [reduxError]);

    // Stable field change handler — single handler for all fields
    const handleChange = useCallback((field, value) => {
        formDispatch({ type: 'SET_FIELD', field, value });
    }, []);

    const handleRegister = useCallback(() => {
        const { username, email, password, confirm } = form;

        // Local validation
        if (!username.trim() || !email.trim() || !password.trim()) {
            formDispatch({ type: 'SET_ERROR', message: 'All fields are required' });
            return;
        }
        if (password !== confirm) {
            formDispatch({ type: 'SET_ERROR', message: 'Passwords do not match' });
            return;
        }
        if (password.length < 6) {
            formDispatch({ type: 'SET_ERROR', message: 'Password must be at least 6 characters' });
            return;
        }

        // Dispatch to Redux (saga handles API call)
        reduxDispatch(registerRequest({ username, email, password }));
    }, [form, reduxDispatch]);

    return (
        <KeyboardAvoidingView
            style={styles.flex}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            <ScrollView
                contentContainerStyle={styles.container}
                keyboardShouldPersistTaps="handled"
            >
                <TouchableOpacity
                    style={styles.backBtn}
                    onPress={() => navigation.goBack()}
                >
                    <Text style={styles.backText}>← Back</Text>
                </TouchableOpacity>

                <View style={styles.header}>
                    <Text style={styles.title}>Create Account</Text>
                    <Text style={styles.subtitle}>Join ShopNative today</Text>
                </View>

                <View style={styles.card}>
                    {form.error && (
                        <View style={styles.errorBox}>
                            <Text style={styles.errorText}>⚠️ {form.error}</Text>
                        </View>
                    )}

                    {[
                        { field: 'username', label: 'Username', placeholder: 'Choose a username', secure: false },
                        { field: 'email', label: 'Email', placeholder: 'your@email.com', secure: false },
                        { field: 'password', label: 'Password', placeholder: 'Min. 6 characters', secure: true },
                        { field: 'confirm', label: 'Confirm Password', placeholder: 'Repeat password', secure: true },
                    ].map(({ field, label, placeholder, secure }) => (
                        <View key={field}>
                            <Text style={styles.label}>{label}</Text>
                            <TextInput
                                style={styles.input}
                                value={form[field]}
                                onChangeText={val => handleChange(field, val)}
                                placeholder={placeholder}
                                placeholderTextColor={colors.textMuted}
                                secureTextEntry={secure}
                                autoCapitalize="none"
                            />
                        </View>
                    ))}

                    <Button
                        title="Create Account"
                        onPress={handleRegister}
                        loading={loading}
                        style={styles.btn}
                    />
                </View>

                <TouchableOpacity
                    style={styles.loginLink}
                    onPress={() => navigation.navigate('Login')}
                >
                    <Text style={styles.loginText}>
                        Already have an account?{' '}
                        <Text style={styles.loginBold}>Sign in</Text>
                    </Text>
                </TouchableOpacity>
            </ScrollView>
        </KeyboardAvoidingView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    container: { flexGrow: 1, padding: spacing.base },
    backBtn: { marginTop: spacing.xl, marginBottom: spacing.base },
    backText: { color: colors.primary, fontSize: typography.fontSize.base, fontWeight: typography.fontWeight.semibold },
    header: { marginBottom: spacing.xl },
    title: { fontSize: typography.fontSize['2xl'], fontWeight: typography.fontWeight.extrabold, color: colors.textPrimary },
    subtitle: { color: colors.textSecondary, marginTop: spacing.xs },
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
    errorBox: {
        backgroundColor: colors.errorLight,
        borderRadius: borderRadius.md,
        padding: spacing.md,
        marginBottom: spacing.md,
    },
    errorText: { color: colors.error, fontSize: typography.fontSize.sm },
    label: {
        fontSize: typography.fontSize.sm, fontWeight: typography.fontWeight.semibold,
        color: colors.textPrimary, marginBottom: spacing.sm, marginTop: spacing.md,
    },
    input: {
        borderWidth: 1.5, borderColor: colors.border,
        borderRadius: borderRadius.md, padding: spacing.md,
        fontSize: typography.fontSize.base, color: colors.textPrimary,
        backgroundColor: colors.background,
    },
    btn: { marginTop: spacing.xl },
    loginLink: { alignItems: 'center', marginTop: spacing.xl },
    loginText: { fontSize: typography.fontSize.base, color: colors.textSecondary },
    loginBold: { fontWeight: typography.fontWeight.bold, color: colors.primary },
});

export default RegisterScreen;

/**
 * ============================================================
 * HOME SCREEN  (src/screens/home/HomeScreen.js)
 * ============================================================
 *
 * Main product listing with search and category filters.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useState       — search input text (live value)
 *   ✅ useEffect      — fetch products + categories on mount
 *   ✅ useMemo        — filtered & searched product list
 *   ✅ useCallback    — stable handlers for filter, search, press
 *   ✅ useDispatch    — dispatch fetch actions
 *   ✅ useSelector    — read products, categories, loading, filters
 *   ✅ useDebounce    — custom hook to debounce search input
 *   ✅ useRef         — scroll to top when category changes
 *   ✅ useLayoutEffect— update header title dynamically
 * ============================================================
 */

import React, {
    useState,
    useEffect,
    useMemo,
    useCallback,
    useRef,
    useLayoutEffect,
} from 'react';
import {
    View,
    Text,
    FlatList,
    TextInput,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useDispatch, useSelector } from 'react-redux';

import ProductCard from '../../components/common/ProductCard';
import Loading from '../../components/common/Loading';
import useDebounce from '../../hooks/useDebounce';

import {
    fetchProductsRequest,
    fetchCategoriesRequest,
    setSelectedCategory,
    setSearchQuery,
    selectProducts,
    selectCategories,
    selectSelectedCategory,
    selectSearchQuery,
    selectProductsLoading,
} from '../../store/slices/productSlice';
import { colors, typography, spacing, borderRadius } from '../../theme';

const HomeScreen = ({ navigation }) => {
    const dispatch = useDispatch();

    // ── Redux state ───────────────────────────────────────────
    const products = useSelector(selectProducts);
    const categories = useSelector(selectCategories);
    const selectedCategory = useSelector(selectSelectedCategory);
    const savedSearch = useSelector(selectSearchQuery);
    const loading = useSelector(selectProductsLoading);

    // ── Local state for the live input text ───────────────────
    // We keep raw input in local state and debounce it before
    // dispatching to Redux (to avoid Redux updates on every keystroke)
    const [inputText, setInputText] = useState(savedSearch);

    // ── useRef: reference FlatList to scroll to top ───────────
    const flatListRef = useRef(null);

    // ── useDebounce: custom hook ───────────────────────────────
    // Only update Redux search query 400ms after the user stops typing
    const debouncedSearch = useDebounce(inputText, 400);

    // ── useLayoutEffect: update navigation header ─────────────
    // useLayoutEffect fires synchronously AFTER DOM updates
    // but BEFORE the screen renders — perfect for header mutations
    useLayoutEffect(() => {
        navigation.setOptions({
            headerTitle: selectedCategory === 'all'
                ? 'All Products'
                : selectedCategory.toUpperCase(),
        });
    }, [navigation, selectedCategory]);

    // ── useEffect: fetch data on mount ────────────────────────
    useEffect(() => {
        dispatch(fetchCategoriesRequest());
        dispatch(fetchProductsRequest());
    }, []); // empty deps → runs only once on mount

    // ── useEffect: refetch when category changes ───────────────
    useEffect(() => {
        dispatch(fetchProductsRequest());
        // Scroll back to top when category changes
        flatListRef.current?.scrollToOffset({ offset: 0, animated: true });
    }, [selectedCategory]);

    // ── useEffect: dispatch debounced search to Redux ─────────
    useEffect(() => {
        dispatch(setSearchQuery(debouncedSearch));
    }, [debouncedSearch, dispatch]);

    // ── useMemo: compute filtered product list ─────────────────
    // This calculation runs only when products or search query changes,
    // not on every render of this component.
    const filteredProducts = useMemo(() => {
        if (!debouncedSearch.trim()) return products;

        const query = debouncedSearch.toLowerCase();
        return products.filter(
            p =>
                p.title.toLowerCase().includes(query) ||
                p.category.toLowerCase().includes(query),
        );
    }, [products, debouncedSearch]);

    // ── useCallback: stable handlers ──────────────────────────
    const handleProductPress = useCallback(
        product => navigation.navigate('ProductDetail', { productId: product.id }),
        [navigation],
    );

    const handleCategoryPress = useCallback(
        category => dispatch(setSelectedCategory(category)),
        [dispatch],
    );

    const handleClearSearch = useCallback(() => {
        setInputText('');
    }, []);

    // ── Render helpers ─────────────────────────────────────────
    const renderProduct = useCallback(
        ({ item }) => (
            <ProductCard product={item} onPress={handleProductPress} />
        ),
        [handleProductPress],
    );

    const renderEmpty = () => (
        <View style={styles.empty}>
            <Text style={styles.emptyEmoji}>🔍</Text>
            <Text style={styles.emptyText}>No products found</Text>
            <Text style={styles.emptySubtext}>Try a different search or category</Text>
        </View>
    );

    if (loading && products.length === 0) {
        return <Loading fullScreen message="Loading products…" />;
    }

    return (
        <SafeAreaView style={styles.flex}>
            {/* Header */}
            <View style={styles.header}>
                <View>
                    <Text style={styles.greeting}>Hello 👋</Text>
                    <Text style={styles.tagline}>Find your perfect product</Text>
                </View>
            </View>

            {/* Search Bar */}
            <View style={styles.searchRow}>
                <View style={styles.searchContainer}>
                    <Text style={styles.searchIcon}>🔍</Text>
                    <TextInput
                        style={styles.searchInput}
                        value={inputText}
                        onChangeText={setInputText}
                        placeholder="Search products…"
                        placeholderTextColor={colors.textMuted}
                    />
                    {inputText.length > 0 && (
                        <TouchableOpacity onPress={handleClearSearch}>
                            <Text style={styles.clearIcon}>✕</Text>
                        </TouchableOpacity>
                    )}
                </View>
            </View>

            {/* Category Filter Pills */}
            <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.categoriesContainer}
            >
                {['all', ...categories].map(cat => (
                    <TouchableOpacity
                        key={cat}
                        style={[
                            styles.categoryPill,
                            selectedCategory === cat && styles.categoryPillActive,
                        ]}
                        onPress={() => handleCategoryPress(cat)}
                    >
                        <Text
                            style={[
                                styles.categoryText,
                                selectedCategory === cat && styles.categoryTextActive,
                            ]}
                        >
                            {cat === 'all' ? '🏷️ All' : cat}
                        </Text>
                    </TouchableOpacity>
                ))}
            </ScrollView>

            {/* Results count */}
            <Text style={styles.resultsCount}>
                {filteredProducts.length} item{filteredProducts.length !== 1 ? 's' : ''}
            </Text>

            {/* Product Grid */}
            <FlatList
                ref={flatListRef}
                data={filteredProducts}
                renderItem={renderProduct}
                keyExtractor={item => String(item.id)}
                numColumns={2}
                columnWrapperStyle={styles.row}
                contentContainerStyle={styles.list}
                showsVerticalScrollIndicator={false}
                ListEmptyComponent={renderEmpty}
                // Performance optimizations
                removeClippedSubviews={true}
                maxToRenderPerBatch={10}
                initialNumToRender={6}
            />
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    flex: { flex: 1, backgroundColor: colors.background },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: spacing.base,
        paddingTop: spacing.base,
        paddingBottom: spacing.sm,
    },
    greeting: { fontSize: typography.fontSize.sm, color: colors.textSecondary },
    tagline: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary },
    searchRow: { paddingHorizontal: spacing.base, marginBottom: spacing.md },
    searchContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.surface,
        borderRadius: borderRadius.lg,
        paddingHorizontal: spacing.md,
        borderWidth: 1,
        borderColor: colors.border,
    },
    searchIcon: { fontSize: 16, marginRight: spacing.sm },
    searchInput: {
        flex: 1,
        paddingVertical: spacing.md,
        fontSize: typography.fontSize.base,
        color: colors.textPrimary,
    },
    clearIcon: { fontSize: 14, color: colors.textMuted, padding: spacing.xs },
    categoriesContainer: { paddingHorizontal: spacing.base, paddingBottom: spacing.md, gap: spacing.sm },
    categoryPill: {
        paddingHorizontal: spacing.md,
        paddingVertical: spacing.sm,
        borderRadius: borderRadius.full,
        backgroundColor: colors.surface,
        borderWidth: 1,
        borderColor: colors.border,
    },
    categoryPillActive: { backgroundColor: colors.primary, borderColor: colors.primary },
    categoryText: { fontSize: typography.fontSize.sm, color: colors.textSecondary, textTransform: 'capitalize' },
    categoryTextActive: { color: colors.textInverse, fontWeight: typography.fontWeight.semibold },
    resultsCount: {
        paddingHorizontal: spacing.base,
        marginBottom: spacing.sm,
        fontSize: typography.fontSize.sm,
        color: colors.textSecondary,
    },
    list: { paddingHorizontal: spacing.base, paddingBottom: spacing['3xl'] },
    row: { justifyContent: 'space-between' },
    empty: { alignItems: 'center', paddingTop: spacing['4xl'] },
    emptyEmoji: { fontSize: 48 },
    emptyText: { fontSize: typography.fontSize.lg, fontWeight: typography.fontWeight.bold, color: colors.textPrimary, marginTop: spacing.md },
    emptySubtext: { fontSize: typography.fontSize.base, color: colors.textSecondary, marginTop: spacing.sm },
});

export default HomeScreen;

# 📱 ShopNative — React Native E-Commerce Study Project

> A **fully commented, beginner-to-advanced** React Native e-commerce app
> built specifically for deep-diving into RN concepts.

---

## 🗂️ Project Structure

```
rn_e_commerce/
├── src/
│   ├── api/
│   │   └── api.js              ← Axios client, interceptors, API methods
│   │
│   ├── context/
│   │   └── ThemeContext.js     ← createContext, useContext, ThemeProvider
│   │
│   ├── hooks/                  ← Custom hooks (reusable logic)
│   │   ├── useCart.js          ← Cart facade: useSelector, useDispatch, useMemo
│   │   ├── useDebounce.js      ← Debounce: useState + useEffect cleanup
│   │   └── useLocalStorage.js  ← AsyncStorage: useState, useEffect, useCallback
│   │
│   ├── navigation/
│   │   ├── AppNavigator.js     ← Root navigator (auth check + session restore)
│   │   ├── AuthNavigator.js    ← Stack: Login → Register
│   │   └── MainNavigator.js    ← Bottom Tabs + nested HomeStack
│   │
│   ├── screens/
│   │   ├── auth/
│   │   │   ├── LoginScreen.js      ← useState, useEffect, useRef, useCallback
│   │   │   └── RegisterScreen.js   ← useReducer (form state management)
│   │   ├── home/
│   │   │   └── HomeScreen.js       ← 8 hooks! Full product listing with filters
│   │   ├── product/
│   │   │   └── ProductDetailScreen.js ← Product detail + add to cart
│   │   ├── cart/
│   │   │   └── CartScreen.js       ← Cart + order summary (tax, shipping)
│   │   ├── wishlist/
│   │   │   └── WishlistScreen.js   ← Saved products list
│   │   └── profile/
│   │       └── ProfileScreen.js    ← useContext (theme toggle), stats
│   │
│   ├── store/                  ← Redux store (Redux Toolkit + Redux Saga)
│   │   ├── index.js            ← Store configuration + saga middleware
│   │   ├── rootReducer.js      ← combineReducers
│   │   ├── rootSaga.js         ← Root saga (runs all sagas in parallel)
│   │   ├── slices/
│   │   │   ├── authSlice.js    ← Auth state (login, logout, register)
│   │   │   ├── productSlice.js ← Products, categories, search, filters
│   │   │   ├── cartSlice.js    ← Cart items with Immer mutations
│   │   │   └── wishlistSlice.js← Wishlist toggle pattern
│   │   └── sagas/
│   │       ├── authSaga.js     ← Saga effects: call, put, takeLatest
│   │       └── productSaga.js  ← Saga effects: call, put, select, takeLatest
│   │
│   ├── components/
│   │   └── common/
│   │       ├── Button.js       ← Animated button, variants, useRef
│   │       ├── Loading.js      ← Fade-in spinner, useEffect + useRef
│   │       └── ProductCard.js  ← Grid card, useState, useCallback, useMemo
│   │
│   ├── theme/
│   │   ├── colors.js           ← Color palette (single source of truth)
│   │   ├── typography.js       ← Font sizes, weights, line heights
│   │   └── index.js            ← Re-exports + spacing, borderRadius, shadow
│   │
│   └── utils/
│       ├── helpers.js          ← Pure utility functions
│       └── storage.js          ← AsyncStorage wrapper + key constants
│
├── App.js                      ← Root: Provider + ThemeProvider + AppNavigator
└── index.js                    ← Entry point (gesture-handler import first!)
```

---

## 🪝 React Hooks Covered

| Hook | Where it's used | What it teaches |
|------|----------------|-----------------|
| `useState` | Every screen | Local state management |
| `useEffect` | HomeScreen, LoginScreen, AppNavigator | Side effects, data fetching, cleanup |
| `useCallback` | All handlers in all screens | Memoized callbacks, prevent re-renders |
| `useMemo` | HomeScreen, CartScreen, useCart | Derived/computed values caching |
| `useRef` | Button (animation), LoginScreen (input focus), HomeScreen (FlatList scroll) | DOM refs, Animated values, instance values |
| `useReducer` | RegisterScreen | Complex local state (alternative to multiple useState) |
| `useContext` | ProfileScreen via `useTheme()` | Context consumption without prop drilling |
| `useLayoutEffect` | HomeScreen, ProductDetailScreen | Navigation header updates before paint |
| `useSelector` | All Redux-connected screens | Reading from Redux store |
| `useDispatch` | All Redux-connected screens | Dispatching actions |
| **Custom: `useCart`** | CartScreen, WishlistScreen, ProductDetailScreen | Facade pattern, encapsulating Redux logic |
| **Custom: `useDebounce`** | HomeScreen | Debounce with useState + useEffect cleanup |
| **Custom: `useLocalStorage`** | (available) | AsyncStorage with useState + useEffect |
| **Custom: `useTheme`** | ProfileScreen | Context + custom hook pattern |

---

## 🔄 Redux + Redux Saga Flow

```
┌─────────────────────────────────────────────────────────┐
│                      DISPATCH                           │
│  dispatch(loginRequest({ username, password }))         │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│                  SAGA MIDDLEWARE                         │
│  takeLatest(loginRequest.type, handleLogin)             │
│                                                         │
│  function* handleLogin(action) {                        │
│    const response = yield call(authAPI.login, creds)    │
│    yield put(loginSuccess({ user, token }))             │
│  }                                                      │
└──────────────────────┬──────────────────────────────────┘
                       │ put()
                       ▼
┌─────────────────────────────────────────────────────────┐
│                    REDUCER                              │
│  loginSuccess: (state) => {                             │
│    state.isAuthenticated = true                         │
│    state.user = action.payload.user                     │
│  }                                                      │
└──────────────────────┬──────────────────────────────────┘
                       │
                       ▼
┌─────────────────────────────────────────────────────────┐
│               COMPONENT RE-RENDERS                      │
│  useSelector(selectIsAuthenticated) → true              │
│  AppNavigator renders MainNavigator                     │
└─────────────────────────────────────────────────────────┘
```

---

## 🚀 Saga Effects Reference

| Effect | Syntax | What it does |
|--------|--------|--------------|
| `call` | `yield call(fn, arg)` | Awaits a Promise (API call, storage) |
| `put` | `yield put(action)` | Dispatches a Redux action |
| `select` | `yield select(selector)` | Reads current Redux state |
| `takeLatest` | `takeLatest(type, fn)` | Listens & cancels previous if still running |
| `takeEvery` | `takeEvery(type, fn)` | Listens & processes every action |
| `all` | `yield all([...])` | Runs multiple effects in parallel |
| `fork` | `yield fork(fn)` | Runs non-blocking sub-tasks |

---

## 🛠️ Running the App

```bash
# 1. Open Terminal 1 — Start Metro
source ~/.nvm/nvm.sh && nvm use 20
cd ~/Desktop/rn_e_commerce
npx react-native start

# 2. Open Terminal 2 — Run Android
source ~/.nvm/nvm.sh && nvm use 20
cd ~/Desktop/rn_e_commerce
npx react-native run-android
```

---

## 🔑 Demo Login Credentials

The app uses [FakeStore API](https://fakestoreapi.com/) as its backend.

```
Username: johnd
Password: m38rmF$
```

Tap the **"🔑 Tap to use demo credentials"** banner on the login screen to auto-fill.

---

## 📦 Dependencies

| Package | Purpose |
|---------|---------|
| `@react-navigation/native` | Navigation container |
| `@react-navigation/stack` | Stack navigator (auth flow) |
| `@react-navigation/bottom-tabs` | Tab bar navigator |
| `react-native-screens` | Native screen components |
| `react-native-gesture-handler` | Gesture support (required by navigation) |
| `@reduxjs/toolkit` | Redux store + createSlice |
| `react-redux` | Provider, useSelector, useDispatch |
| `redux-saga` | Async middleware (Generator-based) |
| `axios` | HTTP client with interceptors |
| `@react-native-async-storage/async-storage` | Persistent local storage |

---

## 🎯 Learning Roadmap

1. **Start here →** Read `src/store/index.js` (how the store is set up)
2. **Then →** Read `src/store/slices/authSlice.js` (what createSlice does)
3. **Then →** Read `src/store/sagas/authSaga.js` (how sagas work)
4. **Then →** Read `src/screens/auth/LoginScreen.js` (dispatching from UI)
5. **Then →** Read `src/hooks/useDebounce.js` (custom hook pattern)
6. **Then →** Read `src/screens/home/HomeScreen.js` (all hooks together)
7. **Then →** Read `src/context/ThemeContext.js` (Context API)
8. **Then →** Experiment! Modify a screen and see the effect.

---

*Built with ❤️ for deep React Native learning.*
# rn_e_commerce
# rn_e_commerce

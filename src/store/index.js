/**
 * ============================================================
 * REDUX STORE  (src/store/index.js)
 * ============================================================
 *
 * Configures the Redux store with:
 *   - rootReducer     (all slice reducers combined)
 *   - redux-saga      (middleware for async side effects)
 *   - DevTools        (enabled automatically in DEV by RTK)
 *
 * HOW redux-saga MIDDLEWARE WORKS:
 *   1. Action dispatched → Redux middleware chain intercepts it
 *   2. saga middleware checks if any saga watches for that action type
 *   3. If yes → runs the generator function (non-blocking)
 *   4. Generator uses call/put/select to do async work
 *   5. Regular reducers also receive the action (saga doesn't "eat" it)
 *
 * This file is imported in App.js and the store is passed to
 * the <Provider> component which makes it available everywhere.
 * ============================================================
 */

import { configureStore } from '@reduxjs/toolkit';
import createSagaMiddleware from 'redux-saga';

import rootReducer from './rootReducer';
import rootSaga from './rootSaga';

// ① Create the saga middleware instance
//    Must be created BEFORE configureStore
const sagaMiddleware = createSagaMiddleware();

// ② Configure the store
const store = configureStore({
    reducer: rootReducer,

    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            // redux-saga handles the async logic, so we disable Thunk
            thunk: false,

            // Saga passes non-serializable values (e.g., Promise, Error).
            // Disable the serializable check to avoid noisy warnings.
            serializableCheck: false,
        }).concat(sagaMiddleware),

    // devTools: true is the default in DEV, false in PROD
    // RTK handles this automatically based on NODE_ENV
});

// ③ Start the root saga AFTER the store is created
//    rootSaga forks all feature sagas and starts listening for actions
sagaMiddleware.run(rootSaga);

export default store;

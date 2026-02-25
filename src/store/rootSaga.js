/**
 * ============================================================
 * ROOT SAGA  (src/store/rootSaga.js)
 * ============================================================
 *
 * Combines all feature sagas into a single saga that is passed
 * to the middleware.
 *
 * `all([...])` runs all watcher sagas in PARALLEL.
 * If one saga crashes, the others keep running.
 *
 * Adding a new feature saga? Just:
 *   1. Create your saga file
 *   2. Import it here
 *   3. Add it to the all([]) array
 * ============================================================
 */

import { all } from 'redux-saga/effects';
import { authSaga } from './sagas/authSaga';
import { productSaga } from './sagas/productSaga';

export default function* rootSaga() {
    // `all` forks all sagas in parallel — they all start listening
    // for their respective actions simultaneously.
    yield all([
        authSaga(),
        productSaga(),
    ]);
}

/**
 * ============================================================
 * CUSTOM HOOK — useDebounce  (src/hooks/useDebounce.js)
 * ============================================================
 *
 * WHAT IS DEBOUNCING?
 *   Debouncing delays processing a rapidly changing value until
 *   it has "settled" for a given period.  Classic use-case:
 *   search input — don't fire an API call on every keystroke,
 *   only after the user pauses typing for 300 ms.
 *
 * HOOKS DEMONSTRATED:
 *   ✅ useState   — hold the debounced value
 *   ✅ useEffect  — set up & clear the debounce timer
 *
 * USAGE:
 *   const debouncedSearch = useDebounce(searchText, 400);
 *   // debouncedSearch updates 400 ms after searchText stops changing
 * ============================================================
 */

import { useState, useEffect } from 'react';

/**
 * @param {any}    value  - The value to debounce (usually text input)
 * @param {number} delay  - Milliseconds to wait (default: 300 ms)
 * @returns {any} The debounced value
 */
const useDebounce = (value, delay = 300) => {
    // Store the "settled" value separately from the live input value
    const [debouncedValue, setDebouncedValue] = useState(value);

    useEffect(() => {
        // ① Start a timer — after `delay` ms, update the debounced value
        const timer = setTimeout(() => {
            setDebouncedValue(value);
        }, delay);

        // ② CLEANUP FUNCTION — this runs before the effect re-runs
        //    (i.e., when `value` changes before the timer fires).
        //    It cancels the previous timer, effectively resetting the delay.
        //    This is the core of debouncing!
        return () => clearTimeout(timer);

        // Effect dependencies: re-run whenever value or delay changes
    }, [value, delay]);

    return debouncedValue;
};

export default useDebounce;

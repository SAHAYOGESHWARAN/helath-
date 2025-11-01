"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.useDebounce = useDebounce;
var react_1 = require("react");
/**
 * A custom hook that debounces a value.
 * @param value The value to debounce.
 * @param delay The delay in milliseconds.
 * @returns The debounced value.
 */
function useDebounce(value, delay) {
    var _a = (0, react_1.useState)(value), debouncedValue = _a[0], setDebouncedValue = _a[1];
    (0, react_1.useEffect)(function () {
        // Set debouncedValue to value (passed in) after the specified delay
        var handler = setTimeout(function () {
            setDebouncedValue(value);
        }, delay);
        // Return a cleanup function that will be called every time ...
        // ... useEffect is re-called. useEffect will only be re-called ...
        // ... if value or delay changes (see the inputs array below).
        // This is how we prevent debouncedValue from changing if value is ...
        // ... changed within the delay period. Timeout gets cleared and restarted.
        return function () {
            clearTimeout(handler);
        };
    }, [value, delay] // Only re-call effect if value or delay changes
    );
    return debouncedValue;
}

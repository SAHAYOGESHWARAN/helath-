"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __spreadArray = (this && this.__spreadArray) || function (to, from, pack) {
    if (pack || arguments.length === 2) for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
            if (!ar) ar = Array.prototype.slice.call(from, 0, i);
            ar[i] = from[i];
        }
    }
    return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.useTable = void 0;
var react_1 = require("react");
var useDebounce_1 = require("./useDebounce");
var useTable = function (initialData, initialItemsPerPage, options) {
    if (initialItemsPerPage === void 0) { initialItemsPerPage = 10; }
    var _a = (0, react_1.useState)(1), currentPage = _a[0], setCurrentPage = _a[1];
    var _b = (0, react_1.useState)((options === null || options === void 0 ? void 0 : options.initialSort) || null), sortConfig = _b[0], setSortConfig = _b[1];
    var _c = (0, react_1.useState)(''), globalFilter = _c[0], setGlobalFilter = _c[1];
    var _d = (0, react_1.useState)({}), columnFilters = _d[0], setColumnFilters = _d[1];
    var debouncedGlobalFilter = (0, useDebounce_1.useDebounce)(globalFilter, 300);
    var debouncedColumnFilters = (0, useDebounce_1.useDebounce)(columnFilters, 300);
    (0, react_1.useEffect)(function () {
        setCurrentPage(1);
    }, [debouncedGlobalFilter, debouncedColumnFilters]);
    var filteredData = (0, react_1.useMemo)(function () {
        var data = __spreadArray([], initialData, true);
        if (debouncedGlobalFilter) {
            var lowercasedFilter_1 = debouncedGlobalFilter.toLowerCase();
            data = data.filter(function (item) {
                return Object.values(item).some(function (value) {
                    return String(value).toLowerCase().includes(lowercasedFilter_1);
                });
            });
        }
        var startDate = debouncedColumnFilters.startDate, endDate = debouncedColumnFilters.endDate, otherFilters = __rest(debouncedColumnFilters, ["startDate", "endDate"]);
        var dateKey = options === null || options === void 0 ? void 0 : options.dateRangeFilterKey;
        if (dateKey) {
            if (startDate) {
                var start_1 = new Date(startDate);
                if (!isNaN(start_1.getTime())) {
                    data = data.filter(function (item) { return item[dateKey] && new Date(item[dateKey]) >= start_1; });
                }
            }
            if (endDate) {
                var end_1 = new Date(endDate);
                if (!isNaN(end_1.getTime())) {
                    end_1.setDate(end_1.getDate() + 1); // To include the end date
                    data = data.filter(function (item) { return item[dateKey] && new Date(item[dateKey]) < end_1; });
                }
            }
        }
        Object.entries(otherFilters).forEach(function (_a) {
            var key = _a[0], value = _a[1];
            if (value && value !== 'All') {
                var lowercasedValue_1 = String(value).toLowerCase();
                data = data.filter(function (item) {
                    var itemValue = item[key];
                    return itemValue !== undefined && String(itemValue).toLowerCase().includes(lowercasedValue_1);
                });
            }
        });
        return data;
    }, [initialData, debouncedGlobalFilter, debouncedColumnFilters, options === null || options === void 0 ? void 0 : options.dateRangeFilterKey]);
    var sortedData = (0, react_1.useMemo)(function () {
        var sortableItems = __spreadArray([], filteredData, true);
        if (sortConfig !== null) {
            sortableItems.sort(function (a, b) {
                var aVal = a[sortConfig.key];
                var bVal = b[sortConfig.key];
                if (aVal === undefined || aVal === null)
                    return 1;
                if (bVal === undefined || bVal === null)
                    return -1;
                if (new Date(aVal).toString() !== 'Invalid Date' && new Date(bVal).toString() !== 'Invalid Date') {
                    var dateA = new Date(aVal).getTime();
                    var dateB = new Date(bVal).getTime();
                    if (dateA < dateB) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (dateA > dateB) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }
                if (aVal < bVal) {
                    return sortConfig.direction === 'asc' ? -1 : 1;
                }
                if (aVal > bVal) {
                    return sortConfig.direction === 'asc' ? 1 : -1;
                }
                return 0;
            });
        }
        return sortableItems;
    }, [filteredData, sortConfig]);
    var totalPages = Math.ceil(sortedData.length / initialItemsPerPage);
    (0, react_1.useEffect)(function () {
        if (currentPage > totalPages && totalPages > 0) {
            setCurrentPage(totalPages);
        }
    }, [currentPage, totalPages]);
    var paginatedData = (0, react_1.useMemo)(function () {
        var startIndex = (currentPage - 1) * initialItemsPerPage;
        return sortedData.slice(startIndex, startIndex + initialItemsPerPage);
    }, [currentPage, sortedData, initialItemsPerPage]);
    var requestSort = function (key) {
        var direction = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: key, direction: direction });
    };
    var getSortArrow = function (key) {
        if (!sortConfig || sortConfig.key !== key)
            return null;
        return react_1.default.createElement('span', { className: "ml-1" }, sortConfig.direction === 'asc' ? '▲' : '▼');
    };
    // FIX: Expose columnFilters to allow components to read the current filter state.
    return {
        paginatedItems: paginatedData,
        sortedAndFilteredItems: sortedData,
        requestSort: requestSort,
        getSortArrow: getSortArrow,
        setPage: setCurrentPage,
        setGlobalFilter: setGlobalFilter,
        setColumnFilters: setColumnFilters,
        columnFilters: columnFilters,
        paginationProps: {
            currentPage: currentPage > totalPages && totalPages > 0 ? totalPages : currentPage,
            totalPages: totalPages,
            totalItems: sortedData.length,
            itemsPerPage: initialItemsPerPage,
            onPageChange: setCurrentPage,
        },
    };
};
exports.useTable = useTable;

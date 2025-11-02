import React, { useState, useMemo, useEffect } from 'react';
import { useDebounce } from './useDebounce';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
    key: keyof T;
    direction: SortDirection;
}

interface UseTableOptions<T> {
    initialSort?: SortConfig<T>;
    dateRangeFilterKey?: keyof T;
}

export const useTable = <T extends Record<string, any>>(
    initialData: T[],
    initialItemsPerPage: number = 10,
    options?: UseTableOptions<T>
) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(options?.initialSort || null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<Partial<Record<keyof T | 'startDate' | 'endDate', string>>>({});
    
    const debouncedGlobalFilter = useDebounce(globalFilter, 300);
    const debouncedColumnFilters = useDebounce(columnFilters, 300);

    useEffect(() => {
        setCurrentPage(1);
    }, [debouncedGlobalFilter, debouncedColumnFilters]);

    const filteredData = useMemo(() => {
        let data = [...initialData];
        
        if (debouncedGlobalFilter) {
            const lowercasedFilter = debouncedGlobalFilter.toLowerCase();
            data = data.filter(item => 
                Object.values(item).some(value => 
                    String(value).toLowerCase().includes(lowercasedFilter)
                )
            );
        }

        const { startDate, endDate, ...otherFilters } = debouncedColumnFilters;
        const dateKey = options?.dateRangeFilterKey as keyof T;

        if (dateKey) {
            if (startDate) {
                const start = new Date(startDate as string);
                if (!isNaN(start.getTime())) {
                    data = data.filter(item => item[dateKey] && new Date(item[dateKey]) >= start);
                }
            }
            if (endDate) {
                const end = new Date(endDate as string);
                if (!isNaN(end.getTime())) {
                    end.setDate(end.getDate() + 1); // To include the end date
                    data = data.filter(item => item[dateKey] && new Date(item[dateKey]) < end);
                }
            }
        }

        Object.entries(otherFilters).forEach(([key, value]) => {
            if (value && value !== 'All') {
                const lowercasedValue = String(value).toLowerCase();
                data = data.filter(item => {
                    const itemValue = item[key as keyof T];
                    return itemValue !== undefined && String(itemValue).toLowerCase().includes(lowercasedValue);
                });
            }
        });
        
        return data;
    }, [initialData, debouncedGlobalFilter, debouncedColumnFilters, options?.dateRangeFilterKey]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                
                if (aVal === undefined || aVal === null) return 1;
                if (bVal === undefined || bVal === null) return -1;

                // Date sorting
                if (new Date(aVal).toString() !== 'Invalid Date' && new Date(bVal).toString() !== 'Invalid Date') {
                    const dateA = new Date(aVal).getTime();
                    const dateB = new Date(bVal).getTime();
                     if (dateA < dateB) {
                        return sortConfig.direction === 'asc' ? -1 : 1;
                    }
                    if (dateA > dateB) {
                        return sortConfig.direction === 'asc' ? 1 : -1;
                    }
                    return 0;
                }

                // General sorting
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

    const totalPages = Math.ceil(sortedData.length / initialItemsPerPage);
    
    useEffect(() => {
      if (currentPage > totalPages && totalPages > 0) {
          setCurrentPage(totalPages);
      }
    }, [currentPage, totalPages]);
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * initialItemsPerPage;
        return sortedData.slice(startIndex, startIndex + initialItemsPerPage);
    }, [currentPage, sortedData, initialItemsPerPage]);
    
    const requestSort = (key: string) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key: key as keyof T, direction });
    };

    const getSortArrow = (key: string) => {
        if (!sortConfig || sortConfig.key !== key) return null;
        return React.createElement('span', { className: "ml-1" }, sortConfig.direction === 'asc' ? '▲' : '▼');
    };

    return {
        paginatedItems: paginatedData,
        sortedAndFilteredItems: sortedData,
        requestSort,
        getSortArrow,
        setPage: setCurrentPage,
        setGlobalFilter,
        setColumnFilters,
        columnFilters,
        paginationProps: {
            currentPage: currentPage > totalPages && totalPages > 0 ? totalPages : currentPage,
            totalPages,
            totalItems: sortedData.length,
            itemsPerPage: initialItemsPerPage,
            onPageChange: setCurrentPage,
        },
    };
};

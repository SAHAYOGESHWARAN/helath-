import { useState, useMemo, useEffect } from 'react';

type SortDirection = 'asc' | 'desc';

interface SortConfig<T> {
    key: keyof T;
    direction: SortDirection;
}

export const useTable = <T extends Record<string, any>>(
    initialData: T[],
    initialItemsPerPage: number = 10,
) => {
    const [currentPage, setCurrentPage] = useState(1);
    const [sortConfig, setSortConfig] = useState<SortConfig<T> | null>(null);
    const [globalFilter, setGlobalFilter] = useState('');
    const [columnFilters, setColumnFilters] = useState<Partial<Record<keyof T, string>>>({});

    useEffect(() => {
        setCurrentPage(1);
    }, [globalFilter, columnFilters]);

    const filteredData = useMemo(() => {
        let data = [...initialData];
        
        // Global search filter
        if (globalFilter) {
            const lowercasedFilter = globalFilter.toLowerCase();
            data = data.filter(item => 
                Object.values(item).some(value => 
                    String(value).toLowerCase().includes(lowercasedFilter)
                )
            );
        }

        // Column-specific filters
        Object.entries(columnFilters).forEach(([key, value]) => {
            if (value && value !== 'All') {
                const lowercasedValue = String(value).toLowerCase();
                data = data.filter(item => {
                    const itemValue = item[key as keyof T];
                    return itemValue !== undefined && String(itemValue).toLowerCase() === lowercasedValue;
                });
            }
        });
        
        return data;
    }, [initialData, globalFilter, columnFilters]);

    const sortedData = useMemo(() => {
        let sortableItems = [...filteredData];
        if (sortConfig !== null) {
            sortableItems.sort((a, b) => {
                const aVal = a[sortConfig.key];
                const bVal = b[sortConfig.key];
                
                if (aVal === undefined || aVal === null) return 1;
                if (bVal === undefined || bVal === null) return -1;

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
    if (currentPage > totalPages && totalPages > 0) {
        setCurrentPage(totalPages);
    }
    
    const paginatedData = useMemo(() => {
        const startIndex = (currentPage - 1) * initialItemsPerPage;
        return sortedData.slice(startIndex, startIndex + initialItemsPerPage);
    }, [currentPage, sortedData, initialItemsPerPage]);
    
    const requestSort = (key: keyof T) => {
        let direction: SortDirection = 'asc';
        if (sortConfig && sortConfig.key === key && sortConfig.direction === 'asc') {
            direction = 'desc';
        }
        setSortConfig({ key, direction });
    };

    const getSortArrow = (key: keyof T) => {
        if (!sortConfig || sortConfig.key !== key) return ' ';
        return sortConfig.direction === 'asc' ? ' ▲' : ' ▼';
    };

    return {
        paginatedItems: paginatedData,
        requestSort,
        getSortArrow,
        setPage: setCurrentPage,
        setGlobalFilter,
        setColumnFilters,
        paginationProps: {
            currentPage,
            totalPages,
            totalItems: sortedData.length,
            itemsPerPage: initialItemsPerPage,
            onPageChange: setCurrentPage,
        },
    };
};

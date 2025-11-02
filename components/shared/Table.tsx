import React from 'react';
import { ChevronUpDownIcon } from './Icons';
import SkeletonTableRow from './skeletons/SkeletonTableRow';

export interface ColumnDefinition<T> {
  accessorKey: keyof T | (string & {});
  header: React.ReactNode;
  cell?: (row: T) => React.ReactNode;
  headerClassName?: string;
  cellClassName?: string;
}

interface TableProps<T> {
  data: T[];
  columns: ColumnDefinition<T>[];
  isLoading?: boolean;
  onRowClick?: (row: T) => void;
  requestSort?: (key: string) => void;
  getSortArrow?: (key: string) => React.ReactNode;
  emptyState?: React.ReactNode;
}

export const Table = <T extends { id: string | number }>({
  data,
  columns,
  isLoading = false,
  onRowClick,
  requestSort,
  getSortArrow,
  emptyState,
}: TableProps<T>) => {
  const defaultCellRenderer = (row: T, accessorKey: keyof T | (string & {})) => {
    const value = (row as any)[accessorKey];
    return value !== null && value !== undefined ? String(value) : '';
  };
  
  const headerContent = (col: ColumnDefinition<T>) => {
    if (requestSort && getSortArrow) {
      return (
        <div className="flex items-center">
          {col.header}
          <span className="ml-1 w-4 h-4">{getSortArrow(col.accessorKey as string) || <ChevronUpDownIcon className="w-4 h-4 text-gray-300" />}</span>
        </div>
      );
    }
    return col.header;
  };

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map((col) => (
              <th
                key={col.accessorKey as string}
                onClick={requestSort ? () => requestSort(col.accessorKey as string) : undefined}
                className={`px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ${requestSort ? 'cursor-pointer hover:bg-gray-100' : ''} ${col.headerClassName || ''}`}
              >
                {headerContent(col)}
              </th>
            ))}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (
            Array.from({ length: 5 }).map((_, i) => <SkeletonTableRow key={i} columns={columns.length} />)
          ) : data.length > 0 ? (
            data.map((row) => (
              <tr
                key={row.id}
                onClick={onRowClick ? () => onRowClick(row) : undefined}
                className={onRowClick ? 'cursor-pointer hover:bg-primary-50 transition-colors' : ''}
              >
                {columns.map((col) => (
                  <td key={`${row.id}-${col.accessorKey as string}`} className={`px-6 py-4 whitespace-nowrap text-sm ${col.cellClassName || 'text-gray-700'}`}>
                    {col.cell ? col.cell(row) : defaultCellRenderer(row, col.accessorKey)}
                  </td>
                ))}
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan={columns.length}>
                {emptyState || <div className="text-center py-10 text-gray-500">No data available.</div>}
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

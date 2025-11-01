"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Table = void 0;
var react_1 = require("react");
var Icons_1 = require("./Icons");
var SkeletonTableRow_1 = require("./skeletons/SkeletonTableRow");
var Table = function (_a) {
    var data = _a.data, columns = _a.columns, _b = _a.isLoading, isLoading = _b === void 0 ? false : _b, onRowClick = _a.onRowClick, requestSort = _a.requestSort, getSortArrow = _a.getSortArrow, emptyState = _a.emptyState;
    var defaultCellRenderer = function (row, accessorKey) {
        var value = row[accessorKey];
        return value !== null && value !== undefined ? String(value) : '';
    };
    var headerContent = function (col) {
        if (requestSort && getSortArrow) {
            return (<div className="flex items-center">
          {col.header}
          <span className="ml-1 w-4 h-4">{getSortArrow(col.accessorKey) || <Icons_1.ChevronUpDownIcon className="w-4 h-4 text-gray-300"/>}</span>
        </div>);
        }
        return col.header;
    };
    return (<div className="overflow-x-auto">
      <table className="min-w-full divide-y divide-gray-200">
        <thead className="bg-gray-50">
          <tr>
            {columns.map(function (col) { return (<th key={col.accessorKey} onClick={requestSort ? function () { return requestSort(col.accessorKey); } : undefined} className={"px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider ".concat(requestSort ? 'cursor-pointer hover:bg-gray-100' : '', " ").concat(col.headerClassName || '')}>
                {headerContent(col)}
              </th>); })}
          </tr>
        </thead>
        <tbody className="bg-white divide-y divide-gray-200">
          {isLoading ? (Array.from({ length: 5 }).map(function (_, i) { return <SkeletonTableRow_1.default key={i} columns={columns.length}/>; })) : data.length > 0 ? (data.map(function (row) { return (<tr key={row.id} onClick={onRowClick ? function () { return onRowClick(row); } : undefined} className={onRowClick ? 'cursor-pointer hover:bg-primary-50 transition-colors' : ''}>
                {columns.map(function (col) { return (<td key={"".concat(row.id, "-").concat(col.accessorKey)} className={"px-6 py-4 whitespace-nowrap text-sm ".concat(col.cellClassName || 'text-gray-700')}>
                    {col.cell ? col.cell(row) : defaultCellRenderer(row, col.accessorKey)}
                  </td>); })}
              </tr>); })) : (<tr>
              <td colSpan={columns.length}>
                {emptyState || <div className="text-center py-10 text-gray-500">No data available.</div>}
              </td>
            </tr>)}
        </tbody>
      </table>
    </div>);
};
exports.Table = Table;

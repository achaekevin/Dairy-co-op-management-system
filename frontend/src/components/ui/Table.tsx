import { type ReactNode } from 'react';
import { HiChevronDown, HiChevronUp, HiArrowsUpDown } from 'react-icons/hi2';
import { cn } from '../../utils/cn';

export interface Column<T> {
  id: string;
  header: string;
  accessor: keyof T | ((row: T) => ReactNode);
  sortable?: boolean;
  width?: string;
  align?: 'left' | 'center' | 'right';
}

export interface TableProps<T> {
  columns: Column<T>[];
  data: T[];
  sortColumn?: string;
  sortDirection?: 'asc' | 'desc';
  onSort?: (columnId: string) => void;
  onRowClick?: (row: T, index: number) => void;
  emptyMessage?: string;
  striped?: boolean;
  hoverable?: boolean;
  className?: string;
}

const Table = <T extends Record<string, unknown>>({
  columns,
  data,
  sortColumn,
  sortDirection,
  onSort,
  onRowClick,
  emptyMessage = 'No data available',
  striped = false,
  hoverable = true,
  className,
}: TableProps<T>) => {
  const getCellValue = (row: T, column: Column<T>): ReactNode => {
    if (typeof column.accessor === 'function') {
      return column.accessor(row);
    }
    return row[column.accessor] as ReactNode;
  };

  const handleSort = (columnId: string, sortable?: boolean) => {
    if (sortable && onSort) {
      onSort(columnId);
    }
  };

  return (
    <div className={cn('w-full overflow-x-auto scrollbar-thin', className)}>
      <table className="w-full text-sm text-left">
        {/* Table Header */}
        <thead className="text-xs font-medium uppercase bg-slate-50 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border-b border-slate-200 dark:border-slate-700">
          <tr>
            {columns.map((column) => (
              <th
                key={column.id}
                onClick={() => handleSort(column.id, column.sortable)}
                style={{ width: column.width }}
                className={cn(
                  'px-6 py-3',
                  column.align === 'center' && 'text-center',
                  column.align === 'right' && 'text-right',
                  column.sortable &&
                    'cursor-pointer select-none hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors'
                )}
              >
                <div
                  className={cn(
                    'flex items-center gap-2',
                    column.align === 'center' && 'justify-center',
                    column.align === 'right' && 'justify-end'
                  )}
                >
                  <span>{column.header}</span>
                  {column.sortable && (
                    <span className="text-slate-400">
                      {sortColumn === column.id ? (
                        sortDirection === 'asc' ? (
                          <HiChevronUp className="w-4 h-4" />
                        ) : (
                          <HiChevronDown className="w-4 h-4" />
                        )
                      ) : (
                        <HiArrowsUpDown className="w-4 h-4" />
                      )}
                    </span>
                  )}
                </div>
              </th>
            ))}
          </tr>
        </thead>

        {/* Table Body */}
        <tbody>
          {data.length === 0 ? (
            <tr>
              <td
                colSpan={columns.length}
                className="px-6 py-8 text-center text-slate-500 dark:text-slate-400"
              >
                {emptyMessage}
              </td>
            </tr>
          ) : (
            data.map((row, rowIndex) => (
              <tr
                key={rowIndex}
                onClick={() => onRowClick?.(row, rowIndex)}
                className={cn(
                  'border-b border-slate-200 dark:border-slate-700',
                  'text-slate-900 dark:text-white',
                  striped &&
                    rowIndex % 2 === 0 &&
                    'bg-slate-50 dark:bg-slate-800/50',
                  hoverable && 'hover:bg-slate-100 dark:hover:bg-slate-800',
                  onRowClick && 'cursor-pointer'
                )}
              >
                {columns.map((column) => (
                  <td
                    key={column.id}
                    className={cn(
                      'px-6 py-4',
                      column.align === 'center' && 'text-center',
                      column.align === 'right' && 'text-right'
                    )}
                  >
                    {getCellValue(row, column)}
                  </td>
                ))}
              </tr>
            ))
          )}
        </tbody>
      </table>
    </div>
  );
};

export default Table;

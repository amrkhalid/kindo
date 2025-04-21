
import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useTranslation } from 'react-i18next';

interface Column {
  key: string;
  title: string;
  render?: (value: any, row: any) => React.ReactNode;
}

interface DataTableProps {
  columns: Column[];
  data: any[];
  title: string;
  onAdd?: () => void;
}

export const DataTable = ({ columns, data, title, onAdd }: DataTableProps) => {
  const { i18n } = useTranslation();
  const [filteredData, setFilteredData] = useState(data);
  const [displayedItems, setDisplayedItems] = useState(10);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.dir() === 'rtl';

  // Apply sorting when config changes
  useEffect(() => {
    let result = [...data];
    
    if (sortConfig) {
      result = result.sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setDisplayedItems(10);
  }, [data, sortConfig]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedItems < filteredData.length) {
          setTimeout(() => {
            setDisplayedItems((prev) => Math.min(prev + 10, filteredData.length));
          }, 300);
        }
      },
      { threshold: 0.5 }
    );

    if (bottomRef.current) {
      observerRef.current.observe(bottomRef.current);
    }

    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, [displayedItems, filteredData.length]);

  // Add animation classes to newly visible items
  useEffect(() => {
    const rows = document.querySelectorAll('.scrolling-pagination-item:not(.visible)');
    
    setTimeout(() => {
      rows.forEach(row => {
        row.classList.add('visible');
      });
    }, 50);
  }, [displayedItems]);

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`space-y-4 p-4 bg-white rounded-lg shadow ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">{title}</h2>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={`${isRTL ? 'text-right' : 'text-left'}`}
                >
                  <div 
                    className="flex items-center gap-2 justify-between cursor-pointer" 
                    onClick={() => handleSort(column.key)}
                  >
                    <span>{column.title}</span>
                    <span>{getSortIcon(column.key)}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody ref={tableBodyRef}>
            {filteredData.slice(0, displayedItems).map((row, rowIndex) => (
              <TableRow 
                key={row.id || rowIndex}
                className={`scrolling-pagination-item ${rowIndex < displayedItems - 10 ? 'visible' : ''}`}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={`${row.id}-${column.key}`}
                    className={isRTL ? 'text-right' : 'text-left'}
                  >
                    {column.render
                      ? column.render(row[column.key], row)
                      : row[column.key]}
                  </TableCell>
                ))}
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {filteredData.length > displayedItems && (
          <div 
            ref={bottomRef} 
            className="py-4 text-center text-sm text-muted-foreground"
          >
            Loading more...
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="p-4 text-center text-muted-foreground">
            No data found.
          </div>
        )}
      </div>
    </div>
  );
};


import React, { useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { ShimmerEffect } from "@/components/ui/shimmer-effect";
import { Search } from "lucide-react";
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
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState(data);
  const [displayedItems, setDisplayedItems] = useState(10);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.dir() === 'rtl';

  // Simulate loading state
  useEffect(() => {
    const timer = setTimeout(() => setIsLoading(false), 1000);
    return () => clearTimeout(timer);
  }, []);

  // Filter and sort data
  useEffect(() => {
    let result = [...data];
    
    if (searchTerm) {
      result = result.filter((item) => 
        Object.keys(item).some((key) => 
          String(item[key]).toLowerCase().includes(searchTerm.toLowerCase())
        )
      );
    }
    
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
  }, [data, sortConfig, searchTerm]);

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

  if (isLoading) {
    return (
      <div className="space-y-4 p-4 bg-white rounded-lg shadow-lg">
        <ShimmerEffect className="h-8 w-64 mb-4" />
        <div className="space-y-2">
          {[...Array(5)].map((_, idx) => (
            <ShimmerEffect key={idx} className="h-12 w-full" />
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className={`space-y-4 p-4 bg-white rounded-lg shadow-lg transition-all duration-300 hover:shadow-xl ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
        <h2 className="text-xl font-semibold text-primary">{title}</h2>
        
        <div className="relative w-full md:w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
          <Input
            placeholder="Search all columns..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 w-full bg-background/50 border-muted focus:border-primary transition-colors"
          />
        </div>
      </div>

      <div className="rounded-md border border-muted/20 overflow-hidden">
        <Table>
          <TableHeader>
            <TableRow className="bg-muted/5 hover:bg-muted/10">
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={`${isRTL ? 'text-right' : 'text-left'} py-4`}
                >
                  <div 
                    className="flex items-center gap-2 justify-between cursor-pointer hover:text-primary transition-colors" 
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
                className={`scrolling-pagination-item transition-all duration-200 hover:bg-muted/5 ${rowIndex < displayedItems - 10 ? 'visible' : ''}`}
              >
                {columns.map((column) => (
                  <TableCell 
                    key={`${row.id}-${column.key}`}
                    className={`${isRTL ? 'text-right' : 'text-left'} py-3`}
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
            className="py-4 text-center text-sm text-muted-foreground bg-muted/5"
          >
            Loading more...
          </div>
        )}

        {filteredData.length === 0 && (
          <div className="p-8 text-center text-muted-foreground">
            No data found.
          </div>
        )}
      </div>
    </div>
  );
};

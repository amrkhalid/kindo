
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
import { Button } from "@/components/ui/button";
import { 
  DropdownMenu, 
  DropdownMenuTrigger, 
  DropdownMenuContent, 
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator
} from "@/components/ui/dropdown-menu";
import { Filter, ChevronRight, ChevronLeft } from "lucide-react";
import { useTranslation } from 'react-i18next';
import { 
  ToggleGroup, 
  ToggleGroupItem 
} from "@/components/ui/toggle-group";

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
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [displayedItems, setDisplayedItems] = useState(10);
  const [sortConfig, setSortConfig] = useState<{key: string, direction: 'asc' | 'desc'} | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);
  const isRTL = i18n.dir() === 'rtl';

  // Filter data when filters change
  useEffect(() => {
    let result = data;
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        result = result.filter((item) => {
          const itemValue = String(item[key] || '').toLowerCase();
          return itemValue.includes(filters[key].toLowerCase());
        });
      }
    });

    // Apply sorting if configured
    if (sortConfig) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];
        
        if (aValue < bValue) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setCurrentPage(1);
    setDisplayedItems(itemsPerPage);
  }, [filters, data, sortConfig, itemsPerPage]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    // Create a new observer
    observerRef.current = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedItems < filteredData.length) {
          // Load more items
          setTimeout(() => {
            setDisplayedItems((prev) => Math.min(prev + 5, filteredData.length));
          }, 300);
        }
      },
      { threshold: 0.5 }
    );

    // Observe the bottom element
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

  const handleFilterChange = (key: string, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: value,
    }));
  };

  const handleClearFilters = () => {
    setFilters({});
  };

  const handleSort = (key: string) => {
    let direction: 'asc' | 'desc' = 'asc';
    
    if (sortConfig && sortConfig.key === key) {
      direction = sortConfig.direction === 'asc' ? 'desc' : 'asc';
    }
    
    setSortConfig({ key, direction });
  };

  // Calculate pagination
  const totalPages = Math.ceil(filteredData.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = Math.min(startIndex + itemsPerPage, filteredData.length);
  const currentPageData = filteredData.slice(startIndex, endIndex);

  const getSortIcon = (columnKey: string) => {
    if (!sortConfig || sortConfig.key !== columnKey) return null;
    return sortConfig.direction === 'asc' ? '↑' : '↓';
  };

  return (
    <div className={`space-y-4 p-4 bg-white rounded-lg shadow ${isRTL ? 'rtl' : 'ltr'}`}>
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        {onAdd && (
          <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
            Add New
          </Button>
        )}
      </div>

      <div className="flex flex-wrap gap-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align={isRTL ? "start" : "end"} className={`w-[280px] bg-white ${isRTL ? 'rtl text-right' : 'ltr'}`}>
            <DropdownMenuLabel>Filter Data</DropdownMenuLabel>
            <DropdownMenuSeparator />
            {columns.map((column) => (
              <DropdownMenuItem key={column.key} className="p-2">
                <div className="flex flex-col gap-1 w-full">
                  <label htmlFor={column.key} className="text-sm font-medium">
                    {column.title}
                  </label>
                  <Input
                    id={column.key}
                    placeholder={`Filter by ${column.title.toLowerCase()}`}
                    value={filters[column.key] || ""}
                    onChange={(e) => handleFilterChange(column.key, e.target.value)}
                    className="h-8"
                  />
                </div>
              </DropdownMenuItem>
            ))}
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Button 
                variant="ghost" 
                className="w-full justify-center" 
                onClick={handleClearFilters}
              >
                Clear Filters
              </Button>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
        
        <ToggleGroup type="single" defaultValue="10" className={isRTL ? 'rtl flex-row-reverse' : 'ltr'}>
          <ToggleGroupItem value="10" onClick={() => setItemsPerPage(10)}>10</ToggleGroupItem>
          <ToggleGroupItem value="20" onClick={() => setItemsPerPage(20)}>20</ToggleGroupItem>
          <ToggleGroupItem value="50" onClick={() => setItemsPerPage(50)}>50</ToggleGroupItem>
        </ToggleGroup>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead 
                  key={column.key} 
                  className={`cursor-pointer ${isRTL ? 'text-right' : 'text-left'}`}
                  onClick={() => handleSort(column.key)}
                >
                  <div className="flex items-center gap-2 justify-between">
                    <span>{column.title}</span>
                    <span>{getSortIcon(column.key)}</span>
                  </div>
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody ref={tableBodyRef}>
            {currentPageData.map((row, rowIndex) => (
              <TableRow 
                key={row.id || rowIndex}
                className={`scrolling-pagination-item ${rowIndex < displayedItems - 5 ? 'visible' : ''}`}
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

        {totalPages > 1 && (
          <div className="flex items-center justify-between border-t px-4 py-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="flex items-center gap-1"
            >
              {isRTL ? <ChevronRight className="h-4 w-4" /> : <ChevronLeft className="h-4 w-4" />}
              Prev
            </Button>
            <span className="text-sm">
              Page {currentPage} of {totalPages}
            </span>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="flex items-center gap-1"
            >
              Next
              {isRTL ? <ChevronLeft className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />}
            </Button>
          </div>
        )}

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

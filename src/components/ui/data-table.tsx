
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
  DropdownMenuItem 
} from "@/components/ui/dropdown-menu";
import { Filter } from "lucide-react";

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
  const [filteredData, setFilteredData] = useState(data);
  const [filters, setFilters] = useState<Record<string, string>>({});
  const [displayedItems, setDisplayedItems] = useState(10);
  const tableBodyRef = useRef<HTMLTableSectionElement>(null);
  const observerRef = useRef<IntersectionObserver | null>(null);
  const bottomRef = useRef<HTMLDivElement>(null);

  // Filter data when filters change
  useEffect(() => {
    let result = data;
    Object.keys(filters).forEach((key) => {
      if (filters[key]) {
        result = result.filter((item) => {
          const itemValue = String(item[key]).toLowerCase();
          return itemValue.includes(filters[key].toLowerCase());
        });
      }
    });
    setFilteredData(result);
    setDisplayedItems(10); // Reset displayed items when filter changes
  }, [filters, data]);

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

  return (
    <div className="space-y-4 p-4 bg-white rounded-lg shadow">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold">{title}</h2>
        {onAdd && (
          <Button onClick={onAdd} className="bg-primary hover:bg-primary/90">
            Add New
          </Button>
        )}
      </div>

      <div className="flex space-x-2 mb-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" className="flex items-center gap-2">
              <Filter className="h-4 w-4" />
              <span>Filter</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-[200px] bg-white">
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
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead key={column.key}>{column.title}</TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody ref={tableBodyRef}>
            {filteredData.slice(0, displayedItems).map((row, rowIndex) => (
              <TableRow 
                key={row.id || rowIndex}
                className={`scrolling-pagination-item ${rowIndex < displayedItems - 5 ? 'visible' : ''}`}
              >
                {columns.map((column) => (
                  <TableCell key={`${row.id}-${column.key}`}>
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

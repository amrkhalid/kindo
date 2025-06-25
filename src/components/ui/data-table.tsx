import { useCallback, useEffect, useRef, useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Search,
  Loader2,
  Edit,
  Trash2,
  MoreVertical,
  Plus,
  Check,
  LogOut,
  CalendarX,
} from "lucide-react";
import { useTranslation } from "react-i18next";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Checkbox } from "@/components/ui/checkbox";

interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: unknown, row: T) => React.ReactNode;
}

interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  title?: string;
  onAdd?: () => void;
  onEdit?: (row: T) => void;
  onDelete?: (row: T) => void;
  onAssign?: (row: T) => void;
  onLeave?: (row: T) => void;
  onAbsence?: (row: T) => void;
  searchable?: boolean;
  pagination?: boolean;
  pageSize?: number;
  onRowClick?: (row: T) => void;
  onSelectionChange?: (items: T[]) => void;
  isLoading?: boolean;
}

const ROWS_PER_PAGE = 15;
const SEARCH_DEBOUNCE_MS = 300;

export function DataTable<T>({
  columns,
  data,
  title,
  onAdd,
  onEdit,
  onDelete,
  onAssign,
  onLeave,
  onAbsence,
  searchable = true,
  pagination = false,
  pageSize = 10,
  onRowClick,
  onSelectionChange,
  isLoading = false,
}: DataTableProps<T>) {
  const { t } = useTranslation();
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
  const [filteredData, setFilteredData] = useState<T[]>([]);
  const [displayedItems, setDisplayedItems] = useState(ROWS_PER_PAGE);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState<{
    key: keyof T | null;
    direction: "asc" | "desc";
  }>({ key: null, direction: "asc" });
  const [isLoadingMore, setIsLoadingMore] = useState(false);
  const [selectedRows, setSelectedRows] = useState<T[]>([]);
  const bottomRef = useRef<HTMLDivElement>(null);
  const searchTimeoutRef = useRef<NodeJS.Timeout>();
  const isRTL = t("dir") === "rtl";

  const getFontFamily = () => {
    switch (t("lang")) {
      case "en":
        return "font-[Roboto]";
      case "he":
        return "font-[Horev CLM Heavy]";
      default:
        return "font-[Cairo]";
    }
  };

  // Debounce search term
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    searchTimeoutRef.current = setTimeout(() => {
      setDebouncedSearchTerm(searchTerm);
    }, SEARCH_DEBOUNCE_MS);

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchTerm]);

  // Memoized filter function
  const filterData = useCallback((data: T[], searchTerm: string) => {
    if (!searchTerm) return data;

    return data.filter((item) =>
      Object.entries(item).some(([key, value]) => {
        if (value === null || value === undefined) return false;
        if (typeof value === "object") return false;
        return String(value).toLowerCase().includes(searchTerm.toLowerCase());
      })
    );
  }, []);

  // Initialize filtered data
  useEffect(() => {
    if (Array.isArray(data)) {
      setFilteredData(data);
      setDisplayedItems(ROWS_PER_PAGE);
    }
  }, [data]);

  // Filter and sort data
  useEffect(() => {
    if (!Array.isArray(data)) {
      console.error("DataTable: data prop is not an array", data);
      setFilteredData([]);
      return;
    }

    let result = [...data];

    // Apply search filter
    if (debouncedSearchTerm) {
      result = filterData(result, debouncedSearchTerm);
    }

    // Apply sorting
    if (sortConfig.key) {
      result = [...result].sort((a, b) => {
        const aValue = a[sortConfig.key];
        const bValue = b[sortConfig.key];

        if (aValue === undefined || bValue === undefined) return 0;
        if (aValue === null || bValue === null) return 0;

        if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
        if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
        return 0;
      });
    }

    setFilteredData(result);
    setDisplayedItems(ROWS_PER_PAGE);
  }, [data, sortConfig, debouncedSearchTerm, filterData]);

  // Setup intersection observer for infinite scroll
  useEffect(() => {
    if (filteredData.length <= displayedItems) return;

    const scrollObserver = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting && displayedItems < filteredData.length) {
          setIsLoadingMore(true);
          setTimeout(() => {
            setDisplayedItems((prev) =>
              Math.min(prev + ROWS_PER_PAGE, filteredData.length)
            );
            setIsLoadingMore(false);
          }, 300);
        }
      },
      { threshold: 0.5 }
    );

    if (bottomRef.current) {
      scrollObserver.observe(bottomRef.current);
    }

    return () => {
      scrollObserver.disconnect();
    };
  }, [displayedItems, filteredData.length]);

  const handleSort = (key: keyof T) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  const getSortIcon = (columnKey: keyof T) => {
    if (!sortConfig || sortConfig.key !== columnKey) return null;
    return sortConfig.direction === "asc" ? "↑" : "↓";
  };

  const renderCellValue = (value: unknown) => {
    if (value === null || value === undefined) return "";
    if (typeof value === "boolean") return value ? "Yes" : "No";
    return String(value);
  };

  const handleRowSelect = (row: T) => {
    setSelectedRows((prev) => {
      const isSelected = prev.some((r) => r === row);
      const newSelection = isSelected
        ? prev.filter((r) => r !== row)
        : [...prev, row];
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  const handleSelectAll = () => {
    setSelectedRows((prev) => {
      const newSelection =
        prev.length === filteredData.length ? [] : [...filteredData];
      onSelectionChange?.(newSelection);
      return newSelection;
    });
  };

  const isRowSelected = (row: T) => selectedRows.includes(row);

  return (
    <div className={cn("space-y-4", isRTL ? "rtl" : "ltr", getFontFamily())}>
      <div
        className={cn(
          "flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6",
          isRTL ? "flex-row-reverse" : "flex-row"
        )}
      >
        {searchable && (
          <div className="relative w-full md:w-64">
            <Search
              className={cn(
                "absolute top-1/2 transform -translate-y-1/2 text-[#1A5F5E] h-4 w-4",
                isRTL ? "right-3" : "left-3"
              )}
            />
            <Input
              placeholder={t("table.search")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className={cn(
                "w-full border-[#1A5F5E]/20 focus:border-[#1A5F5E] transition-colors",
                isRTL ? "pr-10" : "pl-10",
                getFontFamily()
              )}
            />
          </div>
        )}

        {onAdd && (
          <Button
            onClick={onAdd}
            className={cn(
              "bg-[#1A5F5E] hover:bg-[#1A5F5E]/90",
              getFontFamily()
            )}
          >
            <Plus className="mr-2 h-4 w-4" />
            {t("common.add")}
          </Button>
        )}
      </div>

      <div className="relative overflow-x-auto">
        {isLoading && (
          <div
            className={cn(
              "absolute inset-0 bg-white/50 backdrop-blur-sm z-10 flex items-center justify-center",
              getFontFamily()
            )}
          >
            <Loader2 className="h-6 w-6 animate-spin text-[#1A5F5E]" />
          </div>
        )}

          <Table
            className={cn(
              "w-full",
              isRTL ? "text-right" : "text-left",
              getFontFamily()
            )}
          >
            <TableHeader>
              <TableRow className="bg-[#1A5F5E] hover:bg-[#1A5F5E]/90">
                {onSelectionChange && (
                  <TableHead
                    className={cn("w-[50px] text-center", getFontFamily())}
                  >
                    <div className="flex justify-center">
                      <Checkbox
                        checked={
                          selectedRows.length === filteredData.length &&
                          filteredData.length > 0
                        }
                        onCheckedChange={handleSelectAll}
                        className="border-white"
                      />
                    </div>
                  </TableHead>
                )}
                {columns.map((column) => (
                  <TableHead
                    key={String(column.key)}
                    className={cn(
                      "py-4 text-white font-medium text-center",
                      getFontFamily()
                    )}
                  >
                    <div
                      className={cn(
                        "flex items-center justify-center gap-2 cursor-pointer hover:text-white/90 transition-colors",
                        isRTL ? "flex-row-reverse" : "flex-row"
                      )}
                      onClick={() => handleSort(column.key)}
                    >
                      <span>{column.title}</span>
                      <span className="text-white/90">
                        {getSortIcon(column.key)}
                      </span>
                    </div>
                  </TableHead>
                ))}
                {(onEdit || onDelete || onAssign || onLeave || onAbsence) && (
                  <TableHead
                    className={cn("w-[50px] text-center", getFontFamily())}
                  />
                )}
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredData.length > 0 ? (
                filteredData.slice(0, displayedItems).map((row, rowIndex) => (
                  <TableRow
                    key={rowIndex}
                    className={cn(
                      "hover:bg-[#1A5F5E]/5",
                      rowIndex % 2 === 0 ? "bg-white" : "bg-gray-50",
                      isRowSelected(row) ? "bg-[#1A5F5E]/10" : "",
                      getFontFamily()
                    )}
                    onClick={() => onRowClick?.(row)}
                  >
                    {onSelectionChange && (
                      <TableCell className={cn("w-[50px]", getFontFamily())}>
                        <div className="flex justify-center">
                          <Checkbox
                            checked={isRowSelected(row)}
                            onCheckedChange={() => handleRowSelect(row)}
                            className="border-[#1A5F5E]"
                          />
                        </div>
                      </TableCell>
                    )}
                    {columns.map((column) => (
                      <TableCell
                        key={`${rowIndex}-${String(column.key)}`}
                        className={cn(
                          "py-3 text-gray-700 text-center",
                          getFontFamily()
                        )}
                      >
                        <div className="flex justify-center items-center">
                          {column.render
                            ? column.render(row[column.key], row)
                            : renderCellValue(row[column.key])}
                        </div>
                      </TableCell>
                    ))}

                    {(onEdit ||
                      onDelete ||
                      onAssign ||
                      onLeave ||
                      onAbsence) && (
                      <TableCell className={cn("w-[50px]", getFontFamily())}>
                        <div className="flex justify-center">
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button
                                variant="ghost"
                                className={cn("h-8 w-8 p-0", getFontFamily())}
                              >
                                <MoreVertical className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              {onEdit && (
                                <DropdownMenuItem
                                  onClick={() => onEdit(row)}
                                  className={cn(
                                    "cursor-pointer",
                                    getFontFamily()
                                  )}
                                >
                                  <Edit className="mr-2 h-4 w-4" />
                                  {t("common.edit")}
                                </DropdownMenuItem>
                              )}
                              {onDelete && (
                                <DropdownMenuItem
                                  onClick={() => onDelete(row)}
                                  className={cn(
                                    "cursor-pointer text-red-600 focus:text-red-600",
                                    getFontFamily()
                                  )}
                                >
                                  <Trash2 className="mr-2 h-4 w-4" />
                                  {t("common.delete")}
                                </DropdownMenuItem>
                              )}
                              {onAssign && (
                                <DropdownMenuItem
                                  onClick={() => onAssign(row)}
                                  className={cn(
                                    "cursor-pointer",
                                    getFontFamily()
                                  )}
                                >
                                  <Check className="mr-2 h-4 w-4" />
                                  {t("common.assign")}
                                </DropdownMenuItem>
                              )}
                              {onLeave && (
                                <DropdownMenuItem
                                  onClick={() => onLeave(row)}
                                  className={cn(
                                    "cursor-pointer",
                                    getFontFamily()
                                  )}
                                >
                                  <LogOut className="mr-2 h-4 w-4" />
                                  {t("common.leave")}
                                </DropdownMenuItem>
                              )}
                              {onAbsence && (
                                <DropdownMenuItem
                                  onClick={() => onAbsence(row)}
                                  className={cn(
                                    "cursor-pointer",
                                    getFontFamily()
                                  )}
                                >
                                  <CalendarX className="mr-2 h-4 w-4" />
                                  {t("common.absence")}
                                </DropdownMenuItem>
                              )}
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </TableCell>
                    )}
                  </TableRow>
                ))
              ) : (
                <TableRow>
                  <TableCell
                    colSpan={
                      columns.length +
                      (onEdit || onDelete || onAssign || onLeave ? 1 : 0) +
                      (onSelectionChange ? 1 : 0)
                    }
                    className={cn(
                      "text-center py-8 text-gray-500",
                      getFontFamily()
                    )}
                  >
                    {data.length === 0
                      ? t("table.noData")
                      : t("table.noResults")}
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>

        {filteredData.length > displayedItems && (
          <div
            ref={bottomRef}
            className={cn(
              "py-4 text-center text-sm",
              "flex items-center justify-center gap-2",
              "transition-all duration-300",
              isLoadingMore ? "opacity-100 scale-100" : "opacity-50 scale-95",
              getFontFamily()
            )}
          >
            <Loader2 className="h-4 w-4 animate-spin text-[#1A5F5E]" />
            <span className="text-[#1A5F5E]">
              {t("table.loadingMore")} ({displayedItems} {t("table.of")}{" "}
              {filteredData.length} {t("table.results")})
            </span>
          </div>
        )}
      </div>
    </div>
  );
}

export interface Column<T> {
  key: keyof T;
  title: string;
  render?: (value: unknown) => React.ReactNode;
}

export interface DataTableProps<T> {
  columns: Column<T>[];
  data: T[];
  searchPlaceholder?: string;
  pageSize?: number;
  onSelectionChange?: (items: T[]) => void;
  onEdit?: (item: T) => void;
  onDelete?: (item: T) => void;
} 
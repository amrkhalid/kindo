export interface Column<T> {
  key: string;
  title: string;
  render: (value: unknown, item?: T) => React.ReactNode;
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

import { Checkbox } from "@/components/ui/checkbox";
import { ScrollArea } from "@/components/ui/scroll-area";

interface CheckboxGroupProps<T> {
  items: T[];
  selectedItems: T[];
  onChange: (selectedItems: T[]) => void;
  renderLabel: (item: T) => string;
  maxHeight?: string;
}

export function CheckboxGroup<T extends { id: string }>({
  items,
  selectedItems,
  onChange,
  renderLabel,
  maxHeight = "200px"
}: CheckboxGroupProps<T>) {
  const handleItemToggle = (item: T) => {
    const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);
    
    if (isSelected) {
      onChange(selectedItems.filter((selectedItem) => selectedItem.id !== item.id));
    } else {
      onChange([...selectedItems, item]);
    }
  };

  return (
    <ScrollArea className={`border rounded-md p-2`} style={{ maxHeight }}>
      <div className="space-y-2">
        {items.map((item) => {
          const isSelected = selectedItems.some((selectedItem) => selectedItem.id === item.id);
          
          return (
            <div key={item.id} className="flex items-center space-x-2">
              <Checkbox 
                id={`checkbox-${item.id}`} 
                checked={isSelected}
                onCheckedChange={() => handleItemToggle(item)}
              />
              <label
                htmlFor={`checkbox-${item.id}`}
                className="text-sm leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
              >
                {renderLabel(item)}
              </label>
            </div>
          );
        })}
        {items.length === 0 && (
          <div className="text-sm text-muted-foreground py-2 text-center">
            No items available
          </div>
        )}
      </div>
    </ScrollArea>
  );
}

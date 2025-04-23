import React from 'react';
import { cn } from '@/lib/utils';
import { Check, ChevronsUpDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface Option {
  value: string;
  label: string;
}

interface MultiSelectProps {
  options?: Option[];
  value?: string[];
  onChange: (value: string[]) => void;
  placeholder?: string;
  className?: string;
}

export function MultiSelect({
  options: rawOptions,
  value: rawValue,
  onChange,
  placeholder = 'Select items...',
  className,
}: MultiSelectProps) {
  const options = rawOptions ?? [];
  const value = rawValue ?? [];
  const [open, setOpen] = React.useState(false);

  const selectedOptions = React.useMemo(() => 
    options.filter((option) => value.includes(option.value)),
    [options, value]
  );

  const handleSelect = (optionValue: string) => {
    if (!optionValue) return;
    onChange([optionValue]);
    setOpen(false);
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className={cn(
            "w-full justify-between bg-white hover:bg-gray-50",
            "border-gray-200 text-gray-700",
            "min-h-[2.5rem] h-auto px-3",
            className
          )}
        >
          <span className="truncate text-sm">
            {selectedOptions.length > 0 ? selectedOptions[0].label : placeholder}
          </span>
          <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent 
        className="w-[--radix-popover-trigger-width] p-0"
        align="start"
      >
        <Command className="w-full">
          <CommandInput 
            placeholder={placeholder}
            className="h-9 text-sm"
          />
          <CommandEmpty className="py-3 text-center text-sm text-gray-500">
            No items found.
          </CommandEmpty>
          <CommandList className="max-h-[200px] overflow-y-auto">
            {options.length > 0 && (
              <CommandGroup className="p-1">
                {options.map((option) => (
                  <CommandItem
                    key={option.value}
                    onSelect={() => handleSelect(option.value)}
                    className={cn(
                      "flex items-center gap-2 px-2 py-1.5 text-sm",
                      "cursor-pointer rounded-sm",
                      "text-gray-700 hover:bg-gray-100",
                      "aria-selected:bg-gray-100"
                    )}
                  >
                    <Check
                      className={cn(
                        "h-4 w-4 shrink-0",
                        "text-gray-600 transition-opacity",
                        value.includes(option.value) ? "opacity-100" : "opacity-0"
                      )}
                    />
                    <span className="truncate">{option.label}</span>
                  </CommandItem>
                ))}
              </CommandGroup>
            )}
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
} 
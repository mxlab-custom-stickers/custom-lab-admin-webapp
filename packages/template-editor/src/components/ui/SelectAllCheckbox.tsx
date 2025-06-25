import { Checkbox } from '@/components/ui/checkbox.tsx';
import { cn } from '@clab/utils';
import React from 'react';

type SelectAllCheckboxProps<T> = {
  className?: string;
  children?: React.ReactNode;
  allItems: T[];
  selectedItems: T[];
  onChange: (selected: T[]) => void;
};

export function SelectAllCheckbox<T>({
  className,
  children,
  allItems,
  selectedItems,
  onChange,
}: SelectAllCheckboxProps<T>) {
  const allSelected = allItems.length > 0 && selectedItems.length === allItems.length;

  const handleToggle = () => {
    if (allSelected) {
      onChange([]);
    } else {
      onChange(allItems);
    }
  };

  return (
    <label className="flex select-none items-center gap-2 text-sm">
      <Checkbox className={cn(className)} checked={allSelected} onCheckedChange={handleToggle} />
      {children || 'Tout sélectionner'}
    </label>
  );
}

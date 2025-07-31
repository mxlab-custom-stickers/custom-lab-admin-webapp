import { SearchInput } from '@/components/ui/SearchInput.tsx';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group.tsx';
import { useControlledState } from '@/hooks/use-controlled-state.ts';
import type { ImageFilters } from '@/hooks/use-image-filters';
import { cn } from '@clab/utils';
import React from 'react';

const LOGO_LETTERS_FILTERS = '09abcdefghijklmnopqrstuvwxyz'.match(/.{1,2}/g) ?? [];

type ImagePickerFiltersProps = React.ComponentPropsWithoutRef<'div'> & {
  value?: ImageFilters;
  onValueChange?: (value: ImageFilters) => void;
};

export default function ImagePickerFilters({
  className,
  value: valueProp,
  onValueChange,
}: ImagePickerFiltersProps) {
  const [value, setValue] = useControlledState<ImageFilters>(valueProp, onValueChange, {
    search: '',
    startsWith: '',
  });

  return (
    <div className={cn('flex w-full flex-col items-center gap-4 border-b', className)}>
      {/* Search */}
      <SearchInput
        wrapperClassName="sm:w-md w-full"
        value={value.search}
        onValueChange={(search) => setValue({ ...value, search })}
      />
      {/* Starts with */}
      <ToggleGroup
        className="w-full flex-wrap justify-center gap-3 !shadow-none"
        value={value.startsWith}
        onValueChange={(startsWith) => setValue({ ...value, startsWith })}
        variant="outline"
        type="single"
      >
        {LOGO_LETTERS_FILTERS.map((filter) => (
          <ToggleGroupItem
            key={filter}
            className={cn(
              'h-10 w-14 flex-[unset] text-base uppercase text-white hover:text-white',
              '!rounded !border border-[#454545] bg-[#323232] hover:border-[#454545] hover:bg-[#454545]',
              'data-[state=on]:border-primary data-[state=on]:bg-primary data-[state=on]:text-white'
            )}
            value={filter}
          >
            {filter[0]}-{filter[1]}
          </ToggleGroupItem>
        ))}
      </ToggleGroup>
    </div>
  );
}

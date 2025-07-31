import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { useControlledState } from '@/hooks/use-controlled-state.ts';
import { cn } from '@clab/utils';
import { Search, X } from 'lucide-react';
import { useRef } from 'react';

type SearchInputProps = {
  className?: string;
  wrapperClassName?: string;
  value?: string;
  onValueChange?: (value: string) => void;
};

export function SearchInput({
  className,
  wrapperClassName,
  value,
  onValueChange,
}: SearchInputProps) {
  const [query, setQuery] = useControlledState(value, onValueChange, '');

  const inputRef = useRef<HTMLInputElement>(null);

  const clearInput = () => {
    setQuery('');
    inputRef.current?.focus();
  };

  return (
    <div className={cn('relative h-10 max-w-md', wrapperClassName)}>
      <Search
        className="text-muted-foreground pointer-events-none absolute left-3 top-1/2 -translate-y-1/2"
        size={16}
      />
      <Input
        className={cn('no-search-clear h-full w-full pl-10', className)}
        type="search"
        ref={inputRef}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && inputRef.current?.blur()}
        placeholder="Recherche..."
      />
      {query && (
        <Button
          variant="ghost"
          onClick={clearInput}
          className="absolute right-2 top-1/2 h-6 w-6 -translate-y-1/2 rounded-full p-0"
          aria-label="Clear search"
        >
          <X />
        </Button>
      )}
    </div>
  );
}

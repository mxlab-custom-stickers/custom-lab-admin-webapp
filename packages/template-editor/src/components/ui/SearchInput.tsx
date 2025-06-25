import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { cn } from '@clab/utils';
import { Search, X } from 'lucide-react';
import React, { useEffect, useRef, useState } from 'react';

type SearchInputProps = React.ComponentPropsWithoutRef<'input'> & {
  wrapperClassName?: string;
};

export function SearchInput({ className, wrapperClassName, ...props }: SearchInputProps) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    setQuery(props.value ? String(props.value) : '');
  }, [props.value]);

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
        {...props}
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

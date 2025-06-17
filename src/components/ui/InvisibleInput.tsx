import { Input } from '@/components/ui/input.tsx';
import { useControlledState } from '@/hooks/use-controlled-state.ts';
import { cn } from '@/lib/utils.ts';
import React, { useEffect, useRef } from 'react';

type InvisibleInputProps = {
  className?: string;
  id?: string;
  name?: string;
  defaultValue?: string;
  value?: string;
  onValueChange?: (value: string) => void;
  onValueSubmit?: (value: string) => void;
  onCancel?: () => void;
};

/**
 * A styled input component that looks minimal/invisible and supports
 * both controlled and uncontrolled usage. It auto-selects its content
 * on focus and calls `onValueSubmit` on form submit or blur. Pressing
 * Escape triggers `onCancel`, if provided.
 */
export default function InvisibleInput({
  className,
  id,
  name,
  defaultValue = '',
  value: valueProp,
  onValueChange,
  onValueSubmit,
  onCancel,
}: InvisibleInputProps) {
  const [value, setValue] = useControlledState(
    valueProp,
    onValueChange,
    defaultValue || valueProp || ''
  );

  useEffect(() => {
    setValue(defaultValue || '');
  }, [defaultValue]);

  const inputRef = useRef<HTMLInputElement>(null);

  function handleKeyDown(e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Escape') {
      e.preventDefault();
      onCancel?.();
      inputRef.current?.blur();
    }
  }

  return (
    <form
      action=""
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();
        inputRef.current?.blur();
        onValueSubmit?.(value);
      }}
    >
      <Input
        ref={inputRef}
        className={cn(
          'border-none bg-transparent underline-offset-2 shadow-none hover:underline focus:outline-none',
          className
        )}
        id={id}
        name={name}
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={handleKeyDown}
        onFocus={() => inputRef.current?.select()}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
      />
    </form>
  );
}

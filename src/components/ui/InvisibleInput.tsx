import { Input } from '@/components/ui/input.tsx';
import { cn } from '@/lib/utils.ts';
import React, { useEffect, useRef, useState } from 'react';

type InvisibleInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'onSubmit'
> & {
  onSubmit?: (value: string) => void;
};

export default function InvisibleInput({
  className,
  value: valueProp,
  onChange,
  onSubmit,
  ...props
}: InvisibleInputProps) {
  const [value, setValue] = useState<string>(valueProp?.toString() ?? '');

  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (valueProp !== undefined) {
      setValue(valueProp.toString());
    }
  }, [valueProp]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newValue = e.target.value;
    setValue(newValue);
    onChange?.(e);
  }

  return (
    <form
      action=""
      noValidate
      onSubmit={(e) => {
        e.preventDefault();
        e.stopPropagation();

        if (inputRef.current) {
          inputRef.current.blur();
        }

        onSubmit?.(value);
      }}
    >
      <Input
        ref={inputRef}
        className={cn(
          'underline-offset-2 not-focus:border-none not-focus:bg-transparent not-focus:shadow-none hover:not-focus:underline',
          className
        )}
        value={value}
        onChange={handleChange}
        autoComplete="off"
        autoCorrect="off"
        autoCapitalize="off"
        spellCheck={false}
        maxLength={512}
        {...props}
      />
    </form>
  );
}

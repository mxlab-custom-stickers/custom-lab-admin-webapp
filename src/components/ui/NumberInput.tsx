import { Button } from '@/components/ui/button.tsx';
import { Input } from '@/components/ui/input.tsx';
import { cn } from '@/lib/utils.ts';
import React, { useEffect, useState } from 'react';

type NumberInputProps = Omit<
  React.ComponentPropsWithoutRef<'input'>,
  'onChange' | 'value'
> & {
  value?: number;
  onValueChange?: (value: number) => void;
  step?: number;
  min?: number;
  max?: number;
};

export default function NumberInput({
  className,
  value: valueProp,
  onValueChange,
  step = 1,
  min = -Infinity,
  max = Infinity,
  ...props
}: NumberInputProps) {
  const [value, setValue] = useState<string>(valueProp?.toString() || '');

  useEffect(() => {
    if (valueProp !== undefined && valueProp !== null) {
      setValue(valueProp.toString());
    }
  }, [valueProp]);

  const emitChange = (newValue: number) => {
    const clamped = Math.min(Math.max(newValue, min), max);
    setValue(clamped.toString());
    onValueChange?.(clamped);
  };

  const handleDecrement = () => {
    const current = parseFloat(value) || 0;
    emitChange(current - step);
  };

  const handleIncrement = () => {
    const current = parseFloat(value) || 0;
    emitChange(current + step);
  };

  return (
    <div className="flex items-center justify-center rounded-md border">
      <Button
        className="rounded-l-md rounded-r-none text-base"
        variant="ghost"
        size="icon"
        type="button"
        onClick={handleDecrement}
      >
        -
      </Button>

      <Input
        className={cn(
          'no-spinner w-10 rounded-none border-none p-0 text-center',
          className
        )}
        value={value}
        onChange={(e) => {
          const raw = e.target.value;
          setValue(raw);
          const parsed = parseFloat(raw);
          if (!isNaN(parsed)) {
            onValueChange?.(parsed);
          }
        }}
        type="number"
        {...props}
      />

      <Button
        className="rounded-l-none rounded-r-md text-base"
        variant="ghost"
        size="icon"
        type="button"
        onClick={handleIncrement}
      >
        +
      </Button>
    </div>
  );
}

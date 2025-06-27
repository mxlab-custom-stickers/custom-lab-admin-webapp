import { cn, sanitizeNumericInput } from '@clab/utils';
import React, { useEffect, useState } from 'react';
import { Input } from './input';

type NumericInputProps = {
  className?: string;
  id: string;
  value: number;
  onChange: (value: number) => void;
  min?: number;
  max?: number;
  step?: number;
};

/**
 * A controlled numeric input component that:
 * - Prevents invalid characters like '.', ',' or 'e'
 * - Allows temporary states like `''` or `'-'` for smooth user typing
 * - Rounds incoming value props
 * - Sanitizes and clamps the value on change/blur
 * - Displays `0` if cleared
 */
export function NumericInput({
  className,
  id,
  value,
  onChange,
  min,
  max,
  step = 1,
}: NumericInputProps) {
  const [rawValue, setRawValue] = useState(String(value));

  useEffect(() => {
    setRawValue(String(Math.round(value)));
  }, [value]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const input = e.target.value;
    setRawValue(input);

    // Allow empty or just '-' temporarily
    if (input === '' || input === '-') return;

    const num = sanitizeNumericInput(input, { min, max });
    if (num !== undefined) {
      onChange(num);
    }
  }

  function handleBlur() {
    const num = sanitizeNumericInput(rawValue, { min, max });
    onChange(num ?? 0);
  }

  return (
    <Input
      className={cn('pr-1', className)}
      id={id}
      type="number"
      inputMode="numeric"
      pattern="-?[0-9]*"
      step={step}
      value={rawValue}
      onChange={handleChange}
      onBlur={handleBlur}
      onKeyDown={(e) => {
        if (['.', ',', 'e'].includes(e.key)) {
          e.preventDefault();
        }
      }}
    />
  );
}

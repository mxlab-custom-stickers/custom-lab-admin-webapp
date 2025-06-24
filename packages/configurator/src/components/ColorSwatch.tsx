import type { Color } from '@clab/types';
import { cn, isColorCloserToBlackOrWhite } from '@clab/utils';
import { Check } from 'lucide-react';

type ColorChipProps = {
  className?: string;
  color: Color;
  selectable?: boolean;
  selected?: boolean;
  onClick?: (color: Color) => void;
};

/**
 * Tooltip wrapper.
 */
export default function ColorSwatch({
  className,
  color,
  selectable = false,
  selected = false,
  onClick,
}: ColorChipProps) {
  return (
    <div
      className={cn(
        'relative aspect-square w-8 rounded',
        { 'cursor-pointer ring-offset-1 hover:ring-2': selectable },
        className
      )}
      style={{ backgroundColor: color.value, color: color.value }}
      onClick={() => onClick?.(color)}
    >
      {selected ? (
        <Check
          className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: isColorCloserToBlackOrWhite(color.value) }}
        />
      ) : null}
    </div>
  );
}

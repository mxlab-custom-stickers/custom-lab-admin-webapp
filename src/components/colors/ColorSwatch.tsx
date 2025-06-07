import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip.tsx';
import { isColorCloserToBlackOrWhite } from '@/lib/colors.ts';
import { cn } from '@/lib/utils.ts';
import { Color } from '@/models/color.ts';
import { Check } from 'lucide-react';
import React from 'react';

type ColorChipProps = Omit<React.ComponentPropsWithoutRef<'div'>, 'color'> & {
  color: Color;

  selected?: boolean;
  selectable?: boolean;
  showTooltip?: boolean;
};

/**
 * Tooltip wrapper.
 */
export default function ColorSwatch({
  className,
  color,
  showTooltip = false,
  ...props
}: ColorChipProps) {
  return showTooltip ? (
    <TooltipProvider>
      <Tooltip>
        <TooltipTrigger asChild>
          <Component className={className} color={color} {...props} />
        </TooltipTrigger>
        <TooltipContent>{color.name}</TooltipContent>
      </Tooltip>
    </TooltipProvider>
  ) : (
    <Component className={className} color={color} {...props} />
  );
}

type Props = Omit<ColorChipProps, 'showTooltip'>;

function Component({
  className,
  color,
  selected,
  selectable,
  ...props
}: Props) {
  return (
    <div
      className={cn(
        'relative aspect-square w-8 rounded',
        { 'cursor-pointer ring-offset-1 hover:ring-2': selectable },
        className
      )}
      style={{ backgroundColor: color.value, color: color.value }}
      {...props}
    >
      {selected ? (
        <Check
          className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2"
          style={{ color: isColorCloserToBlackOrWhite(color.value) }}
        />
      ) : null}
    </div>
  );
}

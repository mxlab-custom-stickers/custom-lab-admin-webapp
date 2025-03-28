import { cn } from '@/lib/utils.ts';
import { ColorElement } from '@/models/template.ts';
import * as React from 'react';

type ColorElementProps = React.ComponentPropsWithoutRef<'div'> & {
  colorElement: ColorElement;
};

export default function ColorElementComponent({
  className,
  colorElement,
  ...props
}: ColorElementProps) {
  return (
    <div className={cn('flex items-center', className)} {...props}>
      <div className="flex-1">{colorElement.name}</div>
      <div
        className="h-9 w-9 rounded"
        style={{ backgroundColor: colorElement.color.value }}
      />
    </div>
  );
}

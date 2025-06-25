import { Card } from '@/components/ui/card.tsx';
import { cn } from '@clab/utils';
import React from 'react';

export default function OptionsCard({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  return (
    <Card
      className={cn(
        'gap-2 border-none py-4 *:px-4',
        '[&>div[data-slot=card-header]]:gap-0.5',
        '[&>div[data-slot=card-content]]:flex [&>div[data-slot=card-content]]:flex-col [&>div[data-slot=card-content]]:gap-2',
        className
      )}
      {...props}
    >
      {children}
    </Card>
  );
}

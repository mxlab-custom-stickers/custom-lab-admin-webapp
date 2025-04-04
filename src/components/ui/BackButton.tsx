import { Button } from '@/components/ui/button.tsx';
import { cn } from '@/lib/utils.ts';
import { ChevronLeft } from 'lucide-react';
import React from 'react';

type BackButtonProps = React.ComponentPropsWithoutRef<'button'>;

export default function BackButton({ className, ...props }: BackButtonProps) {
  return (
    <Button className={cn(className)} variant="outline" size="icon" {...props}>
      <ChevronLeft />
    </Button>
  );
}

import { Button, buttonVariants } from '@/components/ui/button.tsx';
import { cn } from '@clab/utils';
import { type VariantProps } from 'class-variance-authority';
import { LogOut } from 'lucide-react';
import React from 'react';

type QuitButtonProps = React.ComponentProps<'button'> & VariantProps<typeof buttonVariants>;

export default function QuitButton({
  className,
  children,
  variant = 'outline',
  size = 'lg',
  ...props
}: QuitButtonProps) {
  return (
    <Button className={cn(className)} variant={variant} size={size} {...props}>
      <LogOut className="rotate-180" />
      {children ? children : 'Quitter'}
    </Button>
  );
}

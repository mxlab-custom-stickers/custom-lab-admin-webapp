import { Button } from '@/components/ui/button.tsx';
import { Loader2 } from 'lucide-react';
import React from 'react';

type SubmitProps = Omit<React.ComponentPropsWithoutRef<'button'>, 'type'> & {
  loading?: boolean;
};

export default function Submit({
  className,
  children,
  loading,
  ...props
}: SubmitProps) {
  return (
    <Button {...props} type="submit" disabled={loading || props.disabled}>
      {loading ? <Loader2 className="animate-spin" /> : null}
      {children}
    </Button>
  );
}

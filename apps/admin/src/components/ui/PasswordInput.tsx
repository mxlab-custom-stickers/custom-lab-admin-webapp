import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Eye, EyeOff } from 'lucide-react';
import React, { useState } from 'react';

export function PasswordInput({ value, onChange, ...props }: React.ComponentProps<typeof Input>) {
  const [show, setShow] = useState(false);

  return (
    <div className="relative">
      <Input
        type={show ? 'text' : 'password'}
        value={value}
        onChange={onChange}
        {...props}
        className="!pr-10"
      />
      <Button
        type="button"
        variant="ghost"
        size="icon"
        onClick={() => setShow((prev) => !prev)}
        className="text-muted-foreground absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-transparent"
        tabIndex={-1}
      >
        {show ? <EyeOff className="!h-4.5 !w-4.5" /> : <Eye className="!h-4.5 !w-4.5" />}
      </Button>
    </div>
  );
}

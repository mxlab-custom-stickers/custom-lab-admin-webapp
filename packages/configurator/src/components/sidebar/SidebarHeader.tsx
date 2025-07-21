import MXlabLogo from '@/assets/mxlab-logo.png';
import { cn } from '@clab/utils';
import React from 'react';

type SidebarHeaderProps = React.ComponentPropsWithoutRef<'div'>;

export default function SidebarHeader({ className, ...props }: SidebarHeaderProps) {
  return (
    <div className={cn('flex items-center justify-center', className)} {...props}>
      <img className="w-60" src={MXlabLogo} alt="MXlab logo" />
    </div>
  );
}

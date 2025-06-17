import ToolbarTextEditor from '@/components/configurator/Toolbar/ToolbarTextEditor.tsx';
import { useConfiguratorContext } from '@/contexts/configurator/configurator-context.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

export default function Toolbar({
  className,
  children,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { currentText } = useConfiguratorContext();

  return children || currentText ? (
    <div
      className={cn(
        'absolute top-2 left-1/2 z-50 flex h-11 min-w-xs -translate-x-1/2 items-center justify-center gap-2 rounded-md bg-white p-1 shadow-lg',
        className
      )}
      {...props}
    >
      {children ? children : currentText ? <ToolbarTextEditor /> : null}
    </div>
  ) : null;

  // return (
  //   <AnimatePresence>
  //     {currentText ? (
  //       <motion.div
  //         initial={{ opacity: 0, top: -32 }}
  //         animate={{ opacity: 1, top: 8 }}
  //         exit={{ opacity: 0, top: -32 }}
  //         className={cn(
  //           'absolute left-1/2 z-50 flex -translate-x-1/2 items-center justify-center gap-2 rounded-md bg-white p-1 shadow-lg',
  //           className
  //         )}
  //         {...props}
  //       >
  //         {children}
  //       </motion.div>
  //     ) : null}
  //   </AnimatePresence>
  // );
}

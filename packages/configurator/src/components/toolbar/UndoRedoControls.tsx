import { Button } from '@/components/ui/button.tsx';
import { useConfigurator } from '@/contexts/configurator/configurator-contexts.tsx';
import { applyConfigurationToCanvas } from '@/utils/canvas';
import { cn } from '@clab/utils';
import { Redo, Undo } from 'lucide-react';
import React from 'react';

export default function UndoRedoControls({
  className,
  ...props
}: React.ComponentPropsWithoutRef<'div'>) {
  const { canUndo, canRedo, undo, redo } = useConfigurator();

  return (
    <div className={cn('flex items-center justify-center gap-1', className)} {...props}>
      {/* Undo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => undo(applyConfigurationToCanvas)}
        disabled={!canUndo}
      >
        <Undo className="!h-4.5 !w-4.5" />
      </Button>
      {/* Redo */}
      <Button
        variant="ghost"
        size="icon"
        onClick={() => redo(applyConfigurationToCanvas)}
        disabled={!canRedo}
      >
        <Redo className="!h-4.5 !w-4.5" />
      </Button>
    </div>
  );
}

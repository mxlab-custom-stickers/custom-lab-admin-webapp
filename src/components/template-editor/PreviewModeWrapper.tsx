import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

type PreviewModeWrapperProps = React.ComponentPropsWithoutRef<'div'>;

export default function PreviewModeWrapper({
  className,
  children,
}: PreviewModeWrapperProps) {
  const {
    state: { previewMode },
  } = useTemplateEditorContext();

  return (
    <div
      className={cn(
        'grid h-full bg-gray-300 p-1.5',

        className
      )}
    >
      <div
        className={cn(
          'h-full overflow-hidden rounded-lg bg-white transition-[max-width] duration-200',
          { 'max-w-full': previewMode === 'fullscreen' },
          { 'max-w-[calc(100svw-16rem-0.75rem)]': previewMode === 'desktop' },
          {
            'max-h-[800px] max-w-sm translate-x-[calc(50svw-50%)]':
              previewMode === 'mobile',
          }
        )}
      >
        {children}
      </div>
    </div>
  );
}

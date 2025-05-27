import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils';
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
        'h-full max-h-[calc(100svh-3.5rem-0.375rem-0.375rem)] w-full duration-200',
        {
          'max-w-full':
            previewMode === 'desktop' || previewMode === 'fullscreen',
          'max-h-[800px] max-w-sm': previewMode === 'mobile',
        },
        className
      )}
    >
      {children}
    </div>
  );
}

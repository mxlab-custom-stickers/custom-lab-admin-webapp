import { useTemplateEditorContext } from '@/contexts/template-editor-context.ts';
import { cn } from '@/lib/utils';
import React from 'react';

type PreviewModeWrapperProps = React.ComponentPropsWithoutRef<'div'>;

export default function PreviewModeWrapper({
  className,
  children,
}: PreviewModeWrapperProps) {
  const { previewMode } = useTemplateEditorContext();

  return (
    <div
      className={cn(
        'h-full w-full duration-200',
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

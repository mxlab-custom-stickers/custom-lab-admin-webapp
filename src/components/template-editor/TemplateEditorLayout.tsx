import PreviewModeWrapper from '@/components/template-editor/PreviewModeWrapper.tsx';
import TemplateEditorHeader from '@/components/template-editor/TemplateEditorHeader.tsx';
import TemplateEditorSidebar from '@/components/template-editor/TemplateEditorSidebar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import { useTemplateEditorContext } from '@/contexts/template-editor/template-editor-context.tsx';
import { cn } from '@/lib/utils.ts';
import React from 'react';

export default function TemplateEditorLayout({
  className,
  children,
  ...props
}: React.ComponentProps<'div'>) {
  const {
    state: { previewMode },
  } = useTemplateEditorContext();

  return (
    <SidebarProvider
      className={cn('flex flex-col', className)}
      open={previewMode !== 'fullscreen'}
      {...props}
    >
      <TemplateEditorHeader />

      <SidebarInset className="h-[calc(100svh-3.5rem)]">
        <PreviewModeWrapper>{children}</PreviewModeWrapper>
      </SidebarInset>

      <TemplateEditorSidebar />
    </SidebarProvider>
  );
}

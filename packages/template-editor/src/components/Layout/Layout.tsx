import Header from '@/components/Header/Header.tsx';
import PreviewModeWrapper from '@/components/Layout/PreviewModeWrapper.tsx';
import Sidebar from '@/components/Sidebar/Sidebar.tsx';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar.tsx';
import React from 'react';

export default function Layout({ children }: React.PropsWithChildren) {
  return (
    <SidebarProvider className="flex flex-col">
      <Header />

      <SidebarInset className="h-[calc(100svh-3.5rem)]">
        <PreviewModeWrapper>{children}</PreviewModeWrapper>
      </SidebarInset>

      <Sidebar />
    </SidebarProvider>
  );
}

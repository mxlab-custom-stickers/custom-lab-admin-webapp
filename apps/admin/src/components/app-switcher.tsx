'use client';

import { ChevronsUpDown, Plus } from 'lucide-react';

import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import {
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  useSidebar,
} from '@/components/ui/sidebar';
import { useAppContext } from '@/contexts/app-context.tsx';
import { getInitials } from '@/lib/utils.ts';
import { type App, roleLabels } from '@clab/types';
import { useMemo } from 'react';

export function AppSwitcher() {
  return null;

  const { user, currentApp, setCurrentApp, apps } = useAppContext();

  const { isMobile } = useSidebar();

  const role = useMemo(
    () => currentApp!.memberships!.find((m) => m.userId === user.uid)!.role,
    [user, currentApp]
  );

  return (
    <SidebarMenu>
      <SidebarMenuItem>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <SidebarMenuButton
              size="lg"
              className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground"
            >
              <div className="bg-sidebar-primary text-sidebar-primary-foreground flex aspect-square size-8 items-center justify-center rounded-sm">
                <AppIcon app={currentApp} />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">{currentApp.name}</span>
                <span className="truncate text-xs">{roleLabels[role]}</span>
              </div>
              <ChevronsUpDown className="ml-auto" />
            </SidebarMenuButton>
          </DropdownMenuTrigger>

          <DropdownMenuContent
            className="w-[--radix-dropdown-menu-trigger-width] min-w-56 rounded-lg"
            align="start"
            side={isMobile ? 'bottom' : 'right'}
            sideOffset={4}
          >
            <DropdownMenuLabel className="text-muted-foreground text-xs">Apps</DropdownMenuLabel>

            {apps.map((app) => (
              <DropdownMenuItem
                key={app.id}
                className="gap-2 p-2"
                onClick={() => setCurrentApp(app)}
              >
                <div className="flex size-6 items-center justify-center overflow-hidden rounded-sm border">
                  <AppIcon app={app} />
                </div>
                {app.name}
              </DropdownMenuItem>
            ))}

            <DropdownMenuSeparator />

            <DropdownMenuItem className="gap-2 p-2">
              <div className="bg-background flex size-6 items-center justify-center rounded-md border">
                <Plus className="size-4" />
              </div>
              <div className="text-muted-foreground font-medium">Nouvelle app</div>
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </SidebarMenuItem>
    </SidebarMenu>
  );
}

function AppIcon({ app }: { app: App }) {
  return app.icon ? (
    <img className="rounded-sm" src={app.icon} alt={app.name} />
  ) : (
    getInitials(app.name)
  );
}

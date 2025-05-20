import { Blocks, Palette } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

import nelson from '@/assets/nelson.jpg';
import { AppSwitcher } from '@/components/app-switcher.tsx';

// This is sample data.
const data = {
  navMain: [
    { title: 'Templates', icon: Blocks, url: '/templates' },
    { title: 'Couleurs', icon: Palette, url: '/colors' },
  ],
  user: { name: 'Nelson', email: 'nelson@mxlab.fr', avatar: nelson },
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <AppSwitcher />
      </SidebarHeader>

      <SidebarContent>
        <NavMain items={data.navMain} />
      </SidebarContent>

      <SidebarFooter>
        <NavUser user={data.user} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}

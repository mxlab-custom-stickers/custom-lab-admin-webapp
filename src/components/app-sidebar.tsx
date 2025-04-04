import { Blocks, Palette } from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarRail,
} from '@/components/ui/sidebar';
import { Link } from '@tanstack/react-router';

import mxlabLogo from '@/assets/mxlab.png';
import nelson from '@/assets/nelson.jpg';

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
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link to="/templates">
                <img src={mxlabLogo} className="h-5 w-5" />
                <span className="text-base font-semibold">MXlab</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
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

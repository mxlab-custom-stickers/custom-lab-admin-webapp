import {
  AudioWaveform,
  Blocks,
  Command,
  GalleryVerticalEnd,
  Settings2,
} from 'lucide-react';
import * as React from 'react';

import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import { TeamSwitcher } from '@/components/team-switcher';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from '@/components/ui/sidebar';

// This is sample data.
const data = {
  user: {
    name: 'Nelson',
    email: 'nelson@mxlab.fr',
    avatar: '/avatars/shadcn.jpg',
  },
  teams: [
    {
      name: 'MXlab',
      logo: GalleryVerticalEnd,
      plan: 'Enterprise',
    },
    {
      name: 'Acme Corp.',
      logo: AudioWaveform,
      plan: 'Startup',
    },
    {
      name: 'Evil Corp.',
      logo: Command,
      plan: 'Free',
    },
  ],
  navMain: [
    {
      title: 'Templates',
      icon: Blocks,
      items: [
        { title: 'Mes Templates', url: '/templates' },
        { title: 'Couleurs', url: '/colors' },
      ],
    },
    {
      title: 'Paramètres',
      icon: Settings2,
      items: [
        {
          title: 'Général',
          url: '/settings/general',
        },
        {
          title: 'Custom Lab',
          url: '/settings/custom-lab',
        },
        {
          title: 'Thème',
          url: '/settings/theme',
        },
      ],
    },
  ],
};

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher teams={data.teams} />
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

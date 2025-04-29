import * as React from "react";
import {
  AudioWaveform,
  Command,
  GalleryVerticalEnd,
  BookOpen,
  Users,
  Code,
  Smartphone,
  Megaphone,
} from "lucide-react";

import { NavMain } from "@/components/hub/sidebar/nav-main";
import { useAuthStore } from "@/store/authStore";
import { useUserStore } from "@/store/userStore";
import { NavProjects } from "@/components/hub/sidebar/nav-projects";
import { NavRolesPermissions } from "@/components/hub/sidebar/nav-roles-permissions";
import { NavUser } from "@/components/hub/sidebar/nav-user";
import { TeamSwitcher } from "@/components/hub/sidebar/team-switcher";
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarRail,
} from "@/components/ui/sidebar";

import { useTeamStore } from "@/store/teamStore";


export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  // Fetch teams from Zustand store
  const fetchTeams = useTeamStore((state) => state.fetchTeams);
  const user = useUserStore((state) => state.user);

  React.useEffect(() => {
    fetchTeams();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const navMain = [
    {
      title: "Recaps",
      url: "/hub/recaps",
      icon: BookOpen,
      highlight: true,
      items: [],
      section: 'recaps',
    },
    {
      title: "Members",
      url: "/hub/team/members",
      icon: Users,
      section: 'team',
    }
  ];



  // Sidebar sections: Platform, Roles & Permissions (Superadmin only), Projects
  const platformItems = navMain;

  return (
    <Sidebar collapsible="icon" {...props}>
      <SidebarHeader>
        <TeamSwitcher />
      </SidebarHeader>
      <SidebarContent>
        <NavMain items={platformItems} user={user} />
        {user?.role === "Superadmin" && <NavRolesPermissions user={user} />}
        {/* <NavProjects projects={projects} /> */}
      </SidebarContent>
      <SidebarFooter>
        <NavUser user={{
          name: user?.name || '',
          email: user?.email || '',
        }} />
      </SidebarFooter>
      <SidebarRail />
    </Sidebar>
  );
}


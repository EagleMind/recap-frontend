
interface NavRolesPermissionsProps {
  user?: any;
}

import { SidebarGroup, SidebarGroupLabel, SidebarMenu, SidebarMenuItem, SidebarMenuButton } from "@/components/ui/sidebar";
import { Link } from "react-router-dom";
import { Shield, Key } from "lucide-react";

interface NavRolesPermissionsProps {
  user?: any;
}

import { useSidebar } from "@/components/ui/sidebar";

export function NavRolesPermissions({ user }: NavRolesPermissionsProps) {
  if (!user || user.role !== "Superadmin") {
    return null;
  }
  const { isMobile, setOpenMobile } = useSidebar();
  return (
    <SidebarGroup className="group-data-[collapsible=icon]:hidden">
      <SidebarGroupLabel>Roles & Permissions</SidebarGroupLabel>
      <SidebarMenu>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            onClick={() => {
              if (isMobile) setOpenMobile(false);
            }}
          >
            <Link to="/settings/roles">
              <Shield className="mr-2 h-4 w-4" />
              <span>Roles</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
        <SidebarMenuItem>
          <SidebarMenuButton
            asChild
            onClick={() => {
              if (isMobile) setOpenMobile(false);
            }}
          >
            <Link to="/settings/permissions">
              <Key className="mr-2 h-4 w-4" />
              <span>Permissions</span>
            </Link>
          </SidebarMenuButton>
        </SidebarMenuItem>
      </SidebarMenu>
    </SidebarGroup>
  );
}

"use client";

import { ChevronRight, type LucideIcon } from "lucide-react";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  SidebarGroup,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { Link } from "react-router-dom";

interface NavItem {
  title: string;
  url: string;
  icon?: LucideIcon;
  isActive?: boolean;
  items?: {
    title: string;
    url: string;
  }[];
  superadminOnly?: boolean;
  highlight?: boolean;
  section?: string;
}

interface NavMainProps {
  items: NavItem[];
  user?: any;
}

import { useSidebar } from "@/components/ui/sidebar";

export function NavMain({ items }: NavMainProps) {
  const { isMobile, setOpenMobile } = useSidebar();
  // Separate sections by 'section' property
  const recapsItems = items.filter((item) => item.section === 'recaps');
  const teamItems = items.filter((item) => item.section === 'team');

  return (
    <>
      {/* Recaps Section */}
      <SidebarGroup>
        <SidebarGroupLabel>Recaps</SidebarGroupLabel>
        <SidebarMenu>
          {recapsItems.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton
                asChild
                tooltip={item.title}
                onClick={() => {
                  if (isMobile) setOpenMobile(false);
                }}
              >
                <Link
                  to={item.url}
                  className={`flex items-center gap-2 ${item.highlight ? 'bg-violet-600 text-white font-bold rounded-md px-3 py-1 shadow-sm hover:bg-violet-700 transition-colors group' : ''}`}
                >
                  {item.icon && <item.icon />}
                  <span className={item.highlight ? 'group-hover:text-white text-white' : undefined}>{item.title}</span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarGroup>

      {/* Team Section */}
      <SidebarGroup>
        <SidebarGroupLabel>Team</SidebarGroupLabel>
        <SidebarMenu>
          {teamItems.map((item) => (
            item.items && item.items.length > 0 ? (
              <Collapsible
                key={item.title}
                asChild
                defaultOpen={item.isActive}
                className="group/collapsible"
              >
                <SidebarMenuItem>
                  <CollapsibleTrigger asChild>
                    <SidebarMenuButton tooltip={item.title} >
                      {item.icon && <item.icon />}
                      <span className={item.highlight ? 'group-hover:text-white text-white' : undefined}>{item.title}</span>
                      <ChevronRight className="ml-auto transition-transform duration-200 group-data-[state=open]/collapsible:rotate-90" />
                    </SidebarMenuButton>
                  </CollapsibleTrigger>
                  <CollapsibleContent>
                    <SidebarMenuSub>
                      {item.items?.map((subItem) => (
                        <SidebarMenuSubItem key={subItem.title}>
                          <SidebarMenuSubButton asChild onClick={() => {
                            if (isMobile) setOpenMobile(false);
                          }}>
                            <Link to={subItem.url}>
                              <span>{subItem.title}</span>
                            </Link>
                          </SidebarMenuSubButton>
                        </SidebarMenuSubItem>
                      ))}
                    </SidebarMenuSub>
                  </CollapsibleContent>
                </SidebarMenuItem>
              </Collapsible>
            ) : (
              <SidebarMenuItem key={item.title}>
                <SidebarMenuButton
                  asChild
                  tooltip={item.title}
                  onClick={() => {
                    if (isMobile) setOpenMobile(false);
                  }}
                >
                  <Link
                    to={item.url}
                    className={`flex items-center gap-2 ${item.highlight ? 'bg-violet-600 text-white font-bold rounded-md px-3 py-1 shadow-sm hover:bg-violet-700 transition-colors group' : ''}`}
                  >
                    {item.icon && <item.icon />}
                    <span className={item.highlight ? 'group-hover:text-white text-white' : undefined}>{item.title}</span>
                  </Link>
                </SidebarMenuButton>
              </SidebarMenuItem>
            )
          ))}
        </SidebarMenu>
      </SidebarGroup>
    </>
  );
}

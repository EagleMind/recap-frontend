import { SidebarInset, SidebarTrigger } from "@/components/ui/sidebar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { Separator } from "@radix-ui/react-separator";
import { AppSidebar } from "./sidebar/app-sidebar";
import {
  Breadcrumb,
  BreadcrumbList,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbSeparator,
  BreadcrumbPage,
} from "../ui/breadcrumb";
import { ThemeToggle } from "../theme/theme-toggle";
import React from "react";
import { Outlet, useMatches } from "react-router-dom";

export function HubPage() {
  const matches = useMatches();
  // Collect breadcrumb info from route handle or fallback to path segment
  type BreadcrumbHandle = { breadcrumb: string | ((match: any) => string) };
  const breadcrumbs = matches
    .filter((match) =>
      typeof match.handle === "object" &&
      match.handle !== null &&
      "breadcrumb" in match.handle
    )
    .map((match) => {
      const handle = match.handle as BreadcrumbHandle;
      const crumb = typeof handle.breadcrumb === "function"
        ? handle.breadcrumb(match)
        : handle.breadcrumb;
      return {
        title: crumb,
        href: match.pathname,
      };
    });

  return (
    <SidebarProvider>
      <AppSidebar />
      <SidebarInset>
        <header className="flex h-16 shrink-0 items-center gap-2 transition-[width,height] ease-linear group-has-[[data-collapsible=icon]]/sidebar-wrapper:h-12">
          <div className="flex items-center gap-2 px-4">
            <SidebarTrigger className="-ml-1" />
            <Separator orientation="vertical" className="mr-2 h-4" />
            <Breadcrumb>
              <BreadcrumbList>
                {breadcrumbs.map((crumb, index) => (
  <React.Fragment key={crumb.href}>
    <BreadcrumbItem className={index === breadcrumbs.length - 1 ? "font-medium" : ""}>
      {index === breadcrumbs.length - 1 ? (
        <BreadcrumbPage>{crumb.title}</BreadcrumbPage>
      ) : (
        <BreadcrumbLink href={crumb.href}>{crumb.title}</BreadcrumbLink>
      )}
    </BreadcrumbItem>
    {index < breadcrumbs.length - 1 && <BreadcrumbSeparator className="mx-2" />}
  </React.Fragment>
))}
              </BreadcrumbList>
            </Breadcrumb>
            <div className="ml-auto">
              <ThemeToggle />
            </div>
          </div>
        </header>
        <div className="flex flex-1 flex-col gap-4 p-4 pt-0">
          <Outlet />
        </div>
      </SidebarInset>
    </SidebarProvider>
  );
}

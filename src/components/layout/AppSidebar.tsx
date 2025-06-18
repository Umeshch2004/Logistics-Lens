"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarSeparator,
} from "@/components/ui/sidebar";
import { Button } from "@/components/ui/button";
import { LogOut } from "lucide-react";
import { mainNavItems, secondaryNavItems } from "@/config/nav";
import type { NavItem } from "@/types";
import { Logo } from "@/components/icons";
import { cn } from "@/lib/utils";

export function AppSidebar() {
  const pathname = usePathname();

  const renderNavItems = (items: NavItem[]) => {
    return items.map((item) => {
      const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href));
      return (
        <SidebarMenuItem key={item.title}>
          <Link href={item.href} passHref legacyBehavior>
            <SidebarMenuButton
              asChild={false} // Ensure it's a button for proper styling and ARIA roles
              isActive={isActive}
              className={cn(
                "w-full justify-start",
                isActive ? "bg-sidebar-primary text-sidebar-primary-foreground" : "hover:bg-sidebar-accent hover:text-sidebar-accent-foreground"
              )}
              aria-current={isActive ? "page" : undefined}
            >
              <item.icon className="mr-2 h-5 w-5" />
              <span>{item.title}</span>
            </SidebarMenuButton>
          </Link>
        </SidebarMenuItem>
      );
    });
  };

  return (
    <Sidebar collapsible="icon" side="left" variant="sidebar">
      <SidebarHeader className="border-b border-sidebar-border p-4">
        <Logo />
      </SidebarHeader>
      <SidebarContent className="flex-grow p-2">
        <SidebarMenu>
          {renderNavItems(mainNavItems)}
        </SidebarMenu>
        {secondaryNavItems.length > 0 && (
          <>
            <SidebarSeparator className="my-4" />
            <SidebarMenu>
              {renderNavItems(secondaryNavItems)}
            </SidebarMenu>
          </>
        )}
      </SidebarContent>
      <SidebarFooter className="p-4 border-t border-sidebar-border">
        {/* Placeholder for user profile or logout */}
        <Button variant="ghost" className="w-full justify-start text-sidebar-foreground hover:bg-sidebar-accent hover:text-sidebar-accent-foreground">
          <LogOut className="mr-2 h-5 w-5" />
          Logout
        </Button>
      </SidebarFooter>
    </Sidebar>
  );
}

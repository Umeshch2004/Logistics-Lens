import type { NavItem } from "@/types";
import { LayoutDashboard, ShoppingCart, Truck, ClipboardCheck, Users, Settings } from "lucide-react";

export const mainNavItems: NavItem[] = [
  {
    title: "Dashboard",
    href: "/dashboard",
    icon: LayoutDashboard,
  },
  {
    title: "Purchases",
    href: "/purchases",
    icon: ShoppingCart,
  },
  {
    title: "Transfers",
    href: "/transfers",
    icon: Truck,
  },
  {
    title: "Assignments",
    href: "/assignments",
    icon: ClipboardCheck,
  },
];

export const secondaryNavItems: NavItem[] = [
  // Example for future expansion
  // {
  //   title: "User Management",
  //   href: "/users",
  //   icon: Users,
  // },
  // {
  //   title: "Settings",
  //   href: "/settings",
  //   icon: Settings,
  // },
];

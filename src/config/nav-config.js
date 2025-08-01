import {
  LayoutDashboard,
  Users,
  ListChecks,
  TrendingUp,
  ShieldCheck,
  CalendarPlus,
  CalendarRange,
  ShieldUser
} from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";

export const navItems = [
  { href: "/", icon: LayoutDashboard, label: "Dashboard", permission: null },
  {
    href: "/employees",
    icon: Users,
    label: "Employees",
    permission: PERMISSIONS.PAGES.EMPLOYEE_MANAGEMENT,
  },
  { href: "/tasks", icon: ListChecks, label: "Tasks", permission: null },
  {
    href: "/increment-report",
    icon: TrendingUp,
    label: "Increment Report",
    permission: PERMISSIONS.PAGES.INCREMENT_REPORT,
  },
  {
    href: "/increment-policy",
    icon: TrendingUp,
    label: "Increment Policy",
    permission: PERMISSIONS.PAGES.INCREMENT_POLICY,
  },
  {
    href: "/manage-permissions",
    icon: ShieldUser,
    label: "Manage Permissions",
    permission: PERMISSIONS.PAGES.MANAGE_EMPLOYEE_PERMISSIONS,
  },
    {
    href: "/request-leave",
    icon: CalendarPlus,
    label: "Request Leave",
    permission: null,
  },
  {
    href: "/manage-leaves",
    icon: CalendarRange,
    label: "Manage Leaves",
    permission: PERMISSIONS.PAGES.LEAVE_MANAGEMENT,
  },
    
  {
    href: "/rules-manager",
    icon: ShieldCheck,
    label: "Rules",
    permission: PERMISSIONS.PAGES.RULES_MANAGEMENT,
  },
];
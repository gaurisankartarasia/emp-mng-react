import {
  LayoutDashboard,
  Users,
  ListChecks,
  TrendingUp,
  ShieldCheck,
  CalendarPlus,
  CalendarRange,
  ShieldUser,
  Banknote,
  BanknoteArrowUp
} from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";


export const navItems = [
  { href: "/", icon: LayoutDashboard, label: "dashboard", permission: null },
  {
    href: "/employees",
    icon: Users,
    label: "employees",
    permission: PERMISSIONS.PAGES.EMPLOYEE_MANAGEMENT,
  },
  { href: "/tasks", icon: ListChecks, label: "tasks", permission: null },
  {
    href: "/increment-report",
    icon: TrendingUp,
    label: "increment-report",
    permission: PERMISSIONS.PAGES.INCREMENT_REPORT,
  },
  {
    href: "/increment-policy",
    icon: TrendingUp,
    label: "increment-policy",
    permission: PERMISSIONS.PAGES.INCREMENT_POLICY,
  },
  {
    href: "/manage-permissions",
    icon: ShieldUser,
    label: "manage-permissions",
    permission: PERMISSIONS.PAGES.MANAGE_EMPLOYEE_PERMISSIONS,
  },
    {
    href: "/request-leave",
    icon: CalendarPlus,
    label: "request-leave",
    permission: null,
  },
  {
    href: "/manage-leaves",
    icon: CalendarRange,
    label: "manage-leaves",
    permission: PERMISSIONS.PAGES.LEAVE_MANAGEMENT,
  },
    
  {
    href: "/rules-manager",
    icon: ShieldCheck,
    label: "rules",
    permission: PERMISSIONS.PAGES.RULES_MANAGEMENT,
  },
    {
    href: "/payroll",
    icon: Banknote,
    label: "Payroll",
    permission: PERMISSIONS.PAGES.MANAGE_EMPLOYEE_PERMISSIONS,
  }
];


import {
  MdDashboard,
  MdPeople,
  MdChecklist,
  MdTrendingUp,
  MdSecurity,
  MdEventAvailable,
  MdEventNote,
  MdPersonAddAlt,
  MdCurrencyRupee,
  MdArrowCircleUp,
  MdKeyboardArrowDown,
  MdKeyboardArrowRight,
  MdDescription,
  MdPostAdd,
} from "react-icons/md";

import { PERMISSIONS } from "@/config/permissions";

export const navItems = [
  { 
    href: "/dashboard", 
    icon: MdDashboard, 
    label: "dashboard", 
    permission: null 
  },
  {
    href: "/employees",
    icon: MdPeople,
    label: "employees",
    permission: PERMISSIONS.PAGES.EMPLOYEE_MANAGEMENT,
  },
  { 
    href: "/tasks", 
    icon: MdChecklist, 
    label: "tasks", 
    permission: null 
  },
  
  {
    label: "Rules & Permissions",
    icon: MdPeople,
    permission: null,
    isSubmenu: true,
    subItems: [
      {
        href: "/manage-permissions",
        icon: MdPersonAddAlt,
        label: "manage-permissions",
        permission: PERMISSIONS.PAGES.MANAGE_EMPLOYEE_PERMISSIONS,
      },
      {
        href: "/rules-manager",
        icon: MdSecurity,
        label: "rules",
        permission: PERMISSIONS.PAGES.RULES_MANAGEMENT,
      }
    ]
  },

  {
    label: "Leaves",
    icon: MdEventNote,
    permission: null,
    isSubmenu: true,
    subItems: [
      {
        href: "/request-leave",
        icon: MdEventAvailable,
        label: "request-leave",
        permission: null,
      },
      {
        href: "/manage-leaves",
        icon: MdEventNote,
        label: "manage-leaves",
        permission: PERMISSIONS.PAGES.LEAVE_MANAGEMENT,
      }
    ]
  },

  {
    label: "Reports",
    icon: MdDescription,
    permission: null,
    isSubmenu: true,
    subItems: [
      {
        href: "/increment-report",
        icon: MdPostAdd,
        label: "increment-report",
        permission: PERMISSIONS.PAGES.INCREMENT_REPORT,
      },
      {
        href: "/increment-policy",
        icon: MdPostAdd,
        label: "increment-policy",
        permission: PERMISSIONS.PAGES.INCREMENT_POLICY,
      }
    ]
  },

  {
    label: "Payroll",
    icon: MdCurrencyRupee,
    permission: null,
    isSubmenu: true,
    subItems: [
      {
        href: "/manage-salary-components",
        icon: MdCurrencyRupee,
        label: "Salary Components",
        permission: null,
      },
      {
        href: "/salary-structure",
        icon: MdCurrencyRupee,
        label: "Salary Structure",
        permission: null,
      },
      {
        href: "/payroll",
        icon: MdCurrencyRupee,
        label: "Payroll",
        permission: PERMISSIONS.PAGES.PAYROLL_MANAGEMENT,
      }
    ]
  },
  
];

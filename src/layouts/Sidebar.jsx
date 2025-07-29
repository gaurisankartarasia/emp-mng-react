import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
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
import useAuth from "@/hooks/useAuth";
import { PERMISSIONS } from "@/config/permissions";

const navItems = [
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
    permission: PERMISSIONS.PAGES.LEAVE_MANAGEMENT,
  },
];

export function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (user.is_master) return true;
    return user.permissions?.includes(permission);
  };

  return (
    <div className="hidden border-r bg-sidebar text-sidebar-foreground md:block  ">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b border-[#7f7f80] px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="">ST-5</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems
              .filter((item) => hasPermission(item.permission))
              .map((item) => (
                <div key={item.href}>
                  <div>
                    <Link to={item.href} className="my-1 ">
                      <Button
                        variant={pathname === item.href ? "default" : "ghost"}
                        className="w-full h-12 rounded-full justify-start"
                      >
                        <item.icon  className="mr-2" />
                        
                        {item.label}
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
          </nav>
        </div>
      </div>
    </div>
  );
}



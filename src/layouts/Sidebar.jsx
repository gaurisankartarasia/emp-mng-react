import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  LayoutDashboard,
  Users,
  ListChecks,
  TrendingUp,
  ShieldCheck,
} from "lucide-react";
import useAuth from "@/hooks/useAuth";
import { PERMISSIONS } from "@/config/permissions";
import { Separator } from "@/components/ui/separator";

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
    href: "/manage-permissions",
    icon: ShieldCheck,
    label: "Manage Permissions",
    permission: PERMISSIONS.PAGES.MANAGE_EMPLOYEE_PERMISSIONS,
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
    <div className="hidden border-r bg-sidebar md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <span className="">ST5</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems
              .filter((item) => hasPermission(item.permission))
              .map((item) => (
                <>
                  <Link key={item.href} to={item.href} className="my-1" >
                    <Button
                      variant={pathname === item.href ? "secondary" : "ghost"}
                      className="w-full h-12 justify-start"
                    >
                      <item.icon className="mr-2" />
                      {item.label}
                    </Button>
                  </Link>
                  <Separator className="opacity-50" />
                </>
              ))}
          </nav>
        </div>
      </div>
    </div>
  );
}

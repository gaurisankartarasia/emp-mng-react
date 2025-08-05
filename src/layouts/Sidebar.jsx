import { Link, useLocation } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { navItems } from "@/config/nav-config";
import useAuth from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";

export function Sidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const t = useT()

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (user.is_master) return true;
    return user.permissions?.includes(permission);
  };

  return (
    <div className="hidden bg-sidebar text-sidebar-foreground md:block  ">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center px-4 lg:h-[60px] lg:px-6">
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
                        variant={
    pathname === item.href || pathname.startsWith(item.href + "/")
      ? "default"
      : "ghost"
  }
                        className="w-full h-10 my-1 rounded-full justify-start"
                      >
                        <item.icon className="mx-2" />

                        {t(`${item.label}`)}
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


import { Link, useLocation } from "react-router-dom";
import { navItems } from "@/config/nav-config";
import useAuth from "@/hooks/useAuth";
import { useT } from "@/hooks/useT";
import { ChevronDown, ChevronRight } from "lucide-react";
import { useState } from "react";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarTrigger,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

export function AppSidebar() {
  const { pathname } = useLocation();
  const { user } = useAuth();
  const t = useT();
  const [openSubmenus, setOpenSubmenus] = useState({});
  const { state } = useSidebar();

  const hasPermission = (permission) => {
    if (!permission) return true;
    if (user.is_master) return true;
    return user.permissions?.includes(permission);
  };

  const toggleSubmenu = (label) => {
    setOpenSubmenus(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const isSubmenuActive = (subItems) => {
    return subItems.some(item => 
      pathname === item.href || pathname.startsWith(item.href + "/")
    );
  };

  const isItemActive = (href) => {
    return pathname === href || pathname.startsWith(href + "/");
  };

  const renderNavItem = (item) => {
    if (item.isSubmenu) {
      const visibleSubItems = item.subItems.filter(subItem => hasPermission(subItem.permission));
      
      if (visibleSubItems.length === 0) return null;

      const isOpen = openSubmenus[item.label];
      const isActive = isSubmenuActive(visibleSubItems);

      if (state === "collapsed") {
        return (
          <SidebarMenuItem key={item.label}>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <SidebarMenuButton 
                  isActive={isActive}
                  tooltip={t(item.label)}
                >
                  <item.icon className="size-8" />
                  <span>{t(item.label)}</span>
                </SidebarMenuButton>
              </DropdownMenuTrigger>
              <DropdownMenuContent side="right" align="start" className="w-48">
                {visibleSubItems.map((subItem) => (
                  <DropdownMenuItem key={subItem.href} asChild>
                    <Link to={subItem.href} className="flex items-center">
                      <subItem.icon className="mr-2 h-4 w-4" />
                      <span>{t(subItem.label)}</span>
                    </Link>
                  </DropdownMenuItem>
                ))}
              </DropdownMenuContent>
            </DropdownMenu>
          </SidebarMenuItem>
        );
      }

      return (
        <Collapsible
          key={item.label}
          open={isOpen}
          onOpenChange={() => toggleSubmenu(item.label)}
        >
          <SidebarMenuItem>
            <CollapsibleTrigger asChild>
              <SidebarMenuButton 
                isActive={isActive}
                className="w-full justify-between h-10"
              >
                <div className="flex items-center">
                  <item.icon className="mr-2 h-4 w-4" />
                  <span>{t(item.label)}</span>
                </div>
                {isOpen ? (
                  <ChevronDown className="h-4 w-4" />
                ) : (
                  <ChevronRight className="h-4 w-4" />
                )}
              </SidebarMenuButton>
            </CollapsibleTrigger>
            <CollapsibleContent>
              <SidebarMenuSub>
                {visibleSubItems.map((subItem) => (
                  <SidebarMenuSubItem key={subItem.href}>
                    <SidebarMenuSubButton 
                      asChild
                      isActive={isItemActive(subItem.href)}
                       className="h-10"
                    >
                      <Link to={subItem.href}>
                        <subItem.icon className="mr-2 " />
                        <span>{t(subItem.label)}</span>
                      </Link>
                    </SidebarMenuSubButton>
                  </SidebarMenuSubItem>
                ))}
              </SidebarMenuSub>
            </CollapsibleContent>
          </SidebarMenuItem>
        </Collapsible>
      );
    }

    if (!hasPermission(item.permission)) return null;

    return (
      <SidebarMenuItem key={item.href} >
        <SidebarMenuButton 
          asChild
          isActive={isItemActive(item.href)}
          tooltip={state === "collapsed" ? t(item.label) : undefined}
           className="h-10"
        >
          <Link to={item.href}>
            <item.icon className="mr-2 h-4 w-4" />
            <span>{t(item.label)}</span>
          </Link>
        </SidebarMenuButton>
      </SidebarMenuItem>
    );
  };

  return (
    <Sidebar collapsible="icon">
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" asChild>
              <Link to="/" className="flex items-center gap-2">
                <div className="flex aspect-square size-8 items-center justify-center rounded-lg bg-primary text-primary-foreground">
                  <span className="font-bold">S</span>
                </div>
                <span className="font-semibold">ST-5</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
          <SidebarMenuItem>
            <SidebarTrigger className="ml-auto" />
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupContent>
            <SidebarMenu >
              {navItems
                .filter((item) => {
                  if (item.isSubmenu) {
                    return item.subItems.some(subItem => hasPermission(subItem.permission));
                  }
                  return hasPermission(item.permission);
                })
                .map(renderNavItem)}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
}
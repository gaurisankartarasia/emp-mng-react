import { UserNav } from "./TopNavUserMenu";
import { ModeToggle } from "@/components/ThemeToggle";
import useAuth from "@/hooks/useAuth";
import { Badge } from "@/components/ui/badge";
import { ShieldUser } from "lucide-react";
import { formatDateTime } from "@/utils/dateFormat";
import LanguageSwitcher from "@/components/LanguageSwitcher";
import { useT } from "@/hooks/useT";
import { NotificationBadge } from "./NotificationBadge";

export function TopNavbar() {
  const { user } = useAuth();
  const t = useT();

  return (
    <header className="flex justify-end h-14 items-center gap-4 shadow bg-navbar text-navbar-foreground px-4 lg:h-[60px] lg:px-6">
       <NotificationBadge />
      <Badge variant="secondary">
        Last signin: {formatDateTime(user.last_login)}{" "}
      </Badge>

       {user.is_master && (
        <Badge>
          {" "}
          <ShieldUser /> {t("master-account")}
        </Badge>
      )}

           
      <UserNav /> 
     
      <LanguageSwitcher /> 
      <ModeToggle />
     
      
    </header>
  );
}

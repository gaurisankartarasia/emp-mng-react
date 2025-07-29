import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import  useAuth  from "@/hooks/useAuth";
import { Link } from "react-router-dom";
import { CircleUser, Settings, LogOut } from "lucide-react";

export function UserNav() {
  const { user, logout } = useAuth();
  const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api", "");

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" className="relative h-8 w-8 ">
       <Avatar
  className={`h-8 w-8`}
>
  <AvatarImage src={user.picture ? `${apiBaseUrl}${user.picture}` : undefined} />
  <AvatarFallback>
    <CircleUser />
  </AvatarFallback>
</Avatar>

        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end" forceMount>
        <DropdownMenuLabel className="font-normal">
          <div className="flex flex-col space-y-1">
            <p className="text-sm font-medium leading-none">{user.name}</p>
            <p className="text-xs leading-none text-muted-foreground">{user.email}</p>
          </div>
        </DropdownMenuLabel>
        <DropdownMenuSeparator />
        <DropdownMenuGroup>
          <Link to="/account">
            <DropdownMenuItem className="cursor-pointer"><CircleUser/>Profile</DropdownMenuItem>
          </Link>
          <Link to="/account/settings">
            <DropdownMenuItem className="cursor-pointer"><Settings/>Settings</DropdownMenuItem>
          </Link>
        </DropdownMenuGroup>
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={logout} className="cursor-pointer">
         <LogOut/> Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
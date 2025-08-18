import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { MdDarkMode, MdLightMode, MdMonitor } from "react-icons/md";


export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost" size="icon" >
          <MdLightMode className="h-5 w-5 transition-all dark:hidden" />
          <MdDarkMode className="h-5 w-5 hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
          
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}> <MdLightMode/> Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}> <MdDarkMode/> Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}> <MdMonitor/> System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



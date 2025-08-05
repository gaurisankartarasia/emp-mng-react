import { useTheme } from "@/context/ThemeProvider";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
} from "@/components/ui/dropdown-menu";
import { Sun, Moon, MonitorSmartphone } from "lucide-react";

export function ModeToggle() {
  const { theme, setTheme } = useTheme();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="ghost">
          <Sun className="h-5 w-5 transition-all dark:hidden" />
          <Moon className="h-5 w-5 hidden dark:block" />
          <span className="sr-only">Toggle theme</span>
          Theme
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        <DropdownMenuItem onClick={() => setTheme("light")}> <Sun/> Light</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("dark")}> <Moon/> Dark</DropdownMenuItem>
        <DropdownMenuItem onClick={() => setTheme("system")}> <MonitorSmartphone/> System</DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}



// import { useEffect, useState } from "react";
// import { useTheme } from "@/context/ThemeProvider";
// import { Button } from "@/components/ui/button";
// import { Sun, Moon } from "lucide-react";

// export function ModeToggle() {
//   const { theme, setTheme } = useTheme();
//   const [mounted, setMounted] = useState(false);

//   useEffect(() => {
//     if (!theme) {
//       setTheme("system");
//     }
//     setMounted(true);
//   }, [theme, setTheme]);

//   if (!mounted) return null;

//   const toggleTheme = () => {
//     if (theme === "light") {
//       setTheme("dark");
//     } else if (theme === "dark") {
//       setTheme("light");
//     } else {
//       const isSystemDark =
//         window.matchMedia &&
//         window.matchMedia("(prefers-color-scheme: dark)").matches;
//       setTheme(isSystemDark ? "light" : "dark");
//     }
//   };

//   return (
//     <Button variant="ghost" size="icon" onClick={toggleTheme}>
//       <Sun className="h-5 w-5 transition-all dark:hidden" />
//       <Moon className="h-5 w-5 hidden dark:block" />
//       <span className="sr-only">Toggle theme</span>
//     </Button>
//   );
// }

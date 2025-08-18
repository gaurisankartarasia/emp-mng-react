
// import {AppSidebar} from './Sidebar';

// import { TopNavbar } from './TopNavbar';
// import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

// export function Layout({ children }) {
//   return (
//     <SidebarProvider>
//     <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
//       <AppSidebar />
//       <div className="flex flex-col overflow-hidden">
//         <TopNavbar />
//         <main className="flex-1 overflow-auto p-4 lg:p-6 lg:gap-6 gap-4 flex flex-col">
//                   <SidebarTrigger />

//           {children}
//         </main>
//       </div>
//     </div>
//     </SidebarProvider>
//   );
// }

import {AppSidebar} from './Sidebar';
import { TopNavbar } from './TopNavbar';
import { SidebarProvider } from "@/components/ui/sidebar"


export function Layout({ children }) {
  return (
    <SidebarProvider>
      <div className="flex h-screen w-full overflow-hidden">
        <AppSidebar />
        <div className="flex flex-col flex-1 overflow-hidden">
          <TopNavbar />
          <main className="flex-1 overflow-auto p-4 lg:p-6 lg:gap-6 gap-4 flex flex-col">
           
           
            {children}
          </main>
        </div>
      </div>
    </SidebarProvider>
  );
}
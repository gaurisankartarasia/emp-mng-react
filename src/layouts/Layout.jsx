// import { Sidebar } from './Sidebar';
// import { TopNavbar } from './TopNavbar';

// export function Layout({ children }) {
//   return (
//     <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
//         <Sidebar />
//         <div className="flex flex-col">
//             <TopNavbar />
//             <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
//                 {children}
//             </main>
//         </div>
//     </div>
//   );
// }


import { Sidebar } from './Sidebar';
import { TopNavbar } from './TopNavbar';

export function Layout({ children }) {
  return (
    <div className="grid h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr] overflow-hidden">
      <Sidebar />
      <div className="flex flex-col overflow-hidden">
        <TopNavbar />
        <main className="flex-1 overflow-auto p-4 lg:p-6 lg:gap-6 gap-4 flex flex-col">
          {children}
        </main>
      </div>
    </div>
  );
}

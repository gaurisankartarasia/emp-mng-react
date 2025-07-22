// import { Link } from 'react-router-dom';
// import AppRoutes from './routes/AppRoutes';
// import useAuth from './hooks/useAuth';
// import { Toaster } from 'sonner';

// function App() {
//   const { isAuthenticated, user, logout } = useAuth();

//   return (
//     <div>
//       {isAuthenticated && user && (
//         <nav>
//           <span>Welcome, {user.name}</span>
//           <ul>
//             <li><Link to="/">Home</Link></li>
//             <li><Link to="/employees">Employees</Link></li>
//              <li><Link to="/tasks">Tasks</Link></li>
//              <li><Link to="/increment-report">Increment report</Link></li>
//               <li><Link to="/manage-permissions">Manage Permissions</Link></li>
//             <li><button onClick={logout}>Logout</button></li>
//           </ul>
//         </nav>
//       )}
//       <main>
//         <AppRoutes />
//       </main>
//       <Toaster richColors /> 
//     </div>
//   );
// }

// export default App;




import AppRoutes from './routes/AppRoutes';
import { Toaster } from 'sonner';

function App() {
  return (
    <>
      <AppRoutes />
      <Toaster position='top-center' />
    </>
  );
}

export default App;
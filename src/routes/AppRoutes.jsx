// import { Route, Routes } from 'react-router-dom';
// import ProtectedRoute from './ProtectedRoute';
// import { PERMISSIONS } from '../config/permissions';

// import LoginPage from '../pages/LoginPage';
// import DashboardPage from '../pages/DashboardPage';
// import EmployeeManagementPage from '../pages/EmployeeManagementPage';
// import UnauthorizedPage from '../pages/UnauthorizedPage';
// import AddEmployeePage from '../pages/AddEmployeePage';
// import EditEmployeePage from '../pages/EditEmployeePage'; 
// import TaskPage from '../pages/TaskPage';
// import IncrementReportPage from '../pages/IncrementReportPage';
// import ManagePermissionsPage from '../pages/ManagePermissionsPage';

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
     
//       <Route 
//         path="/employees" 
//         element={
//           <ProtectedRoute permission={PERMISSIONS.VIEW_EMPLOYEE_MANAGEMENT}>
//             <EmployeeManagementPage />
//           </ProtectedRoute>
//         } 
//       />
//        <Route 
//         path="/employees/add"
//         element={
//           <ProtectedRoute permission={PERMISSIONS.VIEW_EMPLOYEE_MANAGEMENT}>
//             <AddEmployeePage />
//           </ProtectedRoute>
//         }
//       />
//        <Route 
//         path="/employees/:id/edit"
//         element={
//           <ProtectedRoute permission={PERMISSIONS.VIEW_EMPLOYEE_MANAGEMENT}>
//             <EditEmployeePage />
//           </ProtectedRoute>
//         }
//       />

//         <Route 
//         path="/tasks"
//         element={
//           <ProtectedRoute>
//             <TaskPage />
//           </ProtectedRoute>
//         }
//       />
//   <Route 
//         path="/increment-report"
//         element={
//           <ProtectedRoute permission={PERMISSIONS.VIEW_INCREMENT_REPORT}>
//             <IncrementReportPage />
//           </ProtectedRoute>
//         }
//       />
//  <Route 
//         path="/manage-permissions"
//         element={
//           <ProtectedRoute permission={PERMISSIONS.MANAGE_EMPLOYEE_PERMISSIONS}>
//             <ManagePermissionsPage />
//           </ProtectedRoute>
//         }
//       />
      
//       <Route path="/" element={
//         <ProtectedRoute>
//             <DashboardPage />
//         </ProtectedRoute>
//       } />

//     </Routes>
//   );
// };

// export default AppRoutes;


import { Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import { PERMISSIONS } from '../config/permissions';
import { Layout } from '@/layouts/Layout';

import LoginPage from '../pages/LoginPage';
import DashboardPage from '../pages/DashboardPage';
import EmployeeManagementPage from '../pages/EmployeeManagementPage';
import AddEmployeePage from '../pages/AddEmployeePage';
import EditEmployeePage from '../pages/EditEmployeePage';
import TasksPage from '@/pages/TaskPage';
import IncrementReportPage from '../pages/IncrementReportPage';
import ManagePermissionsPage from '../pages/ManagePermissionsPage';
import UnauthorizedPage from '../pages/UnauthorizedPage';
import AccountDisplayPage from '../pages/AccountPage';
import AccountEditPage from '../pages/AccountEditPage';
import AccountSettingsPage from '../pages/AccountSettingsPage';
import ActivateAccountPage from '@/pages/ActivateAccountPage';
import PolicyPage from '@/pages/HrPolicyPage';
import PageNotFound from '@/pages/404/not-found';

const ProtectedPage = ({ children, permission }) => (
  <ProtectedRoute permission={permission}>
    <Layout>
      {children}
    </Layout>
  </ProtectedRoute>
);

const AppRoutes = () => {
  return (
    <Routes>

 <Route path="*" element={<PageNotFound />} />

      <Route path="/login" element={<LoginPage />} />
           <Route path="/activate-account" element={<ActivateAccountPage />} /> 
      <Route path="/unauthorized" element={<UnauthorizedPage />} />
      
      <Route path="/" element={<ProtectedPage><DashboardPage /></ProtectedPage>} />
      <Route path="/dashboard" element={<ProtectedPage><DashboardPage /></ProtectedPage>} />
      <Route path="/tasks" element={<ProtectedPage><TasksPage /></ProtectedPage>} />

      <Route path="/employees" element={<ProtectedPage permission={PERMISSIONS.VIEW_EMPLOYEE_MANAGEMENT}><EmployeeManagementPage /></ProtectedPage>} />
      <Route path="/employees/add" element={<ProtectedPage permission={PERMISSIONS.VIEW_EMPLOYEE_MANAGEMENT}><AddEmployeePage /></ProtectedPage>} />
      <Route path="/employees/:id/edit" element={<ProtectedPage permission={PERMISSIONS.VIEW_EMPLOYEE_MANAGEMENT}><EditEmployeePage /></ProtectedPage>} />
      <Route path="/hr-policy" element={<ProtectedPage ><PolicyPage /></ProtectedPage>} />
      <Route path="/increment-report" element={<ProtectedPage permission={PERMISSIONS.VIEW_INCREMENT_REPORT}><IncrementReportPage /></ProtectedPage>} />
      
      <Route path="/manage-permissions" element={<ProtectedPage permission={PERMISSIONS.MANAGE_EMPLOYEE_PERMISSIONS}><ManagePermissionsPage /></ProtectedPage>} />
 <Route path="/account" element={<ProtectedPage><AccountDisplayPage /></ProtectedPage>} />
      <Route path="/account/edit" element={<ProtectedPage><AccountEditPage /></ProtectedPage>} />
      <Route path="/account/settings" element={<ProtectedPage><AccountSettingsPage /></ProtectedPage>} />
    </Routes>
  );
};

export default AppRoutes;
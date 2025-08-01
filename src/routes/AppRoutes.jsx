

// import { Route, Routes } from "react-router-dom";
// import ProtectedRoute from "./ProtectedRoute";
// import { PERMISSIONS } from "../config/permissions";
// import { Layout } from "@/layouts/Layout";

// import LoginPage from "../pages/auth/LoginPage";
// import DashboardPage from "../pages/DashboardPage";
// import EmployeeManagementPage from "../pages/employee/EmployeeManagementPage";
// import AddEmployeePage from "../pages/employee/AddEmployeePage";
// import EditEmployeePage from "../pages/employee/EditEmployeePage";
// import TasksPage from "@/pages/task/TaskPage";
// import IncrementReportPage from "../pages/policy/IncrementReportPage";
// import ManagePermissionsPage from "../pages/permission/ManagePermissionsPage";
// import UnauthorizedPage from "../pages/auth/UnauthorizedPage";
// import AccountDisplayPage from "../pages/account/AccountPage";
// import AccountEditPage from "../pages/account/AccountEditPage";
// import AccountSettingsPage from "../pages/account/AccountSettingsPage";
// import ActivateAccountPage from "@/pages/auth/ActivateAccountPage";
// import PolicyPage from "@/pages/policy/HrPolicyPage";
// import PageNotFound from "@/pages/404/not-found";
// import LeaveManagementAdminPage from '@/pages/leaves/LeaveManagementPage';
// import RequestLeavePage from '../pages/leaves/RequestLeavePage';
// import RulesManagerPage from "@/pages/rules/RulesPage";
// import MyLeaveHistoryPage from "@/pages/leaves/MyLeaveHistoryPage";

// const ProtectedPage = ({ children, permission }) => (
//   <ProtectedRoute permission={permission}>
//     <Layout>{children}</Layout>
//   </ProtectedRoute>
// );

// const AppRoutes = () => {
//   return (
//     <Routes>
//       <Route path="*" element={ <ProtectedPage><PageNotFound /></ProtectedPage> } />

//       <Route path="/login" element={<LoginPage />} />
//       <Route path="/activate-account" element={<ActivateAccountPage />} />
//       <Route path="/unauthorized" element={<UnauthorizedPage />} />

//       <Route
//         path="/"
//         element={
//           <ProtectedPage>
//             <DashboardPage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/dashboard"
//         element={
//           <ProtectedPage>
//             <DashboardPage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/tasks"
//         element={
//           <ProtectedPage>
//             <TasksPage />
//           </ProtectedPage>
//         }
//       />

//       <Route
//         path="/employees"
//         element={
//           <ProtectedPage permission={PERMISSIONS.PAGES.EMPLOYEE_MANAGEMENT}>
//             <EmployeeManagementPage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/employees/add"
//         element={
//           <ProtectedPage permission={PERMISSIONS.PAGES.EMPLOYEE_MANAGEMENT}>
//             <AddEmployeePage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/employees/:id/edit"
//         element={
//           <ProtectedPage permission={PERMISSIONS.PAGES.EMPLOYEE_MANAGEMENT}>
//             <EditEmployeePage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/increment-policy"
//         element={
//           <ProtectedPage>
//             <PolicyPage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/increment-report"
//         element={
//           <ProtectedPage permission={PERMISSIONS.PAGES.INCREMENT_REPORT}>
//             <IncrementReportPage />
//           </ProtectedPage>
//         }
//       />

//       <Route
//         path="/manage-permissions"
//         element={
//           <ProtectedPage permission={PERMISSIONS.PAGES.MANAGE_EMPLOYEE_PERMISSIONS}>
//             <ManagePermissionsPage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/account"
//         element={
//           <ProtectedPage>
//             <AccountDisplayPage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/account/edit"
//         element={
//           <ProtectedPage>
//             <AccountEditPage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/account/settings"
//         element={
//           <ProtectedPage>
//             <AccountSettingsPage />
//           </ProtectedPage>
//         }
//       />
//        <Route
//         path="/request-leave"
//         element={
//           <ProtectedPage >
//             <RequestLeavePage />
//           </ProtectedPage>
//         }
//       />
//       <Route
//         path="/request-leave/history"
//         element={
//           <ProtectedPage >
//             <MyLeaveHistoryPage />
//           </ProtectedPage>
//         }
//       />
//        <Route
//         path="/manage-leaves"
//         element={
//           <ProtectedPage permission={PERMISSIONS.PAGES.LEAVE_MANAGEMENT}>
//             <LeaveManagementAdminPage />
//           </ProtectedPage>
//         }
//       />
//   <Route 
//         path="/rules-manager"
//         element={
//             <ProtectedPage 
//             permission={PERMISSIONS.PAGES.RULES_MANAGEMENT}
//             >
//                 <RulesManagerPage />
//             </ProtectedPage>
//         }
//     />

//     </Routes>

    

    
//   );
// };

// export default AppRoutes;




import React from 'react';
import { Route, Routes } from 'react-router-dom';
import PrivateRoutes from './PrivateRoutes';

import LoginPage from '@/pages/auth/LoginPage';
import ActivateAccountPage from '@/pages/auth/ActivateAccountPage';
import { AuthProvider } from '@/context/AuthContext';

const AppRoutes = () => {
  return (
    <AuthProvider>
    <Routes>
      {/* --- PUBLIC ROUTES --- */}
      
      <Route path="/login" element={<LoginPage />} />
      <Route path="/activate-account" element={<ActivateAccountPage />} />
      
      {/* --- PRIVATE ROUTES --- */}
      {/* Any other path will mount the PrivateRoutes component, which CONTAINS the AuthProvider */}
      <Route path="/*" element={<PrivateRoutes />} />
    </Routes>
    </AuthProvider>
  );
};

export default AppRoutes;
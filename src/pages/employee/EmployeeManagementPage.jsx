// import React, { useState, useEffect } from "react";
// import { Link } from "react-router-dom";
// import apiClient from "../api/axiosConfig";
// import useAuth from "../hooks/useAuth";
// import {
//   Table,
//   TableBody,
//   TableCell,
//   TableHead,
//   TableHeader,
//   TableRow,
// } from "@/components/ui/table";
// import {
//   AlertDialog,
//   AlertDialogAction,
//   AlertDialogCancel,
//   AlertDialogContent,
//   AlertDialogDescription,
//   AlertDialogFooter,
//   AlertDialogHeader,
//   AlertDialogTitle,
// } from "@/components/ui/alert-dialog";
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
// import { Button } from "@/components/ui/button";
// import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
// import { toast } from "sonner";
// import { Plus, Terminal, Trash, Edit, Search, SquareUser } from "lucide-react";
// import { Input } from "@/components/ui/input";
// import { PERMISSIONS } from "../config/permissions";
// import AccessDenied from "@/components/AccessDenied";
// import { Spinner } from "@/components/ui/spinner";
// import EmployeeHoverCard from "@/components/employees/EmployeeHoverCard";
// import { formatDate } from "@/utils/dateFormat";
// import { Badge } from "@/components/ui/badge";

// const EmployeeManagementPage = () => {
//   const [employees, setEmployees] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
//   const [employeeToDelete, setEmployeeToDelete] = useState(null);
//   const { user } = useAuth();
//   const apiBaseUrl = import.meta.env.VITE_API_BASE_URL.replace("/api/v1", "");
//   const [searchTerm, setSearchTerm] = useState("");
//   const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");

//   const canRead =
//     user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.READ);

//   const canCreate =
//     user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.CREATE);
//   const canUpdate =
//     user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.UPDATE);
//   const canDelete =
//     user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.DELETE);

//   useEffect(() => {
//     const timerId = setTimeout(() => {
//       setDebouncedSearchTerm(searchTerm);
//     }, 500);
//     return () => {
//       clearTimeout(timerId);
//     };
//   }, [searchTerm]);

//   const fetchEmployees = async () => {
//     try {
//       setLoading(true);

//       const config = {};

//       if (debouncedSearchTerm) {
//         config.params = { search: debouncedSearchTerm };
//       }

//       const response = await apiClient.get("/employees", config);

//       setEmployees(response.data);
//     } catch (err) {
//       setError(err.response?.data?.message || "Failed to fetch employees.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchEmployees();
//   }, [debouncedSearchTerm]);

//   const openDeleteDialog = (employee) => {
//     setEmployeeToDelete(employee);
//     setIsDeleteDialogOpen(true);
//   };

//   const confirmDelete = async () => {
//     if (!employeeToDelete) return;
//     try {
//       await apiClient.delete(`/employees/${employeeToDelete.id}`);
//       toast.success(`Employee "${employeeToDelete.name}" has been deleted.`);
//       setDebouncedSearchTerm(searchTerm);
//       fetchEmployees();
//     } catch (err) {
//       toast.error(err.response?.data?.message || "Failed to delete employee.");
//     } finally {
//       setIsDeleteDialogOpen(false);
//       setEmployeeToDelete(null);
//     }
//   };

//   if (loading) {
//     return (
//       <div className="flex justify-center items-center h-64">
//         <Spinner />
//       </div>
//     );
//   }

//   if (error) {
//     return (
//       <div className="container mx-auto mt-4">
//         <Alert variant="destructive">
//           <Terminal className="h-4 w-4" />
//           <AlertTitle>Error</AlertTitle>
//           <AlertDescription>{error}</AlertDescription>
//         </Alert>
//       </div>
//     );
//   }

//   return (
//     <>
//       {canRead ? (
//         <div className="container mx-auto">
//           {canCreate && (
//             <div className="flex justify-end items-center mb-4">
//               <Link to="/employees/add">
//                 <Button>
//                   <Plus />
//                   Add New Employee
//                 </Button>
//               </Link>
//             </div>
//           )}
//           <Card>
//             <CardHeader>
//               <CardTitle>All Employees</CardTitle>
//               <div className="relative mt-2">
//                 <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
//                 <Input
//                   type="search"
//                   placeholder="Search by Employee ID, Name , Email or Phone..."
//                   className="w-full pl-8 sm:w-1/3"
//                   value={searchTerm}
//                   onChange={(e) => setSearchTerm(e.target.value)}
//                 />
//               </div>
//             </CardHeader>
//             <CardContent>
//               <Table className="overflow-x-auto">
//                 <TableHeader>
//                   <TableRow className="bg-muted">
//                     <TableHead>SL NO.</TableHead>
//                     <TableHead>Emp ID</TableHead>
//                     <TableHead className="w-[80px]">Picture</TableHead>
//                     <TableHead>Name</TableHead>
//                     <TableHead>Profile</TableHead>
//                     <TableHead>Email</TableHead>
//                     <TableHead>Phone</TableHead>
//                     <TableHead>Joined</TableHead>
//                     <TableHead>Address</TableHead>
//                     <TableHead> Current salary</TableHead>

//                     {(canUpdate || canDelete) && (
//                       <TableHead className="text-center">Actions</TableHead>
//                     )}
//                   </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                   {employees.map((employee, i) => (
//                     <TableRow key={employee.id}>
//                       <TableCell>{i + 1}</TableCell>
//                       <TableCell>{employee.id}</TableCell>
//                       <TableCell>
//                         <Avatar>
//                           <AvatarImage
//                             src={
//                               employee.picture
//                                 ? `${apiBaseUrl}${employee.picture}`
//                                 : ""
//                             }
//                             alt={employee.name}
//                           />
//                           <AvatarFallback>
//                             {employee.name.charAt(0).toUpperCase()}
//                           </AvatarFallback>
//                         </Avatar>
//                       </TableCell>
//                       {/* <TableCell className="font-medium">
//                         {employee.name}
//                       </TableCell> */}
//                       <TableCell>
//                         {employee.name} &nbsp;{" "}
//                         {employee.is_master && <Badge>master</Badge>}
//                       </TableCell>
//                       <TableCell>
//                         <EmployeeHoverCard employee={employee}>
//                           <SquareUser className="cursor-pointer" />
//                         </EmployeeHoverCard>
//                       </TableCell>
//                       <TableCell>{employee.email}</TableCell>
//                       <TableCell>{employee.phone || "N/A"}</TableCell>
//                       <TableCell>{formatDate(employee.joined_at)}</TableCell>
//                       <TableCell>{employee.address || "N/A"}</TableCell>
//                       <TableCell>
//                         {employee.current_salary || "Unavailable"}
//                       </TableCell>

//                       <TableCell className="text-right">
//                         {canUpdate && (
//                           <Link to={`/employees/${employee.id}/edit`}>
//                             <Button
//                               variant="outline"
//                               size="sm"
//                               className="mr-2"
//                             >
//                               <Edit className="h-4 w-4" />
//                             </Button>
//                           </Link>
//                         )}
//                         {canDelete && (
//                           <Button
//                             variant="destructive"
//                             size="sm"
//                             onClick={() => openDeleteDialog(employee)}
//                             disabled={
//                               user.userId === employee.id || employee.is_master
//                             }
//                           >
//                             <Trash className="h-4 w-4" />
//                           </Button>
//                         )}
//                       </TableCell>
//                     </TableRow>
//                   ))}
//                 </TableBody>
//               </Table>
//             </CardContent>
//           </Card>
//         </div>
//       ) : (
//         <AccessDenied />
//       )}

//       <AlertDialog
//         open={isDeleteDialogOpen}
//         onOpenChange={setIsDeleteDialogOpen}
//       >
//         <AlertDialogContent>
//           <AlertDialogHeader>
//             <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
//             <AlertDialogDescription>
//               This action cannot be undone. This will permanently delete the
//               account for{" "}
//               <span className="font-semibold">{employeeToDelete?.name}</span>.
//             </AlertDialogDescription>
//           </AlertDialogHeader>
//           <AlertDialogFooter>
//             <AlertDialogCancel>Cancel</AlertDialogCancel>
//             <AlertDialogAction
//               onClick={confirmDelete}
//               className="bg-destructive hover:bg-destructive/90"
//             >
//               Yes, delete employee
//             </AlertDialogAction>
//           </AlertDialogFooter>
//         </AlertDialogContent>
//       </AlertDialog>
//     </>
//   );
// };

// export default EmployeeManagementPage;



import React, { useState, useEffect, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import apiClient from "@/api/axiosConfig";
import useAuth from "@/hooks/useAuth";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { toast } from "sonner";
import { Plus, Terminal, Search } from "lucide-react";
import { PERMISSIONS } from "@/config/permissions";
import AccessDenied from "@/components/AccessDenied";
import { Spinner } from "@/components/ui/spinner";
import { createColumns } from "@/components/employees/columns";
import { DataTable } from "@/components/DataTable";
import { useDebounce } from "@/hooks/useDebounce"; 
import { useT } from "@/hooks/useT";

const EmployeeManagementPage = () => {
  const [data, setData] = useState([]);
  const [pageCount, setPageCount] = useState(0);
  const [loading, setLoading] = useState(false); 
  const [error, setError] = useState("");
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false);
  const [employeeToDelete, setEmployeeToDelete] = useState(null);
  const [searchTerm, setSearchTerm] = useState("");
  const debouncedSearchTerm = useDebounce(searchTerm, 500); 
  
  const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
  const [sorting, setSorting] = useState([{ id: 'joined_at', desc: true }]); 
  const [refetchTrigger, setRefetchTrigger] = useState(0);

  const { user } = useAuth();
  
  const canRead = user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.READ);
  const canCreate = user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.CREATE);
  const canUpdate = user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.UPDATE);
  const canDelete = user.is_master || user.permissions.includes(PERMISSIONS.EMPLOYEE.DELETE);

  const fetchData = useCallback(async () => {
    if (!canRead) return;
    try {
      setLoading(true);
      const sortParams = sorting[0] ?? { id: 'joined_at', desc: true }; 
      const params = {
        page: pagination.pageIndex + 1,
        pageSize: pagination.pageSize,
        sortBy: sortParams.id,
        sortOrder: sortParams.desc ? 'DESC' : 'ASC',
      };
      if (debouncedSearchTerm) params.search = debouncedSearchTerm;

      const response = await apiClient.get("/employees", { params });
      setData(response.data.data);
      setPageCount(response.data.totalPages);
      setError("");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to fetch employees.");
    } finally {
      setLoading(false);
    }
  }, [pagination, sorting, debouncedSearchTerm, canRead, refetchTrigger]);

  useEffect(() => {
    fetchData();
  }, [fetchData]); 

  const openDeleteDialog = (employee) => {
    setEmployeeToDelete(employee);
    setIsDeleteDialogOpen(true);
  };

  const confirmDelete = async () => {
    if (!employeeToDelete) return;
    try {
      await apiClient.delete(`/employees/${employeeToDelete.id}`);
      toast.success(`Employee "${employeeToDelete.name}" has been deleted.`);
      setRefetchTrigger(c => c + 1);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete employee.");
    } finally {
      setIsDeleteDialogOpen(false);
      setEmployeeToDelete(null);
    }
  };
  const t = useT();

  const columns = useMemo(() => createColumns({ openDeleteDialog, canUpdate, canDelete, currentUser: user, t }), [canUpdate, canDelete, user, t]);

  if (!canRead) return <AccessDenied />;

  return (
    <>
      <div className="container mx-auto">
        {canCreate && (
          <div className="flex justify-end items-center mb-4">
            <Link to="/employees/add"><Button><Plus />Add New Employee</Button></Link>
          </div>
        )}
        <Card>
          <CardHeader>
            <CardTitle>All Employees</CardTitle>
            <div className="relative mt-2">
              <Search className="absolute left-2.5 top-2.5 h-7 w-4 text-muted-foreground" />
              <Input
                type="search"
                placeholder="Search by Name or Email..."
                className="w-full pl-8 sm:w-1/3"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </CardHeader>
          <CardContent>
            {loading ? (
              <div className="flex justify-center items-center h-64"><Spinner /></div>
            ) : error ? (
              <Alert variant="destructive"><Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription></Alert>
            ) : (
              <DataTable
                columns={columns}
                data={data}
                pageCount={pageCount}
                pagination={pagination}
                setPagination={setPagination}
                sorting={sorting}
                setSorting={setSorting}
              />
            )}
          </CardContent>
        </Card>
      </div>
      <AlertDialog open={isDeleteDialogOpen} onOpenChange={setIsDeleteDialogOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
            <AlertDialogDescription>
              This action cannot be undone. This will permanently delete the account for{" "}
              <span className="font-semibold">{employeeToDelete?.name}</span>.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={confirmDelete} className="bg-destructive hover:bg-destructive/90">Yes, delete employee</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default EmployeeManagementPage;
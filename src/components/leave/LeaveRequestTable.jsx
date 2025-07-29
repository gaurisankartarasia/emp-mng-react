// import {
//     Table,
//     TableBody,
//     TableCell,
//     TableHead,
//     TableHeader,
//     TableRow,
// } from "@/components/ui/table";
// import { Badge } from "@/components/ui/badge";
// import { format } from 'date-fns';
// import { PERMISSIONS } from "@/config/permissions";
// import useAuth from "@/hooks/useAuth";

// const LeaveRequestTable = ({ requests, showEmployeeColumn = false, actionSlot }) => {
//     const getStatusVariant = (status) => {
//         switch (status) {
//             case 'approved':
//                 return 'success';
//             case 'rejected':
//                 return 'destructive';
//             default:
//                 return 'secondary';
//         }
//     };
//     const {user} = useAuth()

//     const canUpdate = user.is_master || user.permissions.includes(PERMISSIONS.LEAVE_MANAGEMENT.UPDATE)

//     return (
//         <div className="rounded-md border">
//             <Table>
//                 <TableHeader>
//                     <TableRow>
//                         {showEmployeeColumn && <TableHead>Employee</TableHead>}
//                         <TableHead>Leave Type</TableHead>
//                         <TableHead>Dates</TableHead>
//                         <TableHead>Status</TableHead>
//                         <TableHead>Reason</TableHead>
//                         {canUpdate && <TableHead className="text-right">Actions</TableHead>}
//                     </TableRow>
//                 </TableHeader>
//                 <TableBody>
//                     {requests.length > 0 ? (
//                         requests.map((request) => (
//                             <TableRow key={request.id}>
//                                 {showEmployeeColumn && <TableCell>{request.Employee?.name || 'N/A'}</TableCell>}
//                                 <TableCell>{request.LeaveType?.name || 'N/A'}</TableCell>
//                                 <TableCell>{`${format(new Date(request.start_date), 'dd/MM/yy')} - ${format(new Date(request.end_date), 'dd/MM/yy')}`}</TableCell>
//                                 <TableCell>
//                                     <Badge variant={getStatusVariant(request.status)}>
//                                         {request.status}
//                                     </Badge>
//                                 </TableCell>
//                                 <TableCell className="truncate max-w-[150px]">{request.reason}</TableCell>
//                             {(canUpdate && request.Employee.id !== user.id) &&     <TableCell className="text-right">
//                                      {actionSlot ? actionSlot(request) : null}
//                                 </TableCell>}
//                             </TableRow>
//                         ))
//                     ) : (
//                         <TableRow>
//                             <TableCell colSpan={showEmployeeColumn ? 6 : 5} className="h-24 text-center">
//                                 No leave requests found.
//                             </TableCell>
//                         </TableRow>
//                     )}
//                 </TableBody>
//             </Table>
//         </div>
//     );
// };

// export default LeaveRequestTable;


import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import { PERMISSIONS } from "@/config/permissions";
import useAuth from "@/hooks/useAuth";

const LeaveRequestTable = ({ requests, showEmployeeColumn = false, actionSlot }) => {
    const getStatusVariant = (status) => {
        switch (status) {
            case 'approved':
                return 'success';
            case 'rejected':
                return 'destructive';
            default:
                return 'secondary';
        }
    };
    
    const { user } = useAuth();

    const canManage = user.is_master || user.permissions.includes(PERMISSIONS.LEAVE_MANAGEMENT.UPDATE);

    return (
        <div className="rounded-md border">
            <Table>
                <TableHeader>
                    <TableRow>
                         <TableHead>SL NO</TableHead>
                        {showEmployeeColumn && <TableHead>Employee ID</TableHead>}
                        {showEmployeeColumn && <TableHead>Employee</TableHead>}
                        <TableHead>Leave Type</TableHead>
                        <TableHead>Dates</TableHead>
                        <TableHead>Status</TableHead>
                        <TableHead>Reason</TableHead>
                         <TableHead>Comments</TableHead>
                        {canManage && <TableHead className="text-center">Actions</TableHead>}
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {requests.length > 0 ? (
                        requests.map((request, i) => (
                            <TableRow key={request.id}>
                                <TableCell>{i+1}</TableCell>
                                {showEmployeeColumn && <TableCell>{request.Employee?.id || 'N/A'}</TableCell>}
                                {showEmployeeColumn && <TableCell>{request.Employee?.name || 'N/A'}</TableCell>}
                                <TableCell>{request.LeaveType?.name || 'N/A'}</TableCell>
                                <TableCell>{`${format(new Date(request.start_date), 'dd/MM/yy')} - ${format(new Date(request.end_date), 'dd/MM/yy')}`}</TableCell>
                                <TableCell>
                                    <Badge variant={getStatusVariant(request.status)}>
                                        {request.status}
                                    </Badge>
                                </TableCell>
                                <TableCell className="truncate max-w-[150px]">{request.reason || "Not given"}</TableCell>
                                 <TableCell className="truncate max-w-[150px]">{request.manager_comments || "No comments"}</TableCell>
                                {canManage && (
                                    <TableCell className="text-center">
                                        {request.employee_id !== user.id && actionSlot ? actionSlot(request) : null}
                                    </TableCell>
                                )}
                            </TableRow>
                        ))
                    ) : (
                        <TableRow>
                            <TableCell colSpan={canManage ? (showEmployeeColumn ? 6 : 5) : (showEmployeeColumn ? 5 : 4)} className="h-24 text-center">
                                No leave requests found.
                            </TableCell>
                        </TableRow>
                    )}
                </TableBody>
            </Table>
        </div>
    );
};

export default LeaveRequestTable;
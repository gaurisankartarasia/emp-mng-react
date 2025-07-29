// import React, { useState, useEffect, useCallback } from 'react';
// import {
//     Card,
//     CardContent,
//     CardDescription,
//     CardHeader,
//     CardTitle,
// } from "@/components/ui/card";
// import { toast } from 'sonner';
// import LeaveRequestTable from '@/components/leave/LeaveRequestTable';
// import LeaveRequestForm from '@/components/leave/LeaveRequestForm';
// import { getMyLeaveRequests, getLeaveConfig } from '@/services/leave-service';

// const MyLeavePage = () => {
//     const [requests, setRequests] = useState([]);
//     const [leaveTypes, setLeaveTypes] = useState([]);
//     const [monthlyAllowance, setMonthlyAllowance] = useState(0);
//         const [approvedDays, setApprovedDays] = useState(0);

//     const [isLoading, setIsLoading] = useState(true);

//     const fetchData = useCallback(async () => {
//         try {
//             setIsLoading(true);
//             const [reqData, configData] = await Promise.all([
//                 getMyLeaveRequests(),
//                 getLeaveConfig(),
//             ]);
//             setRequests(reqData);
//             setLeaveTypes(configData.leaveTypes);
//             setMonthlyAllowance(configData.monthlyAllowance);
//             setApprovedDays(configData.approvedLeaveDaysThisMonth);
//         } catch (error) {
//             toast.error("error fetching data", error);
//         } finally {
//             setIsLoading(false);
//         }
//     }, []);

//     useEffect(() => {
//         fetchData();
//     }, [fetchData]);


//     return (
//         <Card className="m-4">
//             <CardHeader>
//                 <div className="flex justify-between items-start">
//                     <div>
//                         <CardTitle>My Leave Requests</CardTitle>
//                     <CardDescription className="text-sm pt-2">
//                           Default leave allowance: <span className="font-bold">{monthlyAllowance}</span> Days
//                           <span className="mx-2">|</span>
//                           Taken this month: <span className="font-bold text-red-600">{approvedDays}</span> Days

//                         </CardDescription>
//                     </div>
//                     <LeaveRequestForm leaveTypes={leaveTypes} onFormSubmit={fetchData} />
//                 </div>
//             </CardHeader>
//             <CardContent>
//                 {isLoading ? (
//                     <p className="text-center">Loading your requests...</p>
//                 ) : (
//                     <LeaveRequestTable requests={requests} showEmployeeColumn={false} />
//                 )}
//             </CardContent>
//         </Card>
//     );
// };

// export default MyLeavePage;


import React, { useState, useEffect, useCallback } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { getMyLeaveRequests, getLeaveConfig } from '@/services/leave-service';
import { toast } from 'sonner';
import LeaveRequestTable from '@/components/leave/LeaveRequestTable';
import LeaveRequestForm from '@/components/leave/LeaveRequestForm';
import LeaveBalanceCard from '@/components/leave/LeaveBalanceCard'; 

const MyLeavePage = () => {
    const [requests, setRequests] = useState([]);
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [balanceData, setBalanceData] = useState(null); 
    const [isLoading, setIsLoading] = useState(true);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const [reqData, configData] = await Promise.all([
                getMyLeaveRequests(),
                getLeaveConfig(),
            ]);
            setRequests(reqData);
            setLeaveTypes(configData.leaveTypes);
            setBalanceData({ 
                annualBalance: configData.annualBalance,
                balanceDetails: configData.balanceDetails,
                totalUnpaidDaysTaken: configData.totalUnpaidDaysTaken, // <-- Capture the new value
            });
        } catch (error) {
            toast.error("Error fetching data", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    return (
        <div className="p-4 space-y-4">
            {isLoading ? <p>Loading balance...</p> : <LeaveBalanceCard {...balanceData} />}

            <Card>
                <CardHeader>
                    <div className="flex justify-between items-center">
                        <CardTitle>My Leave History</CardTitle>
                        <LeaveRequestForm leaveTypes={leaveTypes} onFormSubmit={fetchData} />
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center">Loading your requests...</p>
                    ) : (
                        <LeaveRequestTable requests={requests} showEmployeeColumn={false} />
                    )}
                </CardContent>
            </Card>
        </div>
    );
};

export default MyLeavePage;
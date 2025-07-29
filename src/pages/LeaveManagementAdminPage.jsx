import React, { useState, useEffect, useCallback } from 'react';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { getManagedLeaveRequests } from '@/services/leave-service';

import LeaveRequestTable from '@/components/leave/LeaveRequestTable';
import UpdateRequestDialog from '@/components/leave/UpdateRequestDialog';

const LeaveManagementAdminPage = () => {
    const [requests, setRequests] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedRequest, setSelectedRequest] = useState(null);

    const fetchData = useCallback(async () => {
        try {
            setIsLoading(true);
            const reqData = await getManagedLeaveRequests();
            setRequests(reqData);
        } catch (error) {
            toast.error("Error fetching data", error);
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const handleActionClick = (request) => {
        setSelectedRequest(request);
    };

    const handleDialogClose = () => {
        setSelectedRequest(null);
    };

  const renderActionSlot = (request) => (
        <Button 
            variant="outline" 
            size="sm" 
            onClick={() => handleActionClick(request)}
            disabled={request.status !== 'pending'}
        >
            Manage
        </Button>
    );

    return (
        <>
            <Card className="m-4">
                <CardHeader>
                    <CardTitle>Leave Management</CardTitle>
                    <CardDescription>
                        View and manage all employee leave requests.
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <p className="text-center">Loading requests...</p>
                    ) : (
                        <LeaveRequestTable 
                            requests={requests} 
                            showEmployeeColumn={true} 
                            actionSlot={renderActionSlot} 
                        />
                    )}
                </CardContent>
            </Card>

            {selectedRequest && (
                <UpdateRequestDialog
                    request={selectedRequest}
                    open={!!selectedRequest}
                    onOpenChange={handleDialogClose}
                    onUpdateSuccess={fetchData}
                />
            )}
        </>
    );
};

export default LeaveManagementAdminPage;
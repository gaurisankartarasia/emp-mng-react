import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

import { getTodaysAttendance, checkIn, checkOut } from '@/services/attendance-service';

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Clock, LogIn, LogOut } from 'lucide-react';
import { formatDateTime } from '@/utils/dateFormat';

const DailyAttendanceWidget = () => {
    const [attendance, setAttendance] = useState(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [showCheckoutConfirm, setShowCheckoutConfirm] = useState(false);

    const fetchStatus = async () => {
        try {
            const data = await getTodaysAttendance();
            setAttendance(data);
        } catch (error) {
            toast.error("Could not fetch attendance status.", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    };

    useEffect(() => {
        fetchStatus();
    }, []);

    const handleCheckIn = async () => {
        setIsSubmitting(true);
        try {
            await checkIn();
            toast.success("Checked in successfully!");
            fetchStatus(); 
        } catch (error) {
            toast.error("Check-in failed.", { description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleCheckOut = async () => {
        setIsSubmitting(true);
        setShowCheckoutConfirm(false);
        try {
            await checkOut();
            toast.success("Checked out successfully!");
            fetchStatus(); 
        } catch (error) {
            toast.error("Check-out failed.", { description: error.message });
        } finally {
            setIsSubmitting(false);
        }
    };
    
    const renderStatus = () => {
        if (isLoading) {
            return <p className="text-sm text-muted-foreground">Loading status...</p>;
        }

        if (!attendance?.check_in_time) {
            return (
                <div>
                    <Alert variant="warning" ><AlertDescription>You have not checked in today.</AlertDescription></Alert>
                    <Button onClick={handleCheckIn} disabled={isSubmitting} className="w-full mt-4">
                        <LogIn className="mr-2 h-4 w-4" /> {isSubmitting ? 'Checking In...' : 'Check In'}
                    </Button>
                </div>
            );
        }

        if (attendance.check_in_time && !attendance.check_out_time) {
            return (
                 <div>
                    <Alert variant="success"><AlertDescription>Checked in at: {formatDateTime(attendance.check_in_time)}</AlertDescription></Alert>
                    <Button onClick={() => setShowCheckoutConfirm(true)} disabled={isSubmitting} className="w-full mt-4">
                        <LogOut className="mr-2 h-4 w-4" /> {isSubmitting ? 'Checking Out...' : 'Check Out'}
                    </Button>
                </div>
            );
        }

        if (attendance.check_in_time && attendance.check_out_time) {
            return (
                <Alert>
                    <AlertTitle>Attendance Logged</AlertTitle>
                    <AlertDescription>
                        Checked in at {formatDateTime(attendance.check_in_time)} and checked out at {formatDateTime(attendance.check_out_time)}.
                    </AlertDescription>
                </Alert>
            );
        }
        
        return null;
    };

    return (
        <>
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Clock className="h-5 w-5" />
                        Today's Attendance
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    {renderStatus()}
                </CardContent>
            </Card>

            <AlertDialog open={showCheckoutConfirm} onOpenChange={setShowCheckoutConfirm}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you sure you want to check out?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action will log your check-out time for the day. You will not be able to check in again today.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleCheckOut}>Confirm Check Out</AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};

export default DailyAttendanceWidget;


import React, { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';

// --- Services ---
import { getLeaveConfig, getCalendarData } from '@/services/leave-service';

// --- UI Components ---
import LeaveBalanceIndicator from '@/components/leave/LeaveBalanceIndicator';
import InteractiveLeaveCalendar from '@/components/leave/InteractiveLeaveCalendar';
import LeaveSummaryPanel from '@/components/leave/LeaveSummaryPanel';

import { Spinner } from '@/components/ui/spinner';
import {
  Alert,
  AlertDescription,
  AlertTitle,
} from "@/components/ui/alert"

const RequestLeavePage = () => {
    // --- State Management ---
    const [balanceData, setBalanceData] = useState(null);
    const [calendarData, setCalendarData] = useState({ holidays: [], existingLeaves: [] });
    const [leaveTypes, setLeaveTypes] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [selectedDates, setSelectedDates] = useState({ from: undefined, to: undefined });
const [formError, setFormError] = useState(null);

    // --- Data Fetching ---
    const fetchData = useCallback(async () => {
        try {
            // No need to set isLoading(true) here; it's set on initial mount
            const [config, calData] = await Promise.all([
                getLeaveConfig(),
                getCalendarData()
            ]);
            
            setBalanceData({
                annualBalance: config.annualBalance,
                balanceDetails: config.balanceDetails,
                unpaidLeaveBalance: config.unpaidLeaveBalance,
            });
            setCalendarData(calData);
            setLeaveTypes(config.leaveTypes);

        } catch (error) {
            toast.error("Failed to load leave data", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    if (isLoading) {
        return <div className="flex items-center justify-center h-96"> <Spinner/> </div>;
    }

    return (
        <div className="p-4 lg:p-6 flex flex-col h-full">
            <header className="mb-6">
                <h1 className="text-2xl font-bold tracking-tight">New Leave Request</h1>
                <p className="text-muted-foreground">Visually select your leave dates below.</p>
                <LeaveBalanceIndicator 
    balanceDetails={balanceData.balanceDetails} 
    unpaidLeaveBalance={balanceData.unpaidLeaveBalance} 
    annualBalance={balanceData.annualBalance}
/>
            </header>

            {formError && (
    <div className="mb-4">
        <Alert variant="warning">
            <AlertTitle>Failed</AlertTitle>
            <AlertDescription>{formError}</AlertDescription>
        </Alert>
    </div>
)}

            
            <div className="flex-grow grid grid-cols-1 lg:grid-cols-3 gap-6 min-h-0">
                <main className="lg:col-span-2">
                    <InteractiveLeaveCalendar
                        holidays={calendarData.holidays}
                        existingLeaves={calendarData.existingLeaves}
                        selectedDates={selectedDates}
                        setSelectedDates={setSelectedDates}
                    />
                </main>

                <aside>
                    <LeaveSummaryPanel
                        selectedDates={selectedDates}
                        holidays={calendarData.holidays}
                        leaveTypes={leaveTypes}
                        onFormSubmit={() => {
                            // After a successful submission, clear selection and refetch all data
                            setSelectedDates({ from: undefined, to: undefined });
                            fetchData();
                        }}
                        onError={(msg) => setFormError(msg)}
                    />
                </aside>
            </div>
        </div>
    );
};

export default RequestLeavePage;
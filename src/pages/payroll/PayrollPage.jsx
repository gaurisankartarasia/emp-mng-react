

import React, {useState, useEffect, useMemo } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';

import { getRecentReports, initiatePayrollGeneration, getReportStatus, getPayrollReport } from '@/services/payroll-service';
import { DataTable } from '@/components/DataTable';
import { columns } from '@/components/payroll/ReportColumns'; 
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Spinner } from '@/components/ui/spinner';
import { Eye } from 'lucide-react';

const PayrollPage = () => {
    const [recentReports, setRecentReports] = useState([]);
    const [activeReport, setActiveReport] = useState(null); 
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const { handleSubmit, setValue } = useForm();
    
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

 const fetchRecent = async () => {
            try {
                const reports = await getRecentReports();
                setRecentReports(reports);
            } catch (error) {
                toast.error("Failed to load recent reports.", { description: error.message });
            }
        };

    useEffect(() => {
       
        fetchRecent();
    }, []);

    useEffect(() => {
        if (isPolling && activeReport?.id) {
            const intervalId = setInterval(async () => {
                try {
                    const statusData = await getReportStatus(activeReport.id);
                    if (statusData.status === 'completed') {
                        setIsPolling(false);
                        clearInterval(intervalId);
                        toast.success(`Payroll for ${activeReport.month}/${activeReport.year} is ready!`);
                        const finalReport = await getPayrollReport(activeReport.id);
                        setActiveReport(finalReport);
                    } else if (statusData.status === 'failed') {
                        setIsPolling(false);
                        clearInterval(intervalId);
                        toast.error(`Payroll generation failed.`, { description: statusData.error_log });
                        setActiveReport(statusData);
                    }
                } catch (error) {
                    setIsPolling(false);
                    clearInterval(intervalId);
                    toast.error("Failed to get report status.");
                }
            }, 5000); 

            return () => clearInterval(intervalId); 
        }
    }, [isPolling, activeReport]);

    const handleGenerate = async (data) => {
        setIsGenerating(true);
        setActiveReport(null);
        try {
            const result = await initiatePayrollGeneration(data);
            toast.info("Payroll generation started.", { description: "The report will appear below when ready." });
            setActiveReport({ id: result.reportId, status: 'processing', ...data });
            setIsPolling(true);
        } catch (error) {
            toast.error("Failed to initiate generation.", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };
    
    const handleViewReport = async (reportId) => {
        try {
            const reportData = await getPayrollReport(reportId);
            setActiveReport(reportData);
        } catch (error) {
            toast.error("Failed to load report.", { description: error.message });
        }
    };

    const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
    const currentYear = new Date().getFullYear();
    const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    
        const tableData = useMemo(() => {
        if (!activeReport?.SalarySlips) {
            return [];
        }

        return activeReport.SalarySlips.map(slip => {

            const breakdown = JSON.parse(slip.breakdown_data || '{}');



            return {
                employee: {
                    id: slip.employee_id,
                    name: slip.employee_name
                },
                salaryDetails: {
                    grossSalary: slip.gross_salary,
                    deductions: slip.deductions,
                    netSalary: slip.net_salary
                },
                attendanceBreakdown: {
                    presentDays: breakdown.presentDays,
                    paidLeaveDays: breakdown.paidLeaveDays,
                    unpaidDays: breakdown.unpaidDays,
                    totalPayableDays: slip.total_payable_days 
                }
            };
        });

    }, [activeReport]);
    const tableColumns = useMemo(() => columns, []);

    const getStatusBadge = (status) => {
        if (status === 'completed') return <Badge variant="success">Completed</Badge>;
        if (status === 'processing') return <Badge variant="secondary">Processing...</Badge>;
        if (status === 'failed') return <Badge variant="destructive">Failed</Badge>;
        return null;
    };

    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Generate Monthly Payroll</CardTitle>
                    <CardDescription>Select a pay period to generate a salary report for all active employees.</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(handleGenerate)} className="flex items-end gap-4">
                        <div className="flex-1"><Label>Month</Label><Select onValueChange={(v) => setValue('month', v)} required><SelectTrigger><SelectValue placeholder="Select month..." /></SelectTrigger><SelectContent>{months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}</SelectContent></Select></div>
                        <div className="flex-1"><Label>Year</Label><Select onValueChange={(v) => setValue('year', v)} required><SelectTrigger><SelectValue placeholder="Select year..." /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select></div>
                        <Button type="submit" disabled={isGenerating || isPolling}>
                            {isPolling ? 'Processing...' : isGenerating ? 'Initiating...' : 'Generate Report'}
                        </Button>
                    </form>
                </CardContent>
            </Card>

           

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
                <Card className="md:col-span-1">
                    <CardHeader  className="flex items-center justify-between" >

                        <CardTitle>Recently Generated Reports</CardTitle>
                     <Button size="sm" variant="secondary" onClick={fetchRecent} >Refresh</Button>
                   
                     
                     </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {recentReports.map(report => (
                                <li key={report.id} className="flex justify-between items-center p-2">
                                    <span>{report.month}/{report.year}</span>
                                    {getStatusBadge(report.status)}
                                    <Button variant="outline" size="sm" onClick={() => handleViewReport(report.id)} disabled={report.status !== 'completed'}> <Eye/> View</Button>
                                </li>
                            ))}
                        </ul>
                    </CardContent>
                </Card>
                
                <div className="md:col-span-3">
                    {activeReport && activeReport.status === 'completed' && (
                        <Card>
                            <CardHeader><CardTitle>Payroll Report for {activeReport.month}/{activeReport.year}</CardTitle></CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={tableColumns}
                                    data={tableData}
                                    pageCount={Math.ceil(tableData.length / pagination.pageSize)}
                                    pagination={pagination}
                                    setPagination={setPagination}
                                />
                            </CardContent>
                        </Card>
                    )}
                    {isPolling && (
                        <div className="h-full flex flex-col items-center justify-center p-8 border rounded-lg">
                            <Spinner  />
                            <p className="font-semibold">Payroll generation in progress...</p>
                            <p className="text-sm text-muted-foreground">This may take a moment. The report will appear here automatically when ready.</p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default PayrollPage;


// import React, {useState, useEffect, useMemo } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';

// import { getRecentReports, initiatePayrollGeneration, getReportStatus, getPayrollReport } from '@/services/payroll-service';
// import { DataTable } from '@/components/DataTable';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Spinner } from '@/components/ui/spinner';
// import { Eye , ReceiptText} from 'lucide-react';
// import SalarySlipDetailsDialog from '@/components/payroll/SalarySlipDetailsDialog';


// const PayrollPage = () => {
//     const [recentReports, setRecentReports] = useState([]);
//     const [activeReport, setActiveReport] = useState(null); 
//     const [isGenerating, setIsGenerating] = useState(false);
//     const [isPolling, setIsPolling] = useState(false);
//     const { handleSubmit, setValue } = useForm();
//         const [selectedSlip, setSelectedSlip] = useState(null);

    
//     const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });

//  const fetchRecent = async () => {
//             try {
//                 const reports = await getRecentReports();
//                 setRecentReports(reports);
//             } catch (error) {
//                 toast.error("Failed to load recent reports.", { description: error.message });
//             }
//         };

//     useEffect(() => {
       
//         fetchRecent();
//     }, []);

//     useEffect(() => {
//         if (isPolling && activeReport?.id) {
//             const intervalId = setInterval(async () => {
//                 try {
//                     const statusData = await getReportStatus(activeReport.id);
//                     if (statusData.status === 'completed') {
//                         setIsPolling(false);
//                         clearInterval(intervalId);
//                         toast.success(`Payroll for ${activeReport.month}/${activeReport.year} is ready!`);
//                         const finalReport = await getPayrollReport(activeReport.id);
//                         setActiveReport(finalReport);
//                     } else if (statusData.status === 'failed') {
//                         setIsPolling(false);
//                         clearInterval(intervalId);
//                         toast.error(`Payroll generation failed.`, { description: statusData.error_log });
//                         setActiveReport(statusData);
//                     }
//                 } catch (error) {
//                     setIsPolling(false);
//                     clearInterval(intervalId);
//                     toast.error("Failed to get report status.", error);
//                 }
//             }, 5000); 

//             return () => clearInterval(intervalId); 
//         }
//     }, [isPolling, activeReport]);

//     const handleGenerate = async (data) => {
//         setIsGenerating(true);
//         setActiveReport(null);
//         try {
//             const result = await initiatePayrollGeneration(data);
//             toast.info("Payroll generation started.", { description: "The report will appear below when ready." });
//             setActiveReport({ id: result.reportId, status: 'processing', ...data });
//             setIsPolling(true);
//         } catch (error) {
//             toast.error("Failed to initiate generation.", { description: error.message });
//         } finally {
//             setIsGenerating(false);
//         }
//     };
    
//     const handleViewReport = async (reportId) => {
//         try {
//             const reportData = await getPayrollReport(reportId);
//             setActiveReport(reportData);
//         } catch (error) {
//             toast.error("Failed to load report.", { description: error.message });
//         }
//     };

//     const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
//     const currentYear = new Date().getFullYear();
//     const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    
//      const tableData = useMemo(() => activeReport?.SalarySlips || [], [activeReport]);



//      const tableColumns = useMemo(() => [
//         { id: 'sl_no', header: "SL NO", cell: ({ row, table }) => {
//                         const pageIndex = table.getState().pagination.pageIndex;
//             const pageSize = table.getState().pagination.pageSize;
            
//             const serialNumber = pageIndex * pageSize + row.index + 1;
            
//             return <span>{serialNumber}</span>; 
//          } },
//           { accessorKey: "employee_id", header: "Employee ID" },
//         { accessorKey: "employee_name", header: "Employee Name" },
//         { accessorKey: "gross_earnings", header: "Gross Earnings" },
//         { accessorKey: "total_payable_days", header: "Payable Days" },
//         { accessorKey: "total_deductions", header: "Total Deductions" },
//         { accessorKey: "net_salary", header: "Net Salary" },
//         {
//             id: 'actions',
//             header: "Details",
//             cell: ({ row }) => {
//                 const slip = row.original;
//                 return <Button variant="ghost" size="icon" onClick={() => setSelectedSlip(slip)}><ReceiptText/></Button>
//             }
//         }
//     ], []);

//     const getStatusBadge = (status) => {
//         if (status === 'completed') return <Badge variant="success">Completed</Badge>;
//         if (status === 'processing') return <Badge variant="secondary">Processing...</Badge>;
//         if (status === 'failed') return <Badge variant="destructive">Failed</Badge>;
//         return null;
//     };

//     return (
//         <div>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Generate Monthly Payroll</CardTitle>
//                     <CardDescription>Select a pay period to generate a salary report for all active employees.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit(handleGenerate)} className="flex items-end gap-4">
//                         <div className="flex-1"><Label>Month</Label><Select onValueChange={(v) => setValue('month', v)} required><SelectTrigger><SelectValue placeholder="Select month..." /></SelectTrigger><SelectContent>{months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}</SelectContent></Select></div>
//                         <div className="flex-1"><Label>Year</Label><Select onValueChange={(v) => setValue('year', v)} required><SelectTrigger><SelectValue placeholder="Select year..." /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select></div>
//                         <Button type="submit" disabled={isGenerating || isPolling}>
//                             {isPolling ? 'Processing...' : isGenerating ? 'Initiating...' : 'Generate Report'}
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>

           

//             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
//                 <Card className="md:col-span-1">
//                     <CardHeader  className="flex items-center justify-between" >

//                         <CardTitle>Recently Generated Reports</CardTitle>
//                      <Button size="sm" variant="secondary" onClick={fetchRecent} >Refresh</Button>
                   
                     
//                      </CardHeader>
               
//                     <CardContent>
//   <ul className="space-y-2">
//     {recentReports.length > 0 ? (
//       recentReports.map(report => (
//         <li key={report.id} className="flex justify-between items-center p-2">
//           <span>{report.month}/{report.year}</span>
//           {getStatusBadge(report.status)}
//           <Button
//             variant="outline"
//             size="sm"
//             onClick={() => handleViewReport(report.id)}
//             disabled={report.status !== 'completed'}
//             aria-label={`View report for ${report.month}/${report.year}`}
//           >
//             <Eye /> View
//           </Button>
//         </li>
//       ))
//     ) : (
//       <li className="p-2 text-gray-500">No reports available</li>
//     )}
//   </ul>
// </CardContent>
//                 </Card>
                
//                 <div className="md:col-span-3">
//                     {activeReport && activeReport.status === 'completed' && (
//                         <Card>
//                             <CardHeader><CardTitle>Payroll Report for {activeReport.month}/{activeReport.year}</CardTitle></CardHeader>
//                             <CardContent>
//                                 <DataTable
//                                     columns={tableColumns}
//                                     data={tableData}
//                                     pageCount={Math.ceil(tableData.length / pagination.pageSize)}
//                                     pagination={pagination}
//                                     setPagination={setPagination}
//                                 />
//                             </CardContent>
//                         </Card>
//                     )}
//                     {isPolling && (
//                         <div className="h-full flex flex-col items-center justify-center p-8 border rounded-lg">
//                             <Spinner  />
//                             <p className="font-semibold">Payroll generation in progress...</p>
//                             <p className="text-sm text-muted-foreground">This may take a moment. The report will appear here automatically when ready.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>
//                <SalarySlipDetailsDialog
//                 slip={selectedSlip}
//                 open={!!selectedSlip}
//                 onOpenChange={(isOpen) => {
//                     if (!isOpen) {
//                         setSelectedSlip(null); 
//                     }
//                 }}
//             />
//         </div>
//     );
// };

// export default PayrollPage;



// import React, { useState, useEffect, useMemo } from 'react';
// import { useForm } from 'react-hook-form';
// import { toast } from 'sonner';

// import { getRecentReports, initiatePayrollGeneration, getReportStatus, getPayrollReport, getPayrollPreview } from '@/services/payroll-service';
// import { DataTable } from '@/components/DataTable';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
// import { Button } from "@/components/ui/button";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Label } from "@/components/ui/label";
// import { Badge } from "@/components/ui/badge";
// import { Spinner } from "@/components/ui/spinner";
// import { Eye, ReceiptText } from 'lucide-react';
// import SalarySlipDetailsDialog from '@/components/payroll/SalarySlipDetailsDialog';

// const PayrollPage = () => {
//     const [previewData, setPreviewData] = useState(null);
//     const [isPreviewLoading, setIsPreviewLoading] = useState(false);
//     const [payPeriod, setPayPeriod] = useState(null);

//     const [recentReports, setRecentReports] = useState([]);
//     const [activeReport, setActiveReport] = useState(null); 
//     const [isGenerating, setIsGenerating] = useState(false);
//     const [isPolling, setIsPolling] = useState(false);
//     const { handleSubmit, setValue } = useForm();
//     const [selectedSlip, setSelectedSlip] = useState(null);

//     const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 10 });
//     const [previewPagination, setPreviewPagination] = useState({ pageIndex: 0, pageSize: 10 });

//     const fetchRecent = async () => {
//         try {
//             const reports = await getRecentReports();
//             setRecentReports(reports);
//         } catch (error) {
//             toast.error("Failed to load recent reports.", { description: error.message });
//         }
//     };

//     useEffect(() => {
//         fetchRecent();
//     }, []);

//     useEffect(() => {
//         if (isPolling && activeReport?.id) {
//             const intervalId = setInterval(async () => {
//                 try {
//                     const statusData = await getReportStatus(activeReport.id);
//                     if (statusData.status === 'completed') {
//                         setIsPolling(false);
//                         clearInterval(intervalId);
//                         toast.success(`Payroll for ${activeReport.month}/${activeReport.year} is ready!`);
//                         const finalReport = await getPayrollReport(activeReport.id);
//                         setActiveReport(finalReport);
//                     } else if (statusData.status === 'failed') {
//                         setIsPolling(false);
//                         clearInterval(intervalId);
//                         toast.error(`Payroll generation failed.`, { description: statusData.error_log });
//                         setActiveReport(statusData);
//                     }
//                 } catch (error) {
//                     setIsPolling(false);
//                     clearInterval(intervalId);
//                     toast.error("Failed to get report status.", { description: error.message });
//                 }
//             }, 5000); 

//             return () => clearInterval(intervalId); 
//         }
//     }, [isPolling, activeReport]);

//     const handlePreview = async (data) => {
//         setIsPreviewLoading(true);
//         setPreviewData(null);
//         setActiveReport(null);
//         setPayPeriod(data);
//         try {
//             const previewResult = await getPayrollPreview(data);
//             setPreviewData(previewResult);
//         } catch (error) {
//             toast.error("Failed to generate preview.", { description: error.message });
//         } finally {
//             setIsPreviewLoading(false);
//         }
//     };
    
//     const handleConfirmGeneration = async () => {
//         if (!payPeriod) return;
//         setIsGenerating(true);
//         setPreviewData(null);
//         try {
//             const result = await initiatePayrollGeneration(payPeriod);
//             toast.info("Payroll generation started.", { description: "The report will appear below when ready." });
//             setActiveReport({ id: result.reportId, status: 'processing', ...payPeriod });
//             setIsPolling(true);
//         } catch (error) {
//             toast.error("Failed to initiate generation.", { description: error.message });
//         } finally {
//             setIsGenerating(false);
//         }
//     };

//     const handleViewReport = async (reportId) => {
//         setPreviewData(null);
//         try {
//             const reportData = await getPayrollReport(reportId);
//             setActiveReport(reportData);
//         } catch (error) {
//             toast.error("Failed to load report.", { description: error.message });
//         }
//     };

//     const months = Array.from({ length: 12 }, (_, i) => ({ value: i + 1, label: new Date(0, i).toLocaleString('default', { month: 'long' }) }));
//     const currentYear = new Date().getFullYear();
//     const years = Array.from({ length: 5 }, (_, i) => currentYear - i);
    
//     const tableData = useMemo(() => activeReport?.SalarySlips || [], [activeReport]);

//     const previewTableColumns = useMemo(() => [
//         { accessorKey: "employee_name", header: "Employee Name" },
//         { accessorKey: "attendance_summary.present_days", header: "Present" },
//         { accessorKey: "attendance_summary.paid_leave_days", header: "Paid Leave" },
//         { accessorKey: "attendance_summary.unpaid_leave_days", header: "Unpaid Leave" },
//         { 
//             id: "structure_details",
//             header: "Salary Structure",
//             cell: ({ row }) => {
//                 const details = row.original.structure_details;
//                 if (!details || details.length === 0) {
//                     return <Badge variant="destructive">Not Defined</Badge>;
//                 }
//                 return (
//                     <div className="text-xs font-mono space-y-1">
//                         {details.map(d => (
//                             <div key={d.component_name} className="flex justify-between items-center">
//                                 <span className="text-muted-foreground mr-2">{d.component_name}:</span>
//                                 <span className="font-semibold text-right">{d.value} ({d.is_days_based})</span>
//                             </div>
//                         ))}
//                     </div>
//                 );
//             }
//         },
//     ], []);
    
//     const reportTableColumns = useMemo(() => [
//         { id: 'sl_no', header: "SL NO", cell: ({ row, table }) => <span>{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1}</span> },
//         { accessorKey: "employee_id", header: "EID" },
//         { accessorKey: "employee_name", header: "Name" },
//         { accessorKey: "net_salary", header: "Net Salary" },
//         { id: 'actions', header: "Slip", cell: ({ row }) => <Button variant="ghost" size="icon" onClick={() => setSelectedSlip(row.original)}><ReceiptText/></Button> }
//     ], []);

//     const getStatusBadge = (status) => {
//         if (status === 'completed') return <Badge variant="success">Completed</Badge>;
//         if (status === 'processing') return <Badge variant="secondary">Processing...</Badge>;
//         if (status === 'failed') return <Badge variant="destructive">Failed</Badge>;
//         return null;
//     };

//     return (
//         <div>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Generate Monthly Payroll</CardTitle>
//                     <CardDescription>Select a pay period to preview the data before final generation.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <form onSubmit={handleSubmit(handlePreview)} className="flex items-end gap-4">
//                         <div className="flex-1"><Label>Month</Label><Select onValueChange={(v) => setValue('month', v)} required><SelectTrigger><SelectValue placeholder="Select month..." /></SelectTrigger><SelectContent>{months.map(m => <SelectItem key={m.value} value={String(m.value)}>{m.label}</SelectItem>)}</SelectContent></Select></div>
//                         <div className="flex-1"><Label>Year</Label><Select onValueChange={(v) => setValue('year', v)} required><SelectTrigger><SelectValue placeholder="Select year..." /></SelectTrigger><SelectContent>{years.map(y => <SelectItem key={y} value={String(y)}>{y}</SelectItem>)}</SelectContent></Select></div>
//                         <Button type="submit" disabled={isPreviewLoading || isPolling}>
//                             {isPreviewLoading ? 'Loading Preview...' : 'Preview Payroll'}
//                         </Button>
//                     </form>
//                 </CardContent>
//             </Card>

//             {previewData && (
//                 <Card className="mt-4">
//                     <CardHeader>
//                         <div className="flex justify-between items-center">
//                             <div>
//                                 <CardTitle>Payroll Preview for {payPeriod.month}/{payPeriod.year}</CardTitle>
//                                 <CardDescription>Verify employee data before confirming. This is not the final report.</CardDescription>
//                             </div>
//                             <div className="flex gap-2">
//                                 <Button variant="outline" onClick={() => setPreviewData(null)}>Cancel</Button>
//                                 <Button onClick={handleConfirmGeneration} disabled={isGenerating || isPolling}>
//                                      {isPolling ? 'Processing...' : isGenerating ? 'Initiating...' : 'Confirm & Generate'}
//                                 </Button>
//                             </div>
//                         </div>
//                     </CardHeader>
//                     <CardContent>
//                         <DataTable
//                             columns={previewTableColumns}
//                             data={previewData}
//                             pageCount={Math.ceil(previewData.length / previewPagination.pageSize)}
//                             pagination={previewPagination}
//                             setPagination={setPreviewPagination}
//                         />
//                     </CardContent>
//                 </Card>
//             )}

//             <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-4">
//                 <Card className="xl:col-span-1">
//                     <CardHeader className="flex flex-row items-center justify-between">
//                         <CardTitle>Recent Reports</CardTitle>
//                         <Button size="sm" variant="secondary" onClick={fetchRecent}>Refresh</Button>
//                     </CardHeader>
//                     <CardContent>
//                         <ul className="space-y-2">
//                             {recentReports.length > 0 ? (
//                                 recentReports.map(report => (
//                                     <li key={report.id} className="flex justify-between items-center p-2">
//                                         <span>{report.month}/{report.year}</span>
//                                         {getStatusBadge(report.status)}
//                                         <Button variant="outline" size="sm" onClick={() => handleViewReport(report.id)} disabled={report.status !== 'completed'}>
//                                             <Eye />
//                                         </Button>
//                                     </li>
//                                 ))
//                             ) : (
//                                 <li className="p-2 text-gray-500">No reports available</li>
//                             )}
//                         </ul>
//                     </CardContent>
//                 </Card>
                
//                 <div className="xl:col-span-3">
//                     {activeReport && activeReport.status === 'completed' && (
//                         <Card>
//                             <CardHeader><CardTitle>Payroll Report for {activeReport.month}/{activeReport.year}</CardTitle></CardHeader>
//                             <CardContent>
//                                 <DataTable
//                                     columns={reportTableColumns}
//                                     data={tableData}
//                                     pageCount={Math.ceil(tableData.length / pagination.pageSize)}
//                                     pagination={pagination}
//                                     setPagination={setPagination}
//                                 />
//                             </CardContent>
//                         </Card>
//                     )}
//                     {(isPolling || isGenerating) && (
//                         <div className="h-full flex flex-col items-center justify-center p-8 border rounded-lg">
//                             <Spinner />
//                             <p className="font-semibold">Payroll generation in progress...</p>
//                             <p className="text-sm text-muted-foreground">This may take a moment. The report will appear here automatically when ready.</p>
//                         </div>
//                     )}
//                 </div>
//             </div>

//             <SalarySlipDetailsDialog
//                 slip={selectedSlip}
//                 open={!!selectedSlip}
//                 onOpenChange={(isOpen) => !isOpen && setSelectedSlip(null)}
//             />
//         </div>
//     );
// };

// export default PayrollPage;


import React, { useState, useEffect, useMemo } from 'react';
import { toast } from 'sonner';

import { getRecentReports, initiatePayrollGeneration, getReportStatus, getPayrollReport, getPayrollPreview } from '@/services/payroll-service';
import { DataTable } from '@/components/DataTable';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Spinner } from "@/components/ui/spinner";
import { Eye, ReceiptText, ArrowRight } from 'lucide-react';

import SalarySlipDetailsDialog from '@/components/payroll/SalarySlipDetailsDialog';
import { PayrollGeneratorForm } from '@/components/payroll/PayrollGeneratorForm';
import { PayrollPreview } from '@/components/payroll/PayrollPreview';

const PayrollPage = () => {
    const [previewData, setPreviewData] = useState(null);
    const [isPreviewLoading, setIsPreviewLoading] = useState(false);
    const [payPeriod, setPayPeriod] = useState(null);

    const [recentReports, setRecentReports] = useState([]);
    const [activeReport, setActiveReport] = useState(null); 
    const [isGenerating, setIsGenerating] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    
    const [selectedSlip, setSelectedSlip] = useState(null);
    const [reportPagination, setReportPagination] = useState({ pageIndex: 0, pageSize: 10 });

    const fetchRecent = async () => {
        try {
            const reports = await getRecentReports();
            setRecentReports(reports);
        } catch (error) {
            toast.error("Failed to load recent reports.", { description: error.message });
        }
    };

    useEffect(() => { fetchRecent(); }, []);

    useEffect(() => {
        if (!isPolling || !activeReport?.id) return;
        const intervalId = setInterval(async () => {
            try {
                const statusData = await getReportStatus(activeReport.id);
                if (statusData.status === 'completed' || statusData.status === 'failed') {
                    setIsPolling(false);
                    clearInterval(intervalId);
                    const message = statusData.status === 'completed' ? `Payroll for ${activeReport.month}/${activeReport.year} is ready!` : `Payroll generation failed.`;
                    toast[statusData.status === 'completed' ? 'success' : 'error'](message, { description: statusData.error_log });
                    const finalReport = await getPayrollReport(activeReport.id);
                    setActiveReport(finalReport);
                }
            } catch (error) {
                setIsPolling(false);
                clearInterval(intervalId);
                toast.error("Failed to get report status.", { description: error.message });
            }
        }, 5000);
        return () => clearInterval(intervalId);
    }, [isPolling, activeReport]);

    const handlePreview = async (data) => {
        setIsPreviewLoading(true);
        setPreviewData(null);
        setActiveReport(null);
        setPayPeriod(data);
        try {
            const previewResult = await getPayrollPreview(data);
            setPreviewData(previewResult);
        } catch (error) {
            toast.error("Failed to generate preview.", { description: error.message });
        } finally {
            setIsPreviewLoading(false);
        }
    };
    
    const handleConfirmGeneration = async () => {
        if (!payPeriod) return;
        setIsGenerating(true);
        setPreviewData(null);
        try {
            const result = await initiatePayrollGeneration(payPeriod);
            toast.info("Payroll generation started.", { description: "Report will appear when ready." });
            setActiveReport({ id: result.reportId, status: 'processing', ...payPeriod });
            setIsPolling(true);
        } catch (error) {
            toast.error("Failed to initiate generation.", { description: error.message });
        } finally {
            setIsGenerating(false);
        }
    };

    const handleViewReport = async (reportId) => {
        setPreviewData(null);
        setActiveReport({ id: reportId, status: 'loading' });
        try {
            const reportData = await getPayrollReport(reportId);
            setActiveReport(reportData);
        } catch (error) {
            toast.error("Failed to load report.", { description: error.message });
            setActiveReport(null);
        }
    };
    
    const reportTableColumns = useMemo(() => [
        { id: 'sl_no', header: "SL NO", cell: ({ row, table }) => <span>{table.getState().pagination.pageIndex * table.getState().pagination.pageSize + row.index + 1}</span> },
        { accessorKey: "employee_id", header: "EID" },
        { accessorKey: "employee_name", header: "Name" },
        { accessorKey: "net_salary", header: "Net Salary", cell: ({row}) => `₹${row.original.net_salary}` },
        { id: 'actions', header: "Slip", cell: ({ row }) => <Button variant="ghost" size="icon" onClick={() => setSelectedSlip(row.original)}><ReceiptText/></Button> }
    ], []);

    const getStatusBadge = (status) => {
        const variants = { completed: 'success', processing: 'secondary', failed: 'destructive', loading: 'outline' };
        const text = { completed: 'Completed', processing: 'Processing...', failed: 'Failed', loading: 'Loading...' };
        return <Badge variant={variants[status] || 'default'}>{text[status]}</Badge>;
    };

    return (
        <div>
            <PayrollGeneratorForm onPreview={handlePreview} isLoading={isPreviewLoading} isPolling={isPolling} />

            {previewData && (
                <PayrollPreview 
                    previewData={previewData}
                    payPeriod={payPeriod}
                    onConfirm={handleConfirmGeneration}
                    onCancel={() => setPreviewData(null)}
                    isLoading={isGenerating || isPolling}
                />
            )}

            <div className="grid grid-cols-1 xl:grid-cols-4 gap-6 mt-4">
                <Card className="xl:col-span-1">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle>Recent Reports</CardTitle>
                        <Button size="sm" variant="secondary" onClick={fetchRecent}>Refresh</Button>
                    </CardHeader>
                    <CardContent>
                        <ul className="space-y-2">
                            {recentReports.length > 0 ? (
                                recentReports.map(report => (
                                    <li key={report.id} className="flex justify-between items-center p-2">
                                        <span>{report.month}/{report.year}</span>
                                        {getStatusBadge(report.status)}
                                        <Button variant="outline" size="icon" onClick={() => handleViewReport(report.id)} disabled={report.status !== 'completed'}>
                                            <ArrowRight />
                                        </Button>
                                    </li>
                                ))
                            ) : (
                                <li className="p-2 text-gray-500">No reports available</li>
                            )}
                        </ul>
                    </CardContent>
                </Card>
                
                <div className="xl:col-span-3">
                    {activeReport && activeReport.status === 'completed' && (
                        <Card>
                            <CardHeader><CardTitle>Payroll Report for {activeReport.month}/{activeReport.year}</CardTitle></CardHeader>
                            <CardContent>
                                <DataTable
                                    columns={reportTableColumns}
                                    data={activeReport.SalarySlips || []}
                                    pageCount={Math.ceil((activeReport.SalarySlips?.length || 0) / reportPagination.pageSize)}
                                    pagination={reportPagination}
                                    setPagination={setReportPagination}
                                />
                            </CardContent>
                        </Card>
                    )}
                    {(isPolling || isGenerating || activeReport?.status === 'loading') && (
                        <div className="h-full flex flex-col items-center justify-center p-8 border rounded-lg">
                            <Spinner />
                            <p className="font-semibold mt-2">
                                {activeReport?.status === 'loading' ? 'Loading Report...' : 'Payroll generation in progress...'}
                            </p>
                            <p className="text-sm text-muted-foreground">This may take a moment.</p>
                        </div>
                    )}
                </div>
            </div>

            <SalarySlipDetailsDialog
                slip={selectedSlip}
                open={!!selectedSlip}
                onOpenChange={(isOpen) => !isOpen && setSelectedSlip(null)}
            />
        </div>
    );
};

export default PayrollPage;
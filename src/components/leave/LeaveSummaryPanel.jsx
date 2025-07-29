// import React, { useState, useEffect } from 'react';
// import { useForm } from 'react-hook-form';
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { toast } from 'sonner';
// import { format } from 'date-fns';

// // UI Components & Utils
// import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
// import { Button } from '@/components/ui/button';
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from '@/components/ui/textarea';
// import { calculateWorkingDays } from '@/lib/date-utils'; // <-- Import our new helper

// // Services and Sub-components
// import { validateLeaveRequest, createSingleLeaveRequest, createSplitLeaveRequest } from '@/services/leave-service';
// import SplitConfirmationDialog from './SplitConfirmationDialog'; // We reuse this!

// const summaryFormSchema = z.object({
//     leave_type_id: z.string().min(1, { message: "Please select a leave type." }),
//     reason: z.string().optional(),
// });


// const LeaveSummaryPanel = ({ selectedDates, holidays, leaveTypes, onFormSubmit }) => {
//     // --- State Management ---
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [pendingSplit, setPendingSplit] = useState(null);
    
//     const form = useForm({
//         resolver: zodResolver(summaryFormSchema),
//         defaultValues: { reason: "", leave_type_id: "" },
//     });
    
//     // --- Derived Values & Effects ---
//     const workingDays = calculateWorkingDays(selectedDates.from, selectedDates.to, holidays);
    
//     // Reset the form if the user deselects the dates
//     useEffect(() => {
//         if (!selectedDates.from || !selectedDates.to) {
//             form.reset();
//         }
//     }, [selectedDates, form]);


//     // --- Submission Logic ---
//     const resetAll = () => {
//         setIsSubmitting(false);
//         setPendingSplit(null);
//         form.reset();
//         // We don't reset selectedDates here; that's the parent's job
//     };

//     const handleValidation = async (formData) => {
//         setIsSubmitting(true);
//         const submissionData = { ...formData, ...selectedDates };

//         try {
//             const validationResponse = await validateLeaveRequest(submissionData);
//             if (validationResponse.status === "ok") {
//                 await createSingleLeaveRequest(submissionData);
//                 toast.success("Leave request submitted successfully.");
//                 resetAll();
//                 onFormSubmit(); // Notify parent to refetch all data
//             } else if (validationResponse.status === "split_required") {
//                 setPendingSplit({
//                     proposal: validationResponse.proposal,
//                     reason: formData.reason || ""
//                 });
//                 setIsSubmitting(false); // Stop loading while user confirms
//             }
//         } catch (error) {
//             toast.error("Validation Failed", { description: error.message });
//             setIsSubmitting(false);
//         }
//     };
    
//     const handleConfirmSplit = async () => {
//         if (!pendingSplit) return;
//         setIsSubmitting(true);
//         try {
//             const payload = {
//                 split: pendingSplit.proposal.split,
//                 original_request: { reason: pendingSplit.reason }
//             };
//             await createSplitLeaveRequest(payload);
//             toast.success("Split leave request submitted successfully.");
//             resetAll();
//             onFormSubmit();
//         } catch (error) {
//             toast.error("Submission Failed", { description: error.message });
//             setIsSubmitting(false);
//         }
//     };

//     // --- Render Logic ---
//     if (!selectedDates.from || !selectedDates.to) {
//         return (
//             <Card className="h-full flex items-center justify-center">
//                 <p className="text-muted-foreground">Select dates on the calendar to begin.</p>
//             </Card>
//         );
//     }

//     return (
//         <>
//             <Card className="h-full">
//                 <CardHeader>
//                     <CardTitle>Request Summary</CardTitle>
//                     <CardDescription>
//                         {format(selectedDates.from, 'PPP')} to {format(selectedDates.to, 'PPP')}
//                     </CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6 text-center">
//                         <p className="text-sm text-muted-foreground">Total Working Days</p>
//                         <p className="text-3xl font-bold">{workingDays}</p>
//                         <p className="text-xs text-muted-foreground">Excludes Sundays & public holidays</p>
//                     </div>

//                     <Form {...form}>
//                         <form onSubmit={form.handleSubmit(handleValidation)} className="space-y-4">
//                             <FormField
//                                 control={form.control}
//                                 name="leave_type_id"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Leave Type</FormLabel>
//                                         <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                             <FormControl>
//                                                 <SelectTrigger><SelectValue placeholder="Select a leave type..." /></SelectTrigger>
//                                             </FormControl>
//                                             <SelectContent>
//                                                 {leaveTypes.map(lt => <SelectItem key={lt.id} value={String(lt.id)}>{lt.name}</SelectItem>)}
//                                             </SelectContent>
//                                         </Select>
//                                         <FormMessage />
//                                     </FormItem>
//                                 )}
//                             />
//                              <FormField
//                                 control={form.control}
//                                 name="reason"
//                                 render={({ field }) => (
//                                     <FormItem>
//                                         <FormLabel>Reason (Optional)</FormLabel>
//                                         <FormControl>
//                                             <Textarea placeholder="Provide a brief reason for your leave..." {...field} />
//                                         </FormControl>
//                                     </FormItem>
//                                 )}
//                             />
//                             <Button type="submit" className="w-full" disabled={isSubmitting || workingDays <= 0}>
//                                 {isSubmitting ? "Submitting..." : "Submit Request"}
//                             </Button>
//                         </form>
//                     </Form>
//                 </CardContent>
//             </Card>

//             {pendingSplit && (
//                 <SplitConfirmationDialog
//                     proposal={pendingSplit.proposal}
//                     isSubmitting={isSubmitting}
//                     onConfirm={handleConfirmSplit}
//                     onCancel={() => { setPendingSplit(null); setIsSubmitting(false); }}
//                 />
//             )}
//         </>
//     );
// };

// export default LeaveSummaryPanel;







import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { toast } from 'sonner';
import { format } from 'date-fns';

import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from '@/components/ui/textarea';
import { calculateWorkingDays } from '@/lib/date-utils';



import { validateLeaveRequest, createSingleLeaveRequest, createSplitLeaveRequest } from '@/services/leave-service';
import SplitConfirmationDialog from './SplitConfirmationDialog';

const summaryFormSchema = z.object({
    leave_type_id: z.string().min(1, { message: "Please select a leave type." }),
    reason: z.string().optional(),
});


const LeaveSummaryPanel = ({ selectedDates, holidays, leaveTypes, onFormSubmit , onError}) => {
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingSplit, setPendingSplit] = useState(null);

    const form = useForm({
        resolver: zodResolver(summaryFormSchema),
        defaultValues: { reason: "", leave_type_id: "" },
    });
    
    const workingDays = calculateWorkingDays(selectedDates?.from, selectedDates?.to, holidays);
    
    useEffect(() => {
        if (!selectedDates?.from || !selectedDates?.to) {
            form.reset();
        }
    }, [selectedDates, form]);

    const resetAll = () => {
        setIsSubmitting(false);
        setPendingSplit(null);
        form.reset();
    };

    const handleValidation = async (formData) => {
        setIsSubmitting(true);
        const submissionData = {
            leave_type_id: formData.leave_type_id,
            reason: formData.reason,
            start_date: selectedDates.from,
            end_date: selectedDates.to
        };

        try {
            const validationResponse = await validateLeaveRequest(submissionData);
            if (validationResponse.status === "ok") {
                await createSingleLeaveRequest(submissionData);
                toast.success("Leave request submitted successfully.");
                resetAll();
                onFormSubmit();
            } else if (validationResponse.status === "split_required") {
                setPendingSplit({
                    proposal: validationResponse.proposal,
                    reason: formData.reason || ""
                });
                setIsSubmitting(false);
            }
        } catch (error) {
            toast.error("Validation Failed", { description: error.message });
              if (onError) onError(error.message);
            setIsSubmitting(false);
        }
    };
    
    const handleConfirmSplit = async () => {
        if (!pendingSplit) return;
        setIsSubmitting(true);
        try {
            const payload = {
                split: pendingSplit.proposal.split,
                original_request: { reason: pendingSplit.reason }
            };
            await createSplitLeaveRequest(payload);
            toast.success("Split leave request submitted successfully.");
            resetAll();
            onFormSubmit();
        } catch (error) {
            toast.error("Submission Failed", { description: error.message });
            setIsSubmitting(false);
        }
    };
  

    if (!selectedDates?.from || !selectedDates?.to) {
        return (
            <Card className="h-fit flex items-center justify-center">
                <p className="text-muted-foreground">Select a date range on the calendar.</p>
            </Card>
        );
    }

   

    return (
        <>
            <Card className="h-fit">
                <CardHeader>
                    <CardTitle>Request Summary</CardTitle>
                    <CardDescription>
                        {format(selectedDates.from, 'PPP')} to {format(selectedDates.to, 'PPP')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="bg-slate-100 dark:bg-slate-800 p-4 rounded-lg mb-6 text-center">
                        <p className="text-sm text-muted-foreground">Total Working Days</p>
                        <p className="text-3xl font-bold">{workingDays}</p>
                        <p className="text-xs text-muted-foreground">Excludes Sundays & public holidays</p>
                    </div>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleValidation)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="leave_type_id"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Leave Type</FormLabel>
                                        <Select onValueChange={field.onChange} defaultValue={field.value}>
                                            <FormControl>
                                                <SelectTrigger><SelectValue placeholder="Select a leave type..." /></SelectTrigger>
                                            </FormControl>
                                            <SelectContent>
                                                {leaveTypes.map(lt => <SelectItem key={lt.id} value={String(lt.id)}>{lt.name}</SelectItem>)}
                                            </SelectContent>
                                        </Select>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />
                             <FormField
                                control={form.control}
                                name="reason"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel>Reason (Optional)</FormLabel>
                                        <FormControl>
                                            <Textarea placeholder="Provide a brief reason for your leave..." {...field} />
                                        </FormControl>
                                    </FormItem>
                                )}
                            />
                            <Button type="submit" className="w-full" disabled={isSubmitting || workingDays <= 0}>
                                {isSubmitting ? "Submitting..." : "Submit Request"}
                            </Button>
                        </form>
                    </Form>
                </CardContent>
            </Card>

            {pendingSplit && (
                <SplitConfirmationDialog
                    proposal={pendingSplit.proposal}
                    isSubmitting={isSubmitting}
                    onConfirm={handleConfirmSplit}
                    onCancel={() => { setPendingSplit(null); setIsSubmitting(false); }}
                />
            )}
        </>
    );
};

export default LeaveSummaryPanel;
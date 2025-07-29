

// import React, { useState, useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { zodResolver } from "@hookform/resolvers/zod";
// import * as z from "zod";
// import { format } from "date-fns";
// import { CalendarIcon } from "lucide-react";
// import { cn } from "@/lib/utils";

// // UI Components
// import { Button } from "@/components/ui/button";
// import { Calendar } from "@/components/ui/calendar";
// import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
// import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
// import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
// import { Textarea } from "@/components/ui/textarea";
// import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
// import { toast } from "sonner";

// // Services and Sub-components
// import { validateLeaveRequest, createSingleLeaveRequest, createSplitLeaveRequest } from '@/services/leave-service';
// import SplitConfirmationDialog from './SplitConfirmationDialog';

// // Zod schema for form validation
// const formSchema = z.object({
//     leave_type_id: z.string().min(1, { message: "Leave type is required." }),
//     start_date: z.date({ required_error: "A date is required." }),
//     end_date: z.date({ required_error: "A date is required." }),
//     reason: z.string().optional(),
// }).refine((data) => data.end_date >= data.start_date, {
//     message: "End date cannot be before start date.",
//     path: ["end_date"],
// });


// const LeaveRequestForm = ({ leaveTypes, onFormSubmit }) => {
//     // State for managing dialogs and submission flow
//     const [mainDialogOpen, setMainDialogOpen] = useState(false);
//     const [isSubmitting, setIsSubmitting] = useState(false);
//     const [pendingSplit, setPendingSplit] = useState(null);

//     const form = useForm({
//         resolver: zodResolver(formSchema),
//         defaultValues: { reason: "" },
//     });

//     // Utility to reset the form and all state variables
//     const resetFormAndState = () => {
//         form.reset();
//         setIsSubmitting(false);
//         setPendingSplit(null);
//         setMainDialogOpen(false);
//     };

//     // Step 1: Validate the user's input before any creation attempt
//     const handleValidation = async (values) => {
//         setIsSubmitting(true);
//         try {
//             const validationResponse = await validateLeaveRequest(values);

//             if (validationResponse.status === "ok") {
//                 await createSingleLeaveRequest(values);
//                 toast.success("Your leave request has been submitted.");
//                 resetFormAndState();
//                 onFormSubmit();
//             } else if (validationResponse.status === "split_required") {
//                 setPendingSplit({
//                     proposal: validationResponse.proposal,
//                     reason: values.reason || ""
//                 });
//                 setIsSubmitting(false); // Stop loading while user confirms
//             }
//         } catch (error) {
//             toast.error("Validation Failed", { description: error.message });
//             setIsSubmitting(false);
//         }
//     };
    
//     // Step 2 (if needed): Confirm and create the split request
//     const handleConfirmAndCreateSplit = useCallback(async () => {
//         if (!pendingSplit) return;

//         setIsSubmitting(true); 
        
//         try {
//             const payload = {
//                 split: pendingSplit.proposal.split,
//                 original_request: {
//                     reason: pendingSplit.reason
//                 }
//             };
            
//             await createSplitLeaveRequest(payload);
//             toast.success("Your split leave request has been submitted.");
//             resetFormAndState();
            
//             // --- THIS IS THE CORRECTED LINE ---
//             onFormSubmit(); // Corrected from onFormSplit
            
//         } catch (error) {
//             toast.error("Submission Failed", { description: error.message });
//             setIsSubmitting(false);
//         }
//     }, [pendingSplit, onFormSubmit]); 

//     return (
//         <>
//             <Dialog open={mainDialogOpen} onOpenChange={(open) => { if (!open) resetFormAndState(); setMainDialogOpen(open); }}>
//                 <DialogTrigger asChild>
//                     <Button>Apply for Leave</Button>
//                 </DialogTrigger>
//                 <DialogContent className="sm:max-w-[725px]">
//                     <DialogHeader>
//                         <DialogTitle>New Leave Request</DialogTitle>
//                         <DialogDescription>Fill out the details for your leave request.</DialogDescription>
//                     </DialogHeader>
//                     <Form {...form}>
//                         <form onSubmit={form.handleSubmit(handleValidation)} className="space-y-4 pt-4">
//                             <FormField control={form.control} name="leave_type_id" render={({ field }) => (
//                                 <FormItem>
//                                     <FormLabel>Leave Type</FormLabel>
//                                     <Select onValueChange={field.onChange} defaultValue={field.value}>
//                                         <FormControl>
//                                             <SelectTrigger><SelectValue placeholder="Select a leave type" /></SelectTrigger>
//                                         </FormControl>
//                                         <SelectContent>
//                                             {leaveTypes.map(lt => <SelectItem key={lt.id} value={String(lt.id)}>{lt.name}</SelectItem>)}
//                                         </SelectContent>
//                                     </Select>
//                                     <FormMessage />
//                                 </FormItem>
//                             )} />

//                             <Tabs defaultValue="range" className="w-full">
//                                 <TabsList className="grid w-full grid-cols-2">
//                                     <TabsTrigger value="range">Date Range</TabsTrigger>
//                                     <TabsTrigger value="single">Single Day</TabsTrigger>
//                                 </TabsList>
//                                 <TabsContent value="range" className="space-y-4">
//                                     <FormField control={form.control} name="start_date" render={({ field }) => (
//                                         <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover>
//                                             <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
//                                             <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
//                                         </Popover><FormMessage /></FormItem>
//                                     )}/>
//                                     <FormField control={form.control} name="end_date" render={({ field }) => (
//                                         <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover>
//                                             <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
//                                             <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} initialFocus /></PopoverContent>
//                                         </Popover></FormItem>
//                                     )}/>
//                                 </TabsContent>
//                                 <TabsContent value="single">
//                                     <FormField control={form.control} name="start_date" render={({ field }) => (
//                                         <FormItem className="flex flex-col pt-4"><FormLabel>Date</FormLabel><Popover>
//                                             <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
//                                             <PopoverContent className="w-auto p-0" align="start">
//                                                 <Calendar mode="single" selected={field.value} 
//                                                     onSelect={(date) => {
//                                                         form.setValue("start_date", date);
//                                                         form.setValue("end_date", date);
//                                                     }} initialFocus />
//                                             </PopoverContent>
//                                         </Popover><FormMessage /></FormItem>
//                                     )}/>
//                                 </TabsContent>
//                             </Tabs>

//                             <FormField control={form.control} name="reason" render={({ field }) => (
//                                 <FormItem><FormLabel>Reason</FormLabel><FormControl>
//                                     <Textarea placeholder="Provide a brief reason for your leave (optional)" {...field} />
//                                 </FormControl><FormMessage /></FormItem>
//                             )}/>
//                             <DialogFooter>
//                                 <Button type="button" variant="secondary" onClick={() => setMainDialogOpen(false)} disabled={isSubmitting}>
//                                     Cancel
//                                 </Button>
//                                 <Button type="submit" disabled={isSubmitting}>
//                                     {isSubmitting ? "Validating..." : "Submit for Validation"}
//                                 </Button>
//                             </DialogFooter>
//                         </form>
//                     </Form>
//                 </DialogContent>
//             </Dialog>

//             {pendingSplit && (
//                 <SplitConfirmationDialog
//                     proposal={pendingSplit.proposal}
//                     isSubmitting={isSubmitting}
//                     onConfirm={handleConfirmAndCreateSplit}
//                     onCancel={() => {
//                         setPendingSplit(null);
//                         setIsSubmitting(false);
//                     }}
//                 />
//             )}
//         </>
//     );
// };

// export default LeaveRequestForm;










import React, { useState, useCallback } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";

// UI Components
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger, DialogFooter, DialogClose } from "@/components/ui/dialog";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { toast } from "sonner";

// Services and Sub-components
import { validateLeaveRequest, createSingleLeaveRequest, createSplitLeaveRequest } from '@/services/leave-service';
import SplitConfirmationDialog from './SplitConfirmationDialog';

// Zod schema for form validation
const formSchema = z.object({
    leave_type_id: z.string().min(1, { message: "Leave type is required." }),
    start_date: z.date({ required_error: "A date is required." }),
    end_date: z.date({ required_error: "A date is required." }),
    reason: z.string().optional(),
}).refine((data) => data.end_date >= data.start_date, {
    message: "End date cannot be before start date.",
    path: ["end_date"],
});


const LeaveRequestForm = ({ leaveTypes, onFormSubmit }) => {
    // State for managing dialogs and submission flow
    const [mainDialogOpen, setMainDialogOpen] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [pendingSplit, setPendingSplit] = useState(null);

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: { reason: "", leave_type_id: "" },
    });

     // --- NEW LOGIC TO WATCH THE SELECTED LEAVE TYPE ---
    const watchedLeaveTypeId = form.watch("leave_type_id");
    const selectedLeaveType = leaveTypes.find(
        (lt) => String(lt.id) === watchedLeaveTypeId
    );
    
    // --- NEW LOGIC TO DEFINE THE DISABLED DATES ---
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Normalize to the beginning of the day

    const disablePastDates = (date) => {
        // If a leave type is selected AND it allows retroactive application, do not disable any dates.
        if (selectedLeaveType && selectedLeaveType.allow_retroactive_application) {
            return false;
        }
        // Otherwise (no type selected, or type doesn't allow it), disable past dates.
        return date < today;
    };

    // Utility to reset the form and all state variables
    const resetFormAndState = () => {
        form.reset();
        setIsSubmitting(false);
        setPendingSplit(null);
        setMainDialogOpen(false);
    };

    // Step 1: Validate the user's input before any creation attempt
    const handleValidation = async (values) => {
        setIsSubmitting(true);
        try {
            const validationResponse = await validateLeaveRequest(values);

            if (validationResponse.status === "ok") {
                await createSingleLeaveRequest(values);
                toast.success("Your leave request has been submitted.");
                resetFormAndState();
                onFormSubmit();
            } else if (validationResponse.status === "split_required") {
                setPendingSplit({
                    proposal: validationResponse.proposal,
                    reason: values.reason || ""
                });
                setIsSubmitting(false); // Stop loading while user confirms
            }
        } catch (error) {
            toast.error("Validation Failed", { description: error.message });
            setIsSubmitting(false);
        }
    };
    
    // Step 2 (if needed): Confirm and create the split request
    const handleConfirmAndCreateSplit = useCallback(async () => {
        if (!pendingSplit) return;

        setIsSubmitting(true); 
        
        try {
            const payload = {
                split: pendingSplit.proposal.split,
                original_request: {
                    reason: pendingSplit.reason
                }
            };
            
            await createSplitLeaveRequest(payload);
            toast.success("Your split leave request has been submitted.");
            resetFormAndState();
            
            // --- THIS IS THE CORRECTED LINE ---
            onFormSubmit(); // Corrected from onFormSplit
            
        } catch (error) {
            toast.error("Submission Failed", { description: error.message });
            setIsSubmitting(false);
        }
    }, [pendingSplit, onFormSubmit]); 

    return (
        <>
            <Dialog open={mainDialogOpen} onOpenChange={(open) => { if (!open) resetFormAndState(); setMainDialogOpen(open); }}>
                <DialogTrigger asChild>
                    <Button>Apply for Leave</Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-[725px]">
                    <DialogHeader>
                        <DialogTitle>New Leave Request</DialogTitle>
                        <DialogDescription>Fill out the details for your leave request.</DialogDescription>
                    </DialogHeader>
                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(handleValidation)} className="space-y-4 pt-4">
                            <FormField control={form.control} name="leave_type_id" render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Leave Type</FormLabel>
                                    <Select onValueChange={field.onChange} defaultValue={field.value}>
                                        <FormControl>
                                            <SelectTrigger><SelectValue placeholder="Select a leave type" /></SelectTrigger>
                                        </FormControl>
                                        <SelectContent>
                                            {leaveTypes.map(lt => <SelectItem key={lt.id} value={String(lt.id)}>{lt.name}</SelectItem>)}
                                        </SelectContent>
                                    </Select>
                                    <FormMessage />
                                </FormItem>
                            )} />

                            <Tabs defaultValue="range" className="w-full">
                                <TabsList className="grid w-full grid-cols-2">
                                    <TabsTrigger value="range">Date Range</TabsTrigger>
                                    <TabsTrigger value="single">Single Day</TabsTrigger>
                                </TabsList>
                                <TabsContent value="range" className="space-y-4">
                                    <FormField control={form.control} name="start_date" render={({ field }) => (
                                        <FormItem className="flex flex-col"><FormLabel>Start Date</FormLabel><Popover>
                                            <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={disablePastDates} initialFocus /></PopoverContent>
                                        </Popover><FormMessage /></FormItem>
                                    )}/>
                                    <FormField control={form.control} name="end_date" render={({ field }) => (
                                        <FormItem className="flex flex-col"><FormLabel>End Date</FormLabel><Popover>
                                            <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start"><Calendar mode="single" selected={field.value} onSelect={field.onChange} disabled={disablePastDates} initialFocus /></PopoverContent>
                                        </Popover></FormItem>
                                    )}/>
                                </TabsContent>
                                <TabsContent value="single">
                                    <FormField control={form.control} name="start_date" render={({ field }) => (
                                        <FormItem className="flex flex-col pt-4"><FormLabel>Date</FormLabel><Popover>
                                            <PopoverTrigger asChild><FormControl><Button variant={"outline"} className={cn("pl-3 text-left font-normal", !field.value && "text-muted-foreground")}>{field.value ? format(field.value, "PPP") : <span>Pick a date</span>}<CalendarIcon className="ml-auto h-4 w-4 opacity-50" /></Button></FormControl></PopoverTrigger>
                                            <PopoverContent className="w-auto p-0" align="start">
                                                <Calendar mode="single" selected={field.value} 
                                                    onSelect={(date) => {
                                                        form.setValue("start_date", date);
                                                        form.setValue("end_date", date);
                                                    }} disabled={disablePastDates} initialFocus />
                                            </PopoverContent>
                                        </Popover><FormMessage /></FormItem>
                                    )}/>
                                </TabsContent>
                            </Tabs>

                            <FormField control={form.control} name="reason" render={({ field }) => (
                                <FormItem><FormLabel>Reason</FormLabel><FormControl>
                                    <Textarea placeholder="Provide a brief reason for your leave (optional)" {...field} />
                                </FormControl><FormMessage /></FormItem>
                            )}/>
                            <DialogFooter>
                                <Button type="button" variant="secondary" onClick={() => setMainDialogOpen(false)} disabled={isSubmitting}>
                                    Cancel
                                </Button>
                                <Button type="submit" disabled={isSubmitting}>
                                    {isSubmitting ? "Validating..." : "Submit for Validation"}
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>

            {pendingSplit && (
                <SplitConfirmationDialog
                    proposal={pendingSplit.proposal}
                    isSubmitting={isSubmitting}
                    onConfirm={handleConfirmAndCreateSplit}
                    onCancel={() => {
                        setPendingSplit(null);
                        setIsSubmitting(false);
                    }}
                />
            )}
        </>
    );
};

export default LeaveRequestForm;
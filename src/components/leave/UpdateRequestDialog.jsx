import { useForm } from 'react-hook-form';
import * as z from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import  apiClient from '@/api/axiosConfig';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Textarea } from '@/components/ui/textarea';
import { toast } from 'sonner';

const formSchema = z.object({
  status: z.enum(['approved', 'rejected'], { required_error: 'You need to select a status.' }),
  manager_comments: z.string().optional(),
});

const UpdateRequestDialog = ({ request, open, onOpenChange, onUpdateSuccess }) => {
    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            status: request.status,
            manager_comments: request.manager_comments || '',
        }
    });

    const onSubmit = async (values) => {
        try {
            await apiClient.put(`/leave/${request.id}`, values);
            toast.success("Leave request has been updated.");
            onUpdateSuccess();
            onOpenChange(false);
        } catch (error) {
            toast.error("error",error);
        }
    };
    
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            <DialogContent>
                <DialogHeader>
                    <DialogTitle>Update Leave Request</DialogTitle>
                    <DialogDescription>update leave request and leave a message if necessary.</DialogDescription>
                </DialogHeader>
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                        <FormField
                            control={form.control}
                            name="status"
                            render={({ field }) => (
                                <FormItem className="space-y-3">
                                    <FormLabel>Set Status</FormLabel>
                                    <FormControl>
                                        <RadioGroup onValueChange={field.onChange} defaultValue={field.value} className="flex space-x-4">
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem className="border-3 h-6 w-6" value="approved" /></FormControl><FormLabel className="font-normal">Approve</FormLabel></FormItem>
                                            <FormItem className="flex items-center space-x-2"><FormControl><RadioGroupItem className="border-3 h-6 w-6" value="rejected" /></FormControl><FormLabel className="font-normal">Reject</FormLabel></FormItem>
                                        </RadioGroup>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="manager_comments"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Manager Comments</FormLabel>
                                    <FormControl>
                                        <Textarea placeholder="Add comments for the employee (optional)" {...field} />
                                    </FormControl>
                                </FormItem>
                            )}
                        />
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => onOpenChange(false)}>Cancel</Button>
                            <Button type="submit" disabled={form.formState.isSubmitting}>
                                {form.formState.isSubmitting ? 'Updating...' : 'Update Status'}
                            </Button>
                        </DialogFooter>
                    </form>
                </Form>
            </DialogContent>
        </Dialog>
    )
}

export default UpdateRequestDialog;
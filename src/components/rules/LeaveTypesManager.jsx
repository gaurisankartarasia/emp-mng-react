import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { createLeaveType, updateLeaveType, deleteLeaveType } from '@/services/rules-service';

const LeaveTypesManager = ({ leaveTypes, onDataChange }) => {
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedLeaveType, setSelectedLeaveType] = useState(null);
    const { register, handleSubmit, reset, setValue } = useForm();

    const openDialog = (leaveType = null) => {
        setSelectedLeaveType(leaveType);
        if (leaveType) {
            // Populate form for editing
            Object.keys(leaveType).forEach(key => setValue(key, leaveType[key]));
        } else {
            // Reset for creating new
            reset();
        }
        setDialogOpen(true);
    };

    const onSubmit = async (data) => {
        // Convert empty strings to null for numeric fields
        const numericFields = ['annual_allowance_days', 'monthly_allowance_days', 'max_days_per_request', 'fallback_leave_type_id'];
        numericFields.forEach(field => {
            if (data[field] === '' || data[field] === 'null') data[field] = null;
        });

        try {
            if (selectedLeaveType) {
                await updateLeaveType(selectedLeaveType.id, data);
                toast.success('Leave type updated successfully.');
            } else {
                await createLeaveType(data);
                toast.success('Leave type created successfully.');
            }
            onDataChange();
            setDialogOpen(false);
        } catch (error) {
            toast.error('Operation failed', { description: error.message });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this leave type?')) {
            try {
                await deleteLeaveType(id);
                toast.success('Leave type deleted successfully.');
                onDataChange();
            } catch (error) {
                toast.error('Deletion failed', { description: error.message });
            }
        }
    };

    return (
        <div>
            <div className="flex justify-end mb-4">
                <Button onClick={() => openDialog()}>Add New Leave Type</Button>
            </div>
            <Table>
                <TableHeader>
                    <TableRow>
                        <TableHead>Name</TableHead>
                        <TableHead>Annual Days</TableHead>
                        <TableHead>Monthly Days</TableHead>
                        <TableHead>Is Unpaid?</TableHead>
                        <TableHead>Actions</TableHead>
                    </TableRow>
                </TableHeader>
                <TableBody>
                    {leaveTypes.map(lt => (
                        <TableRow key={lt.id}>
                            <TableCell>{lt.name}</TableCell>
                            <TableCell>{lt.annual_allowance_days ?? 'N/A'}</TableCell>
                            <TableCell>{lt.monthly_allowance_days ?? 'N/A'}</TableCell>
                            <TableCell>{lt.is_unpaid ? 'Yes' : 'No'}</TableCell>
                            <TableCell className="space-x-2">
                                <Button variant="outline" size="sm" onClick={() => openDialog(lt)}>Edit</Button>
                                <Button variant="destructive" size="sm" onClick={() => handleDelete(lt.id)}>Delete</Button>
                            </TableCell>
                        </TableRow>
                    ))}
                </TableBody>
            </Table>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent  className="min-w-2xl" >
                    <DialogHeader>
                        <DialogTitle>{selectedLeaveType ? 'Edit' : 'Create'} Leave Type</DialogTitle>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                        <div><Label>Name</Label><Input {...register("name", { required: true })} /></div>
                        <div><Label>Annual Allowance Days</Label><Input type="number" {...register("annual_allowance_days")} /></div>
                        <div><Label>Monthly Allowance Days</Label><Input type="number" {...register("monthly_allowance_days")} /></div>
                        <div><Label>Max Days Per Request</Label><Input type="number" {...register("max_days_per_request")} /></div>
                        <div className="flex items-center space-x-2"><Checkbox id="is_unpaid" {...register("is_unpaid")} /><Label htmlFor="is_unpaid">Is Unpaid?</Label></div>
                        <div className="flex items-center space-x-2"><Checkbox id="allow_retroactive_application" {...register("allow_retroactive_application")} /><Label htmlFor="allow_retroactive_application">Allow Retroactive Application?</Label></div>
                        <div>
                            <Label>Fallback Leave Type</Label>
                            <Select onValueChange={(value) => setValue('fallback_leave_type_id', value)} defaultValue={selectedLeaveType?.fallback_leave_type_id}>
                                <SelectTrigger><SelectValue placeholder="Select a fallback type..." /></SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="null">None</SelectItem>
                                    {leaveTypes.filter(lt => lt.id !== selectedLeaveType?.id).map(lt => (
                                        <SelectItem key={lt.id} value={String(lt.id)}>{lt.name}</SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default LeaveTypesManager;
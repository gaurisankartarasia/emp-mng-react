import React, { useState, useEffect, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { toast } from 'sonner';
import {
    Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Checkbox } from "@/components/ui/checkbox";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Spinner } from '@/components/ui/spinner';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { getSalaryComponents, createSalaryComponent, updateSalaryComponent, deleteSalaryComponent } from '@/services/salary-service';
import { PERMISSIONS } from '@/config/permissions'; 

const SalaryComponentsPage = () => {
    const [components, setComponents] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [dialogOpen, setDialogOpen] = useState(false);
    const [selectedComponent, setSelectedComponent] = useState(null);
    const { register, handleSubmit, reset, control } = useForm();

    const fetchData = useCallback(async () => {
        try {
            const data = await getSalaryComponents();
            setComponents(data);
        } catch (error) {
            toast.error("Failed to load salary components", { description: error.message });
        } finally {
            setIsLoading(false);
        }
    }, []);

    useEffect(() => {
        fetchData();
    }, [fetchData]);

    const openDialog = (component = null) => {
        setSelectedComponent(component);
        if (component) {
            reset(component);
        } else {
            reset({
                name: '',
                type: 'Earning',
                is_base_component: false
            });
        }
        setDialogOpen(true);
    };

    const onSubmit = async (data) => {
        data.is_base_component = !!data.is_base_component;

        try {
            if (selectedComponent) {
                await updateSalaryComponent(selectedComponent.id, data);
                toast.success("Component updated successfully.");
            } else {
                await createSalaryComponent(data);
                toast.success("Component created successfully.");
            }
            fetchData();
            setDialogOpen(false);
        } catch (error) {
            toast.error("Operation failed", { description: error.message });
        }
    };

    const handleDelete = async (id) => {
        if (window.confirm('Are you sure you want to delete this component? This may affect existing employee salary structures.')) {
            try {
                await deleteSalaryComponent(id);
                toast.success("Component deleted successfully.");
                fetchData();
            } catch (error) {
                toast.error("Deletion failed", { description: error.message });
            }
        }
    };

    if (isLoading) {
        return <div className="flex items-center justify-center h-96"><Spinner /></div>;
    }

    return (
        <div className="p-4 lg:p-6">
            <header className="mb-6 flex justify-between items-center">
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Salary Components</h1>
                    <p className="text-muted-foreground">Manage the master list of salary components for your organization.</p>
                </div>
                <Button onClick={() => openDialog()}>Add New Component</Button>
            </header>

            <Card>
                <CardContent className="p-0">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Component Name</TableHead>
                                <TableHead>Type</TableHead>
                                <TableHead>Is Base for Percentage?</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {components.map(comp => (
                                <TableRow key={comp.id}>
                                    <TableCell className="font-medium">{comp.name}</TableCell>
                                    <TableCell>{comp.type}</TableCell>
                                    <TableCell>{comp.is_base_component ? 'Yes' : 'No'}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button variant="outline" size="sm" onClick={() => openDialog(comp)}>Edit</Button>
                                        <Button variant="destructive" size="sm" onClick={() => handleDelete(comp.id)}>Delete</Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>{selectedComponent ? 'Edit' : 'Create'} Salary Component</DialogTitle>
                        <DialogDescription>Define a new building block for employee salaries.</DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4 py-4">
                        <div>
                            <Label htmlFor="name">Component Name</Label>
                            <Input id="name" {...register("name", { required: true })} placeholder="e.g., House Rent Allowance" />
                        </div>
                        <div>
                            <Label>Component Type</Label>
                            <Controller
                                name="type"
                                control={control}
                                render={({ field }) => (
                                    <Select onValueChange={field.onChange} value={field.value}>
                                        <SelectTrigger><SelectValue /></SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="Earning">Earning</SelectItem>
                                            <SelectItem value="Deduction">Deduction</SelectItem>
                                        </SelectContent>
                                    </Select>
                                )}
                            />
                        </div>
                        <div className="flex items-center space-x-2">
                            <Controller
                                name="is_base_component"
                                control={control}
                                render={({ field }) => (
                                    <Checkbox
                                        id="is_base_component"
                                        checked={field.value}
                                        onCheckedChange={field.onChange}
                                    />
                                )}
                            />
                            <Label htmlFor="is_base_component">Is Base for Percentage Calculations? (e.g., Basic Salary)</Label>
                        </div>
                        <DialogFooter>
                            <Button type="button" variant="secondary" onClick={() => setDialogOpen(false)}>Cancel</Button>
                            <Button type="submit">Save Component</Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default SalaryComponentsPage;
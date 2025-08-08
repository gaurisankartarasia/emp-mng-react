import React, { useState, useEffect } from 'react';
import { toast } from 'sonner';

// Services
import { getSalaryComponents, getEmployeeList } from '@/services/salary-service';

// UI Components
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Label } from "@/components/ui/label";
import { Spinner } from '@/components/ui/spinner';

// Child Management Component (to be created next)
import SalaryStructureForm from '@/components/payroll/SalaryStructureForm';

const SalaryStructurePage = () => {
    const [employees, setEmployees] = useState([]);
    const [salaryComponents, setSalaryComponents] = useState([]);
    const [selectedEmployeeId, setSelectedEmployeeId] = useState(null);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchInitialData = async () => {
            try {
                const [empData, compData] = await Promise.all([
                    getEmployeeList(),
                    getSalaryComponents()
                ]);
                setEmployees(empData);
                setSalaryComponents(compData);
            } catch (error) {
                toast.error("Failed to load initial data", { description: error.message });
            } finally {
                setIsLoading(false);
            }
        };
        fetchInitialData();
    }, []);

    if (isLoading) {
        return <div className="flex items-center justify-center h-96"><Spinner /></div>;
    }
    
    return (
        <div>
            <Card>
                <CardHeader>
                    <CardTitle>Employee Salary Structure</CardTitle>
                    <CardDescription>Select an employee to view or define their component-based salary structure.</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="max-w-xs">
                         <Label>Select Employee</Label>
                        <Select onValueChange={setSelectedEmployeeId}>
                            <SelectTrigger><SelectValue placeholder="Select an employee..." /></SelectTrigger>
                            <SelectContent>
                                {employees.map(emp => (
                                    <SelectItem key={emp.id} value={String(emp.id)}>{emp.name}</SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </CardContent>
            </Card>

          <div className='mt-4' >
              {selectedEmployeeId && (
                <SalaryStructureForm
                    key={selectedEmployeeId}
                    employeeId={selectedEmployeeId}
                    masterComponents={salaryComponents}
                />
            )}
          </div>
        </div>
    );
};

export default SalaryStructurePage;
import React, { useState, useEffect } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableHeader, TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {  Terminal, TrendingUp , Search} from "lucide-react";
import apiClient from '../api/axiosConfig';
import { Input } from "@/components/ui/input";
import useAuth from '@/hooks/useAuth';
import { PERMISSIONS } from '@/config/permissions';
import AccessDenied from '@/components/AccessDenied';
import { Spinner } from '@/components/ui/spinner';


const IncrementReportPage = () => {
    const [reportData, setReportData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
     const [searchTerm, setSearchTerm] = useState("");
    const [debouncedSearchTerm, setDebouncedSearchTerm] = useState("");
    const {user} = useAuth();

    const canViewReport = user.is_master || user.permissions.includes([PERMISSIONS.PAGES.INCREMENT_REPORT, PERMISSIONS.INCREMENT_REPORT.READ]) 

    useEffect(() => {
        const timerId = setTimeout(() => {
            setDebouncedSearchTerm(searchTerm);
        }, 500);
        return () => clearTimeout(timerId);
    }, [searchTerm]);


    useEffect(() => {
        const fetchReport = async () => {
            try {
                setLoading(true);
                 const config = {};
                if (debouncedSearchTerm) {
                    config.params = { search: debouncedSearchTerm };
                }
                const res = await apiClient.get('/increment-report', config);
                setReportData(res.data);
            } catch (err) {
                setError(err.response?.data?.message || 'Failed to generate report.');
            } finally {
                setLoading(false);
            }
        };
        fetchReport();
    }, [debouncedSearchTerm]);

    const formatCurrency = (amount) => {
        return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-[400px]">
                <Spinner />
                <p className="ml-3 text-muted-foreground">Generating increment report...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto mt-4"><Alert variant="destructive">
                <Terminal className="h-4 w-4" /><AlertTitle>Error</AlertTitle><AlertDescription>{error}</AlertDescription>
            </Alert></div>
        );
    }

    if (!canViewReport) return <AccessDenied/>

    return (
        <div className="container mx-auto">
            <Card>

                <CardHeader>
                    <CardTitle className="flex items-center">
                        <TrendingUp className="mr-2 h-6 w-6" />
                        Annual Increment Report
                    </CardTitle>
                    <div className="relative">
                            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                            <Input
                                type="search"
                                placeholder="Search by employee name..."
                                className="w-full sm:w-64 pl-8"
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                            />
                        </div>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Employee</TableHead>
                                <TableHead>Service Days</TableHead>
                                <TableHead>Avg. Rating</TableHead>
                                <TableHead>Current Salary</TableHead>
                                <TableHead>Eligible?</TableHead>
                                <TableHead>Increment %</TableHead>
                                <TableHead>New Salary</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {reportData.map((emp) => (
                                <TableRow key={emp.id}>
                                    <TableCell className="font-medium">{emp.name}</TableCell>
                                    <TableCell>{emp.days_of_service}</TableCell>
                                    <TableCell>{emp.average_rating || 'N/A'}</TableCell>
                                    <TableCell>{formatCurrency(emp.current_salary)}</TableCell>
                                    <TableCell>
                                        <Badge variant={emp.is_eligible ? "default" : "secondary"} className={emp.is_eligible ? "bg-green-600" : ""}>
                                            {emp.is_eligible ? 'Yes' : 'No'}
                                        </Badge>
                                    </TableCell>
                                    <TableCell className="font-semibold text-blue-600">{emp.increment_percentage}%</TableCell>
                                    <TableCell className="font-bold text-green-700">{formatCurrency(emp.new_salary)}</TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default IncrementReportPage;
import React, { useState, useEffect } from 'react';
import apiClient from '../api/axiosConfig';
import useAuth from '../hooks/useAuth';
import { DashboardCard } from '@/components/DashboardCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {  Users, ListChecks, Activity, Star } from "lucide-react";
import { formatDate } from '@/utils/dateFormat';
import { Spinner } from '@/components/ui/spinner';

const DashboardPage = () => {
    const [summary, setSummary] = useState(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuth();

    useEffect(() => {
        const fetchSummary = async () => {
            try {
                const res = await apiClient.get('/dashboard/summary');
                setSummary(res.data);
            } catch (error) {
                console.error("Failed to load dashboard data.", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSummary();
    }, []);

    const getStatusBadge = (status) => {
        const config = {
            pending: { variant: "secondary", label: "Pending" },
            in_progress: { variant: "default", label: "In Progress" },
            paused: { variant: "outline", label: "Paused" },
            completed: { variant: "default", className: "bg-green-600", label: "Completed" }
        }[status] || { variant: "secondary", label: status };
        return <Badge variant={config.variant} className={config.className}>{config.label}</Badge>;
    };

    if (loading || !summary) {
        return <div className="flex justify-center items-center h-64"><Spinner/></div>;
    }

    const icons = [Users, ListChecks, Activity, Star];

    return (
        <div className="container mx-auto space-y-6">
            <div>
                <h1 className="text-xl font-bold">Welcome back, {user.name}!</h1>
                <p className="text-muted-foreground">Here's a summary of what's happening.</p>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                <DashboardCard title={summary.kpi1.title} value={summary.kpi1.value} icon={icons[0]} />
                <DashboardCard title={summary.kpi2.title} value={summary.kpi2.value} icon={icons[1]} />
                <DashboardCard title={summary.kpi3.title} value={summary.kpi3.value} icon={icons[2]} />
                <DashboardCard title={summary.kpi4.title} value={summary.kpi4.value} icon={icons[3]} />
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>Recent Tasks</CardTitle>
                    <CardDescription>The 5 most recently created tasks.</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                 <TableHead>SL NO.</TableHead>
                                 <TableHead>Task ID</TableHead>
                                <TableHead>Task</TableHead>
                                 {user.is_master && <TableHead>Employee ID</TableHead>}
                                {user.is_master && <TableHead>Assigned To (Employee name)</TableHead>}
                                <TableHead>Status</TableHead>
                                <TableHead>Created On</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {summary.recentTasks.length > 0 ? (
                                summary.recentTasks.map((task, i) => (
                                    <TableRow key={task.id}>
                                        <TableCell>{i+1}</TableCell>
                                        <TableCell className="font-medium">{task.id}</TableCell>
                                        <TableCell >{task.title}</TableCell>
                                        {user.is_master && <TableCell>{task.EmployeeId || 'N/A'}</TableCell>}
                                        {user.is_master && <TableCell>{task.Employee?.name || 'N/A'}</TableCell>}
                                        <TableCell>{getStatusBadge(task.status)}</TableCell>
                                        <TableCell>{formatDate(task.createdAt)}</TableCell>
                                    </TableRow>
                                ))
                            ) : (
                                <TableRow>
                                    <TableCell colSpan={user.is_master ? 4 : 3} className="h-24 text-center">
                                        No recent tasks found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>
        </div>
    );
};

export default DashboardPage;
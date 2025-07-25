
import React, { useState, useEffect } from "react";
import apiClient from "../api/axiosConfig";
import useAuth from "../hooks/useAuth";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

import { Spinner } from "@/components/ui/spinner";
import { Users, ListChecks, Activity, Star } from "lucide-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import { PERMISSIONS } from "../config/permissions";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [performanceView, setPerformanceView] = useState("all");   
  const [loading, setLoading] = useState({ summary: true, charts: true });
  const { user } = useAuth();

  const canViewAllPerformance =
    user.is_master ||
    user.permissions.includes(PERMISSIONS.VIEW_ALL_PERFORMANCE_CHART);

  useEffect(() => {
    apiClient
      .get("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .finally(() => setLoading((prev) => ({ ...prev, summary: false })));
  }, []);

  useEffect(() => {
    const fetchChartData = async () => {
      setLoading((prev) => ({ ...prev, charts: true }));
      try {
        const res = await apiClient.get("/dashboard/charts", {
          params: { view: canViewAllPerformance ? performanceView : "self" },
        });
        setWeeklyChartData(res.data.weeklyData);
        setMonthlyChartData(res.data.monthlyData);
      } catch (error) {
        console.error("Failed to load chart data.", error);
      } finally {
        setLoading((prev) => ({ ...prev, charts: false }));
      }
    };
    fetchChartData();
  }, [performanceView, canViewAllPerformance]);

  return (
    <div className="container mx-auto py-6 space-y-6">
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center ">
        {canViewAllPerformance && (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Select
              value={performanceView}
              onValueChange={(value) => setPerformanceView(value)}
            >
              <SelectTrigger id="view-mode" className="w-[180px]">
                <SelectValue placeholder="Select view" />
              </SelectTrigger>
              <SelectContent>
                {!user.is_master && <SelectItem value="self">Myself</SelectItem> }
                <SelectItem value="all">All Employees</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        
        <Card>
            
          <CardHeader>
            <CardTitle>Last 7 Days Performance</CardTitle>
            <CardDescription>Daily average task rating.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading.charts ? (
              <div className="h-[350px] flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <PerformanceChart data={weeklyChartData} />
            )}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last 12 Months Performance</CardTitle>
            <CardDescription>Monthly average task rating.</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading.charts ? (
              <div className="h-[350px] flex items-center justify-center">
                <Spinner />
              </div>
            ) : (
              <PerformanceChart data={monthlyChartData} />
            )}
          </CardContent>
        </Card>
      </div>
      {loading.summary ? (
        <div className="flex justify-center p-8">
          <Spinner />
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard
            title={summary.kpi1.title}
            value={summary.kpi1.value}
            icon={Users}
          />
          <DashboardCard
            title={summary.kpi2.title}
            value={summary.kpi2.value}
            icon={ListChecks}
          />
          <DashboardCard
            title={summary.kpi3.title}
            value={summary.kpi3.value}
            icon={Activity}
          />
          <DashboardCard
            title={summary.kpi4.title}
            value={summary.kpi4.value}
            icon={Star}
          />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;




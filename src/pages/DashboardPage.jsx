// import React, { useState, useEffect } from "react";
// import apiClient from "../api/axiosConfig";
// import { DashboardCard } from "@/components/dashboard/DashboardCard";

// import { Spinner } from "@/components/ui/spinner";
// import { Users, ListChecks, Activity, Star } from "lucide-react";

// const DashboardPage = () => {
//   const [summary, setSummary] = useState(null);
//   const [loading, setLoading] = useState({ summary: true });

//   useEffect(() => {
//     apiClient
//       .get("/dashboard/summary")
//       .then((res) => setSummary(res.data))
//       .finally(() => setLoading((prev) => ({ ...prev, summary: false })));
//   }, []);

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       {loading.summary ? (
//         <div className="flex justify-center p-8">
//           <Spinner />
//         </div>
//       ) : (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <DashboardCard
//             title={summary.kpi1.title}
//             value={summary.kpi1.value}
//             icon={Users}
//           />
//           <DashboardCard
//             title={summary.kpi2.title}
//             value={summary.kpi2.value}
//             icon={ListChecks}
//           />
//           <DashboardCard
//             title={summary.kpi3.title}
//             value={summary.kpi3.value}
//             icon={Activity}
//           />
//           <DashboardCard
//             title={summary.kpi4.title}
//             value={summary.kpi4.value}
//             icon={Star}
//           />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;



// import React, { useState, useEffect } from "react";
// import apiClient from "../api/axiosConfig";
// import { DashboardCard } from "@/components/dashboard/DashboardCard";
// import {
//   Card,
//   CardContent,
//   CardDescription,
//   CardHeader,
//   CardTitle,
// } from "@/components/ui/card";
// import { Spinner } from "@/components/ui/spinner";
// import { Users, ListChecks, Activity, Star } from "lucide-react";
// import EmployeeRatingsChart from "@/components/dashboard/PerformanceCharts"; // <-- IMPORT THE NEW CHART

// const DashboardPage = () => {
//   const [summary, setSummary] = useState(null);
//   const [weeklyRatings, setWeeklyRatings] = useState([]);
//   const [monthlyRatings, setMonthlyRatings] = useState([]);
//   const [loading, setLoading] = useState({ summary: true, charts: true });

//   useEffect(() => {
//     // Fetch summary KPI cards
//     apiClient
//       .get("/dashboard/summary")
//       .then((res) => setSummary(res.data))
//       .finally(() => setLoading((prev) => ({ ...prev, summary: false })));

//     // Fetch both weekly and monthly chart data in parallel
//     const fetchChartData = async () => {
//         try {
//             const [weeklyRes, monthlyRes] = await Promise.all([
//                 apiClient.get("/dashboard/employee-ratings", { params: { timeframe: 'weekly' } }),
//                 apiClient.get("/dashboard/employee-ratings", { params: { timeframe: 'monthly' } })
//             ]);
//             setWeeklyRatings(weeklyRes.data);
//             setMonthlyRatings(monthlyRes.data);
//         } catch (error) {
//             console.error("Failed to load chart data", error);
//         } finally {
//             setLoading((prev) => ({...prev, charts: false}));
//         }
//     };
//     fetchChartData();
//   }, []);

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//         {/* --- KPI Cards Section --- */}
//         {loading.summary ? (
//             <div className="flex justify-center p-8"><Spinner /></div>
//         ) : (
//             summary && (
//                 <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//                     <DashboardCard title={summary.kpi1.title} value={summary.kpi1.value} icon={Users} />
//                     <DashboardCard title={summary.kpi2.title} value={summary.kpi2.value} icon={ListChecks} />
//                     <DashboardCard title={summary.kpi3.title} value={summary.kpi3.value} icon={Activity} />
//                     <DashboardCard title={summary.kpi4.title} value={summary.kpi4.value} icon={Star} />
//                 </div>
//             )
//         )}
        
//         {/* --- Charts Section --- */}
//         <div className="grid gap-6 md:grid-cols-2">
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Weekly Ratings Overview (Last 7 Days)</CardTitle>
//                     <CardDescription>Visual comparison of all employee average ratings.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {loading.charts ? (
//                         <div className="h-[350px] flex items-center justify-center"><Spinner /></div>
//                     ) : (
//                         <EmployeeRatingsChart data={weeklyRatings} />
//                     )}
//                 </CardContent>
//             </Card>
//             <Card>
//                 <CardHeader>
//                     <CardTitle>Monthly Ratings Overview (Last 30 Days)</CardTitle>
//                     <CardDescription>Visual comparison of all employee average ratings.</CardDescription>
//                 </CardHeader>
//                 <CardContent>
//                     {loading.charts ? (
//                         <div className="h-[350px] flex items-center justify-center"><Spinner /></div>
//                     ) : (
//                         <EmployeeRatingsChart data={monthlyRatings} />
//                     )}
//                 </CardContent>
//             </Card>
//         </div>
//     </div>
//   );
// };

// export default DashboardPage;




// import React, { useState, useEffect, useCallback } from "react";
// import apiClient from "../api/axiosConfig";
// import useAuth from "../hooks/useAuth";
// import { DashboardCard } from "@/components/dashboard/DashboardCard";
// import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
// import { Spinner } from "@/components/ui/spinner";
// import { Users, ListChecks, Activity, Star } from "lucide-react";
// import PersonalPerformanceChart from "@/components/dashboard/PersonalPerformanceChart";
// import EmployeeOverviewChart from "@/components/dashboard/EmployeeOverviewChart";
// import { PERMISSIONS } from "../config/permissions";
// import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// const DashboardPage = () => {
//   const [summary, setSummary] = useState(null);
//   const [weeklyChartData, setWeeklyChartData] = useState([]);
//   const [monthlyChartData, setMonthlyChartData] = useState([]);
//   const [performanceView, setPerformanceView] = useState("all");   
//   const [loading, setLoading] = useState({ summary: true, charts: true });
//   const { user } = useAuth();

//   const canViewAllPerformance = user.is_master || user.permissions.includes(PERMISSIONS.VIEW_ALL_PERFORMANCE_CHART);

//   useEffect(() => {
//     if (!canViewAllPerformance) setPerformanceView("self");
//   }, [canViewAllPerformance]);

//   useEffect(() => {
//     apiClient.get("/dashboard/summary")
//       .then((res) => setSummary(res.data))
//       .finally(() => setLoading((prev) => ({ ...prev, summary: false })));
//   }, []);

//   const fetchChartData = useCallback(async () => {
//     setLoading((prev) => ({ ...prev, charts: true }));
//     try {
//       if (canViewAllPerformance && performanceView === 'all') {
//         const [weeklyRes, monthlyRes] = await Promise.all([
//             apiClient.get("/dashboard/charts/overview", { params: { timeframe: 'weekly' } }),
//             apiClient.get("/dashboard/charts/overview", { params: { timeframe: 'monthly' } })
//         ]);
//         setWeeklyChartData(weeklyRes.data);
//         setMonthlyChartData(monthlyRes.data);
//       } else {
//         const res = await apiClient.get("/dashboard/charts/personal");
//         setWeeklyChartData(res.data.weeklyData);
//         setMonthlyChartData(res.data.monthlyData);
//       }
//     } catch (error) {
//       console.error("Failed to load chart data.", error);
//     } finally {
//       setLoading((prev) => ({ ...prev, charts: false }));
//     }
//   }, [performanceView, canViewAllPerformance]);

//   useEffect(() => {
//     fetchChartData();
//   }, [fetchChartData]);

//   const ChartComponent = (canViewAllPerformance && performanceView === 'all') ? EmployeeOverviewChart : PersonalPerformanceChart;

//   return (
//     <div className="container mx-auto py-6 space-y-6">
//       <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center">
      
//         {canViewAllPerformance && (
//           <div className="flex items-center space-x-2 mt-4 sm:mt-0">
//             <Select value={performanceView} onValueChange={setPerformanceView}>
//               <SelectTrigger id="view-mode" className="w-[180px]"><SelectValue placeholder="Select view" /></SelectTrigger>
//               <SelectContent>
//                 <SelectItem value="self">My performance</SelectItem>
//                 <SelectItem value="all">All employees</SelectItem>
//               </SelectContent>
//             </Select>
//           </div>
//         )}
//       </div>

//       <div className="grid gap-6 md:grid-cols-2">
//         <Card>
//           <CardHeader>
//             <CardTitle>Last 7 Days Performance</CardTitle>
//             <CardDescription>{performanceView === 'all' && canViewAllPerformance ? {t('team-performance-overview)} : 'Your daily average rating.'}</CardDescription>
//           </CardHeader>
//           <CardContent className="pl-2">
//             {loading.charts ? <div className="h-[350px] flex items-center justify-center"><Spinner /></div> : <ChartComponent data={weeklyChartData} />}
//           </CardContent>
//         </Card>
//         <Card>
//           <CardHeader>
//             <CardTitle>Last 30 Days Performance</CardTitle>
//             <CardDescription>{performanceView === 'all' && canViewAllPerformance ? {t('team-performance-overview)} : 'Your monthly average rating.'}</CardDescription>
//           </CardHeader>
//           <CardContent className="pl-2">
//             {loading.charts ? <div className="h-[350px] flex items-center justify-center"><Spinner /></div> : <ChartComponent data={monthlyChartData} />}
//           </CardContent>
//         </Card>
//       </div>

//       {!loading.summary && summary && (
//         <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
//           <DashboardCard title={summary.kpi1.title} value={summary.kpi1.value} icon={Users} />
//           <DashboardCard title={summary.kpi2.title} value={summary.kpi2.value} icon={ListChecks} />
//           <DashboardCard title={summary.kpi3.title} value={summary.kpi3.value} icon={Activity} />
//           <DashboardCard title={summary.kpi4.title} value={summary.kpi4.value} icon={Star} />
//         </div>
//       )}
//     </div>
//   );
// };

// export default DashboardPage;



import React, { useState, useEffect, useCallback }  from "react";
import apiClient from "@/api/axiosConfig";
import useAuth from "@/hooks/useAuth";
import { DashboardCard } from "@/components/dashboard/DashboardCard";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { Users, ListChecks, Activity, Star, User } from "lucide-react";
import PerformanceChart from "@/components/dashboard/PerformanceChart";
import DailyAttendanceWidget from '@/components/attendance/DailyAttendanceWidget';
import { PERMISSIONS } from "@/config/permissions";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useT } from "@/hooks/useT";

const DashboardPage = () => {
  const [summary, setSummary] = useState(null);
  const [weeklyChartData, setWeeklyChartData] = useState([]);
  const [monthlyChartData, setMonthlyChartData] = useState([]);
  const [weeklyEmployees, setWeeklyEmployees] = useState([]);
  const [monthlyEmployees, setMonthlyEmployees] = useState([]);
  const [performanceView, setPerformanceView] = useState("all");   
  const [loading, setLoading] = useState({ summary: true, charts: true });
  const { user } = useAuth();
  const t = useT()

  const canViewAllPerformance = user.is_master || user.permissions.includes(PERMISSIONS.VIEW_ALL_PERFORMANCE_CHART);

  useEffect(() => {
    if (!canViewAllPerformance) setPerformanceView("self");
  }, [canViewAllPerformance]);

  useEffect(() => {
    apiClient.get("/dashboard/summary")
      .then((res) => setSummary(res.data))
      .finally(() => setLoading((prev) => ({ ...prev, summary: false })));
  }, []);

  const fetchChartData = useCallback(async () => {
    setLoading((prev) => ({ ...prev, charts: true }));
    try {
      const res = await apiClient.get("/dashboard/charts", {
        params: { view: canViewAllPerformance ? performanceView : "self" },
      });
      setWeeklyChartData(res.data.weeklyData);
      setWeeklyEmployees(res.data.weeklyEmployees);
      setMonthlyChartData(res.data.monthlyData);
      setMonthlyEmployees(res.data.monthlyEmployees);
    } catch (error) {
      console.error("Failed to load chart data.", error);
    } finally {
      setLoading((prev) => ({ ...prev, charts: false }));
    }
  }, [performanceView, canViewAllPerformance]);

  useEffect(() => {
    fetchChartData();
  }, [fetchChartData]);

  return (
    <div className="container mx-auto space-y-6">
<div   className="max-w-sm" >
        <DailyAttendanceWidget/>
</div>
      
      <div className="flex flex-col sm:flex-row sm:justify-end sm:items-center">
       
        {canViewAllPerformance && (
          <div className="flex items-center space-x-2 mt-4 sm:mt-0">
            <Select value={performanceView} onValueChange={setPerformanceView}>
              <SelectTrigger id="view-mode" className="w-fit"><SelectValue placeholder="Select view" /></SelectTrigger>
              <SelectContent>
                <SelectItem value="self"> <User/> {t('personal')}</SelectItem>
                <SelectItem value="all"> <Users /> { t('all-employees')}</SelectItem>
              </SelectContent>
            </Select>
          </div>
        )}
      </div>

      <div className="grid gap-6 md:grid-cols-2">

        
        <Card>
          <CardHeader>
            <CardTitle>{ t('last-7-days-performance')}</CardTitle>
            <CardDescription>{performanceView === 'all' && canViewAllPerformance ? t('team-performance-overview') : 'Your daily average rating.'}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading.charts ? <div className="h-[350px] flex items-center justify-center"><Spinner /></div> : <PerformanceChart data={weeklyChartData} employees={weeklyEmployees} viewType={performanceView} />}
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <CardTitle>Last 12 Months Performance</CardTitle>
            <CardDescription>{performanceView === 'all' && canViewAllPerformance ? t('team-performance-overview') : 'Your monthly average rating.'}</CardDescription>
          </CardHeader>
          <CardContent className="pl-2">
            {loading.charts ? <div className="h-[350px] flex items-center justify-center"><Spinner /></div> : <PerformanceChart data={monthlyChartData} employees={monthlyEmployees} viewType={performanceView} />}
          </CardContent>
        </Card>
      </div>
 
      {!loading.summary && summary && (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          <DashboardCard title={summary.kpi1.title} value={summary.kpi1.value} icon={Users} />
          <DashboardCard title={summary.kpi2.title} value={summary.kpi2.value} icon={ListChecks} />
          <DashboardCard title={summary.kpi3.title} value={summary.kpi3.value} icon={Activity} />
          <DashboardCard title={summary.kpi4.title} value={summary.kpi4.value} icon={Star} />
        </div>
      )}
    </div>
  );
};

export default DashboardPage;


export const columns = [
     {
        id: 'sl_no', 
        header: "SL NO",
        cell: ({ row, table }) => {
            const pageIndex = table.getState().pagination.pageIndex;
            const pageSize = table.getState().pagination.pageSize;
            
            const serialNumber = pageIndex * pageSize + row.index + 1;
            
            return <span>{serialNumber}</span>;
        },
    },
    {
        accessorKey: "employee.id",
        header: "Emp ID",
    },
    {
        accessorKey: "employee.name",
        header: "Employee Name",
    },
    {
        accessorKey: "salaryDetails.grossSalary",
        header: "Gross Salary",
    },
    {
        accessorKey: "attendanceBreakdown.presentDays",
        header: "Present",
    },
    {
        accessorKey: "attendanceBreakdown.paidLeaveDays",
        header: "Paid Leave",
    },
    {
        accessorKey: "attendanceBreakdown.totalPayableDays",
        header: "Payable Days",
    },
     {
        accessorKey: "attendanceBreakdown.unpaidDays",
        header: "Unpaid Days",
    },
    {
        accessorKey: "salaryDetails.deductions",
        header: "Deductions",
    },
    {
        accessorKey: "salaryDetails.netSalary",
        header: "Net Salary",
    },
];
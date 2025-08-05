import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowUpDown } from "lucide-react";

const formatCurrency = (amount) => {
    if (!amount) return "N/A";
    return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'INR' }).format(amount);
};

export const createColumns = (t) => [
  {
    id: "sl_no",
    header: t('sl-no'),
    cell: ({ row, table }) => {
      const { pageIndex, pageSize } = table.getState().pagination;
      return pageIndex * pageSize + row.index + 1;
    },
  },
  {
accessorKey:'id',
header:t('emp-id')
  },
  {
    accessorKey: "name",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t('employee')} <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
  },
  {
    accessorKey: "days_of_service",
    header: t('service-days'),
  },
  {
    accessorKey: "average_rating",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t('avg-rating')} <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => row.original.average_rating || "N/A",
  },
  {
    accessorKey: "current_salary",
    header: ({ column }) => (
      <Button variant="ghost" onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}>
        {t('current-salary')} <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => formatCurrency(row.original.current_salary),
  },
  {
    accessorKey: "is_eligible",
    header: t('eligible'),
    cell: ({ row }) => (
      <Badge variant={row.original.is_eligible ? "default" : "secondary"} className={row.original.is_eligible ? "bg-green-600" : ""}>
        {row.original.is_eligible ? 'Yes' : 'No'}
      </Badge>
    ),
  },
  {
    accessorKey: "increment_percentage",
    header: `${t('increment')} %`,
    cell: ({ row }) => `${row.original.increment_percentage}%`,
  },
  {
    accessorKey: "new_salary",
    header: t('new-salary'),
    cell: ({ row }) => formatCurrency(row.original.new_salary),
  },
];
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  ArrowUpDown,
  MoreHorizontal,
  CircleUser,
  Pencil,
  Trash,
} from "lucide-react";
import EmployeeHoverCard from "./EmployeeHoverCard";
import { Link } from "react-router-dom";
import { formatDate } from "@/utils/dateFormat";

const apiBaseUrl = import.meta.env.API_URL.replace("/api/v1", "");

export const createColumns = ({
  openDeleteDialog,
  canUpdate,
  canDelete,
  currentUser,
  t
}) => {
  return [
    {
      id: "sl_no",
      header: t('sl-no'),
      cell: ({ row, table }) => {
        const { pageIndex, pageSize } = table.getState().pagination;
        return pageIndex * pageSize + row.index + 1;
      },
    },
    {
      accessorKey: "picture",
      header: t('picture'),
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <Avatar>
            <AvatarImage
              src={employee.picture ? `${apiBaseUrl}${employee.picture}` : ""}
              alt={employee.name}
            />
            <AvatarFallback>
              {" "}
              <CircleUser />{" "}
            </AvatarFallback>
          </Avatar>
        );
      },
    },
    {
      accessorKey: "id",
      header: t('emp-id'),
    },
    {
      accessorKey: "name",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
        {  t('name')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => {
        const employee = row.original;
        return (
          <div className="flex items-center gap-2">
            <EmployeeHoverCard employee={employee}>
              <span className="font-medium cursor-context-menu underline underline-offset-4 hover:text-blue-600">
                {employee.name}
              </span>
            </EmployeeHoverCard>
            {employee.is_master && <Badge>master</Badge>}
          </div>
        );
      },
    },
    {
      accessorKey: "email",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {  t('email')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
    },
    {
      accessorKey: "phone",
      header: t('phone') ,
    },
    {
      accessorKey: "joined_at",
      header: ({ column }) => (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          {  t('joined')}
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      ),
      cell: ({ row }) => formatDate(row.original.joined_at),
    },
    {
      id: "actions",
      cell: ({ row }) => {
        const employee = row.original;
        const isSelf = currentUser.userId === employee.id;

        return (
          <div className="text-right">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="h-8 w-8 p-0">
                  <MoreHorizontal className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                {canUpdate && (
                  <Link to={`/employees/${employee.id}/edit`}>
                    <DropdownMenuItem className="cursor-pointer">
                    
                      <Pencil /> {  t('edit')}
                    </DropdownMenuItem>
                  </Link>
                )}
                {canDelete && (
                  <>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                      className="text-red-600 cursor-pointer"
                      onClick={() => openDeleteDialog(employee)}
                      disabled={isSelf || employee.is_master}
                    >
                      {" "}
                      <Trash className="text-red-600" /> {  t('delete')}
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        );
      },
    },
  ];
};

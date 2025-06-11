"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { type DateRange } from "react-day-picker";
import {
  ColumnDef,
  ColumnFiltersState,
  FilterFn,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import {
  ArrowUpDown,
  MoreHorizontal,
  BanknoteX,
  BanknoteArrowUp,
  TrendingUp,
  TrendingDown,
  Filter,
  ScanSearch,
  ExternalLink,
  ChevronDownIcon,
} from "lucide-react";

import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/src/components/ui/dropdown-menu";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/src/components/ui/select";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Calendar } from "@/src/components/ui/calendar";

import { invoices } from "@/src/data/invoices";

export type Invoice = {
  invoiceId: string;
  name: string;
  imageUrl: string;
  link: string;
  dueDate: Date;
  monthly: boolean;
  amount: number;
  description: string;
  login: string;
  password: string;
  type: string;
  status: string;
  createdAt: Date;
};

const dateRangeFilter: FilterFn<Invoice> = (row, columnId, filterValue) => {
  if (!filterValue?.from || !filterValue?.to) return true;
  const dueDate = new Date(row.getValue(columnId));
  const from = new Date(filterValue.from);
  from.setHours(0, 0, 0, 0);
  const to = new Date(filterValue.to);
  to.setHours(23, 59, 59, 999);
  return dueDate >= from && dueDate <= to;
};

export const columns: ColumnDef<Invoice>[] = [
  {
    id: "select",
    header: ({ table }) => (
      <Checkbox
        checked={
          table.getIsAllPageRowsSelected() ||
          (table.getIsSomePageRowsSelected() && "indeterminate")
        }
        onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
        aria-label="Select all"
      />
    ),
    cell: ({ row }) => (
      <Checkbox
        checked={row.getIsSelected()}
        onCheckedChange={(value) => row.toggleSelected(!!value)}
        aria-label="Select row"
      />
    ),
    enableSorting: false,
    enableHiding: false,
  },
  {
    accessorKey: "name",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Name
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
  },
  {
    accessorKey: "dueDate",
    filterFn: dateRangeFilter,
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Due Date
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => {
      const date = new Date(row.getValue("dueDate"));
      return <div className="px-2">{date.toLocaleDateString()}</div>;
    },
  },
  {
    accessorKey: "type",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Type
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div className="flex items-center gap-2">
        <div className="flex items-center justify-center rounded-full bg-border p-1">
          {row.getValue("type") === "income" ? (
            <TrendingUp className="h-4 w-4 text-chart-1" />
          ) : (
            <TrendingDown className="h-4 w-4 text-chart-2" />
          )}
        </div>
        {row.getValue("type")}
      </div>
    ),
  },
  {
    accessorKey: "status",
    filterFn: "equals",
    header: ({ column }) => {
      return (
        <Button
          variant="outline"
          size="sm"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Status
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      );
    },
    cell: ({ row }) => (
      <div
        className={`${
          row.getValue("status") === "paid"
            ? "bg-chart-1/10 w-fit px-2 py-1 rounded-md"
            : "bg-chart-2/10 w-fit px-2 py-1 rounded-md"
        } flex items-center gap-2`}
      >
        <div>
          {row.getValue("status") === "paid" ? (
            <BanknoteArrowUp className="h-4 w-4 text-chart-1" />
          ) : (
            <BanknoteX className="h-4 w-4 text-chart-2" />
          )}
        </div>
        <div
          className={`${
            row.getValue("status") === "paid"
              ? "text-chart-1 rounded-md"
              : "text-chart-2 rounded-md"
          }`}
        >
          {row.getValue("status")}
        </div>
      </div>
    ),
  },
  {
    accessorKey: "amount",
    header: () => <div className="text-right">Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("en-US", {
        style: "currency",
        currency: "USD",
      }).format(amount);

      return <div className="text-right font-medium">{formatted}</div>;
    },
  },
  {
    id: "actions",
    enableHiding: false,
    cell: ({ row }) => {
      const payment = row.original;
      return (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-8 w-8 p-0">
              <span className="sr-only">Open menu</span>
              <MoreHorizontal />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>Actions</DropdownMenuLabel>
            <DropdownMenuItem
              onClick={() => navigator.clipboard.writeText(payment.invoiceId)}
            >
              Copy payment ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>View customer</DropdownMenuItem>
            <DropdownMenuItem>View payment details</DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      );
    },
  },
];

export default function TableFinancialTracker() {
  const [sorting, setSorting] = useState<SortingState>([]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);

  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const equalsFilter: FilterFn<any> = (row, columnId, filterValue) => {
    return row.getValue(columnId) === filterValue;
  };

  const table = useReactTable({
    data: invoices,
    columns,
    onSortingChange: setSorting,
    onColumnFiltersChange: setColumnFilters,
    getCoreRowModel: getCoreRowModel(),
    getPaginationRowModel: getPaginationRowModel(),
    getSortedRowModel: getSortedRowModel(),
    getFilteredRowModel: getFilteredRowModel(),
    onRowSelectionChange: setRowSelection,
    initialState: {
      pagination: {
        pageSize: 5,
      },
    },
    state: {
      sorting,
      columnFilters,
      rowSelection,
    },
    filterFns: {
      equals: equalsFilter,
      dateRange: dateRangeFilter,
    },
  });

  const resetFilters = () => {
    table.getColumn("type")?.setFilterValue("");
    table.getColumn("status")?.setFilterValue("");
    table.getColumn("dueDate")?.setFilterValue(undefined);
    setDateRange(undefined);
  };

  return (
    <div className="w-full flex-4 p-4 rounded-lg border">
      <div className="flex items-center justify-between gap-2 pb-4">
        <div className="flex items-center gap-2">
          <Input
            placeholder="Filter invoices..."
            value={(table.getColumn("name")?.getFilterValue() as string) ?? ""}
            onChange={(event) =>
              table.getColumn("name")?.setFilterValue(event.target.value)
            }
            className="max-w-xs"
          />
          <DropdownMenu modal={false}>
            <DropdownMenuTrigger asChild>
              <Button variant="outline">
                <Filter size={16} />
                Filter
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-56" align="end">
              <div className="space-y-2">
                <div>
                  <DropdownMenuLabel>Filters</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                </div>
                <div className="space-y-1">
                  <DropdownMenuLabel>Date Range</DropdownMenuLabel>
                  <Popover open={open} onOpenChange={setOpen}>
                    <PopoverTrigger asChild>
                      <Button
                        variant="outline"
                        id="date-from"
                        className="w-full justify-between font-normal"
                      >
                        {dateRange?.from
                          ? `${dateRange.from.toLocaleDateString()} - ${dateRange.to?.toLocaleDateString()}`
                          : "Select date"}
                        <ChevronDownIcon />
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent
                      className="w-auto overflow-hidden p-0"
                      align="start"
                    >
                      <Calendar
                        mode="range"
                        defaultMonth={dateRange?.from}
                        selected={dateRange}
                        onSelect={(range) => {
                          setDateRange(range);
                          table.getColumn("dueDate")?.setFilterValue(range);
                        }}
                        className="rounded-lg border shadow-sm"
                      />
                    </PopoverContent>
                  </Popover>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <DropdownMenuLabel>Type</DropdownMenuLabel>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        table.getColumn("type")?.setFilterValue("")
                      }
                      className="text-muted-foreground"
                    >
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={
                      (table.getColumn("type")?.getFilterValue() as string) ??
                      "all"
                    }
                    onValueChange={(value) =>
                      table
                        .getColumn("type")
                        ?.setFilterValue(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="income">Income</SelectItem>
                      <SelectItem value="expense">Expense</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <DropdownMenuLabel>Status</DropdownMenuLabel>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() =>
                        table.getColumn("status")?.setFilterValue("")
                      }
                      className="text-muted-foreground"
                    >
                      Reset
                    </Button>
                  </div>
                  <Select
                    value={
                      (table.getColumn("status")?.getFilterValue() as string) ??
                      "all"
                    }
                    onValueChange={(value) =>
                      table
                        .getColumn("status")
                        ?.setFilterValue(value === "all" ? "" : value)
                    }
                  >
                    <SelectTrigger className="w-full">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All</SelectItem>
                      <SelectItem value="paid">Paid</SelectItem>
                      <SelectItem value="unpaid">Unpaid</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button
                  variant="outline"
                  onClick={resetFilters}
                  className="w-full"
                >
                  Reset all
                </Button>
              </div>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        <div className="flex items-center gap-2">
          <Link href="/projects/financial-tracker/invoice-action">
            <Button variant="secondary">
              <ScanSearch /> Details
            </Button>
          </Link>
        </div>
      </div>
      <div className="rounded-md border bg-card">
        <Table>
          <TableHeader>
            {table.getHeaderGroups().map((headerGroup) => (
              <TableRow key={headerGroup.id}>
                {headerGroup.headers.map((header) => {
                  return (
                    <TableHead key={header.id}>
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </TableHead>
                  );
                })}
              </TableRow>
            ))}
          </TableHeader>
          <TableBody>
            {table.getRowModel().rows?.length ? (
              table.getRowModel().rows.map((row) => (
                <TableRow
                  key={row.id}
                  data-state={row.getIsSelected() && "selected"}
                >
                  {row.getVisibleCells().map((cell) => (
                    <TableCell key={cell.id}>
                      {flexRender(
                        cell.column.columnDef.cell,
                        cell.getContext()
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))
            ) : (
              <TableRow>
                <TableCell
                  colSpan={columns.length}
                  className="h-24 text-center"
                >
                  No results.
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>
      <div className="flex items-center justify-end space-x-2 pt-4">
        <div className="space-x-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.previousPage()}
            disabled={!table.getCanPreviousPage()}
          >
            Previous
          </Button>
          <Button
            variant="outline"
            size="sm"
            onClick={() => table.nextPage()}
            disabled={!table.getCanNextPage()}
          >
            Next
          </Button>
        </div>
      </div>
    </div>
  );
}

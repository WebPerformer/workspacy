"use client";

import { useEffect, useState } from "react";
import { type DateRange } from "react-day-picker";
import {
  ColumnFiltersState,
  SortingState,
  flexRender,
  getCoreRowModel,
  getFilteredRowModel,
  getPaginationRowModel,
  getSortedRowModel,
  useReactTable,
} from "@tanstack/react-table";
import { Input } from "@/src/components/ui/input";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Button } from "@/src/components/ui/button";
import { GetInvoicesRequest } from "@/src/lib/invoices";
import { toast } from "sonner";
import { createColumns } from "./columns";
import { FilterMenu } from "./filter-menu";
import { ActionButtons } from "./action-buttons";
import { Invoice } from "./types";
import { dateRangeFilter, equalsFilter } from "./filters";

export default function TableFinancialTracker() {
  const [sorting, setSorting] = useState<SortingState>([
    { id: "dueDate", desc: true },
  ]);
  const [columnFilters, setColumnFilters] = useState<ColumnFiltersState>([]);
  const [rowSelection, setRowSelection] = useState({});
  const [open, setOpen] = useState(false);
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [dateRange, setDateRange] = useState<DateRange | undefined>();

  const handleInvoiceUpdate = (invoiceId: string, status: string) => {
    setInvoices((prevInvoices) =>
      prevInvoices.map((invoice) =>
        invoice.invoiceId === invoiceId ? { ...invoice, status } : invoice
      )
    );
  };

  const handleInvoiceCreate = (newInvoice: Invoice) => {
    setInvoices((prevInvoices) => [...prevInvoices, newInvoice]);
  };

  const handleInvoiceDelete = (invoiceId: string) => {
    setInvoices((prevInvoices) =>
      prevInvoices.filter((invoice) => invoice.invoiceId !== invoiceId)
    );
  };

  useEffect(() => {
    const fetchData = async () => {
      const { success, data } = await GetInvoicesRequest();
      if (success) {
        setInvoices(data);
      } else {
        toast.error(data.message);
      }
    };
    fetchData();
  }, []);

  const table = useReactTable({
    data: invoices,
    columns: createColumns({
      onInvoiceUpdate: handleInvoiceUpdate,
      onInvoiceCreate: handleInvoiceCreate,
      onInvoiceDelete: handleInvoiceDelete,
    }),
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

  return (
    <div className="w-full flex-3 p-4 rounded-lg border">
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
          <FilterMenu
            table={table}
            dateRange={dateRange}
            setDateRange={setDateRange}
            open={open}
            setOpen={setOpen}
          />
        </div>
        <ActionButtons
          selectedInvoices={table
            .getSelectedRowModel()
            .rows.map((row) => row.original)}
        />
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
                  colSpan={table.getAllColumns().length}
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

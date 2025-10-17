import { Button } from "@/src/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
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
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import { Calendar } from "@/src/components/ui/calendar";
import { Filter, ChevronDownIcon } from "lucide-react";
import { type DateRange } from "react-day-picker";
import { Table } from "@tanstack/react-table";
import { Invoice } from "./types";

interface FilterMenuProps {
  table: Table<Invoice>;
  dateRange: DateRange | undefined;
  setDateRange: (range: DateRange | undefined) => void;
  open: boolean;
  setOpen: (open: boolean) => void;
}

export function FilterMenu({
  table,
  dateRange,
  setDateRange,
  open,
  setOpen,
}: FilterMenuProps) {
  const resetFilters = () => {
    table.getColumn("type")?.setFilterValue("");
    table.getColumn("status")?.setFilterValue("");
    table.getColumn("dueDate")?.setFilterValue(undefined);
    setDateRange(undefined);
  };

  return (
    <DropdownMenu modal={false}>
      <DropdownMenuTrigger asChild>
        <Button variant="secondary">
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
                onClick={() => table.getColumn("type")?.setFilterValue("")}
                className="text-muted-foreground"
              >
                Reset
              </Button>
            </div>
            <Select
              value={
                (table.getColumn("type")?.getFilterValue() as string) ?? "all"
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
                onClick={() => table.getColumn("status")?.setFilterValue("")}
                className="text-muted-foreground"
              >
                Reset
              </Button>
            </div>
            <Select
              value={
                (table.getColumn("status")?.getFilterValue() as string) ?? "all"
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
          <Button variant="outline" onClick={resetFilters} className="w-full">
            Reset all
          </Button>
        </div>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

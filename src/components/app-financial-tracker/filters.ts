import { FilterFn } from "@tanstack/react-table";
import { Invoice } from "./types";

export const dateRangeFilter: FilterFn<Invoice> = (
  row,
  columnId,
  filterValue
) => {
  if (!filterValue?.from || !filterValue?.to) return true;
  const dueDate = new Date(row.getValue(columnId));
  const from = new Date(filterValue.from);
  from.setHours(0, 0, 0, 0);
  const to = new Date(filterValue.to);
  to.setHours(23, 59, 59, 999);
  return dueDate >= from && dueDate <= to;
};

export const equalsFilter: FilterFn<any> = (row, columnId, filterValue) => {
  return row.getValue(columnId) === filterValue;
};

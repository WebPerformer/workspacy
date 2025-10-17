import { ColumnDef } from "@tanstack/react-table";
import {
  ArrowUpDown,
  BanknoteX,
  BanknoteArrowUp,
  TrendingUp,
  TrendingDown,
  HandCoins,
  Copy,
  Trash,
} from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Badge } from "../ui/badge";
import {
  Invoice,
  INVOICE_TYPES,
  INVOICE_STATUS,
  INVOICE_DELETED,
} from "./types";
import {
  DeleteInvoiceRequest,
  UpdateInvoiceRequest,
  CreateInvoiceRequest,
} from "@/src/lib/invoices";
import { toast } from "sonner";

interface ColumnsProps {
  onInvoiceUpdate: (invoiceId: string, status: string) => void;
  onInvoiceCreate?: (invoice: Invoice) => void;
  onInvoiceDelete?: (invoiceId: string) => void;
}

export const createColumns = ({
  onInvoiceUpdate,
  onInvoiceCreate,
  onInvoiceDelete,
}: ColumnsProps): ColumnDef<Invoice>[] => [
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
    cell: ({ row }) => {
      return (
        <div className="px-2 flex items-center gap-2">
          <img
            src={row.original.imageUrl}
            alt={row.original.name}
            className="w-7 h-7 rounded-full"
          />
          <div>
            <p className="line-clamp-1">{row.original.name}</p>
            <p className="text-xs text-muted-foreground">
              {row.original.description}
            </p>
          </div>
        </div>
      );
    },
  },
  {
    accessorKey: "dueDate",
    accessorFn: (row) => new Date(row.dueDate).getTime(),
    id: "dueDate",
    header: ({ column }) => (
      <Button
        variant="outline"
        size="sm"
        onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
      >
        Due Date
        <ArrowUpDown className="ml-2 h-4 w-4" />
      </Button>
    ),
    cell: ({ row }) => {
      const date = new Date(row.original.dueDate);
      return <div className="px-2">{date.toLocaleDateString("pt-BR")}</div>;
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
          {row.getValue("type") === INVOICE_TYPES.INCOME ? (
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
          row.getValue("status") === INVOICE_STATUS.PAID
            ? "bg-chart-1/10 w-fit px-2 py-1 rounded-md"
            : "bg-chart-2/10 w-fit px-2 py-1 rounded-md"
        } flex items-center gap-2`}
      >
        <div>
          {row.getValue("status") === INVOICE_STATUS.PAID ? (
            <BanknoteArrowUp className="h-4 w-4 text-chart-1" />
          ) : (
            <BanknoteX className="h-4 w-4 text-chart-2" />
          )}
        </div>
        <div
          className={`${
            row.getValue("status") === INVOICE_STATUS.PAID
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
    header: () => <div>Amount</div>,
    cell: ({ row }) => {
      const amount = parseFloat(row.getValue("amount"));
      const formatted = new Intl.NumberFormat("pt-BR", {
        style: "currency",
        currency: "BRL",
      }).format(amount);
      return (
        <Badge variant="outline" className="text-sm">
          {formatted}
        </Badge>
      );
    },
  },
  {
    accessorKey: "Actions",
    header: () => <div>Action</div>,
    cell: ({ row }) => {
      const onPayInvoice = async (invoiceId: number) => {
        const { success, data } = await UpdateInvoiceRequest(
          {
            status: INVOICE_STATUS.PAID,
          },
          invoiceId
        );
        if (success) {
          toast.success("Invoice paid successfully");
          onInvoiceUpdate(row.original.invoiceId, INVOICE_STATUS.PAID);
        } else {
          toast.error(data.message);
        }
      };

      const onDeleteInvoice = async (invoiceId: number) => {
        const { success, data } = await DeleteInvoiceRequest(invoiceId);
        if (success) {
          toast.success("Invoice deleted successfully");
          onInvoiceDelete?.(row.original.invoiceId);
        } else {
          toast.error(data.message);
        }
      };

      const onCloneInvoice = async (invoice: Invoice) => {
        const { success, data } = await CreateInvoiceRequest({
          ...invoice,
          name: `${invoice.name}`,
          status: INVOICE_STATUS.UNPAID,
        });

        if (success && onInvoiceCreate) {
          toast.success("Invoice cloned successfully");
          onInvoiceCreate(data);
        } else {
          toast.error(data.message);
        }
      };

      return (
        <div className="w-fit p-1 border rounded-md flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            disabled={row.original.status === INVOICE_STATUS.PAID}
            onClick={() => {
              onPayInvoice(Number(row.original.invoiceId));
            }}
          >
            <HandCoins />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => onCloneInvoice(row.original)}
          >
            <Copy />
          </Button>
          <Button
            variant="outline"
            size="icon"
            className="w-8 h-8"
            onClick={() => {
              onDeleteInvoice(Number(row.original.invoiceId));
            }}
          >
            <Trash />
          </Button>
        </div>
      );
    },
  },
];

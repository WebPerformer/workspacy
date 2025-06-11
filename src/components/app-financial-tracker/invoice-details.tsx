"use client";

// React and Next.js hooks
import { useState } from "react";

// Third-party icons
import {
  CalendarIcon,
  ReceiptText,
  Save,
  Images,
  RotateCw,
  ExternalLink,
  PencilLine,
  Trash,
  ChevronLeft,
  CheckCircle,
  CircleX,
  CircleFadingArrowUp,
  RotateCcw,
  RefreshCw,
} from "lucide-react";
import { format } from "date-fns";

// UI components and forms
import { Button } from "@/src/components/ui/button";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Calendar } from "@/src/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";

// Third-party libraries
import { z } from "zod";
import { useForm, useController, Control } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { cn } from "@/src/lib/utils";
import { Switch } from "@/src/components/ui/switch";
import { Label } from "@/src/components/ui/label";
import { ToggleGroup, ToggleGroupItem } from "@/src/components/ui/toggle-group";
import Link from "next/link";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../ui/select";
import { Badge } from "../ui/badge";

const formSChema = z.object({
  imageUrl: z.string().url().optional(),
  invoiceName: z.string(),
  invoiceLink: z.string().url().optional(),
  invoiceLogin: z.string().optional(),
  invoicePassword: z.string().optional(),
  invoiceType: z.enum(["income", "expense"]),
  invoiceDueDate: z.date(),
  invoiceAmount: z.number(),
  invoiceDescription: z.string().optional(),
  isMonthly: z.boolean(),
  invoiceStatus: z.string(),
});

type FormSchemaType = z.infer<typeof formSChema>;
type InvoiceType = FormSchemaType["invoiceType"];

type InvoiceDetailsProps = {
  title: string;
  invoiceId: string;
  invoiceName?: string;
  imageUrl?: string;
  invoiceLink?: string;
  dueDate?: Date;
  monthly?: boolean;
  amount?: number;
  description?: string;
  login?: string;
  password?: string;
  type?: InvoiceType;
  status?: string;
  createdAt?: Date;
  isAction?: boolean;
};

function InvoiceDetails({
  title,
  invoiceId,
  invoiceName,
  imageUrl,
  invoiceLink,
  dueDate,
  monthly,
  amount,
  description,
  login,
  password,
  type,
  status,
  createdAt,
  isAction,
}: InvoiceDetailsProps) {
  const form = useForm<z.infer<typeof formSChema>>({
    resolver: zodResolver(formSChema),
    defaultValues: {
      imageUrl: imageUrl || "",
      invoiceName: invoiceName || "",
      invoiceLink: invoiceLink || "",
      invoiceLogin: login || "",
      invoicePassword: password || "",
      invoiceType: type || "income",
      invoiceDueDate: dueDate ? new Date(dueDate) : new Date(),
      invoiceAmount: amount || 0.0,
      invoiceDescription: description || "",
      isMonthly: monthly || false,
      invoiceStatus: status || "unpaid",
    },
  });

  const formValues = form.watch();
  const [date, setDate] = useState<Date>(
    dueDate ? new Date(dueDate) : new Date()
  );
  const [detailsOpen, setDetailsOpen] = useState(isAction ? false : true);

  const {
    field: { value, onChange, ...field },
  } = useController({ name: "invoiceAmount", control: form.control });

  const getFormattedValue = (raw: string | number) => {
    const onlyDigits = raw?.toString().replace(/\D/g, "") || "0";
    const number = parseFloat((parseInt(onlyDigits) / 100).toFixed(2));

    return number.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const numeric = e.target.value.replace(/\D/g, "");
    onChange(numeric);
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      form.setValue("invoiceDueDate", newDate);
    }
  };

  async function onSubmit(values: z.infer<typeof formSChema>) {
    console.log(values);
  }

  return (
    <section className="flex flex-col gap-4 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ReceiptText size={16} />
          <h3 className="text-lg font-medium">{title}</h3>
        </div>
        <div className="flex items-center gap-2">
          {!isAction ? (
            <Button variant="secondary">
              <Save />
              <p className="hidden @[275px]:block text-sm">Save</p>
            </Button>
          ) : (
            <Button variant="secondary">
              <RefreshCw />
              <p className="hidden @[275px]:block text-sm">Update</p>
            </Button>
          )}
        </div>
      </div>
      <div
        className={cn(
          "grid gap-12",
          !detailsOpen ? "grid-cols-1 mx-auto w-full max-w-md" : "grid-cols-2"
        )}
      >
        {detailsOpen && (
          <div className="flex flex-col gap-4">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-medium">Invoice Details</h2>
              {isAction && (
                <Button
                  variant="secondary"
                  size="icon"
                  onClick={() => setDetailsOpen(false)}
                >
                  <ChevronLeft />
                </Button>
              )}
            </div>
            <Form {...form}>
              <form
                onSubmit={form.handleSubmit(onSubmit)}
                className="space-y-6"
              >
                <FormField
                  control={form.control}
                  name="invoiceName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Invoice Name</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="imageUrl"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Image URL</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoiceLink"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Invoice Link</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceDueDate"
                    render={({ field }) => (
                      <FormItem className="flex-1">
                        <FormLabel>Due Date</FormLabel>
                        <FormControl>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                variant={"outline"}
                                className={cn(
                                  "justify-start text-left font-normal",
                                  !date && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {date ? (
                                  format(date, "PPP")
                                ) : (
                                  <span>Pick a date</span>
                                )}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent
                              className="w-auto p-0"
                              align="start"
                            >
                              <Calendar
                                mode="single"
                                selected={date}
                                onSelect={handleDateChange}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="isMonthly"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Plan</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2 h-9 whitespace-nowrap">
                            <Switch
                              id="isMonthly"
                              checked={field.value}
                              onCheckedChange={field.onChange}
                            />
                            <Label htmlFor="isMonthly">Monthly</Label>
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                <div className="relative">
                  <FormField
                    control={form.control}
                    name="invoiceAmount"
                    render={({ field }) => (
                      <FormItem className="col-span-2">
                        <FormLabel>Amount</FormLabel>
                        <FormControl>
                          <div className="flex items-center gap-2">
                            <Input
                              {...field}
                              onChange={handleChange}
                              value={getFormattedValue(field.value)}
                              inputMode="numeric"
                              placeholder="0,00"
                            />
                          </div>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <div className="absolute right-0 bottom-0">
                    <FormField
                      control={form.control}
                      name="invoiceType"
                      render={({ field }) => (
                        <FormItem className="col-span-1">
                          <FormControl>
                            <ToggleGroup
                              size="sm"
                              type="single"
                              value={field.value}
                              onValueChange={() => {
                                const newValue =
                                  field.value === "income"
                                    ? "expense"
                                    : "income";
                                form.setValue("invoiceType", newValue);
                              }}
                              className="mb-1 mr-1"
                            >
                              <ToggleGroupItem
                                value={field.value}
                                className={cn(
                                  "data-[state=on]:text-chart-1 data-[state=on]:bg-chart-1/20",
                                  field.value === "expense" &&
                                    "data-[state=on]:text-chart-2 data-[state=on]:bg-chart-2/20"
                                )}
                              >
                                {field.value === "income"
                                  ? "Income"
                                  : "Expense"}
                              </ToggleGroupItem>
                            </ToggleGroup>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  </div>
                </div>
                <FormField
                  control={form.control}
                  name="invoiceDescription"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Input {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <div className="flex items-center gap-4">
                  <FormField
                    control={form.control}
                    name="invoiceLogin"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Login</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoicePassword"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Password</FormLabel>
                        <FormControl>
                          <Input {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  <FormField
                    control={form.control}
                    name="invoiceStatus"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Status</FormLabel>
                        <FormControl>
                          <Select
                            value={field.value}
                            onValueChange={field.onChange}
                          >
                            <FormItem>
                              <FormControl>
                                <div>
                                  <SelectTrigger>
                                    <SelectValue placeholder="Select a status" />
                                  </SelectTrigger>
                                  <SelectContent>
                                    <SelectItem value="paid">Paid</SelectItem>
                                    <SelectItem value="unpaid">
                                      Unpaid
                                    </SelectItem>
                                  </SelectContent>
                                </div>
                              </FormControl>
                            </FormItem>
                          </Select>
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </form>
            </Form>
          </div>
        )}
        <div className="flex flex-col gap-4">
          {detailsOpen && <h2 className="text-lg font-medium">Preview</h2>}
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-medium">
                  Invoices #{invoiceId ? invoiceId : "000001"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Invoice created at{" "}
                  {format(createdAt || new Date(), "dd/MM/yyyy")}
                </p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 text-md",
                    formValues.invoiceStatus == "paid"
                      ? "text-chart-1 border-chart-1/40"
                      : "text-chart-2 border-chart-2/40"
                  )}
                >
                  {formValues.invoiceStatus == "paid" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <CircleX size={16} />
                  )}
                  {formValues.invoiceStatus}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-muted-foreground">Invoice Due Date:</p>
                <p className="flex items-center gap-2">
                  {date ? format(date, "dd/MM/yyyy") : "Not set"}{" "}
                  {formValues.isMonthly && <RotateCw size={12} />}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Invoice Amount:</p>
                <p>{getFormattedValue(formValues.invoiceAmount)}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Invoice Type:</p>
                <p className="capitalize">{formValues.invoiceType}</p>
              </div>
            </div>
            <div className="flex items-center justify-between gap-4 p-4 h-20 border rounded-lg">
              <div className="flex items-center gap-4">
                <div className="flex items-center justify-center aspect-square bg-card h-full p-2 rounded-lg">
                  {formValues.imageUrl ? (
                    <img
                      src={formValues.imageUrl}
                      alt="Invoice"
                      className="w-9 h-9 object-cover rounded-sm"
                      onError={(e) => {
                        e.currentTarget.src = "";
                        e.currentTarget.onerror = null;
                      }}
                    />
                  ) : (
                    <Images size={24} className="text-muted-foreground" />
                  )}
                </div>
                <div>
                  <p>{formValues.invoiceName || "Invoice Name"}</p>
                  <p className="max-w-40 text-xs text-muted-foreground truncate">
                    {formValues.invoiceDescription || "No description"}
                  </p>
                </div>
              </div>
              {formValues.invoiceLink && (
                <Link href={formValues.invoiceLink} target="_blank">
                  <ExternalLink size={16} />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 bg-card rounded-lg">
                <p className="text-muted-foreground">Invoice Login:</p>
                <p className="max-w-40 truncate">
                  {formValues.invoiceLogin || "No required"}
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <p className="text-muted-foreground">Invoice Password:</p>
                <p className="">
                  {formValues.invoicePassword
                    ? "***************"
                    : "No required"}
                </p>
              </div>
            </div>
            {isAction && (
              <div className="flex items-center gap-2">
                <Button
                  variant="secondary"
                  className="flex-1"
                  onClick={() => {
                    formValues.invoiceStatus == "paid"
                      ? form.setValue("invoiceStatus", "unpaid")
                      : form.setValue("invoiceStatus", "paid");
                  }}
                >
                  Change Status
                </Button>
                {!detailsOpen && (
                  <Button
                    variant="secondary"
                    onClick={() => setDetailsOpen(true)}
                  >
                    <PencilLine />
                  </Button>
                )}
                <Button variant="destructive">
                  <Trash />
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  );
}

export default InvoiceDetails;

"use client";

// React and Next.js hooks
import { useEffect, useState } from "react";

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
  RefreshCw,
  ChevronRight,
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
import loading from "@/public/images/loading.svg";
import { toast } from "sonner";
import {
  CreateInvoiceRequest,
  DeleteInvoiceRequest,
  UpdateInvoiceRequest,
} from "@/src/lib/invoices";
import { useRouter } from "next/navigation";

const formSChema = z.object({
  imageUrl: z.string().url().optional(),
  name: z.string(),
  link: z.string().url().optional(),
  login: z.string().optional(),
  password: z.string().optional(),
  type: z.enum(["income", "expense"]),
  dueDate: z.date(),
  amount: z.number(),
  description: z.string().optional(),
  monthly: z.boolean(),
  status: z.string(),
});

type Invoice = {
  invoiceId: string;
  createdAt: Date;
  name: string;
  imageUrl: string;
  link: string;
  dueDate: Date;
  monthly: boolean;
  amount: number;
  description: string;
  login: string;
  password: string;
  type: "income" | "expense";
  status: "paid" | "unpaid";
};

function InvoiceDetails({
  title,
  invoices,
  isAction,
}: {
  title: string;
  invoices: Invoice[];
  isAction?: boolean;
}) {
  const [index, setIndex] = useState(0);

  const form = useForm<z.infer<typeof formSChema>>({
    resolver: zodResolver(formSChema),
    defaultValues: {
      ...invoices[0],
      dueDate: new Date(invoices[0].dueDate),
      amount: Number(invoices[0].amount),
    },
  });

  useEffect(() => {
    const currentInvoice = invoices[index];
    if (currentInvoice) {
      form.reset({
        ...currentInvoice,
        dueDate: new Date(currentInvoice.dueDate),
        amount: Number(currentInvoice.amount),
      });
      setDate(new Date(currentInvoice.dueDate));
      setDisplayAmount(formatCurrency(Number(currentInvoice.amount)));
    }
  }, [index]);

  const router = useRouter();

  const formValues = form.watch();
  const [date, setDate] = useState<Date>(
    invoices[index].dueDate ? new Date(invoices[index].dueDate) : new Date()
  );
  const [isLoading, setIsLoading] = useState(false);
  const [displayAmount, setDisplayAmount] = useState("R$ 0,00");

  const {
    field: { value, onChange, ...field },
  } = useController({ name: "amount", control: form.control });

  useEffect(() => {
    const initialValue = form.getValues("amount") || 0;
    setDisplayAmount(formatCurrency(initialValue));
  }, []);

  const formatCurrency = (value: number) =>
    value.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const raw = e.target.value;
    const onlyDigits = raw.replace(/\D/g, "") || "0";
    const number = parseFloat((parseInt(onlyDigits) / 100).toFixed(2));

    form.setValue("amount", number);
    setDisplayAmount(formatCurrency(number));
  };

  const handleDateChange = (newDate: Date | undefined) => {
    if (newDate) {
      setDate(newDate);
      form.setValue("dueDate", newDate);
    }
  };

  async function onSubmitSave(values: z.infer<typeof formSChema>) {
    setIsLoading(true);
    const { success, data } = await CreateInvoiceRequest(values);
    if (success) {
      toast.success("Invoice created successfully");
      router.push("/projects/financial-tracker");
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
  }

  async function onSubmitUpdate(values: z.infer<typeof formSChema>) {
    setIsLoading(true);
    const { success, data } = await UpdateInvoiceRequest(
      values,
      Number(invoices[index].invoiceId)
    );
    if (success) {
      toast.success("Invoice updated successfully");
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
  }

  async function deleteInvoice(invoiceId: string) {
    const { success, data } = await DeleteInvoiceRequest(invoiceId);
    if (success) {
      toast.success("Invoice deleted successfully");
      router.push("/projects/financial-tracker");
    } else {
      toast.error(data.message);
    }
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
            <Button
              variant="secondary"
              disabled={isLoading}
              onClick={() => {
                form.handleSubmit(onSubmitSave)();
              }}
            >
              <Save />
              <p className="hidden @[275px]:block text-sm">Save</p>
              {isLoading && (
                <img src={loading.src} alt="loading" width={16} height={16} />
              )}
            </Button>
          ) : (
            <div className="flex items-center gap-2">
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  setIndex(index - 1);
                }}
                disabled={index === 0}
              >
                <ChevronLeft />
              </Button>
              <Button
                variant="secondary"
                size="icon"
                onClick={() => {
                  setIndex(index + 1);
                }}
                disabled={index === invoices.length - 1}
              >
                <ChevronRight />
              </Button>
            </div>
          )}
        </div>
      </div>
      <div className="grid grid-cols-2 gap-12">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-medium">Invoice Details</h2>
          </div>
          <Form {...form}>
            <form className="space-y-6">
              <FormField
                control={form.control}
                name="name"
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
                  name="link"
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
                  name="dueDate"
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
                          <PopoverContent className="w-auto p-0" align="start">
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
                  name="monthly"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Plan</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2 h-9 whitespace-nowrap">
                          <Switch
                            id="monthly"
                            checked={field.value}
                            onCheckedChange={field.onChange}
                          />
                          <Label htmlFor="monthly">Monthly</Label>
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
                  name="amount"
                  render={({ field }) => (
                    <FormItem className="col-span-2">
                      <FormLabel>Amount</FormLabel>
                      <FormControl>
                        <div className="flex items-center gap-2">
                          <Input
                            {...field}
                            onChange={handleChange}
                            value={displayAmount}
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
                    name="type"
                    render={({ field }) => (
                      <FormItem className="col-span-1">
                        <FormControl>
                          <ToggleGroup
                            size="sm"
                            type="single"
                            value={field.value}
                            onValueChange={() => {
                              const newValue =
                                field.value === "income" ? "expense" : "income";
                              form.setValue("type", newValue);
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
                              {field.value === "income" ? "Income" : "Expense"}
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
                name="description"
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
                  name="login"
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
                  name="password"
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
                  name="status"
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
                                  <SelectItem value="unpaid">Unpaid</SelectItem>
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
        <div className="flex flex-col gap-4">
          <h2 className="text-lg font-medium">Preview</h2>
          <div className="flex flex-col gap-4">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-medium">
                  Invoices #
                  {invoices[index].invoiceId
                    ? invoices[index].invoiceId
                    : "000001"}
                </h1>
                <p className="text-sm text-muted-foreground">
                  Invoice created at{" "}
                  {format(invoices[index].createdAt, "dd/MM/yyyy")}
                </p>
              </div>
              <div>
                <Badge
                  variant="outline"
                  className={cn(
                    "flex items-center gap-1 text-md",
                    formValues.status == "paid"
                      ? "text-chart-1 border-chart-1/40"
                      : "text-chart-2 border-chart-2/40"
                  )}
                >
                  {formValues.status == "paid" ? (
                    <CheckCircle size={16} />
                  ) : (
                    <CircleX size={16} />
                  )}
                  {formValues.status}
                </Badge>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-6">
              <div>
                <p className="text-muted-foreground">Invoice Due Date:</p>
                <p className="flex items-center gap-2">
                  {date ? format(date, "dd/MM/yyyy") : "Not set"}{" "}
                  {formValues.monthly && <RotateCw size={12} />}
                </p>
              </div>
              <div>
                <p className="text-muted-foreground">Invoice Amount:</p>
                <p>{displayAmount}</p>
              </div>
              <div>
                <p className="text-muted-foreground">Invoice Type:</p>
                <p className="capitalize">{formValues.type}</p>
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
                  <p>{formValues.name || "Invoice Name"}</p>
                  <p className="max-w-40 text-xs text-muted-foreground truncate">
                    {formValues.description || "No description"}
                  </p>
                </div>
              </div>
              {formValues.link && (
                <Link href={formValues.link} target="_blank">
                  <ExternalLink size={16} />
                </Link>
              )}
            </div>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-4 bg-card rounded-lg">
                <p className="text-muted-foreground">Invoice Login:</p>
                <p className="max-w-40 truncate">
                  {formValues.login || "No required"}
                </p>
              </div>
              <div className="p-4 bg-card rounded-lg">
                <p className="text-muted-foreground">Invoice Password:</p>
                <p className="">
                  {formValues.password ? "***************" : "No required"}
                </p>
              </div>
            </div>
            {isAction && (
              <div className="flex items-center gap-2">
                <Button
                  className="flex-1"
                  variant="secondary"
                  onClick={() => {
                    form.handleSubmit(onSubmitUpdate)();
                  }}
                >
                  <RefreshCw />
                  <p className="hidden @[275px]:block text-sm">Update</p>
                </Button>
                <Button
                  variant="destructive"
                  onClick={() => {
                    deleteInvoice(invoices[index].invoiceId);
                  }}
                >
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

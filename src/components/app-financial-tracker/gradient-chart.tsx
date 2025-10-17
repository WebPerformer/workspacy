"use client";

import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";
import { useEffect, useState } from "react";
import { GetInvoicesRequest } from "@/src/lib/invoices";
import { toast } from "sonner";
import { Invoice } from "./table";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/src/components/ui/card";
import {
  ChartConfig,
  ChartContainer,
  ChartTooltip,
  ChartTooltipContent,
} from "@/src/components/ui/chart";
import { Separator } from "@/src/components/ui/separator";

const chartConfig = {
  income: {
    label: "income",
    color: "var(--chart-1)",
  },
  expenses: {
    label: "expenses",
    color: "var(--chart-2)",
  },
} satisfies ChartConfig;

export function GradientChart() {
  const [chartData, setChartData] = useState<
    Array<{ month: string; income: number; expenses: number }>
  >([]);

  useEffect(() => {
    async function fetchInvoices() {
      const response = await GetInvoicesRequest();

      if (response.success) {
        // Transform the data to group by month and calculate income/expenses
        const monthlyData = response.data.reduce(
          (
            acc: { [key: string]: { income: number; expenses: number } },
            invoice: Invoice
          ) => {
            const date = new Date(invoice.dueDate);
            const month = date.toLocaleString("default", { month: "long" });

            if (!acc[month]) {
              acc[month] = { income: 0, expenses: 0 };
            }

            if (invoice.type === "income") {
              acc[month].income += invoice.amount;
            } else {
              acc[month].expenses += invoice.amount;
            }

            return acc;
          },
          {}
        );

        // Convert to array format needed by the chart
        const formattedData = (
          Object.entries(monthlyData) as [
            string,
            { income: number; expenses: number }
          ][]
        ).map(([month, data]) => ({
          month,
          income: data.income,
          expenses: data.expenses,
        }));

        setChartData(formattedData);
      } else {
        toast.error(response.data as string);
      }
    }
    fetchInvoices();
  }, []);

  return (
    <Card className="bg-transparent pb-2 sm:pb-4">
      <CardHeader>
        <div className="flex items-center gap-2 h-4">
          <CardTitle>Cash Flow</CardTitle>
          <Separator orientation="vertical" />
          <CardDescription className="flex items-center gap-2">
            Income <div className="bg-chart-1 w-2 h-2 rounded-full" />
            Expenses <div className="bg-chart-2 w-2 h-2 rounded-full" />
          </CardDescription>
        </div>
      </CardHeader>
      <CardContent className="pl-0 sm:pl-2 overflow-x-auto">
        <ChartContainer
          className="min-w-[500px] min-h-[200px] max-h-[350px] w-full h-full"
          config={chartConfig}
        >
          <AreaChart
            accessibilityLayer
            data={chartData}
            margin={{
              left: 0,
              right: 12,
              top: 8,
              bottom: 8,
            }}
            width={undefined}
            height={undefined}
          >
            <CartesianGrid vertical={false} />
            <XAxis
              dataKey="month"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => value.slice(0, 3)}
            />
            <YAxis
              dataKey="income"
              tickLine={false}
              axisLine={false}
              tickMargin={8}
              tickFormatter={(value) => {
                if (value >= 1000) {
                  return `${(value / 1000).toFixed(1)}K`;
                }
                return value;
              }}
            />
            <ChartTooltip cursor={false} content={<ChartTooltipContent />} />
            <defs>
              <linearGradient id="fillincome" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-1)"
                  stopOpacity={0.1}
                />
              </linearGradient>
              <linearGradient id="fillexpenses" x1="0" y1="0" x2="0" y2="1">
                <stop
                  offset="5%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.8}
                />
                <stop
                  offset="95%"
                  stopColor="var(--chart-2)"
                  stopOpacity={0.1}
                />
              </linearGradient>
            </defs>
            <Area
              dataKey="expenses"
              type="natural"
              fill="url(#fillexpenses)"
              fillOpacity={0.4}
              stroke="var(--chart-2)"
            />
            <Area
              dataKey="income"
              type="natural"
              fill="url(#fillincome)"
              fillOpacity={0.4}
              stroke="var(--chart-1)"
            />
          </AreaChart>
        </ChartContainer>
      </CardContent>
    </Card>
  );
}

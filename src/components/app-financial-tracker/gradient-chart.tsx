"use client";

import { TrendingUp } from "lucide-react";
import { Area, AreaChart, CartesianGrid, XAxis, YAxis } from "recharts";

import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
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
const chartData = [
  { month: "January", income: 1860, expenses: 800 },
  { month: "February", income: 3050, expenses: 2000 },
  { month: "March", income: 2370, expenses: 1200 },
  { month: "April", income: 2730, expenses: 1900 },
  { month: "May", income: 2090, expenses: 1900 },
  { month: "June", income: 2140, expenses: 2700 },
];

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

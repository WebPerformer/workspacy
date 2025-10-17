"use client";
import React, { useEffect, useState } from "react";
import { Badge } from "../ui/badge";
import { TrendingDown, TrendingUp } from "lucide-react";
import { GetMetricsRequest } from "@/src/lib/invoices";

function Cards() {
  const today = new Date();
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  const [metrics, setMetrics] = useState<any>(null);

  useEffect(() => {
    async function getMetrics() {
      const { success, data } = await GetMetricsRequest();
      if (success) {
        setMetrics(data);
      }
    }
    getMetrics();
  }, []);

  return (
    <div className="flex flex-wrap items-center gap-2">
      <div className="flex flex-col gap-12 bg-card rounded-lg p-4 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-base">My Balance</p>
              <Badge variant="outline" className="text-muted-foreground">
                {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                  month: "long",
                })}
                , {currentYear}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between w-full flex-1">
            <p className="text-3xl">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(metrics?.balance.current)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`${
              metrics?.balance.diff > 0
                ? "bg-green-300/20 text-green-500"
                : "bg-red-300/20 text-red-500"
            }`}
          >
            {metrics?.balance.diff > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <p>{metrics?.balance.diff ? metrics?.balance.diff : "N/A"}%</p>
          </Badge>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Compared with last month
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-12 bg-card rounded-lg p-4 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-base">Monthly Spent</p>
              <Badge variant="outline" className="text-muted-foreground">
                {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                  month: "long",
                })}
                , {currentYear}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-3xl">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(metrics?.expense.current)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`${
              metrics?.expense.diff > 0
                ? "bg-green-300/20 text-green-500"
                : "bg-red-300/20 text-red-500"
            }`}
          >
            {metrics?.expense.diff > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <p>{metrics?.expense.diff ? metrics?.expense.diff : "N/A"}%</p>
          </Badge>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Compared with last month
          </p>
        </div>
      </div>
      <div className="flex flex-col gap-12 bg-card rounded-lg p-4 flex-1">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-2">
            <div className="flex items-center justify-between w-full">
              <p className="text-base">Monthly Income</p>
              <Badge variant="outline" className="text-muted-foreground">
                {new Date(currentYear, currentMonth).toLocaleString("en-US", {
                  month: "long",
                })}
                , {currentYear}
              </Badge>
            </div>
          </div>
          <div className="flex items-center justify-between w-full">
            <p className="text-3xl">
              {new Intl.NumberFormat("pt-BR", {
                style: "currency",
                currency: "BRL",
              }).format(metrics?.income.current)}
            </p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge
            className={`${
              metrics?.income.diff > 0
                ? "bg-green-300/20 text-green-500"
                : "bg-red-300/20 text-red-500"
            }`}
          >
            {metrics?.income.diff > 0 ? (
              <TrendingUp size={16} />
            ) : (
              <TrendingDown size={16} />
            )}
            <p>{metrics?.income.diff ? metrics?.income.diff : "N/A"}%</p>
          </Badge>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            Compared with last month
          </p>
        </div>
      </div>
    </div>
  );
}

export default Cards;

"use client";

import React, { useState } from "react";
import { Button } from "../ui/button";
import { ChevronDown, Filter } from "lucide-react";
import { Separator } from "../ui/separator";
import { invoices } from "@/src/data/invoices";

type Invoice = {
  invoiceId: string;
  dueDate: string;
  imageUrl: string;
  name: string;
  amount: number;
  status: string;
};

function groupInvoicesByMonth(invoices: Invoice[]) {
  return invoices
    .filter((invoice) => invoice.status === "paid")
    .sort(
      (a, b) => new Date(b.dueDate).getTime() - new Date(a.dueDate).getTime()
    )
    .reduce((groups, invoice) => {
      const date = new Date(invoice.dueDate);
      const key = date.toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
      });

      if (!groups[key]) {
        groups[key] = [];
      }

      groups[key].push(invoice);
      return groups;
    }, {} as Record<string, Invoice[]>);
}

function RecentActivity() {
  const [loadMore, setLoadMore] = useState(8);
  const groupedInvoices = groupInvoicesByMonth(invoices.slice(0, loadMore));

  return (
    <div className="relative flex flex-col gap-6 bg-card border border-card rounded-lg p-4 flex-1 max-h-[415px] overflow-clip">
      <div className="flex flex-col gap-6 overflow-y-auto scrollbar-dialog">
        {Object.entries(groupedInvoices).map(([monthYear, invoices]) => (
          <div key={monthYear}>
            <p className="text-sm font-medium text-muted-foreground mb-2">
              {monthYear}
            </p>

            {invoices.map((invoice, index) => (
              <div key={invoice.invoiceId} className="space-y-2 mb-2">
                <div className="flex items-center justify-between gap-10">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg flex items-center justify-center p-2">
                      <img
                        src={invoice.imageUrl}
                        alt={invoice.name}
                        className="object-cover"
                      />
                    </div>
                    <div className="flex flex-col">
                      <p className="font-medium line-clamp-1">{invoice.name}</p>
                      <p className="text-xs text-muted-foreground whitespace-nowrap">
                        {new Date(invoice.dueDate).toLocaleDateString("en-US", {
                          month: "short",
                          day: "numeric",
                          year: "numeric",
                        })}
                      </p>
                    </div>
                  </div>
                  <p className="whitespace-nowrap">
                    {invoice.amount.toLocaleString("pt-BR", {
                      style: "currency",
                      currency: "BRL",
                    })}
                  </p>
                </div>
                {index < invoices.length - 1 && <Separator />}
              </div>
            ))}
          </div>
        ))}
        {loadMore < invoices.length ? (
          <Button
            variant="outline"
            className="w-full"
            onClick={() => setLoadMore(loadMore + 5)}
          >
            <ChevronDown className="w-4 h-4" />
          </Button>
        ) : (
          <Button
            variant="secondary"
            className="w-full"
            onClick={() => setLoadMore(loadMore + 5)}
          >
            No more invoices to show
          </Button>
        )}
      </div>
    </div>
  );
}

export default RecentActivity;

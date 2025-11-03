"use client";
import { useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { toast } from "sonner";

import { ExternalLink, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "..//ui/skeleton";

import { getCustomers } from "@/src/lib/customers";

interface Customer {
  customer_id: string;
  name: string;
  email: string;
  phone: string;
  slug: string;
  subscription_id: string;
  status: boolean;
  created_at: string;
  updated_at: string;
}

interface CustomersCardsProps {
  onCountChange?: (count: number) => void;
}

export default function CustomersCards({ onCountChange }: CustomersCardsProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    setLoading(true);
    const result = await getCustomers();

    if (result?.success) {
      setCustomers(result.data);
      onCountChange?.(result.count);
    } else {
      toast.error("Failed to fetch customers");
    }

    setLoading(false);
  };

  if (loading) {
    return (
      <div className="grid @[575px]:grid-cols-2 @[775px]:grid-cols-3 gap-2">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={i} className="border rounded-lg p-2 @[575px]:p-3">
            <div className="flex flex-col gap-3 @[575px]:gap-6">
              <Skeleton className="flex items-center justify-center h-14 rounded-lg" />
              <div className="flex items-center justify-between">
                <div className="flex-1 space-y-2">
                  <Skeleton className="h-4 w-[100px]" />
                  <Skeleton className="h-3 w-[140px]" />
                </div>
                <Skeleton className="h-4 w-4 rounded-md mx-2" />
              </div>
              <div className="flex flex-col gap-1">
                <Skeleton className="h-3 w-[90%]" />
                <Skeleton className="h-3 w-[80%]" />
                <Skeleton className="h-3 w-[70%]" />
              </div>
              <div className="flex items-center justify-between">
                <Skeleton className="h-5 w-[60px] rounded-full" />
                <Skeleton className="h-5 w-[60px] rounded-full" />
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-card rounded-lg cursor-pointer p-4 border hover:shadow-md transition-shadow">
        <div className="text-center">
          <p>Erro ao carregar customers: {error}</p>
          <Button onClick={fetchCustomers} variant="outline" className="mt-2">
            Tentar novamente
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="grid @[575px]:grid-cols-2 @[775px]:grid-cols-3 gap-2">
      {customers.map((customer) => (
        <Link
          key={customer.customer_id}
          href={`/customers/${customer.slug}`}
          className="bg-card border border-transparent rounded-lg cursor-pointer p-2 @[575px]:p-3 hover:border-border hover:-translate-y-1 ease-in transition-all duration-150 block"
        >
          <div>
            <div className="flex flex-col gap-3 @[575px]:gap-6">
              <div className="flex items-center justify-center bg-border h-14 rounded-lg">
                <User size={26} className="text-muted-foreground" />
              </div>
              <div className="flex items-center justify-between">
                <div
                  style={{ lineBreak: "anywhere" }}
                  className="min-w-0 flex-1"
                >
                  <p className="line-clamp-1">{customer.name}</p>
                  <p className="text-xs text-muted-foreground line-clamp-1">
                    {customer.email}
                  </p>
                </div>
                <ExternalLink
                  size={16}
                  className="text-muted-foreground mx-2"
                />
              </div>
              <div className="flex flex-col gap-1">
                <p className="text-xs text-muted-foreground">
                  Customer_ID:{" "}
                  <span className="text-foreground">
                    {customer.customer_id}
                  </span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Phone:{" "}
                  <span className="text-foreground">{customer.phone}</span>
                </p>
                <p className="text-xs text-muted-foreground">
                  Slug: <span className="text-foreground">{customer.slug}</span>
                </p>
              </div>
              <div className="flex items-center justify-between">
                <Badge variant="outline">{customer.created_at}</Badge>
                <Badge
                  className={
                    customer.status
                      ? "text-green-700 bg-green-300"
                      : "text-red-700 bg-red-300"
                  }
                >
                  {customer.status ? "Active" : "Inactive"}
                </Badge>
              </div>
            </div>
          </div>
        </Link>
      ))}

      {customers.length === 0 && (
        <div className="col-span-3 text-center">
          <User size={38} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">No customers found</p>
        </div>
      )}
    </div>
  );
}

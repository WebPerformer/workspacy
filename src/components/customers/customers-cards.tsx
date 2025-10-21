"use client";

import { Check, Copy, Ellipsis, User } from "lucide-react";
import { Badge } from "../ui/badge";
import { Button } from "../ui/button";
import { Skeleton } from "..//ui/skeleton";

import { useEffect, useMemo, useState } from "react";
import { Popover, PopoverContent, PopoverTrigger } from "../ui/popover";

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
  search: string;
  onCountChange?: (count: number) => void;
}

export default function CustomersCards({
  search,
  onCountChange,
}: CustomersCardsProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const [copied, setCopied] = useState<string | null>(null);

  const handleCopy = async (label: string, value: string) => {
    await navigator.clipboard.writeText(value);
    setCopied(label);
    setTimeout(() => setCopied(null), 1500);
  };

  const filteredCustomers = useMemo(() => {
    if (!search.trim()) return customers;
    return customers.filter((c) =>
      c.customer_id.toString().includes(search.trim())
    );
  }, [search, customers]);

  useEffect(() => {
    fetchCustomers();
  }, []);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/stripe/customers");

      const result = await response.json();

      if (result.success) {
        setCustomers(result.data || []);
        onCountChange?.(result.count);
      } else {
        throw new Error(result.error || "Failed to fetch customers");
      }
    } catch (err) {
      console.error("Fetch error details:", err);
      setError(err instanceof Error ? err.message : "An error occurred");
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="grid grid-cols-2 gap-2">
        {Array.from({ length: 2 }).map((_, i) => (
          <div
            key={i}
            className="rounded-lg p-2 border hover:shadow-md transition-shadow"
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <Skeleton className="h-8 w-8 rounded-lg" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-3 w-[100px]" />
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Skeleton className="h-5 w-[60px] rounded-full" />
                <Skeleton className="h-6 w-6 rounded-md" />
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
    <div className="grid @[675px]:grid-cols-2 gap-2">
      {filteredCustomers.map((customer) => (
        <div
          key={customer.customer_id}
          className="bg-card border border-transparent rounded-lg cursor-pointer p-2 @[675px]:p-3 hover:border-border hover:-translate-y-1 ease-in transition-all duration-150"
        >
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="bg-border p-2 h-fit rounded-lg">
                <User size={20} className="text-muted-foreground" />
              </div>
              <div style={{ lineBreak: "anywhere" }} className="min-w-0 flex-1">
                <p className="line-clamp-1">{customer.name}</p>
                <p className="text-xs text-muted-foreground line-clamp-1">
                  {customer.email}
                </p>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Badge
                className={
                  customer.status
                    ? "text-green-700 bg-green-300"
                    : "text-red-700 bg-red-300"
                }
              >
                {customer.status ? "Active" : "Inactive"}
              </Badge>
              <Popover>
                <PopoverTrigger asChild>
                  <Button size="sm" variant="outline">
                    <Ellipsis size={16} />
                  </Button>
                </PopoverTrigger>
                <PopoverContent align="end" className="w-48 p-1">
                  <div className="space-y-1">
                    <Button
                      size="sm"
                      onClick={() =>
                        handleCopy("id", customer.customer_id.toString())
                      }
                      className="w-full flex items-center text-xs font-normal justify-between rounded-md bg-border hover:bg-border/50 transition"
                    >
                      <span className="lowercase">{customer.customer_id}</span>
                      {copied === "id" ? (
                        <Check className="text-green-600" />
                      ) : (
                        <Copy className="text-muted-foreground" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      onClick={() =>
                        handleCopy("phone", customer.phone ?? "No phone")
                      }
                      className="w-full flex items-center text-xs font-normal justify-between rounded-md bg-border hover:bg-border/50 transition"
                    >
                      <span>{customer.phone}</span>
                      {copied === "phone" ? (
                        <Check className="text-green-600" />
                      ) : (
                        <Copy className="text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>
            </div>
          </div>
        </div>
      ))}

      {customers.length === 0 && (
        <div className="bg-card rounded-lg p-8 border text-center">
          <User size={48} className="text-muted-foreground mx-auto mb-4" />
          <p className="text-muted-foreground">Nenhum customer encontrado</p>
        </div>
      )}
    </div>
  );
}

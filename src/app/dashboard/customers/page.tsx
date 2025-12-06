"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getAllUsers } from "@/src/lib/user";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/src/components/ui/table";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Users } from "lucide-react";
import Image from "next/image";

interface Customer {
  id: string;
  username: string;
  email: string;
  profileImage: string | null;
  role: "admin" | "user";
  config: {
    id: string;
    selected_template_id: string | null;
    template_url: string | null;
    is_template_configured: boolean;
    stripe_customer_id: string | null;
  } | null;
}

const CustomerSkeleton = () => (
  <div className="space-y-4">
    {Array.from({ length: 5 }).map((_, i) => (
      <div key={i} className="flex items-center gap-4 p-4 border rounded-lg">
        <Skeleton className="h-10 w-10 rounded-full" />
        <div className="flex-1 space-y-2">
          <Skeleton className="h-4 w-32" />
          <Skeleton className="h-3 w-48" />
        </div>
        <Skeleton className="h-6 w-20" />
        <Skeleton className="h-6 w-24" />
      </div>
    ))}
  </div>
);

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await getAllUsers();

      if (result.success) {
        setCustomers(result.data);
      } else {
        setError(result.error || "Erro ao carregar clientes");
        toast.error(result.error || "Erro ao carregar clientes");
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error ? err.message : "Erro desconhecido";
      setError(errorMessage);
      toast.error("Erro ao carregar clientes");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  if (loading) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <h3 className="text-lg font-medium">Meus Clientes</h3>
          </div>
        </div>
        <CustomerSkeleton />
      </section>
    );
  }

  if (error) {
    return (
      <section className="flex flex-col gap-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users size={20} />
            <h3 className="text-lg font-medium">Meus Clientes</h3>
          </div>
        </div>
        <div className="text-center py-8">
          <p className="text-muted-foreground">{error}</p>
        </div>
      </section>
    );
  }

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={20} />
          <h3 className="text-lg font-medium">Meus Clientes</h3>
        </div>
        <p className="text-sm text-muted-foreground">
          {customers.length}{" "}
          {customers.length === 1 ? "cliente" : "clientes"}
        </p>
      </div>

      {customers.length === 0 ? (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum cliente encontrado</p>
        </div>
      ) : (
        <div className="border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Usuário</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Perfil</TableHead>
                <TableHead>Template Configurado</TableHead>
                <TableHead>Status</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {customers.map((customer) => (
                <TableRow key={customer.id}>
                  <TableCell>
                    <div className="flex items-center gap-3">
                      {customer.profileImage &&
                      typeof customer.profileImage === "string" &&
                      customer.profileImage.trim() !== "" ? (
                        <Image
                          src={
                            customer.profileImage.startsWith("http")
                              ? customer.profileImage
                              : `/images/avatars/${customer.profileImage}.svg`
                          }
                          alt={customer.username}
                          width={40}
                          height={40}
                          className="rounded-full object-cover"
                        />
                      ) : (
                        <div className="h-10 w-10 rounded-full bg-muted flex items-center justify-center">
                          <span className="text-sm font-medium">
                            {customer.username.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      )}
                      <div className="flex flex-col">
                        <span className="font-medium">{customer.username}</span>
                        <span className="text-xs text-muted-foreground">
                          ID: {customer.id.slice(0, 8)}...
                        </span>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <span className="text-sm">{customer.email}</span>
                  </TableCell>
                  <TableCell>
                    <Badge
                      variant={
                        customer.role === "admin" ? "default" : "secondary"
                      }
                    >
                      {customer.role === "admin" ? "Admin" : "Usuário"}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {customer.config?.is_template_configured ? (
                      <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                        Configurado
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Não configurado
                      </Badge>
                    )}
                  </TableCell>
                  <TableCell>
                    {customer.config?.stripe_customer_id ? (
                      <Badge variant="outline" className="bg-blue-50 text-blue-700 border-blue-200">
                        Cliente Stripe
                      </Badge>
                    ) : (
                      <Badge variant="outline" className="bg-gray-50 text-gray-700 border-gray-200">
                        Sem Stripe
                      </Badge>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      )}
    </section>
  );
}


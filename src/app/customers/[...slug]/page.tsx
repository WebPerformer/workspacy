"use client";
import { User } from "lucide-react";
import { useCustomerProfile } from "@/src/hooks/useCustomProfile";
import { use } from "react";

export default function AppCustomerDetail({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = use(params);
  const { customer, loading, error } = useCustomerProfile(slug);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!customer) return <div>No customer found</div>;

  return (
    <section className="flex flex-col gap-6 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <User size={16} />
          <h3 className="text-lg font-medium">{customer.name}</h3>
        </div>
      </div>

      <div className="rounded-lg border p-4">
        <p className="font-medium">{customer.name}</p>
        <p className="text-sm text-muted-foreground">{customer.email}</p>
      </div>
    </section>
  );
}

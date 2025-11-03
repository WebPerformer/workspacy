"use client";
import { useState } from "react";
import { Users } from "lucide-react";
import CustomersCards from "./customers/customers-cards";

export default function AppCustomers() {
  const [customerCount, setCustomerCount] = useState(0);

  return (
    <section className="flex flex-col gap-6 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Users size={16} />
          <h3 className="text-lg font-medium">My Customers</h3>
          <div className="min-w-7 h-6 bg-accent rounded-md border flex items-center justify-center leading-0 p-2">
            <span>{customerCount}</span>
          </div>
        </div>
      </div>
      <CustomersCards onCountChange={setCustomerCount} />
    </section>
  );
}

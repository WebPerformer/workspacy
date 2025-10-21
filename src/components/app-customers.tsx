"use client";
import { useState } from "react";
import { Users, Search } from "lucide-react";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import CustomersCards from "./customers/customers-cards";

export default function AppCustomers() {
  const [search, setSearch] = useState("");
  const [showSearch, setShowSearch] = useState(false);
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
        <div className="flex items-center gap-2">
          {showSearch && (
            <Input
              placeholder="Search by ID..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="transition-all"
            />
          )}

          <Button
            variant="secondary"
            className="text-muted-foreground hover:text-foreground"
            onClick={() => setShowSearch((prev) => !prev)}
          >
            <Search />
          </Button>
        </div>
      </div>
      <CustomersCards search={search} onCountChange={setCustomerCount} />
    </section>
  );
}

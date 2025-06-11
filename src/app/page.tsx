// Docs: https://docs.dndkit.com/presets/sortable

"use client";

import { useContext } from "react";

import QuickAccess from "@/src/components/dashboard/quick-access";
import FinancialTracker from "@/src/components/dashboard/financial-tracker";

import { AuthContext } from "@/src/contexts/AuthContext";

export default function Home() {
  const { user } = useContext(AuthContext);

  return (
    <div className="flex flex-col gap-10 sm:gap-16">
      <QuickAccess />
      {user && <FinancialTracker />}
    </div>
  );
}

import React from "react";
import { GradientChart } from "@/src/components/app-financial-tracker/gradient-chart";
import TableFinancialTracker from "@/src/components/app-financial-tracker/table";
import Header from "@/src/components/app-financial-tracker/header";
import Cards from "@/src/components/app-financial-tracker/cards";
import RecentActivity from "@/src/components/app-financial-tracker/recent-activity";

function FinancialTracker() {
  return (
    <section className="flex flex-col gap-4 @container">
      <Header />
      <Cards />
      <div className="flex flex-wrap gap-2">
        <TableFinancialTracker />
        <RecentActivity />
      </div>
      <GradientChart />
    </section>
  );
}

export default FinancialTracker;

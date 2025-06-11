import TableFinancialTracker from "@/src/components/app-financial-tracker/table";
import { CircleDollarSign, SquareArrowOutUpRight } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

function FinancialTracker() {
  return (
    <section className="flex flex-col gap-4 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CircleDollarSign size={16} />
          <h3 className="text-lg font-medium">Financial Tracker</h3>
        </div>
        <Link href="/projects/financial-tracker">
          <Button variant="secondary">
            <SquareArrowOutUpRight size={16} />
            <p className="hidden @[275px]:block">Enter App</p>
          </Button>
        </Link>
      </div>
      <TableFinancialTracker />
    </section>
  );
}

export default FinancialTracker;

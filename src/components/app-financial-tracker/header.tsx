import { CircleDollarSign, Plus } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import Link from "next/link";

function Header() {
  return (
    <div className="flex items-center justify-between">
      <div className="flex items-center gap-2">
        <CircleDollarSign size={16} />
        <h3 className="text-lg font-medium">Financial Tracker</h3>
      </div>
      <div className="flex items-center gap-2">
        <Link href="/projects/financial-tracker/create-invoice">
          <Button variant="secondary">
            <Plus />
            <p className="hidden @[275px]:block text-sm">Create Invoice</p>
          </Button>
        </Link>
      </div>
    </div>
  );
}

export default Header;

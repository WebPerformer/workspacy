import { Button } from "@/src/components/ui/button";
import { PencilLine, Plus } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Invoice } from "./types";

interface ActionButtonsProps {
  selectedInvoices: Invoice[];
}

export function ActionButtons({ selectedInvoices }: ActionButtonsProps) {
  const router = useRouter();

  const handleClick = () => {
    localStorage.setItem("selectedInvoices", JSON.stringify(selectedInvoices));
    router.push("/projects/financial-tracker/update-invoice");
  };

  return (
    <div className="flex items-center gap-2">
      <Button
        variant="secondary"
        onClick={handleClick}
        disabled={selectedInvoices.length === 0}
      >
        <PencilLine />
      </Button>
      <Link href="/projects/financial-tracker/create-invoice">
        <Button variant="secondary">
          <Plus /> Create Invoice
        </Button>
      </Link>
    </div>
  );
}

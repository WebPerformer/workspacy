"use client";
import InvoiceDetails from "@/src/components/app-financial-tracker/invoice-details";

function UpdateInvoice() {
  const invoices = JSON.parse(localStorage.getItem("selectedInvoices") || "[]");

  return (
    <InvoiceDetails
      title="Update Invoice"
      invoices={invoices}
      isAction={true}
    />
  );
}

export default UpdateInvoice;

import InvoiceDetails from "@/src/components/app-financial-tracker/invoice-details";

function UpdateInvoice() {
  return (
    <InvoiceDetails
      title="Invoice Action"
      invoiceId="000002"
      createdAt={new Date(2025, 0, 1)}
      invoiceName="Invoice 1"
      imageUrl="https://upload.wikimedia.org/wikipedia/commons/7/75/Netflix_icon.svg"
      invoiceLink="https://www.google.com"
      dueDate={new Date(2025, 0, 1)}
      monthly={true}
      amount={6500}
      description="Invoice 1 description"
      login="login"
      password="password"
      type="expense"
      status="unpaid"
      isAction={true}
    />
  );
}

export default UpdateInvoice;

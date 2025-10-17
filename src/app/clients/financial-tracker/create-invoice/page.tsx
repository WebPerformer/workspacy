import InvoiceDetails from "@/src/components/app-financial-tracker/invoice-details";

function CreateInvoice() {
  return (
    <InvoiceDetails
      title=" Create New Invoice"
      invoices={[
        {
          invoiceId: "",
          createdAt: new Date(),
          name: "",
          imageUrl: "",
          link: "",
          dueDate: new Date(),
          monthly: false,
          amount: 0,
          description: "",
          login: "",
          password: "",
          type: "income",
          status: "unpaid",
        },
      ]}
      isAction={false}
    />
  );
}

export default CreateInvoice;

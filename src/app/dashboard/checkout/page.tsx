"use client";

import { useSearchParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { StripeProvider } from "@/src/components/stripe/stripe-provider";
import { createPaymentIntent } from "@/src/lib/payment";
import { Ticket } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function CheckoutPage() {
  const searchParams = useSearchParams();
  const router = useRouter();

  const priceId = searchParams.get("price_id");
  const productId = searchParams.get("product_id");
  const mode = searchParams.get("mode") as "payment" | "subscription";
  const amountParam = searchParams.get("amount");
  const tier = searchParams.get("tier");

  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const amount = amountParam ? parseInt(amountParam, 10) : 0;

  useEffect(() => {
    if (!priceId || !productId || !mode) return;

    const createIntent = async () => {
      try {
        setLoading(true);
        const result = await createPaymentIntent({
          price_id: priceId,
          mode,
          product_id: productId,
        });

        if (result.success) {
          setClientSecret(result.client_secret);
        } else {
          console.error("Failed to create payment intent:", result);
        }
      } catch (err) {
        console.error("Checkout error:", err);
      } finally {
        setLoading(false);
      }
    };

    createIntent();
  }, [priceId, productId, mode]);

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center">
        <p className="text-muted-foreground">Carregando checkout...</p>
      </div>
    );
  }

  if (!priceId || !mode) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Link de checkout inválido. Parâmetros ausentes.
        </p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  if (!clientSecret) {
    return (
      <div className="h-screen flex flex-col items-center justify-center gap-4">
        <p className="text-muted-foreground">
          Ocorreu um erro ao iniciar o checkout.
        </p>
        <Button onClick={() => router.back()}>Voltar</Button>
      </div>
    );
  }

  return (
    <section className="flex flex-col gap-6 @container">
      <StripeProvider
        clientSecret={clientSecret}
        priceId={priceId}
        mode={mode}
        amount={amount}
        tier={tier || undefined}
        onSuccess={() => router.push("/dashboard/success")}
        onCancel={() => router.push("/dashboard")}
      />
    </section>
  );
}

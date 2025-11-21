"use client";

import { useState } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/src/components/ui/button";
import { Loader2 } from "lucide-react";
import { createSubscription } from "@/src/lib/payment";
import { StripeCheckoutProps } from "@/src/types/stripe";

export function StripeCheckout({
  priceId,
  mode,
  amount,
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!stripe || !elements) {
    return (
      <div className="max-w-md mx-auto p-6 border rounded-lg bg-card text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Carregando checkout...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout exceeded")), 30000)
    );

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Erro no formulário");
        setLoading(false);
        return;
      }

      if (mode === "payment") {
        const paymentPromise = stripe.confirmPayment({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success`,
          },
          redirect: "if_required",
        });

        const result = (await Promise.race([
          paymentPromise,
          timeoutPromise,
        ])) as Awaited<ReturnType<typeof stripe.confirmPayment>>;

        if (result.error) {
          setError(result.error.message || "Erro no pagamento");
        } else {
          onSuccess();
        }
      } else {
        const setupPromise = stripe.confirmSetup({
          elements,
          confirmParams: {
            return_url: `${window.location.origin}/payment/success`,
          },
          redirect: "if_required",
        });

        const result = (await Promise.race([
          setupPromise,
          timeoutPromise,
        ])) as Awaited<ReturnType<typeof stripe.confirmSetup>>;

        if (result.error) {
          setError(result.error.message || "Erro na configuração do pagamento");
        } else if ("setupIntent" in result && result.setupIntent) {
          await createSubscriptionAfterSetup(result.setupIntent);
        }
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado no processamento");
    } finally {
      setLoading(false);
    }
  };

  const createSubscriptionAfterSetup = async (setupIntent: any) => {
    try {
      if (setupIntent?.status === "succeeded" && setupIntent.payment_method) {
        // Chamar seu backend para criar a assinatura
        const result = await createSubscription({
          price_id: priceId,
          payment_method_id: setupIntent.payment_method as string,
        });

        if (result.success) {
          onSuccess();
        } else {
          setError(result.error || "Erro ao criar assinatura");
        }
      } else {
        console.error("❌ SetupIntent not succeeded:", setupIntent);
        setError("Configuração de pagamento não concluída");
      }
    } catch (err) {
      console.error(
        "❌ Unexpected error in createSubscriptionAfterSetup:",
        err
      );
      setError("Erro ao processar assinatura");
    }
  };

  return (
    <div className="max-w-sm mx-auto space-y-6">
      <div>
        <h3 className="text-lg font-medium line-clamp-1">
          Detalhes do pagamento
        </h3>
        <p className="text-muted-foreground w-4/5">
          Conclua sua compra fornecendo os detalhes de pagamento do pedido.
        </p>
      </div>

      <div className="mb-4 p-4 bg-card rounded-lg">
        <p className="font-semibold">
          Total:{" "}
          {(amount / 100).toLocaleString("pt-BR", {
            style: "currency",
            currency: "BRL",
          })}
        </p>
        <p className="text-sm text-muted-foreground">
          {mode === "subscription" ? "Assinatura mensal" : "Comprar Template"}
        </p>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <PaymentElement
          options={{
            layout: "tabs" as const,
          }}
        />

        {error && (
          <div className="p-3 text-sm text-destructive bg-destructive/10 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4">
          <Button
            type="button"
            variant="secondary"
            onClick={onCancel}
            disabled={loading}
          >
            Cancelar
          </Button>
          <Button type="submit" disabled={!stripe || loading}>
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Processando...
              </>
            ) : (
              `Pagar ${(amount / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}`
            )}
          </Button>
        </div>
      </form>
    </div>
  );
}

"use client";

import { useState, useEffect } from "react";
import {
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { Loader2 } from "lucide-react";
import { createSubscription } from "@/src/lib/payment";
import { StripeCheckoutProps } from "@/src/types/stripe";
import { hasUsedTrialClient } from "@/src/lib/subscriptions-client";

export function StripeCheckout({
  priceId,
  mode,
  amount,
  tier,
  onSuccess,
  onCancel,
}: StripeCheckoutProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasUsedTrialBefore, setHasUsedTrialBefore] = useState<boolean>(false);
  const [loadingTrialCheck, setLoadingTrialCheck] = useState(true);

  useEffect(() => {
    const checkTrial = async () => {
      // Só verificar se for assinatura básica
      if (mode === "subscription" && tier === "basic") {
        try {
          const result = await hasUsedTrialClient();
          if (result.success) {
            setHasUsedTrialBefore(result.has_used_trial);
          }
        } catch (error) {
          console.error("Erro ao verificar trial:", error);
        } finally {
          setLoadingTrialCheck(false);
        }
      } else {
        setLoadingTrialCheck(false);
      }
    };
    checkTrial();
  }, [mode, tier]);

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
          // Se o pagamento está pendente, redirecionar com parâmetros
          if (result.payment_pending) {
            const params = new URLSearchParams();
            params.set("payment_pending", "true");
            params.set("status", result.status || "incomplete");
            const successUrl = `/dashboard/success?${params.toString()}`;
            window.location.href = successUrl;
          } else {
            // Se o pagamento foi confirmado, usar o callback normal
            onSuccess();
          }
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
        {mode === "subscription" &&
        tier === "basic" &&
        !hasUsedTrialBefore &&
        !loadingTrialCheck ? (
          <>
            <div className="flex items-center justify-between mb-2">
              <div>
                <p className="font-semibold text-lg text-green-500">
                  Grátis por 14 dias
                </p>
                <p className="text-xs text-muted-foreground">
                  Depois: {(amount / 100).toLocaleString("pt-BR", {
                    style: "currency",
                    currency: "BRL",
                  })}/mês
                </p>
              </div>
              <Badge className="bg-green-500 hover:bg-green-600 text-white">
                14 dias grátis
              </Badge>
            </div>
            <p className="text-sm text-muted-foreground">
              Assinatura mensal • Período de avaliação gratuito
            </p>
            <p className="text-xs text-muted-foreground mt-1">
              A cobrança será iniciada automaticamente após 14 dias
            </p>
          </>
        ) : (
          <>
            <p className="font-semibold">
              Total:{" "}
              {(amount / 100).toLocaleString("pt-BR", {
                style: "currency",
                currency: "BRL",
              })}
              {mode === "subscription" && (
                <span className="text-muted-foreground font-normal">/mês</span>
              )}
            </p>
            <p className="text-sm text-muted-foreground">
              {mode === "subscription" ? "Assinatura mensal" : "Comprar Template"}
            </p>
          </>
        )}
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
            ) : mode === "subscription" &&
              tier === "basic" &&
              !hasUsedTrialBefore &&
              !loadingTrialCheck ? (
              "Iniciar avaliação grátis"
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

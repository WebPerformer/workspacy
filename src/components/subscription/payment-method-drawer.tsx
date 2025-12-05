"use client";

import { useState, useEffect } from "react";
import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/src/components/ui/drawer";
import { Button } from "@/src/components/ui/button";
import {
  Elements,
  useStripe,
  useElements,
  PaymentElement,
} from "@stripe/react-stripe-js";
import { loadStripe } from "@stripe/stripe-js";
import { Loader2 } from "lucide-react";
import {
  createSetupIntent,
  updatePaymentMethod,
} from "@/src/lib/subscriptions";
import { toast } from "sonner";

let stripePromise: any = null;

const getStripe = () => {
  if (!stripePromise) {
    stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!);
  }
  return stripePromise;
};

interface PaymentMethodFormProps {
  onSuccess: () => void;
  onCancel: () => void;
}

function PaymentMethodForm({ onSuccess, onCancel }: PaymentMethodFormProps) {
  const stripe = useStripe();
  const elements = useElements();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!stripe || !elements) {
    return (
      <div className="max-w-md mx-auto p-6 border rounded-lg bg-card text-center">
        <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
        <p>Carregando formulário de pagamento...</p>
      </div>
    );
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!stripe || !elements) return;

    setLoading(true);
    setError(null);

    const timeoutPromise = new Promise((_, reject) =>
      setTimeout(() => reject(new Error("Timeout excedido")), 30000)
    );

    try {
      const { error: submitError } = await elements.submit();
      if (submitError) {
        setError(submitError.message || "Erro no formulário");
        setLoading(false);
        return;
      }

      const setupPromise = stripe.confirmSetup({
        elements,
        confirmParams: {
          return_url: `${window.location.origin}/dashboard/manage-subscription`,
        },
        redirect: "if_required",
      });

      const result = (await Promise.race([
        setupPromise,
        timeoutPromise,
      ])) as Awaited<ReturnType<typeof stripe.confirmSetup>>;

      if (result.error) {
        setError(
          result.error.message || "Erro ao configurar método de pagamento"
        );
      } else if ("setupIntent" in result && result.setupIntent) {
        await updatePaymentMethodAfterSetup(result.setupIntent);
      }
    } catch (err: any) {
      setError(err.message || "Erro inesperado no processamento");
    } finally {
      setLoading(false);
    }
  };

  const updatePaymentMethodAfterSetup = async (setupIntent: any) => {
    try {
      if (setupIntent?.status === "succeeded" && setupIntent.payment_method) {
        const result = await updatePaymentMethod(
          setupIntent.payment_method as string
        );

        if (result.success) {
          toast.success("Método de pagamento atualizado com sucesso!");
          onSuccess();
        } else {
          setError(result.error || "Erro ao atualizar método de pagamento");
        }
      } else {
        console.error("❌ SetupIntent não concluído:", setupIntent);
        setError("Configuração de pagamento não concluída");
      }
    } catch (err) {
      console.error(
        "❌ Erro inesperado ao atualizar método de pagamento:",
        err
      );
      setError("Erro ao processar atualização");
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div>
        <h3 className="text-lg font-medium mb-2">
          Adicionar novo método de pagamento
        </h3>
        <p className="text-sm text-muted-foreground">
          Insira os dados do seu novo cartão de crédito. Este será o método de
          pagamento usado para futuras cobranças.
        </p>
      </div>

      <div className="p-4 bg-muted/20 rounded-lg">
        <PaymentElement
          options={{
            layout: "tabs" as const,
          }}
        />
      </div>

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
            "Salvar método de pagamento"
          )}
        </Button>
      </div>
    </form>
  );
}

interface PaymentMethodDrawerProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onPaymentMethodUpdated?: () => void;
}

export default function PaymentMethodDrawer({
  open,
  onOpenChange,
  onPaymentMethodUpdated,
}: PaymentMethodDrawerProps) {
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);
  const [stripe, setStripe] = useState<any>(null);

  useEffect(() => {
    setStripe(getStripe());
  }, []);

  useEffect(() => {
    if (open && !clientSecret) {
      const fetchSetupIntent = async () => {
        try {
          setLoading(true);
          const result = await createSetupIntent();
          if (result.success && result.clientSecret) {
            setClientSecret(result.clientSecret);
          } else {
            toast.error(
              result.error || "Erro ao carregar formulário de pagamento"
            );
            onOpenChange(false);
          }
        } catch (error) {
          console.error("Erro ao criar SetupIntent:", error);
          toast.error("Erro ao carregar formulário de pagamento");
          onOpenChange(false);
        } finally {
          setLoading(false);
        }
      };

      fetchSetupIntent();
    } else if (!open) {
      // Reset quando o drawer fecha
      setClientSecret("");
    }
  }, [open, clientSecret, onOpenChange]);

  const handleSuccess = () => {
    onOpenChange(false);
    if (onPaymentMethodUpdated) {
      onPaymentMethodUpdated();
    }
  };

  const handleCancel = () => {
    onOpenChange(false);
  };

  if (!stripe) {
    return null;
  }

  const options = {
    clientSecret,
    appearance: {
      theme: "stripe" as const,
      rules: {
        ".Label": {
          color: "oklch(0.89 0.0029 264.54)",
        },
        ".Input": {
          backgroundColor: "oklch(0.1906 0.0026 247.96)",
          borderColor: "oklch(0.2572 0.0095 276.72)",
          color: "oklch(0.89 0.0029 264.54)",
        },
        ".Input:focus": {
          borderColor: "oklch(0.51 0.2492 299.15)",
          boxShadow: "0 0 0 1px #000000",
        },
      },
    },
  };

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <DrawerHeader>
          <DrawerTitle className="sr-only">Mudar Assinatura</DrawerTitle>
        </DrawerHeader>
        <div className="mx-auto w-full max-w-md max-h-[70vh] flex flex-col">
          <div className="flex-1 overflow-y-auto p-6">
            {loading ? (
              <div className="flex flex-col items-center justify-center py-8">
                <Loader2 className="w-8 h-8 animate-spin mb-4" />
                <p className="text-muted-foreground">
                  Carregando formulário de pagamento...
                </p>
              </div>
            ) : clientSecret ? (
              <Elements stripe={stripe} options={options}>
                <PaymentMethodForm
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </Elements>
            ) : (
              <div className="flex flex-col items-center justify-center py-8">
                <p className="text-muted-foreground">
                  Erro ao carregar formulário de pagamento
                </p>
              </div>
            )}
          </div>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

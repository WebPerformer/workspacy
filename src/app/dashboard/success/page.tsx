// success/page.tsx - VERSÃO COM BOTÃO DINÂMICO
"use client";

import { Button } from "@/src/components/ui/button";
import { Check, Clock, AlertCircle } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { useSearchParams } from "next/navigation";
import { getUserConfig } from "@/src/lib/user";
import { Skeleton } from "@/src/components/ui/skeleton";

export default function SuccessPage() {
  const searchParams = useSearchParams();
  const [isConfigured, setIsConfigured] = useState<boolean | null>(null);
  const [loading, setLoading] = useState(true);
  const paymentPending = searchParams.get("payment_pending") === "true";
  const subscriptionStatus = searchParams.get("status");

  useEffect(() => {
    const checktemplateConfig = async () => {
      try {
        const userConfig = await getUserConfig();
        setIsConfigured(userConfig?.is_template_configured || false);
      } catch (error) {
        console.error("Error checking template config:", error);
        setIsConfigured(false);
      } finally {
        setLoading(false);
      }
    };

    checktemplateConfig();
  }, []);

  if (loading) {
    return (
      <div className="max-w-md mx-auto space-y-6">
        {/* Header Skeleton */}
        <div className="space-y-4">
          <Skeleton className="w-8 h-8 rounded-md" />
          <Skeleton className="h-8 w-48 mx-auto" />
          <Skeleton className="h-4 w-64 mx-auto" />
        </div>

        {/* Card Skeleton */}
        <div className="relative aspect-video flex flex-col justify-between p-6 bg-card rounded-md overflow-clip space-y-4">
          <Skeleton className="h-6 w-32" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-24" />
            <Skeleton className="h-5 w-40" />
          </div>
          {/* <Skeleton className="absolute w-1/2 aspect-square rounded-full bg-primary -bottom-20 -right-20 blur-2xl opacity-20" /> */}
        </div>

        {/* Botões Skeleton */}
        <div className="flex gap-3">
          <Skeleton className="h-10 flex-1 rounded-md" />
          <Skeleton className="h-10 flex-1 rounded-md" />
        </div>

        {/* Mensagem Skeleton */}
        <div className="space-y-2">
          <Skeleton className="h-6 w-36" />
          <Skeleton className="h-4 w-full" />
          <Skeleton className="h-4 w-3/4" />
        </div>
      </div>
    );
  }

  // Determinar o estado do pagamento
  const isPaymentPending = paymentPending || subscriptionStatus === "incomplete";

  return (
    <div className="max-w-md mx-auto space-y-6">
      {/* Header com ícone dinâmico baseado no status */}
      <div>
        {isPaymentPending ? (
          <>
            <div className="w-8 h-8 bg-yellow-500 rounded-md flex items-center justify-center mb-6">
              <Clock size={16} className="text-white" />
            </div>
            <h1 className="text-2xl">Pagamento em Análise</h1>
            <p className="text-muted-foreground mt-2">
              Seu pagamento está sendo processado. Você receberá uma confirmação em breve.
            </p>
          </>
        ) : (
          <>
            <div className="w-8 h-8 bg-green-600 rounded-md flex items-center justify-center mb-6">
              <Check size={16} />
            </div>
            <h1 className="text-2xl">Pagamento Confirmado!</h1>
            <p className="text-muted-foreground mt-2">
              Sua compra foi processada com sucesso
            </p>
          </>
        )}
      </div>

      {/* Card do Produto */}
      <div className="relative aspect-video flex flex-col justify-between p-6 bg-card rounded-md overflow-clip border">
        {isPaymentPending ? (
          <>
            <h1 className="text-xl font-semibold">Aguardando Confirmação</h1>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                Seu pagamento está sendo verificado
              </p>
              <p className="font-medium">
                Assim que confirmado, você receberá acesso completo
              </p>
            </div>
          </>
        ) : (
          <>
            <h1 className="text-xl font-semibold">
              {isConfigured ? "Template Ativo" : "Pronto pra ativar"}
            </h1>
            <div className="space-y-1">
              <p className="text-sm text-muted-foreground">
                {isConfigured ? "Já está configurado" : "Seu template está pronto"}
              </p>
              <p className="font-medium">
                {isConfigured
                  ? "Aproveite seu template!"
                  : "Basta ativar e configurar do seu jeito"}
              </p>
            </div>
          </>
        )}
        <div className="absolute w-1/2 aspect-square rounded-full bg-primary -bottom-20 -right-20 blur-2xl opacity-20" />
      </div>

      {/* Botões de ação DINÂMICOS */}
      <div className="flex items-center gap-2">
        {!isConfigured && (
          <Link href="/dashboard/template-setup">
            <Button variant="outline" className="w-full">
              Configurar Template
            </Button>
          </Link>
        )}
        <Link href="/dashboard">
          <Button className="w-full">Continuar</Button>
        </Link>
      </div>
      {/* Mensagem de agradecimento */}
      <div>
        {isPaymentPending ? (
          <>
            <h3 className="text-xl">O que acontece agora?</h3>
            <p className="text-muted-foreground mt-2">
              Seu pagamento está sendo processado pelo banco emissor do cartão. 
              Isso pode levar alguns minutos. Você receberá um e-mail de confirmação 
              assim que o pagamento for aprovado e sua assinatura for ativada.
            </p>
            <p className="text-muted-foreground mt-2 text-sm">
              <strong>Dica:</strong> Você pode verificar o status da sua assinatura 
              na página de gerenciamento de assinatura.
            </p>
          </>
        ) : (
          <>
            <h3 className="text-xl">Obrigado pela compra!</h3>
            <p className="text-muted-foreground mt-2">
              {isConfigured
                ? "Seu template já está ativo e configurado."
                : "Agora você pode aproveitar seu template da forma que quiser."}
            </p>
          </>
        )}
      </div>
    </div>
  );
}

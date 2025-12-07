"use client";

import React, { useEffect, useState } from "react";
import { Check, CreditCard, Calendar, AlertCircle } from "lucide-react";
import { Button } from "@/src/components/ui/button";
import { getUserConfig } from "@/src/lib/user";
import { getTemplates } from "@/src/lib/templates";
import { Template } from "@/src/types/template";
import Image from "next/image";
import loadingSvg from "@/public/images/loading.svg";
import ChangeSubscriptionDrawer from "@/src/components/subscription/subscription-drawer";
import PaymentMethodDrawer from "@/src/components/subscription/payment-method-drawer";
import { ActiveSubscription } from "@/src/types/subscriptions";
import { cancelSubscription } from "@/src/lib/subscriptions";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

export default function Page() {
  const [activeSubscription, setActiveSubscription] =
    useState<ActiveSubscription | null>(null);
  const [subscriptionTemplates, setSubscriptionTemplates] = useState<
    Template[]
  >([]);
  const [loading, setLoading] = useState(true);
  const [showChangeSubscription, setShowChangeSubscription] = useState(false);
  const [showPaymentMethodDrawer, setShowPaymentMethodDrawer] = useState(false);
  const [showCancelDialog, setShowCancelDialog] = useState(false);
  const [cancelling, setCancelling] = useState(false);

  const refreshSubscriptionData = async () => {
    try {
      setLoading(true);

      const config = await getUserConfig();
      const templatesResult = await getTemplates();

      if (templatesResult?.success && Array.isArray(templatesResult.data)) {
        const templates: Template[] = templatesResult.data;
        const subscriptions = templates.filter(
          (template) => template.price?.type === "recurring"
        );

        setSubscriptionTemplates(subscriptions);

        // Lógica para encontrar plano ativo
        const activeSubs = subscriptions.filter(
          (sub) => sub.has_access === true
        );

        // Ordenar por tier/level (premium > professional > basic)
        const tierLevels: Record<string, number> = {
          basic: 1,
          professional: 2,
          premium: 3,
        };

        activeSubs.sort((a, b) => {
          const levelA =
            tierLevels[
              typeof a.metadata?.level === "string"
                ? a.metadata.level
                : a.tier || "basic"
            ] || 0;
          const levelB =
            tierLevels[
              typeof b.metadata?.level === "string"
                ? b.metadata.level
                : b.tier || "basic"
            ] || 0;
          return levelB - levelA;
        });

        // Pega a assinatura de maior nível
        if (activeSubs.length > 0) {
          const highestTierSub = activeSubs[0];

          setActiveSubscription({
            id: highestTierSub.id,
            name: highestTierSub.name,
            amount: highestTierSub.price.unit_amount / 100,
            interval: highestTierSub.price.recurring?.interval || "month",
            category: highestTierSub.metadata?.category || "",
            tier:
              typeof highestTierSub.metadata?.level === "string"
                ? highestTierSub.metadata.level
                : highestTierSub.tier || "basic",
            priceId: highestTierSub.price.id,
            hasAccess: highestTierSub.has_access,
          });
        } else {
          // Se não tem assinatura ativa
          setActiveSubscription(null);
        }
      }
    } catch (error) {
      console.error("Erro ao atualizar dados:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    refreshSubscriptionData(); // Usa a mesma função
  }, []);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleCancelSubscription = () => {
    setShowCancelDialog(true);
  };

  const confirmCancelSubscription = async () => {
    setCancelling(true);
    setShowCancelDialog(false);

    const result = await cancelSubscription();
    if (result.success) {
      toast.success("Assinatura cancelada com sucesso!");
      refreshSubscriptionData();
    } else {
      toast.error(result.error || "Erro ao cancelar assinatura");
    }

    setCancelling(false);
  };

  return (
    <section className="flex flex-col gap-6 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={16} />
          <h3 className="text-lg font-medium line-clamp-1">
            Cobranças e Pagamentos
          </h3>
        </div>
      </div>

      <div className="flex flex-wrap md:flex-nowrap gap-10 md:gap-6">
        {/* Plano Atual */}
        <div className="flex flex-col gap-4 flex-1/2">
          <div className="w-full bg-card p-4 rounded-md">
            <div className="flex justify-between mb-2">
              <div className="flex flex-col gap-2">
                {loading ? (
                  <div className="flex items-center gap-2">
                    <Image
                      src={loadingSvg}
                      alt="loading"
                      width={20}
                      height={20}
                    />
                    <span className="text-muted-foreground">Carregando...</span>
                  </div>
                ) : activeSubscription ? (
                  <>
                    <div className="flex items-center gap-4">
                      <h5 className="font-bold">{activeSubscription.name}</h5>
                      <span
                        className={`text-xs px-3 py-1 rounded-full bg-muted-foreground/20`}
                      >
                        {activeSubscription.category ||
                          activeSubscription.tier.toUpperCase()}
                      </span>
                    </div>
                    <div className="flex items-center gap-2">
                      <Calendar size={14} className="text-muted-foreground" />
                      <p className="text-muted-foreground text-sm">
                        Renovação mensal
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <h5 className="font-bold">Nenhum Plano Ativo</h5>
                    <p className="text-muted-foreground text-sm">
                      Você não tem uma assinatura ativa
                    </p>
                  </>
                )}
              </div>
              {activeSubscription && (
                <div className="h-fit bg-primary p-[4px] rounded-full">
                  <Check size={14} />
                </div>
              )}
            </div>

            {activeSubscription && (
              <div className="py-3 bg-muted/20 rounded-lg">
                <div className="flex items-center justify-between">
                  <span className="font-medium">Valor mensal:</span>
                  <span className="text-lg font-bold">
                    {formatCurrency(activeSubscription.amount)}
                    <span className="text-xs text-primary pl-1">
                      /{activeSubscription.interval === "month" ? "mês" : "ano"}
                    </span>
                  </span>
                </div>
              </div>
            )}

            <p className="text-muted-foreground mt-3">
              {activeSubscription
                ? "Você pode atualizar seu plano a qualquer momento para aproveitar ao máximo o produto."
                : "Adquira um plano para começar a usar nossos serviços."}
            </p>
          </div>

          <div className="flex gap-2">
            {activeSubscription && (
              <>
                <Button
                  variant="secondary"
                  className="flex-1/2 sm:w-fit"
                  onClick={() => setShowChangeSubscription(true)}
                >
                  Mudar Assinatura
                </Button>
                <Button
                  variant="destructive"
                  className="flex-1/2 sm:w-fit"
                  onClick={handleCancelSubscription}
                >
                  Cancelar Assinatura
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Método de Pagamento */}
        <div className="flex flex-col gap-4 flex-1/2">
          <div className="bg-card p-4 rounded-md flex flex-col justify-between">
            <div className="flex gap-4">
              {activeSubscription ? (
                <>
                  <div className="pt-[1px]">
                    <CreditCard size={20} />
                  </div>
                  <div className="w-full flex flex-col gap-2">
                    <div className="flex items-center justify-between">
                      <h5 className="font-bold flex gap-2 items-center">
                        Cartão de Crédito
                      </h5>
                      <p className="text-xs px-2 py-0.5 bg-secondary rounded">
                        Ativo
                      </p>
                    </div>
                    <div>
                      <p className="text-muted-foreground">
                        Método cadastrado via Stripe
                      </p>
                      <p className="text-muted-foreground">
                        Próxima cobrança: 01/{new Date().getMonth() + 2}/
                        {new Date().getFullYear()}
                      </p>
                    </div>
                    <button
                      className="w-fit bg-transparent underline text-sm hover:text-primary transition-colors"
                      onClick={() => setShowPaymentMethodDrawer(true)}
                    >
                      Gerenciar pagamentos
                    </button>
                  </div>
                </>
              ) : (
                <div className="flex flex-col flex-1 items-center justify-center py-4 text-center">
                  <AlertCircle
                    size={24}
                    className="text-muted-foreground mb-2"
                  />
                  <p className="text-muted-foreground">
                    Nenhum método de pagamento cadastrado
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Drawer para Mudar Assinatura */}
      <ChangeSubscriptionDrawer
        subscriptionTemplates={subscriptionTemplates}
        activeSubscription={activeSubscription}
        open={showChangeSubscription}
        onOpenChange={setShowChangeSubscription}
        onSubscriptionChanged={refreshSubscriptionData}
      />

      {/* Drawer para Atualizar Método de Pagamento */}
      <PaymentMethodDrawer
        open={showPaymentMethodDrawer}
        onOpenChange={setShowPaymentMethodDrawer}
        onPaymentMethodUpdated={refreshSubscriptionData}
      />

      {/* Dialog de Confirmação de Cancelamento */}
      <Dialog open={showCancelDialog} onOpenChange={setShowCancelDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Cancelar Assinatura</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja cancelar sua assinatura? Esta ação não pode
              ser desfeita e você perderá acesso aos recursos do plano atual.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => setShowCancelDialog(false)}
              disabled={cancelling}
            >
              Não, manter assinatura
            </Button>
            <Button
              variant="destructive"
              onClick={confirmCancelSubscription}
              disabled={cancelling}
            >
              {cancelling ? "Cancelando..." : "Sim, cancelar assinatura"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

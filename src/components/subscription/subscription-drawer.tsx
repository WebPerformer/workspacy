"use client";

import { useState } from "react";
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
import { Badge } from "@/src/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { changeSubscription } from "@/src/lib/subscriptions";
import { Template } from "@/src/types/template";
import { toast } from "sonner";

interface ActiveSubscription {
  id: string;
  name: string;
  amount: number;
  interval: string;
  category: string;
  tier: string;
  priceId: string;
  hasAccess: boolean;
}

interface ChangeSubscriptionDrawerProps {
  subscriptionTemplates: Template[];
  activeSubscription: ActiveSubscription | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubscriptionChanged?: () => void; // Callback após mudança
}

export default function ChangeSubscriptionDrawer({
  subscriptionTemplates,
  activeSubscription,
  open,
  onOpenChange,
  onSubscriptionChanged,
}: ChangeSubscriptionDrawerProps) {
  const [selectedOption, setSelectedOption] = useState<string>(
    activeSubscription?.id || ""
  );
  const [loading, setLoading] = useState(false);

  const formatCurrency = (amount: number) => {
    return amount.toLocaleString("pt-BR", {
      style: "currency",
      currency: "BRL",
    });
  };

  const handleChangeSubscription = async () => {
    if (!selectedOption || !activeSubscription) return;

    const selectedPlan = subscriptionTemplates.find(
      (sub) => sub.id === selectedOption
    );

    if (!selectedPlan) return;

    setLoading(true);

    try {
      const result = await changeSubscription({
        current_price_id: activeSubscription.priceId,
        new_price_id: selectedPlan.price.id,
      });

      if (result.success) {
        toast.success("Assinatura alterada com sucesso!");

        // Fechar drawer
        onOpenChange(false);

        // Chamar callback para atualizar dados
        if (onSubscriptionChanged) {
          onSubscriptionChanged();
        }

        // Se quiser redirecionar para página de sucesso ou fazer algo específico
        // window.location.reload();
      } else {
        toast.error(result.error || "Erro ao alterar assinatura");
      }
    } catch (error) {
      toast.error("Erro ao processar mudança");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  // Encontrar o plano selecionado
  const selectedPlan = subscriptionTemplates.find(
    (sub) => sub.id === selectedOption
  );

  return (
    <Drawer open={open} onOpenChange={onOpenChange}>
      <DrawerContent>
        <div className="mx-auto w-full max-w-md max-h-[70vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Mudar Assinatura</DrawerTitle>
            <DrawerDescription>
              Escolha um novo plano para sua conta
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
            >
              {subscriptionTemplates.map((subscription) => (
                <label
                  key={subscription.id}
                  htmlFor={subscription.id}
                  className={`rounded-lg p-4 space-y-2 cursor-pointer block transition-colors hover:bg-muted/40 ${
                    selectedOption === subscription.id
                      ? "border bg-muted/20 border-primary"
                      : "border border-transparent bg-muted/20"
                  }`}
                >
                  <div>
                    <div className="flex items-center gap-3">
                      <RadioGroupItem
                        value={subscription.id}
                        id={subscription.id}
                      />
                      <div className="flex-1">
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <h4 className="font-medium">
                                {subscription.name}
                              </h4>
                              {subscription.id === activeSubscription?.id && (
                                <Badge variant="outline" className="text-xs">
                                  Atual
                                </Badge>
                              )}
                            </div>
                            <p className="text-xs text-muted-foreground">
                              {subscription.metadata?.category}
                            </p>
                          </div>
                          <Badge variant="secondary">
                            {(
                              subscription.price.unit_amount / 100
                            ).toLocaleString("pt-BR", {
                              style: "currency",
                              currency: "BRL",
                            })}
                            {subscription.price.recurring?.interval ===
                              "month" && "/mês"}
                          </Badge>
                        </div>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="w-4 h-4 flex-shrink-0" />
                      <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                        {Object.entries(subscription.metadata)
                          .filter(
                            ([key, value]) =>
                              key.startsWith("advantages_") &&
                              typeof value === "string"
                          )
                          .map(([key, value]) => (
                            <li key={key}>
                              <span className="text-green-400">✓</span>{" "}
                              {value as string}
                            </li>
                          ))}
                      </ul>
                    </div>
                  </div>
                </label>
              ))}
            </RadioGroup>

            {/* Informações de Upgrade/Downgrade */}
            {selectedOption &&
              activeSubscription &&
              selectedOption !== activeSubscription.id &&
              selectedPlan && (
                <div className="mt-6 p-4 bg-muted/20 rounded-lg">
                  <h4 className="font-medium mb-2">Detalhes da Mudança</h4>
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span>Plano atual:</span>
                      <span className="font-medium">
                        {activeSubscription.name}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Novo plano:</span>
                      <span className="font-medium">{selectedPlan.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Diferença mensal:</span>
                      <span
                        className={`font-medium ${
                          (selectedPlan.price.unit_amount || 0) >
                          activeSubscription.amount * 100
                            ? "text-green-600"
                            : "text-orange-600"
                        }`}
                      >
                        {formatCurrency(
                          ((selectedPlan.price.unit_amount || 0) -
                            activeSubscription.amount * 100) /
                            100
                        )}
                        {(selectedPlan.price.unit_amount || 0) >
                        activeSubscription.amount * 100
                          ? " mais"
                          : " menos"}
                      </span>
                    </div>
                    <div className="pt-2 text-xs text-muted-foreground">
                      <p>
                        A mudança será aplicada no próximo ciclo de cobrança.
                      </p>
                    </div>
                  </div>
                </div>
              )}
          </div>

          <DrawerFooter className="mt-auto">
            <Button
              className="w-full"
              size="lg"
              onClick={handleChangeSubscription}
              disabled={
                !selectedOption ||
                selectedOption === activeSubscription?.id ||
                loading
              }
            >
              {loading
                ? "Processando..."
                : selectedOption === activeSubscription?.id
                ? "Plano Atual Selecionado"
                : "Confirmar Mudança"}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline" disabled={loading}>
                Cancelar
              </Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

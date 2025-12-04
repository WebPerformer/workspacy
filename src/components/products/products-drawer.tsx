"use client";

import {
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
  DrawerTrigger,
} from "@/src/components/ui/drawer";
import { Button } from "@/src/components/ui/button";
import { Badge } from "@/src/components/ui/badge";
import { RadioGroup, RadioGroupItem } from "@/src/components/ui/radio-group";
import { useState } from "react";
import { StripeProvider } from "../stripe/stripe-provider";
import { useRouter } from "next/navigation";
import { PurchaseDrawerProps } from "@/src/types/template";
import Image from "next/image";
import loadingSvg from "@/public/images/loading.svg";

const tierLevels: Record<string, number> = {
  basic: 1,
  professional: 2,
  premium: 3,
};

export function PurchaseDrawer({
  template,
  subscriptionTemplates,
}: PurchaseDrawerProps) {
  const [selectedOption, setSelectedOption] = useState<string>("one_time");
  const [showCheckout, setShowCheckout] = useState(false);
  const [clientSecret, setClientSecret] = useState<string>("");
  const [loading, setLoading] = useState(false);

  const router = useRouter();

  const availableSubscriptions = subscriptionTemplates.filter(
    (subscription) => {
      const subscriptionTierLevel =
        tierLevels[subscription.metadata.tier || ""] || 0;
      const templateTierLevel = tierLevels[template.metadata.tier || ""] || 0;

      return subscriptionTierLevel >= templateTierLevel;
    }
  );

  const getSelectedPriceInfo = () => {
    if (selectedOption === "one_time") {
      return {
        amount: template.price.unit_amount,
        mode: "payment" as const,
        priceId: template.price.id,
      };
    } else {
      // Buscar a subscription selecionada pelo ID
      const selectedSubscription = subscriptionTemplates.find(
        (sub) => sub.id === selectedOption
      );
      return {
        amount: selectedSubscription?.price.unit_amount || 0,
        mode: "subscription" as const,
        priceId: selectedSubscription?.price.id || "",
      };
    }
  };

  const handlePurchase = async () => {
    setLoading(true);
    try {
      let priceIdToUse: string | undefined;
      let productIdToUse: string;

      if (selectedOption === "one_time") {
        priceIdToUse = template.price.id;
        productIdToUse = template.id;
      } else {
        const selectedSubscription = subscriptionTemplates.find(
          (sub) => sub.id === selectedOption
        );
        priceIdToUse = selectedSubscription?.price.id;
        productIdToUse = template.id;
      }

      const amount =
        selectedOption === "one_time"
          ? template.price.unit_amount
          : subscriptionTemplates.find((sub) => sub.id === selectedOption)
              ?.price.unit_amount;

      router.push(
        `/dashboard/checkout?price_id=${priceIdToUse}&product_id=${productIdToUse}&mode=${
          selectedOption === "one_time" ? "payment" : "subscription"
        }&amount=${amount}`
      );
    } catch (error) {
      console.error("Error preparing checkout:", error);
    } finally {
      setLoading(false);
    }
  };

  if (showCheckout && clientSecret) {
    const selectedPrice = getSelectedPriceInfo();

    return (
      <StripeProvider
        clientSecret={clientSecret}
        priceId={selectedPrice.priceId}
        mode={selectedPrice.mode}
        amount={selectedPrice.amount}
        onSuccess={() => {
          setShowCheckout(false);
        }}
        onCancel={() => setShowCheckout(false)}
      />
    );
  }

  return (
    <Drawer>
      <DrawerTrigger asChild>
        <Button className="w-full">Obter Website</Button>
      </DrawerTrigger>

      <DrawerContent>
        <div className="mx-auto w-full max-w-md max-h-[70vh] flex flex-col">
          <DrawerHeader>
            <DrawerTitle>Opções de Compra</DrawerTitle>
            <DrawerDescription>
              Escolha como deseja adquirir {template.name}
            </DrawerDescription>
          </DrawerHeader>

          <div className="flex-1 overflow-y-auto px-4">
            <RadioGroup
              value={selectedOption}
              onValueChange={setSelectedOption}
              className="space-y-4"
            >
              {/* Compra Avulsa */}
              <label
                htmlFor="one_time"
                className={`rounded-lg p-4 space-y-2 cursor-pointer block transition-colors hover:bg-muted/40 ${
                  selectedOption === "one_time"
                    ? "border bg-muted/20 border-primary"
                    : "border border-transparent bg-muted/20"
                }`}
              >
                <div className="flex items-center gap-3">
                  <RadioGroupItem value="one_time" id="one_time" />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">Compra Avulsa</h4>
                        <p className="text-xs text-muted-foreground">
                          Adquira esse template
                        </p>
                      </div>
                      <Badge variant="secondary">
                        {(template.price.unit_amount / 100).toLocaleString(
                          "pt-BR",
                          { style: "currency", currency: "BRL" }
                        )}
                      </Badge>
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-4 h-4 flex-shrink-0" />
                  <ul className="text-xs text-muted-foreground space-y-1 mt-2">
                    {Object.entries(template.metadata)
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
              </label>

              {/* Assinaturas */}
              <div className="space-y-3">
                <h3 className="font-semibold text-sm">
                  Ou inclua em uma assinatura:
                </h3>
                {availableSubscriptions.map((subscription) => (
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
                              <h4 className="font-medium">
                                {subscription.name}
                              </h4>
                              <p className="text-xs text-muted-foreground">
                                {subscription.metadata.category}
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
              </div>
            </RadioGroup>
          </div>

          <DrawerFooter className="mt-auto">
            <Button
              className="w-full"
              size="lg"
              onClick={handlePurchase}
              disabled={loading}
            >
              {loading ? (
                <Image src={loadingSvg} alt="loading" width={20} height={20} />
              ) : selectedOption === "one_time" ? (
                "Comprar Agora"
              ) : (
                "Assinar Plano"
              )}
            </Button>
            <DrawerClose asChild>
              <Button variant="outline">Cancelar</Button>
            </DrawerClose>
          </DrawerFooter>
        </div>
      </DrawerContent>
    </Drawer>
  );
}

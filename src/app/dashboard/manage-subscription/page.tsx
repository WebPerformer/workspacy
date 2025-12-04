import React from "react";
import { ChartNoAxesGantt, Check, CreditCard } from "lucide-react";
import { Button } from "@/src/components/ui/button";

export default function page() {
  return (
    <section className="flex flex-col gap-6 @container">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <CreditCard size={16} />
          <h3 className="text-lg font-medium line-clamp-1">
            Cobranças e Pagementos
          </h3>
        </div>
      </div>
      <div>
        <h3 className="text-base mb-2">Overview de Assinatura</h3>
        <p className="text-muted-foreground">
          resumo de todos os seus pagamentos e assinaturas dos aplicativos que
          você adquiriu.
        </p>
      </div>
      <div className="flex flex-wrap md:flex-nowrap gap-10 md:gap-6 pt-10 border-t">
        <div className="flex flex-col gap-4 flex-1/2">
          <h3 className="text-base">Plano Atual</h3>
          <div className="flex gap-4 bg-card p-4 rounded-md">
            <div className="pt-[1px]">
              <ChartNoAxesGantt size={20} />
            </div>
            <div className="w-full">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-4">
                  <h5 className="font-bold">Basic Plan</h5>
                  <p className="">
                    $99<span className="text-xs text-primary pl-1">/Month</span>
                  </p>
                </div>
                <div className="bg-primary p-[3px] rounded-full">
                  <Check size={12} />
                </div>
              </div>
              <p className="text-muted-foreground">
                Você pode atualizar seu plano a qualquer momento para aproveitar
                ao máximo o produto.
              </p>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="secondary" className="flex-1/2 sm:w-fit">
              Mudar Assinatura
            </Button>
            <Button variant="destructive" className="flex-1/2 sm:w-fit">
              Cancelar Assinatura
            </Button>
          </div>
        </div>
        <div className="flex flex-col gap-4 flex-1/2">
          <h3 className="text-base">Detalhes de Pagamento</h3>
          <div className="bg-card p-4 rounded-md h-full flex flex-col justify-between">
            <div className="flex gap-4">
              <div className="pt-[1px]">
                <CreditCard size={20} />
              </div>
              <div className="w-full flex flex-col gap-2">
                <div className="flex items-center justify-between">
                  <h5 className="font-bold flex gap-2 items-center">Visa</h5>
                  <p className="text-xs px-2 py-0.5 bg-secondary rounded">
                    Crédito
                  </p>
                </div>
                <div>
                  <p className="text-muted-foreground">
                    Titular: João da Silva
                  </p>
                  <p className="text-muted-foreground">************1234</p>
                  <p className="text-muted-foreground">
                    Validade:{" "}
                    <span className="text-foreground font-medium">
                      01/12/2031
                    </span>
                  </p>
                </div>
                <button className="w-fit bg-transparent underline">
                  Alterar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div className="w-full bg-card p-4 mt-2 rounded-md">
        <h4 className="font-semibold mb-2">Histórico de Pagamento</h4>
        <div className="overflow-x-auto max-h-[400px]">
          <table className="min-w-full  text-xs">
            <thead>
              <tr className="border-b border-border text-left">
                <th className="py-2 px-1">Data</th>
                <th className="py-2 px-1">Valor</th>
                <th className="py-2 px-1">Status</th>
                <th className="py-2 px-1">Transação</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td className="py-2 px-1 whitespace-nowrap">02/12/2024</td>
                <td className="py-2 px-1 text-green-300 font-semibold">
                  R$99,00
                </td>
                <td className="py-2 px-1">Pago</td>
                <td className="py-2 px-1">#pag1234</td>
              </tr>
              <tr>
                <td className="py-2 px-1 whitespace-nowrap">02/11/2024</td>
                <td className="py-2 px-1 text-green-300 font-semibold">
                  R$99,00
                </td>
                <td className="py-2 px-1">Pago</td>
                <td className="py-2 px-1">#pag1188</td>
              </tr>
              <tr>
                <td className="py-2 px-1 whitespace-nowrap">02/10/2024</td>
                <td className="py-2 px-1 text-red-300 font-semibold">
                  R$99,00
                </td>
                <td className="py-2 px-1">Falha</td>
                <td className="py-2 px-1">#pag1147</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

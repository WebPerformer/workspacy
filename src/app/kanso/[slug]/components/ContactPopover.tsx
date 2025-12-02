// app/components/ContactPopover.tsx
"use client";

import { Button } from "@/src/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/src/components/ui/popover";
import {
  Instagram,
  Mail,
  MessageCircle,
  Twitter,
  Phone,
  ChevronDown,
} from "lucide-react";

interface ContactPopoverProps {
  variant?: "default" | "mobile";
  contactInfo?: {
    email?: string | null;
    phone?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    whatsapp?: string | null;
  };
}

export function ContactPopover({
  variant = "default",
  contactInfo,
}: ContactPopoverProps) {
  // Filtrar apenas os contatos que existem
  const hasContactInfo =
    contactInfo?.email ||
    contactInfo?.whatsapp ||
    contactInfo?.instagram ||
    contactInfo?.twitter;

  if (!hasContactInfo) {
    return (
      <Button
        disabled
        variant="outline"
        className={variant === "mobile" ? "w-full" : ""}
      >
        Contato indisponível
      </Button>
    );
  }

  // Função para formatar número do WhatsApp
  const formatWhatsAppNumber = (whatsapp: string) => {
    const numbers = whatsapp.replace(/\D/g, "");

    if (numbers.length === 11) {
      return `(${numbers.substring(0, 2)}) ${numbers.substring(
        2,
        7
      )}-${numbers.substring(7)}`;
    }

    if (numbers.length > 11) {
      const countryCode = numbers.substring(0, 2);
      const areaCode = numbers.substring(2, 4);
      const firstPart = numbers.substring(4, 9);
      const secondPart = numbers.substring(9, 13);
      return `+${countryCode} ${areaCode} ${firstPart}-${secondPart}`;
    }

    return whatsapp;
  };

  // Contar quantos contatos existem
  const contactCount = [
    contactInfo?.email,
    contactInfo?.whatsapp,
    contactInfo?.instagram,
    contactInfo?.twitter,
  ].filter(Boolean).length;

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button className="w-full flex items-center justify-center gap-2">
          Contato
        </Button>
      </PopoverTrigger>
      <PopoverContent
        className="w-80 p-0"
        align={variant === "mobile" ? "center" : "start"}
        side={variant === "mobile" ? "top" : "bottom"}
      >
        <div className="p-4 border-b">
          <h3 className="font-semibold">Entre em Contato</h3>
          <p className="text-sm text-muted-foreground">
            Escolha uma das opções abaixo
          </p>
        </div>

        <div className="p-2 space-y-1">
          {/* Email */}
          {contactInfo?.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-full">
                <Mail className="h-4 w-4 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Email</p>
                <p className="text-xs text-muted-foreground truncate">
                  {contactInfo.email}
                </p>
              </div>
            </a>
          )}

          {/* WhatsApp */}
          {contactInfo?.whatsapp && (
            <a
              href={`https://wa.me/${contactInfo.whatsapp.replace(/\D/g, "")}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-full">
                <MessageCircle className="h-4 w-4 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">WhatsApp</p>
                <p className="text-xs text-muted-foreground">
                  {formatWhatsAppNumber(contactInfo.whatsapp)}
                </p>
              </div>
            </a>
          )}

          {/* Instagram */}
          {contactInfo?.instagram && (
            <a
              href={`https://instagram.com/${contactInfo.instagram
                .replace("@", "")
                .trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full">
                <Instagram className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Instagram</p>
                <p className="text-xs text-muted-foreground">
                  {contactInfo.instagram}
                </p>
              </div>
            </a>
          )}

          {/* Twitter/X */}
          {contactInfo?.twitter && (
            <a
              href={`https://twitter.com/${contactInfo.twitter
                .replace("@", "")
                .trim()}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-black rounded-full">
                <Twitter className="h-4 w-4 text-white" />
              </div>
              <div className="flex-1">
                <p className="font-medium text-sm">Twitter / X</p>
                <p className="text-xs text-muted-foreground">
                  {contactInfo.twitter}
                </p>
              </div>
            </a>
          )}
        </div>

        <div className="p-3 border-t ">
          <p className="text-xs text-muted-foreground text-center">
            Clique em qualquer opção para ser redirecionado
          </p>
        </div>
      </PopoverContent>
    </Popover>
  );
}

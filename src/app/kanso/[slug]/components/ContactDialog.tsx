"use client";

import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/src/components/ui/dialog";
import {
  Instagram,
  Mail,
  Phone,
  Globe,
  MessageCircle,
  Twitter,
} from "lucide-react";

interface ContactDialogProps {
  variant?: "default" | "mobile";
  contactInfo?: {
    email?: string | null;
    phone?: string | null;
    instagram?: string | null;
    twitter?: string | null;
    whatsapp?: string | null;
    website?: string | null;
  };
}

export function ContactDialog({
  variant = "default",
  contactInfo,
}: ContactDialogProps) {
  // Filtrar apenas os contatos que existem
  const hasContactInfo =
    contactInfo?.email ||
    contactInfo?.whatsapp ||
    contactInfo?.phone ||
    contactInfo?.instagram ||
    contactInfo?.twitter ||
    contactInfo?.website;

  if (!hasContactInfo) {
    return (
      <Button
        disabled
        variant="outline"
        className={variant === "mobile" ? "w-full" : ""}
      >
        Sem contato disponível
      </Button>
    );
  }

  return (
    <Dialog>
      <DialogTrigger asChild>
        {variant === "mobile" ? (
          <Button className="w-full">Contato</Button>
        ) : (
          <Button>Contato</Button>
        )}
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Entre em Contato</DialogTitle>
          <DialogDescription>
            Escolha uma das formas abaixo para entrar em contato
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-3 py-4">
          {/* Email */}
          {contactInfo?.email && (
            <a
              href={`mailto:${contactInfo.email}`}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-blue-100 rounded-full">
                <Mail className="h-5 w-5 text-blue-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Email</p>
                <p className="text-sm text-muted-foreground">
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
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-green-100 rounded-full">
                <MessageCircle className="h-5 w-5 text-green-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">WhatsApp</p>
                <p className="text-sm text-muted-foreground">
                  {contactInfo.whatsapp}
                </p>
              </div>
            </a>
          )}

          {/* Telefone (fallback se tiver phone mas não whatsapp) */}
          {contactInfo?.phone && !contactInfo?.whatsapp && (
            <a
              href={`tel:${contactInfo.phone}`}
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-gray-100 rounded-full">
                <Phone className="h-5 w-5 text-gray-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Telefone</p>
                <p className="text-sm text-muted-foreground">
                  {contactInfo.phone}
                </p>
              </div>
            </a>
          )}

          {/* Instagram */}
          {contactInfo?.instagram && (
            <a
              href={`https://instagram.com/${contactInfo.instagram.replace(
                "@",
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-pink-100 rounded-full">
                <Instagram className="h-5 w-5 text-pink-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Instagram</p>
                <p className="text-sm text-muted-foreground">
                  {contactInfo.instagram}
                </p>
              </div>
            </a>
          )}

          {/* Twitter/X */}
          {contactInfo?.twitter && (
            <a
              href={`https://twitter.com/${contactInfo.twitter.replace(
                "@",
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-black/10 rounded-full">
                <Twitter className="h-5 w-5" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Twitter / X</p>
                <p className="text-sm text-muted-foreground">
                  {contactInfo.twitter}
                </p>
              </div>
            </a>
          )}

          {/* Website (se tiver) */}
          {contactInfo?.website && (
            <a
              href={`https://${contactInfo.website.replace(
                /^https?:\/\//,
                ""
              )}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-3 p-3 rounded-lg border hover:bg-gray-50 transition-colors"
            >
              <div className="p-2 bg-purple-100 rounded-full">
                <Globe className="h-5 w-5 text-purple-600" />
              </div>
              <div className="flex-1">
                <p className="font-medium">Website</p>
                <p className="text-sm text-muted-foreground">
                  {contactInfo.website}
                </p>
              </div>
            </a>
          )}
        </div>

        <div className="text-center text-sm text-muted-foreground pt-4 border-t">
          <p>Clique em qualquer opção para ser redirecionado</p>
        </div>
      </DialogContent>
    </Dialog>
  );
}

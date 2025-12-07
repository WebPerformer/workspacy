import { Check, CheckCircle, ExternalLink, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/src/components/ui/skeleton";
import Link from "next/link";
import { PurchaseDrawer } from "./products-drawer";
import { activeTemplate } from "@/src/lib/templates";
import { Button } from "../ui/button";
import { Template } from "@/src/types/template";
import Image from "next/image";
import loadingSvg from "@/public/images/loading.svg";
import { getUserConfig } from "@/src/lib/user";

// Componente de Loading Reutilizável
export const TemplateSkeleton = ({ count = 6 }: { count?: number }) => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
    {Array.from({ length: count }).map((_, i) => (
      <div key={i} className="space-y-4 rounded-lg p-3 @[575px]:p-4 border">
        <div className="relative">
          <Skeleton className="w-full rounded-lg aspect-[12/9]" />
          <Skeleton className="absolute top-2 left-2 h-6 w-24 rounded-full" />
        </div>
        <div className="space-y-2">
          <Skeleton className="h-6 w-4/5" />
          <Skeleton className="h-4 w-full" />
        </div>
        <Skeleton className="w-full h-10 rounded-md" />
      </div>
    ))}
  </div>
);

// Subcomponente de Imagem
const TemplateImage = ({
  template,
  priority = false,
  isActive = false,
}: {
  template: Template;
  priority?: boolean;
  isActive?: boolean;
}) => (
  <div className="relative">
    {template.images[0] && (
      <Image
        src={template.images[0]}
        alt={template.name}
        width={400}
        height={300}
        className="object-cover rounded-lg aspect-[12/9] w-full"
        priority={priority}
      />
    )}
    {isActive && (
      <div className="absolute top-2 right-2 bg-green-400/20 backdrop-blur-sm rounded-full p-1">
        <Check size={20} className="text-green-900" />
      </div>
    )}
  </div>
);

// Subcomponente de Informações
const TemplateInfo = ({ template }: { template: Template }) => (
  <div className="flex flex-col gap-1">
    <h1 className="text-lg font-medium leading-none">{template.name}</h1>
    <p className="text-muted-foreground leading-none">
      {template.metadata.included}
    </p>
  </div>
);

const TemplateAction = ({
  template,
  subscriptionTemplates,
  isConfigured,
  loading,
  onActivateOrConfigure,
  isActiveTemplate,
  templateUrl,
}: {
  template: Template;
  subscriptionTemplates: Template[];
  isConfigured: boolean;
  loading: boolean;
  onActivateOrConfigure: (templateId: string) => void;
  isActiveTemplate: boolean;
  templateUrl: string | null;
}) => {
  // Gerar slug do template para a URL baseado no nome do template
  const templateSlug = template.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^\w-]/g, "");

  if (!template.has_access) {
    return (
      <PurchaseDrawer
        template={template}
        subscriptionTemplates={subscriptionTemplates}
      />
    );
  }

  if (isActiveTemplate && templateUrl) {
    return (
      <Link
        href={`/${templateSlug}/${templateUrl}`}
        className="w-full"
        target="_blank"
      >
        <Button className="w-full text-green-900 bg-green-400 border border-green-400 hover:bg-green-400 hover:border-green-500 hover:text-green-800">
          <CheckCircle size={16} className="mr-2" />
          Visitar Website
        </Button>
      </Link>
    );
  }

  if (isActiveTemplate && !templateUrl) {
    return (
      <Button
        className="w-full"
        variant="outline"
        disabled
        onClick={() => (window.location.href = "/dashboard/template-setup")}
      >
        <ExternalLink size={16} className="mr-2" />
        Configurar URL Primeiro
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      variant="outline"
      onClick={() => onActivateOrConfigure(template.id)}
      disabled={loading}
    >
      <CheckCircle size={16} className="mr-2" />
      {loading ? (
        <Image src={loadingSvg} alt="loading" width={20} height={20} />
      ) : (
        "Ativar Website"
      )}
    </Button>
  );
};

// Componente de Template Card
export const TemplateCard = ({
  template,
  subscriptionTemplates,
  isConfigured,
  loadingButtons,
  onActivateOrConfigure,
  isActiveTemplate,
  templateUrl,
}: {
  template: Template;
  subscriptionTemplates: Template[];
  isConfigured: boolean;
  loadingButtons: { [key: string]: boolean };
  onActivateOrConfigure: (templateId: string) => void;
  isActiveTemplate: boolean;
  templateUrl: string | null;
}) => (
  <div className="space-y-4 bg-card rounded-lg p-3 @[575px]:p-4 border h-full">
    <TemplateImage template={template} isActive={isActiveTemplate} />
    <TemplateInfo template={template} />
    <TemplateAction
      template={template}
      subscriptionTemplates={subscriptionTemplates}
      isConfigured={isConfigured}
      loading={loadingButtons[template.id]}
      onActivateOrConfigure={onActivateOrConfigure}
      isActiveTemplate={isActiveTemplate}
      templateUrl={templateUrl}
    />
  </div>
);

// Hook para gerenciar configuração do usuário
export const useUserConfig = () => {
  const [config, setConfig] = useState<{
    isConfigured: boolean;
    loading: boolean;
    activeTemplateId: string | null;
    templateUrl: string | null;
  }>({
    isConfigured: false,
    loading: true,
    activeTemplateId: null,
    templateUrl: null,
  });

  const refetch = async () => {
    try {
      const userConfig = await getUserConfig();

      setConfig({
        isConfigured: userConfig?.is_template_configured || false,
        loading: false,
        activeTemplateId: userConfig?.selected_template_id || null,
        templateUrl: userConfig?.template_url || null,
      });
    } catch (error) {
      console.error("Error checking template config:", error);
      setConfig({
        isConfigured: false,
        loading: false,
        activeTemplateId: null,
        templateUrl: null,
      });
    }
  };

  useEffect(() => {
    refetch();
  }, []);

  return { ...config, refetch };
};

// Hook para gerenciar ativação de template
export const useTemplateActivation = (
  userConfigured: boolean,
  refetchUserConfig: () => Promise<void>
) => {
  const [loadingButtons, setLoadingButtons] = useState<{
    [key: string]: boolean;
  }>({});

  const handleActivateOrConfigure = async (templateId: string) => {
    if (!userConfigured) {
      window.location.href = "/dashboard/template-setup";
      return;
    }

    setLoadingButtons((prev) => ({ ...prev, [templateId]: true }));

    try {
      const result = await activeTemplate(templateId);

      if (result?.success) {
        toast.success("Template ativado com sucesso!");
        // Atualizar o estado local buscando a configuração atualizada
        await refetchUserConfig();
      } else {
        toast.error("Erro ao ativar template");
      }
    } catch (error) {
      toast.error("Erro ao ativar template");
    } finally {
      setLoadingButtons((prev) => ({ ...prev, [templateId]: false }));
    }
  };

  return { loadingButtons, handleActivateOrConfigure };
};

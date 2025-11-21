import { CircleCheck, Eye } from "lucide-react";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Badge } from "@/src/components/ui/badge";
import { Skeleton } from "@/src/components/ui/skeleton";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import Link from "next/link";
import { PurchaseDrawer } from "./products-drawer";
import { activeTemplate, getTemplates } from "@/src/lib/templates";
import { Button } from "../ui/button";
import { Template } from "@/src/types/template";
import Image from "next/image";
import loadingSvg from "@/public/images/loading.svg";
import { getUserConfig } from "@/src/lib/user";

// Componente de Loading Reutilizável
const TemplateSkeleton = ({ count = 3 }: { count?: number }) => (
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

// Componente de Template Card Separado
const TemplateCard = ({
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
    <TemplateImage template={template} />
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

// Subcomponente de Imagem
const TemplateImage = ({
  template,
  priority = false,
}: {
  template: Template;
  priority?: boolean;
}) => (
  <div>
    <Link
      href={template.metadata.preview}
      target="_blank"
      className="relative group cursor-pointer"
    >
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
      <Badge
        variant="secondary"
        className="md:opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 right-2"
      >
        <Eye />
        <span className="text-xs">Pré-Visualizar</span>
      </Badge>
    </Link>
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
    // Gerar slug do template para a URL
    const templateSlug = template.name
      .toLowerCase()
      .replace(/\s+/g, "-")
      .replace(/[^\w-]/g, "");

    return (
      <Link
        href={`/${templateSlug}/${templateUrl}`}
        className="w-full"
        target="_blank"
      >
        <Button className="w-full" variant="outline">
          <Eye size={16} className="mr-2" />
          Visitar Template
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
        onClick={() => (window.location.href = "/template-setup")}
      >
        <Eye size={16} className="mr-2" />
        Configurar URL Primeiro
      </Button>
    );
  }

  return (
    <Button
      className="w-full"
      onClick={() => onActivateOrConfigure(template.id)}
      disabled={loading}
    >
      {loading ? (
        <Image src={loadingSvg} alt="loading" width={20} height={20} />
      ) : (
        "Ativar Template"
      )}
    </Button>
  );
};

const useUserConfig = () => {
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

export default function ProductsCards() {
  const {
    isConfigured: userConfigured,
    loading: configLoading,
    activeTemplateId,
    templateUrl,
    refetch: refetchUserConfig,
  } = useUserConfig();

  const [loadingButtons, setLoadingButtons] = useState<{
    [key: string]: boolean;
  }>({});

  const handleActivateOrConfigure = async (templateId: string) => {
    if (!userConfigured) {
      window.location.href = "/template-setup";
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

  const useTemplates = () => {
    const [state, setState] = useState<{
      templates: Template[];
      loading: boolean;
      error: string | null;
    }>({
      templates: [],
      loading: true,
      error: null,
    });

    useEffect(() => {
      const fetchTemplates = async () => {
        try {
          const result = await getTemplates();

          if (result?.success) {
            setState({ templates: result.data, loading: false, error: null });
          } else {
            setState({
              templates: [],
              loading: false,
              error: "Failed to fetch templates",
            });
            toast.error("Failed to fetch templates");
          }
        } catch (err) {
          setState({
            templates: [],
            loading: false,
            error: "An error occurred",
          });
          toast.error("An error occurred");
        }
      };

      fetchTemplates();
    }, []);

    return state;
  };

  const {
    templates: templateData,
    loading: templatesLoading,
    error: templatesError,
  } = useTemplates();

  // Filtros reutilizáveis
  const templateFilters = {
    oneTime: (template: Template) => template.price?.type === "one_time",
    recurring: (template: Template) => template.price?.type === "recurring",
  };

  const oneTimeTemplates = templateData.filter(templateFilters.oneTime);
  const subscriptionTemplates = templateData.filter(templateFilters.recurring);

  // Estados de loading combinados
  const isLoading = templatesLoading || configLoading;

  if (isLoading) return <TemplateSkeleton count={3} />;
  if (templatesError) return <div>Error: {templatesError}</div>;

  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1.2}
      breakpoints={{
        575: { slidesPerView: 2.7, spaceBetween: 16 },
      }}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      modules={[Navigation]}
      className="w-full"
    >
      {oneTimeTemplates.length > 0 ? (
        oneTimeTemplates.map((template) => (
          <SwiperSlide key={template.id}>
            <TemplateCard
              template={template}
              subscriptionTemplates={subscriptionTemplates}
              isConfigured={userConfigured}
              loadingButtons={loadingButtons}
              onActivateOrConfigure={handleActivateOrConfigure}
              isActiveTemplate={activeTemplateId === template.id}
              templateUrl={templateUrl}
            />
          </SwiperSlide>
        ))
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum template encontrado</p>
        </div>
      )}
    </Swiper>
  );
}

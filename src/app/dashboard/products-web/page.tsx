"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Skeleton } from "@/src/components/ui/skeleton";
import Link from "next/link";
import { PurchaseDrawer } from "@/src/components/products/products-drawer";
import { activeTemplate, getTemplates } from "@/src/lib/templates";
import { Button } from "@/src/components/ui/button";
import { Template } from "@/src/types/template";
import Image from "next/image";
import loadingSvg from "@/public/images/loading.svg";
import { getUserConfig } from "@/src/lib/user";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";
import { Eye } from "lucide-react";

// Componente de Loading Reutilizável
const TemplateSkeleton = ({ count = 6 }: { count?: number }) => (
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
}: {
  template: Template;
  priority?: boolean;
}) => (
  <div>
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
        "Ativar Website"
      )}
    </Button>
  );
};

// Componente de Template Card
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

const ITEMS_PER_PAGE = 9;

export default function ProductsWebPage() {
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

  const [currentPage, setCurrentPage] = useState(1);

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

  // Paginação
  const totalPages = Math.ceil(oneTimeTemplates.length / ITEMS_PER_PAGE);
  const startIndex = (currentPage - 1) * ITEMS_PER_PAGE;
  const endIndex = startIndex + ITEMS_PER_PAGE;
  const currentTemplates = oneTimeTemplates.slice(startIndex, endIndex);

  // Função para gerar números de página
  const getPageNumbers = () => {
    const pages: (number | string)[] = [];
    const maxVisible = 5;

    if (totalPages <= maxVisible) {
      // Mostrar todas as páginas se houver poucas
      for (let i = 1; i <= totalPages; i++) {
        pages.push(i);
      }
    } else {
      // Sempre mostrar primeira página
      pages.push(1);

      if (currentPage > 3) {
        pages.push("ellipsis-start");
      }

      // Mostrar páginas ao redor da página atual
      const start = Math.max(2, currentPage - 1);
      const end = Math.min(totalPages - 1, currentPage + 1);

      for (let i = start; i <= end; i++) {
        pages.push(i);
      }

      if (currentPage < totalPages - 2) {
        pages.push("ellipsis-end");
      }

      // Sempre mostrar última página
      pages.push(totalPages);
    }

    return pages;
  };

  if (isLoading) return <TemplateSkeleton count={9} />;
  if (templatesError) return <div>Error: {templatesError}</div>;

  return (
    <section className="flex flex-col gap-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Todos os Websites</h3>
        <p className="text-sm text-muted-foreground">
          {oneTimeTemplates.length} {oneTimeTemplates.length === 1 ? "website" : "websites"}
        </p>
      </div>

      {currentTemplates.length > 0 ? (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {currentTemplates.map((template) => (
              <TemplateCard
                key={template.id}
                template={template}
                subscriptionTemplates={subscriptionTemplates}
                isConfigured={userConfigured}
                loadingButtons={loadingButtons}
                onActivateOrConfigure={handleActivateOrConfigure}
                isActiveTemplate={activeTemplateId === template.id}
                templateUrl={templateUrl}
              />
            ))}
          </div>

          {totalPages > 1 && (
            <Pagination>
              <PaginationContent>
                <PaginationItem>
                  <PaginationPrevious
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage > 1) {
                        setCurrentPage(currentPage - 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={
                      currentPage === 1 ? "pointer-events-none opacity-50" : ""
                    }
                  />
                </PaginationItem>

                {getPageNumbers().map((page, index) => {
                  if (page === "ellipsis-start" || page === "ellipsis-end") {
                    return (
                      <PaginationItem key={`ellipsis-${index}`}>
                        <PaginationEllipsis />
                      </PaginationItem>
                    );
                  }

                  return (
                    <PaginationItem key={page}>
                      <PaginationLink
                        href="#"
                        onClick={(e) => {
                          e.preventDefault();
                          setCurrentPage(page as number);
                          window.scrollTo({ top: 0, behavior: "smooth" });
                        }}
                        isActive={currentPage === page}
                      >
                        {page}
                      </PaginationLink>
                    </PaginationItem>
                  );
                })}

                <PaginationItem>
                  <PaginationNext
                    href="#"
                    onClick={(e) => {
                      e.preventDefault();
                      if (currentPage < totalPages) {
                        setCurrentPage(currentPage + 1);
                        window.scrollTo({ top: 0, behavior: "smooth" });
                      }
                    }}
                    className={
                      currentPage === totalPages
                        ? "pointer-events-none opacity-50"
                        : ""
                    }
                  />
                </PaginationItem>
              </PaginationContent>
            </Pagination>
          )}
        </>
      ) : (
        <div className="text-center py-8">
          <p className="text-muted-foreground">Nenhum template encontrado</p>
        </div>
      )}
    </section>
  );
}


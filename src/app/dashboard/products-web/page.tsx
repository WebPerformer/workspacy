"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";
import { getTemplates } from "@/src/lib/templates";
import { Template } from "@/src/types/template";
import {
  TemplateCard,
  TemplateSkeleton,
  useUserConfig,
  useTemplateActivation,
} from "@/src/components/products/template-card";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/src/components/ui/pagination";

const ITEMS_PER_PAGE = 9;

export default function ProductsWebPage() {
  const {
    isConfigured: userConfigured,
    loading: configLoading,
    activeTemplateId,
    templateUrl,
    refetch: refetchUserConfig,
  } = useUserConfig();

  const { loadingButtons, handleActivateOrConfigure } = useTemplateActivation(
    userConfigured,
    refetchUserConfig
  );

  const [currentPage, setCurrentPage] = useState(1);

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
          {oneTimeTemplates.length}{" "}
          {oneTimeTemplates.length === 1 ? "website" : "websites"}
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

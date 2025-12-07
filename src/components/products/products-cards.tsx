import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import { getTemplates } from "@/src/lib/templates";
import { Template } from "@/src/types/template";
import {
  TemplateCard,
  TemplateSkeleton,
  useUserConfig,
  useTemplateActivation,
} from "./template-card";

export default function ProductsCards() {
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

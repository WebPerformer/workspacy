import { Eye } from "lucide-react";
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

export default function ProductsCards() {
  const [templates, setTemplates] = useState<Template[]>([]);
  const [loading, setLoading] = useState(true);
  const [loadingButton, setLoadingButton] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchTemplates();
  }, []);

  const fetchTemplates = async () => {
    try {
      setLoading(true);
      const result = await getTemplates();

      if (result?.success) {
        setTemplates(result.data);
      } else {
        setError("Failed to fetch templates");
        toast.error("Failed to fetch templates");
      }
    } catch (err) {
      setError("An error occurred");
      toast.error("An error occurred");
    } finally {
      setLoading(false);
    }
  };

  const oneTimeTemplates = templates.filter(
    (template) => template.price?.type === "one_time"
  );
  const subscriptionTemplates = templates.filter(
    (template) => template.price?.type === "recurring"
  );

  const handleActivateTemplate = async (templateId: string) => {
    setLoadingButton(true);
    try {
      const result = await activeTemplate(templateId);

      if (result?.success) {
        toast.success("Template ativado com sucesso!");
      } else {
        toast.error("Erro ao ativar template");
      }
    } catch (error) {
      toast.error("Erro ao ativar template");
    } finally {
      setLoadingButton(false);
    }
  };

  if (loading)
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 3 }).map((_, i) => (
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

  if (error) return <div>Error: {error}</div>;

  return (
    <Swiper
      spaceBetween={16}
      slidesPerView={1.2}
      breakpoints={{
        575: {
          slidesPerView: 2.7,
          spaceBetween: 16,
        },
      }}
      navigation={{
        nextEl: ".swiper-button-next",
        prevEl: ".swiper-button-prev",
      }}
      modules={[Navigation]}
      className="w-full"
    >
      {oneTimeTemplates.length > 0 ? (
        oneTimeTemplates.map((templates) => (
          <SwiperSlide key={templates.id}>
            <div className="space-y-4 bg-card rounded-lg p-3 @[575px]:p-4 border h-full">
              <div>
                <Link
                  href="https://viral-sma.framer.website/?via=hxmzaehsan&utm_source=framer"
                  target="_blank"
                  className="relative group cursor-pointer"
                >
                  {templates.images[0] && (
                    <img
                      src={templates.images[0]}
                      alt={templates.name}
                      className="object-cover rounded-lg aspect-[12/9] w-full"
                    />
                  )}
                  <Badge
                    variant="secondary"
                    className="opacity-0 group-hover:opacity-100 transition-opacity absolute top-2 left-2"
                  >
                    <Eye />
                    <span className="text-xs">Pré-Visualizar</span>
                  </Badge>
                </Link>
              </div>
              <div className="flex flex-col gap-1">
                <h1 className="text-lg font-medium leading-none">
                  {templates.name}
                </h1>
                <p className="text-muted-foreground leading-none">
                  {templates.metadata.included}
                </p>
              </div>
              {templates.has_access ? (
                <Button
                  className="w-full"
                  onClick={() => handleActivateTemplate(templates.id)}
                  disabled={loadingButton}
                >
                  {loadingButton ? (
                    <Image
                      src={loadingSvg}
                      alt="loading"
                      width={20}
                      height={20}
                    />
                  ) : (
                    "Ativar Template"
                  )}
                </Button>
              ) : (
                <PurchaseDrawer
                  template={templates}
                  subscriptionTemplates={subscriptionTemplates}
                />
              )}
            </div>
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

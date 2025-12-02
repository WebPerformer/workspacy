"use client";

import { useState, useMemo } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/src/components/ui/sheet";
import logo from "@/public/images/kanso-logo.svg";
import Image from "next/image";
import { Menu } from "lucide-react";
import { UserConfigCategory, UserConfigImage } from "@/src/types/user";
import { ContactDialog } from "./ContactDialog";

interface ImageFilterClientProps {
  user: {
    username: string;
    email: string;
    config: {
      description: string;
      categories: UserConfigCategory[];
      whatsapp?: string;
      instagram?: string;
      twitter?: string;
    };
  };
}

type ImageWithCategories = UserConfigImage & { categories?: string[] };

export function ImageFilterClient({ user }: ImageFilterClientProps) {
  const [activeCategory, setActiveCategory] = useState<string>("all");

  // Coletar TODAS as imagens de todas as categorias, anotando a categoria
  const allImages: ImageWithCategories[] = useMemo(
    () =>
      user.config.categories.flatMap((category: UserConfigCategory) =>
        category.images.map((image) => ({
          ...image,
          categories: [category.id],
        }))
      ),
    [user.config.categories]
  );

  // Filtrar imagens baseado na categoria ativa
  const filteredImages = useMemo(() => {
    if (activeCategory === "all") {
      return allImages;
    }

    return allImages.filter((image) =>
      image.categories?.includes(activeCategory)
    );
  }, [allImages, activeCategory]);

  // Calcular contagem de imagens por categoria
  const categoryCounts = useMemo(() => {
    const counts: Record<string, number> = { all: allImages.length };

    user.config.categories.forEach((category) => {
      counts[category.id] = category.images.length;
    });

    return counts;
  }, [user.config.categories, allImages.length]);

  const handleCategoryClick = (categoryId: string) => {
    setActiveCategory(categoryId);
  };

  return (
    <>
      <div className="lg:hidden flex items-center justify-between p-4 border-b sticky top-0 bg-background z-40">
        <div className="flex items-center gap-3">
          <Image src={logo} alt="" className="w-12 h-12" />
          <div>
            <h5 className="font-bold text-sm">{user.username}</h5>
            <p className="text-muted-foreground text-xs">Capturando momentos</p>
          </div>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <button
              className="p-2 rounded-md hover:bg-gray-100"
              aria-label="Abrir menu de filtros"
            >
              <Menu size={24} />
            </button>
          </SheetTrigger>
          <SheetContent side="left" className="w-80 p-6 overflow-y-auto">
            <SheetHeader className="sr-only">
              <SheetTitle>Menu de filtros</SheetTitle>
            </SheetHeader>
            <div className="flex flex-col h-full">
              <div className="flex flex-col gap-8 flex-1">
                <div className="flex flex-col gap-6">
                  <Image src={logo} alt="" className="w-16" />
                  <div>
                    <h5 className="font-bold">{user.username}</h5>
                    <p className="text-muted-foreground text-sm">
                      Capturando momentos
                    </p>
                  </div>
                </div>

                <div>
                  <p className="text-sm text-muted-foreground">
                    {user.config.description}
                  </p>
                </div>

                <div>
                  <p className="font-semibold mb-3">Filtrar por categoria:</p>
                  <ul className="flex flex-col gap-3">
                    <li>
                      <button
                        onClick={() => handleCategoryClick("all")}
                        className={`text-left transition-colors w-full p-2 rounded ${
                          activeCategory === "all"
                            ? "font-bold text-primary bg-gray-50"
                            : "hover:text-primary hover:bg-gray-50"
                        }`}
                      >
                        <span
                          className={`${
                            activeCategory === "all" ? "underline" : ""
                          }`}
                        >
                          Todos
                        </span>
                        <span className="text-muted-foreground text-sm ml-2">
                          ({categoryCounts.all})
                        </span>
                      </button>
                    </li>

                    {user.config.categories.map(
                      (category: UserConfigCategory) => (
                        <li key={category.id}>
                          <button
                            onClick={() => handleCategoryClick(category.id)}
                            className={`text-left transition-colors w-full p-2 rounded ${
                              activeCategory === category.id
                                ? "font-bold text-primary bg-gray-50"
                                : "hover:text-primary hover:bg-gray-50"
                            }`}
                          >
                            <span
                              className={`${
                                activeCategory === category.id
                                  ? "underline"
                                  : ""
                              }`}
                            >
                              {category.name}
                            </span>
                            <span className="text-muted-foreground text-sm ml-2">
                              ({categoryCounts[category.id]})
                            </span>
                          </button>
                        </li>
                      )
                    )}
                  </ul>
                </div>

                <div>
                  <ContactDialog
                    contactInfo={{
                      email: user.email,
                      phone: user.config?.whatsapp,
                      whatsapp: user.config?.whatsapp,
                      instagram: user.config?.instagram,
                      twitter: user.config?.twitter,
                    }}
                  />
                </div>
              </div>

              <div className="mt-8 pt-8 border-t">
                <p className="text-muted-foreground text-sm">
                  © 2025 - Template by WorkSpacy
                </p>
              </div>
            </div>
          </SheetContent>
        </Sheet>
      </div>

      <section className="flex">
        <div className="hidden lg:flex lg:w-[300px] h-screen flex-col justify-between p-10 sticky top-0 overflow-y-auto">
          <div className="flex flex-col gap-11">
            <div className="flex flex-col gap-6 pb-12">
              <div>
                <Image src={logo} alt="" className="w-20" />
              </div>
              <div>
                <h5 className="font-bold">{user.username}</h5>
                <p className="text-muted-foreground">Capturando momentos</p>
              </div>
            </div>
            <div>
              <p>{user.config.description}</p>
            </div>
            <div>
              <p className="font-semibold mb-3">Filtrar por categoria:</p>
              <ul className="flex flex-col gap-3">
                <li>
                  <button
                    onClick={() => handleCategoryClick("all")}
                    className={`text-left transition-colors ${
                      activeCategory === "all"
                        ? "font-bold text-primary"
                        : "hover:text-primary"
                    }`}
                  >
                    <span
                      className={`${
                        activeCategory === "all" ? "underline" : ""
                      }`}
                    >
                      Todos
                    </span>
                    <span className="text-muted-foreground text-sm ml-2">
                      ({categoryCounts.all})
                    </span>
                  </button>
                </li>

                {user.config.categories.map((category: UserConfigCategory) => (
                  <li key={category.id}>
                    <button
                      onClick={() => handleCategoryClick(category.id)}
                      className={`text-left transition-colors ${
                        activeCategory === category.id
                          ? "font-bold text-primary"
                          : "hover:text-primary"
                      }`}
                    >
                      <span
                        className={`${
                          activeCategory === category.id ? "underline" : ""
                        }`}
                      >
                        {category.name}
                      </span>
                      <span className="text-muted-foreground text-sm ml-2">
                        ({categoryCounts[category.id]})
                      </span>
                    </button>
                  </li>
                ))}
              </ul>
            </div>
            <div>
              <ContactDialog
                contactInfo={{
                  email: user.email,
                  phone: user.config?.whatsapp,
                  whatsapp: user.config?.whatsapp,
                  instagram: user.config?.instagram,
                  twitter: user.config?.twitter,
                }}
              />
            </div>
          </div>
          <div>
            <p className="text-muted-foreground">
              © 2025 - Template by WorkSpacy
            </p>
          </div>
        </div>

        <div className="flex-1 p-4 lg:p-10">
          <div className="columns-1 sm:columns-2 gap-5 space-y-5">
            {filteredImages.map((image: ImageWithCategories) => (
              <div
                key={`${image.key}-${image.filename}`}
                className="break-inside-avoid group"
              >
                <div className="relative overflow-hidden rounded-md">
                  <Image
                    src={image.url}
                    alt={image.filename || "Imagem"}
                    width={0}
                    height={0}
                    sizes="(max-width: 640px) 100vw, (max-width: 768px) 50vw, (max-width: 1024px) 33vw, (max-width: 1280px) 25vw, 20vw"
                    className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
                    style={{ aspectRatio: "auto" }}
                  />
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-all duration-300" />
                </div>
              </div>
            ))}
          </div>

          {filteredImages.length === 0 && (
            <div className="h-full flex items-center justify-center">
              <p className="text-muted-foreground">Nenhuma imagem disponível</p>
            </div>
          )}
        </div>
      </section>
    </>
  );
}

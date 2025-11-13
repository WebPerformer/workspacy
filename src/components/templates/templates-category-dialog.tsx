"use client";

import { useState, useEffect } from "react";
import { Button } from "@/src/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";
import {
  Dropzone,
  DropzoneEmptyState,
} from "@/src/components/ui/shadcn-io/dropzone";
import { X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";

interface TemplateImage {
  url: string;
  filename: string;
  key: string;
  uploaded_at: Date;
  size: number;
  file?: File;
  preview?: string;
  metadata?: {
    categoryId?: string;
    userId?: string;
    description?: string;
  };
}

interface Category {
  id: string;
  name: string;
  images: TemplateImage[];
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: Category;
  onSave: (category: Category) => void;
  onDelete?: (categoryId: string) => void;
  totalImages: number;
  maxTotalImages: number;
  userId: string;
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
  onSave,
  onDelete,
  totalImages,
  maxTotalImages,
  userId,
}: CategoryDialogProps) {
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [images, setImages] = useState<TemplateImage[]>(category?.images || []);
  const [uploading, setUploading] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const imagesRemaining = maxTotalImages - totalImages;
  const canAddMoreImages = imagesRemaining > 0;

  useEffect(() => {
    if (open && category) {
      setCategoryName(category.name);
      setImages(category.images || []);
    } else if (open && !category) {
      setCategoryName("");
      setImages([]);
    }
  }, [open, category]);

  const handleDrop = (files: File[]) => {
    if (!canAddMoreImages) {
      toast.error(`Limite total de ${maxTotalImages} imagens atingido`);
      return;
    }

    if (!userId) {
      toast.error("Usuário não identificado. Faça login novamente.");
      return;
    }

    const filesToAdd = files.slice(0, imagesRemaining);

    const newImages: TemplateImage[] = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
      url: "",
      filename: file.name,
      key: "",
      uploaded_at: new Date(),
      size: file.size,
      metadata: {
        userId,
      },
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const uploadImages = async (
    finalCategoryId: string
  ): Promise<TemplateImage[]> => {
    const uploadedImages: TemplateImage[] = [];

    for (const image of images) {
      if (image.url && image.key) {
        uploadedImages.push(image);
        continue;
      }

      try {
        const formData = new FormData();
        formData.append("file", image.file!);
        formData.append("userId", userId);
        formData.append("categoryId", finalCategoryId);

        const response = await fetch("/api/cloudflare/upload", {
          method: "POST",
          body: formData,
        });

        if (!response.ok) {
          throw new Error(`Falha no upload: ${response.status}`);
        }

        const result = await response.json();

        if (result.success) {
          uploadedImages.push(result.data);
          if (image.preview) {
            URL.revokeObjectURL(image.preview);
          }
        } else {
          throw new Error("Upload falhou");
        }
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        throw new Error(`Falha ao enviar imagem ${image.filename}`);
      }
    }

    return uploadedImages;
  };

  const saveToBackend = async (categoryData: Category) => {
    try {
      // Buscar configuração atual
      const response = await fetch("/api/user/config", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error(`Erro ao buscar configurações: ${response.status}`);
      }

      const result = await response.json();

      if (!result.success) {
        throw new Error(result.error || "Erro ao buscar configurações");
      }

      const currentConfig = result.data;
      const currentCategories = currentConfig.template_data?.categories || [];

      // Atualizar categorias
      let updatedCategories: Category[];

      if (mode === "edit" && category) {
        updatedCategories = currentCategories.map((cat: Category) =>
          cat.id === category.id ? categoryData : cat
        );
      } else {
        updatedCategories = [...currentCategories, categoryData];
      }

      // Salvar no backend - agora envia template_data com categorias
      const updateResponse = await fetch("/api/user/config", {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          template_data: {
            url: currentConfig.template_data?.url || "",
            description: currentConfig.template_data?.description || "",
            instagram: currentConfig.template_data?.instagram || "",
            twitter: currentConfig.template_data?.twitter || "",
            whatsapp: currentConfig.template_data?.whatsapp || "",
            categories: updatedCategories,
          },
        }),
      });

      if (!updateResponse.ok) {
        const errorResult = await updateResponse.json();
        throw new Error(
          errorResult.error || `Erro ${updateResponse.status} ao salvar`
        );
      }

      const updateResult = await updateResponse.json();

      if (!updateResult.success) {
        throw new Error(updateResult.error || "Erro ao salvar no servidor");
      }

      return updateResult;
    } catch (error) {
      console.error("Erro em saveToBackend:", error);
      throw error;
    }
  };

  const handleSave = async () => {
    if (!categoryName.trim()) {
      toast.error("Digite um nome para a categoria");
      return;
    }

    if (images.length === 0) {
      toast.error("Adicione pelo menos uma imagem à categoria");
      return;
    }

    setUploading(true);

    try {
      const finalCategoryId = category?.id || `category-${Date.now()}`;
      const uploadedImages = await uploadImages(finalCategoryId);

      const categoryData: Category = {
        id: finalCategoryId,
        name: categoryName.trim(),
        images: uploadedImages,
      };

      await saveToBackend(categoryData);
      onSave(categoryData);

      toast.success(
        mode === "create"
          ? `Catálogo "${categoryName}" criado com sucesso!`
          : `Catálogo "${categoryName}" atualizado!`
      );

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro ao salvar catálogo");
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async () => {
    if (!category || !onDelete) return;

    setDeleting(true);

    try {
      // Buscar configuração atual
      const response = await fetch("/api/user/config", {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Erro ao buscar configurações");
      }

      const result = await response.json();

      if (result.success) {
        const currentConfig = result.data;

        // Garantir que template_data existe com estrutura completa
        if (!currentConfig.template_data) {
          currentConfig.template_data = {
            url: "",
            description: "",
            categories: [],
          };
        }

        // Remover a categoria mantendo a estrutura completa
        const updatedCategories = currentConfig.template_data.categories.filter(
          (cat: Category) => cat.id !== category.id
        );

        // Deletar imagens do Cloudflare
        for (const image of category.images) {
          try {
            await fetch("/api/cloudflare/delete", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({ key: image.key }),
            });
          } catch (error) {
            console.error("Erro ao deletar imagem:", error);
          }
        }

        // Atualizar no backend mantendo toda a estrutura
        const updateResponse = await fetch("/api/user/config", {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            template_data: {
              url: currentConfig.template_data.url || "",
              description: currentConfig.template_data.description || "",
              instagram: currentConfig.template_data.instagram || "",
              twitter: currentConfig.template_data.twitter || "",
              whatsapp: currentConfig.template_data.whatsapp || "",
              categories: updatedCategories,
            },
          }),
        });

        const updateResult = await updateResponse.json();

        if (updateResponse.ok && updateResult.success) {
          onDelete(category.id);
          toast.success(`Catálogo "${category.name}" removido!`);
          onOpenChange(false);
        } else {
          throw new Error(updateResult.error || "Erro ao remover catálogo");
        }
      } else {
        throw new Error(result.error || "Erro ao buscar configurações");
      }
    } catch (error) {
      console.error("Erro ao deletar categoria:", error);
      toast.error("Erro ao remover catálogo");
    } finally {
      setDeleting(false);
    }
  };

  const removeImage = (index: number) => {
    const imageToRemove = images[index];
    if (imageToRemove.preview) {
      URL.revokeObjectURL(imageToRemove.preview);
    }
    setImages((prev) => prev.filter((_, i) => i !== index));
  };

  const handleClose = () => {
    images.forEach((image) => {
      if (image.preview && !image.url) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setCategoryName(category?.name || "");
    setImages(category?.images || []);
    onOpenChange(false);
  };

  const dialogTitle = mode === "create" ? "Novo Catálogo" : "Editar Catálogo";
  const dialogDescription =
    mode === "create"
      ? "Crie uma nova categoria e adicione imagens."
      : "Altere o nome ou as imagens desta categoria.";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle>{dialogTitle}</DialogTitle>
          <DialogDescription>{dialogDescription}</DialogDescription>
        </DialogHeader>

        <div className="grid gap-4">
          <div className="grid gap-3">
            <Label htmlFor="category">Nome da Categoria</Label>
            <Input
              placeholder="Ex: Casamento, Ensaios, Eventos..."
              value={categoryName}
              onChange={(e) => setCategoryName(e.target.value)}
              disabled={uploading || deleting}
            />
          </div>
        </div>

        <Dropzone
          accept={{ "image/*": [] }}
          maxFiles={imagesRemaining}
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          onDrop={handleDrop}
          onError={(error) => {
            toast.error(`Erro ao carregar imagens: ${error}`);
          }}
          disabled={!canAddMoreImages || uploading || deleting}
        >
          <DropzoneEmptyState />
        </Dropzone>

        {images.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm mb-2 block">
              Pré-visualização ({images.length}/{maxTotalImages})
              {uploading && " - Enviando..."}
              {!canAddMoreImages && !uploading && " - Limite atingido"}
            </Label>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {images.map((image, index) => (
                <div
                  key={image.key || index}
                  className="relative group aspect-video"
                >
                  <div className="relative w-full h-full rounded-md overflow-hidden border">
                    <Image
                      src={image.preview || image.url}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {uploading && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    disabled={uploading || deleting}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div>
            {mode === "edit" && category && (
              <Button
                type="button"
                variant="destructive"
                onClick={handleDelete}
                disabled={deleting || uploading}
              >
                {deleting ? "Removendo..." : "Remover Catálogo"}
              </Button>
            )}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={uploading || deleting}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={
                !categoryName.trim() ||
                images.length === 0 ||
                uploading ||
                deleting
              }
            >
              {uploading
                ? "Salvando..."
                : mode === "create"
                ? "Criar Catálogo"
                : "Salvar Alterações"}
            </Button>
          </div>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

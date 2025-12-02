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
import { MessageSquareWarning, X } from "lucide-react";
import Image from "next/image";
import { toast } from "sonner";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation } from "swiper/modules";
import "swiper/css";
import {
  deleteCloudinaryImage,
  deleteCloudinaryImages,
  uploadToCloudinary,
} from "@/src/lib/cloudinary";
import {
  CategoryDialogProps,
  UserConfigCategory,
  UserConfigImage,
} from "@/src/types/user";
import { getUserConfig, updateUserConfig } from "@/src/lib/user";

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
  onSave,
  categories,
  maxTotalImages,
  userId,
}: CategoryDialogProps) {
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [images, setImages] = useState<UserConfigImage[]>(
    category?.images || []
  );
  const [uploading, setUploading] = useState(false);
  const [removedImages, setRemovedImages] = useState<UserConfigImage[]>([]);

  // Calcular total de imagens em tempo real considerando TODAS as categorias
  const calculateTotalImages = () => {
    return categories.reduce((total, cat) => {
      // Se estiver editando, não contar as imagens da categoria atual (serão substituídas)
      if (mode === "edit" && category && cat.id === category.id) {
        return total;
      }
      return total + cat.images.length;
    }, 0);
  };

  const totalImages = calculateTotalImages();

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
    if (!userId) {
      toast.error("Usuário não identificado. Faça login novamente.");
      return;
    }

    const newImages: UserConfigImage[] = files.map((file) => ({
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
  ): Promise<UserConfigImage[]> => {
    const uploadedImages: UserConfigImage[] = [];

    const uploadCategoryId = category?.id || finalCategoryId;

    // Separar imagens que precisam de upload das que já existem
    const existingImages = images.filter((img) => img.url && img.key);
    const newImages = images.filter((img) => !img.url || !img.key);

    // Fazer upload apenas das novas imagens
    for (const image of newImages) {
      if (!image.file) continue;

      try {
        const uploadResult = await uploadToCloudinary(
          image.file,
          userId,
          uploadCategoryId
        );

        if (uploadResult.success) {
          uploadedImages.push(uploadResult.data);
          if (image.preview) {
            URL.revokeObjectURL(image.preview);
          }
        } else {
          throw new Error(
            `Falha ao enviar imagem ${image.filename}: ${uploadResult.data}`
          );
        }
      } catch (error) {
        console.error("Erro ao fazer upload da imagem:", error);
        throw new Error(`Falha ao enviar imagem ${image.filename}`);
      }
    }

    return [...existingImages, ...uploadedImages];
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

    // Validação de limite
    const currentTotal = calculateTotalImages();
    const finalTotal = currentTotal + images.length;

    if (finalTotal > maxTotalImages) {
      const excessImages = finalTotal - maxTotalImages;
      toast.error(
        `Limite de ${maxTotalImages} imagens excedido em ${excessImages} imagem(ns). ` +
          `Remova ${excessImages} imagem(ns) para continuar.`
      );
      return;
    }

    setUploading(true);

    try {
      const finalCategoryId = category?.id || `category-${Date.now()}`;

      // Tentar deletar imagens marcadas do Cloudinary
      const deleteResult = await deleteMarkedImages();

      // SE A DELEÇÃO FALHOU, CANCELAMOS A OPERAÇÃO COMPLETA
      if (!deleteResult.success) {
        throw new Error(
          deleteResult.error || "Falha ao deletar imagens do Cloudinary"
        );
      }

      // 2. Só continuamos se TODAS as deleções foram bem-sucedidas
      // Limpar a lista de imagens removidas apenas se a deleção foi bem-sucedida
      setRemovedImages([]);

      // 3. Fazer upload das novas imagens
      const uploadedImages = await uploadImages(finalCategoryId);

      // 4. Preparar dados da categoria
      const categoryData: UserConfigCategory = {
        id: finalCategoryId,
        name: categoryName.trim(),
        images: uploadedImages,
      };

      // 5. Buscar configuração atual
      const currentConfig = await getUserConfig();
      if (!currentConfig) {
        throw new Error("Erro ao buscar configurações do usuário");
      }

      const currentCategories = currentConfig.template_data?.categories || [];
      let updatedCategories: UserConfigCategory[];

      if (mode === "edit" && category) {
        updatedCategories = currentCategories.map((cat: UserConfigCategory) =>
          cat.id === category.id ? categoryData : cat
        );
      } else {
        updatedCategories = [...currentCategories, categoryData];
      }

      // 6. Salvar no backend (banco de dados)
      const updateResult = await updateUserConfig({
        template_data: {
          ...currentConfig.template_data,
          categories: updatedCategories,
        },
      });

      if (!updateResult.success) {
        throw new Error(updateResult.error || "Erro ao salvar no servidor");
      }

      // 7. SÓ AQUI: Operação completa bem-sucedida
      onSave(categoryData);

      toast.success(
        mode === "create"
          ? `Catálogo "${categoryName}" criado com sucesso!`
          : `Catálogo "${categoryName}" atualizado!`
      );

      onOpenChange(false);
    } catch (error: any) {
      console.error("❌ Erro ao salvar categoria:", error);

      // Mensagem de erro específica para problemas de sincronia
      if (error.message.includes("sincronia")) {
        toast.error(
          "Problema de sincronia com o armazenamento de imagens. " +
            "Suas imagens no banco de dados foram preservadas. " +
            "Tente novamente ou entre em contato com o suporte."
        );
      } else {
        toast.error(
          error.message || "Erro ao salvar categoria. Tente novamente."
        );
      }
    } finally {
      setUploading(false);
    }
  };

  const deleteMarkedImages = async (): Promise<{
    success: boolean;
    deletedCount: number;
    error?: string;
  }> => {
    if (removedImages.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    // Filtrar apenas imagens que têm key (já foram upload)
    const imagesToDelete = removedImages.filter((img) => img.key);

    if (imagesToDelete.length === 0) {
      return { success: true, deletedCount: 0 };
    }

    // Usando a mesma função que você já tem para deletar múltiplas imagens
    const deleteResult = await deleteCloudinaryImages(
      imagesToDelete.map((img) => img.key!)
    );

    if (deleteResult.failed.length > 0) {
      console.error("❌ Falha na deleção de imagens:", deleteResult.failed);

      // SE ALGUMA IMAGEM FALHOU NA DELEÇÃO, CANCELAMOS TUDO
      return {
        success: false,
        deletedCount: deleteResult.deleted.length,
        error: `Falha ao deletar ${deleteResult.failed.length} imagem(ns) do Cloudinary. Operação cancelada para manter sincronia.`,
      };
    }

    return {
      success: true,
      deletedCount: deleteResult.deleted.length,
    };
  };

  const handleRemoveImageClick = (index: number) => {
    const imageToRemove = images[index];

    // Se a imagem já foi upada para o Cloudinary (tem key), marca para deleção
    if (imageToRemove.key) {
      setRemovedImages((prev) => [...prev, imageToRemove]);
    }

    // Remove preview se for imagem nova (não upada ainda)
    if (imageToRemove.preview && !imageToRemove.url) {
      URL.revokeObjectURL(imageToRemove.preview);
    }

    setImages((prev) => prev.filter((_, i) => i !== index));

    toast.success(
      imageToRemove.key
        ? "Imagem marcada para remoção (salve para confirmar)"
        : "Imagem removida"
    );
  };

  const handleClose = () => {
    // Limpar previews de imagens não salvas
    images.forEach((image) => {
      if (image.preview && !image.url) {
        URL.revokeObjectURL(image.preview);
      }
    });

    setCategoryName(category?.name || "");
    setImages(category?.images || []);
    setRemovedImages([]);
    onOpenChange(false);
  };

  const dialogTitle = mode === "create" ? "Novo Catálogo" : "Editar Catálogo";
  const dialogDescription =
    mode === "create"
      ? "Crie uma nova categoria e adicione imagens."
      : "Altere o nome ou as imagens desta categoria.";

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent>
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
              disabled={uploading}
            />
          </div>
        </div>

        <Dropzone
          accept={{ "image/*": [] }}
          maxFiles={999}
          maxSize={1024 * 1024 * 10}
          minSize={1024}
          onDrop={handleDrop}
          onError={(error) => {
            toast.error(`Erro ao carregar imagens: ${error}`);
          }}
          disabled={!canAddMoreImages || uploading}
        >
          <DropzoneEmptyState />
        </Dropzone>

        {images.length > 0 && (
          <div className="w-full mt-4 min-w-14">
            <Label className="text-sm mb-2 block">
              Pré-visualização ({images.length} imagens nesta categoria)
            </Label>

            {/* Mostrar alerta visual se exceder o limite */}
            {(() => {
              const currentTotal = calculateTotalImages();
              const finalTotal = currentTotal + images.length;
              const excessImages = finalTotal - maxTotalImages;

              if (excessImages > 0) {
                return (
                  <div className="mb-3 p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-destructive text-sm font-medium">
                      <MessageSquareWarning size={20} /> Limite excedido em{" "}
                      {excessImages} imagem(ns)
                    </p>
                    <p className="text-destructive/80 text-xs mt-1">
                      Remova {excessImages} imagem(ns) ou ajuste outros
                      catálogos para salvar
                    </p>
                  </div>
                );
              }
              return null;
            })()}

            {/* SWIPER PARA AS IMAGENS */}
            <Swiper spaceBetween={8} slidesPerView={2.2} modules={[Navigation]}>
              {images.map((image, index) => (
                <SwiperSlide key={image.key || index}>
                  <div className="relative aspect-video">
                    <div className="relative w-full h-full rounded-md overflow-hidden border">
                      <Image
                        src={image.preview || image.url}
                        alt={`Preview ${index + 1}`}
                        fill
                        className="object-cover"
                      />
                      {uploading && (
                        <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                          <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        </div>
                      )}
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveImageClick(index)}
                      className="absolute top-1 right-1 bg-popover rounded-full p-0.5 z-10"
                      disabled={uploading}
                    >
                      <X size={12} />
                    </button>
                  </div>
                </SwiperSlide>
              ))}
            </Swiper>

            {/* Informações do limite */}
            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>
                Total global: {calculateTotalImages() + images.length}/
                {maxTotalImages}
                {(() => {
                  const currentTotal = calculateTotalImages();
                  const finalTotal = currentTotal + images.length;
                  const excessImages = finalTotal - maxTotalImages;

                  if (excessImages > 0) {
                    return ` (+${excessImages})`;
                  }
                  return "";
                })()}
              </span>
              <span>{images.length} selecionada(s)</span>
            </div>
          </div>
        )}

        <DialogFooter className="flex justify-between">
          <div className="flex gap-2">
            <Button
              variant="outline"
              type="button"
              onClick={handleClose}
              disabled={uploading}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              onClick={handleSave}
              disabled={
                !categoryName.trim() || images.length === 0 || uploading
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

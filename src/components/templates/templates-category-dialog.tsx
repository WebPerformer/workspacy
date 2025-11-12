"use client";

import { useState } from "react";
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

interface ImageFile {
  file: File;
  preview: string;
  uploadedUrl?: string;
  filename?: string;
}

interface Category {
  id: string;
  name: string;
  images: ImageFile[];
}

interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: Category;
  onSave: (category: Omit<Category, "id">) => void;
  totalImages: number;
  maxTotalImages: number;
}

export function CategoryDialog({
  open,
  onOpenChange,
  mode,
  category,
  onSave,
  totalImages,
  maxTotalImages,
}: CategoryDialogProps) {
  const [categoryName, setCategoryName] = useState(category?.name || "");
  const [images, setImages] = useState<ImageFile[]>(category?.images || []);
  const [uploading, setUploading] = useState(false);

  const imagesRemaining = maxTotalImages - totalImages;
  const canAddMoreImages = imagesRemaining > 0;

  const handleDrop = async (files: File[]) => {
    if (!canAddMoreImages) {
      toast.error(`Limite total de ${maxTotalImages} imagens atingido`);
      return;
    }

    const filesToAdd = files.slice(0, imagesRemaining);

    // Criar previews locais
    const newImages: ImageFile[] = filesToAdd.map((file) => ({
      file,
      preview: URL.createObjectURL(file),
    }));

    setImages((prev) => [...prev, ...newImages]);
  };

  const removeImage = async (index: number) => {
    return;
  };

  const uploadImages = async (): Promise<ImageFile[]> => {
    return [];
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
      const uploadedImages = await uploadImages();

      onSave({
        name: categoryName.trim(),
        images: uploadedImages,
      });

      toast.success(
        mode === "create"
          ? `Categoria "${categoryName}" criada com sucesso!`
          : `Categoria "${categoryName}" atualizada!`
      );

      onOpenChange(false);
    } catch (error) {
      console.error("Erro ao salvar categoria:", error);
      toast.error("Erro ao salvar categoria");
    } finally {
      setUploading(false);
    }
  };

  const handleClose = () => {
    // Limpar previews locais das imagens que não foram salvas
    images.forEach((image) => {
      if (!image.uploadedUrl) {
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
              disabled={uploading}
            />
          </div>
        </div>

        <Dropzone
          accept={{ "image/*": [] }}
          maxFiles={imagesRemaining}
          maxSize={1024 * 1024 * 10} // 10MB
          minSize={1024}
          onDrop={handleDrop}
          onError={(error) => {
            toast.error(`Erro ao carregar imagens: ${error}`);
          }}
          disabled={!canAddMoreImages || uploading}
        >
          <DropzoneEmptyState />
        </Dropzone>

        {/* Preview das imagens */}
        {images.length > 0 && (
          <div className="mt-4">
            <Label className="text-sm mb-2 block">
              Pré-visualização ({images.length}/{maxTotalImages})
              {uploading && " - Enviando..."}
              {!canAddMoreImages && !uploading && " - Limite atingido"}
            </Label>
            <div className="grid grid-cols-4 gap-2 max-h-32 overflow-y-auto">
              {images.map((image, index) => (
                <div key={index} className="relative group aspect-video">
                  <div className="relative w-full h-full rounded-md overflow-hidden border">
                    <Image
                      src={image.uploadedUrl || image.preview}
                      alt={`Preview ${index + 1}`}
                      fill
                      className="object-cover"
                      sizes="80px"
                    />
                    {uploading && !image.uploadedUrl && (
                      <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                        <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                      </div>
                    )}
                  </div>
                  <button
                    type="button"
                    onClick={() => removeImage(index)}
                    className="absolute -top-1 -right-1 bg-destructive text-white rounded-full p-0.5 opacity-0 group-hover:opacity-100 transition-opacity z-10"
                    disabled={uploading}
                  >
                    <X size={12} />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}

        <DialogFooter>
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
            disabled={!categoryName.trim() || images.length === 0 || uploading}
          >
            {uploading
              ? "Salvando..."
              : mode === "create"
              ? "Criar Catálogo"
              : "Salvar Alterações"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

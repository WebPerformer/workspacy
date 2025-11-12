// TemplateSetup com CategoryDialog
"use client";

import { Input } from "@/src/components/ui/input";
import { Check, Edit, Plus, X } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/src/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import { Label } from "@/src/components/ui/label";

// Importações para validação
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";

// Componente do Dialog
import { CategoryDialog } from "@/src/components/templates/templates-category-dialog";

// Schema de validação
const portfolioFormSchema = z.object({
  url: z
    .string()
    .min(3, { message: "A URL deve ter pelo menos 3 caracteres" })
    .max(30, { message: "A URL deve ter no máximo 30 caracteres" })
    .regex(/^[a-z0-9-]+$/, {
      message: "Use apenas letras minúsculas, números e hífens",
    }),
  description: z
    .string()
    .min(10, { message: "A descrição deve ter pelo menos 10 caracteres" })
    .max(500, { message: "A descrição deve ter no máximo 500 caracteres" }),
  instagram: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9._]+$/.test(val), {
      message: "Username do Instagram inválido",
    }),
  twitter: z
    .string()
    .optional()
    .refine((val) => !val || /^[a-zA-Z0-9_]+$/.test(val), {
      message: "Username do Twitter inválido",
    }),
  whatsapp: z
    .string()
    .optional()
    .refine((val) => !val || /^[\d\s()+.-]+$/.test(val), {
      message: "Número do WhatsApp inválido",
    }),
});

type PortfolioForm = z.infer<typeof portfolioFormSchema>;

interface ImageFile {
  file: File;
  preview: string;
  uploadedUrl?: string;
}

interface Category {
  id: string;
  name: string;
  images: ImageFile[];
}

export default function TemplateSetup() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(false);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] = useState<Category | null>(null);
  const router = useRouter();

  // Calcular total de imagens
  const totalImages = categories.reduce(
    (total, category) => total + category.images.length,
    0
  );
  const maxTotalImages = 25;

  // Inicializar o formulário com react-hook-form e zod
  const form = useForm<PortfolioForm>({
    resolver: zodResolver(portfolioFormSchema),
    defaultValues: {
      url: "",
      description: "",
      instagram: "",
      twitter: "",
      whatsapp: "",
    },
  });

  // Abrir modal para nova categoria
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  // Abrir modal de edição
  const openEditCategory = (category: Category) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  // Salvar categoria (criação ou edição)
  const handleSaveCategory = (categoryData: Omit<Category, "id">) => {
    if (editingCategory) {
      // Editar categoria existente
      setCategories((prev) =>
        prev.map((cat) =>
          cat.id === editingCategory.id ? { ...cat, ...categoryData } : cat
        )
      );
    } else {
      // Criar nova categoria
      const newCategory: Category = {
        id: Date.now().toString(),
        ...categoryData,
      };
      setCategories((prev) => [...prev, newCategory]);
    }
  };

  // Remover categoria
  const removeCategory = (categoryId: string) => {
    setCategories((prev) => prev.filter((cat) => cat.id !== categoryId));
  };

  // Limpar todas as categorias
  const clearAllCategories = () => {
    setCategories([]);
  };

  // Função para enviar os dados para o backend
  async function onSubmit(data: PortfolioForm) {
    if (categories.length === 0) {
      toast.error("Adicione pelo menos uma categoria com imagens");
      return;
    }

    setLoading(true);

    try {
      // Preparar os dados para enviar
      const payload = {
        ...data,
        categories: categories.map((cat) => ({
          name: cat.name,
          images: cat.images.map((img) => ({
            url: img.uploadedUrl,
            // Outros metadados da imagem se necessário
          })),
        })),
      };

      // Fazer a requisição para o backend
      const response = await fetch("/api/user-config/portfolio", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (response.ok) {
        toast.success("Configurações salvas com sucesso!");
        router.push("/dashboard");
      } else {
        const error = await response.json();
        toast.error(error.message || "Erro ao salvar configurações");
      }
    } catch (error) {
      toast.error("Erro de conexão. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  return (
    <section className="max-w-[440px] mx-auto space-y-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-10">
          {/* Seção URL Personalizada */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h5 className="text-base">Personalizar URL</h5>
              <p className="text-muted-foreground">
                Escolha um identificador único para o seu link.
              </p>
            </div>
            <FormField
              control={form.control}
              name="url"
              render={({ field }) => (
                <FormItem>
                  <div className="relative flex items-center bg-card pl-4 p-4 rounded-md">
                    <span className="text-muted-foreground mr-3">
                      workspacy.com/
                    </span>
                    <FormControl>
                      <Input
                        type="text"
                        placeholder="Ex: meu-template"
                        {...field}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                      />
                    </FormControl>
                    <Check
                      size={16}
                      className={`absolute right-3 ${
                        field.value && !form.formState.errors.url
                          ? "text-green-500"
                          : "text-muted-foreground"
                      }`}
                    />
                  </div>
                  <FormMessage className="text-xs" />
                </FormItem>
              )}
            />
          </div>

          {/* Seção Categorias e Imagens */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h5 className="text-base">Catálogos</h5>
              <p className="text-muted-foreground">
                Crie categorias e adicione imagens para seu template.
              </p>
            </div>

            {/* Lista de Categorias Existentes */}
            {categories.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {totalImages}/{maxTotalImages} imagens em{" "}
                    {categories.length} categoria
                    {categories.length !== 1 ? "s" : ""}
                  </span>
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={clearAllCategories}
                  >
                    Remover todas
                  </Button>
                </div>

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h6 className="font-medium text-sm">{category.name}</h6>
                      <p className="text-xs text-muted-foreground">
                        {category.images.length} imagem
                        {category.images.length !== 1 ? "ens" : ""}
                      </p>
                    </div>
                    <div className="flex gap-1">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => openEditCategory(category)}
                      >
                        <Edit size={14} />
                      </Button>
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        onClick={() => removeCategory(category.id)}
                      >
                        <X size={14} />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}

            {/* Botão para Adicionar Nova Categoria */}
            <Button
              variant="outline"
              className="w-full"
              type="button"
              onClick={openNewCategoryModal}
            >
              <Plus size={16} className="mr-2" />
              Adicionar Catálogo
            </Button>

            <CategoryDialog
              open={dialogOpen}
              onOpenChange={setDialogOpen}
              mode={editingCategory ? "edit" : "create"}
              category={editingCategory || undefined}
              onSave={handleSaveCategory}
              totalImages={totalImages}
              maxTotalImages={maxTotalImages}
            />

            <div className="flex justify-between text-xs text-muted-foreground mt-2">
              <span>Máximo {maxTotalImages} Imagens no total</span>
              <span>
                {totalImages}/{maxTotalImages}
              </span>
            </div>
          </div>

          {/* Seção Sobre Você */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h5 className="text-base">Sobre Você</h5>
              <p className="text-muted-foreground">
                Conte brevemente sobre sua trajetória como fotógrafo e o que te
                inspira.
              </p>
            </div>

            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormControl>
                    <Textarea
                      placeholder="Ex: Fotógrafo especializado em retratos e eventos..."
                      className="min-h-[120px] resize-none"
                      maxLength={500}
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                  <div className="flex justify-between text-xs text-muted-foreground mt-2">
                    <span>Máximo 500 caracteres</span>
                    <span>{field.value.length}/500</span>
                  </div>
                </FormItem>
              )}
            />
          </div>

          {/* Seção Redes Sociais (opcional) */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h5 className="text-base">Redes Sociais (Opcional)</h5>
              <p className="text-muted-foreground">
                Adicione suas redes sociais para contato.
              </p>
            </div>

            <div className="space-y-4">
              <FormField
                control={form.control}
                name="instagram"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu.usuario"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="twitter"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Twitter</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="seu.usuario"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="whatsapp"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>WhatsApp</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="+55 (11) 99999-9999"
                        {...field}
                        value={field.value || ""}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
          </div>

          {/* Botões de Ação */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || categories.length === 0}>
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

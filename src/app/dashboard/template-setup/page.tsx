"use client";

import { Input } from "@/src/components/ui/input";
import { Check, Edit, MessageSquareWarning, Plus, Trash2 } from "lucide-react";
import { useState, useEffect, useContext } from "react";
import { Textarea } from "@/src/components/ui/textarea";
import { useRouter } from "next/navigation";
import { Button } from "@/src/components/ui/button";
import loadingSvg from "@/public/images/loading.svg";

// Importe o AuthContext
import { AuthContext } from "@/src/contexts/AuthContext";

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
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/src/components/ui/dialog";

// Componente do Dialog
import { CategoryDialog } from "@/src/components/templates/templates-category-dialog";
import {
  deleteCategoryConfig,
  getUserConfig,
  updateUserConfig,
  checkUrlAvailability,
} from "@/src/lib/user";
import Image from "next/image";
import { UserConfigCategory } from "@/src/types/user";

// Schema de validação
const templateFormSchema = z.object({
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

type TemplateForm = z.infer<typeof templateFormSchema>;

export default function TemplateSetup() {
  const { user } = useContext(AuthContext);
  const [categories, setCategories] = useState<UserConfigCategory[]>([]);
  const [loading, setLoading] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [editingCategory, setEditingCategory] =
    useState<UserConfigCategory | null>(null);
  const [urlChecking, setUrlChecking] = useState(false);
  const [urlAvailable, setUrlAvailable] = useState<boolean | null>(null);
  const [currentUrl, setCurrentUrl] = useState<string>("");
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [categoryToDelete, setCategoryToDelete] =
    useState<UserConfigCategory | null>(null);
  const router = useRouter();

  const userId = user?.id?.toString() || "";

  useEffect(() => {
    const fetchExistingData = async () => {
      try {
        if (userId) {
          const userConfig = await getUserConfig();

          if (userConfig && userConfig.template_data) {
            const templateData = userConfig.template_data;

            const currentUrlValue = templateData.url || "";
            setCurrentUrl(currentUrlValue);

            form.reset({
              url: currentUrlValue,
              description: templateData.description || "",
              instagram: templateData.instagram || "",
              twitter: templateData.twitter || "",
              whatsapp: templateData.whatsapp || "",
            });

            if (templateData.categories && templateData.categories.length > 0) {
              setCategories(templateData.categories);
            }
          }
        }
      } catch (error) {
        console.error("Erro ao carregar dados:", error);
      } finally {
        setInitialLoading(false);
      }
    };

    fetchExistingData();
  }, [userId]);

  // Calcular total de imagens
  const totalImages = categories.reduce(
    (total, category) => total + category.images.length,
    0
  );
  const maxTotalImages = 25;

  // Inicializar o formulário com react-hook-form e zod
  const form = useForm<TemplateForm>({
    resolver: zodResolver(templateFormSchema),
    defaultValues: {
      url: "",
      description: "",
      instagram: "",
      twitter: "",
      whatsapp: "",
    },
    mode: "onChange",
  });

  // Verificar disponibilidade da URL em tempo real
  const handleUrlChange = async (url: string) => {
    if (!url || url.length < 3) {
      setUrlAvailable(null);
      setUrlChecking(false);
      return;
    }

    // Validar formato primeiro
    if (!/^[a-z0-9-]+$/.test(url)) {
      setUrlAvailable(null);
      setUrlChecking(false);
      return;
    }

    // Se for a URL atual do usuário, considerar como disponível
    if (url === currentUrl) {
      setUrlAvailable(true);
      setUrlChecking(false);
      form.clearErrors("url");
      return;
    }

    setUrlChecking(true);
    try {
      const result = await checkUrlAvailability(url);
      setUrlAvailable(result.success ? result.available || false : null);

      // Limpar erro do formulário se a URL estiver disponível
      if (result.success && result.available === true) {
        form.clearErrors("url");
      }
    } catch (error) {
      setUrlAvailable(null);
    } finally {
      setUrlChecking(false);
    }
  };

  // Abrir modal para nova categoria
  const openNewCategoryModal = () => {
    setEditingCategory(null);
    setDialogOpen(true);
  };

  // Abrir modal de edição
  const openEditCategory = (category: UserConfigCategory) => {
    setEditingCategory(category);
    setDialogOpen(true);
  };

  // Atualizar lista de categorias quando salvar no Dialog
  const handleSaveCategory = (savedCategory: UserConfigCategory) => {
    if (editingCategory) {
      // Atualizar categoria existente
      setCategories((prev) =>
        prev.map((cat) => (cat.id === editingCategory.id ? savedCategory : cat))
      );
    } else {
      // Adicionar nova categoria
      setCategories((prev) => [...prev, savedCategory]);
    }
  };

  const handleDeleteCategory = (categoryId: string) => {
    const category = categories.find((cat) => cat.id === categoryId);
    if (!category) return;

    setCategoryToDelete(category);
    setDeleteDialogOpen(true);
  };

  const confirmDeleteCategory = async () => {
    if (!categoryToDelete) return;

    setLoading(true);
    setDeleteDialogOpen(false);

    // Passe o userId como segundo parâmetro
    const { success, data } = await deleteCategoryConfig(
      categoryToDelete,
      userId
    );

    if (success) {
      setCategories((prev) =>
        prev.filter((cat) => cat.id !== categoryToDelete.id)
      );
      toast.success(`Catálogo "${categoryToDelete.name}" removido!`);
    } else {
      toast.error(data.message || "Erro ao remover catálogo");
    }

    setCategoryToDelete(null);
    setLoading(false);
  };

  // Salvar apenas as informações do template (URL, descrição, redes sociais)
  async function onSubmit(data: TemplateForm) {
    setLoading(true);

    try {
      // Verificar disponibilidade da URL antes de salvar (só se mudou)
      if (data.url !== currentUrl) {
        const urlCheck = await checkUrlAvailability(data.url);
        if (!urlCheck.success || urlCheck.available !== true) {
          form.setError("url", {
            type: "manual",
            message: "Esta URL já está em uso. Escolha outra.",
          });
          setUrlAvailable(false);
          setLoading(false);
          return;
        }
      }

      // Buscar configuração atual para manter as categorias existentes
      const userConfig = await getUserConfig();
      const currentTemplateData = userConfig?.template_data || {};

      // Garantir que mantemos as categorias existentes com estrutura completa
      const templateConfig = {
        url: data.url,
        description: data.description,
        instagram: data.instagram || "",
        twitter: data.twitter || "",
        whatsapp: data.whatsapp || "",
        categories: currentTemplateData.categories || [], // Manter categorias existentes
      };

      const result = await updateUserConfig({
        template_data: templateConfig,
        is_template_configured: true,
      });

      if (result.success) {
        toast.success("Configurações salvas com sucesso!");
        router.push("/dashboard");
      } else {
        toast.error(result.error || "Erro ao salvar configurações");
      }
    } catch (error) {
      toast.error("Erro de conexão. Tente novamente.");
      console.error("Erro:", error);
    } finally {
      setLoading(false);
    }
  }

  if (initialLoading) {
    return (
      <section className="max-w-[440px] mx-auto space-y-10">
        <div className="flex justify-center items-center h-40">
          <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        </div>
      </section>
    );
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
                        onChange={(e) => {
                          field.onChange(e);
                          handleUrlChange(e.target.value);
                        }}
                        className="border-0 focus-visible:ring-0 focus-visible:ring-offset-0 p-0 h-auto"
                      />
                    </FormControl>
                    {urlChecking ? (
                      <div className="absolute right-3 w-4 h-4 border-2 border-primary border-t-transparent rounded-full animate-spin" />
                    ) : (
                      <Check
                        size={16}
                        className={`absolute right-3 ${
                          field.value &&
                          !form.formState.errors.url &&
                          urlAvailable === true
                            ? "text-green-500"
                            : urlAvailable === false
                            ? "text-destructive"
                            : "text-muted-foreground"
                        }`}
                      />
                    )}
                  </div>
                  <FormMessage className="text-xs" />
                  {field.value &&
                    !form.formState.errors.url &&
                    urlAvailable === false && (
                      <p className="text-xs text-destructive mt-1">
                        Esta URL já está em uso. Escolha outra.
                      </p>
                    )}
                  {field.value &&
                    !form.formState.errors.url &&
                    urlAvailable === true && (
                      <p className="text-xs text-green-600 mt-1">
                        URL disponível
                      </p>
                    )}
                </FormItem>
              )}
            />
          </div>

          {/* Seção Categorias e Imagens */}
          <div className="space-y-4">
            <div className="space-y-0.5">
              <h5 className="text-base">Catálogos</h5>
              <p className="text-muted-foreground">
                Crie e gerencie seus catálogos de imagens.
              </p>
            </div>

            {/* Lista de Categorias Existentes */}
            {categories.length > 0 && (
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-sm text-muted-foreground">
                    {totalImages}/{maxTotalImages} imagens em{" "}
                    {categories.length} catálogo
                    {categories.length !== 1 ? "s" : ""}
                  </span>
                </div>

                {/* Alertas visuais */}
                {totalImages > maxTotalImages && (
                  <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md">
                    <p className="text-destructive text-sm font-medium">
                      <MessageSquareWarning size={20} /> Limite de imagens
                      excedido
                    </p>
                    <p className="text-destructive/80 text-xs mt-1">
                      Você tem {totalImages - maxTotalImages} imagem(ns) além do
                      limite. Edite seus catálogos para remover o excesso.
                    </p>
                  </div>
                )}

                {categories.map((category) => (
                  <div
                    key={category.id}
                    className="border rounded-lg p-4 flex justify-between items-center"
                  >
                    <div>
                      <h6 className="font-medium text-sm">{category.name}</h6>
                      <p className="text-xs text-muted-foreground">
                        {category.images.length} image
                        {category.images.length !== 1 ? "ns" : "m"}
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
                        onClick={() => handleDeleteCategory(category.id)}
                        disabled={loading}
                      >
                        {loading ? (
                          <Image
                            src={loadingSvg}
                            alt="loading"
                            width={20}
                            height={20}
                          />
                        ) : (
                          <Trash2 size={14} />
                        )}
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
              categories={categories}
              maxTotalImages={maxTotalImages}
              userId={userId}
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

          {/* Botões de Ação - AGORA SÓ SALVA URL, DESCRIÇÃO E REDES SOCIAIS */}
          <div className="flex items-center justify-end gap-3">
            <Button
              variant="secondary"
              type="button"
              onClick={() => router.back()}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Salvando..." : "Salvar Configurações"}
            </Button>
          </div>
        </form>
      </Form>

      {/* Dialog de Confirmação de Exclusão */}
      <Dialog open={deleteDialogOpen} onOpenChange={setDeleteDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirmar Exclusão</DialogTitle>
            <DialogDescription>
              Tem certeza que deseja remover o catálogo "
              {categoryToDelete?.name}"? Esta ação não pode ser desfeita.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button
              variant="secondary"
              onClick={() => {
                setDeleteDialogOpen(false);
                setCategoryToDelete(null);
              }}
              disabled={loading}
            >
              Cancelar
            </Button>
            <Button
              variant="destructive"
              onClick={confirmDeleteCategory}
              disabled={loading}
            >
              {loading ? "Removendo..." : "Remover"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </section>
  );
}

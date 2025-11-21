import { getUserBySlug } from "@/src/lib/user";
import { UserConfigCategory } from "@/src/types/user";
import { notFound } from "next/navigation";

interface PageProps {
  params: Promise<{
    template: string;
    slug: string;
  }>;
}

export default async function PublicTemplatePage({ params }: PageProps) {
  const { template, slug } = await params;

  try {
    const userData = await getUserBySlug(slug);

    if (!userData?.success || !userData.data) {
      notFound();
    }

    // Agora data.user contém todas as informações
    const { user } = userData.data;

    return (
      <div className="min-h-screen bg-background">
        <header className="border-b bg-card">
          <div className="container mx-auto px-4 py-6">
            <div className="flex items-center gap-4">
              {user.profileImage && (
                <div className="relative w-16 h-16 rounded-full overflow-hidden">
                  <img
                    src={user.profileImage}
                    alt={user.username}
                    className="object-cover w-full h-full"
                  />
                </div>
              )}
              <div className="flex-1">
                <h1 className="text-2xl font-bold">{user.username}</h1>
                {user.config?.description && (
                  <p className="text-muted-foreground mt-1">
                    {user.config.description}
                  </p>
                )}
                <p className="text-sm text-muted-foreground">
                  Template: {template}
                </p>
              </div>
            </div>
          </div>
        </header>

        <main className="container mx-auto px-4 py-8">
          {/* Suas categorias aqui */}
          {user.config?.categories?.map((category: UserConfigCategory) => (
            <div key={category.id} className="mb-8">
              <h2 className="text-xl font-semibold mb-4">{category.name}</h2>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {category.images?.map((image, index) => (
                  <div
                    key={index}
                    className="aspect-square bg-muted rounded-lg overflow-hidden"
                  >
                    <img
                      src={image.url}
                      alt={image.filename}
                      className="w-full h-full object-cover"
                    />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </main>
      </div>
    );
  } catch (error) {
    console.error("Error loading public template:", error);
    notFound();
  }
}

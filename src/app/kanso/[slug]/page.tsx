import { getUserBySlug } from "@/src/lib/user";
import { notFound } from "next/navigation";

import { ImageFilterClient } from "./components/ImageFilterClient";

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

    if (userData?.error === "Template access denied") {
      return (
        <div className="min-h-screen bg-background flex items-center justify-center">
          <div className="text-center space-y-4">
            <h1 className="text-2xl font-bold text-amber-600">
              Acesso Restrito
            </h1>
            <p className="text-muted-foreground">
              Este template não está mais disponível ou o acesso foi revogado.
            </p>
            <div className="text-sm bg-amber-50 p-4 rounded-lg border border-amber-200">
              <p>🔒 O usuário pode ter:</p>
              <ul className="text-left mt-2 space-y-1">
                <li>• Assinatura expirada</li>
                <li>• Template não comprado</li>
                <li>• Acesso revogado</li>
              </ul>
            </div>
          </div>
        </div>
      );
    }

    if (!userData?.success || !userData.data) {
      notFound();
    }

    const { user } = userData.data;

    return <ImageFilterClient user={user} />;
  } catch (error) {
    console.error("Error loading public template:", error);
    notFound();
  }
}

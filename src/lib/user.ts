"use server";
import { cookies } from "next/headers";

import {
  User,
  ChangeUsernameData,
  ChangePasswordData,
  UpdateImageData,
  UserConfigData,
  UserConfigCategory,
} from "../types/user";
import { deleteCloudinaryImage, deleteCloudinaryFolder } from "./cloudinary";

export async function getUserProfile(): Promise<User | null> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      console.warn("Nenhum token encontrado nos cookies.");
      return null;
    }

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/users/me`, {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      credentials: "include",
    });

    if (!response.ok) {
      console.error("Erro ao obter usuário:", response.statusText);
      return null;
    }

    const user: User = await response.json();
    return user;
  } catch (error) {
    console.error("Erro ao obter usuário:", error);
    return null;
  }
}

export async function ChangeUsernameProfile({ username }: ChangeUsernameData) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        username,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function UpdateProfileImage({ profileImage }: UpdateImageData) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        profileImage,
      }),
    });

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function ChangePasswordProfile({ password }: ChangePasswordData) {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/users/me`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({
        newPassword: password,
      }),
    });
    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function DeleteProfile() {
  try {
    const token = (await cookies()).get("token")?.value;

    const response = await fetch(`${process.env.EXTERNAL_API_URL}/users/me`, {
      method: "DELETE",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    });

    const result = await response.json();

    if (response.ok) {
      (await cookies()).delete("token");
      return { success: true, data: result };
    } else {
      return { success: false, data: result };
    }
  } catch (error) {
    console.error("Erro:", error);
    return { success: false, data: error };
  }
}

export async function getUserConfig() {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      console.warn("Nenhum token encontrado nos cookies.");
      return null;
    }

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/user/config`,
      {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        credentials: "include",
      }
    );

    if (!response.ok) {
      console.error(
        "Erro ao obter configurações do usuário:",
        response.statusText
      );
      return null;
    }

    const result = await response.json();

    if (result.success) {
      return result.data;
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter configurações do usuário:", error);
    return null;
  }
}

export async function updateUserConfig(configData: {
  template_data?: UserConfigData;
  selected_template_id?: string;
  is_template_configured?: boolean;
}): Promise<{ success: boolean; data?: any; error?: string }> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { success: false, error: "Não autenticado" };
    }

    const response = await fetch(
      `${process.env.EXTERNAL_API_URL}/user/config`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(configData),
      }
    );

    const result = await response.json();

    if (response.ok) {
      return { success: true, data: result.data };
    } else {
      return {
        success: false,
        error: result.error || "Erro ao salvar configurações",
      };
    }
  } catch (error) {
    console.error("Erro ao salvar configurações:", error);
    return { success: false, error: "Erro de conexão" };
  }
}

export async function deleteCategoryConfig(
  category: UserConfigCategory,
  userId: string
): Promise<{ success: boolean; data: any }> {
  try {
    const token = (await cookies()).get("token")?.value;
    if (!token) {
      return { success: false, data: { message: "Não autenticado" } };
    }

    // 1. PRIMEIRO: Deletar TODAS as imagens do Cloudinary individualmente
    const deletePromises = category.images
      .filter((img) => img.key) // Só imagens que têm key (já foram upadas)
      .map((img) => deleteCloudinaryImage(img.key!));

    const deleteResults = await Promise.all(deletePromises);

    // Verificar se todas as deleções foram bem sucedidas
    const allDeletesSuccessful = deleteResults.every(
      (result) => result.success
    );

    if (!allDeletesSuccessful) {
      const failedCount = deleteResults.filter(
        (result) => !result.success
      ).length;
      return {
        success: false,
        data: {
          message: `Falha ao deletar ${failedCount} imagem(ns) do Cloudinary`,
        },
      };
    }

    // 2. DEPOIS DE DELETAR TODAS AS IMAGENS: Deletar a pasta do Cloudinary
    const folderPath = `users/${userId}/categories/${category.id}`;
    const folderDeleteResult = await deleteCloudinaryFolder(folderPath);

    if (!folderDeleteResult.success) {
      console.warn(
        `Aviso: Não foi possível deletar a pasta ${folderPath} do Cloudinary, mas as imagens foram removidas.`
      );
      // Não retornamos erro aqui porque as imagens já foram deletadas
      // Apenas registramos o aviso e continuamos
    }

    // 3. SÓ SE TODAS AS IMAGENS FORAM DELETADAS: Deletar do banco de dados
    const userConfig = await getUserConfig();
    if (!userConfig?.template_data) {
      return {
        success: false,
        data: { message: "Configuração não encontrada" },
      };
    }

    const updatedCategories = userConfig.template_data.categories.filter(
      (cat: UserConfigCategory) => cat.id !== category.id
    );

    const updateResult = await updateUserConfig({
      template_data: {
        ...userConfig.template_data,
        categories: updatedCategories,
      },
    });

    if (updateResult.success) {
      return {
        success: true,
        data: {
          ...updateResult.data,
          message: "Catálogo removido com sucesso",
          deletedImages: deleteResults.length,
          folderDeleted: folderDeleteResult.success,
        },
      };
    } else {
      return {
        success: false,
        data: { message: updateResult.error || "Erro ao remover catálogo" },
      };
    }
  } catch (error) {
    console.error("Erro ao deletar categoria:", error);
    return {
      success: false,
      data: { message: "Erro de conexão" },
    };
  }
}

// Em lib/user.ts
export async function getUserBySlug(slug: string) {
  try {
    const apiUrl = process.env.EXTERNAL_API_URL || "http://localhost:3001";

    const response = await fetch(
      `${apiUrl}/users/by-slug`, // URL fixa agora
      {
        method: "POST", // Mudou para POST
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ slug }), // Slug no body
        cache: "no-store",
      }
    );

    if (!response.ok) {
      throw new Error(`Failed to fetch user: ${response.status}`);
    }

    const data = await response.json();

    return data;
  } catch (error) {
    console.error("Error fetching user by slug:", error);
    return {
      success: false,
      error: error instanceof Error ? error.message : "Failed to fetch user",
    };
  }
}

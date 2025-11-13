"use server";
import { cookies } from "next/headers";

export type User = {
  id: number;
  username: string;
  email: string;
  profileImage: string;
  role: "admin" | "user";
};

export interface UserConfig {
  id: string;
  selected_template_id: string | null;
  template_data: any;
  is_template_configured: boolean;
  stripe_customer_id: string | null;
}

export interface TemplateImage {
  url: string;
  filename: string;
  key: string;
  uploaded_at: Date;
  size: number;
  metadata?: {
    categoryId?: string;
    userId?: string;
    description?: string;
  };
}

export interface TemplateCategory {
  id: string;
  name: string;
  images: TemplateImage[];
}

export interface TemplateData {
  url: string;
  description: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  categories: TemplateCategory[];
}

type ChangeUsernameData = {
  username: string;
};

type ChangePasswordData = {
  password: string;
};

type UpdateImageData = {
  profileImage: string;
};

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
      return result.data; // Retorna o UserConfig completo
    } else {
      return null;
    }
  } catch (error) {
    console.error("Erro ao obter configurações do usuário:", error);
    return null;
  }
}

export async function updateUserConfig(configData: {
  template_data?: TemplateData;
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

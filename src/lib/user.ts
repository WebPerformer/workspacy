"use server";

import { cookies } from "next/headers";

type User = {
  id: number;
  username: string;
  email: string;
  profileImage: string;
};

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

    const response = await fetch("http://localhost:3001/profile", {
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

    const response = await fetch("http://localhost:3001/profile/username", {
      method: "PUT",
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

    const response = await fetch("http://localhost:3001/profile/image", {
      method: "PUT",
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

    const response = await fetch("http://localhost:3001/profile/password", {
      method: "PUT",
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

    const response = await fetch("http://localhost:3001/profile", {
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

export type User = {
  id: number;
  username: string;
  email: string;
  profileImage: string;
  role: "admin" | "user";
};

export type ChangeUsernameData = {
  username: string;
};

export type ChangePasswordData = {
  password: string;
};

export type UpdateImageData = {
  profileImage: string;
};

export interface UserConfig {
  id: string;
  selected_template_id: string | null;
  template_data: any;
  is_template_configured: boolean;
  stripe_customer_id: string | null;
}

export interface UserConfigImage {
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

export interface UserConfigCategory {
  id: string;
  name: string;
  images: UserConfigImage[];
}

export interface CategoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  mode: "create" | "edit";
  category?: UserConfigCategory;
  onSave: (category: UserConfigCategory) => void;
  categories: UserConfigCategory[];
  maxTotalImages: number;
  userId: string;
}

export interface UserConfigData {
  url: string;
  description: string;
  instagram?: string;
  twitter?: string;
  whatsapp?: string;
  categories: UserConfigCategory[];
}

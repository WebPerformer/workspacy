import { User } from "./user";

export type AuthContextType = {
  user: User | null;
  setUser: (user: User | null) => void;
  isLoading: boolean;
};

export type SigninData = {
  email: string;
  password: string;
  remember?: boolean | undefined;
};

export type SignupData = {
  username: string;
  email: string;
  password: string;
};

export type ForgotPasswordData = {
  email: string;
};

export type ValidateOtpData = {
  email: string;
  otp: string;
};

export type ResetPasswordData = {
  email: string;
  otp: string;
  newPassword: string;
};

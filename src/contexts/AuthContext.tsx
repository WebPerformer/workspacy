"use client";
import { createContext, useEffect, useState } from "react";
import { getUserProfile } from "@/src/lib/user";
import { User } from "../types/user";
import { AuthContextType } from "../types/auth";

export const AuthContext = createContext<AuthContextType>({
  user: null,
  setUser: () => {},
  isLoading: true,
});

export function AuthProvider({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function getUserData() {
      setIsLoading(true);
      const userData = await getUserProfile();
      setUser(userData);
      setIsLoading(false);
    }

    getUserData();
  }, []);

  return (
    <AuthContext.Provider value={{ user, setUser, isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

"use client";
import { useContext, useState } from "react";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { Eye, EyeOff } from "lucide-react";

import Image from "next/image";
import Link from "next/link";
import google from "@/public/images/google.png";
import loading from "@/public/images/loading.svg";
import logo from "@/public/images/logo-ui.svg";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Checkbox } from "@/src/components/ui/checkbox";
import { Input } from "@/src/components/ui/input";
import { Label } from "@/src/components/ui/label";

import { AuthContext } from "@/src/contexts/AuthContext";
import { signInRequest, getGoogleOAuthURL } from "@/src/lib/auth";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  remember: z.boolean().default(false).optional(),
});

export default function SignIn() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { success, data } = await signInRequest(values);

    if (success) {
      setUser(data);
      router.push("/dashboard");
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
  }

  async function handleGoogleSignIn() {
    const url = await getGoogleOAuthURL();
    router.push(url);
  }

  return (
    <section className="max-w-[340px] mx-auto px-2 sm:px-4 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image src={logo} alt="logo" width={40} height={40} />
        <div>
          <h1 className="text-xl font-medium mb-1">WorkSpacy</h1>
          <p className="text-sm text-muted-foreground">
            Entre com seus dados por favor
          </p>
        </div>
      </div>
      <Button variant="outline" onClick={handleGoogleSignIn} className="w-full">
        <Image src={google} alt="google" width={20} height={20} />
        Entre com Google
      </Button>
      <div className="relative text-center">
        <div className="h-[1px] bg-border w-full absolute top-1/2 -translate-y-1/2"></div>
        <div className="text-xs text-muted-foreground bg-muted px-4 relative z-10 w-fit mx-auto">
          OU
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Email</FormLabel>
                <FormControl>
                  <Input type="email" {...field} />
                </FormControl>
                <FormMessage />
              </FormItem>
            )}
          />
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Senha</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showPassword ? "text" : "password"}
                        {...field}
                        className="pr-12"
                      />
                      <div
                        onClick={() => setShowPassword(!showPassword)}
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                      >
                        {showPassword ? (
                          <Eye size={16} />
                        ) : (
                          <EyeOff size={16} />
                        )}
                      </div>
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FormField
                  control={form.control}
                  name="remember"
                  render={({ field }) => (
                    <Checkbox
                      id="remember"
                      checked={field.value}
                      onCheckedChange={(checked) => field.onChange(checked)}
                    />
                  )}
                />
                <Label
                  htmlFor="remember"
                  className="text-sm text-muted-foreground"
                >
                  Lembrar de mim
                </Label>
              </div>
              <Link
                href="/dashboard/forgot-password"
                className="text-sm hover:underline"
              >
                Esqueceu a senha?
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Image src={loading} alt="loading" width={20} height={20} />
              ) : (
                "Entrar"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">Não tem uma conta?</p>
        <Link href="/dashboard/signup" className="text-sm hover:underline">
          Registrar
        </Link>
      </div>
    </section>
  );
}

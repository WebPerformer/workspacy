"use client";

import Image from "next/image";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { toast } from "sonner";

import logo from "@/public/images/logo-ui.svg";

import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Input } from "@/src/components/ui/input";
import { Button } from "@/src/components/ui/button";
import { zodResolver } from "@hookform/resolvers/zod";
import { useSearchParams, useRouter } from "next/navigation";
import { resetPasswordRequest } from "@/src/lib/forgotPassword";
import { useState } from "react";
import loading from "@/public/images/loading.svg";
import { EyeOff, Eye } from "lucide-react";

const formSchema = z
  .object({
    password: z.string().min(8, "Password must be at least 8 characters."),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    path: ["confirmPassword"],
    message: "Passwords must match",
  });

function ResetPassword() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const otp = searchParams.get("otp");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      password: "",
      confirmPassword: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { success, data } = await resetPasswordRequest({
      email: email!,
      otp: otp!,
      newPassword: values.password,
    });

    if (success) {
      toast.success(data.message);
      router.push("/signin");
    } else {
      toast.error(data.message);
    }
    setIsLoading(false);
  }

  return (
    <section className="max-w-[340px] mx-auto px-2 sm:px-4 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image src={logo} alt="logo" width={40} height={40} />
        <div>
          <h1 className="text-xl font-medium mb-1">Set new password</h1>
          <p className="text-sm text-muted-foreground">
            Must be at least 8 characters.
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex flex-col gap-4">
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>New password</FormLabel>
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
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm new password</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <Input
                        type={showConfirmPassword ? "text" : "password"}
                        {...field}
                        className="pr-12"
                      />
                      <div
                        onClick={() =>
                          setShowConfirmPassword(!showConfirmPassword)
                        }
                        className="absolute right-4 top-1/2 -translate-y-1/2 cursor-pointer text-muted-foreground"
                      >
                        {showConfirmPassword ? (
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
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Image src={loading} alt="loading" width={20} height={20} />
              ) : (
                "Reset password"
              )}
            </Button>
          </div>
        </form>
      </Form>
    </section>
  );
}

export default ResetPassword;

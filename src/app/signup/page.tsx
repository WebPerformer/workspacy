"use client";

import { useContext, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

import logo from "@/public/images/logo-ui.svg";
import google from "@/public/images/google.png";
import loading from "@/public/images/loading.svg";

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
import { AuthContext } from "@/src/contexts/AuthContext";
import { SignUpRequest } from "@/src/lib/auth";
import { EyeOff, Eye } from "lucide-react";

const formSchema = z.object({
  username: z
    .string()
    .min(3, {
      message: "Name must be at least 3 characters.",
    })
    .max(30, {
      message: "Name must be less than 30 characters.",
    }),
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  remember: z.boolean().default(false).optional(),
});

function SignUp() {
  const { setUser } = useContext(AuthContext);
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      username: "",
      email: "",
      password: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { success, data } = await SignUpRequest(values);

    if (success) {
      toast.success("User created successfully");
      setUser(data);
      router.push("/avatar-picker");
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
          <h1 className="text-xl font-medium mb-1">Get started now</h1>
          <p className="text-sm text-muted-foreground">
            Be part of the community and start your journey now.
          </p>
        </div>
      </div>
      <Button variant="outline" className="w-full">
        <Image src={google} alt="google" width={20} height={20} />
        Sign in with Google
      </Button>
      <div className="relative text-center">
        <div className="h-[1px] bg-border w-full absolute top-1/2 -translate-y-1/2"></div>
        <div className="text-xs text-muted-foreground bg-muted px-4 relative z-10 w-fit mx-auto">
          OR
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <FormField
            control={form.control}
            name="username"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Name</FormLabel>
                <FormControl>
                  <Input type="text" {...field} />
                </FormControl>
                <FormDescription>
                  This is your public display name.
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
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
                  <FormLabel>Password</FormLabel>
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
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Image src={loading} alt="loading" width={20} height={20} />
              ) : (
                "Sign Up"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm text-muted-foreground">Don't have an account?</p>
        <Link href="/signin" className="text-sm hover:underline">
          Sign in
        </Link>
      </div>
    </section>
  );
}

export default SignUp;

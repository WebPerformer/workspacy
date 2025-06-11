"use client";

import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";

import logo from "@/public/images/logo-ui.svg";
import loading from "@/public/images/loading.svg";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import { Input } from "@/src/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";
import { forgotPasswordRequest } from "@/src/lib/forgotPassword";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { useState } from "react";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
});

function ForgotPassword() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { success, data } = await forgotPasswordRequest({
      email: values.email,
    });

    if (success) {
      toast.success(data.message);
      router.push("/one-time-password?email=" + values.email);
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
          <h1 className="text-xl font-medium mb-1">Forgot Password?</h1>
          <p className="text-sm text-muted-foreground">
            No worries, we'll send you reset instructions.
          </p>
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
            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <Image src={loading} alt="loading" width={20} height={20} />
              ) : (
                "Send Reset Link"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <Link
        href="/signin"
        className="flex items-center justify-center gap-2 text-sm hover:text-foreground hover:underline"
      >
        <MoveLeft /> Back to Sign In
      </Link>
    </section>
  );
}

export default ForgotPassword;

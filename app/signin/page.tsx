"use client";

import Image from "next/image";
import Link from "next/link";
import { z } from "zod";
import { useForm } from "react-hook-form";

import logo from "@/public/images/logo-ui.svg";
import google from "@/public/images/google.png";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { zodResolver } from "@hookform/resolvers/zod";
import { Label } from "@/components/ui/label";

const formSchema = z.object({
  email: z.string().email({
    message: "Invalid email address.",
  }),
  password: z.string().min(8, {
    message: "Password must be at least 8 characters.",
  }),
  remember: z.boolean().default(false).optional(),
});

function SignIn() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      email: "",
      password: "",
      remember: true,
    },
  });

  function onSubmit(values: z.infer<typeof formSchema>) {
    console.log(values);
  }

  return (
    <section className="max-w-[340px] mx-auto px-2 sm:px-4 flex flex-col gap-6">
      <div className="flex flex-col items-center gap-6 text-center">
        <Image src={logo} alt="logo" width={40} height={40} />
        <div>
          <h1 className="text-xl font-medium mb-1">
            Welcome back to WorkSpacy
          </h1>
          <p className="text-sm text-accent">Please enter your details</p>
        </div>
      </div>
      <Button variant="outline" className="w-full">
        <Image src={google} alt="google" width={20} height={20} />
        Sign in with Google
      </Button>
      <div className="relative text-center">
        <div className="h-[1px] bg-border w-full absolute top-1/2 -translate-y-1/2"></div>
        <div className="text-xs text-accent bg-background px-4 relative z-10 w-fit mx-auto">
          OR
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
                  <FormLabel>Password</FormLabel>
                  <FormControl>
                    <Input type="password" {...field} />
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
                <Label htmlFor="remember" className="text-sm text-accent">
                  Remember me
                </Label>
              </div>
              <Link href="/forgot-password" className="text-sm hover:underline">
                Forgot password?
              </Link>
            </div>
          </div>
          <div className="flex flex-col gap-4">
            <Button type="submit" className="w-full">
              Sign In
            </Button>
          </div>
        </form>
      </Form>
      <div className="flex items-center justify-center gap-2">
        <p className="text-sm text-accent">Don't have an account?</p>
        <Link href="/signup" className="text-sm hover:underline">
          Sign up
        </Link>
      </div>
    </section>
  );
}

export default SignIn;

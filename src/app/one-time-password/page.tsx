"use client";

import Image from "next/image";
import { useRouter, useSearchParams } from "next/navigation";
import { z } from "zod";
import { useForm } from "react-hook-form";

import logo from "@/public/images/logo-ui.svg";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormMessage,
} from "@/src/components/ui/form";
import { Button } from "@/src/components/ui/button";
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSlot,
} from "@/src/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordRequest,
  validateOtpRequest,
} from "@/src/lib/forgotPassword";
import { toast } from "sonner";
import { useEffect, useState } from "react";
import loading from "@/public/images/loading.svg";

const formSchema = z.object({
  otp: z.string().min(6, {
    message: "Invalid OTP.",
  }),
});

function OtpCode() {
  const searchParams = useSearchParams();
  const email = searchParams.get("email");
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [timer, setTimer] = useState(60); // Initialize with 60 seconds

  async function handleResend() {
    if (timer === 0) {
      console.log("Resending email...");
      setTimer(60);
      const { success, data } = await forgotPasswordRequest({
        email: email!,
      });
      if (success) {
        toast.success(data.message);
      } else {
        toast.error(data.message);
      }
    }
  }

  useEffect(() => {
    if (timer === 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => prev - 1);
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  // Add new useEffect to start countdown on mount
  useEffect(() => {
    setTimer(60);
  }, []);

  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      otp: "",
    },
  });

  async function onSubmit(values: z.infer<typeof formSchema>) {
    setIsLoading(true);
    const { success, data } = await validateOtpRequest({
      email: email!,
      otp: values.otp,
    });

    if (success) {
      toast.success(data.message);
      router.push("/reset-password?email=" + email + "&otp=" + values.otp);
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
          <h1 className="text-xl font-medium mb-1">Password Reset</h1>
          <p className="text-sm text-muted-foreground">
            We send a code to{" "}
            <span className="text-foreground font-medium">{email}</span>
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center w-full">
            <FormField
              control={form.control}
              name="otp"
              render={({ field }) => (
                <FormItem className="w-full">
                  <FormControl>
                    <InputOTP maxLength={6} {...field} className="w-full">
                      <InputOTPGroup className="w-full justify-between">
                        <InputOTPSlot
                          index={0}
                          className="flex-1 aspect-square"
                        />
                        <InputOTPSlot
                          index={1}
                          className="flex-1 aspect-square"
                        />
                        <InputOTPSlot
                          index={2}
                          className="flex-1 aspect-square"
                        />
                        <InputOTPSlot
                          index={3}
                          className="flex-1 aspect-square"
                        />
                        <InputOTPSlot
                          index={4}
                          className="flex-1 aspect-square"
                        />
                        <InputOTPSlot
                          index={5}
                          className="flex-1 aspect-square"
                        />
                      </InputOTPGroup>
                    </InputOTP>
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
                "Continue"
              )}
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center">
        <p className="text-sm text-muted-foreground">
          Don't receive the email?{" "}
          {timer === 0 ? (
            <span
              className="text-foreground hover:underline cursor-pointer"
              onClick={handleResend}
            >
              Click to resend
            </span>
          ) : (
            <span className="text-foreground">Wait {timer}s to resend</span>
          )}
        </p>
      </div>
    </section>
  );
}

export default OtpCode;

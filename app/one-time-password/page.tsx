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
import {
  InputOTP,
  InputOTPGroup,
  InputOTPSeparator,
  InputOTPSlot,
} from "@/components/ui/input-otp";
import { zodResolver } from "@hookform/resolvers/zod";
import { MoveLeft } from "lucide-react";

const formSchema = z.object({
  pin: z.string().min(6, {
    message: "Invalid pin.",
  }),
});

function OtpCode() {
  const form = useForm<z.infer<typeof formSchema>>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      pin: "",
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
          <h1 className="text-xl font-medium mb-1">Password Reset</h1>
          <p className="text-sm text-accent">
            We send a code to{" "}
            <span className="text-foreground font-medium">teste@gmail.com</span>
          </p>
        </div>
      </div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
          <div className="flex justify-center w-full">
            <FormField
              control={form.control}
              name="pin"
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
            <Button type="submit" className="w-full">
              Continue
            </Button>
          </div>
        </form>
      </Form>
      <div className="text-center">
        <p className="text-sm text-accent">
          Don't receive the email?{" "}
          <span className="text-sm text-foreground hover:underline cursor-pointer">
            Click to resend
          </span>
        </p>
      </div>
    </section>
  );
}

export default OtpCode;

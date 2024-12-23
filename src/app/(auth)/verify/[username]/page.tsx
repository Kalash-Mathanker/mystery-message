'use client'

import { useParams, useRouter } from "next/navigation";
import React from "react";
import { useToast } from "@/hooks/use-toast";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { verifySchema } from "@/schema/verifySchema";
import axios, { AxiosError } from "axios";
import { ApiResponse } from "@/types/ApiResponse";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";

function VerifyAccount() {
  const router = useRouter();
  const params = useParams<{ username: string }>();
  const { toast } = useToast();
  const form = useForm<z.infer<typeof verifySchema>>({
    resolver: zodResolver(verifySchema),
  });

    const onSubmit = async (data: z.infer<typeof verifySchema>) => {
        try {
      const response = await axios.post<ApiResponse>(`/api/verify-code`, {
        username: params.username,
        code: data.code,
      });
      toast({
        title: "success",
        description: response.data.message,
      });
        router.replace('/signin')
    } catch (error) {
      console.log("Error in code verification ", error);
      const axiosError = error as AxiosError<ApiResponse>;
      let errorMessage =
        axiosError.response?.data.message ??
        "An error occurred. Please try again.";
      toast({
        title: "Verification failed",
        description: errorMessage,
        variant: "destructive",
      });
    }
  };

    return (
      <div className="flex min-h-screen items-center justify-center bg-gray-800">
        <div className="w-full max-w-md space-y-8 rounded-lg bg-white p-8 shadow-md">
          <div className="text-center">
            <h1 className="mb-6 text-4xl font-extrabold tracking-tight lg:text-5xl">
              Verify Your Account
            </h1>
            <p className="mb-4">
              Enter the verification code sent to your email
            </p>
          </div>
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
              <FormField
                name="code"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Verification Code</FormLabel>
                    <Input
                      placeholder="code"
                      {...field}
                      value={field.value || ""}
                    />
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Verify</Button>
            </form>
          </Form>
        </div>
      </div>
    );
}

export default VerifyAccount;

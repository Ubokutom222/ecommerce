"use client";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { Card, CardHeader, CardContent, CardTitle } from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormMessage,
  FormLabel,
} from "@/components/ui/form";
import { SignInSchema, type SignInType } from "../schemas";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignInView() {
  const isMobile = useIsMobile();
  const trpc = useTRPC();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordSeen, setIsPasswordSeen] = useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const mutation = useMutation(
    trpc.auth.sign_in.mutationOptions({
      onError(error) {
        setErrorMessage(error.message);
      },
      onSuccess() {
        toast.success("Logged In, Redirecting...");
        router.push("/");
      },
    }),
  );

  async function onSubmit(data: SignInType) {
    await mutation.mutateAsync({
      ...data,
    });
  }

  if (isMobile) {
    return (
      <Card className="flex flex-col w-full mx-6">
        <CardHeader>
          <CardTitle>Welcome Back</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full space-y-6"
            >
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        {...field}
                        placeholder="example@example.com"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="password"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Password</FormLabel>
                    <div className="relative flex items-center">
                      <FormControl>
                        <Input
                          type={isPasswordSeen ? "text" : "password"}
                          {...field}
                          placeholder="********"
                        />
                      </FormControl>
                      <Button
                        variant="link"
                        type="button"
                        size="icon"
                        onClick={() => setIsPasswordSeen(!isPasswordSeen)}
                        className="absolute top-0 right-2"
                      >
                        {isPasswordSeen ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                  </FormItem>
                )}
              />
              <Button type="submit">Sign In</Button>
            </form>
          </Form>
          {errorMessage && (
            <div className="justify-start w-full p-6 my-2 rounded-lg text-destructive bg-destructive/30">
              {errorMessage}
            </div>
          )}
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-1/3">
      <CardHeader>
        <CardTitle>Welcome Back</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-6"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      {...field}
                      placeholder="example@example.com"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="password"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Password</FormLabel>
                  <div className="relative flex items-center">
                    <FormControl>
                      <Input
                        type={isPasswordSeen ? "text" : "password"}
                        {...field}
                        placeholder="********"
                      />
                    </FormControl>
                    <Button
                      variant="link"
                      type="button"
                      size="icon"
                      onClick={() => setIsPasswordSeen(!isPasswordSeen)}
                      className="absolute top-0 right-2"
                    >
                      {isPasswordSeen ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                </FormItem>
              )}
            />
            <Button type="submit">Sign In</Button>
          </form>
        </Form>
        {errorMessage && (
          <div className="justify-start w-full p-6 my-2 rounded-lg text-destructive bg-destructive/30">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-row justify-center w-full">
          Don&apos;t have an account?
          <span className="ml-6 font-semibold cursor-pointer hover:underline">
            <Link href="/sign-up" prefetch>
              Sign Up
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

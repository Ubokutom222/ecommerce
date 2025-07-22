"use client";
import {
  Card,
  CardHeader,
  CardDescription,
  CardContent,
  CardTitle,
} from "@/components/ui/card";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  Form,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormControl,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { SignInSchema } from "../schema";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

export function SignInView() {
  const trpc = useTRPC();
  const router = useRouter();
  const form = useForm({
    resolver: zodResolver(SignInSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });
  const [isPasswordSeen, setIsPasswordSeen] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const mutation = useMutation(
    trpc.admin.signIn.mutationOptions({
      onSuccess() {
        toast.success("Logged In, Redirecting...");
        router.push("/admin/dashboard");
      },
      onError(error) {
        setErrorMessage(error.message);
      },
    }),
  );

  async function onSubmit(data: z.infer<typeof SignInSchema>) {
    await mutation.mutateAsync({
      ...data,
    });
  }

  return (
    <Card className="w-1/3">
      <CardHeader>
        <CardTitle>Sign In</CardTitle>
      </CardHeader>
      <CardContent className="flex flex-col space-y-4">
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col space-y-4"
          >
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} />
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
                        {...field}
                        type={isPasswordSeen ? "text" : "password"}
                      />
                    </FormControl>
                    <Button
                      className="absolute top-0 right-2"
                      variant="ghost"
                      size="icon"
                      type="button"
                      onClick={() => setIsPasswordSeen(!isPasswordSeen)}
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
          <div className="p-6 rounded-md bg-destructive/30">
            <CardDescription className="text-base text-destructive">
              {errorMessage}
            </CardDescription>
          </div>
        )}
      </CardContent>
    </Card>
  );
}

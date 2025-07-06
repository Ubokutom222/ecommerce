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
import { SignUpSchema, type SignUpType } from "../schemas";
import { useState } from "react";
import { useIsMobile } from "@/hooks/use-mobile";
import { Input } from "@/components/ui/input";
import { Eye, EyeOff } from "lucide-react";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function SignUpView() {
  const isMobile = useIsMobile();
  const trpc = useTRPC();
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isPasswordSeen, setIsPasswordSeen] = useState<boolean>(false);
  const [isConfirmPasswordSeen, setIsConfirmPasswordSeen] =
    useState<boolean>(false);

  const form = useForm({
    resolver: zodResolver(SignUpSchema),
    defaultValues: {
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      confirmPassword: "",
    },
  });
  const mutation = useMutation(
    trpc.auth.sign_up.mutationOptions({
      onError(error) {
        setErrorMessage(error.message);
      },
      onSuccess() {
        toast.success("Your Account was created successfully");
        router.push("/");
      },
    }),
  );

  async function onSubmit(data: SignUpType) {
    await mutation.mutateAsync({
      ...data,
    });
  }

  if (isMobile) {
    return (
      <Card className="flex flex-col w-full mx-6">
        <CardHeader>
          <CardTitle>Create An Account</CardTitle>
        </CardHeader>
        <CardContent>
          <Form {...form}>
            <form
              onSubmit={form.handleSubmit(onSubmit)}
              className="flex flex-col w-full space-y-6"
            >
              <FormField
                name="firstname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="John" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="lastname"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Last Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Doe" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="email"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>E-mail</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="johndoe@example.com" />
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
                          placeholder="********"
                          type={isPasswordSeen ? "text" : "password"}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() => setIsPasswordSeen(!isPasswordSeen)}
                        className="absolute top-0 right-2"
                      >
                        {isPasswordSeen ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                name="confirmPassword"
                control={form.control}
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Cofirm Password</FormLabel>
                    <div className="relative flex items-center">
                      <FormControl>
                        <Input
                          {...field}
                          placeholder="********"
                          type={isConfirmPasswordSeen ? "text" : "password"}
                        />
                      </FormControl>
                      <Button
                        type="button"
                        variant="link"
                        onClick={() =>
                          setIsConfirmPasswordSeen(!isConfirmPasswordSeen)
                        }
                        className="absolute top-0 right-2"
                      >
                        {isConfirmPasswordSeen ? <EyeOff /> : <Eye />}
                      </Button>
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <Button type="submit">Register</Button>
            </form>
          </Form>
          {errorMessage && (
            <div className="justify-start w-full p-6 my-2 rounded-lg text-destructive bg-destructive/30">
              {errorMessage}
            </div>
          )}
          <div className="flex flex-row justify-center w-full">
            Already have an account?
            <span className="ml-6 font-semibold cursor-pointer">
              <Link href="/sign-in" prefetch>
                Sign In
              </Link>
            </span>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="flex flex-col w-1/3">
      <CardHeader>
        <CardTitle>Create An Account</CardTitle>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="flex flex-col w-full space-y-6"
          >
            <FormField
              name="firstname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>First Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="John" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="lastname"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Last Name</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="Doe" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="email"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>E-mail</FormLabel>
                  <FormControl>
                    <Input {...field} placeholder="johndoe@example.com" />
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
                        placeholder="********"
                        type={isPasswordSeen ? "text" : "password"}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() => setIsPasswordSeen(!isPasswordSeen)}
                      className="absolute top-0 right-2"
                    >
                      {isPasswordSeen ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              name="confirmPassword"
              control={form.control}
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Confirm Password</FormLabel>
                  <div className="relative flex items-center">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="********"
                        type={isConfirmPasswordSeen ? "text" : "password"}
                      />
                    </FormControl>
                    <Button
                      type="button"
                      variant="link"
                      onClick={() =>
                        setIsConfirmPasswordSeen(!isConfirmPasswordSeen)
                      }
                      className="absolute top-0 right-2"
                    >
                      {isConfirmPasswordSeen ? <EyeOff /> : <Eye />}
                    </Button>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit">Register</Button>
          </form>
        </Form>
        {errorMessage && (
          <div className="justify-start w-full p-6 my-2 rounded-lg text-destructive bg-destructive/30">
            {errorMessage}
          </div>
        )}
        <div className="flex flex-row justify-center w-full">
          Already have an account?
          <span className="ml-6 font-semibold cursor-pointer">
            <Link href="/sign-in" prefetch>
              Sign In
            </Link>
          </span>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";
interface Props {
  productname: string;
  productId: string;
}
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogClose,
} from "@/components/ui/dialog";
import {
  Form,
  FormField,
  FormItem,
  FormControl,
  FormLabel,
} from "@/components/ui/form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { useTRPC } from "@/trpc/client";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { useModal } from "@/lib/providers/ModalProvider";

const formSchema = z.object({
  productname: z.string(),
  quantity: z.string().refine((val) => !isNaN(parseInt(val, 10)), {
    message: "Invalid number",
  }),
});

export function AddToCartModal({ productname, productId }: Props) {
  const form = useForm({
    resolver: zodResolver(formSchema),
    defaultValues: {
      productname,
      quantity: "1",
    },
  });
  const { hideModal } = useModal();
  const trpc = useTRPC();
  const mutation = useMutation(
    trpc.products.addToCart.mutationOptions({
      onError(error) {
        toast.error(error.message);
      },
      onSuccess() {
        toast.success("Added Sucessfully");
        hideModal();
      },
    }),
  );

  async function onSubmit(data: z.infer<typeof formSchema>) {
    await mutation.mutateAsync({
      productId,
      quantity: parseInt(data.quantity, 10),
    });
  }

  return (
    <DialogContent className="flex flex-col space-y-4">
      <DialogHeader>
        <DialogTitle>Add To Cart</DialogTitle>
      </DialogHeader>
      <p>Adding To Cart</p>
      <Form {...form}>
        <form
          className="flex flex-col space-y-4"
          onSubmit={form.handleSubmit(onSubmit)}
        >
          <FormField
            name="productname"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormControl>
                  <Input {...field} disabled className="truncate" />
                </FormControl>
              </FormItem>
            )}
          />
          <FormField
            name="quantity"
            control={form.control}
            render={({ field }) => (
              <FormItem>
                <FormLabel>Quantity</FormLabel>
                <FormControl>
                  <Input {...field} />
                </FormControl>
              </FormItem>
            )}
          />
          <DialogFooter>
            <DialogClose>Cancel</DialogClose>
            <Button type="submit">
              {mutation.isPending ? (
                <LoaderCircleIcon className="animate-spin" />
              ) : (
                <span>Confirm</span>
              )}
            </Button>
          </DialogFooter>
        </form>
      </Form>
    </DialogContent>
  );
}

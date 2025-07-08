"use client";
import { Button } from "@/components/ui/button";
import {
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";
import { useModal } from "@/lib/providers/ModalProvider";

interface Props {
  productname: string;
  productId: string;
}

export function RemoveFromCartModal({ productname, productId }: Props) {
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const { hideModal } = useModal();
  const mutation = useMutation(
    trpc.products.removeFromCart.mutationOptions({
      onSuccess() {
        toast.success(`${productname} have been removed from the cart`);
        queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
        hideModal();
      },
      onError() {
        toast.error("Something went wrong");
      },
    }),
  );

  return (
    <DialogContent>
      <DialogHeader>
        <DialogTitle>Confirmation</DialogTitle>
      </DialogHeader>
      <DialogDescription>Are you sure you want to remove</DialogDescription>
      <Input disabled value={productname} />
      <DialogFooter>
        <Button
          variant="destructive"
          onClick={async () => {
            await mutation.mutateAsync({
              productId,
            });
          }}
        >
          {mutation.isPending ? (
            <LoaderCircleIcon className="animate-spin" />
          ) : (
            <span>Remove</span>
          )}
        </Button>
        <DialogClose>Cancel</DialogClose>
      </DialogFooter>
    </DialogContent>
  );
}

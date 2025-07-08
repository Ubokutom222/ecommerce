"use client";
import type { InferSelectModel } from "drizzle-orm";
import { products, usersCart } from "@/db/schema";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { X } from "lucide-react";
import { useModal } from "@/lib/providers/ModalProvider";
import { useState } from "react";
import { useTRPC } from "@/trpc/client";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { Input } from "@/components/ui/input";
interface Props {
  product: InferSelectModel<typeof products>;
  cart: InferSelectModel<typeof usersCart>;
}
export function CartItem({ product, cart }: Props) {
  const { showModal } = useModal();
  const [isQuantityChanged, setIsQuantityChange] = useState<boolean>(false);
  const [quantity, setQuantity] = useState<string>(cart.quantity.toString());
  const trpc = useTRPC();
  const queryClient = useQueryClient();
  const mutation = useMutation(
    trpc.cart.updateQuantity.mutationOptions({
      onSuccess() {
        toast.success("Quantity has been updated");
        queryClient.invalidateQueries(trpc.cart.getCart.queryOptions());
        setIsQuantityChange(false);
      },
      onError(error) {
        toast.error(error.message);
      },
    }),
  );
  return (
    <div className="w-full">
      <div className="grid w-full grid-cols-6 gap-4">
        <div className="col-span-1">
          <Image
            alt={product.productName}
            src={product.previewUrl ?? "https://placehold.co/400.png"}
            className="flex-1 w-full h-auto"
            layout="responsive"
            width={1}
            height={1}
          />
        </div>
        <div className="flex flex-col justify-between col-span-5 p-4">
          <div className="flex flex-row justify-between w-full space-x-8">
            <h4 className="flex-1 text-xl text-wrap hover:underline">
              <Link href={`/products/${product.id}`}>
                {product.productName}
              </Link>
            </h4>
            <h4 className="text-xl font-bold">
              &#8358; {(product.price * cart.quantity) / 100}
            </h4>
          </div>
          <div className="flex flex-row space-x-6">
            <Input
              id="quantityInput"
              value={quantity}
              onChange={(e) => {
                setIsQuantityChange(true);
                setQuantity(e.target.value);
              }}
              className="w-10"
            />
            {isQuantityChanged && (
              <Button
                onClick={async () => {
                  const parsedQuantity = parseInt(quantity, 10);
                  if (!isNaN(parsedQuantity) && parsedQuantity > 0) {
                    await mutation.mutateAsync({
                      productId: product.id,
                      quantity: parsedQuantity,
                    });
                  } else {
                    toast.error(
                      "Please enter a valid positive number for quantity",
                    );
                  }
                }}
              >
                Update Quantity
              </Button>
            )}
            <Button
              className="flex flex-row items-center space-x-2 text-destructive hover:bg-destructive/30"
              variant="secondary"
              onClick={() => {
                showModal({
                  type: "RFC",
                  productname: product.productName,
                  productId: product.id,
                });
              }}
            >
              <X />
              Remove
            </Button>
          </div>
          <p className="text-lg text-muted-foreground">
            Delivery on 13 Nov, 2025
          </p>
        </div>
      </div>
      <Separator className="mt-4" />
    </div>
  );
}

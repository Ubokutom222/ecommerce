"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery, useMutation } from "@tanstack/react-query";
import { CartItem } from "../components/CartItem";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Separator } from "@/components/ui/separator";
import { useEffect, useState } from "react";
import { toast } from "sonner";
import { LoaderCircleIcon } from "lucide-react";

export function CartView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.cart.getCart.queryOptions());
  const [total, setTotal] = useState<number>(0);

  const checkoutMutation = useMutation(
    trpc.cart.checkout.mutationOptions({
      onSuccess: (response) => {
        // Redirect to the URL returned by the backend
        window.location.href = response.url;
      },
      onError: () => {
        toast.error("Something went wrong");
      },
    }),
  );

  useEffect(() => {
    function getTotal() {
      let total = 0;
      data.map((item) => {
        const eachTotal = item.products.price * item.users_cart.quantity;
        total += eachTotal;
      });
      setTotal(total);
    }

    getTotal();
  }, [data]);

  const metadata: Array<{ id: string; quantity: number; unitPrice: number }> =
    [];

  data.map((item) => {
    metadata.push({
      id: item.products.id,
      quantity: item.users_cart.quantity,
      unitPrice: item.products.price,
    });
  });

  return (
    <div className="flex flex-col h-[calc(100vh_-_4rem)] gap-6">
      <div className="grid flex-1 h-full grid-cols-4 gap-6">
        <div className="h-full col-span-3 space-y-4 overflow-y-scroll">
          {data.length === 0 ? (
            <p className="text-lg text-muted-foreground">No Item in the cart</p>
          ) : (
            data.map((item) => (
              <CartItem
                key={item.products.id}
                product={item.products}
                cart={item.users_cart}
              />
            ))
          )}
        </div>
        <div className="flex flex-col col-span-1">
          <Card>
            <CardContent className="flex flex-col space-y-4">
              <div className="flex flex-row justify-between">
                <span className="text-lg font-semibold">Total</span>
                <span className="text-lg font-bold">
                  {new Intl.NumberFormat("en-NG", {
                    style: "currency",
                    currency: "NGN",
                  }).format(total / 100)}
                </span>
              </div>
              <Separator className="w-full" />
              <Button
                className="w-full"
                onClick={() =>
                  checkoutMutation.mutate({
                    amount: total,
                    products: metadata,
                  })
                }
              >
                {checkoutMutation.isPending ? (
                  <LoaderCircleIcon className="animate-spin" />
                ) : (
                  <span>Proceed To Payment</span>
                )}
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

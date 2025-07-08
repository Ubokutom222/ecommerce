"use client";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { CartItem } from "../components/CartItem";
export function CartView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.cart.getCart.queryOptions());
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
        <div className="flex flex-col col-span-1"></div>
      </div>
    </div>
  );
}

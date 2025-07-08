import auth from "@/lib/auth";
import { redirect } from "next/navigation";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { getQueryClient, trpc } from "@/trpc/server";
import { CartView } from "@/modules/cart/views/CartView";
import { headers } from "next/headers";

export default async function CartPage() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  if (!session) redirect("/sign-in");

  const queryClient = getQueryClient();
  void (await queryClient.prefetchQuery(trpc.cart.getCart.queryOptions()));

  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <CartView />
    </HydrationBoundary>
  );
}

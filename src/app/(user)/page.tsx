import { HomeView } from "@/modules/user/views/HomeViews";
import { getQueryClient } from "@/trpc/server";
import { trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";

export default async function HomePage() {
  const queryClient = getQueryClient();
  void (await queryClient.prefetchQuery(trpc.user.getProducts.queryOptions()));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <HomeView />
    </HydrationBoundary>
  );
}

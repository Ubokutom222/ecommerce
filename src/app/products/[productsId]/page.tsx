import { getQueryClient } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { ProductPageView } from "@/modules/products/views/ProductPageView";
import { trpc } from "@/trpc/server";
interface Props {
  params: Promise<{
    productsId: string;
  }>;
}

export default async function ProductPage({ params }: Props) {
  const { productsId } = await params;
  const queryClient = getQueryClient();
  void (await queryClient.prefetchQuery(
    trpc.products.getProductInfo.queryOptions({
      productId: productsId,
    }),
  ));
  return (
    <HydrationBoundary state={dehydrate(queryClient)}>
      <ProductPageView productsId={productsId} />
    </HydrationBoundary>
  );
}

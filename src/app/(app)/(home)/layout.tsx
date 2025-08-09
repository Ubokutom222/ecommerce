import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters, SearchFiltersLoading } from "./search-filters";
import { getQueryClient, trpc } from "@/trpc/server";
import { HydrationBoundary, dehydrate } from "@tanstack/react-query";
import { Suspense } from "react";

interface Props {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  const queryClient = getQueryClient();
  void (await queryClient.prefetchQuery(
    trpc.categories.getMany.queryOptions(),
  ));
  return (
    <div className="flex flex-col min-h-screen">
      <HydrationBoundary state={dehydrate(queryClient)}>
        <Navbar />
        <Suspense fallback={<SearchFiltersLoading />}>
          <SearchFilters />
        </Suspense>
        <main className="flex-1 bg-[#F4F4F0]">{children}</main>
        <Footer />
      </HydrationBoundary>
    </div>
  );
}

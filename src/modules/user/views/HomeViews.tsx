"use client";
import { ProductCard } from "@/modules/user/components/ProductCard";
import { useTRPC } from "@/trpc/client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { ChevronDown } from "lucide-react";
export function HomeView() {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(trpc.user.getProducts.queryOptions());
  const isMobile = useIsMobile();

  if (isMobile)
    return (
      <div className="flex flex-col h-[calc(100vh_-_4rem)] w-screen">
        <Collapsible className="w-full">
          {/* TODO: HANDLE PRODUCT FILTERING FROM QUERIES */}
          <CollapsibleTrigger className="flex flex-row justify-between w-full">
            Filter
            <ChevronDown className="size-4" />
          </CollapsibleTrigger>
          <CollapsibleContent>The Filters</CollapsibleContent>
        </Collapsible>
        <div className="grid flex-1 w-full h-full grid-cols-1 gap-6 p-6 overflow-y-scroll">
          {data.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    );

  return (
    <div className="h-[calc(100vh_-_4rem)] grid grid-cols-4 w-screen">
      {/* TODO: HANDLE PRODUCT FILTERING FROM QUERIES */}
      <div className="h-full col-span-1">Filters</div>
      <div className="grid grid-cols-3 col-span-3 gap-3 overflow-y-scroll">
        {data.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  );
}

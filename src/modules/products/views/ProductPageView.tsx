"use client";
import { useSuspenseQuery } from "@tanstack/react-query";
import { useTRPC } from "@/trpc/client";
import { useIsMobile } from "@/hooks/use-mobile";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, ShoppingCart } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import DOMPurify from "dompurify";
interface Props {
  productsId: string;
}
export function ProductPageView({ productsId }: Props) {
  const trpc = useTRPC();
  const { data } = useSuspenseQuery(
    trpc.products.getProductInfo.queryOptions({
      productId: productsId,
    }),
  );
  const isMobile = useIsMobile();
  const safeHTML = DOMPurify.sanitize(data[0].products.description || "");
  if (isMobile) return;
  return (
    <div className="grid grid-cols-5 gap-6 text-base">
      <div className="col-span-2 ">
        <Image
          alt={data[0].products.productName}
          src={data[0].products.previewUrl ?? "https://placehold.co/400.png"}
          className="flex-1 w-full h-auto"
          layout="responsive"
          width={1} // Aspect ratio width
          height={1} // Aspect ratio height
        />
      </div>
      <div className="col-span-3 flex flex-col space-y-8 w-full">
        <h3 className="font-semibold text-xl text-wrap w-full h-auto">
          {data[0].products.productName}
        </h3>
        <div className="flex flex-row space-x-4 items-center">
          <h4 className="font-extrabold text-xl">
            &#8358; {data[0].products.price / 100}
          </h4>
          {/* TODO: HANDLE REVIEW FUNCTIONALITY */}
          Reviews
        </div>
        <div className="flex flex-row space-x-4 items-center">
          <Button variant="secondary" className="flex flex-row space-x-2">
            <Heart />
            Add To Favourite
          </Button>
          <Button variant="default">
            <ShoppingCart />
            Add To Cart
          </Button>
        </div>
        <Separator className="w-full" />
        <div>
          {data[0].products.description === null ? (
            <p className="text-muted-foreground">No description added</p>
          ) : (
            <div dangerouslySetInnerHTML={{ __html: safeHTML }} />
          )}
        </div>
      </div>
    </div>
  );
}

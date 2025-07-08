"use client";
import { products } from "@/db/schema";
import type { InferSelectModel } from "drizzle-orm";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import Image from "next/image";
import {
  HoverCard,
  HoverCardTrigger,
  HoverCardContent,
} from "@/components/ui/hover-card";
import { Heart } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useIsMobile } from "@/hooks/use-mobile";
import { cn } from "@/lib/utils";
import { useModal } from "@/lib/providers/ModalProvider";

interface Props {
  product: InferSelectModel<typeof products>;
}

export function ProductCard({ product }: Props) {
  const isMobile = useIsMobile();
  const { showModal } = useModal();
  return (
    <Card
      className={cn(
        "border border-foreground min-w-xs text-base h-fit",
        isMobile && "h-[256px]",
      )}
    >
      <CardContent className="flex flex-col space-y-4">
        <Image
          alt={product.productName}
          src={product.previewUrl ?? "https://placehold.co/400.png"}
          className="flex-1 w-full h-auto"
          layout="responsive"
          width={1} // Aspect ratio width
          height={1} // Aspect ratio height
        />
        <div className="flex flex-row justify-end w-full space-x-4">
          <HoverCard>
            <HoverCardTrigger
              // TODO: Add functionality to add to favourite
              onClick={() => {}}
              className="cursor-pointer"
            >
              <Heart className="size-4" />
            </HoverCardTrigger>
            <HoverCardContent className="size-fit">
              Add To Favourite
            </HoverCardContent>
          </HoverCard>
        </div>
        <CardTitle className="w-full hover:underline text-wrap">
          <Link href={`/products/${product.id}`}>{product.productName}</Link>
        </CardTitle>
        {/* TODO: Implement review functionality */}
        <div className="flex justify-start w-full">Reviews</div>
        <div className="flex flex-row items-center justify-between">
          <CardTitle>&#8358; {product.price / 100}</CardTitle>
          {/* TODO: Add Cart Functionality */}
          <Button
            onClick={() => {
              showModal({
                productId: product.id,
                productname: product.productName,
                type: "ATC",
              });
            }}
          >
            Add To Cart
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

"use client";
import { CustomCategory } from "../types";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useState } from "react";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useRouter } from "next/navigation";

interface Props {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  data: CustomCategory[]; // TODO: Remove this later
}

export function CategoriesSidebar({ open, onOpenChange, data }: Props) {
  const router = useRouter();
  const [parentCategories, setParentCategories] = useState<
    CustomCategory[] | null
  >(null);
  const [selectedCategory, setSelectedCategory] =
    useState<CustomCategory | null>(null);

  // NOTE: If we have parent categories show those otherwise show root categories

  const currentCategories = parentCategories ?? data ?? [];

  function handleOpenChange(open: boolean) {
    setSelectedCategory(null);
    setParentCategories(null);
    onOpenChange(open);
  }

  function handleCategoryClick(category: CustomCategory) {
    if (category.subcategories && category.subcategories.length > 0) {
      setParentCategories(category.subcategories as CustomCategory[]);
      setSelectedCategory(category);
    } else {
      // NOTE: This is leaf category (no subcategories)
      if (parentCategories && selectedCategory) {
        // NOTE: This is a subcategory; Navigate to "/[category]/[subcategory]"
        router.push(`/${selectedCategory.slug}/${category.slug}`);
      } else {
        // NOTE: This is a parent category; navigate to "/[category]"
        if (category.slug === "all") router.push("/");
        else router.push(`/${category.slug}`);
      }

      handleOpenChange(false);
    }
  }

  function handleBackClick() {
    if (parentCategories) {
      setParentCategories(null);
      setSelectedCategory(null);
    }
  }

  const backgroundColor = selectedCategory?.color || "white";

  return (
    <Sheet open={open} onOpenChange={handleOpenChange}>
      <SheetContent
        side="left"
        className="p-0 transition-none"
        style={{ backgroundColor }}
      >
        <SheetHeader className="p-4 border-b">
          <SheetTitle>Categories</SheetTitle>
        </SheetHeader>
        <ScrollArea className="flex flex-col overflow-y-auto h-full pb-2">
          {parentCategories && (
            <button
              className="w-full text-left p-4 hover:bg-black hover:text-white flex items-center font-medium cursor-pointer"
              onClick={handleBackClick}
            >
              <ChevronLeftIcon className="size-4 mr-2" />
              Back
            </button>
          )}
          {currentCategories.map((category) => (
            <button
              key={category.id}
              className="w-full text-left p-4 hover:bg-black hover:text-white flex justify-between items-center font-medium cursor-pointer"
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
              {category.subcategories && category.subcategories.length > 0 && (
                <ChevronRightIcon className="size-4 " />
              )}
            </button>
          ))}
        </ScrollArea>
      </SheetContent>
    </Sheet>
  );
}

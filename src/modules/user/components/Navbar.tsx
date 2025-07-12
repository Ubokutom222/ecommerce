"use client";
import { useIsMobile } from "@/hooks/use-mobile";
import {
  NavigationMenu,
  NavigationMenuList,
  NavigationMenuLink,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import { ShoppingCart, UserCircle, LogOutIcon } from "lucide-react";
import { useSession } from "@/lib/providers/SessionProvider";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { SidebarTrigger } from "@/components/ui/sidebar";
import { Skeleton } from "@/components/ui/skeleton";
import { authClient } from "@/lib/auth-client";

export function Navbar() {
  const isMobile = useIsMobile();
  const { session, isLoading } = useSession();

  if (isMobile) {
    return (
      <div className="flex flex-row items-center justify-between w-screen h-16 text-base fixed top-0 left-0 right-0">
        <div className="flex flex-row h-full">
          <h1 className="text-2xl font-bold">BuildWebWithKT</h1>
        </div>

        <div className="flex items-center h-full">
          {session && !isLoading && (
            <div className="flex flex-row space-x-5">
              <Button variant="secondary" size="icon" asChild>
                <Link href="/cart" prefetch>
                  <ShoppingCart />
                </Link>
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger className="flex items-center space-x-3 flex-row">
                  <UserCircle />
                  Account
                </DropdownMenuTrigger>
                <DropdownMenuLabel>
                  {/* TODO: Users Avatar and name */}
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuContent>
                  <DropdownMenuItem>Favourites</DropdownMenuItem>
                  <DropdownMenuItem>Wishlist</DropdownMenuItem>
                  <DropdownMenuItem>Orders</DropdownMenuItem>
                  <DropdownMenuItem>Transaction History</DropdownMenuItem>
                  <DropdownMenuSeparator />
                  {/* TODO: Sign-out functionality */}
                  <DropdownMenuItem className="text-destructive">
                    <LogOutIcon />
                    Log Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          )}
          {!session && !isLoading && (
            <Button asChild>
              <Link href="/sign-in" prefetch>
                Sign in
              </Link>
            </Button>
          )}
          {isLoading && (
            <div className="flex flex-row items-center h-full space-x-3">
              <Skeleton className="size-9" />
              <Skeleton className="h-9 w-12" />
            </div>
          )}
          <SidebarTrigger />
        </div>
      </div>
    );
  }
  return (
    <div className="flex flex-row items-center justify-between w-screen h-16 text-base fixed top-0 left-0 right-0">
      <div className="flex flex-row items-center h-full space-x-5">
        <h1 className="text-2xl font-bold">BuildWebWithKT</h1>
        <NavigationMenu>
          <NavigationMenuList>
            <NavigationMenuLink href="/">Store</NavigationMenuLink>
            <NavigationMenuLink href="/about-us">About Us</NavigationMenuLink>
            <NavigationMenuLink href="/contact-us">
              Contact Us
            </NavigationMenuLink>
            <NavigationMenuLink href="/report">Report Issue</NavigationMenuLink>
          </NavigationMenuList>
        </NavigationMenu>
      </div>
      <div className="flex items-center h-full">
        {session && !isLoading && (
          <div className="flex flex-row space-x-5">
            <Button
              className="flex flex-row items-center space-x-3"
              variant="secondary"
              asChild
            >
              <Link href="/cart" prefetch>
                <ShoppingCart />
                Cart
              </Link>
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger className="flex flex-row items-center space-x-3">
                <UserCircle />
                Account
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>
                  {/* TODO: Users Avatar and name */}
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Favourites</DropdownMenuItem>
                <DropdownMenuItem>Wishlist</DropdownMenuItem>
                <DropdownMenuItem>Orders</DropdownMenuItem>
                <DropdownMenuItem>Transaction History</DropdownMenuItem>
                <DropdownMenuSeparator />
                {/* TODO: Sign out functionality */}
                <DropdownMenuItem
                  className="text-destructive"
                  onClick={async () => {
                    await authClient.signOut();
                    window.location.reload();
                  }}
                >
                  <LogOutIcon />
                  Log Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        )}
        {!session && !isLoading && (
          <Button asChild>
            <Link href="/sign-in" prefetch>
              Sign In
            </Link>
          </Button>
        )}
        {isLoading && (
          <div className="flex flex-row items-center h-full space-x-5">
            <Skeleton className="w-12 px-4 py-2 h-9" />
            <Skeleton className="w-12 px-4 py-2 h-9" />
          </div>
        )}
      </div>
    </div>
  );
}

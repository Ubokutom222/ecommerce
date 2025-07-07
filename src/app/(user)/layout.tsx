import { SessionProvider } from "@/lib/providers/SessionProvider";
import { Navbar } from "@/modules/user/components/Navbar";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/modules/user/components/MobileSidebar";

interface Props {
  children: React.ReactNode;
}

export default function UserLayout({ children }: Props) {
  return (
    <div>
      <SessionProvider>
        <SidebarProvider defaultOpen={false}>
          <div className="flex flex-col w-screen h-screen">
            <AppSidebar />
            <Navbar />
            <main className="flex flex-col size-full mt-16">{children}</main>
          </div>
        </SidebarProvider>
      </SessionProvider>
    </div>
  );
}

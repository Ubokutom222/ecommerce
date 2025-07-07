import { Navbar } from "@/modules/products/components/Navbar";
import { SessionProvider } from "@/lib/providers/SessionProvider";
interface Props {
  children: React.ReactNode;
}
export default function ProductLayout({ children }: Props) {
  return (
    <div className="flex flex-col items-center min-h-screen space-x-8 min-w-screen">
      <SessionProvider>
        <Navbar />
        <div className="flex flex-col w-5/6 mt-16">{children}</div>
      </SessionProvider>
    </div>
  );
}

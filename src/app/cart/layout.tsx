import { Navbar } from "@/modules/cart/components/Navbar";
import { SessionProvider } from "@/lib/providers/SessionProvider";
interface Props {
  children: React.ReactNode;
}

export default function CartLayout({ children }: Props) {
  return (
    <SessionProvider>
      <div className="flex flex-col items-center w-screen h-screen space-x-8">
        <Navbar />
        <div className="flex flex-col w-5/6 mt-16 ">{children}</div>
      </div>
    </SessionProvider>
  );
}

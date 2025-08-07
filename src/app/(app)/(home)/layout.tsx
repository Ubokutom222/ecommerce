import { Category } from "@/payload-types";
import configPromise from "@payload-config";
import { getPayload } from "payload";
import { Navbar } from "./navbar";
import { Footer } from "./footer";
import { SearchFilters } from "./search-filters";

interface Props {
  children: React.ReactNode;
}

export default async function HomeLayout({ children }: Props) {
  const payload = await getPayload({
    config: configPromise,
  });

  const data = await payload.find({
    collection: "categories",
    depth: 1,
    pagination: false,
    where: {
      parent: {
        exists: false,
      },
    },
  });

  const formattedData = data.docs.map((doc) => ({
    ...doc,
    subcategories: (doc.subcategories?.docs ?? []).map((docs) => ({
      // Because of "depth: 1" we are confident that "docs" will be a type of category
      ...(docs as Category),
      subcategories: undefined,
    })),
  }));

  return (
    <div className="flex flex-col min-h-screen">
      <Navbar />
      <SearchFilters data={formattedData} />
      <main className="flex-1 bg-[#F4F4F0]">{children}</main>
      <Footer />
    </div>
  );
}

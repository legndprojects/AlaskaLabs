import { catalog, searchCatalog } from "@/data/catalog";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop — AlaskaLabs",
  description: "Browse our collection of research peptides.",
};

export default async function ShopPage({
  searchParams,
}: {
  searchParams: Promise<{ q?: string }>;
}) {
  const { q } = await searchParams;
  const query = (q ?? "").trim();
  const products = query ? searchCatalog(query) : catalog;

  return (
    <main className="min-h-screen bg-white pt-24 md:pt-36 pb-16 px-4 md:px-16 lg:px-24">
      <div className="max-w-[1400px] mx-auto">
        <h1 className="text-4xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-4">
          Shop
        </h1>
        <p className="text-lg font-sans text-[#888] mb-12">
          {query
            ? `${products.length} result${products.length === 1 ? "" : "s"} for "${query}"`
            : "Research Peptides"}
        </p>

        {products.length === 0 ? (
          <p className="text-[#888] font-sans">
            No products match your search. Try another term.
          </p>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-6">
            {products.map((p) => (
              <ProductCard key={p.handle} product={p} />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

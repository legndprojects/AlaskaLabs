import { medusa } from "@/lib/medusa-client";
import ProductCard from "@/components/ProductCard";

export const metadata = {
  title: "Shop — AlaskaLabs",
  description: "Browse our collection of research peptides.",
};

function formatPriceRange(variants: any[]): string {
  if (!variants?.length) return "";
  const prices = variants
    .flatMap(
      (v: any) =>
        v.calculated_price?.calculated_amount
          ? [v.calculated_price.calculated_amount]
          : v.prices?.map((p: any) => p.amount) ?? []
    )
    .filter(Boolean);
  if (!prices.length) return "";
  const min = Math.min(...prices);
  const max = Math.max(...prices);
  return min === max
    ? `$${(min / 100).toFixed(2)}`
    : `From $${(min / 100).toFixed(2)}`;
}

export default async function ShopPage() {
  let products: any[] = [];

  try {
    const response = await medusa.store.product.list({
      limit: 50,
      fields: "+variants.prices,+variants.calculated_price",
    });
    products = response.products || [];
  } catch {
    // Medusa might not be running
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-6xl md:text-8xl font-display font-black uppercase text-[#1a1a1a] mb-4">
          Shop
        </h1>
        <p className="text-lg font-sans text-[#888] mb-12">
          Research Peptides
        </p>

        {products.length === 0 ? (
          <p className="text-[#888] font-sans">
            No products available. Check back soon.
          </p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {products.map((product: any) => (
              <ProductCard
                key={product.id}
                handle={product.handle}
                title={product.title}
                thumbnail={product.thumbnail}
                priceRange={formatPriceRange(product.variants)}
              />
            ))}
          </div>
        )}
      </div>
    </main>
  );
}

import { findByHandle } from "@/data/catalog";
import { notFound } from "next/navigation";
import CatalogBuyBox from "@/components/CatalogBuyBox";
import MobileProductDetail from "@/components/MobileProductDetail";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = findByHandle(handle);
  if (!product) return { title: "Product Not Found — AlaskaLabs" };
  return {
    title: `${product.name} ${product.strength} — AlaskaLabs`,
    description: product.description,
  };
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  const product = findByHandle(handle);
  if (!product) notFound();

  return (
    <main className="min-h-screen bg-white">
      {/* Mobile: dedicated layout with sticky Add to Cart, quantity, bundle */}
      <div className="md:hidden pt-16">
        <MobileProductDetail product={product} />
      </div>

      {/* Desktop: existing two-column layout */}
      <div className="hidden md:block pt-36 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-[1.25fr_1fr] gap-12 lg:gap-16 items-center">
          <div className="aspect-square bg-white rounded-xl overflow-hidden w-full max-w-[680px] mx-auto">
            <img
              src={product.thumbnail}
              alt={`${product.name} ${product.strength}`}
              style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
              className="w-full h-full object-contain"
            />
          </div>

          <div className="flex flex-col justify-center">
            <CatalogBuyBox product={product} />
          </div>
        </div>

        <div className="mt-16 max-w-3xl">
          <div className="mb-12">
            <h2 className="text-2xl font-display font-black uppercase text-[#1a1a1a] mb-4">
              About This Product
            </h2>
            <p className="text-base font-sans text-[#444] leading-relaxed">
              {product.description}
            </p>
          </div>

          <div className="mb-12 bg-[#f5f5f5] rounded-xl p-6">
            <h3 className="text-lg font-display font-black uppercase text-[#1a1a1a] mb-3">
              Purity & Testing
            </h3>
            <div className="flex flex-wrap gap-4 text-sm font-sans text-[#444] mb-4">
              <span className="bg-white px-3 py-1 rounded">Purity: ≥99%</span>
              <span className="bg-white px-3 py-1 rounded">Third-Party Tested</span>
              <span className="bg-white px-3 py-1 rounded">HPLC & Mass Spec Confirmed</span>
            </div>
            <button className="text-sm font-sans text-[#0072BC] hover:underline">
              View Certificate of Analysis (PDF) →
            </button>
          </div>

          <div className="border border-[#eee] rounded-xl p-6">
            <p className="text-xs font-sans text-[#888] leading-relaxed">
              This product is intended for research and laboratory use only. Not
              for human consumption. By purchasing, you agree to our{" "}
              <a href="/terms" className="text-[#0072BC] hover:underline">
                Terms of Service
              </a>
              .
            </p>
          </div>
        </div>
      </div>
      </div>
    </main>
  );
}

import { medusa } from "@/lib/medusa-client";
import ProductDetail from "@/components/ProductDetail";
import { notFound } from "next/navigation";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;
  try {
    const { products } = await medusa.store.product.list({ handle });
    if (!products?.length) return { title: "Product Not Found — AlaskaLabs" };
    return {
      title: `${products[0].title} — AlaskaLabs`,
      description: products[0].description,
    };
  } catch {
    return { title: "Product — AlaskaLabs" };
  }
}

export default async function ProductPage({
  params,
}: {
  params: Promise<{ handle: string }>;
}) {
  const { handle } = await params;

  let product: any = null;
  try {
    const { products } = await medusa.store.product.list({
      handle,
    });
    product = products?.[0] || null;
  } catch {
    // Medusa not running
  }

  if (!product) {
    notFound();
  }

  return (
    <main className="min-h-screen bg-white pt-24 pb-16 px-8 md:px-16 lg:px-24">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Product Image */}
          <div className="aspect-square bg-gradient-to-br from-[#f0f7ff] to-[#e8f4fd] rounded-xl flex items-center justify-center p-12">
            {product.thumbnail ? (
              <img
                src={product.thumbnail}
                alt={product.title}
                className="max-h-full max-w-full object-contain"
              />
            ) : (
              <div className="text-[#0072BC] text-center font-sans">
                Product Image
              </div>
            )}
          </div>

          {/* Buy Box */}
          <div className="flex flex-col justify-center">
            <ProductDetail product={product} />
          </div>
        </div>

        {/* Below the fold */}
        <div className="mt-16 max-w-3xl">
          {product.description && (
            <div className="mb-12">
              <h2 className="text-2xl font-display font-black uppercase text-[#1a1a1a] mb-4">
                About This Product
              </h2>
              <p className="text-base font-sans text-[#444] leading-relaxed">
                {product.description}
              </p>
            </div>
          )}

          {/* COA Section */}
          <div className="mb-12 bg-[#f5f5f5] rounded-xl p-6">
            <h3 className="text-lg font-display font-black uppercase text-[#1a1a1a] mb-3">
              Purity & Testing
            </h3>
            <div className="flex flex-wrap gap-4 text-sm font-sans text-[#444] mb-4">
              <span className="bg-white px-3 py-1 rounded">
                Purity: ≥99%
              </span>
              <span className="bg-white px-3 py-1 rounded">
                Third-Party Tested
              </span>
              <span className="bg-white px-3 py-1 rounded">
                HPLC & Mass Spec Confirmed
              </span>
            </div>
            <button className="text-sm font-sans text-[#0072BC] hover:underline">
              View Certificate of Analysis (PDF) →
            </button>
          </div>

          {/* Research Disclaimer */}
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
    </main>
  );
}

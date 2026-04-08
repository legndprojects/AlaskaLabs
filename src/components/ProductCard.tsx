import Link from "next/link";

interface ProductCardProps {
  handle: string;
  title: string;
  thumbnail: string | null;
  priceRange: string;
}

export default function ProductCard({
  handle,
  title,
  thumbnail,
  priceRange,
}: ProductCardProps) {
  return (
    <Link
      href={`/shop/${handle}`}
      className="group block bg-white rounded-xl border border-[#eee] overflow-hidden transition-all duration-300 hover:shadow-lg hover:scale-[1.02]"
    >
      <div className="aspect-square bg-gradient-to-br from-[#f0f7ff] to-[#e8f4fd] flex items-center justify-center p-8">
        {thumbnail ? (
          <img
            src={thumbnail}
            alt={title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <div className="text-[#0072BC] text-center font-sans text-sm">
            Product Image
          </div>
        )}
      </div>
      <div className="p-6">
        <span className="text-xs font-sans uppercase tracking-[2px] text-[#0072BC] mb-2 block">
          Peptide
        </span>
        <h3 className="text-2xl font-display font-black uppercase text-[#1a1a1a] mb-2">
          {title}
        </h3>
        <p className="text-lg font-sans font-bold text-[#1a1a1a]">
          {priceRange}
        </p>
        <span className="inline-block mt-4 text-sm font-sans text-[#0072BC] group-hover:underline">
          View Product →
        </span>
      </div>
    </Link>
  );
}

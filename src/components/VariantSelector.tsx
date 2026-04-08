"use client";

interface Variant {
  id: string;
  title: string;
  sku: string | null;
  options: Record<string, string> | null;
  calculated_price?: {
    calculated_amount: number;
    currency_code: string;
  } | null;
  prices?: { amount: number; currency_code: string }[];
}

interface VariantSelectorProps {
  variants: Variant[];
  selectedId: string | null;
  onSelect: (variantId: string) => void;
}

function getPrice(variant: Variant): number | null {
  if (variant.calculated_price?.calculated_amount != null) {
    return variant.calculated_price.calculated_amount;
  }
  if (variant.prices?.length) {
    return variant.prices[0].amount;
  }
  return null;
}

export default function VariantSelector({
  variants,
  selectedId,
  onSelect,
}: VariantSelectorProps) {
  return (
    <div>
      <p className="text-xs font-sans font-semibold text-[#666] uppercase tracking-wide mb-2">
        Select Size
      </p>
      <div className="flex gap-2">
        {variants.map((variant) => {
          const isSelected = variant.id === selectedId;
          const price = getPrice(variant);
          // Medusa v2 options can be an array of objects or a Record<string, string>
          let sizeValue = variant.title;
          if (Array.isArray(variant.options) && variant.options.length > 0) {
            sizeValue = variant.options[0].value;
          } else if (variant.options && typeof variant.options === "object" && !Array.isArray(variant.options)) {
            sizeValue = Object.values(variant.options)[0] as string;
          }

          return (
            <button
              key={variant.id}
              onClick={() => onSelect(variant.id)}
              className={`flex-1 border-2 rounded-lg px-4 py-3 text-center transition-all ${
                isSelected
                  ? "border-[#0072BC] bg-[rgba(0,114,188,0.05)] text-[#0072BC]"
                  : "border-[#ddd] text-[#666] hover:border-[#bbb]"
              }`}
            >
              <span className="block text-sm font-sans font-semibold">
                {sizeValue}
              </span>
              {price != null && (
                <span className="block text-xs font-sans mt-1">
                  ${(price / 100).toFixed(2)}
                </span>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}

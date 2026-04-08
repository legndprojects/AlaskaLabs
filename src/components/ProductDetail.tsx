"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import VariantSelector from "./VariantSelector";
import TrustBadges from "./TrustBadges";

interface ProductDetailProps {
  product: any;
}

function getVariantPrice(variant: any): number | null {
  if (variant.calculated_price?.calculated_amount != null) {
    return variant.calculated_price.calculated_amount;
  }
  if (variant.prices?.length) {
    return variant.prices[0].amount;
  }
  return null;
}

export default function ProductDetail({ product }: ProductDetailProps) {
  const variants = product.variants || [];
  const [selectedVariantId, setSelectedVariantId] = useState<string>(
    variants[0]?.id || ""
  );
  const [isAdding, setIsAdding] = useState(false);
  const { addItem } = useCart();

  const selectedVariant = variants.find(
    (v: any) => v.id === selectedVariantId
  );
  const price = selectedVariant ? getVariantPrice(selectedVariant) : null;

  const handleAddToCart = async () => {
    if (!selectedVariantId) return;
    setIsAdding(true);
    try {
      await addItem(selectedVariantId, 1);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-sans uppercase tracking-[2px] text-[#0072BC] mb-1">
        Peptide
      </p>
      <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-[#1a1a1a] mb-2">
        {product.title}
      </h1>
      <p className="text-sm font-sans text-[#888] mb-6">
        {product.subtitle || "Research Peptide"}
      </p>

      {price != null && (
        <p className="text-3xl font-sans font-bold text-[#1a1a1a] mb-6">
          ${(price / 100).toFixed(2)}
        </p>
      )}

      {variants.length > 1 && (
        <div className="mb-6">
          <VariantSelector
            variants={variants}
            selectedId={selectedVariantId}
            onSelect={setSelectedVariantId}
          />
        </div>
      )}

      <button
        onClick={handleAddToCart}
        disabled={isAdding || !selectedVariantId}
        className="w-full bg-[#1a1a1a] text-white font-sans font-semibold text-sm tracking-wide py-4 rounded-lg transition-all hover:bg-[#333] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isAdding
          ? "Adding..."
          : `ADD TO CART${price != null ? ` — $${(price / 100).toFixed(2)}` : ""}`}
      </button>

      <div className="mb-6">
        <TrustBadges />
      </div>

      <div className="border-t border-[#eee] pt-4 text-sm font-sans text-[#888] space-y-1">
        <p>Free shipping on orders over $150</p>
        <p>Discreet packaging</p>
      </div>
    </div>
  );
}

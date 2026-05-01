"use client";

import { useState } from "react";
import { useCart } from "@/lib/cart-context";
import TrustBadges from "./TrustBadges";
import type { CatalogProduct } from "@/data/catalog";

export default function CatalogBuyBox({ product }: { product: CatalogProduct }) {
  const [isAdding, setIsAdding] = useState(false);
  const [added, setAdded] = useState(false);
  const { addItem, openDrawer } = useCart();

  const handleAddToCart = async () => {
    if (isAdding) return;
    setIsAdding(true);
    try {
      await addItem(product.handle, 1);
      openDrawer();
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } finally {
      setIsAdding(false);
    }
  };

  return (
    <div>
      <p className="text-xs font-sans uppercase tracking-[2px] text-[#0072BC] mb-1">
        {product.category}
      </p>
      <h1 className="text-4xl md:text-5xl font-display font-black uppercase text-[#1a1a1a] mb-2">
        {product.name}
      </h1>
      <p className="text-sm font-sans text-[#888] mb-6">
        {product.strength}
      </p>

      <p className="text-3xl font-sans font-bold text-[#1a1a1a] mb-6">
        ${product.price.toFixed(2)}
      </p>

      <button
        onClick={handleAddToCart}
        disabled={isAdding}
        className="w-full bg-[#0072BC] text-white font-sans font-semibold text-sm tracking-wide py-4 rounded-lg transition-colors duration-200 hover:bg-[#003E7E] disabled:opacity-50 disabled:cursor-not-allowed mb-4"
      >
        {isAdding
          ? "ADDING…"
          : added
          ? "ADDED ✓"
          : `ADD TO CART — $${product.price.toFixed(2)}`}
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

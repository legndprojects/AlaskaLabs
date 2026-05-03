"use client";

import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import { catalog } from "@/data/catalog";
import { useCart } from "@/lib/cart-context";
import { useState } from "react";

const DISPLAY_COUNT = 6;

export default function MobileProductGrid() {
  const products = catalog.slice(0, DISPLAY_COUNT);

  return (
    <section className="bg-[#f5f5f5] px-4 py-12">
      <div className="mb-8">
        <p className="text-[11px] tracking-[0.3em] uppercase text-[#0072BC]/60 font-display mb-2">
          Our Collection
        </p>
        <h2 className="text-3xl font-display font-black uppercase text-[#0072BC] leading-[0.95]">
          Popular Products
        </h2>
      </div>

      <div className="grid grid-cols-2 gap-3">
        {products.map((product, i) => (
          <ProductCard key={product.handle} product={product} index={i} />
        ))}
      </div>

      <div className="flex justify-center mt-8">
        <Link
          href="/shop"
          className="inline-flex items-center gap-2 px-8 py-3.5 rounded-full bg-[#0072BC] text-white text-sm font-display tracking-[0.15em] uppercase transition-all hover:bg-[#005a96] active:scale-[0.97]"
        >
          View All
          <svg viewBox="0 0 24 24" className="w-4 h-4 fill-none stroke-current stroke-[2]" strokeLinecap="round" strokeLinejoin="round">
            <path d="M9 5l7 7-7 7" />
          </svg>
        </Link>
      </div>
    </section>
  );
}

function ProductCard({
  product,
  index,
}: {
  product: (typeof catalog)[0];
  index: number;
}) {
  const { addItem, openDrawer } = useCart();
  const [adding, setAdding] = useState(false);
  const [added, setAdded] = useState(false);

  const onAdd = async () => {
    if (adding) return;
    setAdding(true);
    try {
      await addItem(product.handle, 1);
      openDrawer();
      setAdded(true);
      setTimeout(() => setAdded(false), 1400);
    } finally {
      setAdding(false);
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.06, ease: [0.22, 1, 0.36, 1] }}
      className="bg-white rounded-2xl overflow-hidden border border-[#0072BC]/8 flex flex-col"
    >
      <Link href={`/shop/${product.handle}`} className="block">
        <div className="relative aspect-square bg-gradient-to-b from-[#f0f4f8] to-[#e8ecf0] flex items-center justify-center p-4">
          <Image
            src={product.thumbnail}
            alt={product.name}
            width={300}
            height={300}
            style={{ filter: "drop-shadow(0 12px 20px rgba(0,0,0,0.35)) drop-shadow(0 4px 8px rgba(0,0,0,0.2))" }}
            className="object-contain max-h-full w-auto"
          />
        </div>
      </Link>

      <div className="p-3 flex flex-col flex-1">
        <div className="flex items-center gap-1.5 mb-1.5">
          <span className="text-[9px] tracking-[0.1em] uppercase text-[#0072BC]/70 font-display">
            99%+
          </span>
          <span className="text-[9px] text-[#0072BC]/40">·</span>
          <span className="text-[9px] tracking-[0.05em] text-[#0072BC]/50 font-display">
            &lt;0.5 EU/MG
          </span>
        </div>

        <Link href={`/shop/${product.handle}`}>
          <h3 className="font-display font-bold text-sm text-[#0b1a3a] leading-tight mb-0.5">
            {product.name}
          </h3>
        </Link>
        <p className="text-[10px] text-[#0b1a3a]/50 mb-2">{product.strength}</p>

        <div className="mt-auto flex items-center justify-between">
          <span className="font-display font-bold text-lg text-[#0072BC]">
            ${product.price.toFixed(2)}
          </span>
        </div>

        <button
          type="button"
          onClick={onAdd}
          disabled={adding}
          className="mt-2 w-full py-2.5 rounded-xl border border-[#0072BC]/20 text-[#0072BC] text-[11px] font-display tracking-[0.15em] uppercase transition-all hover:bg-[#0072BC] hover:text-white active:scale-[0.97] disabled:opacity-50"
        >
          {adding ? "Adding..." : added ? "Added" : "Add to Cart"}
        </button>
      </div>
    </motion.div>
  );
}

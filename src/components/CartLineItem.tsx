"use client";

import { useCart } from "@/lib/cart-context";

interface CartLineItemProps {
  item: {
    id: string;
    variant_id: string;
    title: string;
    quantity: number;
    unit_price: number;
    thumbnail?: string;
  };
}

export default function CartLineItem({ item }: CartLineItemProps) {
  const { updateQuantity, removeItem } = useCart();

  return (
    <div className="flex gap-4 py-4 border-b border-[#eee]">
      <div className="w-20 h-20 bg-[#f5f5f5] rounded-lg flex items-center justify-center flex-shrink-0">
        {item.thumbnail ? (
          <img
            src={item.thumbnail}
            alt={item.title}
            className="max-h-full max-w-full object-contain"
          />
        ) : (
          <span className="text-xs text-[#888]">IMG</span>
        )}
      </div>

      <div className="flex-1 min-w-0">
        <h4 className="text-sm font-sans font-semibold text-[#1a1a1a] truncate">
          {item.title}
        </h4>
        <p className="text-sm font-sans text-[#888] mt-1">
          ${(item.unit_price / 100).toFixed(2)}
        </p>

        <div className="flex items-center gap-2 mt-2">
          <button
            onClick={() => {
              if (item.quantity > 1) {
                updateQuantity(item.id, item.quantity - 1);
              }
            }}
            disabled={item.quantity <= 1}
            className="w-7 h-7 rounded border border-[#ddd] flex items-center justify-center text-sm text-[#666] hover:bg-[#f5f5f5] disabled:opacity-40 disabled:hover:bg-transparent"
          >
            −
          </button>
          <span className="text-sm font-sans font-medium text-[#1a1a1a] w-8 text-center">
            {item.quantity}
          </span>
          <button
            onClick={() => updateQuantity(item.id, item.quantity + 1)}
            className="w-7 h-7 rounded border border-[#ddd] flex items-center justify-center text-sm text-[#666] hover:bg-[#f5f5f5]"
          >
            +
          </button>
        </div>
      </div>

      <div className="flex flex-col items-end justify-between">
        <p className="text-sm font-sans font-bold text-[#1a1a1a]">
          ${((item.unit_price * item.quantity) / 100).toFixed(2)}
        </p>
        <button
          onClick={() => removeItem(item.id)}
          className="text-xs font-sans text-[#888] hover:text-[#E31C23] transition-colors"
        >
          Remove
        </button>
      </div>
    </div>
  );
}

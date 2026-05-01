"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { findByHandle } from "@/data/catalog";

interface CartItem {
  id: string;
  variant_id: string;
  title: string;
  quantity: number;
  unit_price: number; // stored in cents to match existing UI components
  thumbnail?: string;
}

interface CartContextValue {
  cartId: string | null;
  items: CartItem[];
  itemCount: number;
  isLoading: boolean;
  isDrawerOpen: boolean;
  openDrawer: () => void;
  closeDrawer: () => void;
  addItem: (handle: string, quantity?: number) => Promise<void>;
  removeItem: (lineItemId: string) => Promise<void>;
  updateQuantity: (lineItemId: string, quantity: number) => Promise<void>;
  refreshCart: () => Promise<void>;
}

const CartContext = createContext<CartContextValue | null>(null);

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) {
    throw new Error("useCart must be used within a CartProvider");
  }
  return ctx;
}

const CART_STORAGE_KEY = "alaskalabs_local_cart";

function loadFromStorage(): CartItem[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CART_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function saveToStorage(items: CartItem[]) {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(items));
  } catch {
    /* quota exceeded — ignore */
  }
}

export function CartProvider({ children }: { children: ReactNode }) {
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  /* hydrate from localStorage on mount */
  useEffect(() => {
    setItems(loadFromStorage());
    setIsLoading(false);
  }, []);

  /* persist whenever items change */
  useEffect(() => {
    if (!isLoading) saveToStorage(items);
  }, [items, isLoading]);

  const refreshCart = useCallback(async () => {
    setItems(loadFromStorage());
  }, []);

  const addItem = useCallback(
    async (handle: string, quantity = 1) => {
      const product = findByHandle(handle);
      if (!product) return;
      setItems((prev) => {
        const existing = prev.find((i) => i.variant_id === handle);
        if (existing) {
          return prev.map((i) =>
            i.variant_id === handle
              ? { ...i, quantity: i.quantity + quantity }
              : i
          );
        }
        const newItem: CartItem = {
          id: `${handle}-${Date.now()}`,
          variant_id: handle,
          title: `${product.name} ${product.strength}`,
          quantity,
          unit_price: Math.round(product.price * 100),
          thumbnail: product.thumbnail,
        };
        return [...prev, newItem];
      });
    },
    []
  );

  const removeItem = useCallback(async (lineItemId: string) => {
    setItems((prev) => prev.filter((i) => i.id !== lineItemId));
  }, []);

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      setItems((prev) =>
        prev.map((i) =>
          i.id === lineItemId ? { ...i, quantity: Math.max(1, quantity) } : i
        )
      );
    },
    []
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartId: null,
        items,
        itemCount,
        isLoading,
        isDrawerOpen,
        openDrawer,
        closeDrawer,
        addItem,
        removeItem,
        updateQuantity,
        refreshCart,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

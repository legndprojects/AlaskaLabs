"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { medusa } from "./medusa-client";

interface CartItem {
  id: string;
  variant_id: string;
  title: string;
  quantity: number;
  unit_price: number;
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
  addItem: (variantId: string, quantity?: number) => Promise<void>;
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

const CART_ID_KEY = "alaskalabs_cart_id";

export function CartProvider({ children }: { children: ReactNode }) {
  const [cartId, setCartId] = useState<string | null>(null);
  const [items, setItems] = useState<CartItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawer = useCallback(() => setIsDrawerOpen(true), []);
  const closeDrawer = useCallback(() => setIsDrawerOpen(false), []);

  const refreshCart = useCallback(async () => {
    const storedId = localStorage.getItem(CART_ID_KEY);
    if (!storedId) {
      setIsLoading(false);
      return;
    }

    try {
      const { cart } = await medusa.store.cart.retrieve(storedId);
      setCartId(cart.id);
      setItems(
        (cart.items ?? []).map((item: any) => ({
          id: item.id,
          variant_id: item.variant_id,
          title: item.title,
          quantity: item.quantity,
          unit_price: item.unit_price,
          thumbnail: item.thumbnail,
        }))
      );
    } catch {
      // Cart expired or invalid — clear it
      localStorage.removeItem(CART_ID_KEY);
      setCartId(null);
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCart();
  }, [refreshCart]);

  const ensureCart = useCallback(async (): Promise<string> => {
    if (cartId) return cartId;

    const { cart } = await medusa.store.cart.create({});
    localStorage.setItem(CART_ID_KEY, cart.id);
    setCartId(cart.id);
    return cart.id;
  }, [cartId]);

  const addItem = useCallback(
    async (variantId: string, quantity = 1) => {
      setIsLoading(true);
      try {
        const id = await ensureCart();
        await medusa.store.cart.createLineItem(id, {
          variant_id: variantId,
          quantity,
        });
        await refreshCart();
        openDrawer();
      } finally {
        setIsLoading(false);
      }
    },
    [ensureCart, refreshCart, openDrawer]
  );

  const removeItem = useCallback(
    async (lineItemId: string) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        await medusa.store.cart.deleteLineItem(cartId, lineItemId);
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, refreshCart]
  );

  const updateQuantity = useCallback(
    async (lineItemId: string, quantity: number) => {
      if (!cartId) return;
      setIsLoading(true);
      try {
        await medusa.store.cart.updateLineItem(cartId, lineItemId, {
          quantity,
        });
        await refreshCart();
      } finally {
        setIsLoading(false);
      }
    },
    [cartId, refreshCart]
  );

  const itemCount = items.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        cartId,
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

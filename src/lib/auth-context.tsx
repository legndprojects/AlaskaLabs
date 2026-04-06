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

interface Customer {
  id: string;
  email: string;
  first_name?: string;
  last_name?: string;
}

interface AuthContextValue {
  customer: Customer | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  logout: () => Promise<void>;
  register: (
    email: string,
    password: string,
    firstName: string,
    lastName: string
  ) => Promise<void>;
  refreshCustomer: () => Promise<void>;
}

const AuthContext = createContext<AuthContextValue | null>(null);

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [customer, setCustomer] = useState<Customer | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const refreshCustomer = useCallback(async () => {
    try {
      const { customer: data } = await medusa.store.customer.retrieve();
      setCustomer({
        id: data.id,
        email: data.email,
        first_name: data.first_name ?? undefined,
        last_name: data.last_name ?? undefined,
      });
    } catch {
      setCustomer(null);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    refreshCustomer();
  }, [refreshCustomer]);

  const login = useCallback(
    async (email: string, password: string) => {
      setIsLoading(true);
      try {
        await medusa.auth.login("customer", "emailpass", {
          email,
          password,
        });
        await refreshCustomer();
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCustomer]
  );

  const logout = useCallback(async () => {
    await medusa.auth.logout();
    setCustomer(null);
  }, []);

  const register = useCallback(
    async (
      email: string,
      password: string,
      firstName: string,
      lastName: string
    ) => {
      setIsLoading(true);
      try {
        await medusa.auth.register("customer", "emailpass", {
          email,
          password,
        });
        await medusa.auth.login("customer", "emailpass", {
          email,
          password,
        });
        await medusa.store.customer.update({
          first_name: firstName,
          last_name: lastName,
        });
        await refreshCustomer();
      } finally {
        setIsLoading(false);
      }
    },
    [refreshCustomer]
  );

  return (
    <AuthContext.Provider
      value={{
        customer,
        isLoading,
        isAuthenticated: !!customer,
        login,
        logout,
        register,
        refreshCustomer,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

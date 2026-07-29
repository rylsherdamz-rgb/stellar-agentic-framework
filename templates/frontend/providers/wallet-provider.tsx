"use client";

import { ReactNode, createContext, useContext } from "react";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";

type WalletContextType = ReturnType<typeof useStellarWallet>;

const WalletContext = createContext<WalletContextType | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const wallet = useStellarWallet();

  return (
    <WalletContext.Provider value={wallet}>
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const ctx = useContext(WalletContext);
  if (!ctx) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return ctx;
}

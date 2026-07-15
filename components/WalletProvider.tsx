"use client";

import {
  createContext,
  useContext,
  useEffect,
  useState,
  type ReactNode,
} from "react";
import {
  initWalletKit,
  LocalStorageKeys,
  StellarWalletsKit,
} from "@/lib/stellar-wallets-kit";

type WalletContextValue = {
  publicKey: string | null;
  walletId: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  connect: () => Promise<void>;
  disconnect: () => void;
};

const WalletContext = createContext<WalletContextValue | null>(null);

export function WalletProvider({ children }: { children: ReactNode }) {
  const [publicKey, setPublicKey] = useState<string | null>(null);
  const [walletId, setWalletId] = useState<string | null>(null);
  const [isConnecting, setIsConnecting] = useState(false);

  useEffect(() => {
    initWalletKit();

    const storedWalletId = window.localStorage.getItem(LocalStorageKeys.selectedModuleId);

    if (!storedWalletId) return;

    let active = true;

    async function restore() {
      try {
        if (!storedWalletId) return;
        StellarWalletsKit.setWallet(storedWalletId);
        const { address } = await StellarWalletsKit.getAddress();
        if (!active) return;

        setWalletId(storedWalletId);
        setPublicKey(address);
      } catch {
        window.localStorage.removeItem(LocalStorageKeys.selectedModuleId);
        window.localStorage.removeItem(LocalStorageKeys.activeAddress);
      }
    }

    void restore();

    return () => {
      active = false;
    };
  }, []);

  async function connect() {
    initWalletKit();
    setIsConnecting(true);
    try {
      const { address } = await StellarWalletsKit.authModal();
      const currentWallet = window.localStorage.getItem(LocalStorageKeys.selectedModuleId);
      const activeWallet = currentWallet ?? walletId ?? "unknown";

      setWalletId(activeWallet);
      setPublicKey(address);
    } finally {
      setIsConnecting(false);
    }
  }

  async function disconnect() {
    await StellarWalletsKit.disconnect();
    setWalletId(null);
    setPublicKey(null);
    window.localStorage.removeItem(LocalStorageKeys.selectedModuleId);
    window.localStorage.removeItem(LocalStorageKeys.activeAddress);
  }

  return (
    <WalletContext.Provider
      value={{
        publicKey,
        walletId,
        isConnected: Boolean(publicKey),
        isConnecting,
        connect,
        disconnect,
      }}
    >
      {children}
    </WalletContext.Provider>
  );
}

export function useWallet() {
  const context = useContext(WalletContext);
  if (!context) {
    throw new Error("useWallet must be used within WalletProvider");
  }
  return context;
}

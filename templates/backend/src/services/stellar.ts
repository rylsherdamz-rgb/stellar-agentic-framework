import * as StellarSdk from "@stellar/stellar-sdk";

const requireEnv = (name: string): string => {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env var: ${name}`);
  return value;
};

const NETWORK = process.env.STELLAR_NETWORK || "testnet";

const configs: Record<string, {
  rpcUrl: string;
  horizonUrl: string;
  networkPassphrase: string;
}> = {
  mainnet: {
    rpcUrl: requireEnv("STELLAR_MAINNET_RPC_URL"),
    horizonUrl: "https://horizon.stellar.org",
    networkPassphrase: StellarSdk.Networks.PUBLIC,
  },
  testnet: {
    rpcUrl: "https://soroban-testnet.stellar.org",
    horizonUrl: "https://horizon-testnet.stellar.org",
    networkPassphrase: StellarSdk.Networks.TESTNET,
  },
  local: {
    rpcUrl: "http://localhost:8000/soroban/rpc",
    horizonUrl: "http://localhost:8000",
    networkPassphrase: "Standalone Network ; February 2017",
  },
};

export const config = configs[NETWORK];
export const horizon = new StellarSdk.Horizon.Server(config.horizonUrl);
export const rpc = new StellarSdk.rpc.Server(config.rpcUrl);

"use client";

import { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";
import { useContract } from "@/hooks/use-contract";

interface Props {
  contractId: string;
  method: string;
}

export function InvokeContract({ contractId, method }: Props) {
  const { address, sign } = useStellarWallet();
  const { callMethod } = useContract(contractId);
  const [args, setArgs] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) return;

    setLoading(true);
    try {
      const scArgs = args
        ? args.split(",").map((a) => {
            const trimmed = a.trim();
            if (/^\d+$/.test(trimmed)) {
              return StellarSdk.nativeToScVal(parseInt(trimmed), {
                type: "u32",
              });
            }
            return StellarSdk.nativeToScVal(trimmed, { type: "symbol" });
          })
        : [];

      const res = await callMethod(address, method, scArgs, sign);
      setResult(JSON.stringify(res, null, 2));
    } catch (err: any) {
      setResult(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <h2 className="text-xl font-bold">
        {method}
      </h2>
      <input
        type="text"
        placeholder="Arguments (comma separated)"
        value={args}
        onChange={(e) => setArgs(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading || !address}
        className="px-4 py-2 bg-blue-500 text-white rounded disabled:opacity-50"
      >
        {loading ? "Invoking..." : "Invoke"}
      </button>
      {result && (
        <pre className="p-2 bg-gray-100 rounded text-sm overflow-x-auto">
          {result}
        </pre>
      )}
    </form>
  );
}

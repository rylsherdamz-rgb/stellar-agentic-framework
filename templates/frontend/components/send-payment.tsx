"use client";

import { useState } from "react";
import * as StellarSdk from "@stellar/stellar-sdk";
import { useStellarWallet } from "@/hooks/use-stellar-wallet";
import { horizon, config } from "@/lib/stellar-config";

export function SendPayment() {
  const { address, sign } = useStellarWallet();
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [status, setStatus] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!address) {
      setStatus("Connect your wallet first");
      return;
    }

    setLoading(true);
    setStatus("Building transaction...");

    try {
      const account = await horizon.loadAccount(address);

      const tx = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: config.networkPassphrase,
      })
        .addOperation(
          StellarSdk.Operation.payment({
            destination,
            asset: StellarSdk.Asset.native(),
            amount,
          })
        )
        .setTimeout(180)
        .build();

      setStatus("Sign in your wallet...");
      const signedXdr = await sign(tx.toXDR());

      const signedTx = StellarSdk.TransactionBuilder.fromXDR(
        signedXdr,
        config.networkPassphrase
      ) as StellarSdk.Transaction;

      setStatus("Submitting...");
      const result = await horizon.submitTransaction(signedTx);

      setStatus(`Sent! Hash: ${result.hash}`);
    } catch (err: any) {
      setStatus(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4 max-w-md">
      <h2 className="text-xl font-bold">Send XLM</h2>
      <input
        type="text"
        placeholder="Destination G..."
        value={destination}
        onChange={(e) => setDestination(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <input
        type="text"
        placeholder="Amount (XLM)"
        value={amount}
        onChange={(e) => setAmount(e.target.value)}
        className="w-full p-2 border rounded"
      />
      <button
        type="submit"
        disabled={loading || !address}
        className="w-full p-2 bg-blue-500 text-white rounded disabled:opacity-50 hover:bg-blue-600"
      >
        {loading ? status : "Send"}
      </button>
      {status && (
        <p className="text-sm text-gray-600 break-all">{status}</p>
      )}
    </form>
  );
}

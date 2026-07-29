"use client";

import * as StellarSdk from "@stellar/stellar-sdk";
import { rpc, config } from "@/lib/stellar-config";

export function useContract(contractId: string) {
  const contract = new StellarSdk.Contract(contractId);

  async function callMethod(
    sourceAddress: string,
    method: string,
    args: StellarSdk.xdr.ScVal[],
    signFn: (xdr: string) => Promise<string>
  ) {
    const account = await rpc.getAccount(sourceAddress);

    let tx = new StellarSdk.TransactionBuilder(account, {
      fee: StellarSdk.BASE_FEE,
      networkPassphrase: config.networkPassphrase,
    })
      .addOperation(contract.call(method, ...args))
      .setTimeout(180)
      .build();

    const simulation = await rpc.simulateTransaction(tx);

    if (StellarSdk.rpc.Api.isSimulationError(simulation)) {
      throw new Error(`Simulation failed: ${simulation.error}`);
    }

    tx = StellarSdk.rpc.assembleTransaction(tx, simulation).build();
    const signedXdr = await signFn(tx.toXDR());

    const signedTx = StellarSdk.TransactionBuilder.fromXDR(
      signedXdr,
      config.networkPassphrase
    ) as StellarSdk.Transaction;

    const response = await rpc.sendTransaction(signedTx);

    if (response.status === "ERROR") {
      throw new Error(`Transaction failed: ${response.errorResult}`);
    }

    let getResponse = await rpc.getTransaction(response.hash);
    while (getResponse.status === "NOT_FOUND") {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      getResponse = await rpc.getTransaction(response.hash);
    }

    if (getResponse.status === "SUCCESS") {
      return {
        hash: response.hash,
        result: getResponse.returnValue,
      };
    }

    throw new Error(`Transaction failed: ${getResponse.status}`);
  }

  async function queryMethod(method: string, args: StellarSdk.xdr.ScVal[]) {
    const account = StellarSdk.Keypair.random();

    const tx = new StellarSdk.TransactionBuilder(
      { sequence: "1" } as any,
      {
        fee: "0",
        networkPassphrase: config.networkPassphrase,
      }
    )
      .addOperation(contract.call(method, ...args))
      .setTimeout(180)
      .build();

    const simulation = await rpc.simulateTransaction(tx);

    if (StellarSdk.rpc.Api.isSimulationSuccess(simulation)) {
      return simulation.result;
    }

    throw new Error(`Simulation failed`);
  }

  return { callMethod, queryMethod, contract };
}

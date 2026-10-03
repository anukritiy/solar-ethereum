import { createWalletClient, createPublicClient, http } from "viem";
import { privateKeyToAccount } from "viem/accounts";
import { hardhat } from "viem/chains";
import fs from "fs";
import artifact from "../artifacts/contracts/SolarBillAudit.sol/SolarBillAudit.json" with { type: "json" };
const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";
const PRIVATE_KEY = "0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80";

const account = privateKeyToAccount(PRIVATE_KEY as `0x${string}`);

const walletClient = createWalletClient({
  account,
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

async function main() {
  const bills = JSON.parse(fs.readFileSync("data/sampleBills_10_hashed.json", "utf-8"));

  for (const bill of bills) {
    const hash = await walletClient.writeContract({
      address: CONTRACT_ADDRESS,
      abi: artifact.abi,
      functionName: "submitBill",
      args: [bill.consumerId, bill.billHash, BigInt(bill.unitsGenerated), BigInt(bill.unitsConsumed)],
    });

    const receipt = await publicClient.waitForTransactionReceipt({ hash });
    console.log(`Bill ${bill.billId} submitted. Gas used: ${receipt.gasUsed}`);
  }
}

main();
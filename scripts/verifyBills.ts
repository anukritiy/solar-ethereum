import { createPublicClient, http } from "viem";
import { hardhat } from "viem/chains";
import fs from "fs";
import artifact from "../artifacts/contracts/SolarBillAudit.sol/SolarBillAudit.json" with { type: "json" };

const CONTRACT_ADDRESS = "0x5FbDB2315678afecb367f032d93F642f64180aa3";

const publicClient = createPublicClient({
  chain: hardhat,
  transport: http("http://127.0.0.1:8545"),
});

async function main() {
  const bills = JSON.parse(fs.readFileSync("data/sampleBills_10_hashed.json", "utf-8"));

  for (const bill of bills) {
    const isValid = await publicClient.readContract({
      address: CONTRACT_ADDRESS,
      abi: artifact.abi,
      functionName: "verifyBill",
      args: [BigInt(bill.billId), bill.billHash],
    });

    console.log(`Bill ${bill.billId}: ${isValid ? "VALID ✅" : "INVALID ❌"}`);
  }
}

main();
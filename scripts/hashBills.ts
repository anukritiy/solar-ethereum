import fs from "fs";
import { keccak256, toBytes } from "viem";

interface SolarBill {
  billId: number;
  consumerId: string;
  billingPeriod: string;
  unitsGenerated: number;
  unitsConsumed: number;
  amountPayable: number;
}

interface HashedBill extends SolarBill {
  billHash: string;
}

const inputFile = process.argv[2] || "data/sampleBills_10.json";

const rawData = fs.readFileSync(inputFile, "utf-8");
const bills: SolarBill[] = JSON.parse(rawData);

const hashedBills: HashedBill[] = bills.map((bill) => {
  const serialized = JSON.stringify(bill);
  const billHash = keccak256(toBytes(serialized));
  return { ...bill, billHash };
});

const outputFile = inputFile.replace(".json", "_hashed.json");
fs.writeFileSync(outputFile, JSON.stringify(hashedBills, null, 2));

console.log(`Hashed ${bills.length} bills → ${outputFile}`);
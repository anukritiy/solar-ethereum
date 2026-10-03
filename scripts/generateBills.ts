import fs from "fs";

interface SolarBill {
  billId: number;
  consumerId: string;
  billingPeriod: string;
  unitsGenerated: number;
  unitsConsumed: number;
  amountPayable: number;
}

function generateBills(count: number): SolarBill[] {
  const bills: SolarBill[] = [];

  for (let i = 1; i <= count; i++) {
    const unitsGenerated = Math.floor(Math.random() * 500) + 100;
    const unitsConsumed = Math.floor(Math.random() * 400) + 50;
    const amountPayable = (unitsConsumed - unitsGenerated) * 6.5; // rough per-unit rate

    bills.push({
      billId: i,
      consumerId: `CONS-${1000 + i}`,
      billingPeriod: "2026-09",
      unitsGenerated,
      unitsConsumed,
      amountPayable: Math.round(amountPayable * 100) / 100,
    });
  }

  return bills;
}

const count = Number(process.argv[2]) || 10;
const bills = generateBills(count);

fs.writeFileSync(
  `data/sampleBills_${count}.json`,
  JSON.stringify(bills, null, 2)
);

console.log(`Generated ${count} sample bills → data/sampleBills_${count}.json`);
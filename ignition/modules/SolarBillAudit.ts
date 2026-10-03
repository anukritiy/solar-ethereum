import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

export default buildModule("SolarBillAuditModule", (m) => {
  const solarBillAudit = m.contract("SolarBillAudit");
  return { solarBillAudit };
});
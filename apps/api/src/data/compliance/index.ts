import { Compliance } from "../../types/compliance";
import { hipaaCompliance } from "./hipaa";
import { pciDssCompliance } from "./pci-dss";
import { gdprCompliance } from "./gdpr";
import { soxCompliance } from "./sox";
import { iso27001Compliance } from "./iso27001";
import { fedrampCompliance } from "./fedramp";
import { nist80053Compliance } from "./nist800-53";
import { ccpaCompliance } from "./ccpa";
import { soc2Compliance } from "./soc2";
import { cmmcCompliance } from "./cmmc";

export const complianceData: Record<string, Compliance> = {
  hipaa: hipaaCompliance,
  "pci-dss": pciDssCompliance,
  gdpr: gdprCompliance,
  sox: soxCompliance,
  iso27001: iso27001Compliance,
  fedramp: fedrampCompliance,
  "nist800-53": nist80053Compliance,
  ccpa: ccpaCompliance,
  soc2: soc2Compliance,
  cmmc: cmmcCompliance,
};

export function getComplianceById(id: string): Compliance | undefined {
  return complianceData[id];
}

export function getAllCompliance(): Compliance[] {
  return Object.values(complianceData);
}

export function getComplianceByRegion(region: string): Compliance[] {
  return Object.values(complianceData).filter((compliance) =>
    compliance.regions.includes(region)
  );
}

export function getComplianceByIndustry(industry: string): Compliance[] {
  return Object.values(complianceData).filter((compliance) =>
    compliance.industries.includes(industry)
  );
}

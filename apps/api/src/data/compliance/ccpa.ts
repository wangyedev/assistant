import { Compliance } from "../../types/compliance";

export const ccpaCompliance: Compliance = {
  id: "ccpa-2020",
  shortName: "CCPA",
  longName: "California Consumer Privacy Act",
  briefDescription: "California data privacy regulation",
  longDescription:
    "The CCPA enhances privacy rights and consumer protection for residents of California. It establishes requirements for collection, use, and protection of personal information by businesses operating in California.",
  hardwarePlatforms: ["x86_64", "aarch64"],
  regions: ["United States", "California"],
  industries: ["All Industries", "Technology", "Retail", "Services"],
  links: [
    "https://oag.ca.gov/privacy/ccpa",
    "https://www.congress.gov/bill/116th-congress/house-bill/4978",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Advanced Cluster Security",
  ],
  attachments: ["ccpa_requirements.pdf", "privacy_controls.pdf"],
  additionalResources: "Privacy compliance team support available",
  internalOnly: false,
  status: "Active",
  detailStatus: "Compliant",
  url: "/compliance/ccpa",
  notes: "Annual privacy notice updates and regular assessments required",
};

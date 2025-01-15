import { Compliance } from "../../types/compliance";

export const hipaaCompliance: Compliance = {
  id: "hipaa-2023",
  shortName: "HIPAA",
  longName: "Health Insurance Portability and Accountability Act",
  briefDescription: "U.S. healthcare data privacy and security standard",
  longDescription:
    "HIPAA establishes national standards for the protection of individuals' medical records and other personal health information, applying to health plans, health care providers, and health care clearinghouses.",
  hardwarePlatforms: ["x86_64", "ppc64le", "s390x"],
  regions: ["United States", "US Territories"],
  industries: ["Healthcare", "Insurance", "Medical Services"],
  links: [
    "https://www.hhs.gov/hipaa/index.html",
    "https://www.cdc.gov/phlp/publications/topic/hipaa.html",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Ansible Automation Platform",
  ],
  attachments: [
    "hipaa_compliance_checklist.pdf",
    "hipaa_technical_safeguards.pdf",
  ],
  additionalResources: "Internal compliance team available for consultation",
  internalOnly: false,
  status: "Active",
  detailStatus: "Fully Compliant",
  url: "/compliance/hipaa",
  notes: "Annual audit required for maintaining compliance",
};

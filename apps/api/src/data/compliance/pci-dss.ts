import { Compliance } from "../../types/compliance";

export const pciDssCompliance: Compliance = {
  id: "pci-dss-4.0",
  shortName: "PCI DSS",
  longName: "Payment Card Industry Data Security Standard",
  briefDescription: "Global payment card security standard",
  longDescription:
    "PCI DSS is an information security standard for organizations that handle branded credit cards from the major card schemes. The standard was created to increase controls around cardholder data to reduce credit card fraud.",
  hardwarePlatforms: ["x86_64", "aarch64", "ppc64le"],
  regions: ["Global", "All Regions"],
  industries: ["Financial Services", "Retail", "E-commerce", "Banking"],
  links: [
    "https://www.pcisecuritystandards.org/",
    "https://www.pcisecuritystandards.org/document_library",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Insights",
    "Red Hat Satellite",
  ],
  attachments: ["pci_dss_4_0_requirements.pdf", "pci_implementation_guide.pdf"],
  additionalResources:
    "PCI DSS Qualified Security Assessor (QSA) consultation available",
  internalOnly: false,
  status: "Active",
  detailStatus: "Compliant with v4.0",
  url: "/compliance/pci-dss",
  notes:
    "Quarterly vulnerability scans and annual penetration testing required",
};

import { Compliance } from "../../types/compliance";

export const soxCompliance: Compliance = {
  id: "sox-2002",
  shortName: "SOX",
  longName: "Sarbanes-Oxley Act",
  briefDescription: "U.S. corporate financial reporting standard",
  longDescription:
    "The Sarbanes-Oxley Act is a United States federal law that mandates certain practices in financial record keeping and reporting for corporations. It was enacted in response to major corporate and accounting scandals.",
  hardwarePlatforms: ["x86_64", "ppc64le"],
  regions: ["United States"],
  industries: ["Financial Services", "Public Companies", "Banking"],
  links: [
    "https://www.sec.gov/spotlight/sarbanes-oxley.htm",
    "https://www.congress.gov/bill/107th-congress/house-bill/3763",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat Insights",
    "Red Hat Satellite",
    "Red Hat Identity Management",
  ],
  attachments: ["sox_compliance_framework.pdf", "financial_controls_guide.pdf"],
  additionalResources: "Financial compliance team support available",
  internalOnly: false,
  status: "Active",
  detailStatus: "Compliant",
  url: "/compliance/sox",
  notes: "Annual external auditor assessment required",
};

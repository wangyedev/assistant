import { Compliance } from "../../types/compliance";

export const cmmcCompliance: Compliance = {
  id: "cmmc-2.0",
  shortName: "CMMC",
  longName: "Cybersecurity Maturity Model Certification",
  briefDescription: "U.S. Defense Industrial Base cybersecurity standard",
  longDescription:
    "CMMC is a unified standard for implementing cybersecurity across the Defense Industrial Base (DIB) sector. It combines various cybersecurity standards and best practices into one unified standard for cybersecurity.",
  hardwarePlatforms: ["x86_64", "ppc64le"],
  regions: ["United States"],
  industries: ["Defense", "Government Contractors", "Aerospace"],
  links: ["https://www.acq.osd.mil/cmmc/", "https://dodcio.defense.gov/CMMC/"],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Ansible Automation Platform",
    "Red Hat Advanced Cluster Security",
  ],
  attachments: ["cmmc_practices.pdf", "assessment_guides.pdf"],
  additionalResources: "CMMC assessment preparation support available",
  internalOnly: false,
  status: "Active",
  detailStatus: "Level 3 Compliant",
  url: "/compliance/cmmc",
  notes:
    "Certification required before contract award for certain DoD contracts",
};

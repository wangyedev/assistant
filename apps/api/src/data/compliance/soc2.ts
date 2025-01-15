import { Compliance } from "../../types/compliance";

export const soc2Compliance: Compliance = {
  id: "soc2-type2",
  shortName: "SOC 2",
  longName: "System and Organization Controls 2",
  briefDescription: "Service organization security and privacy standard",
  longDescription:
    "SOC 2 defines criteria for managing customer data based on five 'trust service principles': security, availability, processing integrity, confidentiality, and privacy.",
  hardwarePlatforms: ["x86_64", "aarch64", "ppc64le"],
  regions: ["Global"],
  industries: ["Technology", "Cloud Services", "SaaS", "Data Centers"],
  links: [
    "https://www.aicpa.org/interestareas/frc/assuranceadvisoryservices/soc2",
    "https://us.aicpa.org/content/dam/aicpa/interestareas/frc/assuranceadvisoryservices/downloadabledocuments/trust-services-criteria.pdf",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Ansible Automation Platform",
    "Red Hat Advanced Cluster Security",
  ],
  attachments: ["soc2_controls.pdf", "trust_principles_guide.pdf"],
  additionalResources: "SOC 2 audit preparation support available",
  internalOnly: false,
  status: "Active",
  detailStatus: "Type 2 Certified",
  url: "/compliance/soc2",
  notes: "Semi-annual Type 2 audits required",
};

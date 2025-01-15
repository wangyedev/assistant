import { Compliance } from "../../types/compliance";

export const gdprCompliance: Compliance = {
  id: "gdpr-2018",
  shortName: "GDPR",
  longName: "General Data Protection Regulation",
  briefDescription: "EU data protection and privacy regulation",
  longDescription:
    "GDPR is a regulation in EU law on data protection and privacy for all individuals within the European Union and the European Economic Area. It also addresses the export of personal data outside the EU and EEA areas.",
  hardwarePlatforms: ["x86_64", "aarch64", "ppc64le", "s390x"],
  regions: ["European Union", "EEA", "Global"],
  industries: ["All Industries", "Technology", "Healthcare", "Finance"],
  links: [
    "https://gdpr.eu/",
    "https://ec.europa.eu/info/law/law-topic/data-protection_en",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Ansible Automation Platform",
    "Red Hat Identity Management",
  ],
  attachments: ["gdpr_compliance_guide.pdf", "data_protection_checklist.pdf"],
  additionalResources: "Data Protection Officer (DPO) consultation available",
  internalOnly: false,
  status: "Active",
  detailStatus: "Fully Compliant",
  url: "/compliance/gdpr",
  notes: "Regular Data Protection Impact Assessments (DPIA) required",
};

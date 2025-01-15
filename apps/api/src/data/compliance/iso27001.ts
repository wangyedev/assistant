import { Compliance } from "../../types/compliance";

export const iso27001Compliance: Compliance = {
  id: "iso27001-2022",
  shortName: "ISO 27001",
  longName: "ISO/IEC 27001:2022",
  briefDescription: "International information security standard",
  longDescription:
    "ISO/IEC 27001 is an international standard for information security management. It provides a framework for organizations to protect their information assets through implementing an information security management system (ISMS).",
  hardwarePlatforms: ["x86_64", "aarch64", "ppc64le", "s390x"],
  regions: ["Global"],
  industries: ["All Industries", "Technology", "Finance", "Healthcare"],
  links: [
    "https://www.iso.org/isoiec-27001-information-security.html",
    "https://www.iso.org/standard/27001",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Ansible Automation Platform",
    "Red Hat Advanced Cluster Security",
  ],
  attachments: ["iso27001_controls.pdf", "isms_implementation_guide.pdf"],
  additionalResources: "ISO certification support team available",
  internalOnly: false,
  status: "Active",
  detailStatus: "Certified",
  url: "/compliance/iso27001",
  notes: "Annual surveillance audits and three-year recertification required",
};

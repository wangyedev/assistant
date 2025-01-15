import { Compliance } from "../../types/compliance";

export const nist80053Compliance: Compliance = {
  id: "nist800-53-rev5",
  shortName: "NIST 800-53",
  longName: "NIST Special Publication 800-53 Revision 5",
  briefDescription: "U.S. federal information systems security controls",
  longDescription:
    "NIST SP 800-53 provides a catalog of security and privacy controls for federal information systems and organizations to protect organizational operations, assets, and individuals.",
  hardwarePlatforms: ["x86_64", "ppc64le", "s390x"],
  regions: ["United States"],
  industries: ["Government", "Defense", "Critical Infrastructure"],
  links: [
    "https://csrc.nist.gov/publications/detail/sp/800-53/rev-5/final",
    "https://nvd.nist.gov/800-53",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Satellite",
    "Red Hat Identity Management",
  ],
  attachments: ["nist_controls_mapping.pdf", "security_control_baseline.pdf"],
  additionalResources: "Security control implementation guides available",
  internalOnly: false,
  status: "Active",
  detailStatus: "High Control Baseline",
  url: "/compliance/nist800-53",
  notes:
    "Control implementation validated through Security Technical Implementation Guides (STIGs)",
};

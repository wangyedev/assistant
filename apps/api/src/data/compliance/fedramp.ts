import { Compliance } from "../../types/compliance";

export const fedrampCompliance: Compliance = {
  id: "fedramp-2023",
  shortName: "FedRAMP",
  longName: "Federal Risk and Authorization Management Program",
  briefDescription: "U.S. government cloud security standard",
  longDescription:
    "FedRAMP is a U.S. government-wide program that provides a standardized approach to security assessment, authorization, and continuous monitoring for cloud products and services.",
  hardwarePlatforms: ["x86_64", "ppc64le"],
  regions: ["United States"],
  industries: ["Government", "Defense", "Federal Contractors"],
  links: [
    "https://www.fedramp.gov/",
    "https://www.gsa.gov/technology/government-it-initiatives/fedramp",
  ],
  redhatProducts: [
    "Red Hat Enterprise Linux",
    "Red Hat OpenShift Container Platform",
    "Red Hat Ansible Automation Platform",
    "Red Hat Advanced Cluster Security",
  ],
  attachments: ["fedramp_security_controls.pdf", "authorization_guide.pdf"],
  additionalResources: "FedRAMP PMO consultation available",
  internalOnly: false,
  status: "Active",
  detailStatus: "High Impact Level",
  url: "/compliance/fedramp",
  notes: "Continuous monitoring and annual assessment required",
};

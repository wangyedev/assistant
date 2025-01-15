export interface Compliance {
  id: string;
  shortName: string;
  longName: string;
  briefDescription: string;
  longDescription: string;
  hardwarePlatforms: string[];
  regions: string[];
  industries: string[];
  links: string[];
  redhatProducts: string[];
  attachments: string[];
  additionalResources?: string;
  internalOnly: boolean;
  status?: string;
  detailStatus?: string;
  url: string;
  notes?: string;
}

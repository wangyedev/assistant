import { Compliance } from "../types/compliance";
import {
  getAllCompliance,
  getComplianceById,
  getComplianceByIndustry,
  getComplianceByRegion,
} from "../data/compliance";

export type FunctionDefinition = {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
};

export const searchCompliance: FunctionDefinition = {
  name: "searchCompliance",
  description: "Search for compliance standards based on various criteria",
  parameters: {
    type: "object",
    properties: {
      query: {
        type: "string",
        description: "Search query or compliance ID",
      },
      searchType: {
        type: "string",
        enum: ["id", "region", "industry", "all"],
        description: "Type of search to perform",
      },
    },
    required: ["query", "searchType"],
  },
};

export const complianceFunctions = {
  searchCompliance: async (args: { query: string; searchType: string }) => {
    let results: Compliance[] = [];

    switch (args.searchType) {
      case "id": {
        const compliance = getComplianceById(args.query.toLowerCase());
        if (compliance) results = [compliance];
        break;
      }
      case "region": {
        results = getComplianceByRegion(args.query);
        break;
      }
      case "industry": {
        results = getComplianceByIndustry(args.query);
        break;
      }
      case "all": {
        results = getAllCompliance().filter(
          (compliance) =>
            compliance.shortName
              .toLowerCase()
              .includes(args.query.toLowerCase()) ||
            compliance.longName
              .toLowerCase()
              .includes(args.query.toLowerCase()) ||
            compliance.briefDescription
              .toLowerCase()
              .includes(args.query.toLowerCase())
        );
        break;
      }
    }

    return JSON.stringify({
      count: results.length,
      results: results.map((compliance) => ({
        id: compliance.id,
        shortName: compliance.shortName,
        longName: compliance.longName,
        briefDescription: compliance.briefDescription,
        regions: compliance.regions,
        industries: compliance.industries,
        status: compliance.status,
      })),
    });
  },
};

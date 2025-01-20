import { Card } from "../card";
import { Icons } from "../icons";
import { cn } from "@/lib/utils";

interface ComplianceCardProps {
  id: string;
  shortName: string;
  longName: string;
  briefDescription: string;
  regions: string[];
  industries: string[];
  status: string;
}

export function ComplianceCard({
  shortName,
  longName,
  briefDescription,
  regions,
  industries,
  status,
}: ComplianceCardProps) {
  const statusColor =
    {
      active:
        "text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/40",
      pending:
        "text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/40",
      inactive: "text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/40",
    }[status.toLowerCase()] ||
    "text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/40";

  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-start justify-between mb-6">
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md">
              <Icons.bot className="w-3.5 h-3.5 mr-1" />
              Compliance
            </span>
            <span
              className={cn(
                "inline-flex items-center px-2.5 py-1 text-xs font-medium rounded-md",
                statusColor
              )}
            >
              {status}
            </span>
          </div>
        </div>

        {/* Title Section */}
        <div className="mb-4">
          <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
            {shortName}
          </h3>
          <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
            {longName}
          </p>
        </div>

        {/* Description Section */}
        <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed mb-6">
          {briefDescription}
        </p>

        {/* Tags Section */}
        <div className="space-y-4">
          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Regions
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {regions.map((region) => (
                <span
                  key={region}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300"
                >
                  {region}
                </span>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-xs font-medium text-gray-500 dark:text-gray-400 mb-2">
              Industries
            </h4>
            <div className="flex flex-wrap gap-1.5">
              {industries.map((industry) => (
                <span
                  key={industry}
                  className="inline-flex items-center px-2 py-1 text-xs font-medium rounded-md bg-gray-50 dark:bg-gray-800/40 text-gray-600 dark:text-gray-300"
                >
                  {industry}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}

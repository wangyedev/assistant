import { Card } from "../card";
import { Icons } from "../icons";

interface TimeCardProps {
  city: string;
  timezone: string;
  time: string;
  date: string;
}

export function TimeCard({ city, timezone, time, date }: TimeCardProps) {
  return (
    <Card className="shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md">
            <Icons.clock className="w-3.5 h-3.5 mr-1" />
            Time
          </span>
          <div className="text-right">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
              {city}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-0.5">
              {timezone}
            </p>
          </div>
        </div>

        {/* Time Section */}
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className="text-6xl font-light tracking-tight text-gray-900 dark:text-gray-50">
              {time}
            </div>
            <p className="text-sm text-gray-600 dark:text-gray-400 mt-3">
              {date}
            </p>
          </div>
        </div>
      </div>
    </Card>
  );
}

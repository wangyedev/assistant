import { Card } from "../card";
import { Icons } from "../icons";

interface WeatherCardProps {
  location: string;
  temperature: number;
  unit: "celsius" | "fahrenheit";
  description: string;
  feelsLike?: number;
  humidity?: number;
}

export function WeatherCard({
  location,
  temperature,
  unit,
  description,
  feelsLike,
  humidity,
}: WeatherCardProps) {
  return (
    <Card className="overflow-hidden shadow-md hover:shadow-lg transition-all duration-200 ease-in-out">
      <div className="p-5">
        {/* Header Section */}
        <div className="flex items-center justify-between mb-6">
          <span className="inline-flex items-center px-2.5 py-1 bg-gray-100 dark:bg-gray-800 text-xs font-medium rounded-md">
            <Icons.cloud className="w-3.5 h-3.5 mr-1" />
            Weather
          </span>
          <div className="text-right">
            <h3 className="text-base font-medium text-gray-900 dark:text-gray-100">
              {location}
            </h3>
            <p className="text-sm text-gray-600 dark:text-gray-400 capitalize mt-0.5">
              {description}
            </p>
          </div>
        </div>

        {/* Temperature Section */}
        <div className="flex items-center justify-center py-4">
          <div className="text-center">
            <div className="text-6xl font-light tracking-tight text-gray-900 dark:text-gray-50">
              {temperature}°
              <span className="text-2xl ml-1">
                {unit === "celsius" ? "C" : "F"}
              </span>
            </div>
          </div>
        </div>

        {/* Details Section */}
        <div className="grid grid-cols-2 gap-4 mt-6">
          {feelsLike && (
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40">
              <Icons.thermometer className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div className="ml-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Feels like
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                  {feelsLike}°{unit === "celsius" ? "C" : "F"}
                </p>
              </div>
            </div>
          )}
          {humidity && (
            <div className="flex items-center p-3 rounded-lg bg-gray-50 dark:bg-gray-800/40">
              <Icons.droplet className="w-5 h-5 text-gray-500 dark:text-gray-400" />
              <div className="ml-3">
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Humidity
                </p>
                <p className="text-sm font-medium text-gray-900 dark:text-gray-100 mt-0.5">
                  {humidity}%
                </p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

import { Card } from "./card";
import { Icons } from "./icons";

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
    <Card className="overflow-hidden">
      <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="font-semibold text-lg text-foreground/90">
              {location}
            </h3>
            <p className="text-sm text-muted-foreground capitalize">
              {description}
            </p>
          </div>
          <div className="p-2 bg-background/80 rounded-full shadow-sm">
            <Icons.cloud className="w-6 h-6 text-primary" />
          </div>
        </div>

        <div className="mt-4 flex items-baseline gap-2">
          <div className="text-4xl font-bold tracking-tight">
            {temperature}°{unit === "celsius" ? "C" : "F"}
          </div>
        </div>

        <div className="mt-4 grid grid-cols-2 gap-4 text-sm">
          {feelsLike && (
            <div className="flex items-center gap-2">
              <Icons.thermometer className="w-4 h-4 text-primary/60" />
              <div>
                <p className="text-muted-foreground">Feels like</p>
                <p className="font-medium">
                  {feelsLike}°{unit === "celsius" ? "C" : "F"}
                </p>
              </div>
            </div>
          )}
          {humidity && (
            <div className="flex items-center gap-2">
              <Icons.droplet className="w-4 h-4 text-primary/60" />
              <div>
                <p className="text-muted-foreground">Humidity</p>
                <p className="font-medium">{humidity}%</p>
              </div>
            </div>
          )}
        </div>
      </div>
    </Card>
  );
}

interface TimeCardProps {
  timezone: string;
  time: string;
  date: string;
}

export function TimeCard({ timezone, time, date }: TimeCardProps) {
  return (
    <Card className="p-4 flex items-start gap-4">
      <div className="p-2 bg-primary/10 rounded-full">
        <Icons.clock className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold">{timezone}</h3>
        <div className="text-2xl font-bold">{time}</div>
        <p className="text-sm text-muted-foreground">{date}</p>
      </div>
    </Card>
  );
}

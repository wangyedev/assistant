import { Card } from "./card";
import { Icons } from "./icons";

interface WeatherCardProps {
  location: string;
  temperature: number;
  unit: "celsius" | "fahrenheit";
  description?: string;
}

export function WeatherCard({
  location,
  temperature,
  unit,
  description,
}: WeatherCardProps) {
  return (
    <Card className="p-4 flex items-start gap-4">
      <div className="p-2 bg-primary/10 rounded-full">
        <Icons.cloud className="w-6 h-6 text-primary" />
      </div>
      <div>
        <h3 className="font-semibold">{location}</h3>
        <div className="text-2xl font-bold">
          {temperature}°{unit === "celsius" ? "C" : "F"}
        </div>
        {description && (
          <p className="text-sm text-muted-foreground">{description}</p>
        )}
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

import axios from 'axios';
import { config } from '../config';

export type FunctionDefinition = {
  name: string;
  description: string;
  parameters: {
    type: string;
    properties: Record<string, any>;
    required?: string[];
  };
};

// Weather function definition
export const getCurrentWeather: FunctionDefinition = {
  name: "getCurrentWeather",
  description: "Get the current weather in a given location",
  parameters: {
    type: "object",
    properties: {
      location: {
        type: "string",
        description: "The city and state, e.g., San Francisco, CA",
      },
      unit: {
        type: "string",
        enum: ["celsius", "fahrenheit"],
      },
    },
    required: ["location"],
  },
};

// Time function definition
export const getCurrentTime: FunctionDefinition = {
  name: "getCurrentTime",
  description: "Get the current time in a specific timezone",
  parameters: {
    type: "object",
    properties: {
      timezone: {
        type: "string",
        description: "The timezone (e.g., 'America/New_York', 'Europe/London')",
      },
    },
    required: ["timezone"],
  },
};

interface WeatherResponse {
  main: {
    temp: number;
    feels_like: number;
    humidity: number;
  };
  weather: Array<{
    main: string;
    description: string;
  }>;
  name: string;
}

// Function implementations
export const functions = {
  getCurrentWeather: async (args: { location: string; unit?: string }) => {
    try {
      const units = args.unit === "fahrenheit" ? "imperial" : "metric";
      const response = await axios.get<WeatherResponse>(
        `https://api.openweathermap.org/data/2.5/weather?q=${encodeURIComponent(
          args.location
        )}&units=${units}&appid=${config.openWeatherApiKey}`
      );

      const { main, weather, name } = response.data;
      const temp = Math.round(main.temp);
      const unit = units === "metric" ? "C" : "F";
      const description = weather[0].description;
      const feelsLike = Math.round(main.feels_like);

      return `The current temperature in ${name} is ${temp}°${unit}. ${
        description.charAt(0).toUpperCase() + description.slice(1)
      }. Feels like ${feelsLike}°${unit} with ${main.humidity}% humidity.`;
    } catch (error) {
      if (axios.isAxiosError(error) && error.response?.status === 404) {
        return `Sorry, I couldn't find weather information for ${args.location}.`;
      }
      throw error;
    }
  },

  getCurrentTime: async (args: { timezone: string }) => {
    try {
      const time = new Date().toLocaleString("en-US", {
        timeZone: args.timezone,
      });
      return `The current time in ${args.timezone} is ${time}`;
    } catch (error) {
      return `Invalid timezone: ${args.timezone}`;
    }
  },
};

export const availableFunctions: FunctionDefinition[] = [
  getCurrentWeather,
  getCurrentTime,
]; 
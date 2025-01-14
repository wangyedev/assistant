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

// Function implementations
export const functions = {
  getCurrentWeather: async (args: { location: string; unit?: string }) => {
    // This is a mock implementation
    const temp = Math.floor(Math.random() * 30);
    const unit = args.unit || "celsius";
    return `The current temperature in ${args.location} is ${temp}°${
      unit === "celsius" ? "C" : "F"
    }`;
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
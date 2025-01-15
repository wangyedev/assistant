import dotenv from "dotenv";
import path from "path";

// Load environment variables from .env file
dotenv.config({ path: path.join(__dirname, "../.env") });

interface Config {
  port: number;
  nodeEnv: string;
  openAiApiKey: string;
  db: {
    host: string;
    port: number;
    name: string;
    user: string;
    password: string;
  };
  jwt: {
    secret: string;
    expiresIn: string;
  };
  openWeatherApiKey: string;
  mongodb: {
    uri: string;
    options: {
      maxPoolSize: number;
      serverSelectionTimeoutMS: number;
    };
  };
}

export const config: Config = {
  port: parseInt(process.env.PORT || "8080", 10),
  nodeEnv: process.env.NODE_ENV || "development",
  openAiApiKey: process.env.OPENAI_API_KEY || "",
  db: {
    host: process.env.DB_HOST || "localhost",
    port: parseInt(process.env.DB_PORT || "5432", 10),
    name: process.env.DB_NAME || "assistant_db",
    user: process.env.DB_USER || "postgres",
    password: process.env.DB_PASSWORD || "",
  },
  jwt: {
    secret: process.env.JWT_SECRET || "your-default-secret",
    expiresIn: process.env.JWT_EXPIRES_IN || "24h",
  },
  openWeatherApiKey: process.env.OPENWEATHER_API_KEY || "",
  mongodb: {
    uri: process.env.MONGODB_URI || "mongodb://localhost:27017/assistant",
    options: {
      maxPoolSize: 10,
      serverSelectionTimeoutMS: 5000,
    },
  },
};

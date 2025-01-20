import express, { Request, Response, NextFunction } from "express";
import cors from "cors";
import assistantRoutes from "./routes/assistantRoutes";
import chatRoutes from "./routes/chatRoutes";
import { config } from "./config";
import { connectDB } from "./config/database";

const app = express();

// Middleware
app.use(express.json());
app.use(
  cors({
    origin: process.env.NEXT_PUBLIC_URL || "http://localhost:3000",
    methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
);

// Routes
app.use("/api/assistant", assistantRoutes);
app.use("/api/chat", chatRoutes);

// Error handling middleware
app.use((err: Error, req: Request, res: Response, next: NextFunction) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    error: "Something broke!",
    ...(process.env.NODE_ENV === "development" && { stack: err.stack }),
  });
});

// 404 handler
app.use((req: Request, res: Response) => {
  res.status(404).json({
    success: false,
    error: "Route not found",
  });
});

async function startServer() {
  try {
    await connectDB();
    app.listen(config.port, () => {
      console.log(
        `Server is running in ${config.nodeEnv} mode on port ${config.port}`
      );
    });
  } catch (error) {
    console.error("Failed to start server:", error);
    process.exit(1);
  }
}

startServer().catch(console.error);

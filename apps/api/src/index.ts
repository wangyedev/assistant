import express from "express";
import cors from "cors";
import assistantRoutes from "./routes/assistantRoutes";
import { config } from "./config";
import { connectDB } from "./config/database";

const app = express();

app.use(
  cors({
    origin: "http://localhost:3000", // Your Next.js app's URL
    methods: ["GET", "POST"],
    credentials: true,
  })
);

app.use(express.json());
app.use("/api/assistant", assistantRoutes);

async function startServer() {
  await connectDB();

  app.listen(config.port, () => {
    console.log(
      `Server is running in ${config.nodeEnv} mode on port ${config.port}`
    );
  });
}

startServer().catch(console.error);

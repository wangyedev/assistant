import express from "express";
import cors from "cors";
import assistantRoutes from "./routes/assistantRoutes";
import { config } from "./config";

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

app.listen(config.port, () => {
  console.log(
    `Server is running in ${config.nodeEnv} mode on port ${config.port}`
  );
});

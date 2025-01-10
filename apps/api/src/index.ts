import express from 'express';
import assistantRoutes from './routes/assistantRoutes';
import { config } from './config';

const app = express();

app.use(express.json());
app.use('/api/assistant', assistantRoutes);

app.listen(config.port, () => {
  console.log(`Server is running in ${config.nodeEnv} mode on port ${config.port}`);
}); 
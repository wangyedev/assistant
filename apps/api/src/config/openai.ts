import OpenAI from 'openai';
import { config } from '../config';

const openai = new OpenAI({
  apiKey: config.openAiApiKey,
});

export default openai; 
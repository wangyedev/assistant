import { Router } from 'express';
import assistantController from '../controllers/assistantController';

const router = Router();

router.post('/create', assistantController.createAssistant);
router.post('/thread', assistantController.createThread);
router.post('/message', assistantController.sendMessage);

export default router; 
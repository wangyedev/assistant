import { Router } from 'express';
import assistantController from '../controllers/assistantController';

const router = Router();

router.post('/create', assistantController.createAssistant);
router.get('/list', assistantController.listAssistants);
router.post('/thread', assistantController.createThread);
router.get('/message', assistantController.sendMessage);
router.get('/messages/:threadId', assistantController.getMessages);

export default router; 
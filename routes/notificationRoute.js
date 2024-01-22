import express from 'express';
import { createNotifications,fetchNotifications,deleteNotifications} from '../controllers/notificationController.js';
import authenticate from '../middleware/auth.js'

const router = express.Router()
router.post('/create-nofication',authenticate,createNotifications)
router.delete('/delete-nofication/:id',authenticate,deleteNotifications)
router.get('/fetch/user-nofication',authenticate,fetchNotifications)
export default router
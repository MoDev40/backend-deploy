import { fetchUserTrans,createTrans,updateTransaction } from '../controllers/transactionController.js';
import authenticate from '../middleware/auth.js'
import express from 'express';
const router = express.Router()
router.get('/fetch/user-transactions/:counter/:date',authenticate,fetchUserTrans)
router.post('/create-transaction',authenticate,createTrans)
router.put('/update-transaction',authenticate,updateTransaction)
export default router
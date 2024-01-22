import express from 'express';
import { fetchDailyReport, fetchMonthlyReport,fetchDailyItemReport, fetchMonthlyItemReport } from '../controllers/reportController.js';
import authenticate from '../middleware/auth.js'
const router = express.Router();

router.get('/fetch/daily-item-report/:id',authenticate,fetchDailyItemReport)
router.get('/fetch/daily-report',authenticate,fetchDailyReport)
router.get('/fetch/monthly-report/:date',authenticate,fetchMonthlyReport)
router.get('/fetch/monthly-item-report/:date/:id',authenticate,fetchMonthlyItemReport)

export default router
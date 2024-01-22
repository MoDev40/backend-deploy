import express from 'express';
import authenticate from '../middleware/auth.js'
import { createCategory, deleteCategory, fetchCategory, updateCategory } from '../controllers/categoryController.js';
const router = express.Router();
router.get('/categories',fetchCategory)
router.post('/create-categories',authenticate,createCategory)
router.put('/update-categories/:id',authenticate,updateCategory)
router.delete('/delete-categories/:id',authenticate,deleteCategory)

export default router


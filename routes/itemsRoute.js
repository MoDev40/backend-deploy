import express from 'express'
import { createItem,fetchUserItems, updateItem } from '../controllers/itemController.js'
import authenticate from '../middleware/auth.js'
const router = express.Router()

router.post('/create-items',authenticate,createItem) 
router.put('/update-item/:id',authenticate,updateItem) 
router.get('/fetch/user-items/:count/:typeID',authenticate,fetchUserItems)


export default router
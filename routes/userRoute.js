import express from 'express'
import { createUser,fetchUsers,loginUser, updateUser,logedUser } from '../controllers/userController.js'
import authenticate from '../middleware/auth.js'
const router = express.Router()

router.post('/create-user',createUser)
router.put('/update-user/:id',updateUser)
router.post('/login-user',loginUser)
router.get('/fetch/users',fetchUsers)
router.get('/fetch/users/loged-user',authenticate,logedUser)

export default router
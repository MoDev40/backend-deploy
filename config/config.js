import {PrismaClient} from '@prisma/client'
import dotenv from 'dotenv'
dotenv.config()
export const sekret = process.env.SEKRET_KEY
export const  prisma = new PrismaClient()


import {prisma, sekret} from '../config/config.js'
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken'

export const createUser = async(req, res) =>{
    const {username,email,password,isAdmin = false} = req.body
    try{
        const isUserExist = await prisma.user.findUnique({
            where:{
                username,
                email
            }
        })

        if(isUserExist){
            res.status(400).json("User already exists")
            return
        }

        const hashedPaswword = await bcrypt.hash(password,10)
        const newUser = await prisma.user.create({
            data:{
                username,
                email,
                isAdmin,
                password:hashedPaswword
            }
        })
        
        res.status(200).json({message:"success",data:newUser})

    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const loginUser = async(req, res) => {
    const { username , password} = req.body
    try {
        const isUserExist = await prisma.user.findUnique({
            where:{
                username: username
            }
        })

        if(!isUserExist){
            res.status(404).json({message:"invalid credentials"})
            return
        }
        
        const isPasswordTrue = await bcrypt.compare(password,isUserExist.password)
        if(!isPasswordTrue){
            res.status(404).json({message:"invalid credentials!"})
            return
        }

        const expiresIn = 2*24*60;
        isUserExist.password = undefined;
        
        const token =  jwt.sign({userId:isUserExist.id,username:isUserExist.username,expiresIn},sekret,{expiresIn})

        
        res.status(200).json({message:"success login",token} )

    } catch (error) {
        res.status(500).json({message: error.message})

    }
}

export const updateUser = async(req, res) => {
    const {username,email,password,isAdmin = false} = req.body
    try {
        const {id} = req.params
        
        const isUserExist = await prisma.user.findMany({
            where:{
               OR:[ {username:{ contains:username}},
                {email:{contains:email}} ],
                id:{
                    not:{
                        equals:Number(id)
                    }
                }
            }
        })
        console.log(isUserExist);
        if(isUserExist.length > 0) {
            res.status(404).json({message:"User already exists"})
            return
        }

        let hashedPaswword = password

        if(password.length <= 8){
            hashedPaswword = await bcrypt.hash(password,10)
        }

        const updatedUser = await prisma.user.update({
            data:{
                username,
                email,
                password:hashedPaswword,
                isAdmin
            },where:{
                id:Number(id)
            }
        })
        if(!updatedUser){
            res.status(400).json({message:"Try again user update failed"})
            return
        }

        res.status(200).json({message:"User updated successfully"})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const fetchUsers = async(req, res) => {
    try {
        const users = await prisma.user.findMany()
        res.status(200).json(users)
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}

export const logedUser = async(req,res)=>{
    try {
        const {username,expiresIn} = req.decoded
        const logedUser = await prisma.user.findUnique({
            where:{
                username: username
            }
        })
        logedUser.password = undefined,
        logedUser.email = undefined,
        logedUser.createdAt = undefined
        res.status(200).json({logedUser,expiresIn})
    } catch (error) {
        res.status(500).json({message: error.message})
    }
}
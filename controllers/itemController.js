import {prisma} from '../config/config.js'
const PAGE_SIZE = 15;

export const createItem = async(req,res)=>{

    const {itemName,itemDesc,itemType,price,quantity} = req.body
    
    try{
        const {userId} = req.decoded
        
        const newItem = await prisma.item.create({
            data:{
                name: itemName,
                quantity: Number(quantity),
                price: parseFloat(price),
                typeID: itemType,
                ownerId:Number(userId),
                description: itemDesc,
                availability:true,
            }
        })

        if(!newItem){
            res.status(404).json({message:"Error creating item "})
            return
        }

        await prisma.transaction.create({
            data:{
                itemId:newItem.id,
                quantity:newItem.quantity,
                transactionType:"in",
            }
        })
        
        res.status(200).json({message:"Item created successfully",newItem})
    } catch (error) {
        res.status(500).json({message:error.message,error:error})
    }
}

export const updateItem = async(req,res)=>{
    const {itemName,itemDesc,itemType,price,quantity,availability} = req.body
    try{
        const {userId} = req.decoded
        const {id} = req.params

        const updatedItem = await prisma.item.update({
            data:{
                name: itemName,
                price: parseFloat(price),
                typeID: itemType,
                description: itemDesc,
                availability:availability,
            },where:{
                ownerId:Number(userId),
                id:Number(id),
            }
        })

        if(!updatedItem){
            res.status(400).send({message:"Error updating item"})
            return
        }
        res.status(200).send({message:"Item updated successfully"})
    }catch(error){
        res.status(500).json({message:error.message,error:error})
    }
}

export const fetchUserItems = async(req, res) =>{
    try {
        const {userId} = req.decoded
        const {count,typeID} = req.params
        const items = await prisma.item.findMany({
            orderBy:{
                createdAt:'desc',
            },
            take:PAGE_SIZE,
            skip:(parseInt(count)-1)*PAGE_SIZE,
            where:{
                ownerId:Number(userId),
                typeID:Number(typeID) !== 0 ? Number(typeID) : undefined
            },
            include:{
                type:{
                    select:{
                        name:true
                    }
                }
            }
        })
        if (items.length === 0) {
            res.status(404).json({message:"Item not found "})
            return
        }
        res.status(200).json(items)
    } catch (error) {
        res.status(500).json({message:error.message,error:error})
    }
}
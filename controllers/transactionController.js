import { prisma } from "../config/config.js"
const PAGE_SIZE = 15;
export const fetchUserTrans = async(req, res) =>{
    try {
        const {userId} = req.decoded
        const {counter,date} = req.params
        
        const targetDate = new Date(date)
        targetDate.setHours(0,0,0,0)
        const nextDay = new Date()
        nextDay.setDate(targetDate.getDate()+1)
        const transactions = await prisma.transaction.findMany({
            orderBy:{
                timestamp:'desc',
            },
            take:PAGE_SIZE,
            skip:(parseInt(counter)-1)*PAGE_SIZE,
            where:{
                timestamp:{
                    gte:targetDate,
                    lt:nextDay
                },
                item:{
                    ownerId:Number(userId),
                }
            },include:{
                item:{
                    select:{
                        name:true
                    }
                }
            }
        })
        if (transactions.length === 0) {
            res.status(404).json({message:"Item not found "})
            return
        }
        res.status(200).json(transactions)
    } catch (error) {
        res.status(500).json({message:error.message,error:error})
    }
}


export const createTrans = async(req,res)=>{
    const {itemID,date,transType,quantity} = req.body
    
    try {
        const existItem = await prisma.item.findUnique({
            where:{
                id:Number(itemID)
            }
        })

        const createTransaction = async()=>{
            return await prisma.transaction.create({
                data:{
                    itemId:Number(itemID),
                    timestamp:date,
                    quantity:Number(quantity),
                    transactionType:transType,
                }
            })
        }

        if(transType == "out"){
            
            if(Number(quantity) > existItem.quantity){
                res.status(400).send({ message:"out quantity is greater than in quantity"})
                return
            }else{
                
                const updatedItem = await prisma.item.update({
                    data:{
                        quantity:(existItem.quantity-Number(quantity))
                    },where:{
                        id:Number(itemID)
                    }
                })
                const newTrans = await createTransaction()
                if(!newTrans && !updatedItem){
                    res.status(400).send({ message:"Transaction creation failed"})
                    return
                }
                res.status(200).send({ message:"Transaction created successfully",newTrans,updatedItem})
            }
        }else{
            const updatedItem = await prisma.item.update({
                data:{
                    quantity:(existItem.quantity+Number(quantity))
                },where:{
                    id:Number(itemID)
                }
            })
            const newTrans = await createTransaction()
            if(!newTrans && !updatedItem){
                res.status(400).send({ message:"Transaction creation failed"})
                return
            }
            res.status(200).send({ message:"Transaction created successfully",newTrans,updatedItem})
        }
    } catch (error) {
        res.status(500).json({message:error.message,error:error})
        
    }
}

const updatedTransaction = async(transID,date,quantity,transType)=>{
    await prisma.transaction.update({
        data:{
            quantity:Number(quantity),
            transactionType:transType,
            timestamp:date
            
        },where:{
            id:Number(transID)
        }
    })
}

const updatedItem = async(itemID,quantity)=>{
    await prisma.item.update({
        data:{
            quantity:Number(quantity)
        },where:{
            id:Number(itemID)
        }
    })
}
export const updateTransaction = async(req,res)=>{
    try {
        const {itemID,date,transType,quantity,transID} = req.body
        const {userId} = req.decoded
        
        let newQuantity = Number(quantity);
        const existItem = await prisma.item.findMany({
            where:{
                AND:[{id:Number(itemID)},{ownerId:Number(userId)}]
            }
        })
        if(existItem.length == 0){
            res.status(404).send({message:"You cannot update unavialbe items transaction"})
            return 
        }

        const isTransactionExist = await prisma.transaction.findMany({
            where:{
                AND:[{id:Number(transID)},{itemId:Number(itemID)}]
            }
        })
    //  correction of incorrct increment quantity
    if(transType == "in"){
        if(isTransactionExist[0].transactionType == "out"){
            let updatedQuantity = existItem[0].quantity + newQuantity + isTransactionExist[0].quantity
            await updatedTransaction(transID,date,newQuantity,transType);
            await updatedItem(itemID,updatedQuantity)
            res.status(200).send({message:"Out Transaction to In Updated successfully"})
            return
        }
        if(newQuantity != isTransactionExist[0].quantity){
            if(newQuantity > isTransactionExist[0].quantity){
                const neededQuantity = newQuantity - isTransactionExist[0].quantity;
                const updatedQuantity = existItem[0].quantity + neededQuantity
                await updatedTransaction(transID,date,newQuantity,transType);
                await updatedItem(itemID,updatedQuantity)
                res.status(200).send({message:"Transaction updated successfully"})
                return
            }else if(newQuantity == 0){
                const updatedQuantity = existItem[0].quantity - isTransactionExist[0].quantity
                if(updatedQuantity < 0){
                    res.status(404).send({message:"Incoorect quantity is greater than current quantity"})
                    return
                }
                await updatedItem(itemID,updatedQuantity)
                await prisma.transaction.delete({where:{id:Number(transID)}})
                res.status(200).send({message:"incorrect  Transaction removed successfully"})
                return
            }else{
                const neededQuantity = isTransactionExist[0].quantity-newQuantity
                const updatedQuantity = existItem[0].quantity-neededQuantity
                if(updatedQuantity < 0){
                    res.status(404).send({message:"Incoorect quantity is greater than current quantity"})
                    return
                }
                await updatedTransaction(transID,date,newQuantity,transType);
                await updatedItem(itemID,updatedQuantity)
                res.status(200).send({message:"Transaction updated successfully"})
                return
            }
        }
    // correction of incorrect decrementing quantity
    }else{
        if(isTransactionExist[0].transactionType == "in"){
            let updatedQuantity = existItem[0].quantity - (newQuantity + isTransactionExist[0].quantity)
            if(updatedQuantity < 0){
                res.status(404).send({message:"Incoorect quantity is greater than current quantity"})
                return
            }
            await updatedTransaction(transID,date,newQuantity,transType);
            await updatedItem(itemID,updatedQuantity)
            res.status(200).send({message:"In Transaction to Out Updated successfully"})
            return
        }

        if(newQuantity != isTransactionExist[0].quantity){
            if(newQuantity > isTransactionExist[0].quantity){
                const neededQuantity = newQuantity - isTransactionExist[0].quantity;
                const updatedQuantity = existItem[0].quantity - neededQuantity
                if(updatedQuantity < 0){
                    res.status(404).send({message:"Incoorect quantity is greater than current quantity"})
                    return
                }
                await updatedTransaction(transID,date,newQuantity,transType);
                await updatedItem(itemID,updatedQuantity)
                res.status(200).send({message:"Transaction updated successfully"})
                return
            }else if(newQuantity == 0){
                const updatedQuantity = existItem[0].quantity + isTransactionExist[0].quantity
                await updatedItem(itemID,updatedQuantity)
                await prisma.transaction.delete({where:{id:Number(transID)}})
                res.status(200).send({message:"incorrect  Transaction removed successfully"})
                return
            }else{
                const reminderQuan = isTransactionExist[0].quantity-newQuantity
                const updatedQuantity = existItem[0].quantity+reminderQuan
                await updatedTransaction(transID,date,newQuantity,transType);
                await updatedItem(itemID,updatedQuantity)
                res.status(200).send({message:"Transaction updated successfully"})
                return
            }
    }
    }
    } catch (error) {
        res.status(500).json({message:error.message,error:error})
    }
}
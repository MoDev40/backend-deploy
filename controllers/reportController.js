import {prisma} from '../config/config.js'

export const fetchDailyReport = async (req,res)=>{
    try{
        const {userId} = req.decoded

        const currentDate = new Date()
        currentDate.setHours(0,0,0,0)
        const data = await prisma.transaction.findMany({
            where:{
                item:{
                    ownerId:Number(userId)
                },
                timestamp:{
                    gte:currentDate
                }
            },include:{
                item:{
                    select:{
                        price:true
                    }
                }
            }
        })
        if(data.length == 0){
            res.status(404).send({message:"No data found"})
            return
        }

        let inTrans = {
            quantity:0,
            price:0
        }
        let outTrans = {
            quantity:0,
            price:0
        }

        data.forEach( value =>{
            if(value.transactionType == "in"){
                inTrans.quantity += value.quantity
                inTrans.price += (value.quantity*value.item.price)
            }else{
                outTrans.quantity += value.quantity
                outTrans.price += (value.quantity*value.item.price)
            }
        })
        res.status(200).send({inTrans, outTrans})
    }catch(error){
        res.status(500).json({ message: error.message, error: error });
    }
}
export const fetchDailyItemReport = async (req, res)=>{
    try{
        const {id} = req.params
        const {userId} = req.decoded

        const currentDate = new Date()
        currentDate.setHours(0,0,0,0)
        const data = await prisma.transaction.findMany({
            where:{
                item:{
                    ownerId:Number(userId),
                    id:Number(id)
                },
                timestamp:{
                    gte:currentDate
                }
            },include:{
                item:{
                    select:{
                        price:true,
                        name:true,
                    }
                }
            }
        })
        if(data.length == 0){
            res.status(404).send({message:"No data found"})
            return
        }

        let inTrans = {
            quantity:0,
            price:0,
            name:data[0]?.item?.name
        }
        let outTrans = {
            quantity:0,
            price:0,
            name:data[0]?.item.name
        }

        data.forEach( value =>{
            if(value.transactionType == "in"){
                inTrans.quantity += value.quantity
                inTrans.price += (value.quantity*value.item.price)
            }else{
                outTrans.quantity += value.quantity
                outTrans.price += (value.quantity*value.item.price)
            }
        })
        res.status(200).send({inTrans, outTrans})
    }catch(error){
        res.status(500).json({ message: error.message, error: error });
    }
}

export const fetchMonthlyReport = async (req,res)=>{
    try{
        const {userId} = req.decoded
        const {date} = req.params
        
        const currentDate = new Date(date)
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth()+1;

        const startDate = new Date(year, month-1,1)
        const endDate = new Date(year, month,0)
        const data = await prisma.transaction.findMany({
            where:{
                item:{
                    ownerId:Number(userId)
                },
                timestamp:{
                    gte:startDate,
                    lte:endDate
                }
            },include:{
                item:{
                    select:{
                        price:true
                    }
                }
            }
        })
        if(data.length == 0){
            res.status(404).send({message:"No data found"})
            return
        }

        let inTrans = {
            quantity:0,
            price:0
        }
        let outTrans = {
            quantity:0,
            price:0
        }

        data.forEach( value =>{
            if(value.transactionType == "in"){
                inTrans.quantity += value.quantity
                inTrans.price += (value.quantity*value.item.price)
            }else{
                outTrans.quantity += value.quantity
                outTrans.price += (value.quantity*value.item.price)
            }
        })
        res.status(200).send({inTrans, outTrans})
    }catch(error){
        res.status(500).json({ message: error.message, error: error });
    }
}

export const fetchMonthlyItemReport = async (req,res)=>{
    try{
        const {userId} = req.decoded
        const {date,id} = req.params
        
        const currentDate = new Date(date)
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth()+1;

        const startDate = new Date(year, month-1,1)
        const endDate = new Date(year, month,0)
        const data = await prisma.transaction.findMany({
            where:{
                item:{
                    ownerId:Number(userId),
                    id:Number(id)
                },
                timestamp:{
                    gte:startDate,
                    lte:endDate
                }
            },include:{
                item:{
                    select:{
                        price:true,
                        name:true
                    }
                }
            }
        })
        if(data.length == 0){
            res.status(404).send({message:"No data found"})
            return
        }

        let inTrans = {
            quantity:0,
            price:0,
        }
        let outTrans = {
            quantity:0,
            price:0
        }

        data.forEach( value =>{
            if(value.transactionType == "in"){
                inTrans.quantity += value.quantity
                inTrans.price += (value.quantity*value.item.price)
            }else{
                outTrans.quantity += value.quantity
                outTrans.price += (value.quantity*value.item.price)
            }
        })
        res.status(200).send({inTrans, outTrans,name:data[0]?.item?.name})
    }catch(error){
        res.status(500).json({ message: error.message, error: error });
    }
}

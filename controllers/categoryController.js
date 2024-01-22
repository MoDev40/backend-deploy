import { prisma } from "../config/config.js"

export const fetchCategory = async(req,res)=>{
    try{
        const data = await prisma.type.findMany()
        if(data.length > 0){
            res.status(200).json(data)
        }
    } catch (error) {
        res.status(500).send(error.message)
    }
}

export const createCategory = async(req,res)=>{
    const {catName} = req.body
    const isCategoryExists = await prisma.type.findMany({
        where:{
            name:capitalize(catName)
        }
    })

    if(isCategoryExists.length > 0){
        res.status(400).json({message: 'Category already exists'})
        return
    }

    const newCategory = await prisma.type.create({
        data: {name:capitalize(catName)}
    })

    if(!newCategory){
        res.status(400).json({message: 'Try again to create a new category'})
        return
    }

    res.status(200).json({message: 'Category created successfully'})
}
const capitalize = (str)=>{
    return str.charAt(0).toUpperCase()+str.slice(1)
}
export const updateCategory = async(req,res)=>{
    const {catName} = req.body
    try {
        const {id} = req.params
        
        const isCategoryExists = await prisma.type.findMany({
            where:{
                name:capitalize(catName)
            }
        })
    
        if(isCategoryExists.length > 0){
            res.status(400).json({message: 'Category already exists'})
            return
        }
        const updatedCategory = await prisma.type.update({
            data: {name:capitalize(catName)},
            where:{
                id:Number(id)
            }
        })
    
        if(!updatedCategory){
            res.status(400).json({message: 'Try again to update a category'})
            return
        }
    
        res.status(200).json({message: 'Category updated successfully'})

    } catch (error) {
        
    }
}

export const deleteCategory = async (req, res) => {
    try {
        const {id} = req.params

        const deletedCategory = await prisma.type.delete({
            where:{
                id:Number(id)
            }
        })
        if(!deletedCategory){
            res.status(400).json({message: 'Try again to delete a category'})
            return
        }
    
        res.status(200).json({message: 'Category deleted successfully'})
    } catch (error) {
        
    }
}
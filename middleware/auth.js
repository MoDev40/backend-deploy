import jwt from 'jsonwebtoken'
import { sekret } from '../config/config.js'
function authenticate(req, res, next){
    const token = req.headers?.authorization?.split(' ')[1]
    if(!token){
        res.status(401).send("Anauthorized: missing token")
        return
    }

    jwt.verify(token,sekret,(err,decoded)=>{
        
            if(err){
                res.status(401).send({message:"Authentication failed - invalid token Please re-Login",err})
                return
            }
            req.decoded = decoded
            next()
    })
}

export default authenticate
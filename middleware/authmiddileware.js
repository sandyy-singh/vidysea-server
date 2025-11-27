import jwt from 'jsonwebtoken';
import User from '../models/user.model.js';

export const protect = async(req,res,next)=>{
    const {token} = req.cookies;
    

    if(!token){
        return res.status(401).json({message:"Unauthorized: No Token1"})
    }

    try{
        const decoded = jwt.verify(token,process.env.JWT_SECRET);
        const user = await User.findById(decoded.id).select('-password');
        req.user  = user
        next()

    }catch(err){
        return res.status(401).json({ message: "Unauthorized: Invalid token2" });
    }

}
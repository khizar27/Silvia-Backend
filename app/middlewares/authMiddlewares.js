'use strict'

const ErrorHandler = require('../utils/errorHandling');
const catchAsyncFun = require('../middlewares/catchAsyncFun');
const jwt = require('jsonwebtoken')
require('dotenv').config()




exports.isAuthenticatedUser = catchAsyncFun(async(req,res,next)=>{
    const {token }= req.cookies;

    console.log(token,'token')
    if(!token){
        return next(new ErrorHandler("please login to access this resource",401))
    }
    console.log(req.user,"user1");
    console.log(process.env.SECRET_KEY,"key");
    await jwt.verify(token, process.env.SECRET_KEY,(err,user)=>{
        if(err){
            res.status(401).json({message:err.message})
        }
        req.user=user
        console.log(req.user,"user");
    });

    // console.log(decodedData,'decodedData')
    // console.log(User.findById(decodedData.id),"decode data");
    // req.user = await User.findById(decodedData.id);
    // next()
});

// exports.authorizeRoles = (...roles)=>{
//     return(req,res,next)=>{
//         if(!roles.includes(req.user.role)){
//             return next( new ErrorHandler(
//                 `Role: ${req.user.role} is not allowed to access this resource `,
//                 403
//             ))
//         }
//         next();
//     }
// }
exports.authenticateToken = (req, res, next)=>{
    const authHeader = req.headers['authorization']; //Bearer TOKEN
    const token = authHeader && authHeader.split(' ')[1];
    if (token == null) return res.status(401).json({error:"Null token"});
    jwt.verify(token, process.env.SECRET_KEY, (error, user) => {
      if (error) return res.status(403).json({error : error.message});
      req.user = user;
      console.log(req.user)
      next();
    });
  }
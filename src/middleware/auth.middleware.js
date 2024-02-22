const jwt = require("jsonwebtoken");
const HTTPError=require("../Models/Error.model");


const authmiddleware=async (req,res,next)=>{

    const authorization=req.headers.Authorization||req.headers.authorization;
    // console.log(authorization);
    if(authorization&&authorization.startsWith("Bearer"))
    {
        const  token=authorization.split(" ")[1];
        jwt.verify(token,process.env.JWTSECRET,(err,user)=>{
            if(err)
            {
                return  next(new HTTPError('Authentication failed',403));
            }
            else{
                req.user=user;
                next();
            }
        })
    }
    else
    {
        return next(new HTTPError('Authentication is required',403));
    }

}

module.exports=authmiddleware;
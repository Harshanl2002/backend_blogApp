import HTTPError from "../Models/Error.model.js";

// unkonwn route (404)
const NotFound=(req,res,next)=>{
    const error=new HTTPError(`Not Found  - ${req.originalUrl}`,404);
    next(error);
}

//Error handeler 
const errorHandeler=(error,req,res,next)=>{
    if(res.headerSent)
    {
        return next(error);
    }
    res.status(error.code ||500).json({message:error.message||'Internal Server Error'})
}

export {NotFound,errorHandeler};
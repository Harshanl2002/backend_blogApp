
// unkonwn route (404)
const NotFound=(req,res,next)=>{
    const error=new Error(`Not Found  - ${req.originalUrl}`);
    res.status(404);
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
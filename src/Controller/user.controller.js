// imports
// import HTTPError from "../Models/Error.model.js";


//const veriables
// const err=new HTTPError("This is a custom error",403);

//<============================================Register User=============================================================>
// POST Request {link:"/api/user/register",security:"UNPROTECTED"}
const RegisterUser= (req,res,next)=>{
    res.json({message:"Register New User!!!"});
    
}


//<============================================Login a Registered User=============================================================>
// POST Request {link:"/api/user/login",security:"UNPROTECTED"}
const LoginUser= (req,res,next)=>{
    res.json({message:"Login user!!!"});
}

//<============================================Profile of the User=============================================================>
// get Request {link:"/api/user/:id",security:"PROTECTED"}
const getUserByID= (req,res,next)=>{
    res.json({message:`profile of user by id!!!`});
}

//<============================================change user profile for a Registered User=============================================================>
// put Request {link:"/api/user/change-avatar",security:"PROTECTED"}
const changeAvathar= (req,res,next)=>{
    res.json({message:"change user Profile picture!!"});
}


//<============================================Login a Registered User=============================================================>
// put Request {link:"/api/user/update-User",security:"PROTECTED"}
const UpdateUser= (req,res,next)=>{
    res.json({message:"Update User Details!!!"});
}

//<============================================Get all Authors=============================================================>
// get Request {link:"/api/user/authors",security:"UNPROTECTED"}
const getAuthors= (req,res,next)=>{
    res.json({message:"gets all Users!!!"});
}


export {RegisterUser,LoginUser,getUserByID,changeAvathar,UpdateUser,getAuthors};
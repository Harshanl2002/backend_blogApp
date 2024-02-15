// consts
const HTTPError = require("../Models/Error.model.js");
const {User} = require("../Models/User.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");


//const veriables
// const err=new HTTPError("This is a custom error",403);

//<============================================Register User=============================================================>
// POST Request {link:"/api/user/register",security:"UNPROTECTED"}
const RegisterUser= async (req,res,next)=>{
    try {
        const {name,email,password,password2}= req.body;
        if(!name||!email||!password||!password2)
        {
            return next(new HTTPError(`Please provide all fields`,400)); 
        }
        const newemail=email.toLowerCase();
        const emailExists=await User.findOne({email:newemail});
        if(emailExists)
        {
            return next(new HTTPError('Email already exists',409));
        }

        if((password.trim()).length<6)
        {
            return next(new HTTPError( 'Password must be at least 6 characters long',403));
        }
        if(password!=password2){
            return next(new HTTPError('Passwords do not match',403));
        }
        const encryptedpass= await bcrypt.hash(password,10);
        
        const user = new User ({
            name : name ,
            email : newemail ,
            password:encryptedpass,
        });
        const  savedUser = await user.save();
        res.status(201).json(`new User ${name} has been registered sucessfully!!!`);

    } catch (error) {
       return next(new HTTPError(`User registeration Failed !!! because ${error}`,422));
    }
}


//<============================================{Login a Registered User}=============================================================>
// POST Request {link:"/api/user/login",security:"UNPROTECTED"}
const LoginUser= async (req,res,next)=>{
   try {
    const {email,password}=req.body;
    if(!email||!password)
    {
        return next(new HTTPError("please provide email and password to login ",400)) ;
    }
    const newemail=email.toLowerCase();
    const emailExists=await User.findOne({email:newemail});
    if(!emailExists)
    {
        return next(new HTTPError( "Invalid credentials please check your credentials or signup",401));
    }
    const comparepass=await  bcrypt.compare(password,emailExists.password);
    
    if (!comparepass) {
        return next(new HTTPError(" Invalid credentials please check your credentials or signup",403));
    }
    //create token
    const {_id:id,name}=emailExists;
    const token=jwt.sign({id,name},process.env.JWTSECRET,{expiresIn:"1d"});

    res.status(200).json({token,name,id});
   } catch (error) {
       return next(new HTTPError(`Login Failed !!! because ${error}`,422));
   }
}

//<============================================{Profile of the User}=============================================================>
// GET Request {link:"/api/user/:id",security:"PROTECTED"}
const getUserByID= async (req,res,next)=>{
    try {
        const {id}=req.query;
        console.log(id);
        const user=  await User.findById(id).select("-password");
        
        if(!user){
            return next(new HTTPError('No user with that id found',404));  
        }
        res.status(200).json(user);
    } catch (error) {
        return next(new HTTPError(error));
    }
}


//<============================================{Change user profile for a Registered User}=============================================================>
// POST  Request {link:"/api/user/change-avatar",security:"PROTECTED"}
const changeAvathar= async (req,res,next)=>{
    try {
        res.json(req.file);
        console.log(req.files);
    } catch (error) {
        return  next(new HTTPError("Unable to change Avathar",500));
    }
}


//<============================================{Update User Profile}=============================================================>
// put Request {link:"/api/user/update-User",security:"PROTECTED"}
const UpdateUser= async (req,res,next)=>{
    res.json({message:"Update User Details!!!"});
}

//<============================================{Get all Authors}=============================================================>
// get Request {link:"/api/user/authors",security:"UNPROTECTED"}
const getAuthors= async (req,res,next)=>{
    try {
        const author=await User.find().select("-password");
        console.log(author);
        res.status(200).json(author);
    } catch (error) {
        return next(error);
    }
}

module.exports = {RegisterUser,LoginUser,getUserByID,changeAvathar,UpdateUser,getAuthors};
// consts
const HTTPError = require("../Models/Error.model.js");
const User = require("../Models/User.model.js");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const fs =require('fs');
const  path=require('path');
const {v4:uuid}=require('uuid');


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
        const {id}=req.user;
        // console.log(req.user,id);
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
        if(!req.files.avatar)
        {
            return next(new HTTPError( 'Please select an image to upload',400));
        }

        const user= await  User.findById(req.user.id);

        //deleting old avatar if exists
        if(user.avatar)
        {
            fs.unlink(path.join(__dirname,"../","uploads",user.avatar),(err)=>{
               if(err)
               {
                return next(new HTTPError(err));
               }
            });
        }
        const {avatar}=req.files;
        //checking file size
        if(avatar.size>500000)
        {
            return next(new HTTPError('Image size is too big',400));
        }

        let filename=avatar.name;
        let splitedfilename=filename.split('.');
       //getting the extension of uploaded file
       let newfilename=splitedfilename[0]+"_"+uuid()+'.'+splitedfilename[splitedfilename.length -1];

       avatar.mv(path.join(__dirname,'../','uploads',newfilename),async (err) =>{
        if(err)
        {
            return next(new HTTPError(err,500));
        }
            const updateAvatar=await User.findByIdAndUpdate(req.user.id,{'avatar':newfilename},{new:true});
            if(!updateAvatar){
                return next(new HTTPError('Unable to set user profile',404));
            }
            res.status(200).json({
                message:"User profile was updated!!!",
                data:updateAvatar});
       })
    } catch (error) {
        return  next(new HTTPError(error));
    }
}


//<============================================{Update User Profile}=============================================================>
// put Request {link:"/api/user/update-User",security:"PROTECTED"}
const UpdateUser= async (req,res,next)=>{
    try {
        const {name,email,currentpass,newpass,confirmPass} = req.body;
        
        //Checking for validation
        const user= await User.findById(req.user.id);
        if(!user)
        {
            return next(new HTTPError("User Not Found ",404));
        }

        const emailExist=await User.findOne({email:email});
        if((emailExist&&(emailExist._id!=req.user.id)))
        {
            return next(new HTTPError( "Email already exists",400));
        }

        const  passwordMatched=await bcrypt.compare(currentpass,user.password);
        if(!passwordMatched)
        {
            return next( new HTTPError("Password is Incorrect!!",401)) ;
        }

        if(newpass!==confirmPass)
        {
            return next(new HTTPError("Password does not match",400));
        }
        //Updating the fields
        let hashedpass=req.user.password;
        if(newpass&&confirmPass)
        {
            hashedpass=await bcrypt.hash(newpass,10);
        }
        const updateduserdata=await User.findByIdAndUpdate(req.user.id ,{name:name,email:email,password:hashedpass},{new:true});
        if(!updateduserdata)
         {
            return next(new HTTPError("Something went Wrong!!!.",400));
         }
        res.status(200).json({
            message:`Profile Updated Successfully`,
            data:updateduserdata
        });
    } catch (error) {
        return next(new HTTPError(error,500));
    }
}

//<============================================{Get all Authors}=============================================================>
// get Request {link:"/api/user/authors",security:"UNPROTECTED"}
const getAuthors= async (req,res,next)=>{
    try {
        const author=await User.find().select("-password");
        if(author.length===0){
            return next(new HTTPError("No Author Found",404));
        }
        // console.log(author);
        res.status(200).json(author);
    } catch (error) {
        return next(error);
    }
}

module.exports = {RegisterUser,LoginUser,getUserByID,changeAvathar,UpdateUser,getAuthors};
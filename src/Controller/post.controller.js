const Post = require('../Models/post.model');
const User=require("../Models/User.model")
const HTTPError=require('../Models/Error.model');
const fs=require("fs");
const path=require("path");
const {v4:uuid}=require("uuid");
//===============================================================createPost=================================================
// Post Request {link:"/api/post/",security:"PROTECTED"}
const createPost=async (req,res,next)=>{
    try {
        const {title,content,catagory}=req.body;
        const  userId=req.user.id;
        const {thumpnail}=req.files;
        if(!title||!content||!thumpnail||!catagory||!userId)
        {
            return next(new HTTPError("fill all the  fields ",400));
        }
        if(thumpnail>2000000)
        {
            return next(new HTTPError("thumpnail size must be less then 2mb",400));
        }
        let user=await User.findById(userId);
        if(!user)
        {
            return next(new HTTPError("Not a user!!!",404));
        }
        let filename=thumpnail.name;
        let splitedfilename=filename.split('.');
        //getting the extension of uploaded file
        let newfilename=splitedfilename[0]+"_"+uuid()+'.'+splitedfilename[splitedfilename.length -1];
        thumpnail.mv(path.join(__dirname,"../assets/","thumpnails",newfilename),async(err)=>{
            if(err)
            {
                return next(new HTTPError(err,400));
            }
            
            const post=await Post.create({title,content,thumpnail:newfilename,catagory,AuthorID:userId});
            if(!post)
            {
                return next(new HTTPError("Something went wrong!!",400));
            }
           
            user.posts++;
            const updateduser= await user.save();
            res.status(201).json({message:'created',data:post,user:updateduser});
        })
        
    } catch (error) {
        return next(new HTTPError(error));
    }
}
//===============================================================EditPost=================================================
// Put Request {link:"/api/post/edit/:id",security:"PROTECTED"}
const EditPost=async (req,res,next)=>{
    res.json({message:"Editpost"});
}
//===============================================================DeletePost=================================================
// DEl Request {link:"/api/post/del/:id",security:"PROTECTED"}
const DeletePost=async (req,res,next)=>{
    res.json({message:"DeletePost"});
}
//===============================================================getPost=================================================
// Get Request {link:"/api/post/:id",security:"UnPROTECTED"}
const getPost=async (req,res,next)=>{
    res.json({message:"getpost"});
}
//===============================================================GetAllPosts=================================================
// Get Request {link:"/api/post/",security:"UNPROTECTED"}
const getAllPosts=async (req,res,next)=>{
    res.json({message:"get all posts!!!"});
}
//===============================================================EditPost=================================================
// Get Request {link:"/api/post/Author/:id",security:"UNPROTECTED"}
const getAllPostsofAnAuthor=async (req,res,next)=>{
    res.json({message:"get posts of Author"});
}

//===============================================================EditPost=================================================
// Get Request {link:"/api/post/catagory/:cat",security:"UNPROTECTED"}
const getAllPostsbyCatagory=async (req,res,next)=>{
    res.json({message:"get posts of catagory"});
}

module.exports={createPost,EditPost,DeletePost,getPost,getAllPosts,getAllPostsofAnAuthor,getAllPostsbyCatagory};
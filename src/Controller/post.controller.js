const Post = require('../Models/post.model');
const User=require("../Models/User.model")
const HTTPError=require('../Models/Error.model');
const fs=require("fs");
const path=require("path");
const {v4:uuid}=require("uuid");
const ObjectId=require("mongoose").Types.ObjectId;
//===============================================================createPost=================================================
// Post Request {link:"/api/post/",security:"PROTECTED"}
const createPost=async (req,res,next)=>{
    try {
        const {title,content,catagory}=req.body;
        const  userId=req.user.id;
        const {thumpnail}=req.files;
        if(!title||!content||!thumpnail||!catagory||!userId)
        {
            return next(new HTTPError("fill all the  fields",400));
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
    try
    {
        const postid=new ObjectId(req.query);
        const {title,content,catagory}=req.body;
        const  userId=req.user.id;
        const {thumpnail}=req.files;
        let post=await Post.findById(postid);
        if(!post||post.AuthorID!==userId)
        {
            return next(new HTTPError("UserID not Matched!!",400));
        }
        if(!title||!content||!thumpnail||!catagory||!userId)
        {
            return next(new HTTPError("fill all the  fields",400));
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
        if(post.thumpnail.split('_')[0]!==splitedfilename[0])
        {
            fs.unlink(path.join(__dirname,"../assets/","thumpnails",post.thumpnail),(err)=>{
                if(err)
                {
                    return next(new HTTPError(err));
                }
            });
            thumpnail.mv(path.join(__dirname,"../assets/","thumpnails",newfilename),async(err)=>{
                if(err)
                {
                    return next(new HTTPError(err,400));
                }
            })
        }
        const updatedPost=await Post.findByIdAndUpdate(postid,{title,content,catagory,thumpnail:newfilename});
        if(!updatedPost)
        {
            return next(new HTTPError("Something went wrong"));
        }
        res.status(200).json({message:"Post Updated Sucessfully!!!",updatedPost:updatedPost});
    }
    catch(err)
    {
        return next(new HTTPError(err));
    }
}
//===============================================================DeletePost=================================================
// DEl Request {link:"/api/post/del/:id",security:"PROTECTED"}
const DeletePost=async (req,res,next)=>{
    try {
        const postId = new ObjectId(req.params.id);
        const userId=req.user.id;
        let user=await User.findById(userId);
        if(!user)
        {
            return next(new HTTPError("something went Wrong!!",501));
        }
        const DeletedPost= await Post.findByIdAndDelete(postId);
        if(!DeletedPost)
        {
            return next(new HTTPError("post not Found",400));
        }
        user.posts--;
        const updatedUser= await User.findByIdAndUpdate(userId,user);
        if(!updatedUser)
        {
            return next(new HTTPError("User not Found",400));
        }
        res.status(200).json({message:"post was Deleted",DeletedPost,updatedUser});
    } catch (error) {
        return next(new HTTPError(error));
    }
}
//===============================================================getPost=================================================
// Get Request {link:"/api/post/:id",security:"UnPROTECTED"}
const getPost=async (req,res,next)=>{
    try {
        const postId = new ObjectId(req.params.id);
        const post=await Post.findById(postId);
        if(!post)
        {
            return next(new HTTPError("No Post Found!!!",404));
        }
        res.status(200).json(post);
    } catch (error) {
        return next(new HTTPError(error))
    }    
}
//===============================================================GetAllPosts=================================================
// Get Request {link:"/api/post/",security:"UNPROTECTED"}
const getAllPosts=async (req,res,next)=>{
    try {
        const posts=await Post.find();
        if(posts.length===0)
        {
            return next(new HTTPError("Post not Found / Something went wrong!!!",404));
        }
        res.status(200).json(posts);
    } catch (error) {
        return next(new HTTPError(error));
    }
}
//===============================================================EditPost=================================================
// Get Request {link:"/api/post/Author/:id",security:"UNPROTECTED"}
const getAllPostsofAnAuthor=async (req,res,next)=>{
    try {
        const authorid= new ObjectId(req.params.id);
        const userPosts= await Post.find({AuthorID:authorid});
        if(userPosts.length===0)
        {
            return next(new HTTPError("No Posts Found!!!",400));
        }
        res.status(200).json(userPosts);
    } catch (error) {
        return next(new HTTPError(error));
    }
}

//===============================================================EditPost=================================================
// Get Request {link:"/api/post/catagory/:cat",security:"UNPROTECTED"}
const getAllPostsbyCatagory=async (req,res,next)=>{
    try {
        const cat= req.params.cat;
        const catagorypost= await Post.find({catagory:cat});
        if(catagorypost.length===0)
        {
            return next(new HTTPError("No Posts Found!!!",400));
        }
        res.status(200).json(catagorypost);
    } catch (error) {
        return next(new HTTPError(error));
    }
}

module.exports={createPost,EditPost,DeletePost,getPost,getAllPosts,getAllPostsofAnAuthor,getAllPostsbyCatagory};
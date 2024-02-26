
const {Schema,model}=require("mongoose");


const postSchema=new Schema({
    title:{type:String,required:true},
    content:{type:String, required:true},
    thumpnail:{type:String,required:true},
    catagory:{type:String,enum:["Agriculture","Education","Finance","Technology","Food","Health","Games","Movies","Anime","Uncatagorized"],message:"value is not supported"},
    AuthorID:{type:String,required:true},
},{timestamps:true});

module.exports=model('Post',postSchema);
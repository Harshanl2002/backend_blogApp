//consts
const { Schema,model } = require("mongoose");


const UserSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,lowercase:true,required:true},
    password:{type:String, required: true},
    avatar:{type:String},
    posts:{type:Number,default:0}
});

const User = model("User",UserSchema);
module.exports =User;
//exporting mongoose Model to use in other files. 
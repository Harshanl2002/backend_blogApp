//imports
import { Schema,model } from "mongoose";


const UserSchema=new Schema({
    name:{type:String,required:true},
    email:{type:String,unique:true,lowercase:true,required:true},
    password:{type:String, required: true},
    avatar:{type:String},
    posts:{type:Number,default:0}
});

export const User = model("User",UserSchema);
//exporting mongoose Model to use in other files. 
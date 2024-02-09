//imports
import  mongoose from "mongoose";
import dotenv from 'dotenv';

//configs
dotenv.config();

//mongo DB Connection Function
function connect(){
    mongoose.connect(process.env.URI).then(()=>{
        console.log("Connection to DB was Success!!!");
    }).catch(e=>console.error(e));
}

//exporting the connection function
export default connect;

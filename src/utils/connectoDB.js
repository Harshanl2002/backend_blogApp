//consts
const  mongoose = require("mongoose");
const dotenv = require('dotenv');

//configs
dotenv.config();

//mongo DB Connection Function
function connect(){
    mongoose.connect(process.env.URI).then(()=>{
        console.log("Connection to DB was Success!!!");
    }).catch(e=>console.error(e));
}

//exporting the connection function
module.exports = connect;

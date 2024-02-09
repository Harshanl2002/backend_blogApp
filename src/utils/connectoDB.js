const mongoose=require('mongoose');
require("dotenv").config();

function  connect(){
    mongoose.connect(process.env.URI).then(()=>{
        console.log("Connection to DB was Success!!!");
    }).catch(e=>console.error(e));
}

module.exports=connect;

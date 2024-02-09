const express=require('express');
const bodyParser = require('body-parser');
const app=express();
const connect =require('./utils/connectoDB');
require('dotenv').config();
const  port=process.env.PORT || 3000;

app.use(bodyParser.json());
connect();

app.listen(port,()=>{
    console.log( `Server is running on ${port}`);
});

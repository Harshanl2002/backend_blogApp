//Imports
import express from 'express';
import bodyParser from 'body-parser';
import cors from 'cors';
import connect  from './utils/connectoDB.js';
import dotenv from 'dotenv';
import routes from "./Routes/routes.js"



// configs and veriables
dotenv.config();
const app=express();
const  port=process.env.PORT || 3000;
const frontend=process.env.FRONTEND_URL||"*";


// Middlewares are used on 
app.use(bodyParser.json({extented:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(cors({Credential: true, origin: frontend }));
app.use("/api/",routes);



//connect to DB
connect();


//server command
app.listen(port,()=>{
    console.log( `Server is running on ${port}`);
});

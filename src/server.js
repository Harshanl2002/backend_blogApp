//consts
const express =require( 'express');
const bodyParser =require( 'body-parser');
const cors =require( 'cors');
const connect  =require( './utils/connectoDB.js');
const dotenv =require( 'dotenv');
const routes =require( "./Routes/routes.js");
const {NotFound,errorHandeler} =require( './middleware/Error.middleware.js');
const fileupload =require( 'express-fileupload');



// configs and veriables
dotenv.config();
const app=express();
const  port=process.env.PORT || 3000;
const frontend=process.env.FRONTEND_URL||"*";


// Middlewares are used on 
app.use(bodyParser.json({extented:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileupload());
app.use('./uploads',express.static(__dirname + './uploads'));
app.use(cors({Credential: true, origin: frontend }));
app.use("/api/",routes);
app.use(NotFound, errorHandeler);



//connect to DB
connect();


//server command
app.listen(port,()=>{
    console.log( `Server is running on ${port}`);
});

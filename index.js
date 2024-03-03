//consts
const express =require( 'express');
const bodyParser =require( 'body-parser');
const cors =require( 'cors');
const connect  =require( './src/utils/connectoDB.js');
const dotenv =require( 'dotenv');
const routes =require( "./src/Routes/routes.js");
const {NotFound,errorHandeler} =require( './src/middleware/Error.middleware.js');
const fileupload =require( 'express-fileupload');



// configs and veriables
dotenv.config();
const app=express();
const  port=process.env.PORT || 3000;


// Middlewares are used on 
app.use(bodyParser.json({extented:true}));
app.use(bodyParser.urlencoded({extended:true}));
app.use(fileupload());
// app.use(cors);
app.use('/src/assets/uploads',express.static(__dirname + '/src/assets/uploads'));
app.use('/src/assets/thumpnails',express.static(__dirname + '/src/assets/thumpnails'));
app.use(cors());
app.use("/api/",routes);
app.use(NotFound, errorHandeler);



//connect to DB
connect();


//server command
app.listen(port,()=>{
    console.log( `Server is running on ${port}`);
});

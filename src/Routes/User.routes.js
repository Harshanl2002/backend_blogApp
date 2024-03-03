const { Router } = require('express');
const {RegisterUser,LoginUser,getUserByID,changeAvathar,UpdateUser,getAuthors} = require("../Controller/user.controller.js");
const authmiddleware=require("../middleware/auth.middleware.js")


const router = new Router();


router.get("/",(req,res)=>{
    res.json({greeting1:"Welcome to the USER API",greeting2:"Welcome to .blogs"});
});

router.post("/register",RegisterUser);

router.post("/login",LoginUser);

router.get("/byID/:id",getUserByID);

router.post("/change-avatar",authmiddleware,changeAvathar);

router.put("/update-User",authmiddleware,UpdateUser);

router.get("/authors",getAuthors);

module.exports = router;

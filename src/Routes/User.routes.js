import { Router } from 'express';
import {RegisterUser,LoginUser,getUserByID,changeAvathar,UpdateUser,getAuthors} from "../Controller/user.controller.js";


const router = new Router();


router.get("/",(req,res)=>{
    res.json({greeting1:"Welcome to the USER API",greeting2:"Welcome to .blogs"});
});

router.post("/register",RegisterUser);

router.post("/login",LoginUser);

router.get("/byID/:id",getUserByID);

router.post("/change-avatar",changeAvathar);

router.put("/update-User",UpdateUser);

router.get("/authors",getAuthors);

export default router;

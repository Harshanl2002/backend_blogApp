//imports
import { Router } from "express";
import userRoutes from "./User.routes.js";
import PostRoutes from "./post.routes.js";


const router = new Router();

router.use("/user",userRoutes);
router.use("/posts",PostRoutes)
export default router;

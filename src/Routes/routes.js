//imports
import { Router } from "express";
import userRoutes from "./User.routes.js";


const router = new Router();

router.use("/user",userRoutes);
export default router;

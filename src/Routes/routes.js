//consts
const { Router } = require("express");
const userRoutes = require("./User.routes.js");
const PostRoutes = require("./post.routes.js");


const router = new Router();

router.use("/user",userRoutes);
router.use("/posts",PostRoutes)
module.exports = router;

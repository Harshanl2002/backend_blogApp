const { Router } = require('express');
const{createPost,EditPost,DeletePost,getPost,getAllPosts,getAllPostsofAnAuthor,getAllPostsbyCatagory} = require("../Controller/post.controller");
const authmiddleware=require("../middleware/auth.middleware");
const router = new Router();


router.get("/",getAllPosts);
router.post("/",authmiddleware,createPost);
router.put("/edit/",authmiddleware,EditPost);
router.delete("/del/:id",DeletePost);
router.get("/:id",getPost);
router.get("/author/:id",getAllPostsofAnAuthor);
router.get("/catagory/:cat",getAllPostsbyCatagory)

module.exports = router;

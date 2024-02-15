const { Router } = require('express');


const router = new Router();


router.get("/",(req,res)=>{
    res.json({greeting1:"Welcome to the Post API",greeting2:"Welcome to .blogs"});
});

module.exports = router;

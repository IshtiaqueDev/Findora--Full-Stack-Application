const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const User=require("../models/User");
const passport=require("passport");
const {
    checkUniversityMail,
    isLoggedIn,
    alreadyLoggedIn
} = require("../middlewares");



router.post(
    "/login",
    alreadyLoggedIn,
    (req, res, next) => {
        passport.authenticate("local", (err, user, info) => {
            if (err) return next(err);
            if (!user) {
                return res.status(401).json({
                    message: "Invalid username or password"
                });
            }
            req.login(user, (err) => {
                if (err) return next(err);
                return res.json({
                    message: "LoggedIn Successfully!",
                    user: req.user
                });
            });
        })(req, res, next);
    }
);


    

router.get("/",wrapAsync(async(req,res)=>{
    res.json({
        user:req.user
    })
}))

router.post("/signup",
    alreadyLoggedIn
    ,checkUniversityMail,wrapAsync(async(req,res,next)=>{
    let userData=req.body;
    let user=await User.register({
        username:userData.username,
        email:userData.email
    },userData.password);   

    req.login(user,(err)=>{
        if(err)return next(err);
    res.json({
        message:"Signup Successfully"
    })})
}))


router.get("/logout",isLoggedIn,wrapAsync(async(req,res)=>{
    req.logout((err)=>{
    if(err)return next(err)
    res.json({
        message:"Logged Out Successfully"
    })
    })
}))

module.exports=router;
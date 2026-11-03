const express=require("express");
const router=express.Router();
const wrapAsync=require("../utils/wrapAsync");
const User=require("../models/User");
const passport=require("passport");
const generateOtp=require("../utils/generateOtp");
const { sendOtpEmail } = require("../controllers/SendEmail");
const {
    checkUniversityMail,
    isLoggedIn,
    alreadyLoggedIn
} = require("../middlewares");

const publicUser = (user) => ({
    _id: user._id,
    username: user.username,
    email: user.email
});


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
                    user: publicUser(req.user)
                });
            });
        })(req, res, next);
    }
);


    

router.get("/",wrapAsync(async(req,res)=>{
    res.json({
        user:req.isAuthenticated() ? publicUser(req.user) : null
    })
}))


const otpStore = new Map();
router.post("/send-otp", async (req, res) => {
    try {
        const email = req.body.email.trim().toLowerCase();
        const user=await User.findOne({email:email});
        if(user){
             throw new Error("Email is already registered.");
        }
        const otp = generateOtp();

        otpStore.set(email, {
            otp,
            expiresAt: Date.now() + 60 * 1000
        });

        await sendOtpEmail(email, otp);

        res.json({
            message: "OTP sent successfully"
        });

    } catch (err) {
        console.error("SEND_OTP_EMAIL_FAILED:", err.code || "EMAIL_ERROR");

        res.status(500).json({
            message: err.message === "Email is already registered."
                ? err.message
                : "Unable to send verification email"
        });
    }
});

router.post("/verify-otp", wrapAsync(async (req, res) => {
    const email = req.body.email.trim().toLowerCase();
    const { otp } = req.body;
    const storedData = otpStore.get(email);
    if (!storedData) {
        return res.status(400).json({
            status: "error",
            message: "OTP not found. Please request a new code."
        });
    }
    if (Date.now() > storedData.expiresAt) {
        otpStore.delete(email);

        return res.status(400).json({
            status: "error",
            message: "OTP expired. Please request a new code."
        });
    }
    if (storedData.otp !== otp) {
        return res.status(400).json({
            status: "error",
            message: "Invalid OTP."
        });
    }
    otpStore.delete(email);
    res.json({
        status: "success",
        message: "Email verified successfully."
    });
}));

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
        message:"Signup Successfully",
        user:{
            _id:req.user._id,
            username:req.user.username,
            email:req.user.email
        }
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
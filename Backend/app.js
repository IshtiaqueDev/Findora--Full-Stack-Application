if (process.env.NODE_ENV !== "production") {
  require("dotenv").config();
}
const express=require("express");
const app=express();
const db=require("./config/db.js");
const UserRoute=require("./routes/User.js");
const User=require("./models/User.js");
const session=require("express-session");
const passport=require("passport");
const LocalStrategy=require("passport-local");
const ItemRoute=require("./routes/Items.js");
const sendOtpEmail=require("./controllers/SendEmail.js");
const cors=require("cors");
const port=5000;

app.use(cors({
    origin:["http://localhost:5000","http://localhost:5173"],
    credentials:true,
}))

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(session({
    secret:"supersecretkeyoflostlinkproject",
    saveUninitialized:true,
    resave:false,
    cookie:{
        expires:Date.now()+1000*60*60*24*3,
        maxAge:1000*60*60*24*3,
        httpOnly:true
    }
}))

app.use(passport.initialize());
app.use(passport.session());
passport.use(new LocalStrategy(User.authenticate()));

passport.serializeUser(User.serializeUser());
passport.deserializeUser(User.deserializeUser());

app.use("/user",UserRoute);
app.use("/item",ItemRoute);

app.use((err,req,res,next)=>{
    return res.status(500).json({err:err.message||"Internal Server Error"})
})

app.listen(port,"0.0.0.0",(req,res)=>{
    console.log("Server is Listening....");
})
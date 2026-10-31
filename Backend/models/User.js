const mongoose=require("mongoose");
const passportLocalMongoose=require("passport-local-mongoose").default;

let userSchema=new mongoose.Schema({
    email:{
        type:String,
        required:true
    },isVerified: {
            type: Boolean,
             default: false
    },

    otpHash: {
            type: String
    },

    otpExpiresAt: {
            type: Date  
        }
})


userSchema.plugin(passportLocalMongoose);
let User=mongoose.model("User",userSchema);

module.exports=User;
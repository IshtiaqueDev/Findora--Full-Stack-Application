const mongoose=require("mongoose");

let itemSchema=new mongoose.Schema({
    name:{
        type:String,
        required:true
    },description:{
        type:String,
        required:true
    },category:{
        type:String,
        required:true,
        enum:["Laptop", "Mobile", "Books", "Accessories", "Other"]
    },color:{
        type:String,
        required:true
    },location:{
        type:String,
        required:true
    },type:{
        type:String,
        required:true,
        enum: {
            values:["lost", "found"],
            message:"Invalid Response"
        }
    },
    status:{
        type:String,
        required:true,
        default:"active",
        enum:["resolved","active"]
    },date:{
        type:Date,
        default:Date.now()
    },postedBy:{
        type:mongoose.Schema.Types.ObjectId,
        ref:"User",
        required:true
    },imageUrl:{
        type:String,
        required:true
    }
})


let Item=mongoose.model("Item",itemSchema);


module.exports=Item;

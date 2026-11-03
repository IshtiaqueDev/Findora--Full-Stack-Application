const mongoose=require("mongoose");

async function main(){
    await mongoose.connect(process.env.MONGO_URI || "mongodb://127.0.0.1:27017/LostLink");
}

main().then(()=>{
    console.log("Database Connected Successfully...");
}).catch((err)=>{
    console.log(err);
})

module.exports=main;
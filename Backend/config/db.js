const mongoose=require("mongoose");

async function main(){
    const mongoUrl = process.env.MONGO_URL || process.env.MONGO_URI;
    if (!mongoUrl) {
        throw new Error("MongoDB connection string is not configured");
    }
    await mongoose.connect(mongoUrl);
}

main().then(()=>{
    console.log("Database Connected Successfully...");
}).catch((err)=>{
    console.log(err);
})

module.exports=main;
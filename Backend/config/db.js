const mongoose=require("mongoose");

async function main(){
    await mongoose.connect(process.env.MONGO_URL);
}

main().then(()=>{
    console.log("Database Connected Successfully...");
}).catch((err)=>{
    console.log(err);
})

module.exports=main;
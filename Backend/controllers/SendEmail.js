const path = require("path");
require("dotenv").config({
    path: path.join(__dirname, "../.env")
});

const nodemailer = require("nodemailer");

console.log("Email:", process.env.USEREMAIL);
console.log("Password loaded:", !!process.env.PASSWORD);


const sendOtpEmail=async(email,otp)=>{
    const transporter=nodemailer.createTransport({
        host: "smtp.gmail.com",
        port: 587,
        secure: false, // use STARTTLS (upgrade connection to TLS after connecting)
        auth: {
        user: process.env.USEREMAIL,
        pass: process.env.PASSWORD,
  },
})


    const info = await transporter.sendMail({
    from: process.env.USEREMAIL,
    to: email,
    subject: "Findora - Email Verification OTP",
    text: `Your Findora verification OTP is: ${otp}. It expires in 5 minutes. <i>Note: Never Share your Otp with anyone.</i><br>
    <b>For More Info Contact Us</b>`,
});

return info;

}

module.exports={
    sendOtpEmail
}
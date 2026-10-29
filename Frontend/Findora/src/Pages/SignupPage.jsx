import { useState } from "react";

function SignupPage(){
    const[formData,setFormData]=useState({
        username:"",
        email:"",
        password:"",
    })
    return(
        <>
        <h1>Signup Page</h1>
        <form action="">
            <label htmlFor="">Enter Your Username:</label>
            <input type="text" placeholder="Enter Your Username" required/> <br /><br />

            <div>
            <label htmlFor="">Enter Your Email:</label>
            <input type="text" placeholder="Enter Your Username" required/> 
            <a href="">Send Code</a>
            </div>
            <br />
            <label htmlFor="">Enter OTP :</label>
            <input type="text" placeholder="Enter OTP for verification" required/>
            <br /> <br />

            <label htmlFor="">Enter Your Password:</label>
            <input type="text" placeholder="Enter Your Username" required/>
            <br /> <br />
            <button>Signup</button>
            <br /> <br />
            <span>Already SignUp? <a href="/">Login Here</a></span>
        </form>
        </>
    )
}

export default SignupPage;
import { useState } from "react";
import {toast} from "react-toastify"
import axios from 'axios'

function LoginPage(){
    const[formData,setFormData]=useState({
        username:"",
        password:""
    });

    const onChange=(e)=>{
        console.log(e.target.value)
        setFormData((prevData)=>({
            ...prevData,
            [e.target.name]:e.target.value
        }))
    }

    const handleSubmit=async(e)=>{
        e.preventDefault();
        try{
            let response=await axios.post("http://localhost:5000/user/login",formData,{
                withCredentials:true
            })
            toast.success("LoggedIn Successfully!");
            console.log(response);
        }catch(err){
              toast.error(
            err.response?.data?.message || err.message
            );
        }
    }

    return(
        <>
        <h1>Login Page</h1>
        <form action="" onSubmit={handleSubmit}>
        <label htmlFor="">Username: </label>
        <input type="text" name="username" id="" placeholder="Enter Your Username" required value={formData.username} onChange={onChange}/><br /><br />
        <label htmlFor="">Password: </label>
        <input type="password" name="password" id="" placeholder="Enter Your Password" required value={formData.password} onChange={onChange}/><br />
        <button>Submit</button>
        </form>
        <p>Not SignedIn?<a href="/signup">SignupHere</a></p>
        </>
    )
}

export default LoginPage;
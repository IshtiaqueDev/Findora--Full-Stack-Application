import { useContext, useEffect, useState } from "react";
import {toast} from "react-toastify"
import axios from 'axios'
import {useNavigate} from "react-router-dom"
import { UserContext } from "../context/UserProvider";

function LoginPage(){
    const navigate=useNavigate();
    const {user,setUser}=useContext(UserContext);

    useEffect(() => {
    if (user) {
        navigate("/home", { replace: true });
    }
}, [user, navigate]);


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
            toast.success(response.data.message)
            setUser(response.data.user);
            return navigate("/home");
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
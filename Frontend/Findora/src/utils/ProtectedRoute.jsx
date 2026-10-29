import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import Loader from "../components/Loader";
import { useNavigate } from "react-router-dom";

function ProtectedRoute(){
    const navigate=useNavigate();
    const[userStatus,setUserStatus]=useState(null);

    useEffect(()=>{
        getUser();
    },[]);

    const getUser=async function checkUser(){
        try{   
            let response=await axios.get("http://localhost:5000/user",{
                withCredentials:true
            });
        setUserStatus(Boolean(response.data.user));
            
        }catch(err){
            setUserStatus(false);
            return toast.error(err.message);
        }
    }

    useEffect(() => {
    if (userStatus === false) {
        toast.error("Please Login First");
        navigate("/");
    }
}, [userStatus, navigate]);

if(userStatus==null) return <Loader/>

    
}

export default ProtectedRoute;
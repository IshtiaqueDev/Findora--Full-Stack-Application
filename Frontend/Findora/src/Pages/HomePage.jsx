import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import { Outlet, useNavigate } from "react-router-dom";
import Items from "../components/Items";
import HeroSection from "../components/HeroSection";
import Navbar from "../components/Navbar";
import ReportForm from "../components/ReportForm"

function HomePage(){
    const{user,loading,setUser}=useContext(UserContext);
    const navigate=useNavigate();
    if(loading) return <Loader/>

    const handleLogout=async()=>{
        try{
        let response=await axios.get("http://localhost:5000/user/logout",{
            withCredentials:true
        })  
        toast.success(response.data.message);
        navigate("/");
        return setUser(null);

        }catch(err){
            return toast.error(err.message);
        }
    }

    return( 
        <>
       <Navbar user={user} onLogout={handleLogout} />
        <HeroSection/>
        <ReportForm/>
        </>
    )
}

export default HomePage;
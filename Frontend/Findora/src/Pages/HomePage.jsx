import { useContext } from "react";
import { UserContext } from "../context/UserProvider";
import Loader from "../components/Loader";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Items from "../components/Items";

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
        <h1>HomePage</h1>
        <h3>Welcome: {user.username}</h3>
        <h5>Email: {user.email}</h5>      
        <hr />
        <button>Item + </button>
        <br/><br/>
        <h3>All Items</h3>
        <Items/>   
        <br /><br />
        <button onClick={handleLogout}>Logout</button>
        </>
    )
}

export default HomePage;
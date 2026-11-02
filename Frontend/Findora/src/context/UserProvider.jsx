import { createContext, useEffect, useState } from "react";
import { toast } from "react-toastify";
import { useNavigate } from "react-router-dom";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const navigate=useNavigate();

    const getUser = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/user",
                { withCredentials: true }
            );
            setUser(response.data.user);

        } catch (err) {
            console.log("ERROR:", err.message);
            setUser(null);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        getUser();
    }, []);

    useEffect(() => {
        console.log("STATE UPDATED:", user);
    }, [user]);



     const handleLogout=async()=>{
        try{
        let response=await axios.get("http://localhost:5000/user/logout",{
            withCredentials:true
        })  
        setUser(null);
        toast.success(response.data.message);
        navigate("/",{replace:true});

        }catch(err){
            return toast.error(err.message);
        }
    }

    return (
        <UserContext.Provider
            value={{ user, setUser, getUser, loading ,handleLogout}}
        >
            {children}
        </UserContext.Provider>
    );
};
import { createContext, useEffect, useState } from "react";
import axios from "axios";

export const UserContext = createContext();

export const UserProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    const getUser = async () => {
        try {
            const response = await axios.get(
                "http://localhost:5000/user",
                { withCredentials: true }
            );

            console.log("API DATA:", response.data.user);

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

    return (
        <UserContext.Provider
            value={{ user, setUser, getUser, loading }}
        >
            {children}
        </UserContext.Provider>
    );
};
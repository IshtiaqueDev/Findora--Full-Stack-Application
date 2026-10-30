
import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { UserContext } from "../context/UserProvider";
import Loader from "../components/Loader";
import HomePage from "../Pages/HomePage";

function ProtectedRoute({children}) {
    const { user, loading } = useContext(UserContext);

    if (loading) {
        return <Loader />;
    }

    if (!user) {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default ProtectedRoute;

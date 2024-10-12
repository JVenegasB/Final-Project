import {Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [loggedUser,] = useUserContext();
    if (!loggedUser) {
        return (
            <Navigate to="/login" />
        );
    }

    return children;
};

export default ProtectedRoute   
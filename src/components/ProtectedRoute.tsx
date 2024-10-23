import {Navigate } from "react-router-dom";
import { useUserContext } from "../context/userContext";
import { useEffect } from "react";


const ProtectedRoute = ({ children }: { children: JSX.Element }) => {
    const [loggedUser,] = useUserContext();
    useEffect(() => {
        console.log('ProtectedRoute', loggedUser);
    }, [loggedUser]);
    if (!loggedUser) {
        return (
            <Navigate to="/login" />
        );
    }

    return children;
};

export default ProtectedRoute   
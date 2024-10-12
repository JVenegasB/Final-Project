import { createContext, useContext } from "react";
import { user } from "../types/types";

type UserContextType = [user | null, (user: user | null) => void];

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined) {
        throw new Error("useUserContext must be used within a UserProvider");
    }
    return context;
};


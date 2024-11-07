import { createContext,useContext } from "react";

type LoggedUserType = {
    user_id: string;
    email: string;
    name: string;
    phone: string;
    role: string;
}

type UserContextType = [
    loggedUser: LoggedUserType | null,
    setLoggedUserData: (loggedUser: LoggedUserType | null) => void
]

export const UserContext = createContext<UserContextType | undefined>(undefined);

export const useUserContext = () => {
    const context = useContext(UserContext);
    if (context === undefined || context === null) {
        throw new Error(
            "useUserContext must be used within a UserProvider",
        );
    }
    return context;
}
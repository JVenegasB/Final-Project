import { createContext, useContext } from "react";

type IsLoading = [
    isLoading: boolean | null,
    setIsLoading: (isLoading: boolean | null) => void
]
export const loadingIncEvHistContext = createContext<IsLoading | undefined>(undefined);

export const useLoadingIncEvHistContext= () => {
    const context = useContext(loadingIncEvHistContext);
    if (context ===   undefined || context === null){
        throw new Error(
            "useLoadingHistContext must be used within a ContextProvider",
        );
    }
    return context;
}
import { createContext, useContext } from "react";

type IsLoading = [
    isLoading: boolean | null,
    setIsLoading: (isLoading: boolean | null) => void
]

export const loadingHistContext = createContext<IsLoading | undefined>(undefined);

export const useLoadingHistContext = () => {
    const context = useContext(loadingHistContext);
    if (context ===   undefined || context === null){
        throw new Error(
            "useLoadingHistContext must be used within a ContextProvider",
        );
    }
    return context;
}
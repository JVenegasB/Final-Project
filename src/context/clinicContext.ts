import { createContext, useContext } from "react";
type ClinicType = {
    id: number;
    name: string;
    unique_code: string;
    address: string;
    description: string;
    phone: string;
}
type ClinicContextType =[
    clinic: ClinicType | null,
    setClinicData: (clinic: ClinicType | null) => void
]

export const ClinicContext = createContext<ClinicContextType | undefined>(undefined);

export const useClinicContext = () => {
    const context = useContext(ClinicContext);
    if (context === undefined) {
        throw new Error(
            "useClinicContext must be used within a ClinicProvider",
        );
    }
    return context;
};

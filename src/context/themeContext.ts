import { createContext, useContext } from "react";

interface ThemeContextType {
    isDarkMode: boolean;
    setIsDarkMode: (isDark: boolean) => void; // Función para alternar el modo
  }

export const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export const useThemeContext = () => {
    const context = useContext(ThemeContext);
    if (context === undefined) {
        throw new Error("theme context error");
    }
    return context;
};

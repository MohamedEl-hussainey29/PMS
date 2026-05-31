import { createContext, useEffect, useState, type ReactNode } from "react";

interface ThemeContextType {
  darkMode: boolean;
  setDarkMode: React.Dispatch<React.SetStateAction<boolean>>;
}
interface ThemeProviderProps {
  children: ReactNode;
}

export const ThemeContext = createContext<ThemeContextType | null>(null);

export default function ThemeContextProvider ({children}:ThemeProviderProps) {

    const [darkMode, setDarkMode] = useState<boolean>(() => {
        return localStorage.getItem('theme') === 'dark';
    });

    useEffect(() => {
        if(darkMode){
           document.documentElement.classList.add('dark');
           localStorage.setItem('theme', 'dark');
        }
        else{
            document.documentElement.classList.remove('dark');
           localStorage.setItem('theme', 'light');
        }
    }, [darkMode])
    
    return (
        <ThemeContext.Provider value={{darkMode, setDarkMode}}>
            {children}
        </ThemeContext.Provider>
    )
}
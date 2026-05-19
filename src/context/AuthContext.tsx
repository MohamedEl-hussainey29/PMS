/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */

import { jwtDecode } from "jwt-decode";
import { createContext, useEffect, useState, type Dispatch, type ReactNode, type SetStateAction } from "react";


interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userGroup: string;
}

interface AuthContextInterface{
    userData: User | null;
    setUserData: Dispatch<SetStateAction<User | null>>;
    saveUserData: ()=> void
}

interface AuthContextProviderProps{
    children: ReactNode;
}

export const AuthContext = createContext<AuthContextInterface | null>(null)

export default function AuthContextProvider({children}:AuthContextProviderProps){
    const [userData , setUserData] = useState<User|null>(null)

    const saveUserData = ()=>{
        const encodedToken = localStorage.getItem('token')
        if(encodedToken){
            const decodedToken = jwtDecode<User>(encodedToken)
            setUserData(decodedToken)
        }
    }

    //refresh
    useEffect(()=>{
        if(localStorage.getItem('token')){
            saveUserData()
        }
    },[])

    return(
        <AuthContext.Provider value={{userData,setUserData , saveUserData}}>{children}</AuthContext.Provider>
    )
}
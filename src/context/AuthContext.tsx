/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable react-refresh/only-export-components */

import { jwtDecode } from "jwt-decode";
import {
  createContext,
  useEffect,
  useState,
  type Dispatch,
  type ReactNode,
  type SetStateAction,
} from "react";
import { getCurrentUser } from "../api/modules/users";

interface User {
  userId: number;
  userName: string;
  userEmail: string;
  userGroup: string;

  imagePath?: string;
  country?: string;
  phoneNumber?: string;
}

interface AuthContextInterface {
  userData: User | null;
  setUserData: Dispatch<SetStateAction<User | null>>;
  saveUserData: () => void;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [userData, setUserData] = useState<User | null>(null);

  const saveUserData = async () => {
    const encodedToken = localStorage.getItem("token");
    if (encodedToken) {
      try {
        const decodedToken = jwtDecode<User>(encodedToken);
      const response = await getCurrentUser();
      console.log("CURRENT USER =>", response.data);
      const currentUser = response.data;
      setUserData({
        ...decodedToken,
        imagePath: currentUser.imagePath
          ? `https://upskilling-egypt.com:3003/${currentUser.imagePath.replace(
              /\\/g,
              "/",
            )}`
          : "",
        country: currentUser.country,
        phoneNumber: currentUser.phoneNumber,
      });
      } catch (error) {
        console.log(error);  
      }
    }
  };

  //refresh
  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData, saveUserData }}>
      {children}
    </AuthContext.Provider>
  );
}

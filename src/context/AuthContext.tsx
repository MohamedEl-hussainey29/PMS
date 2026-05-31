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
  isLoading: boolean;
}

interface AuthContextProviderProps {
  children: ReactNode;
}

export const AuthContext = createContext<AuthContextInterface | null>(null);

export default function AuthContextProvider({
  children,
}: AuthContextProviderProps) {
  const [userData, setUserData] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const saveUserData = async () => {
    const encodedToken = localStorage.getItem("token");
    if (!encodedToken) {
      setIsLoading(false);
      return;
    }
    try {
      const decodedToken = jwtDecode<User>(encodedToken);
      const response = await getCurrentUser();
      const currentUser = response.data;
      setUserData({
        ...decodedToken,
        imagePath: currentUser.imagePath
          ? `https://upskilling-egypt.com:3003/${currentUser.imagePath.replace(
              /\\/g,
              "/"
            )}`
          : "",
        country: currentUser.country,
        phoneNumber: currentUser.phoneNumber,
      });
    } catch (error) {
      console.log(error);
    } finally {
      setIsLoading(false);
    }
  };

  //refresh
  useEffect(() => {
    if (localStorage.getItem("token")) {
      saveUserData();
    }
  }, []);

  return (
    <AuthContext.Provider value={{ userData, setUserData, saveUserData,isLoading }}>
      {children}
    </AuthContext.Provider>
  );
}

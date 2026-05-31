/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { Navigate } from "react-router-dom";
import Spinner from "../Spinner/Spinner";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "Manager" | "Employee";
}

export default function ProtectedRoute({children , role}: ProtectedRouteProps) {
  const { userData, isLoading }: any = useContext(AuthContext);
  const userRole = userData?.userGroup;
  const token = localStorage.getItem("token");

  if(isLoading){
    return <Spinner/>;
  }
  if (!token && !userData) {
    return <Navigate to={"/"} />;
  }

  if (role && userRole !== role) {
    return <Navigate to={"/dashboard"} />;
  }

  return children;
}

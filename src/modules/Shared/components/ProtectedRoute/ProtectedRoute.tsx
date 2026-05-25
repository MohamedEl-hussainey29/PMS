/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import type { ReactNode } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: ReactNode;
  role?: "Manager" | "Employee";
}

export default function ProtectedRoute({children , role}: ProtectedRouteProps) {
  const { userData }: any = useContext(AuthContext);
  const userRole = userData?.userGroup;
  const token = localStorage.getItem("token");

  if (!token && !userData) {
    return <Navigate to={"/"} />;
  }

  if (role && userRole !== role) {
    return <Navigate to={"/dashboard"} />;
  }

  return children;
}
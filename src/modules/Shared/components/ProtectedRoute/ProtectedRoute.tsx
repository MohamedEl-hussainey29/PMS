/* eslint-disable @typescript-eslint/no-explicit-any */
import { useContext } from "react";
import { AuthContext } from "../../../../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute(props:any) {
  const {userData}:any = useContext(AuthContext)

  if(localStorage.getItem('token') || userData){
    return props.children
  }else{
    return <Navigate to={'/'}/>
  }
}

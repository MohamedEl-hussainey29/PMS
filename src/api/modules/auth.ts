import type { LoginFormValues } from "../../modules/Authentication/components/Login/Login"
import type { VerifyFormValues } from "../../modules/Authentication/components/VerifyAccount/VerifyAccount"
import axiosClient from "../axiosClient"

export const Login = (data:LoginFormValues)=>{
    return axiosClient.post('/users/login' , data)
}

export const VerifyAccount = (data:VerifyFormValues)=>{
    return axiosClient.put('/users/verify' , data)
}
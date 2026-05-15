import type { ChangePassFormValues } from "../../modules/Authentication/components/ChangePassword/ChangePassword"
import type { LoginFormValues } from "../../modules/Authentication/components/Login/Login"
import type { VerifyFormValues } from "../../modules/Authentication/components/VerifyAccount/VerifyAccount"
import axiosClient from "../axiosClient"

export const Login = (data:LoginFormValues)=>{
    return axiosClient.post('/users/login' , data)
}
export const changePassword = (data:ChangePassFormValues)=>{
    return axiosClient.put('/users/ChangePassword' , data)
}

export const VerifyAccount = (data:VerifyFormValues)=>{
    return axiosClient.put('/users/verify' , data)
}
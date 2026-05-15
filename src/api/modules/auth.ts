import type { VerifyFormValues } from "../../modules/Authentication/components/VerifyAccount/VerifyAccount"
import axiosClient from "../axiosClient"


export const VerifyAccount = (data:VerifyFormValues)=>{
    return axiosClient.put('/users/verify' , data)
}
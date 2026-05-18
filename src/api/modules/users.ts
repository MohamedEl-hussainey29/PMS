import axiosClient from "../axiosClient"

export const GetEmployees = ()=>{
    return axiosClient.get('/Users/');
}
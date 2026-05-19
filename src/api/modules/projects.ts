import axiosClient from "../axiosClient";

export const GetProjectsByManager = ()=>{
    return axiosClient.get('/project/manager');
}
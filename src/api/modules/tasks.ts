
import type { TasksFormValues } from "../../modules/Tasks/components/TaskData";
import axiosClient from "../axiosClient";

export const CreateTask = (data:TasksFormValues)=>{
    return axiosClient.post('/task',data);
}

export const GetTaskById = (id:number)=>{
    return axiosClient.get(`/task/${id}`);
}

export const UpdateTask = (id:number,data:TasksFormValues)=>{
    return axiosClient.put(`/task/${id}`,data);
}

export const getTasksCount = () => {
    return axiosClient.get('/Task/count');
}
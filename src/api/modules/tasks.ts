
import type { TasksFormValues } from "../../modules/Tasks/components/TaskData";
import axiosClient from "../axiosClient";

interface PaginationParams {
  page: number;
  size: number;
}

export const CreateTask = (data:TasksFormValues)=>{
    return axiosClient.post('/task',data);
}

export const GetTaskById = (id:number)=>{
    return axiosClient.get(`/task/${id}`);
}

export const GetTasksByManager = (params?: PaginationParams) => {
  return axiosClient.get('/task/manager', {
    params: {
      pageNumber: params?.page, 
      pageSize: params?.size    
    }
  });
};

export const UpdateTask = (id:number,data:TasksFormValues)=>{
    return axiosClient.put(`/task/${id}`,data);
}

export const getTasksCount = () => {
    return axiosClient.get('/Task/count');
}

export const DeleteTaskById = (id:number) => {
    return axiosClient.delete(`/Task/${id}`);
}
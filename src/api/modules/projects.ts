import axiosClient from "../axiosClient";

interface PaginationParams {
  page: number;
  size: number;
}

export const GetProjectsByManager = (params?: PaginationParams) => {
  return axiosClient.get('/project/manager', {
    params: {
      pageNumber: params?.page, 
      pageSize: params?.size    
    }
  });
};

export const DeleteProjectById = (id:number) => {
    return axiosClient.delete(`/project/${id}`);
}
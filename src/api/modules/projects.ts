import type { ProjectsFormValues } from "../../modules/Projects/components/ProjectData";
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

export const GetProjectsByEmployee = (params?: PaginationParams) => {
  return axiosClient.get('/project/employee', {
    params: {
      pageNumber: params?.page,
      pageSize: params?.size
    }
  });
};

export const DeleteProjectById = (id: number) => {
  return axiosClient.delete(`/project/${id}`);
}
export const CreateProject = (data: ProjectsFormValues) => {
  return axiosClient.post('/project', data);
}

export const GetProjectById = (id: number) => {
  return axiosClient.get(`/Project/${id}`);
}

export const UpdateProject = (id: number, data: ProjectsFormValues) => {
  return axiosClient.put(`/Project/${id}`, data);
}
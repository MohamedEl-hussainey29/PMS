
import axiosClient from "../axiosClient"

interface PaginationParams {
  page: number;
  size: number;
}

export const GetEmployeesByManager = (params?: PaginationParams) => {
  return axiosClient.get('/Users/manager', {
    params: {
      pageNumber: params?.page, 
      pageSize: params?.size    
    }
  });
};

export const ToggleActivate = (id:number)=>{
    return axiosClient.put(`/Users/${id}`);
}
    
export const getUsersCount = () => {
    return axiosClient.get('/Users/count');    
}

export const getCurrentUser = () => {
    return axiosClient.get('Users/currentUser');    
}
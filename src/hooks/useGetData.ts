/* eslint-disable react-hooks/set-state-in-effect */
/* eslint-disable @typescript-eslint/no-explicit-any */
/* eslint-disable react-hooks/exhaustive-deps */
import { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";

export default function useGetData<T>(
  apiFunction: () => Promise<AxiosResponse<T>>,
  dependencies: any[] = []
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getData = async () => {
    setIsLoading(true);
    try {
      const response = await apiFunction();
      setData(response.data); 
      
      setError("");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Something went wrong");
      } else {
        setError("Something went wrong");
      }
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    getData();
  }, dependencies);

  return {
    data,
    isLoading,
    error,
    refetch: getData,
  };
}
/* eslint-disable react-hooks/set-state-in-effect */
import { useEffect, useState } from "react";
import axios from "axios";
import type { AxiosResponse } from "axios";

export default function useGetData<T>(
  apiFunction: () => Promise<AxiosResponse<{ data: T }>>
) {
  const [data, setData] = useState<T | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  const getData = async () => {
    setIsLoading(true);

    try {
      const response = await apiFunction();

      setData(response.data.data);

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
  }, []);

  return {
    data,
    isLoading,
    error,
    refetch: getData,
  };
}
import { QueryClient } from "@tanstack/react-query";
import axios, {
  AxiosError,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from "axios";
import { getUserToken } from "../../utils/auth/cookie-utils";

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const axiosInstance = <T>(config: AxiosRequestConfig): Promise<T> => {
  const source = axios.CancelToken.source();
  const promise = client({
    ...config,
    cancelToken: source.token,
  }).then((response: AxiosResponse) => response.data);

  (promise as Promise<T> & { cancel?: () => void }).cancel = () => {
    source.cancel("Query was cancelled");
  };

  return promise;
};

export const client = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

client.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = getUserToken();
    if (token) {
      config.headers.Authorization = `Token ${token}`;
    }
    return config;
  },
  (error: unknown) => {
    return Promise.reject(error);
  },
);

client.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    return Promise.reject(error);
  },
);

export const queryClient = new QueryClient();

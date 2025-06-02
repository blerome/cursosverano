import { AxiosRequestConfig, AxiosResponse } from 'axios';
import { axiosInstance } from './axios.config';

interface MutatorParams extends AxiosRequestConfig {
  url: string;
  method: string;
}

export const axiosMutator = <T = any>({ url, method, ...config }: MutatorParams): Promise<AxiosResponse<T>> => {
  return axiosInstance({
    url,
    method,
    ...config,
  }) as Promise<AxiosResponse<T>>;
};

export default axiosMutator;

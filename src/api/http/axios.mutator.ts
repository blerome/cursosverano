import { AxiosRequestConfig } from 'axios';
import { axiosInstance } from './axios.config';

interface MutatorParams extends AxiosRequestConfig {
  url: string;
  method: string;
}

export const axiosMutator = ({ url, method, ...config }: MutatorParams) => {
  return axiosInstance({
    url,
    method,
    ...config,
  });
};

export default axiosMutator;

import axios from 'axios';

export const axiosInstance = axios.create();
export const axiosManualInstance = axios.create();

export function httpGet(endpoint: string, headers: any) {
  return axiosInstance.get(endpoint, headers);
}

export function httpPost(
  endpoint: string,
  payload: any,
  headers: any
) {
  return axiosInstance.post(endpoint, payload, headers);
}

export function httpPut(
  endpoint: string,
  payload: any,
  headers: any
) {
  return axiosInstance.put(endpoint, payload, headers);
}

export function httpPatch(
  endpoint: string,
  payload: any,
  headers: any
) {
  return axiosInstance.patch(endpoint, payload, headers);
}

export function httpDelete(
  endpoint: string,
  headers: any
) {
  return axiosInstance.delete(endpoint, headers);
}

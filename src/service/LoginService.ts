import axiosInstance from "./axiosInstance";
import type { AxiosResponse } from "axios";
import type { LoginRequest } from "../Interface/Login";
import { API_ENDPOINT } from "../api/apiConfig";

// LOGIN - POST to /api/account/login
export function login(obj: LoginRequest): Promise<AxiosResponse> {
    const routePath = `/api/account/login`;
    return axiosInstance.post(routePath, obj);
}

// CORP LOGIN (SSO) - Redirects to backend endpoint with full URL
export const corpLogin = (returnUrl: string = "/app"): void => {
  // Use full backend URL for the redirect (API_ENDPOINT already includes /api)
  const corpLoginUrl = `${API_ENDPOINT}/account/CorpLogin?returnUrl=${encodeURIComponent(returnUrl)}`;
  window.location.href = corpLoginUrl;
};

// REQUEST ACCESS - POST to /api/account/request-access
export function requestAccess(obj: { email: string }): Promise<AxiosResponse> {
    const routePath = `/api/account/RequestAccess`;
    return axiosInstance.post(routePath, obj);
}
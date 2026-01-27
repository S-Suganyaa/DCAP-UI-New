import axiosInstance from "./axiosInstance";
import type { AxiosResponse } from "axios";
import type { LoginRequest } from "../Interface/Login";

// LOGIN - POST to /api/account/login
export function login(obj: LoginRequest): Promise<AxiosResponse> {
    const routePath = `/api/account/login`;
    return axiosInstance.post(routePath, obj);
}


// REQUEST ACCESS - POST to /api/account/request-access
export function requestAccess(obj: { email: string }): Promise<AxiosResponse> {
    const routePath = `/api/account/RequestAccess`;
    return axiosInstance.post(routePath, obj);
}
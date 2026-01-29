import axiosInstance from "./axiosInstance";
import type { AxiosResponse } from "axios";
import type { DataSourceRequest } from "../Interface/Grading";

export function getTanks(request?: DataSourceRequest): Promise<AxiosResponse>  {
    const routePath = `/api/Tank/FilterMenuCustomization_Read`;

    const params: any = {};

    if (request) {
        if (request.sort) {
            params.sort = JSON.stringify(request.sort);
        }
        if (request.filter) {
            params.filter = JSON.stringify(request.filter);
        }
        if (request.group) {
            params.group = JSON.stringify(request.group);
        }
    }

    return axiosInstance.get(routePath, {
        params: Object.keys(params).length > 0 ? params : undefined,
        paramsSerializer: (params) => {
            const queryParts = [];
            for (const key in params) {
                if (params[key] !== null && params[key] !== undefined && params[key] !== '') {
                    queryParts.push(`${key}=${encodeURIComponent(params[key])}`);
                }
            }
            return queryParts.join('&');
        }
    });
}

import axiosInstance from "./axiosInstance";
import type { AxiosResponse } from "axios";
import type { DataSourceRequest } from "../Interface/Grading";

export function getTanks(request?: DataSourceRequest): Promise<AxiosResponse> {
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
export function GetMappedTankTypes(projectId?: number, vesselType?: string): Promise<AxiosResponse> {
    const routePath = `/api/Tank/GetMappedTankTypes`;
    return axiosInstance.get(routePath, {
        params: { projectId, vesselType }
    });
}

export type TankPayload = {
    tankId?: string | null;
    tankName: string;
    subheader: string;
    vesselType: string | null;
    vesselName?: string | null;
    imoNumber?: string | null;
    projectId?: number | null;
    projectName?: string | null;
    tankType: string;
    status: boolean;
};

export function createTank(formData: {
    tankName: string;
    subheader: string;
    vesselType: string;
    tankType: string;
    status: boolean;
}) {
    return axiosInstance.post("/api/ProjectConfig/AddNewTank", formData
    );
}

export function updateTank(
    formData: TankPayload
): Promise<AxiosResponse> {

    const routePath = `/api/ProjectConfig/EditTank`;
    return axiosInstance.post(routePath, formData);
}
// TankService.ts
export function deleteTank(
    tankId: string,
    IMO: string = "",
    ProjectId: number = 0
): Promise<any> {
    return axiosInstance.get(`api/Tank/DeleteTanks`, {
        params: {
            tankId,
            IMO,
            ProjectId
        }
    });
}

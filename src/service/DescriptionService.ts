import axiosInstance from "./axiosInstance";
import type { AxiosResponse } from "axios";
import type { ImageDescriptions, ImageDescriptionViewModel } from "../Interface/Description";
import type { DataSourceRequest } from "../Interface/Grading";

// Get Gradings List (Grid Data) - FilterMenuCustomization_Read
export function getDescriptions(request?: DataSourceRequest): Promise<AxiosResponse> {
    const routePath = `/api/Description/GetAllDescription`;

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
        // Don't send page, pageSize, skip, take - we want all data
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

export function getTemplateNameFilter(): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GradingTemplateNameFilter_TemplateName`;
    return axiosInstance.get(routePath);
}

// Get Vessel Type Filter Options
export function getVesselTypeFilter(): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GradingVesselTypeFilter_VesselType`;
    return axiosInstance.get(routePath);
}

export function getSectionsByTemplateAndVessel(templateName: string, vesselType: string): Promise<AxiosResponse> {
    const routePath = `/api/Description/GetSectionNameByTemplateNameAndVesselType`;
    return axiosInstance.get(routePath, {
        params: {
            templateName,
            vesselType,
        },
    });
}



// Get Description List (Grid Load)
export function getDescriptionsManage(isActive: boolean = false,
    descriptionRestoreFilter: number = 0,
    searchDescriptionRestoreFilter: number = 0): Promise<AxiosResponse> {

    const routePath = `/api/Description/ManageDescription`;

    return axiosInstance.get(routePath, {
        params: {
            isActive,
            descriptionRestoreFilter,
            searchDescriptionRestoreFilter
        }
    });
}

// Set Manage Description Filters and get Redirect URL
export function setManageDescriptionFilters(
    request: {
        descriptionRestoreFilter: number;
        searchDescriptionRestoreFilter: number;
    }
): Promise<AxiosResponse> {

    const routePath = `/api/Description/manage-description-redirect`;

    return axiosInstance.post(routePath, request);
}

// Add New Description
// export function addDescription(model: boolean): Promise<AxiosResponse> {
//     const routePath = `/api/Description/AddNewDescription`;
//     return axiosInstance.post(routePath, model);
// }


export function addNewDescription(model: ImageDescriptionViewModel): Promise<AxiosResponse> {
    const routePath = `/api/Description/AddNewDescription`;

    return axiosInstance.post(routePath, model);
}

//Edit Existing Description
export function editDescription(model: ImageDescriptionViewModel): Promise<AxiosResponse> {
    const routePath = `/api/Description/EditDescription`;
    return axiosInstance.put(routePath, model);
}

// Get Edit Description Form Data
export function getEditDescriptionById(formData: {
    descriptionId: number;
    sectionId: string;
    tanktypeId?: number | undefined;

}): Promise<AxiosResponse> {
    const routePath = `/api/Description/EditDescriptionById`;
    return axiosInstance.get(routePath, formData);

}


export interface UpdateDescriptionRequest {
    vesselType: string;
    templateName: string;
    sectionId: string;
    descriptionName: string;
    status: boolean;
}

export function updateDescription(payload: UpdateDescriptionRequest): Promise<AxiosResponse> {
    const routePath = `/api/Description/UpdateImageDescription`;
    return axiosInstance.post(routePath, payload);
}



// Get Vessel Type Filter Options for Description
export function getDescriptionVesselTypeFilter(): Promise<AxiosResponse> {
    const routePath = `/api/Description/DescriptionVesselTypeFilter`;
    return axiosInstance.get(routePath);
}







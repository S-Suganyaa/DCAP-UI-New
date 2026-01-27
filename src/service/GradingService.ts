import axiosInstance from "./axiosInstance";
import type { AxiosResponse } from "axios";
import type { DataSourceRequest } from "../Interface/Grading";

// Get Gradings List (Grid Data) - FilterMenuCustomization_Read
export function getGradings(request?: DataSourceRequest): Promise<AxiosResponse> {
    const routePath = `/api/Grading/FilterMenuCustomization_Read`;

    // Don't send pagination params - fetch all data
    // Only send if explicitly requested
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
// Delete Grading - POST
export function deleteGrading(gradingId: number, tankId: number): Promise<AxiosResponse> {
    const routePath = `/api/ProjectConfig/DeleteGrading`;
    return axiosInstance.post(routePath, { gradingId, tankId });
}

// ==================== Filter Dropdown APIs ====================

// Get Vessel Type Filter Options
export function getVesselTypeFilter(): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GradingVesselTypeFilter_VesselType`;
    return axiosInstance.get(routePath);
}

// Get Template Name Filter Options
export function getTemplateNameFilter(): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GradingTemplateNameFilter_TemplateName`;
    return axiosInstance.get(routePath);
}

// Get Section Name Filter Options
export function getSectionNameFilter(): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GradingSectionNameFilter_SectionName`;
    return axiosInstance.get(routePath);
}

// Get Grading Name Filter Options
export function getGradingNameFilter(): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GradingNameFilter_GradingName`;
    return axiosInstance.get(routePath);
}

// ==================== Grading Form APIs (from previous question) ====================

// Get Vessel Types
export function getVesselType(): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GetVesselType`;
    return axiosInstance.get(routePath);
}

// Get Template Names by Vessel Type
export function getTemplateName(vesselType?: string): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GetTemplateName`;
    return axiosInstance.get(routePath, {
        params: { vesselType }
    });
}

// Get Section Names by Template Name and Vessel Type
export function getSectionNameByTemplateNameAndVesselType(templateName: string, vesselType: string): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GetSectionNameByTemplateNameAndVesselType`;
    return axiosInstance.get(routePath, {
        params: { templateName, vesselType }
    });
}

// Get Section Names by Template ID and Vessel Type
export function getSectionName(templateId: number, vesselType: string): Promise<AxiosResponse> {
    const routePath = `/api/Grading/GetSectionName`;
    return axiosInstance.get(routePath, {
        params: { templateId, vesselType }
    });
}

// Navigate to Edit Grading page
export const navigateToEditGrading = (gradingId: number, sectionId: number, tankTypeId: number): void => {
    window.location.href = `/app/Configuration/EditGradingById?gradingId=${gradingId}&SectionId=${sectionId}&TankTypeId=${tankTypeId}`;
};
import axios, { type AxiosInstance, type InternalAxiosRequestConfig, type AxiosResponse, type AxiosError } from "axios";
import initializeMsal from "../msalInstance";
import type { IPublicClientApplication, AccountInfo, SilentRequest, PopupRequest } from "@azure/msal-browser";
import { API_BASE_URL } from "../api/apiConfig";

interface AppConfig {
  azureAdConfig: {
    scopes?: string[];
    [key: string]: any;
  };
  azureAdMsalConfig?: {
    scopes?: string[];
    [key: string]: any;
  };
}

interface ConfigModule {
  default: AppConfig;
}

// Use API_BASE_URL from apiConfig instead of env variables
// Create Axios instance with correct base URL
const axiosInstance: AxiosInstance = axios.create({
    baseURL: API_BASE_URL, // Use API_BASE_URL (https://localhost:44303)
    headers: {
        Accept: "application/json",
        "Content-Type": "application/json",
    },
});

// Function to renew token using MSAL
const renewToken = async (): Promise<string | null> => {
    try {
        const msalInstance: IPublicClientApplication = await initializeMsal();
        const accounts: AccountInfo[] = msalInstance.getAllAccounts();
        
        if (accounts.length === 0) {
            return null;
        }

        const environment: string = import.meta.env.VITE_APP_ENV || 
                                    import.meta.env.REACT_APP_ENV || 
                                    "local";
        const authConfig: string | null = localStorage.getItem("authConfig");

        let tokenRequest: SilentRequest;

        if (environment === "local") {
            const config = await import(`../config.${environment}.json`) as ConfigModule;
            const scopes: string[] = authConfig === "internal"
                ? (config.default.azureAdConfig.scopes || ["openid", "profile", "email"])
                : ["https://ABSAuthUAT.onmicrosoft.com/MyAPI/access"];

            tokenRequest = {
                account: accounts[0],
                scopes,
            };
        } else {
            const proxyUrl: string = import.meta.env.VITE_APP_PROXY_URL || 
                                     import.meta.env.REACT_APP_PROXY_URL || 
                                     "";
            const res: AxiosResponse<AppConfig> = await axios.get(
                `${proxyUrl}/api/Auth/GetAuthConfig`
            );
            const scopes: string[] = authConfig === "internal"
                ? (res.data.azureAdConfig.scopes || ["openid", "profile", "email"])
                : ["https://ABSAuthUAT.onmicrosoft.com/MyAPI/access"];

            tokenRequest = {
                account: accounts[0],
                scopes,
            };
        }

        const response = await msalInstance.acquireTokenSilent(tokenRequest);
        const newToken: string | undefined = response.accessToken || response.idToken;

        if (newToken) {
            localStorage.setItem("token", newToken);
            return newToken;
        }
        return null;
    } catch (error) {
        try {
            const msalInstance: IPublicClientApplication = await initializeMsal();
            const accounts: AccountInfo[] = msalInstance.getAllAccounts();
            
            if (accounts.length === 0) {
                return null;
            }

            const tokenRequest: PopupRequest = {
                account: accounts[0],
                scopes: ["https://ABSAuthUAT.onmicrosoft.com/MyAPI/access"],
            };

            const response = await msalInstance.acquireTokenPopup(tokenRequest);
            const newToken: string | undefined = response.accessToken || response.idToken;

            if (newToken) {
                localStorage.setItem("token", newToken);
                return newToken;
            }
            return null;
        } catch (popupError) {
            console.error("Popup token acquisition error:", popupError);
            return null;
        }
    }
};

// Request Interceptor - Allow anonymous endpoints
axiosInstance.interceptors.request.use(
    async (config: InternalAxiosRequestConfig): Promise<InternalAxiosRequestConfig> => {
        // List of anonymous endpoints that don't require token
        const anonymousEndpoints = [
            "/api/account/RequestAccess",
            "/api/account/login",
            "/api/account/CorpLogin"
        ];
        
        const isAnonymousEndpoint = anonymousEndpoints.some(endpoint => 
            config.url?.includes(endpoint)
        );

        // For anonymous endpoints, skip token requirement
        if (isAnonymousEndpoint) {
            // Only add custom headers if they exist, but skip Authorization
            const ClientId: string = localStorage.getItem("ClientId") || "";
            const FleetId: string = localStorage.getItem("FleetId") || "";
            const VesselId: string = localStorage.getItem("VesselId") || "";

            if (config.headers) {
                if (ClientId) config.headers["clientId"] = ClientId;
                if (FleetId) config.headers["fleetId"] = FleetId;
                if (VesselId) config.headers["vesselId"] = VesselId;
            }
            return config;
        }

        // For authenticated endpoints, require token
        let token: string | null = null;

        if (localStorage.getItem("token")) {
            token = localStorage.getItem("token");
        } else if (localStorage.getItem("authToken")) {
            token = localStorage.getItem("authToken");
        }

        const ClientId: string = localStorage.getItem("ClientId") || "";
        const FleetId: string = localStorage.getItem("FleetId") || "";
        const VesselId: string = localStorage.getItem("VesselId") || "";

        if (!token) {
            console.log("There is no token found in local storage.");
            return Promise.reject(new Error("No token found"));
        }

        // Add custom headers
        if (config.headers) {
            config.headers["clientId"] = ClientId;
            config.headers["fleetId"] = FleetId;
            config.headers["vesselId"] = VesselId;
            config.headers["Authorization"] = `Bearer ${token}`;
        }

        return config;
    },
    (error: AxiosError) => {
        return Promise.reject(error);
    }
);

// Response Interceptor
axiosInstance.interceptors.response.use(
    (response: AxiosResponse) => response,
    async (error: AxiosError) => {
        if (error?.response && error.response.status === 401) {
            const newToken: string | null = await renewToken();

            if (newToken && error.config) {
                const config = error.config as InternalAxiosRequestConfig;
                if (config.headers) {
                    config.headers["Authorization"] = `Bearer ${newToken}`;
                }
                return axiosInstance(config);
            } else {
                try {
                    const msalInstance: IPublicClientApplication = await initializeMsal();
                    const userRole: string | null = sessionStorage.getItem("authConfig");
                    const pathname: string = userRole === "internal" ? "/internal" : "/";
                    
                    sessionStorage.clear();
                    localStorage.clear();
                    
                    const cookies: string[] = document.cookie.split(";");
                    cookies.forEach((cookie: string) => {
                        const name: string = cookie.split("=")[0].trim();
                        document.cookie = `${name}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/;`;
                    });
                    
                    await msalInstance.logoutRedirect({
                        postLogoutRedirectUri: pathname,
                    });
                } catch (logoutError) {
                    console.error("Logout error:", logoutError);
                }
            }
        }
        return Promise.reject(error);
    }
);

export default axiosInstance;
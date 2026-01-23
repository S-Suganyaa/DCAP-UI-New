import { PublicClientApplication, type Configuration, type IPublicClientApplication } from "@azure/msal-browser";
import axios, { type AxiosResponse } from "axios";

interface AppConfig {
  azureAdConfig: Configuration;
  azureAdMsalConfig?: Configuration;
}

interface ConfigModule {
  default: AppConfig;
}

const loadConfig = async (): Promise<AppConfig> => {
  try {
    const environment: string = import.meta.env.VITE_APP_ENV || import.meta.env.REACT_APP_ENV || "local";
    
    if (environment === "local") {
      const configModule = await import(`./config.${environment}.json`) as ConfigModule;
      return configModule.default;
    } else {
      const proxyUrl: string = import.meta.env.VITE_APP_PROXY_URL || import.meta.env.REACT_APP_PROXY_URL || "";
      const response: AxiosResponse<AppConfig> = await axios.get(
        `${proxyUrl}/api/Auth/GetAuthConfig`
      );
      return response.data;
    }
  } catch (error) {
    throw error;
  }
};

let msalInstance: IPublicClientApplication | null = null;

const initializeMsal = async (): Promise<IPublicClientApplication> => {
  // Return existing instance if already initialized
  if (msalInstance) {
    return msalInstance;
  }

  try {
    const currentPath: string = window.location.pathname;
    
    // Set authConfig based on current path if not already set
    const AppConfig: AppConfig = await loadConfig();

    // Choose the appropriate MSAL configuration
    const msalConfig: Configuration = AppConfig.azureAdConfig;
    msalInstance = new PublicClientApplication(msalConfig);
    await msalInstance.initialize();
  } catch (error) {
    throw error;
  }

  return msalInstance;
};

export default initializeMsal;
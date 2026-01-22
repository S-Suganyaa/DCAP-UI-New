import { PublicClientApplication, type Configuration } from "@azure/msal-browser";

export const msalConfig: Configuration = {
  auth: {
     clientId: "d8a3a596-6fcc-4047-ac76-d990b30f1bb0", // From Azure App Registration
    authority: "https://login.microsoftonline.com/d810b06c-d004-4d52-b0aa-4f3581ee7020", // Tenant ID
    redirectUri: "http://localhost:55557",
  },
  cache: {
    cacheLocation: "sessionStorage",
    storeAuthStateInCookie: false
  }
};

export const msalInstance = new PublicClientApplication(msalConfig);

export const loginRequest = {
  scopes: ["api://d8a3a596-6fcc-4047-ac76-d990b30f1bb0/access_as_user"], // API scope
};

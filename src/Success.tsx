import React, { useEffect, useState } from "react";
import { useMsal, useAccount } from "@azure/msal-react";
import type { AccountInfo } from "@azure/msal-browser";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const Success: React.FC = () => {
  const { instance } = useMsal();
  const accounts = instance.getAllAccounts();
  const account: AccountInfo | undefined = useAccount(accounts[0]) ?? undefined;
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // If no account, redirect to Project page immediately
    if (!account) {
        navigate("/app/Configuration/Managetemplate", { replace: true });
      return;
    }

    try {
      const environment: string = import.meta.env.VITE_APP_ENV || 
                                   import.meta.env.REACT_APP_ENV || 
                                   "local";
      
      if (environment === "local") {
        import(`../config.${environment}.json`).then((res: any) => {
          let tokenRequest: any = {
            account: account,
            scopes: ["https://ABSAuthUAT.onmicrosoft.com/MyAPI/access"]
          };
          acquireToken(tokenRequest);
        });
      } else {
        const proxyUrl: string = import.meta.env.VITE_APP_PROXY_URL || 
                                 import.meta.env.REACT_APP_PROXY_URL || 
                                 "";
        
        axios.get(`${proxyUrl}/api/Auth/GetAuthConfig`).then((res: any) => {
          let tokenRequest: any = {
            account: account,
            scopes: ["https://ABSAuthUAT.onmicrosoft.com/MyAPI/access"]
          };
          acquireToken(tokenRequest);
        });
      }
    } catch (error) {
      console.error("Error in Success component:", error);
      // Even on error, redirect to Project page
        navigate("/app/Configuration/Managetemplate", { replace: true });
    }

    function acquireToken(tokenRequest: any) {
      instance
        .acquireTokenSilent(tokenRequest)
        .then((response: any) => {
          // Prefer accessToken over idToken for API calls
          const token = response.accessToken || response.idToken;
          
          if (token) {
            localStorage.setItem("token", token);
            const event: any = new Event("storage");
            event.key = "token";
            event.newValue = token;
            window.dispatchEvent(event);

          }

          setIsLoading(false);
          // Navigate to Project page immediately after token is stored
            navigate("/app/Configuration/Managetemplate", { replace: true });
        })
        .catch((error: any) => {
          setIsLoading(false);
          // Even on error, redirect to Project page
            navigate("/app/Configuration/Managetemplate", { replace: true });
        });
    }
  }, [account, instance, navigate]);

  // Show loading state while processing, then redirect
  if (isLoading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <div>Loading...</div>
      </div>
    );
  }

  // This should not be visible as we redirect immediately
  return null;
};

export default Success;
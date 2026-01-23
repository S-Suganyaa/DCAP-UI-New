import React from "react";
import ReactDOM from "react-dom/client";
import { MsalProvider } from "@azure/msal-react";
import { AuthProvider } from "./context/AuthContext";
import initializeMsal from "./msalInstance";
import App from "./App";

// Initialize MSAL before rendering
(async () => {
  try {
    // Initialize MSAL and get the instance
    const msalInstance = await initializeMsal();
    
    // Handle redirect promise ONCE at app startup
    await msalInstance.handleRedirectPromise().then((response) => {
      if (response) {
        console.log("Redirect handled at app startup:", response);
      }
    }).catch((error) => {
      console.error("Error handling redirect at startup:", error);
    });

    // Render app after MSAL is initialized
    const container = document.getElementById("root");
    if (container) {
      ReactDOM.createRoot(container).render(
        <React.StrictMode>
          <MsalProvider instance={msalInstance}>
            <AuthProvider>
              <App />
            </AuthProvider>
          </MsalProvider>
        </React.StrictMode>
      );
    }
  } catch (error) {
    console.error("Failed to initialize MSAL:", error);
    // Render error state or fallback UI
    const container = document.getElementById("root");
    if (container) {
      ReactDOM.createRoot(container).render(
        <div style={{ padding: "20px", textAlign: "center" }}>
          <h1>Failed to initialize authentication</h1>
          <p>Please refresh the page or contact support.</p>
        </div>
      );
    }
  }
})();
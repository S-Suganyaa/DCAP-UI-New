// import React from "react";
// import ReactDOM from "react-dom/client";
// import { MsalProvider } from "@azure/msal-react";
// import App from "./App";
// import { msalInstance } from "./auth/Authconfig";

// ReactDOM.createRoot(document.getElementById("root")!).render(
//   <React.StrictMode>
//     <MsalProvider instance={msalInstance}>
//       <App />
//     </MsalProvider>
//   </React.StrictMode>
// );
import './polyfills'
import ReactDOM from "react-dom/client";
import { AuthProvider } from "./context/AuthContext";
import { MsalProvider } from "@azure/msal-react";
import { msalInstance } from "./auth/Authconfig";
import App from "./App";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <MsalProvider instance={msalInstance}>
    <AuthProvider>
      <App />
    </AuthProvider>
  </MsalProvider>
);


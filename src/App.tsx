import { useMsal } from "@azure/msal-react";
import { loginRequest } from "./auth/Authconfig";
import './App.css'
import  "bootstrap/dist/css/bootstrap.min.css";
 

import AppRoutes from "./routes/Approutes";

function App() {
  const { instance, accounts } = useMsal();

  const   handleLogin = async () => {
    instance.loginPopup(loginRequest).catch((e) => {
      console.error(e);
    });
  };

  const handleLogout = async () => {
    instance.logoutPopup().catch((e) => {
      console.error(e);
    });
  };

  return (
    <>
       {/* <div style={{ textAlign: "center", marginTop: "100px" }}>
      <h1>Azure Entra ID Authentication Demo</h1>
      {accounts.length > 0 ? (
        <>
          <h2>Welcome, {accounts[0].username}</h2>
          <button onClick={handleLogout}>Logout</button>
        </>
      ) : (
        <button onClick={handleLogin}>Login with Microsoft</button>
      )}
    </div>  */}
    <AppRoutes />
    </>
  )
}

export default App

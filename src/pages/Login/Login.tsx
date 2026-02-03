import React, { useState, useEffect, useRef } from "react";
import { useMsal } from "@azure/msal-react";
import { useNavigate } from "react-router-dom";
import ABSLogo from "../../assets/images/ABSLogo.svg";
import * as accountService from "../../service/LoginService";
import {
      Button,
      BUTTONS, Input,
} from 'customer_portal-ui-shared';
const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

const Login: React.FC = () => {
 const { instance, accounts } = useMsal();
 const navigate = useNavigate();
 const [email, setEmail] = useState("");
 const [password, setPassword] = useState("");
 const [rememberMe, setRememberMe] = useState(false);
 const [showPassword, setShowPassword] = useState(false);
 const [loading, setLoading] = useState(false);
 const [showerror, setShowError] = useState(false);
 const [responseMsg, setResponseMsg] = useState("");
 const hasProcessedRedirect = useRef(false);
   useEffect(() => {
    if (hasProcessedRedirect.current) return;
    
    const hasRedirectParams = window.location.hash || window.location.search.includes("code=");
    if (!hasRedirectParams) {
      return;
    }

    hasProcessedRedirect.current = true;
    
    const handleRedirect = async () => {
      try {
        const response = await instance.handleRedirectPromise();
        
        if (response && response.account) {          
          try {
            const tokenResponse = await instance.acquireTokenSilent({
              ...loginRequest,
              account: response.account,
            });

            if (tokenResponse.accessToken) {
              localStorage.setItem("token", tokenResponse.accessToken);
              localStorage.setItem("user", JSON.stringify(response.account));
              navigate("/app", { replace: true });
            }
          } catch (tokenError: any) {
            console.error("Token acquisition error:", tokenError);            
            setResponseMsg("Failed to get access token. Please try again.")
          }
        }
      } catch (error: any) {
        if (error.errorCode && error.errorCode !== "interaction_in_progress") {
          console.error("Redirect handling error:", error);
        }
      }
    };

    handleRedirect();
  }, [instance, navigate]);
const isCorpUser = (email: string): boolean => {
  return email.toLowerCase().endsWith("@eagle.org");
};


// NEXT button - Navigate to Project page after email validation
const handleNext = async () => {
  if (!email) {
    setShowError(true);      
    return;
  }
  setShowError(false);
  if (isCorpUser(email)) {
    // Corp user - Redirect to Microsoft login page
    try {
      await instance.loginRedirect({
        ...loginRequest,
        loginHint: email,
      });
    } catch (error: any) {
      console.error("Error calling loginRedirect:", error);
      setResponseMsg(`Failed to redirect: ${error.message || error.errorCode || "Unknown error"}`);
    }
  } else {
    // Regular user - Navigate directly to Project page
      navigate("/app/Configuration/Managetemplate", { replace: true });
  }
};

const handleLogin = async () => {
  if (!password) {
    setShowError(true);
    return;
  }
  setShowError(false);
  setLoading(true);
  try {
    const response = await accountService.login({
      email,
      password,
      rememberMe,
    });

    if (response.data?.token) {
      localStorage.setItem("token", response.data.token);
    }
    
    if (response.data?.user) {
      localStorage.setItem("user", JSON.stringify(response.data.user));
    }

    // Navigate to Project page instead of /app
      navigate("/app/Configuration/Managetemplate", { replace: true });
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || 
                        err?.response?.data?.error ||
                        "Invalid login credentials";
    setResponseMsg(errorMessage);
  } finally {
    setLoading(false);
  }
};

// ... existing code ...
// REQUEST ACCESS button
const handleRequestAccess = async () => {
  if (!email) {
    setShowError(true);
    return;
  }

  setShowError(false);
  setLoading(true);
  try {
    //await accountService.requestAccess(formdata);
    const response = await accountService.requestAccess({ email: email.trim() });
    
   if (response.status === 200 || response.status === 201) {
      setResponseMsg("An e-mail requesting access was sent successfully.");
      setEmail(""); // Clear email after successful request
    } else {
      setResponseMsg("Request sent, but received unexpected response.");
    }
  } catch (err: any) {
    const errorMessage = err?.response?.data?.message || 
                        err?.response?.data?.error ||
                        "Failed to send request";
    setResponseMsg(errorMessage);
  } finally {
    setLoading(false);
  }
};

// Handle Enter key in email field
const handleEmailKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && !loading) {
    handleNext();
  }
};

// Handle Enter key in password field
const handlePasswordKeyPress = (e: React.KeyboardEvent<HTMLInputElement>) => {
  if (e.key === "Enter" && password && !loading) {
    handleLogin();
  }
};

      return <>
            <div className="login-wrapper">
                  <div className="container">
                        <div className="login-content">
                              <div className="row justify-content-center">
                                    <div className="col-md-6">
                                          <div className="form-block">
                                                <div className="img-logo mb-25">
                                                      <img src={ABSLogo} alt="DCAP Logo"
                                                            className="filter-dark-blue login-logo" />
                                                </div>

                                                <div className="red-line"></div>

                                                <div className="mt-25 mb-25">
                                                      <h3 className="login-title">Condition Assessment Program (CAP)</h3>
                                                </div>
                                                <div className="login-form">
                                                      <div className="form-group">                                                         
                                                      <Input
                                                      label="Email Address"
                                                      placeholder="Email"
                                                      value={email}
                                                      onChange={(value: string) => setEmail(value)}
                                                      onKeyPress={handleEmailKeyPress}
                                                      disabled={loading}
                                                      autoComplete="email"
                                                      />

                                                      {(showerror && (!email || email == "")) ?
                                                            <div><label style={{ color: 'red' }}> Please enter email</label></div> :
                                                            <></>
                                                      }
     
                                                       </div>
                                                      <div className="login-actions d-flex justify-content-between mt-30">
                                                            <Button variant={BUTTONS.SECONDARY} onClick={handleRequestAccess}disabled={loading}>Request Access</Button>
                                                            <Button variant={BUTTONS.PRIMARY} onClick={handleNext} disabled={loading}>Next</Button>
                                                      </div>
                                                </div>
                                          </div>
                                    </div>
                              </div>
                        </div>
                  </div>
            </div>
      </>;
};

export default Login;

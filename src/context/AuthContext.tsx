import { createContext, useEffect, useState, type ReactNode } from "react";
import { useMsal } from "@azure/msal-react";
import { loginRequest } from "../auth/Authconfig";
import httpClient from "../api/httpClient";
import { type User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { instance, accounts } = useMsal();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        let account = accounts[0];

        // If no account, trigger login
        if (!account) {
          const loginResponse = await instance.loginPopup(loginRequest);
          account = loginResponse.account;
        }

        // Acquire access token silently
        const tokenResponse = await instance.acquireTokenSilent({
          ...loginRequest,
          account: account!,
        });

        // Call API with access token
        const res = await httpClient.get<User>("/auth/me", {
          headers: {
            Authorization: `Bearer ${tokenResponse.accessToken}`,
          },
        });

        setUser(res.data);
      } catch (err) {
        console.error("Failed to login or fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accounts, instance]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

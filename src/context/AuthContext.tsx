import { createContext, useEffect, useState, type ReactNode } from "react";
import { useMsal } from "@azure/msal-react";
import { InteractionStatus } from "@azure/msal-browser";
import { type User } from "../types/auth";

interface AuthContextType {
  user: User | null;
  loading: boolean;
}

export const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
});

// Define loginRequest with scopes
const loginRequest = {
  scopes: ["openid", "profile", "email"],
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const { instance, accounts, inProgress } = useMsal();
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        // Wait for MSAL to finish initializing
        if (inProgress !== InteractionStatus.None) {
          return;
        }

        // If user is already logged in, get token
        if (accounts.length > 0) {
          const account = accounts[0];
          
          try {
            const tokenResponse = await instance.acquireTokenSilent({
              ...loginRequest,
              account: account,
            });

            if (tokenResponse.accessToken) {
              localStorage.setItem("token", tokenResponse.accessToken);
              localStorage.setItem("user", JSON.stringify(account));
              setUser(account as any);
            }
          } catch (tokenError) {
            console.error("Token acquisition error:", tokenError);
            setUser(null);
          }
        } else {
          // No account - user is not logged in
          setUser(null);
        }
      } catch (err) {
        console.error("Failed to fetch user:", err);
        setUser(null);
      } finally {
        setLoading(false);
      }
    };

    fetchUser();
  }, [accounts, instance, inProgress]);

  return (
    <AuthContext.Provider value={{ user, loading }}>
      {children}
    </AuthContext.Provider>
  );
};
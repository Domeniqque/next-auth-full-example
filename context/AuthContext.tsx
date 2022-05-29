import React, { createContext } from "react";
import Router from "next/router";
import { parseCookies } from "nookies";
import { api } from "~/services/apiClient";
import { signOut } from "~/utils/signOut";
import { saveTokensOnCookies } from "~/utils/saveTokensOnCookies";

type User = {
  email: string;
  permissions: string[];
  roles: string[];
};

type SignInCredentials = {
  email: string;
  password: string;
};

type AuthContextData = {
  signIn(data: SignInCredentials): Promise<void>;
  isAuthenticated: boolean;
  user?: User;
};

export const AuthContext = createContext({} as AuthContextData);

type AuthProviderProps = {
  children: React.ReactNode;
};

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = React.useState<User>();
  const isAuthenticated = !!user;

  React.useEffect(() => {
    const { "nextauth.token": token } = parseCookies();
    console.log(`useEffect`, token);

    if (token) {
      api
        .get("/me")
        .then((response) => {
          const { email, permissions, roles } = response.data;

          setUser({ email, permissions, roles });
        })
        .catch(() => {
          signOut();
        });
    }
  }, []);

  const signIn = React.useCallback(
    async ({ email, password }: SignInCredentials) => {
      try {
        const response = await api.post("sessions", {
          email,
          password,
        });

        const { permissions, roles, token, refreshToken } = response.data;

        saveTokensOnCookies(token, refreshToken);

        setUser({
          email,
          permissions,
          roles,
        });

        // @ts-ignore
        api.defaults.headers["Authorization"] = `Bearer ${token}`;

        Router.push("/dashboard");
      } catch (err) {
        console.log(err);
      }
    },
    []
  );

  return (
    <AuthContext.Provider value={{ signIn, isAuthenticated, user }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return React.useContext(AuthContext);
}

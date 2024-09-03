import { createContext, useContext, useState } from "react";
import { User } from "../types";
import axios from "axios";

interface AuthContext {
  user: User;
  isLoggedIn: boolean;
  login: (a: string, b: string) => Promise<boolean>;
  createAccount: (a: string, b: string) => Promise<boolean>;
  logout: () => void;
}

const defaultUser: User = {
  id: -1,
  username: "",
  email: "",
  jwt: "",
};

const defaultAuthContext: AuthContext = {
  user: defaultUser,
  isLoggedIn: false,
  login: async () => false,
  createAccount: async () => false,
  logout: () => {},
};

const authContext = createContext<AuthContext>(defaultAuthContext);

export function ProvideAuth({ children }: any) {
  const auth = useProvideAuth();
  return <authContext.Provider value={auth}>{children}</authContext.Provider>;
}

export const useAuth = () => {
  return useContext(authContext);
};

function useProvideAuth() {
  const [user, setUser] = useState<User>(defaultUser);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  //LOGOUT
  async function logout() {
    setUser(defaultUser);
    setIsLoggedIn(false);
  }

  //LOGIN
  const login = async (
    username: string,
    password: string
  ): Promise<boolean> => {
    logout();

    const url = "https://api.geosave.org:8443/api/auth/gettoken";

    const requestBody = {
      username,
      password,
    };

    try {
      const response = await axios.post(url, requestBody, {
        headers: {
          "content-type": "application/json",
        },
      });
      const { jwt, userID: id, email } = response.data;
      console.log("getToken response");

      const user: User = { id, username, email, jwt };
      setUser(user);
      setIsLoggedIn(true);

      console.log("User logged in successfully.");
      return true;
    } catch (e) {
      console.error(`Error attempting to login. ${e}`);
      return false;
    }
  };

  //CREATE ACCOUNT
  async function createAccount(
    username: string,
    password: string
  ): Promise<boolean> {
    const url = "https://api.geosave.org:8443/api/users/create";

    const requestBody = {
      username,
      password,
    };

    try {
      await axios.post(url, requestBody, {
        headers: {
          "content-type": "application/json",
        },
      });

      console.log("User created successfully.");
      return true;
    } catch (e) {
      console.error(`Error attempting to create user. ${e}`);
      return false;
    }
  }

  return {
    user,
    isLoggedIn,
    login,
    createAccount,
    logout,
  };
}

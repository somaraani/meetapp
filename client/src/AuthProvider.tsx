import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useState } from "react";
import jwt_decode from "jwt-decode";
import { ApiWrapper } from "../api/ApiWrapper";

type User = null | any;

export const AuthContext = React.createContext<{
  user: User;
  login: (email: string, password: string) => Promise<string>;
  register: (token: string) => void;
  logout: () => void;
}>({
  user: null,
  login: async () => {
    return "";
  },
  register: () => {},
  logout: () => {},
});

interface AuthProviderProps {}

let api = new ApiWrapper();

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: async (email, password) => {
          // const { id } = jwt_decode(token);
          // getUser(id, token)
          //   .then((value) => {
          //     console.log({ token, ...value });
          //     setUser({ token, ...value });
          //     AsyncStorage.setItem("user", JSON.stringify({ token, id }));
          //   })
          //   .catch((e) => console.log(e));
          let token = await api.signIn(email, password);
          return token;
        },
        register: (token) => {},
        logout: () => {
          setUser(null);
          AsyncStorage.removeItem("user");
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

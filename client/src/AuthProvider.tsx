import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useState } from "react";
import jwt_decode from "jwt-decode";
import { getUser } from "../api/ApiWrapper";

type User = null | any;

export const AuthContext = React.createContext<{
  user: User;
  login: (token: string) => void;
  register: (token: string) => void;
  logout: () => void;
}>({
  user: null,
  login: (token) => {},
  register: (token) => {},
  logout: () => {},
});

interface AuthProviderProps {}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  return (
    <AuthContext.Provider
      value={{
        user,
        login: (token) => {
          const { id } = jwt_decode(token);
          getUser(id, token)
            .then((value) => {
              console.log({ token, ...value });
              setUser({ token, ...value });
              AsyncStorage.setItem("user", JSON.stringify({ token, id }));
            })
            .catch((e) => console.log(e));
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

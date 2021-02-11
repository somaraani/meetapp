import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useState } from "react";
import jwt_decode from "jwt-decode";

type User = null | { username: string };

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
          const userInfo = jwt_decode(token);
          console.log(userInfo);
          const fakeUser = { username: "bob" };
          setUser(fakeUser);
          AsyncStorage.setItem("user", JSON.stringify(fakeUser));
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

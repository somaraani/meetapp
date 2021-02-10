import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useState } from "react";

type User = null | { username: string };

export const AuthContext = React.createContext<{
  user: User;
  login: () => void;
  logout: () => void;
}>({ user: null, login: () => {}, logout: () => {} });

interface AuthProviderProps {}

const AuthProvider: FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const fakeUser = { username: "bob" };

  const loginUser = async () => {
    try {
      await AsyncStorage.setItem("user", JSON.stringify(fakeUser));
    } catch (e) {
      console.log(e.message);
    }
  };

  const logoutUser = async () => {
    try {
      await AsyncStorage.removeItem("user");
    } catch (e) {
      console.log(e.message);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: () => {
          setUser(fakeUser);
          loginUser();
        },
        logout: () => {
          logoutUser();
        },
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

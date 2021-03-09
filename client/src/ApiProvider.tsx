import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useState } from "react";
import jwt_decode from "jwt-decode";
import { ApiWrapper } from "../api/ApiWrapper";
import { Coordinate, Meeting, PublicUserData } from "@types";

type User = null | any;

export const ApiContext = React.createContext<{
  user: User;
  login: (email: string, password: string) => Promise<string>;
  returnUser: (token: string) => void;
  register: (
    emai: string,
    password: string,
    details: { displayName: string; displayPicture: string }
  ) => Promise<string>;
  logout: () => void;
  createMeeting: (
    name: string,
    description: string,
    time: string,
    location: Coordinate
  ) => void;
  getMeetings: () => Promise<Meeting[]>;
  getPublicUser: () => Promise<PublicUserData>;
}>({
  user: null,
  login: async () => {
    return "";
  },
  returnUser: () => {},
  register: async () => {
    return "";
  },
  logout: () => {},
  createMeeting: async () => {},
  getMeetings: async () => {
    return [];
  },
  getPublicUser: async () => {},
});

interface ApiProviderProps {}

let api = new ApiWrapper();

const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const login = async (email, password) => {
    // const { id } = jwt_decode(token);
    // getUser(id, token)
    //   .then((value) => {
    //     console.log({ token, ...value });
    //     setUser({ token, ...value });
    //     AsyncStorage.setItem("user", JSON.stringify({ token, id }));
    //   })
    //   .catch((e) => console.log(e));
    let token = await api.signIn(email, password);
    setUser(token);
    AsyncStorage.setItem("user", token);

    return token;
  };

  const register = async (email, password, details) => {
    let data = await api.createUser(email, password, details);

    return data;
  };

  const returnUser = (token) => {
    setUser(token);
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem("user");
    api = new ApiWrapper();
  };

  const createMeeting = async (name, description, time, location) => {
    let data = await api.createMeeting(name, description, time, location);

    return data;
  };

  const getMeetings = async () => {
    let data = await api.getMeetings();

    return data;
  };

  return (
    <ApiContext.Provider
      value={{
        user,
        login,
        register,
        returnUser,
        logout,
        createMeeting,
        getMeetings,
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;

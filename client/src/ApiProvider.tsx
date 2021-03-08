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
  ) => Promise<User>;
  logout: () => void;
  createMeeting: (
    name: string,
    description: string,
    time: string,
    location: Coordinate
  ) => void;
  getMeetings: () => Promise<Meeting[]>;
  updateExpoPushToken: (token:string) => Promise<void>
} | null>(null);

interface ApiProviderProps {}

let api = new ApiWrapper();

const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);

  const login = async (email:string, password:string) => {
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

  const register = async (email:string, password:string, details:PublicUserData) : Promise<User> => {
    let data = await api.createUser(email, password, details);

    return data;
  };

  const returnUser = (token:string) => {
    setUser(token);
  };

  const logout = () => {
    setUser(null);
    AsyncStorage.removeItem("user");
    //send logout request
    api = new ApiWrapper();
  };

  const createMeeting = async (name:string, description:string, time:string, location:Coordinate) => {
    let data = await api.createMeeting(name, description, time, location);

    return data;
  };

  const getMeetings = async () => {
    let data = await api.getMeetings();

    return data;
  };

  const updateExpoPushToken = async (expoPushToken:string) : Promise<void> => {
    await api.updateExpoPushToken(expoPushToken);
  }

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
        updateExpoPushToken
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;

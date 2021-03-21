import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useRef, useState } from "react";
import jwt_decode from "jwt-decode";
import { ApiWrapper } from "../api/ApiWrapper";
import { Coordinate, Meeting, PublicUserData, User as UserType } from "@types";
import { SocketWrapper } from "../api/SocketWrapper";
import { TouchableNativeFeedbackBase } from "react-native";

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
  getUser: () => Promise<UserType>;
  updateExpoPushToken: (token:string) => Promise<void>,
  socketClient:SocketWrapper | undefined
} | null>(null);

interface ApiProviderProps {}

let api = new ApiWrapper();

const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User>(null);
  const socketRef = useRef<SocketWrapper>();
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
    socketRef.current = new SocketWrapper(token);
    setUser(token);
    AsyncStorage.setItem("user", token);

    return token;
  };

  const register = async (email:string, password:string, details:{ displayName: string; displayPicture: string }) : Promise<User> => {
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
    socketRef.current?.disconnect();
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

  const getUser = async () => {
    let data = await api.getUser();

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
        updateExpoPushToken,
        getUser,
        socketClient:socketRef.current
        
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;

import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { FC, useEffect, useRef, useState } from "react";
import { ApiWrapper } from "../api/ApiWrapper";
import { SocketWrapper } from "../api/SocketWrapper";

type User = null | any;

interface AppContextInterface {
  user: User,
  logout: () => void,
  login: (username:string, password:string) => Promise<string>,
  apiClient:ApiWrapper,
  socketClient:SocketWrapper,
  loading: boolean
}

export const ApiContext = React.createContext<AppContextInterface>({} as AppContextInterface);

interface ApiProviderProps {}

let socketClient = new SocketWrapper();

const ApiProvider: FC<ApiProviderProps> = ({ children }) => {
  const [user, setUser] = useState<string | null>();
  const [socketClientLoaded, setSocketClientLoaded] = useState<boolean>(false);
  const [loading, setLoading] = useState<boolean>(true);
  const apiClientRef = useRef(new ApiWrapper());
  const apiClient = apiClientRef.current;
  useEffect(() => {
    AsyncStorage.getItem('user').then(token => {
      if (token) {
        setUser(token);
        apiClient.setToken(token);
        socketClient.connect(token);
      }
      setLoading(false);
    }).finally(() => {
      setSocketClientLoaded(true);
    });
    
  }, []);

  const login = async (email:string, password:string) : Promise<string> => {
    // const { id } = jwt_decode(token);
    // getUser(id, token)
    //   .then((value) => {
    //     console.log({ token, ...value });
    //     setUser({ token, ...value });
    //     AsyncStorage.setItem("user", JSON.stringify({ token, id }));
    //   })
    //   .catch((e) => console.log(e));
    let token = await apiClient.signIn(email, password);
    socketClient.connect(token);
    setSocketClientLoaded(true);

    setUser(token);
    AsyncStorage.setItem("user", token);

    return token;
  };

  const logout = async () => {
    try{
      console.log('logut')
      await apiClient.updateExpoPushToken('');
      console.log('logut')
    }
    catch(e){
      console.log(e)
    }
    setUser(null);
    AsyncStorage.removeItem("user");
    //send logout request
    socketClient.disconnect();
    apiClient.reset();
  };

  if (loading || !socketClientLoaded) {
    return null;
  }

  return (
    <ApiContext.Provider
      value={{
        user,
        logout,
        login,
        apiClient,
        socketClient,
        loading
      }}
    >
      {children}
    </ApiContext.Provider>
  );
};

export default ApiProvider;

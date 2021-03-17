import AsyncStorage from "@react-native-async-storage/async-storage";
import React, { Context, FC, ReactElement, ReactNode, useContext, useEffect, useRef, useState  } from "react";
import jwt_decode from "jwt-decode";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from "react-native";
import { ApiContext } from "./ApiProvider";

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: false,
    shouldSetBadge: false,
  }),
});

async function registerForPushNotificationsAsync() {
  let token;
  if (Constants.isDevice) {
    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;
    if (existingStatus !== 'granted') {
      const { status } = await Notifications.requestPermissionsAsync();
      finalStatus = status;
    }
    if (finalStatus !== 'granted') {
      console.log('Push permission not granted');
      return null;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
    return null;
  }

  if (Platform.OS === 'android') {
    Notifications.setNotificationChannelAsync('default', {
      name: 'default',
      importance: Notifications.AndroidImportance.MAX,
      vibrationPattern: [0, 250, 250, 250],
      lightColor: '#FF231F7C',
    });
  }

  return token;
}

const NotificationContext = React.createContext<any>(null);
export const useNotificationContext = () => React.useContext(NotificationContext);

const NotificationProvider : any = ({ children } : any) => {
  const {user, updateExpoPushToken} = useContext<any>(ApiContext);
  const [notificationLink, setNotificationLink] = useState<any>();
  const notificationListener = useRef<any>();
  const responseListener = useRef<any>();

  const removeSubscriptions = () => {
    if (notificationListener.current){
      Notifications.removeNotificationSubscription(notificationListener.current);
    }
    if (responseListener.current){
      Notifications.removeNotificationSubscription(responseListener.current);
    }
  }

  const registerToken = async (token:string | undefined) => {
    updateExpoPushToken(token);
  }

  useEffect(() => {
    if (!user){
      removeSubscriptions();
      return;
    }
    registerForPushNotificationsAsync().then(token => {
      if (token){
        registerToken(token);
      }
    });

    // This listener is fired whenever a notification is received while the app is foregrounded
    notificationListener.current = Notifications.addNotificationReceivedListener(notification => {
      //console.log(notification);
    });

    // This listener is fired whenever a user taps on or interacts with a notification (works when app is foregrounded, backgrounded, or killed)
    responseListener.current = Notifications.addNotificationResponseReceivedListener(response => {
      setNotificationLink(response.notification.request.content.data.link);
    });

    return () => {
      removeSubscriptions();
    };
  }, [user]);

  return (
    <NotificationContext.Provider value={{notificationLink}}>
      {children}
    </NotificationContext.Provider>
  );
};

export default NotificationProvider;

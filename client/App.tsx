import React, { useEffect } from "react";
import { BaseRouter, NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./screens/Login";
import Register from "./screens/Register";
import DrawerContent from "./components/DrawerContent";
import Meetings from "./screens/Meetings";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";
import MeetingPage from "./screens/MeetingPage";
import Constants from 'expo-constants';
import * as Notifications from 'expo-notifications';
import { Platform } from 'react-native';
import io from 'socket.io-client';

const Enter = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainContent = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent {...props} />}
    initialRouteName="Meetings"
    screenOptions={{ headerTitleAlign: "center", headerShown: true }}
  >
    <Drawer.Screen
      name="Meetings"
      component={Meetings}
      options={{
        headerStyle: {
          paddingRight: 15,
        },
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("Pressed Add")}>
            <Ionicons name="add-circle" size={35} color="#2196F3" />
          </TouchableOpacity>
        ),
      }}
    />
    <Drawer.Screen name="MeetingPage" component={MeetingPage} />
  </Drawer.Navigator>
);

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
      alert('Failed to get push token for push notification!');
      console.log('Failed to get push token for push notification!');
    return;
    }
    token = (await Notifications.getExpoPushTokenAsync()).data;
    console.log(token);
  } else {
    console.log('Must use physical device for Push Notifications');
    alert('Must use physical device for Push Notifications');
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

function App() {
  useEffect(() => {
    // const socket = io('http://192.168.219.58:3000', {
    //     transports: ['websocket'],
    //     upgrade: false,
    //     query: {token: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJlbWFpbCI6IjUzcmUzZjNkMzJ0QGdtYWlsLmNvbSIsImlkIjoiNjAyMDNmMDFlMjRmNDExNWI4MThjYTViIiwiaWF0IjoxNjEzNjg3MDQwLCJleHAiOjE2MTM2ODgyNDB9.kwbPuINxAd37hQ5n53SQUPUhMv2krP3_3pg-UPvCy-0'}
    //   });
    //   socket.on('connect', function() {
    //     console.log('Connected');

    //     socket.emit('message', {id:0,message:0}, (response: any)  =>
    //       console.log('Identity:', response),
    //     );
    //   });
     
    //   socket.on('disconnect', function() {
    //     console.log('disconnected');
    //   });
   
    // //registerForPushNotificationsAsync().then(token => console.log(token));
  }, []);

  return (
    <NavigationContainer>
      <Enter.Navigator
        // screenOptions={{ headerShown: false }}
        initialRouteName="Login"
      >
        <Enter.Screen
          name="Login"
          component={Login}
          options={{ headerShown: false }}
        />
        <Enter.Screen
          name="Register"
          component={Register}
          options={{
            title: "",
            headerStyle: { backgroundColor: "black" },
            headerTintColor: "#fff",
          }}
        />
        <Enter.Screen
          name="Main"
          component={MainContent}
          options={{ headerShown: false }}
        />
      </Enter.Navigator>
    </NavigationContainer>
  );
}

export default App;

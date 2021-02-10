import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthParamList } from "./AuthParamList";
import { AuthContext } from "./AuthProvider";
import Login from "../screens/Login";
import Register from "../screens/Register";
import { ActivityIndicator, Text, View } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../screens/Home";
import DrawerContent from "../components/DrawerContent";
import MeetingPage from "../screens/MeetingPage";

const Stack = createStackNavigator<AuthParamList>();
const Drawer = createDrawerNavigator<AuthParamList>();

const Meetings = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Home"
        component={Home}
        options={{ headerTitleAlign: "center", headerTitle: "Meetings" }}
      />
      <Stack.Screen
        name="MeetingPage"
        component={MeetingPage}
        options={({ route }) => ({ title: route.params.title })}
      />
    </Stack.Navigator>
  );
};

export const Routes = () => {
  const { user, login } = useContext(AuthContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((userString) => {
        if (userString) {
          login();
        }
        setLoading(false);
      })
      .catch((e) => {
        console.log(e);
        setLoading(false);
      });
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "black",
        }}
      >
        <ActivityIndicator size="large" color="white" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {user ? (
        <Drawer.Navigator
          initialRouteName="Meetings"
          drawerContent={(props) => <DrawerContent {...props} />}
        >
          <Drawer.Screen name="Meetings" component={Meetings} />
        </Drawer.Navigator>
      ) : (
        <Stack.Navigator initialRouteName="Login">
          <Stack.Screen
            name="Login"
            component={Login}
            options={{ headerShown: false }}
          />
          <Stack.Screen
            name="Register"
            component={Register}
            options={{
              headerTitle: "",
              headerTintColor: "white",
              headerStyle: {
                backgroundColor: "black",
              },
              headerBackTitleVisible: true,
            }}
          />
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
};

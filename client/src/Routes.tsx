import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { AuthParamList } from "./AuthParamList";
import Login from "../screens/Login";
import Register from "../screens/Register";

const Stack = createStackNavigator<AuthParamList>();

const Drawer = createDrawerNavigator();

export const Routes = () => {
  return (
    <NavigationContainer>
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
    </NavigationContainer>
  );
};

import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import Login from "./screens/Login";
import Register from "./screens/Register";

const Enter = createStackNavigator();

function App() {
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
      </Enter.Navigator>
    </NavigationContainer>
  );
}

export default App;

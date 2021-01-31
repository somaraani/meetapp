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
        screenOptions={{ headerShown: false }}
        initialRouteName="Register"
      >
        <Enter.Screen name="Login" component={Login} />
        <Enter.Screen name="Register" component={Register} />
      </Enter.Navigator>
    </NavigationContainer>
  );
}

export default App;

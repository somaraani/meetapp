import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import { createDrawerNavigator } from "@react-navigation/drawer";
import Login from "./screens/Login";
import Register from "./screens/Register";
import DrawerContent from "./components/DrawerContent";
import Meetings from "./screens/Meetings";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Ionicons } from "@expo/vector-icons";

const Enter = createStackNavigator();
const Drawer = createDrawerNavigator();

const MainContent = () => (
  <Drawer.Navigator
    drawerContent={(props) => <DrawerContent {...props} />}
    initialRouteName="Meetings"
    screenOptions={{ headerTitleAlign: "center" }}
  >
    <Drawer.Screen
      name="Meetings"
      component={Meetings}
      options={{
        headerShown: true,
        headerStyle: {
          paddingRight: 15,
        },
        headerRight: () => (
          <TouchableOpacity onPress={() => console.log("Pressed Add")}>
            <Ionicons name="add-circle" size={30} color="#2196F3" />
          </TouchableOpacity>
        ),
      }}
    />
  </Drawer.Navigator>
);

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

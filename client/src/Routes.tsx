import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthParamList } from "./AuthParamList";
import { ApiContext } from "./ApiProvider";
import Login from "../screens/Login";
import Register from "../screens/Register";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  View,
  StyleSheet,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import Home from "../screens/Home";
import DrawerContent from "../components/DrawerContent";
import MeetingPage from "../screens/MeetingPage";
import MainSettings from "../screens/MainSettings";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { MeetingContext } from "./MeetingContext";
import MeetingMembers from "../screens/MeetingMembers";
import MeetingSettings from "../screens/MeetingSettings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import CreateMeeting from "../screens/CreateMeeting";

const Stack = createStackNavigator<AuthParamList>();
const Drawer = createDrawerNavigator<AuthParamList>();
const Tabs = createBottomTabNavigator<AuthParamList>();

const MeetingTabs = ({ navigation, route }) => {
  return (
    <MeetingContext.Provider value={route.params}>
      <Tabs.Navigator initialRouteName="MeetingMap">
        <Tabs.Screen
          name="MeetingMap"
          component={MeetingPage}
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color, size }) => (
              <Icon name="map" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="MeetingMembers"
          component={MeetingMembers}
          options={{
            tabBarLabel: "Members",
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-multiple" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="MeetingSettings"
          component={MeetingSettings}
          options={{
            tabBarLabel: "Settings",
            tabBarIcon: ({ color, size }) => (
              <Icon name="cog" size={size} color={color} />
            ),
          }}
        />
      </Tabs.Navigator>
    </MeetingContext.Provider>
  );
};

const Meetings = ({ navigation }) => {
  return (
    <Stack.Navigator initialRouteName="Home">
      <Stack.Screen
        name="Home"
        component={Home}
        options={{
          headerTitleAlign: "center",
          headerTitle: "Meetings",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerRight: () => (
            <TouchableOpacity
              onPress={() => navigation.navigate("CreateMeeting")}
            >
              <MaterialIcons name="add" size={30} color="#2196F3" />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            marginLeft: 20,
          },
          headerRightContainerStyle: {
            marginRight: 20,
          },
        }}
      />
      <Stack.Screen
        name="MeetingTabs"
        component={MeetingTabs}
        options={({ route }) => ({ title: route.params.details.name })}
      />
      <Stack.Screen
        name="CreateMeeting"
        component={CreateMeeting}
        options={{ title: "Create Meeting" }}
      />
    </Stack.Navigator>
  );
};

const styles = StyleSheet.create({
  backdrop: {
    backgroundColor: "rgba(0,0,0,0.4)",
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  modalView: {
    backgroundColor: "white",
    padding: 25,
    elevation: 5,
    maxWidth: "75%",
  },
  modalTitle: {
    fontWeight: "bold",
    fontSize: 18,
    marginBottom: 8,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 5,
  },
  modalBtns: {
    flexDirection: "row",
    justifyContent: "flex-end",
  },
  modalBtn: {
    color: "#2196F3",
    fontWeight: "bold",
    fontSize: 14,
  },
});

export const Routes = () => {
  const { user, returnUser } = useContext(ApiContext);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    AsyncStorage.getItem("user")
      .then((token) => {
        if (token) {
          returnUser(token);
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
    <>
      <NavigationContainer>
        {user ? (
          <Drawer.Navigator
            initialRouteName="Meetings"
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="Meetings" component={Meetings} />
            <Drawer.Screen name="MainSettings" component={MainSettings} />
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
                headerShown: false,
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
};

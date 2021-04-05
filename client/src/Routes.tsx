import React, { useContext, useEffect, useRef, useState } from "react";
import { NavigationContainer, useFocusEffect } from "@react-navigation/native";
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
import HelpFAQ from "../screens/HelpFAQ";
import { TouchableOpacity } from "react-native-gesture-handler";
import { Entypo } from "@expo/vector-icons";
import { MeetingContext } from "./MeetingContext";
import MeetingMembers from "../screens/MeetingMembers";
import MeetingSettings from "../screens/MeetingSettings";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { MaterialIcons } from "@expo/vector-icons";
import CreateMeeting from "../screens/CreateMeeting";
import LocationPicker from "../screens/LocationPicker";
import { useNotificationContext } from "./NotificationProvider";
import { Button } from "react-native-paper";
import InviteMembers from "../screens/InviteMembers";
import Invites from "../screens/Invites";
import { SocketEvents } from "@types";
import {
  Menu,
  MenuOption,
  MenuOptions,
  MenuProvider,
  MenuTrigger,
} from "react-native-popup-menu";
import StartLocationPicker from "../screens/StartLocationPicker";

const Stack = createStackNavigator<AuthParamList>();
const MeetingsStack = createStackNavigator<AuthParamList>();
const MembersStack = createStackNavigator<AuthParamList>();
const MapStack = createStackNavigator<AuthParamList>();
const MeetingSettingsStack = createStackNavigator<AuthParamList>();
const InviteStack = createStackNavigator<AuthParamList>();
const HelpFAQStack = createStackNavigator<AuthParamList>();
const Drawer = createDrawerNavigator<AuthParamList>();
const Tabs = createBottomTabNavigator<AuthParamList>();

const InviteContainer = ({ navigation }) => {
  return (
    <InviteStack.Navigator initialRouteName="Invites">
      <InviteStack.Screen
        options={{
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            marginLeft: 20,
          },
        }}
        name="Invites"
        component={Invites}
      />
    </InviteStack.Navigator>
  );
};

const HelpFAQContainer = ({ navigation }) => {
  return (
    <HelpFAQStack.Navigator initialRouteName="HelpFAQ">
      <HelpFAQStack.Screen
        options={{
          headerTitleAlign: "center",
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            marginLeft: 20,
          },
        }}
        name="Help and FAQ"
        component={HelpFAQ}
      />
    </HelpFAQStack.Navigator>
  );
};

const MapContainer = ({ navigation }) => {
  const name = useContext(MeetingContext);

  return (
    <MapStack.Navigator initialRouteName="MeetingMembers">
      <MapStack.Screen
        name="MeetingMap"
        component={MeetingPage}
        options={{
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.openDrawer()}>
              <Entypo name="menu" size={24} color="black" />
            </TouchableOpacity>
          ),
          headerLeftContainerStyle: {
            marginLeft: 20,
          },
          headerTitleAlign: "center",
          title: name.details.name || "Meeting",
        }}
      />
    </MapStack.Navigator>
  );
};

const MeetingSettingsContainer = () => {
  return (
    <MeetingSettingsStack.Navigator initialRouteName="MeetingsSettings">
      <MeetingSettingsStack.Screen
        name="MeetingSettings"
        component={MeetingSettings}
        options={{
          headerLeft: () => null,
          headerTitleAlign: "center",
          title: "Settings",
        }}
      />
      <MeetingSettingsStack.Screen
        name="StartLocationPicker"
        component={StartLocationPicker}
      />
    </MeetingSettingsStack.Navigator>
  );
};

const MeetingMembersPages = ({ navigation }) => {
  return (
    <MembersStack.Navigator initialRouteName="MeetingMembers">
      <MembersStack.Screen
        name="MeetingMembers"
        component={MeetingMembers}
        options={{
          headerLeft: () => null,
          headerTitleAlign: "center",
          title: "Members",
        }}
      />
      <MembersStack.Screen
        name="InviteMembers"
        component={InviteMembers}
        options={{ title: "Invite Member", headerTitleAlign: "center" }}
      />
    </MembersStack.Navigator>
  );
};

const MeetingTabs = ({ navigation, route }) => {
  let { id } = route.params;
  const { socketClient } = useContext(ApiContext);
  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      //register for realtime meeting events
      socketClient.join(id);
      return () => {
        socketClient.leave(id);
      };
    }, [])
  );

  return (
    <MeetingContext.Provider value={route.params}>
      <Tabs.Navigator initialRouteName="MapContainer">
        <Tabs.Screen
          name="MapContainer"
          component={MapContainer}
          options={{
            tabBarLabel: "Map",
            tabBarIcon: ({ color, size }) => (
              <Icon name="map" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="MeetingMembersPages"
          component={MeetingMembersPages}
          options={{
            tabBarLabel: "Members",
            tabBarIcon: ({ color, size }) => (
              <Icon name="account-multiple" size={size} color={color} />
            ),
          }}
        />
        <Tabs.Screen
          name="MeetingSettingsContainer"
          component={MeetingSettingsContainer}
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
    <MenuProvider>
      <MeetingsStack.Navigator initialRouteName="Home">
        <MeetingsStack.Screen
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
              <View style={{ flexDirection: "row", alignItems: "center" }}>
                <Menu onSelect={(value) => alert(`Selected number: ${value}`)}>
                  <MenuTrigger>
                    <MaterialIcons
                      name="sort"
                      size={20}
                      color="black"
                      style={{ marginRight: 5 }}
                    />
                  </MenuTrigger>
                  <MenuOptions
                    customStyles={{ optionsContainer: { width: 75 } }}
                  >
                    <MenuOption value="new" text="New" />
                    <MenuOption value="time" text="Time" />
                    <MenuOption value="name" text="Name" />
                  </MenuOptions>
                </Menu>
                <TouchableOpacity
                  onPress={() => navigation.navigate("CreateMeeting")}
                >
                  <MaterialIcons name="add" size={24} color="#2196F3" />
                </TouchableOpacity>
              </View>
            ),
            headerLeftContainerStyle: {
              marginLeft: 20,
            },
            headerRightContainerStyle: {
              marginRight: 20,
            },
          }}
        />
        <MeetingsStack.Screen
          name="MeetingTabs"
          component={MeetingTabs}
          options={{ headerShown: false }}
        />
        <MeetingsStack.Screen
          name="CreateMeeting"
          component={CreateMeeting}
          options={{
            title: "Create Meeting",
            headerLeft: () => null,
            headerRight: () => (
              <Button
                mode="contained"
                onPress={() => navigation.navigate("Home")}
                theme={{ colors: { primary: "#F66161" } }}
              >
                <Text style={{ color: "white" }}>CANCEL</Text>
              </Button>
            ),
            headerRightContainerStyle: {
              marginRight: 20,
            },
          }}
        />
        <MeetingsStack.Screen
          name="LocationPicker"
          component={LocationPicker}
          options={{ title: "Select Location" }}
        />
      </MeetingsStack.Navigator>
    </MenuProvider>
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
  const { notificationLink } = useNotificationContext();
  const { user, loading } = useContext(ApiContext);
  const navigationRef = useRef<any>();
  const { socketClient } = useContext(ApiContext);

  useEffect(() => {
    if (notificationLink) {
      navigationRef.current.navigate(notificationLink);
    }
  }, [notificationLink]);

  useEffect(() => {
    socketClient.on(SocketEvents.INVITATION, () => {
      console.log("New invite");
    });
    return () => {
      socketClient.off(SocketEvents.INVITATION);
    };
  }, []);

  if (loading) {
    return (
      <View
        style={{
          flex: 1,
          justifyContent: "center",
          alignItems: "center",
          backgroundColor: "#f6f6f6",
        }}
      >
        <ActivityIndicator size="large" color="black" />
      </View>
    );
  }

  return (
    <>
      <NavigationContainer ref={navigationRef}>
        {user ? (
          <Drawer.Navigator
            initialRouteName="Meetings"
            drawerContent={(props) => <DrawerContent {...props} />}
          >
            <Drawer.Screen name="Meetings" component={Meetings} />
            <Drawer.Screen name="Invites" component={InviteContainer} />
            <Drawer.Screen name="MainSettings" component={MainSettings} />
            <Drawer.Screen name="HelpFAQ" component={HelpFAQContainer} />
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

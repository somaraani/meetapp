import React, { useContext, useEffect, useState } from "react";
import { NavigationContainer } from "@react-navigation/native";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { AuthNavProps, AuthParamList } from "./AuthParamList";
import { AuthContext } from "./AuthProvider";
import Login from "../screens/Login";
import Register from "../screens/Register";
import {
  ActivityIndicator,
  StatusBar,
  Text,
  View,
  StyleSheet,
  Modal,
  Pressable,
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
import JoinMeeting from "../screens/JoinMeeting";

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
  const [modalVisible, setModalVisible] = useState(false);

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
            <>
              <Modal
                animationType="fade"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => setModalVisible(!modalVisible)}
              >
                <Pressable
                  onPress={() => setModalVisible(!modalVisible)}
                  style={styles.backdrop}
                >
                  <Pressable style={styles.modalView}>
                    <Text style={styles.modalTitle}>Add Meeting</Text>
                    <Text style={styles.modalText}>
                      Create a new meeting, or Join an existing meeting?
                    </Text>
                    <View style={styles.modalBtns}>
                      <Pressable
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          navigation.navigate("CreateMeeting");
                        }}
                      >
                        <Text style={[styles.modalBtn, { marginRight: 10 }]}>
                          CREATE
                        </Text>
                      </Pressable>
                      <Pressable
                        onPress={() => {
                          setModalVisible(!modalVisible);
                          navigation.navigate("JoinMeeting");
                        }}
                      >
                        <Text style={styles.modalBtn}>JOIN</Text>
                      </Pressable>
                    </View>
                  </Pressable>
                </Pressable>
              </Modal>
              <TouchableOpacity onPress={() => setModalVisible(true)}>
                <MaterialIcons name="add" size={30} color="#2196F3" />
              </TouchableOpacity>
            </>
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
        options={({ route }) => ({ title: route.params.title })}
      />
      <Stack.Screen
        name="CreateMeeting"
        component={CreateMeeting}
        options={{ title: "Create Meeting" }}
      />
      <Stack.Screen
        name="JoinMeeting"
        component={JoinMeeting}
        options={{ title: "Join Meeting" }}
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
  const { user, returnUser } = useContext(AuthContext);
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
      <StatusBar />
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
                headerTitle: "",
                headerTintColor: "white",
                headerStyle: {
                  backgroundColor: "black",
                },
                headerBackTitleVisible: true,
                headerBackTitle: "Login",
              }}
            />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </>
  );
};

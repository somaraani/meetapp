import { DrawerContentScrollView, DrawerItem } from "@react-navigation/drawer";
import React, { useContext, useEffect, useState } from "react";
import { Button, StyleSheet, View } from "react-native";
import { ApiContext } from "../src/ApiProvider";
import { Avatar, Caption, Drawer, Text, Title } from "react-native-paper";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { DrawerActions } from "@react-navigation/native";

const DrawerContent = (props) => {
  const { user, logout, getUser } = useContext(ApiContext);
  let [name, setName] = useState("");
  const [email, setEmail] = useState("");

  useEffect(() => {
    async function getUserInfo() {
      let data = await getUser();
      setName(data.publicData.displayName);
      setEmail(data.email);
    }
    getUserInfo();
  }, []);

  return (
    <View style={{ flex: 1 }}>
      <DrawerContentScrollView {...props}>
        <View style={styles.drawerContent}>
          <View style={styles.userInfoSection}>
            <View style={{ flexDirection: "row", marginTop: 15 }}>
              <Avatar.Image
                source={require("../assets/profile.jpg")}
                size={50}
              />

              <View style={{ marginLeft: 15, flexDirection: "column" }}>
                <Title style={styles.title}>{name}</Title>
                <Caption style={styles.caption}>{email}</Caption>
              </View>
            </View>
          </View>
          <Drawer.Section style={styles.drawerSection}>
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="home" color={color} size={size} />
              )}
              label="Meetings"
              onPress={() => props.navigation.navigate("Meetings")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="cog" color={color} size={size} />
              )}
              label="Settings"
              onPress={() => props.navigation.navigate("MainSettings")}
            />
            <DrawerItem
              icon={({ color, size }) => (
                <Icon name="file-document" color={color} size={size} />
              )}
              label="Documentation"
              onPress={() => console.log("Documentation")}
            />
          </Drawer.Section>
        </View>
      </DrawerContentScrollView>
      <Drawer.Section style={styles.bottomDrawerSection}>
        <DrawerItem
          icon={({ color, size }) => (
            <Icon name="exit-to-app" color={color} size={size} />
          )}
          label="Sign out"
          onPress={() => {
            props.navigation.dispatch(DrawerActions.closeDrawer());
            logout();
          }}
        />
      </Drawer.Section>
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({
  drawerContent: {
    flex: 1,
  },
  userInfoSection: {
    paddingLeft: 20,
  },
  title: {
    fontSize: 16,
    marginTop: 3,
    fontWeight: "bold",
  },
  caption: {
    fontSize: 14,
    lineHeight: 14,
  },
  drawerSection: {
    marginTop: 15,
  },
  bottomDrawerSection: {
    marginBottom: 15,
    borderTopColor: "#f4f4f4",
    borderTopWidth: 1,
  },
});

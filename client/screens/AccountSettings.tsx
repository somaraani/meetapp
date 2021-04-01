import { useFocusEffect } from "@react-navigation/core";
import React, { useContext, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ApiContext } from "../src/ApiProvider";

const AccountSettings = ({ navigation }) => {
  const { apiClient } = useContext(ApiContext);
  const [userData, setUserData] = useState(null);

  useFocusEffect(
    React.useCallback(() => {
      async function fetchUserData() {
        try {
          let data = await apiClient.getUser();
          setUserData(data);
        } catch (error) {
          console.log(error);
        }
      }

      fetchUserData();
    }, [])
  );

  return (
    <View style={{ padding: 10 }}>
      <ListItem bottomDivider onPress={() => navigation.navigate("ChangeName")}>
        <Icon name="account" size={24} />
        <ListItem.Content>
          <ListItem.Title>Name</ListItem.Title>
          <ListItem.Subtitle>
            {userData ? userData.publicData.displayName : null}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      <ListItem
        bottomDivider
        onPress={() => navigation.navigate("ChangeEmail")}
      >
        <Icon name="email" size={24} />
        <ListItem.Content>
          <ListItem.Title>Email</ListItem.Title>
          <ListItem.Subtitle>
            {userData ? userData.email : null}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      <ListItem
        bottomDivider
        onPress={() => navigation.navigate("ChangePassword")}
      >
        <Icon name="key" size={24} />
        <ListItem.Content>
          <ListItem.Title>Change Password</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

export default AccountSettings;

const styles = StyleSheet.create({});

import React from "react";
import { Text, View } from "react-native";
import Icon from "react-native-vector-icons/MaterialCommunityIcons";
import { ListItem } from "react-native-elements";

const MainSettings = ({ navigation }) => {
  return (
    <View style={{ flex: 1, padding: 10 }}>
      <ListItem onPress={() => navigation.navigate("AccountSettingsContainer")}>
        <Icon name="account-cog" size={24} />
        <ListItem.Content>
          <ListItem.Title>Account Settings</ListItem.Title>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

export default MainSettings;

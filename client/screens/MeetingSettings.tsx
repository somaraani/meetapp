import { useFocusEffect } from "@react-navigation/core";
import React from "react";
import { BackHandler, Text, View } from "react-native";

const MeetingSettings = ({navigation}) => {
  const backAction = () => {
    navigation.navigate("Home");
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }
    }, []));

  return (
    <View>
      <Text>Meeting Settings</Text>
    </View>
  );
};

export default MeetingSettings;

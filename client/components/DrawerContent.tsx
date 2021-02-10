import React, { useContext } from "react";
import { Button, StyleSheet, Text, View } from "react-native";
import { AuthContext } from "../src/AuthProvider";

const DrawerContent = () => {
  const { logout } = useContext(AuthContext);

  return (
    <View>
      <Button title="Logout" onPress={logout} />
    </View>
  );
};

export default DrawerContent;

const styles = StyleSheet.create({});

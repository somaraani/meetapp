import { useFocusEffect } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button, TextInput } from "react-native-paper";
import { ApiContext } from "../src/ApiProvider";

const ChangeName = ({ navigation }) => {
  const [name, setName] = useState("");
  const { apiClient } = useContext(ApiContext);

  async function changeUserInfo() {
    try {
      let data = await apiClient.getUser();
      await apiClient.updateUser({
        ...data,
        publicData: { ...data.publicData, displayName: name },
      });

      navigation.goBack();
    } catch (error) {
      console.log(error.response);
    }
  }

  useFocusEffect(
    React.useCallback(() => {
      async function getName() {
        let data = await apiClient.getUser();
        setName(data.publicData.displayName);
      }

      getName();
    }, [])
  );

  return (
    <View style={{ padding: 10 }}>
      <TextInput
        style={styles.input}
        placeholder="Full name"
        onChangeText={(value) => setName(value)}
        value={name}
        theme={{ colors: { primary: "#2196F3" } }}
        mode="outlined"
      />
      <Button
        mode="contained"
        onPress={changeUserInfo}
        theme={{ colors: { primary: "#2196F3" } }}
      >
        <Text style={{ color: "white" }}>SAVE</Text>
      </Button>
    </View>
  );
};

export default ChangeName;

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    height: 40,
  },
});

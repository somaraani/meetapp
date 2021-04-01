import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import { Button } from "react-native-paper";

const ChangeName = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="contained"
          onPress={() => navigation.navigate("Home")}
          theme={{ colors: { primary: "#2196F3" } }}
        >
          <Text style={{ color: "white" }}>SAVE</Text>
        </Button>
      ),
    });
  }, []);

  return (
    <View>
      <Text>Change Name</Text>
    </View>
  );
};

export default ChangeName;

const styles = StyleSheet.create({});

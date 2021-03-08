import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";

const JoinMeeting = ({ navigation }) => {
  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <TouchableOpacity
          style={{
            backgroundColor: "#2196F3",
            paddingVertical: 5,
            paddingHorizontal: 10,
            borderRadius: 8,
          }}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>JOIN</Text>
        </TouchableOpacity>
      ),
      headerRightContainerStyle: {
        marginRight: 20,
      },
    });
  }, []);

  return (
    <View>
      <Text>Join an existing meeting</Text>
    </View>
  );
};

export default JoinMeeting;

const styles = StyleSheet.create({});

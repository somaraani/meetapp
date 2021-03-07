import React, { useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";


const CreateMeeting = ({ navigation }) => {
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
          onPress={() => }
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>CREATE</Text>
        </TouchableOpacity>
      ),
      headerRightContainerStyle: {
        marginRight: 20,
      },
    });
  }, []);

  return (
    <View>
      <Text>Create a new meeting</Text>
    </View>
  );
};

export default CreateMeeting;

const styles = StyleSheet.create({});

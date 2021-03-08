import React, { useContext, useEffect } from "react";
import { StyleSheet, Text, TouchableOpacity, View } from "react-native";
import { ApiContext } from "../src/ApiProvider";
import dateFormat from "dateformat";

const CreateMeeting = ({ navigation }) => {
  const { createMeeting } = useContext(ApiContext);

  const onCreate = async () => {
    let time = dateFormat(
      new Date("December 17, 2021 03:24:00"),
      "isoDateTime"
    );

    try {
      let data = await createMeeting(
        "New Meeting 6",
        "Testing meeting creation",
        time,
        {
          lat: 43.653225,
          lng: -79.383186,
        }
      );

      console.log(data);
    } catch (error) {
      console.log(error);
    }
  };

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
          onPress={onCreate}
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

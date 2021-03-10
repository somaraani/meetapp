import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
} from "react-native";
import { ApiContext } from "../src/ApiProvider";
import dateFormat from "dateformat";
import { TextInput, Button } from "react-native-paper";

const CreateMeeting = ({ navigation }) => {
  const { createMeeting } = useContext(ApiContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [disabled, setDisabled] = useState(true);

  const onCreate = async () => {
    let time = dateFormat(
      new Date("December 17, 2021 03:24:00"),
      "isoDateTime"
    );

    try {
      let data = await createMeeting(name, description, time, {
        lat: parseFloat(lat),
        lng: parseFloat(lng),
      });

      ToastAndroid.show("Meeting created successfully!", ToastAndroid.SHORT);
      navigation.navigate("Home");
    } catch (error) {
      console.log(error);
      ToastAndroid.show(
        "Unable to create a meeting. Try again.",
        ToastAndroid.SHORT
      );
    }
  };

  useEffect(() => {
    if (name && lat && lng) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, lat, lng]);

  return (
    <View style={{ padding: 25 }}>
      <TextInput
        label="Meeting Name"
        value={name}
        onChangeText={(text) => setName(text)}
        mode="outlined"
        theme={{ colors: { primary: "#2196F3" } }}
        style={styles.input}
      />
      <View style={{ flexDirection: "row" }}>
        <TextInput
          label="Latitude"
          value={lat}
          onChangeText={(text) => setLat(text)}
          mode="outlined"
          theme={{ colors: { primary: "#2196F3" } }}
          style={[styles.input, { flex: 1, marginRight: 20 }]}
          keyboardType="numeric"
        />
        <TextInput
          label="Longitude"
          value={lng}
          onChangeText={(text) => setLng(text)}
          mode="outlined"
          theme={{ colors: { primary: "#2196F3" } }}
          style={[styles.input, { flex: 1 }]}
          keyboardType="numeric"
        />
      </View>

      <TextInput
        label="Meeting Description (optional)"
        value={description}
        onChangeText={(text) => setDescription(text)}
        mode="outlined"
        theme={{ colors: { primary: "#2196F3" } }}
        multiline
        numberOfLines={4}
      />
      <Button
        disabled={disabled}
        mode="contained"
        onPress={onCreate}
        theme={{ colors: { primary: "#2196F3" } }}
        style={{ marginTop: 30 }}
      >
        CREATE
      </Button>
    </View>
  );
};

export default CreateMeeting;

const styles = StyleSheet.create({
  input: {
    marginBottom: 10,
    height: 40,
  },
});

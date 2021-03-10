import React, { useContext, useEffect, useState } from "react";
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ToastAndroid,
  Keyboard,
  Pressable,
} from "react-native";
import { ApiContext } from "../src/ApiProvider";
import dateFormat from "dateformat";
import { TextInput, Button } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { TouchableNativeFeedback } from "react-native-gesture-handler";

const CreateMeeting = ({ navigation }) => {
  const { createMeeting } = useContext(ApiContext);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [lat, setLat] = useState("");
  const [lng, setLng] = useState("");
  const [date, setDate] = useState(new Date());
  const [disabled, setDisabled] = useState(true);
  const [isDatePickerVisible, setDatePickerVisibility] = useState(false);

  const showDatePicker = () => {
    setDatePickerVisibility(true);
  };

  const hideDatePicker = () => {
    setDatePickerVisibility(false);
  };

  const handleConfirm = (date) => {
    setDate(date);
    hideDatePicker();
  };

  const onCreate = async () => {
    try {
      await createMeeting(name, description, date.toISOString(), {
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
    if (name && lat && lng && date) {
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
      <Pressable
        onPress={() => {
          showDatePicker();
          Keyboard.dismiss();
        }}
      >
        <TextInput
          label="Meeting Time"
          mode="outlined"
          style={styles.input}
          editable={false}
          value={date.toLocaleString()}
          onChangeText={(text) => setDate(text)}
        />
      </Pressable>
      <DateTimePickerModal
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
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

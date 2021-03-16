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
import { TextInput, Button } from "react-native-paper";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import moment from "moment";
import config from "../config";

const CreateMeeting = ({ navigation, route }) => {
  const { createMeeting } = useContext(ApiContext);
  const [name, setName] = useState("");
  const [location, setLocation] = useState("");
  const [description, setDescription] = useState("");
  const [date, setDate] = useState(moment().add(1, "d"));
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
        lat: location.coordinates.lat,
        lng: location.coordinates.lng,
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
    if (name && location && date) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [name, date, location]);

  useEffect(() => {
    if (route.params) {
      setLocation(route.params);
    }
  }, [route]);

  return (
    <View style={{ flex: 1, padding: 25 }}>
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
          navigation.navigate("LocationPicker");
          Keyboard.dismiss();
        }}
      >
        <TextInput
          label="Meeting Location"
          mode="outlined"
          style={styles.input}
          editable={false}
          value={location.address}
          onChangeText={(text) => setLocation(text)}
        />
      </Pressable>
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
          value={moment(date).format("MMMM Do YYYY, h:mm a")}
          onChangeText={(text) => setDate(text)}
        />
      </Pressable>
      <DateTimePickerModal
        minimumDate={new Date()}
        isVisible={isDatePickerVisible}
        mode="datetime"
        onConfirm={handleConfirm}
        onCancel={hideDatePicker}
      />
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

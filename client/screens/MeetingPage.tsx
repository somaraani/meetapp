import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";
import { AuthNavProps } from "../src/AuthParamList";

const MeetingPage = ({ route, navigation }: AuthNavProps<"Home">) => {
  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 43.653225,
          longitude: -79.383186,
          latitudeDelta: 0.0922,
          longitudeDelta: 0.0421,
        }}
      />
    </View>
  );
};

export default MeetingPage;

const styles = StyleSheet.create({
  map: {
    width: "100%",
    height: "100%",
  },
});

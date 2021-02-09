import { HeaderTitle } from "@react-navigation/stack";
import React, { useEffect } from "react";
import { StyleSheet, Text, View } from "react-native";
import MapView from "react-native-maps";

const MeetingPage = ({ route, navigation }) => {
  useEffect(() => {
    navigation.setOptions({ title: route.params.title });
  }, [route, navigation]);

  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 10,
          longitude: 10,
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

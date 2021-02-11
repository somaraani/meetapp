import React, { useContext, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";

const MeetingPage = ({ navigation }: AuthNavProps<"Home">) => {
  const { members, latitude, longitude } = useContext(MeetingContext);
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.28;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: latitude,
          longitude: longitude,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker coordinate={{ latitude: latitude, longitude: longitude }} />
        {members &&
          members.map((coord, index) => (
            <Marker key={index} coordinate={coord} pinColor="green" />
          ))}
        {members &&
          members.map((coord, index) => (
            <MapViewDirections
              key={index}
              origin={coord}
              destination={{ latitude: latitude, longitude: longitude }}
              apikey={config.GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="blue"
              onError={(e) => console.log(e)}
            />
          ))}
      </MapView>
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

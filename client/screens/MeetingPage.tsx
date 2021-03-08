import React, { useContext, useEffect } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";

const MeetingPage = ({ navigation }: AuthNavProps<"Home">) => {
  const { latitude, longitude } = useContext(MeetingContext);
  let { members } = useContext(MeetingContext);
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.28;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  return (
    <View>
      <Text>Hello</Text>
      {/* <MapView
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
          members.map((member, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: member.latitude,
                longitude: member.longitude,
              }}
              pinColor="green"
              onPress={() => console.log(member.eta)}
            >
              <Callout
                tooltip={true}
                style={{ backgroundColor: "white", padding: 5 }}
              >
                <Text>Distance: {member.distance} km</Text>
                <Text>Duration: {member.eta} mins</Text>
                <Text>Travel Mode: {member.mode} </Text>
              </Callout>
            </Marker>
          ))}
        {members &&
          members.map((member, index) => (
            <MapViewDirections
              key={index}
              origin={{
                latitude: member.latitude,
                longitude: member.longitude,
              }}
              destination={{ latitude: latitude, longitude: longitude }}
              apikey={config.GOOGLE_MAPS_APIKEY}
              strokeWidth={3}
              strokeColor="blue"
              onError={(e) => console.log(e)}
              onReady={(value) => {
                member.distance = value.distance;
                member.eta = value.duration;
              }}
              mode={member.mode}
            />
          ))}
      </MapView> */}
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

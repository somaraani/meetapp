import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";
import { useFocusEffect } from "@react-navigation/core";
import { ApiContext } from "../src/ApiProvider";
import { SocketEvents } from "@types";

const MeetingPage = ({ route, navigation }: AuthNavProps<"Home">) => {
  const item = useContext(MeetingContext);
  const { apiClient, socketClient } = useContext(ApiContext);
  const { lat, lng } = item.details.location;
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.1;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [members, setMembers] = useState([]);

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      async function getMemberLocations() {
        let temp = [];
        for (let i = 0; i < item.participants.length; i += 1) {
          temp[i] = (
            await apiClient.getJourney(item.participants[i].journeyId)
          ).settings.startLocation;
        }
        console.log(temp);
        setMembers(temp);
      }
      getMemberLocations();
      BackHandler.addEventListener("hardwareBackPress", backAction);

      socketClient.on(SocketEvents.MEMBERUPDATE, () => {
        //triggers when another user joins room
        getMemberLocations();
      });
      return () => {
        socketClient.off(SocketEvents.MEMBERUPDATE);
        BackHandler.addEventListener("hardwareBackPress", backAction);
      };
    }, [])
  );

  return (
    <View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >
        <Marker coordinate={{ latitude: lat, longitude: lng }} />
        {members
          .filter((member) => member)
          .map((member, index) => (
            <Marker
              key={index}
              coordinate={{
                latitude: member.lat,
                longitude: member.lng,
              }}
              pinColor="green"
              onPress={() => console.log("Test")}
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

import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Marker, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";
import { useFocusEffect } from "@react-navigation/core";
import { ApiContext } from "../src/ApiProvider";
import {PolyUtil} from "node-geometry-library";

const MeetingPage = ({ route, navigation }: AuthNavProps<"Home">) => {
  const item = useContext(MeetingContext);
  const { apiClient } = useContext(ApiContext);
  const { lat, lng } = item.details.location;
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.1;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [members, setMembers] = useState([]);
  const [directions, setDirections] = useState([{latitude: 0, longitude: 0}]);

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      async function getMemberLocations() {
        let temp = [];
        for (let i = 0; i < item.participants.length; i += 1) {
          const journey = await apiClient.getJourney(item.participants[i].journeyId);
          temp[i] = journey.settings.startLocation;
          if(journey.userId == apiClient.id) {
            if(journey.path) {
              setDirections(PolyUtil.decode(journey.path).map(s => ({latitude: s.lat, longitude: s.lng})));          
            }
          }
        }
        setMembers(temp);
      }

      getMemberLocations();
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
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

        <Polyline coordinates={directions} strokeColor="blue" strokeWidth={3}>
        </Polyline>
        
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

import React, { useContext, useEffect, useState } from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, LatLng, Marker, Polygon, Polyline } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";
import { ApiContext } from "../src/ApiProvider";
import { Coordinate, MeetingDirectionResponse } from "@types";
import polyline from "polyline";

interface DirectionDetailInterface extends MeetingDirectionResponse{
  path: LatLng[]
} 

const MeetingPage = ({ route, navigation }: AuthNavProps<"Home">) => {
  const {apiClient} = useContext(ApiContext);
  const meeting = useContext<any>(MeetingContext);
  const { lat, lng } = meeting.details.location;
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 10;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  
  const [directionResponse, setDirectionResponse] = useState<DirectionDetailInterface>();
  const [start, setStart] = useState<Coordinate>();

 
  useEffect(() => {
    //TODO get current coords here
    const start = {lat: 43.255569, lng: -79.072433};
    setStart(start);
    loadDirections(start);
  }, []);

  const loadDirections = async (s: Coordinate) => {
    console.log('id');
    console.log(meeting.id);
    const response = await apiClient.getMeetingDirections(meeting.id, s);
    setDirectionResponse({
      ...response,
      path: polyline.decode(response.polyline).map(x => ({ latitude: x[0], longitude: x[1] })),
    });
  }

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
        {
          start &&
          <Marker coordinate={{ latitude: start.lat, longitude: start.lng }} />
        }
        {
          directionResponse &&
          <Polyline coordinates={directionResponse.path} />
        }
        {/* {members &&
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
          ))} */}
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

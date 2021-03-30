import React, { useContext, useEffect, useRef, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, Text, View, Button } from "react-native";
import MapView, { Callout, Camera, EdgePadding, LatLng, Marker, Polyline, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";
import { useFocusEffect } from "@react-navigation/core";
import { ApiContext } from "../src/ApiProvider";
import { PolyUtil } from "node-geometry-library";
import { Card } from "react-native-paper";
import { Coordinate, PublicUserResponse, User } from "@types";
import SlidingUpPanel from 'rn-sliding-up-panel';
import BottomSheet from "../components/BottomSheet";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import moment from "moment";

interface MemberDataInterface {
  startLocation: Coordinate,
  eta: number,
  directions: LatLng[],
  user: PublicUserResponse
}

const formatTimeDiff = (sec_num: number) : string => {
  var hours   = Math.floor(sec_num / 3600) as any;
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60) as any;

  if (hours   < 10) {hours   = "0"+hours;}
  if (minutes < 10) {minutes = "0"+minutes;}
  let s = '';
  if (hours) s += `${hours}h `;
  if (minutes) s += `${minutes}m`;
  return s;
}

const MeetingPage = ({ route, navigation }: AuthNavProps<"Home">) => {
  const item = useContext(MeetingContext);
  const { apiClient } = useContext(ApiContext);
  const { lat, lng } = item.details.location;
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.1;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [members, setMembers] = useState<MemberDataInterface[]>([]);
  const [ttl, setTtl] = useState(new Date());
  const panel = useRef<any>();
  const map = useRef<any>();
  const [selectedMember, setSelectedMember] = useState<MemberDataInterface | null>(null);

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      async function getMemberLocations() {
        let tempMembers = [];
        const members = await apiClient.getUsersFromMeeting(item.id);
        for (let i = 0; i < item.participants.length; i += 1) {
          const participant = item.participants[i];
          const journey = await apiClient.getJourney(participant.journeyId);
          const directions = journey.path ? PolyUtil.decode(journey.path).map(s => ({ latitude: s.lat, longitude: s.lng })) : [];
          tempMembers.push({
            startLocation: journey.settings.startLocation,
            eta: journey.travelTime,
            user: members.find(x => x.id === participant.userId) as PublicUserResponse,
            directions: directions
          });
        }
        setMembers(tempMembers);
      }
      getMemberLocations();
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
      };
    }, [])
  );

  useEffect(() => {
    if (members.length > 0) {
      map.current.fitToElements(true);
    }
  }, [members]);

  useEffect(() => {
    if (selectedMember) {
      map.current.fitToSuppliedMarkers([selectedMember.user.id, 'destination']);
    }
  }, [selectedMember]);

  const currentUser = members.find(x => x.user.id === apiClient.id) as MemberDataInterface;
  return (
    <View>

      <Card>
        <Card.Title title={`You must leave at ${ttl.toLocaleDateString()} at ${ttl.toLocaleTimeString()}`} subtitle={`to make it at ${new Date(item.details.time).toLocaleString()}`} />
      </Card>

      <MapView
        mapPadding={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 400,
        }}
        ref={map}
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      >

        {
          members.map(member => (
            member.directions &&
            <Polyline
              key={member.user.id}
              coordinates={member.directions}
              strokeColor={member.user === currentUser.user ? '#3f50b5' : '#ff7961'}
              strokeWidth={selectedMember?.user === member.user ? 8 : 4}
              tappable
              onPress={() => {
                console.log(`Click on line ${member.user.publicData.username}`)
                setSelectedMember(member);
                panel.current.show();
              }}
            >
            </Polyline>
          ))
        }

        {/* Destination */}
        <Marker identifier='destination' coordinate={{ latitude: lat, longitude: lng }} />

        {members.map((member) => (
          member.startLocation &&
          <Marker
            key={member.user.id}
            identifier={member.user.id}
            coordinate={{
              latitude: member.startLocation.lat,
              longitude: member.startLocation.lng,
            }}
            pinColor="green"
            onPress={() => {
              console.log(`Click on ${member.user.publicData.username}`);
              setSelectedMember(member);
            }}
          />
        ))}
      </MapView>
      <BottomSheet twoLevels={false} height={height * 0.45} panelRef={panel} onClose={() => setSelectedMember(null)}>
        <View
          style={{ 
            alignItems: 'center' 
          }}
        >
          <Avatar
            size="medium"
            rounded
            titleStyle={{ color: "white" }}
            containerStyle={{ backgroundColor: "#2196F3" }}
            source={{ uri: selectedMember?.user?.publicData.displayPicture }}
          />
           <Text style={{
             marginTop: 10,
             fontSize:20
           }}>
              {selectedMember?.user.publicData.username}
            </Text>
        </View>
        <View
          style={{ 
            paddingLeft: 50,
            marginTop: 10
          }}
        >
          {
            selectedMember ?
            <Text>
              Eta: {formatTimeDiff(selectedMember.eta)}
            </Text>
            :
            // loading component
            <Text>
              Loading...
            </Text>
          }
        </View>
      </BottomSheet>
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

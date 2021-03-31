import React, { useContext, useEffect, useRef, useState } from "react";
import { BackHandler, Dimensions, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Camera, EdgePadding, LatLng, Marker, Polyline, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";
import { useFocusEffect } from "@react-navigation/core";
import ApiProvider, { ApiContext } from "../src/ApiProvider";
import { PolyUtil } from "node-geometry-library";
import { ActivityIndicator, Card } from "react-native-paper";
import { Coordinate, JourneyStatus, Meeting, MeetingStatus, PublicUserResponse, SocketEvents, UpdateLocationResponse, User } from "@types";
import SlidingUpPanel from 'rn-sliding-up-panel';
import BottomSheet from "../components/BottomSheet";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import moment from "moment";
import { Button } from "react-native-paper";

interface MemberDataInterface {
  startLocation: Coordinate,
  eta: number,
  directions: LatLng[],
  user: PublicUserResponse,
  currentLocation?: Coordinate
}

//Update Location Interval (ms)
const UPDATE_LOC_INTERVAL = 100 * 1000

const formatTimeDiff = (sec_num: number): string => {
  var hours = Math.floor(sec_num / 3600) as any;
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60) as any;

  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  let s = '';
  if (hours) s += `${hours}h `;
  if (minutes) s += `${minutes}m`;
  return s;
}

const MeetingPage = ({ route, navigation }: AuthNavProps<"Home">) => {
  const item = useContext(MeetingContext);
  const [meeting, setMeeting] = useState(item);
  const { apiClient, socketClient } = useContext(ApiContext);
  const { lat, lng } = meeting.details.location;
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 0.1;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [members, setMembers] = useState<MemberDataInterface[]>([]);
  const [ttl, setTtl] = useState(new Date());
  const panel = useRef<any>();
  const map = useRef<any>();
  const updateLocationInterval = useRef<NodeJS.Timeout>();
  const [currentUser, setCurrentUser] = useState<MemberDataInterface>({} as MemberDataInterface);
  const [selectedMember, setSelectedMember] = useState<MemberDataInterface | null>(null);
  const [journeyStarted, setJourneyStarted] = useState<boolean>(false);

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  const initUpdateLocation = () => {
    updateLocationInterval.current && clearInterval(updateLocationInterval.current);
    let point = 20;
    const updateLocation = () => {
      const currentCord: Coordinate = {
        lat: currentUser.directions[point].latitude,
        lng: currentUser.directions[point].longitude,
      }
      //auto move up 20 directions
      point += 20;
      if (currentUser.directions.length <= point) {
        updateLocationInterval.current && clearInterval(updateLocationInterval.current);
        return;
      }
      socketClient.updateLocation({
        location: currentCord,
        meetingId: meeting.id,
        userId: currentUser.user.id
      })
    }
    updateLocation();
    updateLocationInterval.current = setInterval(() => {
      updateLocation();
    }, UPDATE_LOC_INTERVAL);
  }

  useFocusEffect(
    React.useCallback(() => {
      async function getMemberLocations() {
        let tempMembers = [];
        const members = await apiClient.getUsersFromMeeting(meeting.id);
        for (let i = 0; i < meeting.participants.length; i += 1) {
          const participant = meeting.participants[i];
          const journey = await apiClient.getJourney(participant.journeyId);
          const directions = journey.path ? PolyUtil.decode(journey.path).map(s => ({ latitude: s.lat, longitude: s.lng })) : [];
          const member: MemberDataInterface = {
            startLocation: journey.settings.startLocation,
            eta: journey.travelTime,
            user: members.find(x => x.id === participant.userId) as PublicUserResponse,
            directions: directions,
            currentLocation: journey.locations.length > 1 ? journey.locations[journey.locations.length - 1] : undefined
          }
          tempMembers.push(member);
          if (journey.userId == apiClient.id) {
            if (journey.path) {
              setCurrentUser(member);
              setTtl(new Date(new Date(meeting.details.time).getTime() - journey.travelTime * 1000));
              setSelectedMember(member);
              const journeyStarted = journey.status === JourneyStatus.ACTIVE;
              setJourneyStarted(journeyStarted);
            }
          }
        }
        setMembers(tempMembers);
        map.current.fitToElements(true);
      }

      getMemberLocations();
      BackHandler.addEventListener("hardwareBackPress", backAction);
      socketClient.on(SocketEvents.MEETINGUPDATE, (meeting: Meeting) => {
        setMeeting(meeting);
      });
      socketClient.on(SocketEvents.MEMBERJOURNEYUPDATE, async () => {
        getMemberLocations();
      });
      socketClient.on(SocketEvents.LOCATION, (response: UpdateLocationResponse) => {
        setMembers((old: MemberDataInterface[]) => {
          const newList = old.map(x => {
              if (x.user.id === response.userId){
              return {...x, eta: response.eta, currentLocation: response.location}
            }
            return{...x}
          });
          console.log('after')
          console.log(newList.map(x => x.eta))
          return [...newList];
        });
      });
      return () => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
        updateLocationInterval.current && clearInterval(updateLocationInterval.current);
        socketClient.off(SocketEvents.MEETINGUPDATE);
        socketClient.off(SocketEvents.LOCATION);
        socketClient.off(SocketEvents.MEMBERJOURNEYUPDATE);
      };
    }, [])
  );

  // useEffect(() => {
  //   if (selectedMember){
  //       setSelectedMember((old:MemberDataInterface | null) => {
  //         const current = members.find(x => x.user.id === old?.user.id) as MemberDataInterface;
  //         return current;
  //     })
  //   }
  // },[members])

  useEffect(() => {
    if (selectedMember) {
      panel.current.show();
      map.current.fitToSuppliedMarkers([selectedMember.user.id, 'destination']);
    }
  }, [selectedMember]);

  useEffect(() => {
    if (journeyStarted) {
      initUpdateLocation();
    }
  }, [journeyStarted]);

  return (
    <View>

      <Card>
        {
          currentUser.eta &&
            <Card.Title title={`You must leave at ${ttl.toLocaleDateString()} at ${ttl.toLocaleTimeString()}`} subtitle={`to make it at ${new Date(meeting.details.time).toLocaleString()}`} />
        }
        {
          currentUser.eta && !journeyStarted &&
          <Button color='blue' onPress={() => {
            setJourneyStarted(true);
          }}>
            Start
          </Button>
        }
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
          members.filter(x => x.startLocation).map(member => (
            <Polyline
              key={member.user.id}
              coordinates={member.directions}
              strokeColor={member.user === currentUser?.user ? '#3f50b5' : '#ff7961'}
              strokeWidth={selectedMember?.user === member.user ? 6 : 4}
              tappable
              onPress={() => {
                console.log(`Click on line ${member.user.publicData.username}`)
                setSelectedMember(member);
              }}
            >
            </Polyline>
          ))
        }

        {/* Destination */}
        <Marker identifier='destination' coordinate={{ latitude: lat, longitude: lng }} />

        {members.filter(x => x.startLocation).map((member) => (
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
        {members.filter(x => x.currentLocation).map((member) => (
          member.currentLocation &&
          <Marker
            key={member.user.id}
            coordinate={{
              latitude: member.currentLocation.lat,
              longitude: member.currentLocation.lng,
            }}
            pinColor="black"
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
            fontSize: 20
          }}>
            {selectedMember?.user.publicData.username}
          </Text>
        </View>
        <View
          style={{
            paddingLeft: 50,
            paddingRight: 50,
            marginTop: 10
          }}
        >
          {
            selectedMember ?
              <View>
                <Text>
                  Eta: {formatTimeDiff(selectedMember.eta)}
                </Text>

              </View>
              :
              <ActivityIndicator />
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

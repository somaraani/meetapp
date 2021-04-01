import React, { useContext, useEffect, useRef, useState } from "react";
import { Alert, BackHandler, Dimensions, PixelRatio, Platform, Pressable, StyleSheet, Text, View } from "react-native";
import MapView, { Callout, Camera, EdgePadding, LatLng, Marker, Polyline, Region } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { AuthNavProps } from "../src/AuthParamList";
import config from "../config";
import { MeetingContext } from "../src/MeetingContext";
import { useFocusEffect } from "@react-navigation/core";
import ApiProvider, { ApiContext } from "../src/ApiProvider";
import { PolyUtil } from "node-geometry-library";
import { ActivityIndicator, Card, ProgressBar, Colors, Divider } from "react-native-paper";
import { Coordinate, Journey, JourneyStatus, Meeting, MeetingStatus, PublicUserResponse, SocketEvents, UpdateLocationResponse, User } from "@types";
import SlidingUpPanel from 'rn-sliding-up-panel';
import BottomSheet from "../components/BottomSheet";
import { Avatar } from "react-native-elements/dist/avatar/Avatar";
import moment from "moment";
import { Button } from "react-native-paper";

interface MemberDataInterface {
  startLocation: Coordinate,
  eta: number,
  originalEta: number,
  journeyStatus: string,
  directions: LatLng[],
  user: PublicUserResponse,
  currentLocation?: Coordinate,
  color: string
}


const memberColors = [
  Colors.purple300,
  Colors.red300,
  Colors.teal300,
  Colors.blue300
]

const { height, width } = Dimensions.get("window");

//Update Location Interval (ms)
const UPDATE_LOC_INTERVAL = 5 * 1000

const formatTimeDiff = (sec_num: number): string => {
  var hours = Math.floor(sec_num / 3600) as any;
  var minutes = Math.floor((sec_num - (hours * 3600)) / 60) as any;
  const zeroHours = hours === 0;
  if (hours < 10) { hours = "0" + hours; }
  if (minutes < 10) { minutes = "0" + minutes; }
  let s = '';
  if (!zeroHours) s += `${hours}h `;
  s += `${minutes}m`;
  return s;
}

const STARTING_SHEET_HEIGHT = 130;
const FULL_SHEET_HEIGHT = 300;

const MeetingPage = ({ route, navigation }: AuthNavProps<"Home">) => {
  const item = useContext(MeetingContext);
  const [meeting, setMeeting] = useState(item);
  const { apiClient, socketClient } = useContext(ApiContext);
  const { lat, lng } = meeting.details.location;
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
  const [sliderOpen, setSliderOpen] = useState<boolean>(false);

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  const initUpdateLocation = () => {
    updateLocationInterval.current && clearInterval(updateLocationInterval.current);
    let point = 0;
    const updateLocation = () => {
      point += Math.round(currentUser.directions.length / 3);
      point = Math.min(point, currentUser.directions.length - 1);
      const currentCord: Coordinate = {
        lat: currentUser.directions[point].latitude,
        lng: currentUser.directions[point].longitude,
      }
      //auto move up 20 directions
      socketClient.updateLocation({
        location: currentCord,
        meetingId: meeting.id,
        userId: currentUser.user.id
      });

      if (currentUser.directions.length - 1 === point) {
        updateLocationInterval.current && clearInterval(updateLocationInterval.current);
        return;
      }
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
            journeyStatus: journey.status,
            originalEta: journey.originalTravelTime,
            user: members.find(x => x.id === participant.userId) as PublicUserResponse,
            directions: directions,
            color: memberColors[i % meeting.participants.length],
            currentLocation: journey.locations.length > 1 ? journey.locations[journey.locations.length - 1] : undefined,
          }
          tempMembers.push(member);
          if (journey.userId == apiClient.id) {
            setCurrentUser(member);
            const journeyStarted = journey.status === JourneyStatus.ACTIVE;
            setJourneyStarted(journeyStarted);
            if (journey.path) {
              setTtl(new Date(new Date(meeting.details.time).getTime() - journey.travelTime * 1000));
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
            if (x.user.id === response.userId) {
              return { ...x, eta: response.eta, currentLocation: response.location, journeyStatus: response.journeyStatus }
            }
            return { ...x }
          });
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

  useEffect(() => {
    //update references
    if (selectedMember) {
      setSelectedMember((old: MemberDataInterface | null) => {
        const current = members.find(x => x.user.id === old?.user.id) as MemberDataInterface;
        return current;
      })
    }
    if (currentUser) {
      setCurrentUser((old: MemberDataInterface | null) => {
        const current = members.find(x => x.user.id === old?.user.id) as MemberDataInterface;
        return current;
      })
    }
  }, [members])

  useEffect(() => {
    if (selectedMember) {
      setSliderOpen(true);
      map.current.fitToSuppliedMarkers([selectedMember.user.id, 'destination']);
    }
    else{
      setSliderOpen(false);
    }
  }, [selectedMember?.user.id]);

  useEffect(() => {
    if (currentUser){
      setJourneyStarted(currentUser.journeyStatus === JourneyStatus.ACTIVE)
    }
  }, [currentUser])

  useEffect(() => {
    if (journeyStarted) {
      if (currentUser.journeyStatus === JourneyStatus.COMPLETE) {
        return;
      }
      initUpdateLocation();
    }
  }, [journeyStarted]);

  useEffect(() => {
    if (sliderOpen){
      panel.current.show(STARTING_SHEET_HEIGHT);
    }
    else{
      panel.current.hide();
    }
  }, [sliderOpen])
  if (!currentUser) return <ActivityIndicator />
  return (
    <View>
      <MapView
        mapPadding={{
          top: 0,
          left: 0,
          right: 0,
          bottom: 400
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
              strokeColor={member.color}
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
            pinColor={member.color}
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
            pinColor={member.color}
          />
        ))}
      </MapView>
      <BottomSheet fullHeight={FULL_SHEET_HEIGHT} startingHeight={STARTING_SHEET_HEIGHT} panelRef={panel} onClose={() => setSelectedMember(null)}>
        <View
          style={{
            alignItems: 'center',
          }}
        >
          <View style={{}}>
            {
              currentUser.eta && !journeyStarted && currentUser.journeyStatus === JourneyStatus.PENDING &&
              <View>
              <Text>
                Leave at:          {ttl.toLocaleDateString()} {ttl.toLocaleTimeString()}
              </Text>
              <Text>
                Meeting time:  {new Date(meeting.details.time).toLocaleDateString()} {new Date(meeting.details.time).toLocaleTimeString()}
              </Text>
              </View>
            }
            {
              currentUser.eta && currentUser.journeyStatus === JourneyStatus.COMPLETE &&
              <Text>
                Journey completed
              </Text>
            }
             {
              currentUser.eta && journeyStarted && currentUser.journeyStatus === JourneyStatus.ACTIVE &&
              <Text>
                In progress
              </Text>
              }
            {
              currentUser.eta && !journeyStarted && currentUser.journeyStatus !== JourneyStatus.COMPLETE &&
              <Button color='blue' onPress={() => {
                setJourneyStarted(true);
              }}>
                Start
              </Button>
            }
          </View>
        </View>

        <View
          style={{
            paddingLeft: 50,
            paddingRight: 50,
            marginTop: 20
          }}
        >
          {
            selectedMember ?
              <View>
                {
                  [members.find(x => x.user.id === currentUser.user.id) as MemberDataInterface, ...members.filter(x => x.user.id !== currentUser.user.id)].map((x,i) => {
                    const completed = x.journeyStatus === JourneyStatus.COMPLETE;
                    const progress = completed ? 1 : 1 - x.eta/x.originalEta;
                    return (
                      <Pressable onTouchEnd={() => {
                        setSelectedMember(x);
                      }}>
                      <View style={{marginBottom: 20, flexDirection:'row', alignItems:'center'}}>
                        <Avatar
                          size="small"
                          rounded
                          source={{ uri: selectedMember?.user?.publicData.displayPicture }}
                        />
                            <View style={{marginLeft:10, width:'85%'}}>

                            <View style={{flexDirection:'row', justifyContent:'space-between'}}>
                              <Text style={{
                                fontWeight: selectedMember.user.id === x.user.id ? 'bold' : 'normal'
                              }}
                              >
                                {currentUser.user.id === x.user.id ? 'You' : x.user.publicData.username}
                              </Text>
                                <Text
                                  style={{
                                    fontWeight: selectedMember.user.id === x.user.id ? 'bold' : 'normal'
                                  }}
                                >
                                  {completed ? 'completed' : formatTimeDiff(x.eta)}
                              </Text>
                          </View>

                            <ProgressBar  progress={progress} color={x.color}
                              style={{
                                height : selectedMember.user.id === x.user.id ? 4 : 3
                              }}
                            />
                          </View>
                      </View>
                      {
                        members.length && i === 0 &&
                          <Divider style ={{marginBottom: 15}} />
                      }
                      </Pressable>
                    )
                  })
                }
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

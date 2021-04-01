import { useFocusEffect } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import Community from "react-native-vector-icons/MaterialCommunityIcons";
import { ApiContext } from "../src/ApiProvider";
import { MeetingContext } from "../src/MeetingContext";
import Geocoder from "react-native-geocoding";

const MeetingSettings = ({ navigation, route }) => {
  const { apiClient } = useContext(ApiContext);
  const meetingData = useContext(MeetingContext);
  const [location, setLocation] = useState("");
  const [travel, setTravel] = useState("");

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  useEffect(() => {
    if (route.params) {
      setLocation(route.params);
    }
  }, [route]);

  useFocusEffect(
    React.useCallback(() => {
      async function getLocation() {
        try {
          let uId = (await apiClient.getUser()).id;
          let journeyId = meetingData.participants.find((x) => x.userId === uId)
            .journeyId;
          let settings = (await apiClient.getJourney(journeyId)).settings;
          setTravel(settings.travelMode);
          if (settings.startLocation) {
            let coords = settings.startLocation;
            let json = await Geocoder.from(coords);
            let address = json.results[0].formatted_address;

            setLocation(address);
          } else {
            setLocation("Location Not Set");
          }
        } catch (error) {
          console.log(error);
        }
      }

      getLocation();
      BackHandler.addEventListener("hardwareBackPress", backAction);
      return () => {
        BackHandler.addEventListener("hardwareBackPress", backAction);
      };
    }, [])
  );

  return (
    <View>
      <ListItem
        bottomDivider
        onPress={() => navigation.navigate("StartLocationPicker")}
      >
        <Icon name="edit-location" size={24} />
        <ListItem.Content>
          <ListItem.Title>Set Starting Location</ListItem.Title>
          <ListItem.Subtitle>{location}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
      <ListItem
        bottomDivider
        onPress={() => navigation.navigate("StartLocationPicker")}
      >
        <Community name="car" size={24} />
        <ListItem.Content>
          <ListItem.Title>Travel Mode</ListItem.Title>
          <ListItem.Subtitle>{travel}</ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

export default MeetingSettings;

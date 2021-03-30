import { useFocusEffect } from "@react-navigation/core";
import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Text, View } from "react-native";
import { ListItem } from "react-native-elements";
import Icon from "react-native-vector-icons/MaterialIcons";
import { ApiContext } from "../src/ApiProvider";
import { MeetingContext } from "../src/MeetingContext";
import Geocoder from "react-native-geocoding";

const MeetingSettings = ({ navigation, route }) => {
  const { apiClient } = useContext(ApiContext);
  const meetingData = useContext(MeetingContext);
  const [location, setLocation] = useState("");

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
          if (settings.startLocation) {
            let coords = settings.startLocation;
            let json = await Geocoder.from(coords);
            let address = json.results[0].formatted_address;
            setLocation(address);
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
      <ListItem onPress={() => navigation.navigate("StartLocationPicker")}>
        <Icon name="edit-location" size={24} />
        <ListItem.Content>
          <ListItem.Title>Set Starting Location</ListItem.Title>
          <ListItem.Subtitle>
            {location ? location : "Location Not Set"}
          </ListItem.Subtitle>
        </ListItem.Content>
      </ListItem>
    </View>
  );
};

export default MeetingSettings;

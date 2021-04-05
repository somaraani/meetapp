import { useFocusEffect } from "@react-navigation/core";
import { SocketEvents } from "@types";
import React, { useContext, useEffect, useState } from "react";
import {
  BackHandler,
  StyleSheet,
  Text,
  View,
  ScrollView,
  ToastAndroid,
} from "react-native";
import { Button, Icon, ListItem } from "react-native-elements";
import { ApiContext } from "../src/ApiProvider";

const Invites = ({ navigation }) => {
  const { apiClient, socketClient } = useContext(ApiContext);
  const [invites, setInvites] = useState(null);

  async function getInvites() {
    try {
      let user = await apiClient.getUser();
      let data = await apiClient.getInvitations({ userId: user.id });
      let allData = data.filter((x) => x.status === "pending");
      for (let i = 0; i < allData.length; i++) {
        try {
          let meetData = await apiClient.getMeeting(allData[i].meetingId);
          let sender = await apiClient.getPublicUser(meetData.ownerId);
          console.log(meetData.ownerId);
          allData[i] = { ...allData[i], meetData, sender };
        } catch (error) {
          console.log(error);
        }
      }
      setInvites(allData);
    } catch (error) {
      console.log(error);
    }
  }
  const backAction = () => {
    navigation.navigate("Meetings");
    return true;
  };

  const acceptInvite = async (x) => {
    try {
      let data = await apiClient.updateInvitation(x.id, true);
      getInvites();
      ToastAndroid.show("Invitation Accepted!", ToastAndroid.SHORT);
    } catch (error) {
      console.log(error);
    }
  };

  const declineInvite = async (x) => {
    try {
      let data = await apiClient.updateInvitation(x.id, false);
      getInvites();
      ToastAndroid.show("Invitation Declined!", ToastAndroid.SHORT);
    } catch (error) {
      ToastAndroid.show(error.response.data.message, ToastAndroid.SHORT);
    }
  };

  useEffect(() => {
    BackHandler.addEventListener("hardwareBackPress", backAction);
    return () => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
    };
  }, []);

  useFocusEffect(
    React.useCallback(() => {
      getInvites();
      socketClient.on(SocketEvents.INVITATION, () => {
        console.log("New invite");
        getInvites();
      });
      return () => {
        //remove listner on unmount
        socketClient.off(SocketEvents.INVITATION);
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {};
    }, [])
  );

  if (!invites) {
    return null;
  } else if (invites && invites.length === 0) {
    return (
      <View style={{ flex: 1, alignItems: "center", justifyContent: "center" }}>
        <Text>No Pending Invites</Text>
      </View>
    );
  } else {
    return (
      <View style={{ flex: 1, padding: 10 }}>
        <ScrollView>
          {invites.map((x, i) => (
            <ListItem key={i} bottomDivider>
              <ListItem.Content>
                <ListItem.Title>
                  Invitation to join{" "}
                  <Text style={{ fontWeight: "bold" }}>
                    {x.meetData.details.name}
                  </Text>
                </ListItem.Title>
                <ListItem.Subtitle>
                  From {x.sender.displayName}
                </ListItem.Subtitle>
              </ListItem.Content>
              <View style={{ flexDirection: "row" }}>
                <Button
                  icon={<Icon name="check" color="white" size={18} />}
                  containerStyle={{ marginRight: 5 }}
                  onPress={() => acceptInvite(x)}
                />
                <Button
                  buttonStyle={{ backgroundColor: "#F66161" }}
                  icon={<Icon name="close" color="white" size={18} />}
                  onPress={() => declineInvite(x)}
                />
              </View>
            </ListItem>
          ))}
        </ScrollView>
      </View>
    );
  }
};

export default Invites;

const styles = StyleSheet.create({});

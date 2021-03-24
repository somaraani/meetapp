import { useFocusEffect } from "@react-navigation/core";
import { SocketEvents } from "@types";
import React, { useContext, useState } from "react";
import { BackHandler, StyleSheet, Text, View } from "react-native";
import { Button, Icon, ListItem } from "react-native-elements";
import { ApiContext } from "../src/ApiProvider";

const Invites = ({ navigation }) => {
  const { apiClient, socketClient } = useContext(ApiContext);
  const [invites, setInvites] = useState([]);

  async function getMeetingData(id) {
    let data = await apiClient.getMeeting(id);
    return data;
  }

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  const acceptInvite = async (x) => {
    try {
      let data = await apiClient.updateInvitation(x.id, true);
    } catch (error) {
      console.log(error);
    }
  };

  const declineInvite = async (x) => {
    try {
      let data = await apiClient.updateInvitation(x.id, false);
    } catch (error) {
      console.log(error);
    }
  };

  useFocusEffect(
    React.useCallback(() => {
      BackHandler.addEventListener("hardwareBackPress", backAction);
      async function getInvites() {
        let user = await apiClient.getUser();
        let data = await apiClient.getInvitations({ userId: user.id });
        setInvites(data);
      }
      getInvites();
      socketClient.on(SocketEvents.INVITATION, () => {
        console.log("New invite");
        getInvites();
      });
      return () => {
        //remove listner on unmount
        BackHandler.addEventListener("hardwareBackPress", backAction);
        socketClient.off(SocketEvents.INVITATION);
      };
    }, [])
  );

  useFocusEffect(
    React.useCallback(() => {
      return () => {};
    }, [])
  );

  return (
    <View>
      {invites.map((x, i) => (
        <ListItem key={i} bottomDivider>
          <ListItem.Content>
            <ListItem.Title>{x.meetingId}</ListItem.Title>
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
    </View>
  );
};

export default Invites;

const styles = StyleSheet.create({});

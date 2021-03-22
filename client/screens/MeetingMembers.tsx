import { StackActions } from "@react-navigation/routers";
import { PublicUserResponse, SocketEvents } from "@types";
import React, { useContext, useEffect, useState } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { Text, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Button } from "react-native-paper";
import { ApiContext } from "../src/ApiProvider";
import { MeetingContext } from "../src/MeetingContext";
import { useNotificationContext } from "../src/NotificationProvider";

const MeetingMembers = () => {
  const meetingId = 0;
  const [users, setUsers] = useState<PublicUserResponse[]>();
  const { id } = useContext<any>(MeetingContext);
  const { apiClient, socketClient } = useContext(ApiContext);
  const getMeetingUsers = async () => {
    let meetingUsers = await apiClient.getUsersFromMeeting(id);
    setUsers(meetingUsers);
  }

  useEffect(() => {
    getMeetingUsers();

    socketClient.on(SocketEvents.MEMBERUPDATE, () => {
      //triggers when another user joins room
      getMeetingUsers();
    })
    return () => {
      //remove listner on unmount
      socketClient.off(SocketEvents.MEMBERUPDATE)
    }
  }, []);

  return (
    <View>
      {
        users && users.map((m,i) => (
          <ListItem
            key={i}
            bottomDivider
          >
            <Avatar
              size="medium"
              rounded
              titleStyle={{ color: "white" }}
              containerStyle={{ backgroundColor: "#2196F3" }}
              source={require("../assets/profile.jpg")}
            />
            <ListItem.Content>
              <ListItem.Title>{m.publicData.displayName}</ListItem.Title>
              <ListItem.Subtitle>
                User
              </ListItem.Subtitle>
            </ListItem.Content>
          </ListItem>
        ))
      }
    </View>
  );
};

export default MeetingMembers;

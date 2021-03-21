import { StackActions } from "@react-navigation/routers";
import { PublicUserResponse, SocketEvents } from "@types";
import React, { useContext, useEffect, useState } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { Text, View } from "react-native";
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
      <Text>Meeting Members</Text>
      
      {/* Boiler Plate */}
      <Button onPress={async () => {
        
      }}>
        Invite User Test
      </Button>

      {
        users && users.map(x => (
          <Text key={x.id}>{x.publicData.displayName}</Text>
        ))
      }
    </View>
  );
};

export default MeetingMembers;

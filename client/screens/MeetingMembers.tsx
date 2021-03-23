import { StackActions } from "@react-navigation/routers";
import { PublicUserResponse, SocketEvents } from "@types";
import React, { useContext, useEffect, useState } from "react";
import { unstable_renderSubtreeIntoContainer } from "react-dom";
import { BackHandler, Pressable, Text, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { Button } from "react-native-paper";
import { ApiContext } from "../src/ApiProvider";
import { MeetingContext } from "../src/MeetingContext";
import { useNotificationContext } from "../src/NotificationProvider";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useIsFocused } from "@react-navigation/core";
import { TouchableOpacity } from "react-native-gesture-handler";

const MeetingMembers = ({navigation}) => {
  const meetingId = 0;
  const [users, setUsers] = useState<PublicUserResponse[]>();
  const { id } = useContext<any>(MeetingContext);
  const { apiClient, socketClient } = useContext(ApiContext);
  const getMeetingUsers = async () => {
    let meetingUsers = await apiClient.getUsersFromMeeting(id);
    setUsers(meetingUsers);
  }

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  }

  useFocusEffect(
    React.useCallback(() => {
      console.log("Enter")
    getMeetingUsers();
    BackHandler.addEventListener("hardwareBackPress", backAction);
    socketClient.on(SocketEvents.MEMBERUPDATE, () => {
      //triggers when another user joins room
      getMeetingUsers();
    })
    return () => {
      //remove listner on unmount
      socketClient.off(SocketEvents.MEMBERUPDATE)
      console.log("Leave")
      BackHandler.addEventListener("hardwareBackPress", backAction);
    }
    }, [])
  );

  return (
    <View style={{position: 'relative', flex: 1}}>
      {
        users && users.map((m,i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() => console.log(m.id)}
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
      <Pressable style={{position: "absolute", bottom: 15, padding: 10, borderRadius: 100, alignSelf: 'center', backgroundColor: '#2196F3'}} onPress={() => navigation.navigate("InviteMembers")}><Icon name="person-add-alt-1" color="white" size={35} ></Icon></Pressable>
    </View>
  );
};

export default MeetingMembers;

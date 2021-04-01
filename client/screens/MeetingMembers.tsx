import { PublicUserResponse, SocketEvents } from "@types";
import React, { useContext, useEffect, useState } from "react";
import { BackHandler, Pressable, Text, View, ScrollView } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { ApiContext } from "../src/ApiProvider";
import { MeetingContext } from "../src/MeetingContext";
import Icon from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useIsFocused } from "@react-navigation/core";

const MeetingMembers = ({ navigation }) => {
  const meetingData = useContext(MeetingContext);
  const [users, setUsers] = useState<PublicUserResponse[]>();
  const { id, ownerId } = useContext<any>(MeetingContext);
  const { apiClient, socketClient } = useContext(ApiContext);
  const [owner, setOwner] = useState(false);

  const getMeetingUsers = async () => {
    let meetingUsers = await apiClient.getUsersFromMeeting(id);

    let tempList = [];

    for (let i = 0; i < meetingUsers.length; i++) {
      try {
        let d = await apiClient.getJourney(
          meetingData.participants.find((x) => x.userId === meetingUsers[i].id)
            .journeyId
        );
        tempList.push({ ...meetingUsers[i], eta: d.travelTime });
      } catch (error) {
        console.log(error);
      }
    }

    setUsers(tempList);
  };

  const backAction = () => {
    navigation.navigate("Home");
    return true;
  };

  useFocusEffect(
    React.useCallback(() => {
      async function isOwner() {
        let userId = (await apiClient.getUser()).id;
        setOwner(ownerId === userId);
      }
      isOwner();
      getMeetingUsers();
      BackHandler.addEventListener("hardwareBackPress", backAction);
      socketClient.on(SocketEvents.MEMBERUPDATE, () => {
        //triggers when another user joins room
        getMeetingUsers();
      });

      return () => {
        //remove listner on unmount
        socketClient.off(SocketEvents.MEMBERUPDATE);
        BackHandler.addEventListener("hardwareBackPress", backAction);
      };
    }, [])
  );

  return (
    <View style={{ position: "relative", flex: 1 }}>
      <ScrollView>
        {users &&
          users.map((m, i) => (
            <ListItem key={i} bottomDivider>
              <Avatar
                size="medium"
                rounded
                titleStyle={{ color: "white" }}
                containerStyle={{ backgroundColor: "#2196F3" }}
                source={require("../assets/profile.jpg")}
              />
              <ListItem.Content>
                <ListItem.Title>{m.publicData.displayName} </ListItem.Title>
                <ListItem.Subtitle>
                  ETA: {m.eta ? `${m.eta} mins` : "N/A"}
                </ListItem.Subtitle>
              </ListItem.Content>
              {m.id === ownerId ? (
                <Text
                  style={{
                    color: "#2196F3",
                  }}
                >
                  owner
                </Text>
              ) : null}
            </ListItem>
          ))}
      </ScrollView>
      <Pressable
        style={{
          position: "absolute",
          bottom: 15,
          alignSelf: "center",
        }}
        onPress={() => navigation.navigate("InviteMembers")}
      >
        <View
          style={{
            display: owner ? "flex" : "none",
            borderRadius: 100,
            backgroundColor: "#2196F3",
            padding: 10,
          }}
        >
          <Icon name="person-add-alt-1" color="white" size={35}></Icon>
        </View>
      </Pressable>
    </View>
  );
};

export default MeetingMembers;

import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, ToastAndroid, View } from "react-native";
import { Avatar, ListItem } from "react-native-elements";
import { TextInput } from "react-native-paper";
import { ApiContext } from "../src/ApiProvider";
import { MeetingContext } from "../src/MeetingContext";

const InviteMembers = ({ navigation }) => {
  const [search, setSearch] = useState("");
  const [results, setResults] = useState([]);
  const { apiClient } = useContext(ApiContext);
  const meetingData = useContext(MeetingContext);

  useEffect(() => {
    async function getResults() {
      let data = await apiClient.getUsers(search);
      if (search) {
        setResults(data);
      } else {
        setResults([]);
      }
    }

    getResults();
  }, [search]);

  async function sendInvite(user, meeting) {
    try {
      let data = await apiClient.createInvitation(user, meeting);
      console.log(data);
      ToastAndroid.show("Invite Sent", ToastAndroid.SHORT);
      navigation.navigate("MeetingMembers");
    } catch (error) {
      console.log(error);
    }
  }

  return (
    <View style={{ flex: 1, padding: 10 }}>
      <TextInput
        style={{ marginBottom: 10, height: 40 }}
        placeholder="Search by name or username"
        mode="outlined"
        theme={{ colors: { primary: "#2196F3" } }}
        value={search}
        onChangeText={(text) => setSearch(text)}
      />
      {results.map((m, i) => (
        <ListItem
          key={i}
          bottomDivider
          onPress={() => sendInvite(m.id, meetingData.id)}
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
            <ListItem.Subtitle>{m.publicData.username}</ListItem.Subtitle>
          </ListItem.Content>
        </ListItem>
      ))}
    </View>
  );
};

export default InviteMembers;

const styles = StyleSheet.create({});

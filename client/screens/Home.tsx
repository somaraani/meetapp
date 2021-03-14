import { useIsFocused } from "@react-navigation/core";
import { Meeting } from "@types";
import React, { useContext, useEffect, useState } from "react";
import { StyleSheet, Text, View, Image } from "react-native";
import { ApiContext } from "../src/ApiProvider";
import { AuthNavProps } from "../src/AuthParamList";
import { Avatar, ListItem } from "react-native-elements";
import moment from "moment";

const Home = ({ navigation }: AuthNavProps<"Home">) => {
  const { getMeetings } = useContext(ApiContext);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const isFocused = useIsFocused();

  useEffect(() => {
    async function fetchMeetings() {
      try {
        let meetingList = await getMeetings();
        setMeetings(meetingList.reverse());
        // console.log(meetings);
      } catch (error) {
        console.log(error);
      }
    }

    fetchMeetings();
  }, [isFocused]);

  if (meetings.length === 0) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Image
          source={require("../assets/empty.png")}
          style={{ marginBottom: 30 }}
        />
        <Text style={{ maxWidth: "80%", textAlign: "center", fontSize: 18 }}>
          No Meetings to show. Get started by creating a new meeting!
        </Text>
      </View>
    );
  } else {
    return (
      <View style={styles.container}>
        {meetings.map((m, i) => (
          <ListItem
            key={i}
            bottomDivider
            onPress={() => navigation.navigate("MeetingTabs", m)}
          >
            <Avatar
              size="medium"
              rounded
              title={m.details.name.substring(0, 2)}
              titleStyle={{ color: "white" }}
              containerStyle={{ backgroundColor: "#2196F3" }}
            />
            <ListItem.Content>
              <ListItem.Title>{m.details.name}</ListItem.Title>
              <ListItem.Subtitle>
                {moment(m.details.time).format("MMMM Do YYYY, h:mm a")}
              </ListItem.Subtitle>
            </ListItem.Content>
            <ListItem.Chevron color="black" />
          </ListItem>
        ))}
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 10,
    flex: 1,
  },
  item: {
    width: "50%",
    aspectRatio: 1,
    backgroundColor: "transparent",
    borderRadius: 8,
    margin: 10,
    flex: 1,
  },
});

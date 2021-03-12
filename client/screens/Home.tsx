import { useIsFocused } from "@react-navigation/core";
import { Meeting } from "@types";
import React, { useContext, useEffect, useState } from "react";
import { FlatList, StyleSheet, Text, View, Image } from "react-native";
import MeetingCard from "../components/MeetingCard";
import { ApiContext } from "../src/ApiProvider";
import { AuthNavProps } from "../src/AuthParamList";

const numColumns = 2;

const formatData = (data: Meeting[], numColumns: any) => {
  const numberOfFullRows = Math.floor(data.length / numColumns);

  let numberOfElementsLastRow = data.length - numberOfFullRows * numColumns;
  while (
    numberOfElementsLastRow !== numColumns &&
    numberOfElementsLastRow !== 0
  ) {
    data.push({ key: `blank-${numberOfElementsLastRow}`, empty: true });
    numberOfElementsLastRow++;
  }

  return data;
};

const Home = ({ navigation }: AuthNavProps<"Home">) => {
  const { getMeetings } = useContext(ApiContext);
  const [meetings, setMeetings] = useState<Meeting[]>([]);
  const isFocused = useIsFocused();

  const renderItem = ({ item }: { item: any }) => {
    if (item.empty === true) {
      return <View style={styles.item} />;
    }
    return <MeetingCard item={item} />;
  };

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
        <FlatList
          data={formatData(meetings, numColumns)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
        />
      </View>
    );
  }
};

export default Home;

const styles = StyleSheet.create({
  container: {
    padding: 15,
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

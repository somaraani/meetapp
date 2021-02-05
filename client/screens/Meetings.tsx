import React from "react";
import { FlatList, StatusBar, StyleSheet, Text, View } from "react-native";
import MeetingCard from "../components/MeetingCard";

const numColumns = 2;

const MeetingsData = [
  { id: "1", title: "Meeting 1", lat: 43.653225, lng: -79.383186 },
  { id: "2", title: "Meeting 2", lat: 48.856613, lng: 2.352222 },
  { id: "3", title: "Meeting 3", lat: 40.712776, lng: -74.005974 },
  { id: "4", title: "Meeting 4", lat: 43.653225, lng: -79.383186 },
  { id: "5", title: "Meeting 5", lat: 43.653225, lng: -79.383186 },
  { id: "6", title: "Meeting 6", lat: 43.653225, lng: -79.383186 },
  { id: "7", title: "Meeting 7", lat: 43.653225, lng: -79.383186 },
];

const formatData = (data, numColumns) => {
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

const Meetings = ({ navigation }) => {
  const renderItem = ({ item, index }) => {
    if (item.empty === true) {
      return <View style={styles.item} />;
    }
    return <MeetingCard item={item} />;
  };

  return (
    <>
      <StatusBar />
      <View style={styles.container}>
        <FlatList
          data={formatData(MeetingsData, numColumns)}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          numColumns={numColumns}
        />
      </View>
    </>
  );
};

export default Meetings;

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

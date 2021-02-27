import React, { useContext } from "react";
import { Button, FlatList, StyleSheet, Text, View } from "react-native";
import MeetingCard from "../components/MeetingCard";
import { AuthNavProps } from "../src/AuthParamList";

const numColumns = 2;

const MeetingsData = [
  {
    id: "1",
    title: "Meeting 1",
    latitude: 43.653225,
    longitude: -79.383186,
    members: [
      {
        latitude: 43.799554407720585,
        longitude: -79.35446070585937,
        mode: "BICYCLING",
        distance: null,
        eta: null,
      },
      {
        latitude: 43.719188449399326,
        longitude: -79.58128653338825,
        mode: "WALKING",
        distance: null,
        eta: null,
      },
    ],
  },
  { id: "2", title: "Meeting 2", latitude: 28.599171, longitude: -81.201653 },
  { id: "3", title: "Meeting 3", latitude: 40.712776, longitude: -74.005974 },
  { id: "4", title: "Meeting 4", latitude: 48.858372, longitude: 2.294481 },
  { id: "5", title: "Meeting 5", latitude: 43.1065603, longitude: -79.0639039 },
];

const formatData = (data: any, numColumns: any) => {
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
  const renderItem = ({ item }: { item: any }) => {
    if (item.empty === true) {
      return <View style={styles.item} />;
    }
    return <MeetingCard item={item} />;
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={formatData(MeetingsData, numColumns)}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        numColumns={numColumns}
      />
    </View>
  );
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

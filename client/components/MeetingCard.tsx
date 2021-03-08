import { useNavigation } from "@react-navigation/native";
import React from "react";
import { StyleSheet, Text, View } from "react-native";
import { TouchableOpacity } from "react-native-gesture-handler";

const MeetingCard = ({ item }: { item: any }) => {
  console.log("Hello");
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <TouchableOpacity
        onPress={() => {
          navigation.navigate("MeetingTabs", item);
        }}
      >
        <View
          style={{
            width: "100%",
            height: "100%",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Text>{item.details.name}</Text>
        </View>
      </TouchableOpacity>
    </View>
  );
};

export default MeetingCard;

const styles = StyleSheet.create({
  container: {
    aspectRatio: 1,
    backgroundColor: "white",
    borderRadius: 8,
    margin: 10,
    flex: 1,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 2,
    elevation: 3,
  },
});

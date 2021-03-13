import React from "react";
import { Dimensions, StyleSheet, Text, View } from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView from "react-native-maps";
import config from "../config";

const LocationPicker = ({ navigation }) => {
  const lat = 40.866667;
  const lng = 34.566667;
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 100;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);

  return (
    <View>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          minLength={2}
          placeholder="Search"
          GooglePlacesDetailsQuery={{ fields: "geometry" }}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            console.log(details?.geometry);
          }}
          nearbyPlacesAPI="GoogleReverseGeocoding"
          enablePoweredByContainer={false}
          query={{
            key: config.GOOGLE_MAPS_APIKEY,
            language: "en",
          }}
        />
      </View>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: lat,
          longitude: lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
      ></MapView>
    </View>
  );
};

export default LocationPicker;

const styles = StyleSheet.create({
  autocompleteContainer: {
    flex: 1,
    left: 0,
    position: "absolute",
    right: 0,
    top: 0,
    zIndex: 1,
    padding: 10,
  },
  map: {
    width: "100%",
    height: "100%",
  },
});

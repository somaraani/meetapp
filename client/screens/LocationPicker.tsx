import React, { useEffect, useRef, useState } from "react";
import {
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  ToastAndroid,
  View,
} from "react-native";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";
import MapView, { Marker } from "react-native-maps";
import { Button } from "react-native-paper";
import config from "../config";
import Geocoder from "react-native-geocoding";

Geocoder.init(config.GOOGLE_MAPS_APIKEY);

const LocationPicker = ({ navigation }) => {
  const lat = 40.866667;
  const lng = 34.566667;
  const { height, width } = Dimensions.get("window");
  const LATITUDE_DELTA = 10;
  const LONGITUDE_DELTA = LATITUDE_DELTA * (width / height);
  const [mark, setMark] = useState<{
    latitude: number;
    longitude: number;
  } | null>(null);
  const [place, setPlace] = useState(null);
  const mapRef = useRef(null);
  const searchRef = useRef(null);
  const [disabled, setDisabled] = useState(true);

  useEffect(() => {
    navigation.setOptions({
      headerRight: () => (
        <Button
          mode="contained"
          disabled={disabled}
          theme={{ colors: { primary: "#2196F3" } }}
          onPress={() => navigation.navigate("CreateMeeting", place)}
        >
          <Text style={{ color: "white", fontWeight: "bold" }}>DONE</Text>
        </Button>
      ),
      headerRightContainerStyle: {
        marginRight: 20,
      },
    });
  }, [disabled]);

  useEffect(() => {
    if (place) {
      setDisabled(false);
    } else {
      setDisabled(true);
    }
  }, [place]);

  return (
    <View>
      <View style={styles.autocompleteContainer}>
        <GooglePlacesAutocomplete
          ref={searchRef}
          minLength={2}
          placeholder="Search"
          fetchDetails={true}
          onPress={(data, details = null) => {
            // 'details' is provided when fetchDetails = true
            setMark({
              latitude: details?.geometry.location.lat,
              longitude: details?.geometry.location.lng,
            });
            setPlace({
              address: data.description,
              coordinates: details?.geometry.location,
            });
            mapRef.current.animateToRegion(
              {
                latitude: details?.geometry.location.lat,
                longitude: details?.geometry.location.lng,
                latitudeDelta: LATITUDE_DELTA,
                longitudeDelta: LONGITUDE_DELTA,
              },
              1000
            );
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
        ref={mapRef}
        style={styles.map}
        initialRegion={{
          latitude: mark?.latitude || lat,
          longitude: mark?.longitude || lng,
          latitudeDelta: LATITUDE_DELTA,
          longitudeDelta: LONGITUDE_DELTA,
        }}
        onPress={async (e) => {
          let coords = e.nativeEvent.coordinate;
          setMark(coords);
          mapRef.current.animateToRegion(
            {
              ...coords,
              latitudeDelta: LATITUDE_DELTA,
              longitudeDelta: LONGITUDE_DELTA,
            },
            1000
          );
          try {
            let json = await Geocoder.from(coords);
            let address = json.results[0].formatted_address;

            setPlace({
              address: address,
              coordinates: { lat: coords.latitude, lng: coords.longitude },
            });
            searchRef.current.setAddressText(address);
          } catch (error) {
            setPlace(null);
            ToastAndroid.show(
              "Invalid Location. Try again!",
              ToastAndroid.SHORT
            );
          }
        }}
      >
        {mark && <Marker coordinate={mark} />}
      </MapView>
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

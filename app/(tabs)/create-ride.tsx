import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import MapView, { Marker,LatLng } from "react-native-maps";
import MapViewDirections from "react-native-maps-directions";
import { GooglePlacesAutocomplete } from "react-native-google-places-autocomplete";


export default function CarPoolingMap() {

const [source, setSource] = useState<LatLng | null>(null);
const [destination, setDestination] = useState<LatLng | null>(null);

  return (
    <View style={{ flex: 1 }}>
      {/* Source Input */}
      <GooglePlacesAutocomplete
        placeholder="Enter Source"
        fetchDetails={true}
        onPress={(data, details = null) => {
  if (!details) return; // ✅ prevent crash if details is null

  setSource({
    latitude: details.geometry.location.lat,
    longitude: details.geometry.location.lng,
  });
}}

        query={{
          key:process.env.GOOGLE_MAPS_APIKEY,
          language: "en",
        }}
        styles={{
          container: { position: "absolute", top: 10, width: "90%", zIndex: 1 },
        }}
      />

      {/* Destination Input */}
      <GooglePlacesAutocomplete
        placeholder="Enter Destination"
        fetchDetails={true}
        onPress={(data, details = null) => {
  if (!details) return; // ✅ prevent crash if details is null

  setDestination({
    latitude: details.geometry.location.lat,
    longitude: details.geometry.location.lng,
  });
}}

        query={{
          key: process.env.GOOGLE_MAPS_APIKEY,
          language: "en",
        }}
        styles={{
          container: { position: "absolute", top: 60, width: "90%", zIndex: 1 },
        }}
      />

      <MapView
        style={styles.map}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {/* Show Source Marker */}
        {source && <Marker coordinate={source} title="Source" />}

        {/* Show Destination Marker */}
        {destination && <Marker coordinate={destination} title="Destination" />}

        {/* Draw Route */}
        {source && destination && (
          <MapViewDirections
            origin={source}
            destination={destination}
            apikey={process.env.GOOGLE_MAPS_APIKEY}
            strokeWidth={4}
            strokeColor="blue"
          />
        )}
      </MapView>
    </View>
  );
}

const styles = StyleSheet.create({
  map: {
    flex: 1,
  },
});

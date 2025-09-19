import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ActivityIndicator,
  FlatList,
} from "react-native";
import MapView, { Marker, Polyline } from "react-native-maps";
import axios from "axios";

export default function FindRide() {
  const [source, setSource] = useState("");
  const [destination, setDestination] = useState("");
  const [sourceCoords, setSourceCoords] = useState<any>(null);
  const [destinationCoords, setDestinationCoords] = useState<any>(null);
  const [routeCoords, setRouteCoords] = useState<any[]>([]);
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const GOOGLE_API_KEY = process.env.EXPO_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Convert address to coordinates
  const geocodeAddress = async (address: string) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
          address
        )}&key=${GOOGLE_API_KEY}`
      );
      if (res.data.results.length > 0) {
        return res.data.results[0].geometry.location;
      }
    } catch (err) {
      console.error("Geocode error:", err);
    }
    return null;
  };

  // Get polyline points
  const fetchRoute = async (origin: string, dest: string) => {
    try {
      const res = await axios.get(
        `https://maps.googleapis.com/maps/api/directions/json?origin=${origin}&destination=${dest}&key=${GOOGLE_API_KEY}`
      );
      if (res.data.routes.length > 0) {
        const points = res.data.routes[0].overview_polyline.points || "";
        const decoded = decodePolyline(points);
        setRouteCoords(decoded);
      }
    } catch (err) {
      console.error("Route error:", err);
    }
  };

  // Polyline decode
  const decodePolyline = (t: string) => {
    let points: any[] = [];
    let index = 0,
      lat = 0,
      lng = 0;

    while (index < t.length) {
      let b,
        shift = 0,
        result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlat = result & 1 ? ~(result >> 1) : result >> 1;
      lat += dlat;

      shift = 0;
      result = 0;
      do {
        b = t.charCodeAt(index++) - 63;
        result |= (b & 0x1f) << shift;
        shift += 5;
      } while (b >= 0x20);
      let dlng = result & 1 ? ~(result >> 1) : result >> 1;
      lng += dlng;

      points.push({ latitude: lat / 1e5, longitude: lng / 1e5 });
    }
    return points;
  };

  // Handle Find Ride
  const handleFindRide = async () => {
    if (!source || !destination) {
      alert("Please enter source and destination");
      return;
    }
    setLoading(true);
    try {
      const srcCoords = await geocodeAddress(source);
      const destCoords = await geocodeAddress(destination);

      if (srcCoords && destCoords) {
        setSourceCoords(srcCoords);
        setDestinationCoords(destCoords);

        await fetchRoute(`${srcCoords.lat},${srcCoords.lng}`, `${destCoords.lat},${destCoords.lng}`);

        // fetch rides from backend
        const res = await axios.get(
          `http://YOUR_BACKEND_URL/api/rides?source=${source}&destination=${destination}`
        );
        setRides(res.data || []);
      }
    } catch (err) {
      console.error("Error fetching rides:", err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Map */}
      <MapView
        style={{ flex: 1 }}
        initialRegion={{
          latitude: 12.9716,
          longitude: 77.5946,
          latitudeDelta: 0.05,
          longitudeDelta: 0.05,
        }}
      >
        {sourceCoords && (
          <Marker
            coordinate={{
              latitude: sourceCoords.lat,
              longitude: sourceCoords.lng,
            }}
            title="Source"
            pinColor="green"
          />
        )}
        {destinationCoords && (
          <Marker
            coordinate={{
              latitude: destinationCoords.lat,
              longitude: destinationCoords.lng,
            }}
            title="Destination"
            pinColor="red"
          />
        )}
        {routeCoords.length > 0 && (
          <Polyline coordinates={routeCoords} strokeColor="blue" strokeWidth={5} />
        )}
      </MapView>

      {/* Bottom Sheet */}
      <View className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 max-h-[400px] shadow-lg">
        <Text className="text-xl font-bold mb-3 text-gray-800">Find a Ride</Text>

        {/* Inputs */}
        <TextInput
          placeholder="Enter Source"
          value={source}
          onChangeText={setSource}
          className="bg-gray-100 p-3 rounded-2xl mb-3"
        />
        <TextInput
          placeholder="Enter Destination"
          value={destination}
          onChangeText={setDestination}
          className="bg-gray-100 p-3 rounded-2xl mb-3"
        />

        {/* Button */}
        <TouchableOpacity
          onPress={handleFindRide}
          className="bg-blue-600 py-4 rounded-2xl items-center mb-4"
        >
          <Text className="text-white font-semibold text-lg">Search Rides</Text>
        </TouchableOpacity>

        {/* Rides List */}
        {loading ? (
          <ActivityIndicator size="large" color="blue" />
        ) : (
          <FlatList
            data={rides}
            keyExtractor={(item) => item.id.toString()}
            renderItem={({ item }) => (
              <View className="bg-gray-50 p-4 rounded-2xl mb-3 border border-gray-200">
                <Text className="font-bold text-gray-800">{item.driverName}</Text>
                <Text className="text-gray-600">{item.vehicle}</Text>
                <Text className="text-gray-600">Seats: {item.seats}</Text>
                <Text className="text-gray-800 font-semibold">₹{item.price}</Text>
              </View>
            )}
          />
        )}
      </View>
    </View>
  );
}

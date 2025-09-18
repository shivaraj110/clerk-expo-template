import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, TextInput, Alert } from "react-native";
import MapView, { Marker } from "react-native-maps";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";

export default function CreateRide() {
  const [pickup, setPickup] = useState(null);
  const [drop, setDrop] = useState(null);
  const [region, setRegion] = useState(null);
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [carModel, setCarModel] = useState("");
  const [luggage, setLuggage] = useState(false);
  const [selecting, setSelecting] = useState<"pickup" | "drop" | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== "granted") {
        Alert.alert("Permission Denied", "Allow location access to use maps");
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setRegion({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
        latitudeDelta: 0.05,
        longitudeDelta: 0.05,
      });
    })();
  }, []);

  const handleMapPress = (e) => {
    const coord = e.nativeEvent.coordinate;
    if (selecting === "pickup") {
      setPickup(coord);
      setSelecting(null);
    } else if (selecting === "drop") {
      setDrop(coord);
      setSelecting(null);
    }
  };

  const handleCreateRide = () => {
    if (!pickup || !drop) {
      Alert.alert("Missing Info", "Please select Pickup & Drop on map");
      return;
    }
    console.log({
      pickup,
      drop,
      seats,
      price,
      carModel,
      luggage,
    });
    Alert.alert("Ride Created ✅", "Your ride has been posted!");
  };

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient
        colors={["#16A34A", "#22C55E"]}
        className="px-6 pt-16 pb-8 rounded-b-3xl shadow-md"
      >
        <Text className="text-2xl font-bold text-white">Create Ride</Text>
        <Text className="text-white opacity-90">Select Pickup & Drop on map</Text>
      </LinearGradient>

      {/* Map */}
      {region && (
        <MapView
          style={{ flex: 1 }}
          initialRegion={region}
          onPress={handleMapPress}
        >
          {pickup && <Marker coordinate={pickup} title="Pickup" pinColor="green" />}
          {drop && <Marker coordinate={drop} title="Drop" pinColor="red" />}
        </MapView>
      )}

      {/* Controls */}
      <ScrollView className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-xl max-h-[400px]">
        {/* Select Pickup/Drop Buttons */}
        <View className="flex-row justify-between mb-4">
          <TouchableOpacity
            onPress={() => setSelecting("pickup")}
            className="bg-green-600 flex-1 mr-2 py-3 rounded-xl items-center"
          >
            <Text className="text-white font-semibold">📍 Set Pickup</Text>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={() => setSelecting("drop")}
            className="bg-red-600 flex-1 ml-2 py-3 rounded-xl items-center"
          >
            <Text className="text-white font-semibold">🏁 Set Drop</Text>
          </TouchableOpacity>
        </View>

        {/* Seats */}
        <View className="mb-3">
          <Text className="text-gray-700 font-semibold mb-1">Seats Available</Text>
          <TextInput
            value={seats}
            onChangeText={setSeats}
            keyboardType="numeric"
            placeholder="e.g. 3"
            className="bg-gray-100 p-3 rounded-xl"
          />
        </View>

        {/* Price */}
        <View className="mb-3">
          <Text className="text-gray-700 font-semibold mb-1">Price per Seat (₹)</Text>
          <TextInput
            value={price}
            onChangeText={setPrice}
            keyboardType="numeric"
            placeholder="e.g. 200"
            className="bg-gray-100 p-3 rounded-xl"
          />
        </View>

        {/* Car Model */}
        <View className="mb-3">
          <Text className="text-gray-700 font-semibold mb-1">Car Model</Text>
          <TextInput
            value={carModel}
            onChangeText={setCarModel}
            placeholder="e.g. Swift, Innova"
            className="bg-gray-100 p-3 rounded-xl"
          />
        </View>

        {/* Luggage */}
        <View className="flex-row items-center justify-between mb-4">
          <Text className="text-gray-700 font-semibold">Luggage Accepted</Text>
          <Switch value={luggage} onValueChange={setLuggage} />
        </View>

        {/* Submit */}
        <TouchableOpacity
          onPress={handleCreateRide}
          className="bg-green-600 py-4 rounded-xl items-center mt-2"
        >
          <Text className="text-white font-semibold text-lg">🚘 Create Ride</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

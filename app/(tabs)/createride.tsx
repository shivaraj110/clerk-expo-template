// import { useEffect, useState } from "react";
// import { View, Text, TouchableOpacity, ScrollView, Switch, TextInput, Alert } from "react-native";
// import * as Location from "expo-location";
// import { LinearGradient } from "expo-linear-gradient";
// import { Platform } from "react-native";
// import MapView, { Marker } from "react-native-maps";

// // Type for map press
// type MapPressEvent = {
//   nativeEvent: { coordinate: { latitude: number; longitude: number } };
// };

// export default function CreateRide() {
//   const [seats, setSeats] = useState("");
//   const [price, setPrice] = useState("");
//   const [carModel, setCarModel] = useState("");
//   const [luggage, setLuggage] = useState(false);
//   const [selecting, setSelecting] = useState<"pickup" | "drop" | null>(null);
//   const [region, setRegion] = useState<{
//     latitude: number;
//     longitude: number;
//     latitudeDelta: number;
//     longitudeDelta: number;
//   } | null>(null);

//   const [pickup, setPickup] = useState<{ latitude: number; longitude: number } | null>(null);
//   const [drop, setDrop] = useState<{ latitude: number; longitude: number } | null>(null);

//   useEffect(() => {
//     (async () => {
//       let { status } = await Location.requestForegroundPermissionsAsync();
//       if (status !== "granted") {
//         Alert.alert("Permission Denied", "Allow location access to use maps");
//         return;
//       }

//       let location = await Location.getCurrentPositionAsync({});
//       setRegion({
//         latitude: location.coords.latitude,
//         longitude: location.coords.longitude,
//         latitudeDelta: 0.05,
//         longitudeDelta: 0.05,
//       });
//     })();
//   }, []);

//   const handleMapPress = (e: MapPressEvent) => {
//     const coord = e.nativeEvent.coordinate;
//     if (selecting === "pickup") {
//       setPickup(coord);
//       setSelecting(null);
//     } else if (selecting === "drop") {
//       setDrop(coord);
//       setSelecting(null);
//     }
//   };

//   const handleCreateRide = () => {
//     if (!pickup || !drop) {
//       Alert.alert("Missing Info", "Please select Pickup & Drop on map");
//       return;
//     }
//     console.log({
//       pickup,
//       drop,
//       seats,
//       price,
//       carModel,
//       luggage,
//     });
//     Alert.alert("Ride Created ✅", "Your ride has been posted!");
//   };

//   return (
//     <View className="flex-1 bg-gray-100">
//       {/* Header */}
//       <LinearGradient
//         colors={["#16A34A", "#22C55E"]}
//         className="px-6 pt-16 pb-8 rounded-b-3xl shadow-md"
//       >
//         <Text className="text-2xl font-bold text-white">Create Ride</Text>
//         <Text className="text-white opacity-90">Select Pickup & Drop on map</Text>
//       </LinearGradient>

//       {/* Map */}
//       {region && (
//         <MapView
//           style={{ flex: 1 }}
//           initialRegion={region}
//           onPress={handleMapPress}
//         >
//           {pickup && <Marker coordinate={pickup} title="Pickup" pinColor="green" />}
//           {drop && <Marker coordinate={drop} title="Drop" pinColor="red" />}
//         </MapView>
//       )}

//       {/* Controls */}
//       <ScrollView className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-xl max-h-[500px]">
//         {/* Select Pickup/Drop Buttons */}
//         <View className="flex-row justify-between mb-4">
//           <TouchableOpacity
//             onPress={() => setSelecting("pickup")}
//             className="bg-green-600 flex-1 mr-2 py-3 rounded-xl items-center"
//           >
//             <Text className="text-white font-semibold">📍 Set Pickup</Text>
//           </TouchableOpacity>
//           <TouchableOpacity
//             onPress={() => setSelecting("drop")}
//             className="bg-red-600 flex-1 ml-2 py-3 rounded-xl items-center"
//           >
//             <Text className="text-white font-semibold">🏁 Set Drop</Text>
//           </TouchableOpacity>
//         </View>

//         {/* Seats */}
//         <View className="mb-3">
//           <Text className="text-gray-700 font-semibold mb-1">Seats Available</Text>
//           <TextInput
//             value={seats}
//             onChangeText={setSeats}
//             keyboardType="numeric"
//             placeholder="e.g. 3"
//             className="bg-gray-100 p-3 rounded-xl"
//           />
//         </View>

//         {/* Price */}
//         <View className="mb-3">
//           <Text className="text-gray-700 font-semibold mb-1">Price per Seat (₹)</Text>
//           <TextInput
//             value={price}
//             onChangeText={setPrice}
//             keyboardType="numeric"
//             placeholder="e.g. 200"
//             className="bg-gray-100 p-3 rounded-xl"
//           />
//         </View>

//         {/* Car Model */}
//         <View className="mb-3">
//           <Text className="text-gray-700 font-semibold mb-1">Car Model</Text>
//           <TextInput
//             value={carModel}
//             onChangeText={setCarModel}
//             placeholder="e.g. Swift, Innova"
//             className="bg-gray-100 p-3 rounded-xl"
//           />
//         </View>

//         {/* Luggage */}
//         <View className="flex-row items-center justify-between mb-4">
//           <Text className="text-gray-700 font-semibold">Luggage Accepted</Text>
//           <Switch value={luggage} onValueChange={setLuggage} />
//         </View>

//         {/* Submit */}
//         <TouchableOpacity
//           onPress={handleCreateRide}
//           className="bg-green-600 py-4 rounded-xl items-center mt-2"
//         >
//           <Text className="text-white font-semibold text-lg">🚘 Create Ride</Text>
//         </TouchableOpacity>
//       </ScrollView>
//     </View>
//   );
// }


import { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, ScrollView, Switch, TextInput, Alert } from "react-native";
import * as Location from "expo-location";
import { LinearGradient } from "expo-linear-gradient";
import MapView, { Marker } from "react-native-maps";
import axios from "axios";

// Type for map press
type MapPressEvent = {
  nativeEvent: { coordinate: { latitude: number; longitude: number } };
};

export default function CreateRide() {
  const [seats, setSeats] = useState("");
  const [price, setPrice] = useState("");
  const [carModel, setCarModel] = useState("");
  const [luggage, setLuggage] = useState(false);
  const [selecting, setSelecting] = useState<"pickup" | "drop" | null>(null);
  const [region, setRegion] = useState<{
    latitude: number;
    longitude: number;
    latitudeDelta: number;
    longitudeDelta: number;
  } | null>(null);

  const [pickup, setPickup] = useState<{ latitude: number; longitude: number } | null>(null);
  const [drop, setDrop] = useState<{ latitude: number; longitude: number } | null>(null);

  const [tripInfo, setTripInfo] = useState<{ distance: string; duration: string } | null>(null);

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

  const handleMapPress = (e: MapPressEvent) => {
    const coord = e.nativeEvent.coordinate;
    if (selecting === "pickup") {
      setPickup(coord);
      setSelecting(null);
      setTripInfo(null); // reset
    } else if (selecting === "drop") {
      setDrop(coord);
      setSelecting(null);
      setTripInfo(null); // reset
    }
  };

  const getDistanceAndDuration = async () => {
  if (!pickup || !drop) {
    console.warn("Pickup or Drop is missing");
    return;
  }

  try {
    const apiKey = process.env.EXPO_PUBLIC_GOOGLE_MAPS_APIKEY;
    if (!apiKey) {
      console.error("Google Maps API key is missing");
      return;
    }

    const url = `https://maps.googleapis.com/maps/api/distancematrix/json?units=metric&origins=${pickup.latitude},${pickup.longitude}&destinations=${drop.latitude},${drop.longitude}&key=${apiKey}`;

    const res = await axios.get(url);
    console.log("Distance API raw response:", res.data); // 👈 debug

    const data: any = res.data;

    if (!data.rows || data.rows.length === 0) {
      console.error("No rows in Distance Matrix response", data);
      return;
    }

    const element = data.rows[0].elements[0];

    if (element.status === "OK") {
      setTripInfo({
        distance: element.distance.text,
        duration: element.duration.text,
      });
    } else {
      console.error("Element status not OK:", element);
    }
  } catch (err) {
    console.error("Error fetching distance:", err);
  }
};


  const handleCreateRide = async () => {
    if (!pickup || !drop) {
      Alert.alert("Missing Info", "Please select Pickup & Drop on map");
      return;
    }

    await getDistanceAndDuration();

    console.log({
      pickup,
      drop,
      seats,
      price,
      carModel,
      luggage,
      tripInfo,
    });

    Alert.alert(
      "Ride Created ✅",
      `Your ride has been posted!\n\nDistance: ${tripInfo?.distance || "N/A"}\nDuration: ${tripInfo?.duration || "N/A"}`
    );
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
      <ScrollView className="absolute bottom-0 w-full bg-white rounded-t-3xl p-6 shadow-xl max-h-[500px]">
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

        {/* Trip Info */}
        {tripInfo && (
          <View className="mb-4 p-3 bg-green-50 rounded-xl">
            <Text className="text-green-700 font-semibold">
              Distance: {tripInfo.distance}
            </Text>
            <Text className="text-green-700 font-semibold">
              Duration: {tripInfo.duration}
            </Text>
          </View>
        )}

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

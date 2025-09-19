import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function PassengerHome() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Gradient Header */}
      <LinearGradient
        colors={["#4F46E5", "#3B82F6"]}
        className="rounded-b-3xl px-6 pt-16 pb-12 shadow-md"
      >
        <Text className="text-3xl font-bold text-white mb-2">Welcome Passenger 👋</Text>
        <Text className="text-white text-base opacity-90">Book your next ride</Text>
      </LinearGradient>

      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Find Ride */}
        <TouchableOpacity
          onPress={() => router.push("/findride")}
          className="bg-white rounded-2xl p-6 mb-6 shadow-lg flex-row items-center"
        >
          <View className="bg-indigo-100 p-4 rounded-full mr-4">
            <Ionicons name="search-outline" size={28} color="#4F46E5" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">Find a Ride</Text>
            <Text className="text-gray-500">Search and book available rides</Text>
          </View>
        </TouchableOpacity>

        {/* Ride History */}
        <TouchableOpacity
          onPress={() => router.push("/pssmyride")}
          className="bg-white rounded-2xl p-6 shadow-lg flex-row items-center"
        >
          <View className="bg-yellow-100 p-4 rounded-full mr-4">
            <Ionicons name="time-outline" size={28} color="#CA8A04" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">My Rides</Text>
            <Text className="text-gray-500">View your past & upcoming rides</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

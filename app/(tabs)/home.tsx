import { View, Text, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function RoleSelection() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Gradient Header */}
      <LinearGradient
        colors={["#4F46E5", "#3B82F6"]}
        className="rounded-b-3xl px-6 pt-16 pb-12 shadow-md"
      >
        <Text className="text-3xl font-bold text-white mb-2">Choose Your Role</Text>
        <Text className="text-white text-base opacity-90">
          Select how you want to use the app
        </Text>
      </LinearGradient>

      {/* Role Options */}
      <View className="flex-1 justify-center px-6">
        {/* Passenger */}
        <TouchableOpacity
          onPress={() => router.replace("/passenger")} // 👈 goes to passenger home
          className="bg-white rounded-3xl p-8 mb-8 shadow-lg items-center"
        >
          <View className="bg-indigo-100 p-6 rounded-full mb-4">
            <Ionicons name="person-outline" size={40} color="#4F46E5" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">Passenger</Text>
          <Text className="text-gray-500 text-center">
            Find and book rides quickly
          </Text>
        </TouchableOpacity>

        {/* Driver */}
        <TouchableOpacity
          onPress={() => router.replace("/driver")} // 👈 goes to driver section
          className="bg-white rounded-3xl p-8 shadow-lg items-center"
        >
          <View className="bg-green-100 p-6 rounded-full mb-4">
            <Ionicons name="car-outline" size={40} color="#16A34A" />
          </View>
          <Text className="text-xl font-bold text-gray-800 mb-2">Driver</Text>
          <Text className="text-gray-500 text-center">
            Offer your ride to passengers
          </Text>
        </TouchableOpacity>
      </View>
    </View>
  );
}

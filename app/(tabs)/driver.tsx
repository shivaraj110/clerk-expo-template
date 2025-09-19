import { View, Text, TouchableOpacity, ScrollView } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";
import { useRouter } from "expo-router";

export default function DriverDashboard() {
  const router = useRouter();

  return (
    <View className="flex-1 bg-gray-100">
      {/* Gradient Header */}
      <LinearGradient
        colors={["#16A34A", "#22C55E"]}
        className="rounded-b-3xl px-6 pt-16 pb-12 shadow-md"
      >
        <Text className="text-3xl font-bold text-white mb-2">Driver Panel 🚘</Text>
        <Text className="text-white text-base opacity-90">
          Manage your rides & profile
        </Text>
      </LinearGradient>

      {/* Main Actions */}
      <ScrollView contentContainerStyle={{ padding: 16 }}>
        {/* Create Ride */}
        <TouchableOpacity
          onPress={() => router.replace("/createride")}
          className="bg-white rounded-2xl p-6 mb-6 shadow-lg flex-row items-center"
        >
          <View className="bg-green-100 p-4 rounded-full mr-4">
            <Ionicons name="add-circle-outline" size={28} color="#16A34A" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">Create Ride</Text>
            <Text className="text-gray-500">Offer a ride to passengers</Text>
          </View>
        </TouchableOpacity>

        {/* My Rides */}
        <TouchableOpacity
          onPress={() => router.push("/myrides")}
          className="bg-white rounded-2xl p-6 mb-6 shadow-lg flex-row items-center"
        >
          <View className="bg-yellow-100 p-4 rounded-full mr-4">
            <Ionicons name="time-outline" size={28} color="#CA8A04" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">My Rides</Text>
            <Text className="text-gray-500">View and manage your rides</Text>
          </View>
        </TouchableOpacity>

        {/* Vehicle Info */}
        <TouchableOpacity
          onPress={() => router.push("/vehicle-info")}
          className="bg-white rounded-2xl p-6 mb-6 shadow-lg flex-row items-center"
        >
          <View className="bg-blue-100 p-4 rounded-full mr-4">
            <Ionicons name="car-outline" size={28} color="#2563EB" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">Vehicle Info</Text>
            <Text className="text-gray-500">Add or update car details</Text>
          </View>
        </TouchableOpacity>

        {/* Documents */}
        <TouchableOpacity
          onPress={() => router.push("/document")}
          className="bg-white rounded-2xl p-6 mb-6 shadow-lg flex-row items-center"
        >
          <View className="bg-pink-100 p-4 rounded-full mr-4">
            <Ionicons name="document-text-outline" size={28} color="#DB2777" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">Documents</Text>
            <Text className="text-gray-500">Upload License & RC</Text>
          </View>
        </TouchableOpacity>

        {/* Profile */}
        <TouchableOpacity
          onPress={() => router.push("/profile")}
          className="bg-white rounded-2xl p-6 shadow-lg flex-row items-center"
        >
          <View className="bg-purple-100 p-4 rounded-full mr-4">
            <Ionicons name="person-outline" size={28} color="#7C3AED" />
          </View>
          <View>
            <Text className="text-lg font-semibold text-gray-800">Profile</Text>
            <Text className="text-gray-500">Manage your account</Text>
          </View>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

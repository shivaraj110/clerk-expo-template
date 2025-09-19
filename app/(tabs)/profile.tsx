import React, { useEffect, useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, ActivityIndicator, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@clerk/clerk-expo";

export default function DriverProfilePage() {
  const { userId } = useAuth();
  const [profile, setProfile] = useState<any>(null);
  const [vehicles, setVehicles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const API_URL = "http://localhost:5000"; // change to your backend base URL

  const fetchProfile = async () => {
    try {
      const [profileRes, vehicleRes] = await Promise.all([
        fetch(`${API_URL}/api/driver?userId=${userId}`),
        fetch(`${API_URL}/api/vehicles?userId=${userId}`)
      ]);

      if (!profileRes.ok || !vehicleRes.ok) {
        throw new Error("Failed to fetch profile or vehicles");
      }

      const profileData = await profileRes.json();
      const vehicleData = await vehicleRes.json();

      setProfile(profileData);
      setVehicles(vehicleData);
    } catch (err) {
      console.error("Error fetching profile:", err);
      Alert.alert("Error", "Failed to load driver profile.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <ActivityIndicator size="large" color="#16A34A" />
      </View>
    );
  }

  if (!profile) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-100">
        <Text className="text-gray-600 text-lg">No profile found</Text>
      </View>
    );
  }

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient
        colors={["#16A34A", "#22C55E"]}
        className="px-6 pt-16 pb-12 rounded-b-3xl shadow-md items-center"
      >
        <Image
          source={{ uri: profile.photo || "https://i.pravatar.cc/150?img=12" }}
          className="w-28 h-28 rounded-full border-4 border-white mb-4"
        />
        <Text className="text-2xl font-bold text-white">{profile.name}</Text>
        <Text className="text-white opacity-80">{profile.email}</Text>
      </LinearGradient>

      {/* Profile Info */}
      <View className="p-6">
        <Text className="text-xl font-semibold text-gray-800 mb-3">Driver Details</Text>
        <View className="bg-white p-4 rounded-2xl mb-4 shadow">
          <Text className="text-gray-700">📞 Phone: {profile.phone}</Text>
          <Text className="text-gray-700">🎂 DOB: {profile.dob}</Text>
          <Text className="text-gray-700">🪪 Aadhar: {profile.aadharNumber}</Text>
          <Text className="text-gray-700">🪪 DL: {profile.dlNumber}</Text>
        </View>

        {/* Vehicle Info */}
        <Text className="text-xl font-semibold text-gray-800 mb-3">My Vehicles</Text>
        {vehicles.length > 0 ? (
          vehicles.map((v, index) => (
            <View key={index} className="bg-white p-4 rounded-2xl mb-4 shadow">
              <Text className="text-gray-800 font-semibold">{v.name}</Text>
              <Text className="text-gray-600">Plate: {v.numberPlate}</Text>
              <Text className="text-gray-600">Seats: {v.seats}</Text>
              <Text className="text-gray-600">Type: {v.type}</Text>
              <Text className="text-gray-600">RC: {v.rc}</Text>
            </View>
          ))
        ) : (
          <Text className="text-gray-500">No vehicles added</Text>
        )}

        {/* Action Buttons */}
        <TouchableOpacity className="bg-green-600 py-4 rounded-xl items-center mt-4">
          <Text className="text-white font-semibold text-lg">✏️ Edit Profile</Text>
        </TouchableOpacity>

        <TouchableOpacity className="bg-blue-600 py-4 rounded-xl items-center mt-3">
          <Text className="text-white font-semibold text-lg">➕ Add Vehicle</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@clerk/clerk-expo";

export default function MyRidesPage() {
  const { userId } = useAuth();
  const [rides, setRides] = useState<any[]>([]);

  const API_URL = "http://localhost:5000/api/rides"; // update to your backend

  const fetchRides = async () => {
    try {
      const res = await fetch(`${API_URL}?userId=${userId}`);
      const data = await res.json();
      setRides(data);
    } catch (err) {
      console.error("Error fetching rides:", err);
    }
  };

  const cancelRide = async (rideId: string) => {
    try {
      const res = await fetch(`${API_URL}/${rideId}`, { method: "DELETE" });
      if (res.ok) {
        Alert.alert("✅ Ride Cancelled", "Your ride has been cancelled.");
        fetchRides();
      }
    } catch (err) {
      console.error("Error cancelling ride:", err);
    }
  };

  useEffect(() => {
    fetchRides();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient
        colors={["#059669", "#10B981"]}
        className="px-6 pt-16 pb-8 rounded-b-3xl shadow-md"
      >
        <Text className="text-2xl font-bold text-white">My Rides</Text>
        <Text className="text-white opacity-90">View your upcoming and past rides</Text>
      </LinearGradient>

      {/* Ride List */}
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-5 rounded-2xl mb-4 shadow-md">
            <Text className="text-lg font-bold text-gray-800">
              {item.source} ➝ {item.destination}
            </Text>
            <Text className="text-gray-600">Date: {item.date}</Text>
            <Text className="text-gray-600">Time: {item.time}</Text>
            <Text className="text-gray-600">Driver: {item.driverName}</Text>
            <Text className="text-gray-600">Vehicle: {item.vehicle}</Text>
            <Text
              className={`mt-2 font-semibold ${
                item.status === "completed"
                  ? "text-green-600"
                  : item.status === "cancelled"
                  ? "text-red-600"
                  : "text-yellow-600"
              }`}
            >
              Status: {item.status}
            </Text>

            {item.status === "upcoming" && (
              <TouchableOpacity
                onPress={() => cancelRide(item.id)}
                className="bg-red-500 py-3 rounded-xl items-center mt-3"
              >
                <Text className="text-white font-semibold">Cancel Ride</Text>
              </TouchableOpacity>
            )}
          </View>
        )}
      />
    </View>
  );
}

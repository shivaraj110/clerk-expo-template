import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList, Alert } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@clerk/clerk-expo";

export default function VehiclesPage() {
  const { userId } = useAuth();
  const [vehicles, setVehicles] = useState<any[]>([]);

  // fields
  const [make, setMake] = useState("");
  const [model, setModel] = useState("");
  const [year, setYear] = useState("");
  const [color, setColor] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [type, setType] = useState("");

  const API_URL = "http://localhost:5000/api/vehicles"; // change to backend server

  const fetchVehicles = async () => {
    try {
      const res = await fetch(`${API_URL}?userId=${userId}`);
      const data = await res.json();
      setVehicles(data);
    } catch (err) {
      console.error("Error fetching vehicles:", err);
    }
  };

  const addVehicle = async () => {
    if (!make || !model || !year || !color || !registrationNumber || !type) {
      Alert.alert("Error", "Please fill all fields");
      return;
    }
    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          make,
          model,
          year,
          color,
          registrationNumber,
          type,
        }),
      });
      if (res.ok) {
        Alert.alert("✅ Success", "Vehicle added successfully");
        // reset
        setMake("");
        setModel("");
        setYear("");
        setColor("");
        setRegistrationNumber("");
        setType("");
        fetchVehicles();
      }
    } catch (err) {
      console.error("Error adding vehicle:", err);
    }
  };

  useEffect(() => {
    fetchVehicles();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient
        colors={["#2563EB", "#3B82F6"]}
        className="px-6 pt-16 pb-8 rounded-b-3xl shadow-md"
      >
        <Text className="text-2xl font-bold text-white">My Vehicles</Text>
        <Text className="text-white opacity-90">Manage your registered vehicles</Text>
      </LinearGradient>

      {/* Form */}
      <View className="p-6">
        <TextInput
          placeholder="Make (e.g., Honda)"
          value={make}
          onChangeText={setMake}
          className="bg-white rounded-xl p-3 mb-3 border border-gray-300"
        />
        <TextInput
          placeholder="Model (e.g., City)"
          value={model}
          onChangeText={setModel}
          className="bg-white rounded-xl p-3 mb-3 border border-gray-300"
        />
        <TextInput
          placeholder="Year"
          value={year}
          onChangeText={setYear}
          keyboardType="numeric"
          className="bg-white rounded-xl p-3 mb-3 border border-gray-300"
        />
        <TextInput
          placeholder="Color"
          value={color}
          onChangeText={setColor}
          className="bg-white rounded-xl p-3 mb-3 border border-gray-300"
        />
        <TextInput
          placeholder="Registration Number"
          value={registrationNumber}
          onChangeText={setRegistrationNumber}
          className="bg-white rounded-xl p-3 mb-3 border border-gray-300"
        />
        <TextInput
          placeholder="Type (Car, SUV, Bike)"
          value={type}
          onChangeText={setType}
          className="bg-white rounded-xl p-3 mb-3 border border-gray-300"
        />
        <TouchableOpacity
          onPress={addVehicle}
          className="bg-blue-600 py-4 rounded-xl items-center mt-2"
        >
          <Text className="text-white font-semibold text-lg">➕ Add Vehicle</Text>
        </TouchableOpacity>
      </View>

      {/* Vehicle List */}
      <FlatList
        data={vehicles}
        keyExtractor={(item) => item.id?.toString() || Math.random().toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 shadow-md">
            <Text className="text-lg font-bold text-gray-800">
              {item.make} {item.model} ({item.year})
            </Text>
            <Text className="text-gray-600">Color: {item.color}</Text>
            <Text className="text-gray-600">Reg No: {item.registrationNumber}</Text>
            <Text className="text-gray-600">Type: {item.type}</Text>
          </View>
        )}
      />
    </View>
  );
}

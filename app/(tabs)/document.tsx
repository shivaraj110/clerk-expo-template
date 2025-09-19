import React, { useEffect, useState } from "react";
import { View, Text, TextInput, TouchableOpacity, FlatList } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { useAuth } from "@clerk/clerk-expo";

export default function DocumentsPage() {
  const { userId } = useAuth();
  const [documents, setDocuments] = useState<any[]>([]);
  const [dlNumber, setDlNumber] = useState("");
  const [aadharNumber, setAadharNumber] = useState("");
  const [dob, setDob] = useState("");
  const [errors, setErrors] = useState<{ dlNumber?: string; aadharNumber?: string; dob?: string }>({});
  const [successMsg, setSuccessMsg] = useState("");

  const API_URL = "http://localhost:5555"; // change when backend deployed

  // Fetch user documents
  const fetchDocuments = async () => {
    try {
      const res = await fetch(`${API_URL}?userId=${userId}`);
      const data = await res.json();
      setDocuments(data);
    } catch (err) {
      console.error("Error fetching documents:", err);
    }
  };

  // Validate input
  const validateInputs = () => {
    let valid = true;
    let newErrors: typeof errors = {};

    if (!dlNumber.trim()) {
      newErrors.dlNumber = "Driving License Number is required";
      valid = false;
    }
    if (!aadharNumber.trim() || aadharNumber.length !== 12) {
      newErrors.aadharNumber = "Enter a valid 12-digit Aadhar Number";
      valid = false;
    }
    if (!dob.trim() || !/^\d{4}-\d{2}-\d{2}$/.test(dob)) {
      newErrors.dob = "Enter DOB in YYYY-MM-DD format";
      valid = false;
    }

    setErrors(newErrors);
    return valid;
  };

  // Add new document
  const addDocument = async () => {
    setSuccessMsg(""); // reset before saving

    if (!validateInputs()) {
      return;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          userId,
          dlNumber,
          aadharNumber,
          dob,
        }),
      });

      if (res.ok) {
        setSuccessMsg("✅ Document saved successfully!");
        setDlNumber("");
        setAadharNumber("");
        setDob("");
        setErrors({});
        fetchDocuments();

        // hide success after 3 seconds
        setTimeout(() => setSuccessMsg(""), 3000);
      } else {
        setSuccessMsg("❌ Failed to save document. Try again.");
      }
    } catch (err) {
      console.error("Error adding document:", err);
      setSuccessMsg("⚠️ Network error while saving.");
    }
  };

  useEffect(() => {
    fetchDocuments();
  }, []);

  return (
    <View className="flex-1 bg-gray-100">
      {/* Header */}
      <LinearGradient
        colors={["#16A34A", "#22C55E"]}
        className="px-6 pt-16 pb-8 rounded-b-3xl shadow-md"
      >
        <Text className="text-2xl font-bold text-white">My Documents</Text>
        <Text className="text-white opacity-90">Upload and manage your ID details</Text>
      </LinearGradient>

      {/* Form */}
      <View className="p-6">
        {/* Success message */}
        {successMsg ? (
          <Text className={`mb-3 text-center font-semibold ${successMsg.startsWith("✅") ? "text-green-600" : "text-red-500"}`}>
            {successMsg}
          </Text>
        ) : null}

        {/* DL Number */}
        <TextInput
          placeholder="Driving License Number"
          value={dlNumber}
          onChangeText={(text) => {
            setDlNumber(text);
            setErrors({ ...errors, dlNumber: "" });
          }}
          className={`bg-white rounded-xl p-3 mb-1 border ${errors.dlNumber ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.dlNumber && <Text className="text-red-500 mb-2">{errors.dlNumber}</Text>}

        {/* Aadhar */}
        <TextInput
          placeholder="Aadhar Number"
          value={aadharNumber}
          onChangeText={(text) => {
            setAadharNumber(text);
            setErrors({ ...errors, aadharNumber: "" });
          }}
          keyboardType="numeric"
          className={`bg-white rounded-xl p-3 mb-1 border ${errors.aadharNumber ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.aadharNumber && <Text className="text-red-500 mb-2">{errors.aadharNumber}</Text>}

        {/* DOB */}
        <TextInput
          placeholder="Date of Birth (YYYY-MM-DD)"
          value={dob}
          onChangeText={(text) => {
            setDob(text);
            setErrors({ ...errors, dob: "" });
          }}
          className={`bg-white rounded-xl p-3 mb-1 border ${errors.dob ? "border-red-500" : "border-gray-300"}`}
        />
        {errors.dob && <Text className="text-red-500 mb-2">{errors.dob}</Text>}

        {/* Button */}
        <TouchableOpacity
          onPress={addDocument}
          className="bg-green-600 py-4 rounded-xl items-center mt-2"
        >
          <Text className="text-white font-semibold text-lg">📑 Save Document</Text>
        </TouchableOpacity>
      </View>

      {/* List of Documents */}
      <FlatList
        data={documents}
        keyExtractor={(item, index) => index.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View className="bg-white p-4 rounded-2xl mb-4 shadow-md">
            <Text className="text-lg font-bold text-gray-800">DL: {item.dlNumber}</Text>
            <Text className="text-gray-600">Aadhar: {item.aadharNumber}</Text>
            <Text className="text-gray-600">DOB: {item.dob}</Text>
          </View>
        )}
      />
    </View>
  );
}

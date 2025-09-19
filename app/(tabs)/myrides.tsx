import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { useAuth } from "@clerk/clerk-expo"; // or replace with your auth system

export default function MyRidesPage() {
  const { userId } = useAuth(); // 👤 get logged-in user ID
  const [rides, setRides] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchRides = async () => {
      try {
        const res = await fetch(`http://localhost:5000/api/rides?userId=${userId}`);
        const data = await res.json();
        setRides(data);
      } catch (err) {
        console.error("Error fetching rides:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchRides();
  }, [userId]);

  if (loading) {
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" />
        <Text>Loading your rides...</Text>
      </View>
    );
  }

  if (rides.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={styles.noRidesTitle}>No rides found 🚗</Text>
        <Text>You haven’t created or joined any rides yet.</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.title}>My Rides</Text>
      <FlatList
        data={rides}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <Text style={styles.rideTitle}>
              {item.source} ➝ {item.destination}
            </Text>
            <Text>Date: {item.date}</Text>
            <Text>Driver: {item.driverName}</Text>
            <Text>Seats: {item.availableSeats}</Text>
            <Text>Status: {item.status}</Text>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: "#fff",
  },
  center: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 16,
  },
  card: {
    backgroundColor: "#f8f8f8",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  rideTitle: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 6,
  },
  noRidesTitle: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 6,
  },
});

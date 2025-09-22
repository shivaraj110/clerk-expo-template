// app/Login.tsx
import { ensureJwt } from "@/services/ensureJwt";
import { getClerkInstance, useSignIn } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import useKeyboardState from "../hook/useKeyboardState";

export default function Login() {
  const router = useRouter();
  const [form, setForm] = useState({ email: "", password: "" });

  const { signIn, setActive, isLoaded } = useSignIn();
  const onSignInPress = async () => {
    if (!isLoaded) return;

    // Start the sign-in process using the email and password provided
    try {
      const signInAttempt = await signIn.create({
        identifier: form.email,
        password: form.password,
      });

      // If sign-in process is complete, set the created session as active
      // and redirect the user
      if (signInAttempt.status === "complete") {
        await setActive({ session: signInAttempt.createdSessionId });
        const userId = getClerkInstance().user?.id;
        ensureJwt(userId!, "login");
        router.replace("/");
      } else {
        // If the status isn't complete, check why. User might need to
        // complete further steps.
        console.error(JSON.stringify(signInAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };
  return (
    <View
      className={`flex-1 ${useKeyboardState() ? "justify-center" : "justify-end"}  items-center bg-green-800   w-[100%]`}
    >
      <View className="bg-white rounded-3xl w-full p-6 shadow-lg">
        <Text className="text-2xl font-bold text-center mb-6">Login</Text>

        <TextInput
          placeholder="Email"
          keyboardType="email-address"
          value={form.email}
          onChangeText={(t) => setForm({ ...form, email: t })}
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
        />
        <TextInput
          placeholder="Password"
          secureTextEntry
          value={form.password}
          onChangeText={(t) => setForm({ ...form, password: t })}
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
        />

        <Text className="text-right text-sm text-green-700 mb-4">
          Forgot password?
        </Text>

        <TouchableOpacity
          onPress={onSignInPress}
          className="bg-green-700 py-3 rounded-2xl mb-4"
        >
          <Text className="text-center text-white font-semibold">Login</Text>
        </TouchableOpacity>

        <Text className="text-center text-gray-600 pb-6">
          Don’t have an account?{" "}
          <Text
            className="text-green-700 font-semibold"
            onPress={() => router.push("/(auth)/signup")}
          >
            Create one!
          </Text>
        </Text>
      </View>
    </View>
  );
}

// app/Signup.tsx
import { ensureJwt } from "@/services/ensureJwt";
import { getClerkInstance, useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";
import useKeyboardState from "../hook/useKeyboardState";

export default function Signup() {
  const router = useRouter();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const { isLoaded, signUp, setActive } = useSignUp();

  const [pendingVerification, setPendingVerification] = useState(false);
  const [code, setCode] = useState("");
  const keyBoardState = useKeyboardState();

  // Handle submission of sign-up form
  const onSignUpPress = async () => {
    if (!isLoaded) return;

    // Start sign-up process using email and password provided
    try {
      await signUp.create({
        emailAddress: form.email,
        password: form.password,
        firstName: form.name.split(" ")[0],
        lastName: form.name.split(" ")[1],
      });

      // Send user an email with verification code
      await signUp.prepareEmailAddressVerification({ strategy: "email_code" });

      // Set 'pendingVerification' to true to display second form
      // and capture OTP code
      setPendingVerification(true);
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  // Handle submission of verification form
  const onVerifyPress = async () => {
    if (!isLoaded) return;

    try {
      const signUpAttempt = await signUp.attemptEmailAddressVerification({
        code,
      });

      if (signUpAttempt.status === "complete") {
        console.log("verification complete");

        await setActive({ session: signUpAttempt.createdSessionId });
        const userId = getClerkInstance().user?.id;

        // --- ADDED NULL CHECK ---
        if (userId) {
          await ensureJwt(
            userId,
            "signup",
            form.name.split(" ")[0],
            form.name.split(" ")[1],
          );
        }
        // ------------------------

        router.replace("/home");
      } else {
        console.log(JSON.stringify(signUpAttempt, null, 2));
      }
    } catch (err) {
      // See https://clerk.com/docs/custom-flows/error-handling
      // for more info on error handling
      console.error(JSON.stringify(err, null, 2));
    }
  };

  if (pendingVerification) {
    return (
      <View
        className={`flex-1 ${keyBoardState ? "justify-center" : "justify-end"}  items-center bg-green-800   w-[100%]`}
      >
        <View className="bg-white rounded-3xl w-full p-6 shadow-lg">
          <Text>Verify your email</Text>
          <TextInput
            value={code}
            placeholder="Enter your verification code"
            onChangeText={(code) => setCode(code)}
            textContentType="oneTimeCode"
          />
          <TouchableOpacity
            className="bg-green-600 px-2 p-1"
            onPress={onVerifyPress}
          >
            <Text>Verify</Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View
      className={`flex-1 ${keyBoardState ? "justify-center" : "justify-end"}  items-center bg-green-800   w-[100%]`}
    >
      <View className="bg-white rounded-3xl w-full p-6 shadow-lg">
        <Text className="text-2xl font-bold text-center mb-6">
          Create Your Account
        </Text>

        <TextInput
          placeholder="Full Name"
          value={form.name}
          onChangeText={(t) => setForm({ ...form, name: t })}
          className="border border-gray-300 rounded-xl px-4 py-3 mb-3"
        />
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

        <TouchableOpacity
          className="bg-green-700 py-3 rounded-2xl mb-4"
          onPress={onSignUpPress}
        >
          <Text className="text-center text-white font-semibold">Sign Up</Text>
        </TouchableOpacity>

        <Text className="text-center pb-6 text-gray-600">
          Already have an account?{" "}
          <Text
            className="text-green-700 font-semibold"
            onPress={() => router.push("/(auth)/login")}
          >
            Log in
          </Text>
        </Text>
      </View>
    </View>
  );
}

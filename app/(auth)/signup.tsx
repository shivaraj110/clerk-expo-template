// app/Signup.tsx
import { useSignUp } from "@clerk/clerk-expo";
import { useRouter } from "expo-router";
import { useState } from "react";
import { Text, TextInput, TouchableOpacity, View } from "react-native";

export default function Signup() {
	const router = useRouter();
	const [form, setForm] = useState({
		name: "",
		email: "",
		password: "",
		phone: "",
	});

	const { isLoaded, signUp, setActive } = useSignUp();

	const [pendingVerification, setPendingVerification] = useState(false);
	const [code, setCode] = useState("");

	// Handle submission of sign-up form
	const onSignUpPress = async () => {
		if (!isLoaded) return;

		// Start sign-up process using email and password provided
		try {
			await signUp.create({
				emailAddress: form.email,
				password: form.password,
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
			// Use the code the user provided to attempt verification
			const signUpAttempt = await signUp.attemptEmailAddressVerification({
				code,
			});

			// If verification was completed, set the session to active
			// and redirect the user
			if (signUpAttempt.status === "complete") {
				await setActive({ session: signUpAttempt.createdSessionId });
				router.replace("/");
			} else {
				// If the status is not complete, check why. User may need to
				// complete further steps.
				console.error(JSON.stringify(signUpAttempt, null, 2));
			}
		} catch (err) {
			// See https://clerk.com/docs/custom-flows/error-handling
			// for more info on error handling
			console.error(JSON.stringify(err, null, 2));
		}
	};

	if (pendingVerification) {
		return (
			<>
				<Text>Verify your email</Text>
				<TextInput
					value={code}
					placeholder="Enter your verification code"
					onChangeText={(code) => setCode(code)}
				/>
				<TouchableOpacity onPress={onVerifyPress}>
					<Text>Verify</Text>
				</TouchableOpacity>
			</>
		);
	}

	return (
		<View className="flex-1 bg-teal-800 justify-end items-center  w-[100%]">
			<View className="bg-white rounded-3xl w-full p-6 shadow-lg">
				<Text className="text-2xl font-bold text-center mb-6">
					Create Your Account
				</Text>

		
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
					className="bg-teal-700 py-3 rounded-2xl mb-4"
					onPress={onSignUpPress}
				>
					<Text className="text-center text-white font-semibold">Sign Up</Text>
				</TouchableOpacity>

				<Text className="text-center text-gray-600">
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

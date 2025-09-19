// app/Onboarding.tsx
import { Link, useRouter } from "expo-router";
import { Text, TouchableOpacity, View } from "react-native";
import "../../global.css";
import { SignedIn, SignedOut, useUser } from "@clerk/clerk-expo";
import { SignOutButton } from "../components/SigninButton";

export default function Onboarding() {
	const router = useRouter();

	const { user } = useUser();
	return (
		<View className="flex justify-center items-center h-[100%]">
			<SignedIn>
				<Text>Hello {user?.emailAddresses[0].emailAddress}</Text>
				<Link href={"/home"} className="text-green-400">Home</Link>
				<SignOutButton />
			</SignedIn>
			<SignedOut>
				<View className="flex-1 bg-green-800 justify-end items-center w-[100%] pb-32">
					<Text className="text-4xl font-bold text-white mb-4">
						waylink.<Text className="text-yellow-400">go</Text>
					</Text>
					<Text className="text-white text-center mb-8">
						Welcome to waylink! Connect though ways!
					</Text>
					<TouchableOpacity
						className="bg-white w-4/5 py-3 rounded-2xl mb-4"
						onPress={() => router.push("/(auth)/login")}
					>
						<Text className="text-center font-semibold  text-green-800">
							Login
						</Text>
					</TouchableOpacity>
					<TouchableOpacity
						className="bg-gray-100 w-4/5 py-3 rounded-2xl"
						onPress={() => router.push("/(auth)/signup")}
					>
						<Text className="text-center font-semibold text-green-800">
							Get Started
						</Text>
					</TouchableOpacity>
				</View>
			</SignedOut>
		</View>
	);
}

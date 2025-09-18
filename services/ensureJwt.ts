import * as SecureStore from "expo-secure-store";
import { endpoint, getJwt } from "./jwt";
export const ensureJwt = async (userId: string,endPoint:endpoint,firstName?:string,lastName?:string) => {
  try {
    // Check if user exists and has an ID
    if (!userId) {
      console.log("User not available yet");
      return;
    }

    // Check if JWT exists in SecureStore
    const existingJwt = await SecureStore.getItemAsync("jwtToken");

    if (existingJwt) {
      console.log("JWT is present in SecureStore");
      console.log(existingJwt);
    } else {
      console.log("No JWT found, fetching new one...");

      // Get new JWT
      const newJwt = await getJwt(userId,
        endPoint,firstName,lastName
      );

      if (newJwt) {
        console.log("New JWT received:", newJwt);
        await SecureStore.setItemAsync("jwtToken", newJwt);
        console.log("JWT stored in SecureStore");
      } else {
        console.log("Failed to get JWT");
      }
    }
  } catch (err) {
    console.log("Error handling JWT:", err);
  }
};

import axios from "axios";

export const getJwt = async (userId: string): Promise<string | null> => {
  console.log("trying to get jwt for userId:", userId);

  try {
    const response = await axios.post(
      "http://192.168.1.40:3000/api/v1/user/login",
      {
        userId,
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      },
    );

    console.log("JWT received:", response.data.token);
    return response.data.token;
  } catch (err: any) {
    console.error(
      "Error getting JWT:",
      err.response?.data?.message || err.message,
    );
    return null;
  }
};

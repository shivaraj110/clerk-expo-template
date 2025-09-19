import axios from "axios";
export type endpoint = "login" | "signup";
export const getJwt = async (userId: string,endPoint:endpoint,firstName?:string,lastName?:string): Promise<string | null> => {
  console.log("trying to get jwt for userId:", userId);

  try {
    let response;
   if (endPoint !=="signup")
   {
  response = await axios.post(
      "http://192.168.1.40:3000/api/v1/user/"+endPoint,
      {
        userId,
      },
      {
        headers: {

          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      },
    )
   }else{
    response = await axios.post(
      "http://192.168.1.40:3000/api/v1/user/"+endPoint,
      {
        userId,
        name:firstName + " " + lastName
      },
      {
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 10000, // 10 second timeout
      },
    )
   }
//@ts-ignore
    console.log("JWT received:", response.data.token);
//@ts-ignore

    return response.data.token;
  } catch (err: any) {
    console.error(
      "Error getting JWT:",
      err.response?.data?.message || err.message,
    );
    return null;
  }
};

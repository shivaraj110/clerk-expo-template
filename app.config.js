// app.config.js
import 'dotenv/config';

export default {
  expo: {
    name: "RideApp",
    slug: "ride-app",
    version: "1.0.0",
    extra: {
      googleMapsApiKey: process.env.AIzaSyAkp7D79KD4uSeoiWUgkPazNgzBEMMLsio,
    },
    "plugins": [
    "expo-maps"
  ]
  },
};
